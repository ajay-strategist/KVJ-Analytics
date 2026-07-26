import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
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

function genCertNumber() {
  const year = new Date().getFullYear();
  return `KVJ-${year}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}
function genVerifyCode() {
  return crypto.randomBytes(5).toString("hex").toUpperCase();
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();
  const { data, error } = await db
    .from("certificates")
    .select("*, profiles(name, full_name)")
    .order("issued_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const certificates = (data ?? []).map((c: any) => ({ ...c, student_name: c.profiles?.full_name || c.profiles?.name || "—" }));
  return NextResponse.json({ certificates });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();
  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();
  const courseSlug = (body.course_slug || "").trim();
  if (!email || !courseSlug) return NextResponse.json({ error: "email and course_slug are required" }, { status: 400 });

  let userId: string | null = null;
  try {
    const { data: auth } = await db.auth.admin.listUsers();
    const match = auth?.users?.find((u: any) => (u.email || "").toLowerCase() === email);
    userId = match?.id ?? null;
  } catch {
    /* mock/dev client without an admin API — fall through to not-found below */
  }
  if (!userId) return NextResponse.json({ error: `No student found with email ${email}.` }, { status: 404 });

  const { data, error } = await db.from("certificates").insert([{
    user_id: userId,
    course_slug: courseSlug,
    certificate_number: genCertNumber(),
    verify_code: genVerifyCode(),
    status: "issued",
  }]).select("*, profiles(name, full_name)").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(db, { action: "issued", entity_type: "certificate", entity_id: data.id, meta: { email, course_slug: courseSlug } });
  return NextResponse.json({ certificate: { ...data, student_name: data.profiles?.full_name || data.profiles?.name || "—" } });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();
  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const { data, error } = await db.from("certificates").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(db, { action: updates.status === "revoked" ? "revoked" : "updated", entity_type: "certificate", entity_id: id });
  return NextResponse.json({ certificate: data });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const { error } = await db.from("certificates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(db, { action: "deleted", entity_type: "certificate", entity_id: id });
  return NextResponse.json({ success: true });
}
