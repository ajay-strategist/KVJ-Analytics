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

const SORTABLE = ["name", "organization", "created_at"];

/** Read-only roster: profiles with role=student, plus their enrollment/test-attempt counts. */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const sp = new URL(req.url).searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") || "10", 10) || 10));
  const q = (sp.get("q") || "").trim().replace(/[%,()]/g, "");
  const sort = SORTABLE.includes(sp.get("sort") || "") ? (sp.get("sort") as string) : "created_at";
  const ascending = (sp.get("dir") || "desc") === "asc";

  let query = db.from("profiles").select("*, enrollments(count)", { count: "exact" }).eq("role", "student");
  // Search only base-schema columns — `full_name`/`account_type` come from the training_platform
  // migration, which may not be applied in every environment.
  if (q) query = query.or(`name.ilike.%${q}%,organization.ilike.%${q}%,phone.ilike.%${q}%`);
  query = query.order(sort, { ascending }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const students = (data ?? []).map((s: any) => ({
    ...s,
    enrollment_count: Array.isArray(s.enrollments) ? (s.enrollments[0]?.count ?? 0) : 0,
  }));
  return NextResponse.json({ students, total: count ?? students.length });
}
