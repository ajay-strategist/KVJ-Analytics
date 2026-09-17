import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, verifyAndEnsureStudentEnrollment } from "@/lib/supabaseAdmin";
import { adminToken } from "@/lib/adminAuth";

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
      // 2. Authenticate student session
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

      let { data: { user: authUser }, error: authError } = await db.auth.getUser(primaryToken);

      // Fallback if primary token failed but secondary token exists
      if ((authError || !authUser) && bearerToken && cookieToken && bearerToken !== cookieToken) {
        const alternateToken = primaryToken === bearerToken ? cookieToken : bearerToken;
        const fallback = await db.auth.getUser(alternateToken);
        if (!fallback.error && fallback.data.user) {
          authUser = fallback.data.user;
          authError = null;
        }
      }

      if (authError || !authUser) {
        return NextResponse.json(
          { error: "Access denied. Invalid or expired student session." },
          { status: 401 }
        );
      }
      user = authUser;
    }

    // 3. Fetch lesson content and its parent course slug
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

    // Extract course slug from relation or query param fallback
    const lessonRecord = lesson as unknown as { modules?: { courses?: { slug?: string } } };
    const courseSlug = lessonRecord?.modules?.courses?.slug || req.nextUrl.searchParams.get("courseSlug");

    // 4. Verify enrollment if not admin preview
    if (!isAdminPreview && user) {
      const { data: profile } = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const isAdmin = profile?.role === "admin";

      if (!isAdmin && courseSlug) {
        const isEnrolled = await verifyAndEnsureStudentEnrollment(db, user.id, courseSlug);
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
        id: lesson.id,
        content_html: lesson.content_html || null,
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
