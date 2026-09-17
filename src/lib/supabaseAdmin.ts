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

// ── Bounded In-Memory Cache for Student Enrollment Verifications ─────────
// Scoped strictly per-student and per-course to avoid cross-user data leakage.
// Keeps authorization decisions fast during rapid assessment interactions.
const enrollmentCache = new Map<string, { authorized: boolean; timestamp: number }>();
const ENROLLMENT_CACHE_TTL_MS = 60 * 1000; // 60 seconds
const MAX_ENROLLMENT_CACHE_SIZE = 1000;

function getCachedEnrollment(userId: string, slug: string): boolean | null {
  const key = `${userId}:${slug}`;
  const item = enrollmentCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > ENROLLMENT_CACHE_TTL_MS) {
    enrollmentCache.delete(key);
    return null;
  }
  return item.authorized;
}

function setEnrollmentCache(userId: string, slug: string, authorized: boolean) {
  if (enrollmentCache.size >= MAX_ENROLLMENT_CACHE_SIZE) {
    // Evict oldest entry
    const oldestKey = enrollmentCache.keys().next().value;
    if (oldestKey) enrollmentCache.delete(oldestKey);
  }
  enrollmentCache.set(`${userId}:${slug}`, {
    authorized,
    timestamp: Date.now(),
  });
}

/** Invalidate enrollment cache when an enrollment or code redemption occurs */
export function invalidateEnrollmentCache(userId?: string, slug?: string) {
  if (userId && slug) {
    enrollmentCache.delete(`${userId}:${slug}`);
  } else if (userId) {
    for (const key of enrollmentCache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        enrollmentCache.delete(key);
      }
    }
  } else {
    enrollmentCache.clear();
  }
}

/**
 * Checks if a user is actively enrolled in targetSlug, including:
 * 1. Direct active enrollment for targetSlug.
 * 2. Active enrollment for any related course slug (e.g., MIM variants).
 * 3. Fallback: If user has ANY active enrollment or is in an active college batch (batch_students),
 *    automatically auto-enrolls them in targetSlug so they are never locked out of their exam.
 *
 * Consolidated from 4 sequential queries into a single query to the enrollments table.
 */
export async function verifyAndEnsureStudentEnrollment(
  db: SupabaseClient,
  userId: string,
  targetSlug: string
): Promise<boolean> {
  if (!userId || !targetSlug) return false;

  const normalizedSlug = targetSlug.trim().toLowerCase();

  // 1. Fast path: check student-scoped memory cache
  const cachedAuth = getCachedEnrollment(userId, normalizedSlug);
  if (cachedAuth === true) {
    return true;
  }

  // 2. Consolidated query: fetch all active course slugs for this student in ONE database roundtrip
  const { data: userEnrollments, error: enrollError } = await db
    .from("enrollments")
    .select("course_slug")
    .eq("user_id", userId)
    .eq("status", "active");

  if (!enrollError && userEnrollments) {
    const enrolledSlugs = new Set(
      userEnrollments
        .map((e: { course_slug?: string | null }) => (e.course_slug || "").trim().toLowerCase())
        .filter(Boolean)
    );

    // 2a. Direct match
    if (enrolledSlugs.has(normalizedSlug)) {
      setEnrollmentCache(userId, normalizedSlug, true);
      return true;
    }

    // 2b. Related slugs (e.g. power-bi <-> power-bi-mim-business-analytics)
    const related = RELATED_COURSE_SLUGS[normalizedSlug] || [];
    const hasRelated = related.some((r) => enrolledSlugs.has(r));
    if (hasRelated) {
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
      setEnrollmentCache(userId, normalizedSlug, true);
      return true;
    }

    // 2c. If user has ANY active platform enrollment, preserve existing auto-enroll semantics
    if (enrolledSlugs.size > 0) {
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
      setEnrollmentCache(userId, normalizedSlug, true);
      return true;
    }
  }

  // 3. Fallback: only if user has NO active enrollments, check college batch roster (batch_students)
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
    setEnrollmentCache(userId, normalizedSlug, true);
    return true;
  }

  return false;
}

