import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";
import { logAudit } from "@/lib/admin/auditLog";

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

const SORTABLE = ["created_at", "amount", "status"];

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const sp = new URL(req.url).searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") || "10", 10) || 10));
  const status = sp.get("status") || "";
  const sort = SORTABLE.includes(sp.get("sort") || "") ? (sp.get("sort") as string) : "created_at";
  const ascending = (sp.get("dir") || "desc") === "asc";

  // Joined by course_slug (present since the original schema) rather than the newer course_id FK,
  // which isn't guaranteed to be applied in every environment yet — see CLAUDE.md's DB-consolidation note.
  let query = db.from("orders").select("*, profiles(name, organization)", { count: "exact" });
  if (status) query = query.eq("status", status);
  query = query.order(sort, { ascending }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const slugs = [...new Set((data ?? []).map((o: any) => o.course_slug).filter(Boolean))];
  const { data: courseRows } = slugs.length ? await db.from("courses").select("slug, title").in("slug", slugs) : { data: [] };
  const titleBySlug: Record<string, string> = {};
  (courseRows ?? []).forEach((c: any) => { titleBySlug[c.slug] = c.title; });

  const orders = (data ?? []).map((o: any) => ({
    ...o,
    student_name: o.profiles?.name ?? "—",
    organization: o.profiles?.organization ?? "",
    course_title: titleBySlug[o.course_slug] ?? o.course_slug,
  }));
  return NextResponse.json({ orders, total: count ?? orders.length });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  if (!["pending", "paid", "failed", "cancelled", "refunded"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const { data, error } = await db.from("orders").update({ status }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(db, { action: `status:${status}`, entity_type: "order", entity_id: id });
  return NextResponse.json({ order: data });
}
