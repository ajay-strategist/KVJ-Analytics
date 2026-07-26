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

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
function notConfigured() {
  return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  try {
    const body = await req.json();
    const { data, error } = await db.from("lessons").insert([body]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lesson: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });

    const { data, error } = await db
      .from("lessons")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lesson: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });

    const { error } = await db.from("lessons").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}
