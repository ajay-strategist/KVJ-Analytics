import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  const db = getAdmin();
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

  // 2. Validate token
  const { data: { user }, error: authError } = await db.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json(
      { error: "Access denied. Invalid or expired student session." },
      { status: 401 }
    );
  }

  try {
    const { lessonId, score, maxScore, courseSlug } = await req.json();

    if (!lessonId || score === undefined || maxScore === undefined || !courseSlug) {
      return NextResponse.json(
        { error: "Missing required fields (lessonId, score, maxScore, courseSlug)." },
        { status: 400 }
      );
    }

    // 3. Optional: Verify enrollment in this course slug
    const { data: profile } = await db
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";

    if (!isAdmin) {
      const { data: enrollment, error: enrollError } = await db
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", courseSlug)
        .eq("status", "active")
        .maybeSingle();

      if (enrollError || !enrollment) {
        return NextResponse.json(
          { error: "Access denied. You must be enrolled in this course to save results." },
          { status: 403 }
        );
      }
    }

    // 4. Upsert activity result
    const { data, error } = await db
      .from("activity_results")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        course_slug: courseSlug,
        score,
        max_score: maxScore,
        submitted_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,lesson_id"
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, result: data });
  } catch (err: any) {
    console.error("Scoring submission API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process score submission." },
      { status: 500 }
    );
  }
}
