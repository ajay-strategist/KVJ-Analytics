import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === adminToken();
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 500 }
    );
  }

  try {
    // 1. Fetch all enrollments with student profile detail columns
    const { data: enrollments, error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .select(`
        id,
        course_slug,
        enrollment_method,
        status,
        created_at,
        profiles (
          name,
          organization,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (enrollError) throw enrollError;

    // 2. Fetch mock test attempts with student name and organization
    const { data: attempts, error: attemptError } = await supabaseAdmin
      .from("test_attempts")
      .select(`
        id,
        test_slug,
        score,
        passed,
        started_at,
        submitted_at,
        profiles (
          name,
          organization
        )
      `)
      .order("submitted_at", { ascending: false });

    if (attemptError) throw attemptError;

    // 3. Fetch paid orders with student profile names
    const { data: orders, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        course_slug,
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        status,
        created_at,
        profiles (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (orderError) throw orderError;

    // 4. Fetch activity (practice) scores with student name + lesson title
    const { data: activityResults, error: activityError } = await supabaseAdmin
      .from("activity_results")
      .select(`
        id,
        score,
        max_score,
        course_slug,
        submitted_at,
        profiles ( name, organization ),
        lessons ( title )
      `)
      .order("submitted_at", { ascending: false });

    if (activityError) throw activityError;

    return NextResponse.json({ enrollments, attempts, orders, activityResults: activityResults || [] });
  } catch (error: any) {
    console.error("Failed to fetch admin learning records:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** POST: Manually enroll a student by email into a course */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const { user_email, course_slug, enrollment_method } = await req.json();

    if (!user_email || !course_slug) {
      return NextResponse.json(
        { error: "Student email and course slug are required." },
        { status: 400 }
      );
    }

    // 1. Find user by email
    const { data: usersPage, error: userErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (userErr) throw userErr;

    const matchedUser = usersPage?.users?.find(
      (u: any) => u.email?.toLowerCase() === user_email.toLowerCase().trim()
    );

    if (!matchedUser) {
      return NextResponse.json(
        { error: `No student account found with email: ${user_email}` },
        { status: 404 }
      );
    }

    // 2. Verify course exists
    const { data: course, error: courseErr } = await supabaseAdmin
      .from("courses")
      .select("id, title, slug")
      .eq("slug", course_slug.trim())
      .maybeSingle();

    if (courseErr || !course) {
      return NextResponse.json(
        { error: `Course "${course_slug}" not found.` },
        { status: 404 }
      );
    }

    // 3. Upsert enrollment
    const { data: enrollment, error: enrollErr } = await supabaseAdmin
      .from("enrollments")
      .upsert(
        {
          user_id: matchedUser.id,
          course_slug: course.slug,
          enrollment_method: enrollment_method || "admin_manual",
          status: "active",
        },
        { onConflict: "user_id,course_slug" }
      )
      .select("id")
      .maybeSingle();

    if (enrollErr) throw enrollErr;

    // 4. Audit log
    try {
      await supabaseAdmin.from("audit_logs").insert([{
        actor: "admin",
        action: "manual_enroll",
        entity_type: "enrollments",
        entity_id: enrollment?.id,
        meta: { user_email, course_slug, user_id: matchedUser.id },
      }]);
    } catch (_) { /* non-fatal */ }

    return NextResponse.json({
      success: true,
      message: `${matchedUser.email} enrolled in "${course.title}" successfully.`,
    });
  } catch (error: any) {
    console.error("Manual enrollment error:", error);
    return NextResponse.json({ error: error.message || "Failed to create enrollment." }, { status: 500 });
  }
}

/** DELETE: Remove an enrollment by id */
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const { enrollment_id } = await req.json();
    if (!enrollment_id) {
      return NextResponse.json({ error: "enrollment_id is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("enrollments")
      .delete()
      .eq("id", enrollment_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
