import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, verifyAndEnsureStudentEnrollment } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
  }

  // 1. Get access token from Authorization header or cookie (Bearer has priority)
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;
  const cookieToken = req.cookies.get("sb-access-token")?.value?.trim() || null;

  const primaryToken = bearerToken || cookieToken;
  if (!primaryToken) {
    return NextResponse.json(
      { error: "Access denied. Please sign in to your student account." },
      { status: 401 }
    );
  }

  // 2. Validate token with fallback if both are available
  let { data: { user }, error: authError } = await db.auth.getUser(primaryToken);

  // If primary token failed (e.g. expired) and alternate token exists, try alternate
  if ((authError || !user) && bearerToken && cookieToken && bearerToken !== cookieToken) {
    const alternateToken = primaryToken === bearerToken ? cookieToken : bearerToken;
    const fallback = await db.auth.getUser(alternateToken);
    if (!fallback.error && fallback.data.user) {
      user = fallback.data.user;
      authError = null;
    }
  }

  if (authError || !user) {
    return NextResponse.json(
      { error: "Access denied. Invalid or expired student session." },
      { status: 401 }
    );
  }

  try {
    const { lessonId, score, maxScore, courseSlug, passed } = await req.json();

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
      const isEnrolled = await verifyAndEnsureStudentEnrollment(db, user.id, courseSlug || "");

      if (!isEnrolled) {
        return NextResponse.json(
          { error: "Access denied. You must be enrolled in this course to save results." },
          { status: 403 }
        );
      }
    }

    const scorePercent = maxScore > 0 ? Number(((score / maxScore) * 100).toFixed(2)) : 0;

    // 4. Upsert activity result
    const { data, error } = await db
      .from("activity_results")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        course_slug: courseSlug,
        score,
        max_score: maxScore,
        score_percent: scorePercent,
        passed: passed !== false,
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
