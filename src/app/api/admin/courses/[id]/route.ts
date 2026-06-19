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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  const { id } = await params;

  // 1. Fetch course
  const { data: course, error: courseError } = await db
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (courseError) {
    return NextResponse.json({ error: courseError.message }, { status: 500 });
  }
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // 2. Fetch modules
  const { data: modules, error: modulesError } = await db
    .from("modules")
    .select("*")
    .eq("course_id", id)
    .order("display_order", { ascending: true });

  if (modulesError) {
    return NextResponse.json({ error: modulesError.message }, { status: 500 });
  }

  // 3. Fetch lessons
  let lessons: any[] = [];
  if (modules && modules.length > 0) {
    const moduleIds = modules.map((m) => m.id);
    const { data: lessonsData, error: lessonsError } = await db
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("display_order", { ascending: true });

    if (lessonsError) {
      return NextResponse.json({ error: lessonsError.message }, { status: 500 });
    }
    lessons = lessonsData || [];
  }

  // Assemble modules with lessons
  const modulesWithLessons = modules.map((mod) => ({
    ...mod,
    lessons: lessons.filter((les) => les.module_id === mod.id),
  }));

  return NextResponse.json({
    course,
    curriculum: modulesWithLessons,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  const { id } = await params;
  try {
    const body = await req.json();
    const { data, error } = await db
      .from("courses")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ course: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  const { id } = await params;
  const { error } = await db.from("courses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
