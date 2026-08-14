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

const TYPE_FILTERS = ["single", "multiple", "truefalse", "fillblank", "dragdrop", "sequence", "matrix", "code", "dragtable"];

/** Read-only cross-course question index. Mutations reuse `/api/admin/questions`. */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const sp = new URL(req.url).searchParams;
  const type = sp.get("type") || "";

  let query = db.from("questions").select("*, mock_tests(title, courses(title))").order("display_order", { ascending: true });
  if (type && TYPE_FILTERS.includes(type)) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const questions = (data ?? []).map((q: any) => ({
    ...q,
    test_title: q.mock_tests?.title ?? "—",
    course_title: q.mock_tests?.courses?.title ?? "—",
  }));
  return NextResponse.json({ questions });
}
