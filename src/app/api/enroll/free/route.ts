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

export async function POST(req: NextRequest) {
  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
  }

  // 1. Get access token from cookie
  const token = req.cookies.get("sb-access-token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Access denied. Please sign in to your student account." },
      { status: 401 }
    );
  }

  // 2. Validate token to get authenticated user
  const { data: { user }, error: authError } = await db.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json(
      { error: "Access denied. Invalid or expired student session." },
      { status: 401 }
    );
  }

  try {
    const { courseSlug } = await req.json();
    if (!courseSlug) {
      return NextResponse.json(
        { error: "Course slug is required." },
        { status: 400 }
      );
    }

    // 3. Fetch course details to verify it is free
    const { data: course, error: courseError } = await db
      .from("courses")
      .select("id, fee_inr, offer_price_inr")
      .eq("slug", courseSlug)
      .maybeSingle();

    if (courseError || !course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const finalPrice = course.offer_price_inr !== null ? course.offer_price_inr : course.fee_inr;
    if (finalPrice > 0) {
      return NextResponse.json(
        { error: "This course is not free. Enrollment requires payment." },
        { status: 400 }
      );
    }

    // 4. Upsert free enrollment
    const { error: enrollError } = await db
      .from("enrollments")
      .upsert(
        {
          user_id: user.id,
          course_slug: courseSlug,
          enrollment_method: "paid",
          status: "active",
        },
        { onConflict: "user_id,course_slug" }
      );

    if (enrollError) {
      console.error("Free enrollment database error:", enrollError);
      return NextResponse.json(
        { error: "Failed to record enrollment in database." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Free enrollment API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
