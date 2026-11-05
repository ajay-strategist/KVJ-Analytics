import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, verifyAndEnsureStudentEnrollment } from "@/lib/supabaseAdmin";
import { adminToken } from "@/lib/adminAuth";
import { authenticateStudentRequest, getAuthorizedStudentRole } from "@/lib/sessionAuth";
import { cacheGet, cacheSet } from "@/shared/cache/redis";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    const db = getAdminClient();

    if (!db) {
      return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
    }

    // 1. Check admin preview cookie
    const adminSession = req.cookies.get("admin_session")?.value;
    const isExplicitPreview = req.nextUrl.searchParams.get("preview") === "1" || req.nextUrl.searchParams.get("preview") === "true";
    const isAdminPreview = (adminSession === adminToken()) && isExplicitPreview;

    let user: { id: string } | null = null;

    if (!isAdminPreview) {
      // 2. Authenticate student session (fast-path local JWT verification)
      const auth = await authenticateStudentRequest(req);
      if (!auth.success) {
        return NextResponse.json(
          { error: auth.error },
          { status: auth.status }
        );
      }
      user = auth.user;
    }

    // 3. Fetch lesson content (with distributed cache, 300s TTL)
    const cacheKey = `lesson_data:${lessonId}`;
    let cachedLesson = await cacheGet<{
      id: string;
      title: string;
      kind: string;
      content_html: string | null;
      courseSlug: string | null;
    }>(cacheKey);

    if (!cachedLesson) {
      const { data: lesson, error: lessonError } = await db
        .from("lessons")
        .select(`
          id,
          title,
          kind,
          content_html,
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

      if (lessonError || !lesson) {
        return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
      }

      const lessonRecord = lesson as unknown as { modules?: { courses?: { slug?: string } } };
      const derivedCourseSlug = lessonRecord?.modules?.courses?.slug || null;

      cachedLesson = {
        id: lesson.id,
        title: lesson.title,
        kind: lesson.kind,
        content_html: lesson.content_html,
        courseSlug: derivedCourseSlug,
      };

      await cacheSet(cacheKey, cachedLesson, 300); // 5 minutes TTL
    }

    // 4. Verify enrollment if not admin preview (fail-closed, authoritative course slug)
    if (!isAdminPreview && user) {
      const role = await getAuthorizedStudentRole(db, user.id);
      const isAdmin = role === "admin";

      if (!isAdmin) {
        const authoritativeCourseSlug = cachedLesson.courseSlug;
        if (!authoritativeCourseSlug) {
          return NextResponse.json(
            { error: "Access denied. Lesson is not associated with an active course enrollment." },
            { status: 403 }
          );
        }

        const isEnrolled = await verifyAndEnsureStudentEnrollment(db, user.id, authoritativeCourseSlug);
        if (!isEnrolled) {
          return NextResponse.json(
            { error: "Access denied. You must be enrolled in the course to view this lesson." },
            { status: 403 }
          );
        }
      }
    }

    // 5. Return sanitized lesson content with private cache header
    return NextResponse.json(
      {
        id: cachedLesson.id,
        content_html: cachedLesson.content_html || null,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error: unknown) {
    console.error("GET lesson content error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
