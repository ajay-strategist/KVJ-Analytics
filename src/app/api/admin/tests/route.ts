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

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  const url = new URL(req.url);
  const courseId = url.searchParams.get("course_id");
  const lessonId = url.searchParams.get("lesson_id");
  const testId = url.searchParams.get("id");

  try {
    let query = db.from("mock_tests").select("*");
    if (testId) {
      query = query.eq("id", testId);
    } else if (lessonId) {
      query = query.eq("lesson_id", lessonId);
    } else if (courseId) {
      query = query.eq("course_id", courseId);
    } else {
      return NextResponse.json({ error: "course_id, lesson_id, or id query param is required" }, { status: 400 });
    }

    const { data, error } = await query
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ mock_tests: data });
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

    // If lesson_id is specified, check if a mock_test already exists for this lesson to prevent duplicates
    if (body.lesson_id) {
      const { data: existing } = await db
        .from("mock_tests")
        .select("*")
        .eq("lesson_id", body.lesson_id)
        .maybeSingle();

      if (existing) {
        const { id: _, ...updates } = body;
        const { data: updated, error: updateErr } = await db
          .from("mock_tests")
          .update(updates)
          .eq("id", existing.id)
          .select()
          .single();

        if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });
        return NextResponse.json({ mock_test: updated });
      }
    }

    const { data, error } = await db.from("mock_tests").insert([body]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ mock_test: data });
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
    if (!id) return NextResponse.json({ error: "Test ID is required" }, { status: 400 });

    const { data, error } = await db
      .from("mock_tests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ mock_test: data });
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
    if (!id) return NextResponse.json({ error: "Test ID is required" }, { status: 400 });

    const { error } = await db.from("mock_tests").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}
