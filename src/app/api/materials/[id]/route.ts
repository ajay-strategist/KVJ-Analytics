import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { client as sanityClient } from "@/sanity/lib/client";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

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
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF asset: ${response.statusText}`);
      }
      
      const fileBuffer = await response.arrayBuffer();
      
      return new NextResponse(Buffer.from(fileBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${encodeURIComponent(
            material.title
          )}.pdf"`,
        },
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

    // 1. Fetch material info from Sanity
    const material = await sanityClient.fetch(
      `*[_type == "material" && _id == $id][0] {
        _id,
        title,
        type,
        isPreview,
        "courseSlug": course->slug.current,
        url,
        "pdfUrl": pdfFile.asset->url
      }`,
      { id }
    );

    if (!material) {
      return NextResponse.json(
        { error: "Study material resource not found." },
        { status: 404 }
      );
    }

    // 2. Unlocked previews are accessible to all visitors
    if (material.isPreview) {
      return serveMaterial(material);
    }

    // 3. Secure Gate: Read cookies for authenticated student session
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Access denied. Please sign in to your student account." },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: "Access denied. Invalid or expired student session." },
        { status: 401 }
      );
    }

    // 4. Check if student is an Administrator
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      // Admins bypass enrollment check for verification purposes
      return serveMaterial(material);
    }

    // 5. Verify standard student enrollment status
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", material.courseSlug)
      .eq("status", "active")
      .maybeSingle();

    if (enrollError || !enrollment) {
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
