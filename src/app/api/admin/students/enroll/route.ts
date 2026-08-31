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

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  try {
    const { user_id, course_slug, course_id, batch_id } = await req.json();

    if (!user_id || (!course_slug && !course_id)) {
      return NextResponse.json({ error: "Missing required fields: user_id and course details." }, { status: 400 });
    }

    let targetCourseSlug = course_slug;

    if (!targetCourseSlug && course_id) {
      const { data: courseRow } = await db.from("courses").select("slug").eq("id", course_id).single();
      if (courseRow) {
        targetCourseSlug = courseRow.slug;
      }
    }

    if (!targetCourseSlug) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // 1. Create or update enrollment
    const { error: enrollError } = await db.from("enrollments").upsert(
      {
        user_id,
        course_slug: targetCourseSlug,
        status: "active",
        enrollment_method: batch_id ? "college_code" : "admin_manual",
      },
      { onConflict: "user_id,course_slug" }
    );

    if (enrollError) throw enrollError;

    // 2. If batch_id was selected, associate student with the batch
    if (batch_id) {
      const { data: batch } = await db.from("batches").select("college_name").eq("id", batch_id).single();
      const { data: profile } = await db.from("profiles").select("name, email, phone").eq("id", user_id).single();

      if (batch && profile) {
        // Upsert into batch_students
        await db.from("batch_students").upsert(
          {
            batch_id,
            profile_id: user_id,
            name: profile.name,
            email: profile.email || null,
            phone: profile.phone || null,
            status: "JOINED",
          },
          { onConflict: "batch_id,profile_id" }
        );

        // Update profile organization
        await db.from("profiles").update({
          organization: batch.college_name,
          account_type: "college",
        }).eq("id", user_id);
      }
    }

    return NextResponse.json({ success: true, message: `Successfully enrolled in ${targetCourseSlug}` });
  } catch (err: any) {
    console.error("Direct Course Enrollment API Error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred." }, { status: 500 });
  }
}
