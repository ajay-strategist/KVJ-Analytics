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
  try {
    const { code, userId } = await req.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: "Access code and user ID are required." },
        { status: 400 }
      );
    }

    if (code.length !== 6) {
      return NextResponse.json(
        { error: "Access code must be exactly 6 digits." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database configuration is missing." },
        { status: 500 }
      );
    }

    // 1. Fetch the unlock code details
    const { data: codeData, error: codeFetchError } = await supabaseAdmin
      .from("unlock_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .maybeSingle();

    if (codeFetchError || !codeData) {
      return NextResponse.json(
        { error: "Invalid unlock code. Please verify and try again." },
        { status: 404 }
      );
    }

    // 2. Check Expiry
    if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This unlock code has expired." },
        { status: 400 }
      );
    }

    // 3. Check Usage Limits
    if (codeData.max_uses !== null && codeData.used_count >= codeData.max_uses) {
      return NextResponse.json(
        { error: "This unlock code has reached its maximum usage limit." },
        { status: 400 }
      );
    }

    // 4. Fetch the course linked to this code
    const { data: courseData, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("id, slug, title")
      .eq("id", codeData.course_id)
      .maybeSingle();

    if (courseError || !courseData) {
      return NextResponse.json(
        { error: "Linked course not found for this unlock code." },
        { status: 404 }
      );
    }

    // 5. Create or verify redemption (prevent double redemption)
    const { data: existingRedemption } = await supabaseAdmin
      .from("code_redemptions")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseData.id)
      .maybeSingle();

    if (existingRedemption) {
      return NextResponse.json(
        { error: "You have already unlocked this course.", courseSlug: courseData.slug },
        { status: 400 }
      );
    }

    // 6. Create enrollment + redemption rows + increment used_count (in a transaction or sequential operations)
    const { error: redemptionError } = await supabaseAdmin
      .from("code_redemptions")
      .insert([
        {
          code_id: codeData.id,
          user_id: userId,
          course_id: courseData.id,
        },
      ]);

    if (redemptionError) {
      console.error("Redemption insert error:", redemptionError);
      return NextResponse.json(
        { error: "Failed to record code usage." },
        { status: 500 }
      );
    }

    const { error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .upsert(
        {
          user_id: userId,
          course_slug: courseData.slug,
          enrollment_method: "college_code",
          status: "active",
        },
        { onConflict: "user_id,course_slug" }
      );

    if (enrollError) {
      console.error("Enrollment error:", enrollError);
      return NextResponse.json(
        { error: "Failed to create enrollment record." },
        { status: 500 }
      );
    }

    // Increment used count
    await supabaseAdmin
      .from("unlock_codes")
      .update({ used_count: codeData.used_count + 1 })
      .eq("id", codeData.id);

    return NextResponse.json({
      success: true,
      message: `Successfully unlocked ${courseData.title}!`,
      courseSlug: courseData.slug,
    });
  } catch (error: any) {
    console.error("Unlock API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
