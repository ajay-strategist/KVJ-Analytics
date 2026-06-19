import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === "authenticated";
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
function notConfigured() {
  return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  const url = new URL(req.url);
  const testId = url.searchParams.get("test_id");
  if (!testId) return NextResponse.json({ error: "test_id query param is required" }, { status: 400 });

  try {
    const { data, error } = await db
      .from("questions")
      .select("*")
      .eq("test_id", testId)
      .order("display_order", { ascending: true })
      .order("id", { ascending: true }); // Fallback sorting just in case

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ questions: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  try {
    const body = await req.json();
    const { data, error } = await db.from("questions").insert([body]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ question: data });
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
    if (!id) return NextResponse.json({ error: "Question ID is required" }, { status: 400 });

    const { data, error } = await db
      .from("questions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ question: data });
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
    if (!id) return NextResponse.json({ error: "Question ID is required" }, { status: 400 });

    const { error } = await db.from("questions").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}
