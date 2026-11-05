import crypto from "crypto";
import type { NextRequest } from "next/server";
import { getAdminClient } from "./supabaseAdmin";
import { cacheGet, cacheSet, cacheDel } from "@/shared/cache/redis";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: Record<string, any>;
}

export type AuthResult =
  | { success: true; user: AuthenticatedUser }
  | { success: false; error: string; status: number };

export type TokenVerificationResult =
  | { status: "valid"; user: AuthenticatedUser; exp?: number }
  | { status: "expired"; error: string }
  | { status: "invalid_signature"; error: string }
  | { status: "invalid_format"; error: string }
  | { status: "unverified"; reason: string };

// In-memory cache for Supabase JWKS (ES256 public keys)
interface CachedJWKS {
  keys: Map<string, crypto.KeyObject>;
  fetchedAt: number;
}

let jwksCache: CachedJWKS | null = null;
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// In-memory token verification cache (TTL: min(60s, token remaining exp))
// Avoids repeated HMAC or GoTrue roundtrips when a student makes multiple concurrent requests
interface CachedTokenVerification {
  user: AuthenticatedUser;
  expiresAt: number;
}
const verifiedTokenCache = new Map<string, CachedTokenVerification>();

function getCachedVerifiedToken(tokenHash: string): AuthenticatedUser | null {
  const cached = verifiedTokenCache.get(tokenHash);
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    verifiedTokenCache.delete(tokenHash);
    return null;
  }
  return cached.user;
}

