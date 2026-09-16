import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { mockSupabaseClient } from "./mockSupabase";

let adminClientInstance: SupabaseClient | null = null;

/**
 * Returns a high-performance, connection-reusing Supabase Admin client singleton.
 * Uses the service-role key to bypass RLS for trusted backend operations.
 */
export function getAdminClient(): SupabaseClient {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || url === "https://placeholder.supabase.co" || key === "placeholder-service-role-key") {
    return mockSupabaseClient as unknown as SupabaseClient;
  }

  adminClientInstance = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "x-application-name": "kvj-analytics-web",
      },
    },
  });

  return adminClientInstance;
}

// ── In-Memory Fast Cache for Active Batch TOTP Secrets ──────────────────────
// Avoids 100 concurrent students hitting the 'batches' table simultaneously
// during peak classroom onboarding.
interface CachedBatches {
  batches: Array<{
    id: string;
    college_name: string;
    course_slug: string;
    totp_secret: string;
    valid_from: string;
    valid_to: string;
    active: boolean;
  }>;
  cachedAt: number;
}

const BATCH_CACHE_TTL_MS = 30 * 1000; // 30 seconds
const batchCache = new Map<string, CachedBatches>();

/**
 * Retrieves active batches for a course slug, using a short 30-second memory cache
 * to handle classroom spikes of 100+ concurrent requests.
 */
export async function getCachedActiveBatches(slug: string, db: SupabaseClient) {
  const now = Date.now();
  const cached = batchCache.get(slug);

  if (cached && (now - cached.cachedAt) < BATCH_CACHE_TTL_MS) {
    return cached.batches;
  }

  const nowISO = new Date().toISOString();
  const { data: activeBatches, error } = await db
    .from("batches")
    .select("id, college_name, course_slug, totp_secret, valid_from, valid_to, active")
    .eq("course_slug", slug)
    .eq("active", true)
    .lte("valid_from", nowISO)
    .gte("valid_to", nowISO);

  if (!error && activeBatches) {
    batchCache.set(slug, {
      batches: activeBatches,
      cachedAt: now,
    });
    return activeBatches;
  }

  return activeBatches || [];
}

/** Invalidate cache if admin creates/updates a batch */
export function invalidateBatchCache(slug?: string) {
  if (slug) {
    batchCache.delete(slug);
  } else {
    batchCache.clear();
  }
}

/**
 * Related course slugs map: allows students enrolled in college or variant editions
 * (e.g. power-bi-mim-business-analytics) to take tests and access modules for the core course (power-bi)
 * and vice-versa.
 */
export const RELATED_COURSE_SLUGS: Record<string, string[]> = {
  "power-bi": ["power-bi-mim-business-analytics"],
  "power-bi-mim-business-analytics": ["power-bi"],
  "python": ["python-mim-business-analytics"],
  "python-mim-business-analytics": ["python"],
};

/**
 * Checks if a user is actively enrolled in targetSlug, including:
 * 1. Direct active enrollment for targetSlug.
 * 2. Active enrollment for any related course slug (e.g., MIM variants).
 * 3. Fallback: If user has ANY active enrollment or is in an active college batch (batch_students),
 *    automatically auto-enrolls them in targetSlug so they are never locked out of their exam.
 */
export async function verifyAndEnsureStudentEnrollment(
  db: SupabaseClient,
  userId: string,
  targetSlug: string
): Promise<boolean> {
  if (!userId || !targetSlug) return false;

  const normalizedSlug = targetSlug.trim().toLowerCase();

  // 1. Direct active enrollment
  const { data: directEnrollment } = await db
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_slug", normalizedSlug)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (directEnrollment) return true;

  // 2. Check related slugs (e.g. power-bi <-> power-bi-mim-business-analytics)
  const related = RELATED_COURSE_SLUGS[normalizedSlug] || [];
  if (related.length > 0) {
    const { data: relatedEnrollment } = await db
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .in("course_slug", related)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (relatedEnrollment) {
      // Auto-upsert enrollment for targetSlug to keep future queries fast
      try {
        await db.from("enrollments").upsert(
          {
            user_id: userId,
            course_slug: normalizedSlug,
            enrollment_method: "college_code",
            status: "active",
          },
          { onConflict: "user_id,course_slug" }
        );
      } catch (e) {
        console.warn("[verifyEnrollment] Auto-upsert related enrollment warning:", e);
      }
      return true;
    }
  }

  // 3. Check if user is on any college batch roster (batch_students)
  const { data: batchStudent } = await db
    .from("batch_students")
    .select("id, batch_id")
    .eq("profile_id", userId)
    .limit(1)
    .maybeSingle();

  if (batchStudent) {
    try {
      await db.from("enrollments").upsert(
        {
          user_id: userId,
          course_slug: normalizedSlug,
          enrollment_method: "college_code",
          status: "active",
        },
        { onConflict: "user_id,course_slug" }
      );
    } catch (e) {
      console.warn("[verifyEnrollment] Auto-upsert batch enrollment warning:", e);
    }
    return true;
  }

  // 4. Check if user has ANY active enrollment in the platform
  const { data: anyEnrollment } = await db
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (anyEnrollment) {
    try {
      await db.from("enrollments").upsert(
        {
          user_id: userId,
          course_slug: normalizedSlug,
          enrollment_method: "college_code",
          status: "active",
        },
        { onConflict: "user_id,course_slug" }
      );
    } catch (e) {
      console.warn("[verifyEnrollment] Auto-upsert active student enrollment warning:", e);
    }
    return true;
  }

  return false;
}

