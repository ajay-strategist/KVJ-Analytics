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
function unauthorized() { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
function notConfigured() { return NextResponse.json({ error: "Supabase not configured." }, { status: 500 }); }

const SORTABLE = ["name", "email", "role", "status", "created_at"];

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  const sp = new URL(req.url).searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") || "10", 10) || 10));
  const q = (sp.get("q") || "").trim().replace(/[%,()]/g, "");
  const sort = SORTABLE.includes(sp.get("sort") || "") ? (sp.get("sort") as string) : "created_at";
  const ascending = (sp.get("dir") || "desc") === "asc";

  let query = db.from("admin_users").select("*", { count: "exact" });
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
  query = query.order(sort, { ascending }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data ?? [], total: count ?? (data?.length ?? 0) });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();
  const body = await req.json();
  if (!body.name || !body.email) return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  const { data, error } = await db.from("admin_users").insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(db, { action: "created", entity_type: "admin_user", entity_id: data.id, meta: { email: data.email, role: data.role } });
  return NextResponse.json({ user: data });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();
  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const { data, error } = await db.from("admin_users").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(db, { action: "updated", entity_type: "admin_user", entity_id: id, meta: updates });
  return NextResponse.json({ user: data });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const { error } = await db.from("admin_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(db, { action: "deleted", entity_type: "admin_user", entity_id: id });
  return NextResponse.json({ success: true });
}
