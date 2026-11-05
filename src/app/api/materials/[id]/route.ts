import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, verifyAndEnsureStudentEnrollment } from "@/lib/supabaseAdmin";
import { adminToken } from "@/lib/adminAuth";
import { authenticateStudentRequest, getAuthorizedStudentRole } from "@/lib/sessionAuth";

async function serveMaterial(material: any) {
  if (material.type === "pdf") {
    if (!material.pdfUrl) {
      return NextResponse.json(
        { error: "PDF file asset link is missing from database." },
        { status: 404 }
      );
    }
    
    try {
      const response = await fetch(material.pdfUrl);
      if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch PDF asset: ${response.statusText}`);
      }
      
      const headers = new Headers();
      headers.set("Content-Type", response.headers.get("content-type") || "application/pdf");
      headers.set(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(material.title)}.pdf"`
      );
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        headers.set("Content-Length", contentLength);
      }
      headers.set("Cache-Control", "private, no-transform, max-age=3600");

      return new NextResponse(response.body as any, {
        status: 200,
        headers,
      });
    } catch (err: any) {
      console.error("Error streaming material file:", err);
      return NextResponse.json(
        { error: "Failed to download material document." },
        { status: 500 }
      );
    }
  }

  if (material.type === "video" || material.type === "link") {
    if (!material.url) {
      return NextResponse.json(
        { error: "Resource destination link is missing." },
        { status: 404 }
      );
    }
    return NextResponse.redirect(material.url);
  }

  // Fallback for other material types
  return NextResponse.json(
    { message: "This content format is read directly on the website dashboard.", material },
    { status: 200 }
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabaseAdmin = getAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase client not configured." },
        { status: 500 }
      );
    }

    // 1. Fetch material info from Supabase lessons
    const { data: lessonRecord } = await supabaseAdmin
      .from("lessons")
      .select("id, title, content_type, resource_url, is_preview, modules(course_slug)")
      .eq("id", id)
      .maybeSingle();

    const courseSlug = (lessonRecord as any)?.modules?.course_slug || (lessonRecord as any)?.modules?.[0]?.course_slug || "";

    const material = lessonRecord
      ? {
          _id: lessonRecord.id,
          title: lessonRecord.title,
          type: lessonRecord.content_type,
          isPreview: lessonRecord.is_preview || false,
          courseSlug: courseSlug,
          url: lessonRecord.resource_url,
          pdfUrl: lessonRecord.resource_url,
        }
      : null;

    if (!material) {
      return NextResponse.json(
        { error: "Study material resource not found." },
        { status: 404 }
      );
    }

    // 2. Unlocked previews or explicit admin preview are accessible without student enrollment
    const adminSession = req.cookies.get("admin_session")?.value;
    const isExplicitPreview = req.nextUrl.searchParams.get("preview") === "1" || req.nextUrl.searchParams.get("preview") === "true";
    const isAdminPreview = (adminSession === adminToken()) && isExplicitPreview;

    if (material.isPreview || isAdminPreview) {
      return serveMaterial(material);
    }

    // 3. Secure Gate: Fast local JWT authentication
    const auth = await authenticateStudentRequest(req);
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error || "Access denied. Please sign in to your student account." },
        { status: auth.status || 401 }
      );
    }
    const user = auth.user;

    // 4. Check if student has admin role (using cached role lookup)
    const role = await getAuthorizedStudentRole(supabaseAdmin, user.id);
    if (role === "admin") {
      return serveMaterial(material);
    }

    // 5. Verify student enrollment status (using cached enrollment lookup)
    const isEnrolled = await verifyAndEnsureStudentEnrollment(supabaseAdmin, user.id, material.courseSlug);
    if (!isEnrolled) {
      return NextResponse.json(
        { error: "Access denied. You must be enrolled in this course to view this resource." },
        { status: 403 }
      );
    }

    return serveMaterial(material);
  } catch (error: any) {
    console.error("General materials router error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
