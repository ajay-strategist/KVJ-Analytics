import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, verifyAndEnsureStudentEnrollment } from "@/lib/supabaseAdmin";
import { authenticateStudentRequest, getAuthorizedStudentRole } from "@/lib/sessionAuth";
import { cacheGet, cacheSet } from "@/shared/cache/redis";

interface LessonMeta {
  id: string;
  max_score: number | null;
  kind: string;
  course_slug: string | null;
}

async function getCachedLessonMeta(db: any, lessonId: string, fallbackCourseSlug: string): Promise<LessonMeta | null> {
  const cacheKey = `lesson_meta:${lessonId}`;
  const cached = await cacheGet<LessonMeta>(cacheKey);
  if (cached) return cached;

  const { data: lesson, error } = await db
    .from("lessons")
    .select(`
      id,
      max_score,
      kind,
      modules (
        id,
        courses (
          id,
          slug
        )
      )
    `)
    .eq("id", lessonId)
    .maybeSingle();

  if (error || !lesson) return null;

  const lessonRecord = lesson as unknown as { modules?: { courses?: { slug?: string } } };
  const authenticCourseSlug = lessonRecord?.modules?.courses?.slug || fallbackCourseSlug;

  const meta: LessonMeta = {
    id: lesson.id,
    max_score: lesson.max_score !== null && lesson.max_score !== undefined ? Number(lesson.max_score) : null,
    kind: lesson.kind,
    course_slug: authenticCourseSlug,
  };

  await cacheSet(cacheKey, meta, 300); // 5 minutes TTL
  return meta;
}

export async function POST(req: NextRequest) {
  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
  }

  // 1. Authenticate student session (fast-path local JWT verification)
  const auth = await authenticateStudentRequest(req);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const user = auth.user;

  try {
    const { lessonId, score: rawScore, maxScore: rawMaxScore, courseSlug } = await req.json();

    if (!lessonId || rawScore === undefined || !courseSlug) {
      return NextResponse.json(
        { error: "Missing required fields (lessonId, score, courseSlug)." },
        { status: 400 }
      );
    }

    const numScore = Number(rawScore);
    if (isNaN(numScore) || numScore < 0) {
      return NextResponse.json({ error: "Score must be a valid non-negative number." }, { status: 400 });
    }

    // 2. Parallel execution: Fetch lesson metadata (cached) and check existing activity result simultaneously
    const [lessonMeta, existingResultRes] = await Promise.all([
      getCachedLessonMeta(db, lessonId, courseSlug),
      db
        .from("activity_results")
        .select("score, passed")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle(),
    ]);

    if (!lessonMeta) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }

    const authenticCourseSlug = lessonMeta.course_slug || courseSlug;

    const authoritativeMax = lessonMeta.max_score !== null
      ? lessonMeta.max_score
      : (Number(rawMaxScore) > 0 ? Number(rawMaxScore) : 100);

    // Prevent client score inflation beyond authoritative max_score
    const validatedScore = Math.min(numScore, authoritativeMax);
    const scorePercent = authoritativeMax > 0 ? Number(((validatedScore / authoritativeMax) * 100).toFixed(2)) : 100;
    const passed = scorePercent >= 60; // 60% passing threshold for interactive simulations

    // 3. Verify enrollment in this course slug using cached student role & cached enrollment
    const role = await getAuthorizedStudentRole(db, user.id);
    const isAdmin = role === "admin";

    if (!isAdmin) {
      const isEnrolled = await verifyAndEnsureStudentEnrollment(db, user.id, authenticCourseSlug || "");

      if (!isEnrolled) {
        return NextResponse.json(
          { error: "Access denied. You must be enrolled in this course to save results." },
          { status: 403 }
        );
      }
    }

    // Check existing result to prevent score degradation / replay attacks
    const existingResult = existingResultRes?.data;
    const finalScore = existingResult && existingResult.score > validatedScore
      ? existingResult.score
      : validatedScore;
    const finalPassed = existingResult ? (existingResult.passed || passed) : passed;
    const finalScorePercent = authoritativeMax > 0
      ? Number(((finalScore / authoritativeMax) * 100).toFixed(2))
      : 100;

    // 4. Upsert activity result with validated score
    const { data, error } = await db
      .from("activity_results")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        course_slug: authenticCourseSlug,
        score: finalScore,
        max_score: authoritativeMax,
        score_percent: finalScorePercent,
        passed: finalPassed,
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
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
  }

  // 1. Authenticate student session (fast-path local JWT verification)
  const auth = await authenticateStudentRequest(req);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const user = auth.user;

  try {
    const lessonId = req.nextUrl.searchParams.get("lessonId");
    const courseSlug = req.nextUrl.searchParams.get("courseSlug");

    if (lessonId) {
      const { data, error } = await db
        .from("activity_results")
        .select("lesson_id, course_slug, score, max_score, score_percent, passed, submitted_at")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, result: data || null });
    }

    let query = db
      .from("activity_results")
      .select("lesson_id, course_slug, score, max_score, score_percent, passed, submitted_at")
      .eq("user_id", user.id);

    if (courseSlug) {
      query = query.eq("course_slug", courseSlug);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, results: data || [] });
  } catch (err: any) {
    console.error("GET activity result API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