function setCachedVerifiedToken(tokenHash: string, user: AuthenticatedUser, ttlSeconds: number) {
  if (ttlSeconds <= 0) return;
  if (verifiedTokenCache.size > 2000) {
    const keys = Array.from(verifiedTokenCache.keys()).slice(0, 400);
    for (const k of keys) verifiedTokenCache.delete(k);
  }
  verifiedTokenCache.set(tokenHash, {
    user,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Parses JWT expiry claim without signature verification for cache TTL bounding.
 */
export function parseTokenExpiry(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/**
 * Cached role retriever for authenticated students.
 * Prevents redundant database queries to public.profiles on every lesson navigation.
 * Authoritative: queries public.profiles and caches result for 300s (5 minutes).
 */
export async function getAuthorizedStudentRole(db: any, userId: string): Promise<string> {
  if (!userId) return "student";
  const cacheKey = `user_role:${userId}`;
  const cachedRole = await cacheGet<string>(cacheKey);
  if (cachedRole) {
    return cachedRole;
  }

  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role = profile?.role || "student";
  await cacheSet(cacheKey, role, 300);
  return role;
}

/** Invalidate role cache if an admin changes a student's role */
export async function invalidateStudentRoleCache(userId: string) {
  if (userId) {
    await cacheDel(`user_role:${userId}`);
  }
}

/**
 * Fetches and caches the ES256 public keys from the Supabase project's JWKS endpoint.
 */
async function getPublicKeyForKid(kid?: string): Promise<crypto.KeyObject | null> {
  const supabaseUrl = process.env.SUPABASE_LOCAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) return null;

  const now = Date.now();
  if (!jwksCache || now - jwksCache.fetchedAt > JWKS_CACHE_TTL_MS) {
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/.well-known/jwks.json`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = (await res.json()) as { keys: Array<any> };
        const map = new Map<string, crypto.KeyObject>();
        for (const k of data.keys || []) {
          try {
            if (k.kty === "EC" && k.crv === "P-256") {
              const pubKey = crypto.createPublicKey({ key: k, format: "jwk" });
              if (k.kid) map.set(k.kid, pubKey);
              map.set("default", pubKey);
            }
          } catch {
            // Ignore unparseable individual keys
          }
        }
        jwksCache = { keys: map, fetchedAt: now };
      }
    } catch {
      return null;
    }
  }

  if (!jwksCache) return null;
  if (kid && jwksCache.keys.has(kid)) {
    return jwksCache.keys.get(kid)!;
  }
  return jwksCache.keys.get("default") || null;
}

/**
 * Detailed verification of Supabase JWTs locally.
 * Enforces algorithm allowlisting, signature verification, expiry, and audience.
 */
export async function verifySupabaseTokenDetailed(token: string): Promise<TokenVerificationResult> {
  if (!token || typeof token !== "string") {
    return { status: "invalid_format", error: "Token is empty or non-string." };
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { status: "invalid_format", error: "Malformed JWT segment count." };
  }

  try {
    const headerJson = Buffer.from(parts[0], "base64url").toString("utf8");
    const header = JSON.parse(headerJson) as { alg?: string; kid?: string };
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as {
      sub?: string;
      email?: string;
      exp?: number;
      aud?: string | string[];
      role?: string;
      user_metadata?: Record<string, any>;
      app_metadata?: Record<string, any>;
    };

    // 1. Strict algorithm allowlist (prevents 'none' algorithm and type confusion)
    if (header.alg !== "ES256" && header.alg !== "HS256") {
      return { status: "invalid_format", error: `Unsupported algorithm: ${header.alg}` };
    }

    // 2. Expiration check (with 5-second leeway)
    const nowSecs = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < nowSecs - 5) {
      return { status: "expired", error: "JWT has expired." };
    }

    // 3. Audience check (Supabase access tokens have aud: 'authenticated')
    const aud = payload.aud;
    const isAudValid = Array.isArray(aud) ? aud.includes("authenticated") : aud === "authenticated";
    if (!isAudValid) {
      return { status: "invalid_format", error: "Invalid token audience." };
    }

    // 4. Must have a valid subject (user id)
    if (!payload.sub || typeof payload.sub !== "string") {
      return { status: "invalid_format", error: "Missing subject claim." };
    }

    const data = Buffer.from(`${parts[0]}.${parts[1]}`);
    const signature = Buffer.from(parts[2], "base64url");

    // 5a. ES256 Verification (Asymmetric)
    if (header.alg === "ES256") {
      const publicKey = await getPublicKeyForKid(header.kid);
      if (publicKey) {
        const verified = crypto.verify(
          "SHA256",
          data,
          { key: publicKey, dsaEncoding: "ieee-p1363" },
          signature
        );
        if (verified) {
          return {
            status: "valid",
            exp: payload.exp,
            user: {
              id: payload.sub,
              email: payload.email,
              role: payload.role || payload.app_metadata?.role,
              user_metadata: payload.user_metadata,
            },
          };
        } else {
          return { status: "invalid_signature", error: "Invalid ES256 signature." };
        }
      }
    }

    // 5b. HS256 Verification (Symmetric secret)
    if (header.alg === "HS256") {
      const secret = process.env.SUPABASE_LOCAL_JWT_SECRET || process.env.SUPABASE_JWT_SECRET;
      if (secret) {
        const expectedSig = crypto.createHmac("sha256", secret).update(data).digest();
        if (signature.length === expectedSig.length && crypto.timingSafeEqual(signature, expectedSig)) {
          return {
            status: "valid",
            exp: payload.exp,
            user: {
              id: payload.sub,
              email: payload.email,
              role: payload.role || payload.app_metadata?.role,
              user_metadata: payload.user_metadata,
            },
          };
        } else {
          return { status: "invalid_signature", error: "Invalid HS256 signature." };
        }
      }
    }

    return { status: "unverified", reason: "Signing key not available locally." };
  } catch (err: any) {
    return { status: "invalid_format", error: err?.message || "Failed parsing token." };
  }
}

/**
 * Backward-compatible helper returning AuthenticatedUser or null.
 */
export async function verifySupabaseTokenLocally(token: string): Promise<AuthenticatedUser | null> {
  const result = await verifySupabaseTokenDetailed(token);
  return result.status === "valid" ? result.user : null;
}

/**
 * Unified request authenticator for student routes.
 * 1. Checks Bearer token or sb-access-token cookie.
 * 2. Checks short-lived verified token cache (<0.01ms).
 * 3. Attempts zero-network local cryptographic verification (<0.2ms).
 * 4. Immediately rejects expired or tampered tokens without network waterfalls.
 * 5. Falls back to GoTrue getUser(token) ONLY if keys were unavailable locally,
 *    and caches the verified session for 60 seconds to prevent hammering GoTrue.
 */
export async function authenticateStudentRequest(req: NextRequest): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;
  const cookieToken = req.cookies.get("sb-access-token")?.value?.trim() || null;
  const token = bearerToken || cookieToken;

  if (!token) {
    return {
      success: false,
      error: "Access denied. Please sign in to your student account.",
      status: 401,
    };
  }

  // 1. Fast Cache Check: Sha256 hash lookup in short-lived memory cache (<0.01ms)
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const cachedUser = getCachedVerifiedToken(tokenHash);
  if (cachedUser) {
    return { success: true, user: cachedUser };
  }

  // 2. Fast Path: Local cryptographic verification (<0.2ms, 0 network calls)
  const detailed = await verifySupabaseTokenDetailed(token);

  if (detailed.status === "valid") {
    const nowSecs = Math.floor(Date.now() / 1000);
    const remaining = detailed.exp ? detailed.exp - nowSecs : 60;
    if (remaining <= 0) {
      return { success: false, error: "JWT has expired.", status: 401 };
    }
    setCachedVerifiedToken(tokenHash, detailed.user, Math.min(60, remaining));
    return { success: true, user: detailed.user };
  }

  // If the token is definitively expired, tampered, or malformed, reject immediately!
  // Do NOT make synchronous network calls to GoTrue for known invalid tokens.
  if (
    detailed.status === "expired" ||
    detailed.status === "invalid_signature" ||
    detailed.status === "invalid_format"
  ) {
    return {
      success: false,
      error: detailed.error,
      status: 401,
    };
  }

  // 3. Fallback path: GoTrue network verification (only when local keys could not be resolved)
  const db = getAdminClient();
  if (!db) {
    return { success: false, error: "Database client not configured.", status: 500 };
  }

  try {
    const { data: { user }, error } = await db.auth.getUser(token);
    if (!error && user) {
      const authUser: AuthenticatedUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        user_metadata: user.user_metadata,
      };

      const exp = parseTokenExpiry(token);
      const nowSecs = Math.floor(Date.now() / 1000);
      if (exp && exp <= nowSecs) {
        return { success: false, error: "JWT has expired.", status: 401 };
      }
      const remaining = exp ? exp - nowSecs : 60;
      if (remaining > 0) {
        setCachedVerifiedToken(tokenHash, authUser, Math.min(60, remaining));
      }
      return {
        success: true,
        user: authUser,
      };
    }
  } catch {
    // Fall through to error
  }

  return {
    success: false,
    error: "Invalid or expired student session.",
    status: 401,
  };
}

/**
 * Internal testing helpers for unit tests.
 */
export const _testing = {
  getCachedVerifiedToken,
  setCachedVerifiedToken,
  clearTokenCache: () => verifiedTokenCache.clear(),
  getTokenCacheSize: () => verifiedTokenCache.size,
  getVerifiedTokenRecord: (tokenHash: string) => verifiedTokenCache.get(tokenHash),
};
