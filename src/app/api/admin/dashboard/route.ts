/**
 * GET /api/admin/dashboard — lightweight aggregation for the admin dashboard.
 * Runs COUNT-only queries (`head: true`, no rows returned) for every relevant table in PARALLEL,
 * plus a couple of small "recent" lists (limit 5). Missing tables degrade to `null` (no crash).
 * Minimal payload; no expensive scans. Admin-guarded (HMAC session).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthed } from "@/lib/adminAuth";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Tables to count → the key returned in `counts`.
const COUNT_TABLES: Record<string, string> = {
  courses: "courses",
  enrollments: "enrollments",
  blog_posts: "blogPosts",
  page_content: "pages",
  leads: "leads",
  inquiries: "inquiries",
  jobs: "jobs",
  job_applications: "jobApplications",
  internships: "internships",
  internship_applications: "internshipApplications",
  unlock_codes: "vouchers",
  testimonials: "testimonials",
  case_studies: "caseStudies",
  clients: "clients",
  team: "team",
  course_categories: "categories",
};

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const client = getAdminClient();
  if (!client) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const entries = Object.entries(COUNT_TABLES);
  const countResults = await Promise.all(
    entries.map(async ([table, key]) => {
      try {
        const { count, error } = await client.from(table).select("*", { count: "exact", head: true });
        return [key, error ? null : (count ?? 0)] as const;
      } catch {
        return [key, null] as const;
      }
    })
  );
  const counts: Record<string, number | null> = Object.fromEntries(countResults);

  // small recent lists (guarded)
  const safeList = async (table: string, cols: string) => {
    try {
      const { data, error } = await client.from(table).select(cols).order("created_at", { ascending: false }).limit(5);
      return error ? [] : (data ?? []);
    } catch { return []; }
  };
  const [recentLeads, recentEnrollments] = await Promise.all([
    safeList("leads", "id, name, email, created_at"),
    safeList("enrollments", "id, user_id, course_slug, created_at"),
  ]);

  // Fetch access codes for utilization stats
  let accessCodeStats = { total: 0, totalSeats: 0, seatsUsed: 0, utilizationRate: 0 };
  try {
    const { data: codeData } = await client.from("unlock_codes").select("seats, seats_used, max_uses, used_count");
    if (codeData && codeData.length > 0) {
      let totalSeats = 0;
      let seatsUsed = 0;
      for (const c of codeData) {
        totalSeats += c.seats !== null ? c.seats : (c.max_uses || 1);
        seatsUsed += c.seats_used !== null ? c.seats_used : (c.used_count || 0);
      }
      accessCodeStats = {
        total: codeData.length,
        totalSeats,
        seatsUsed,
        utilizationRate: totalSeats > 0 ? Math.round((seatsUsed / totalSeats) * 100) : 0
      };
    }
  } catch (err) {
    console.error("Dashboard failed to compute access codes utilization:", err);
  }

  return NextResponse.json(
    { counts, recentLeads, recentEnrollments, accessCodeStats, generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "private, max-age=30" } }
  );
}
