import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const { data: forms, error } = await db
      .from("registration_forms")
      .select("*, course:courses(id, slug, title)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch registration forms:", error);
      return NextResponse.json({ forms: [] });
    }

    return NextResponse.json({ forms: forms || [] });
  } catch (error: any) {
    console.error("GET /api/admin/registration-forms error:", error);
    return NextResponse.json({ forms: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await req.json();
    const { name, course_id, html_content } = body;

    if (!name || !html_content) {
      return NextResponse.json({ error: "Form name and HTML content are required." }, { status: 400 });
    }

    const payload = {
      name,
      course_id: course_id || null,
      html_content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error } = await db
      .from("registration_forms")
      .insert([payload])
      .select()
      .single();

    if (error || !inserted) {
      console.error("Failed to insert registration form:", error);
      const detailedErr = error?.message || error?.details || "Failed to save registration form";
      return NextResponse.json({ error: detailedErr }, { status: 500 });
    }

    return NextResponse.json({ success: true, form: inserted });
  } catch (error: any) {
    console.error("POST /api/admin/registration-forms error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
