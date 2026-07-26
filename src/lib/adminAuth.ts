import crypto from "crypto";
import type { NextRequest } from "next/server";

/**
 * Admin session token.
 *
 * The cookie value is an HMAC derived from a server-only secret, so it cannot be
 * forged by simply setting `admin_session=authenticated` in the browser (which the
 * old static-string check allowed). The secret never leaves the server.
 */
function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.ADMIN_PASSWORD ||
    "kvj-insecure-dev-secret-change-me"
  );
}

export function adminToken(): string {
  return crypto.createHmac("sha256", sessionSecret()).update("kvj-admin-session-v1").digest("hex");
}

/** Constant-time comparison of the request's admin cookie against the expected token. */
export function isAdminAuthed(req: NextRequest): boolean {
  const got = req.cookies.get("admin_session")?.value || "";
  const want = adminToken();
  if (got.length !== want.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(want));
  } catch {
    return false;
  }
}
