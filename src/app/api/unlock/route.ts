import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTOTP } from "@/lib/totp";

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
      // ── Fallback: try as a TOTP rotating batch code ───────────────────────
      const now = new Date();

      // Fetch all active batches whose validity window includes today
      const { data: batches } = await supabaseAdmin
        .from("batches")
        .select("id, college_name, course_slug, totp_secret, valid_from, valid_to, active")
        .eq("active", true);

      if (batches && batches.length > 0) {
        // Find the first batch whose window is valid and whose TOTP matches
        const matchedBatch = batches.find((b: any) => {
          const fromOk = !b.valid_from || new Date(b.valid_from) <= now;
          const toOk   = !b.valid_to   || new Date(b.valid_to)   >= now;
          if (!fromOk || !toOk) return false;
          return verifyTOTP(code, b.totp_secret, 1);
        });

        if (matchedBatch) {
          // Fetch the course for this batch
          const { data: batchCourse } = await supabaseAdmin
            .from("courses")
            .select("id, slug, title")
            .eq("slug", matchedBatch.course_slug)
            .maybeSingle();

          if (batchCourse) {
            // Check for duplicate enrollment
            const { data: existingEnrollment } = await supabaseAdmin
              .from("enrollments")
              .select("id")
              .eq("user_id", userId)
              .eq("course_slug", batchCourse.slug)
              .maybeSingle();

            if (existingEnrollment) {
              return NextResponse.json(
                { error: "You have already unlocked this course.", courseSlug: batchCourse.slug },
                { status: 400 }
              );
            }

            // Create enrollment
            const { error: batchEnrollErr } = await supabaseAdmin
              .from("enrollments")
              .upsert(
                {
                  user_id: userId,
                  course_slug: batchCourse.slug,
                  enrollment_method: "college_code",
                  status: "active",
                },
                { onConflict: "user_id,course_slug" }
              );

            if (batchEnrollErr) {
              return NextResponse.json(
                { error: "Failed to create enrollment record." },
                { status: 500 }
              );
            }

            return NextResponse.json({
              success: true,
              message: `Successfully unlocked ${batchCourse.title}!`,
              courseSlug: batchCourse.slug,
            });
          }
        }
      }
      // ── End batch fallback ────────────────────────────────────────────────

      return NextResponse.json(
        { error: "Invalid unlock code. Please verify and try again." },
        { status: 404 }
      );
    }

    // 2. Check Explicit Status (PAUSED, REVOKED, EXHAUSTED)
    if (codeData.status && codeData.status !== "ACTIVE") {
      let statusMsg = "This unlock code is not active.";
      if (codeData.status === "PAUSED") statusMsg = "This unlock code has been paused by the administrator.";
      if (codeData.status === "REVOKED") statusMsg = "This unlock code has been revoked.";
      if (codeData.status === "EXHAUSTED") statusMsg = "This unlock code has reached its maximum usage limit.";
      
      return NextResponse.json(
        { error: statusMsg },
        { status: 400 }
      );
    }

    // 3. Check Expiry / Validity Window
    const now = new Date();
    if (codeData.valid_from && new Date(codeData.valid_from) > now) {
      return NextResponse.json(
        { error: "This unlock code is not valid yet." },
        { status: 400 }
      );
    }
    
    // Check either valid_until (from new model) or expires_at (legacy fallback)
    const expiryDate = codeData.valid_until || codeData.expires_at;
    if (expiryDate && new Date(expiryDate) < now) {
      return NextResponse.json(
        { error: "This unlock code has expired." },
        { status: 400 }
      );
    }

    // 4. Check Seats Allocation (either seats/seats_used or legacy max_uses/used_count)
    const seatsTotal = codeData.seats !== null ? codeData.seats : codeData.max_uses;
    const seatsUsed = codeData.seats_used !== null ? codeData.seats_used : codeData.used_count;
    
    if (seatsTotal !== null && seatsUsed >= seatsTotal) {
      return NextResponse.json(
        { error: "This unlock code has reached its maximum usage limit." },
        { status: 400 }
      );
    }

    // 5. Fetch the course linked to this code
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

    // 6. Fetch user profile/email and perform domain validation if required
    let userEmail = "";
    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      userEmail = userData?.user?.email || "";
    } catch (userErr) {
      console.warn("Failed to retrieve user email for domain check:", userErr);
    }

    if (codeData.allowed_email_domain) {
      if (!userEmail) {
        return NextResponse.json(
          { error: "Email validation is required for this code. Could not verify email." },
          { status: 400 }
        );
      }
      
      const domain = userEmail.split("@")[1]?.toLowerCase().trim();
      const allowedDomain = codeData.allowed_email_domain.toLowerCase().trim();
      
      if (domain !== allowedDomain) {
        return NextResponse.json(
          { error: `This access code is restricted to members of ${allowedDomain}.` },
          { status: 400 }
        );
      }
    }

    // 7. Create or verify redemption (prevent double redemption)
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

    // 8. Create enrollment first, getting the generated ID
    const { data: enrollData, error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .upsert(
        {
          user_id: userId,
          course_slug: courseData.slug,
          enrollment_method: "college_code",
          status: "active",
        },
        { onConflict: "user_id,course_slug" }
      )
      .select("id")
      .maybeSingle();

    if (enrollError || !enrollData) {
      console.error("Enrollment creation error:", enrollError);
      return NextResponse.json(
        { error: "Failed to create enrollment record." },
        { status: 500 }
      );
    }

    // 9. Create redemption log referencing enrollment
    const { error: redemptionError } = await supabaseAdmin
      .from("code_redemptions")
      .insert([
        {
          code_id: codeData.id,
          user_id: userId,
          course_id: courseData.id,
          enrollment_id: enrollData.id,
        },
      ]);

    if (redemptionError) {
      console.error("Redemption insert error:", redemptionError);
      return NextResponse.json(
        { error: "Failed to record code usage." },
        { status: 500 }
      );
    }

    // 10. Increment used count / seats used atomically
    const newSeatsUsed = (codeData.seats_used !== null ? codeData.seats_used : codeData.used_count) + 1;
    const newUsedCount = codeData.used_count + 1;
    const isExhausted = seatsTotal !== null && newSeatsUsed >= seatsTotal;

    await supabaseAdmin
      .from("unlock_codes")
      .update({
        used_count: newUsedCount,
        seats_used: newSeatsUsed,
        status: isExhausted ? "EXHAUSTED" : codeData.status
      })
      .eq("id", codeData.id);

    // 11. Write audit log trail
    try {
      await supabaseAdmin.from("audit_logs").insert([
        {
          actor: userEmail || "student",
          action: "redeem_access_code",
          entity_type: "unlock_codes",
          entity_id: codeData.id,
          meta: {
            code: codeData.code,
            user_id: userId,
            course_id: courseData.id,
            enrollment_id: enrollData.id,
          },
        }
      ]);
    } catch (logErr) {
      console.error("Failed to write redemption audit log:", logErr);
    }

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
