import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === adminToken();
}

/**
 * Read-only cross-course list of mock_tests (the "Assessments" module). Editing a test's
 * questions still happens in the course builder (`/admin/courses/[id]`) — this is the
 * platform-wide index the older per-course view didn't have. Mutations reuse `/api/admin/tests`.
 */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const { data, error } = await db
    .from("mock_tests")
    .select("*, courses(title, slug), questions(count)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const assessments = (data ?? []).map((t: any) => ({
    ...t,
    course_title: t.courses?.title ?? "—",
    course_slug: t.courses?.slug ?? null,
    question_count: Array.isArray(t.questions) ? (t.questions[0]?.count ?? 0) : 0,
  }));
  return NextResponse.json({ assessments });
}
