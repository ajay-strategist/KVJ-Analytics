import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, getCachedActiveBatches } from "@/lib/supabaseAdmin";
import { verifyTOTP } from "@/lib/totp";

// Per-student rate limiting map for brute-force prevention on TOTP entry
// Key: student email/phone/userId (never IP alone, so college classroom Wi-Fi is NOT locked out)
const studentLimitStore = new Map<string, { count: number; lockUntil: number }>();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { name, phone, organization, code, userId, email } = body;

    // 1. Basic validation
    if (!name || !organization || !code || (!userId && !email)) {
      return NextResponse.json(
        { error: "Student name, email or phone, institution, and 6-digit access code are required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database service client is not configured." },
        { status: 500 }
      );
    }

    // 2. Classroom-Safe Rate Limiting
    // Key by individual student identifier (email / phone / userId) so 100 students on the same Wi-Fi are completely isolated
    const cleanEmail = (email || body.email || "").toString().trim().toLowerCase();
    const cleanDigits = (phone || "").toString().replace(/\D/g, "").slice(-10);
    const studentIdentifier = cleanEmail || cleanDigits || (userId ? `uid-${userId}` : "student");
    const limitKey = `${studentIdentifier}:${slug}`;
    const limitInfo = studentLimitStore.get(limitKey);

    if (limitInfo && limitInfo.lockUntil > Date.now()) {
      const remainingSeconds = Math.ceil((limitInfo.lockUntil - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Too many incorrect attempts for your account. Please wait ${remainingSeconds} seconds or get the fresh code from your coordinator.` },
        { status: 429 }
      );
    }

    // 3. Find active batches using 30s in-memory cache (0ms DB check during 100-student classroom burst)
    const activeBatches = await getCachedActiveBatches(slug, supabaseAdmin);

    if (!activeBatches || activeBatches.length === 0) {
      return NextResponse.json(
        { error: "No active college batch found for this course syllabus. Code cannot be verified." },
        { status: 404 }
      );
    }

    // 4. Validate TOTP code against active secrets (window 2 allows +/- 60s clock drift for student mobile phones)
    let codeIsValid = false;
    let verifiedBatch: any = null;

    for (const batch of activeBatches) {
      if (verifyTOTP(code, batch.totp_secret, 2)) {
        codeIsValid = true;
        verifiedBatch = batch;
        break;
      }
    }

    if (!codeIsValid) {
      // Record failure for this specific student only (does NOT lock out the classroom)
      const currentFailures = limitInfo ? limitInfo.count + 1 : 1;
      let lockDuration = 0;
      if (currentFailures >= 10) {
        lockDuration = 5 * 60 * 1000; // 5 min lockout after 10 failures
      } else if (currentFailures >= 5) {
        lockDuration = 60 * 1000; // 1 min lockout after 5 failures
      }

      studentLimitStore.set(limitKey, {
        count: currentFailures,
        lockUntil: Date.now() + lockDuration,
      });

      return NextResponse.json(
        { error: "Invalid access code. Please check with your college coordinator for the live rotating code." },
        { status: 400 }
      );
    }

    // Reset rate limiting on success
    studentLimitStore.delete(limitKey);

    // 5. Roster Verification: Fast indexed single-record check
    let matchedRosterEntry: any = null;
    try {
      let rosterQuery = supabaseAdmin
        .from("batch_students")
        .select("id, name, email, phone, status")
        .eq("batch_id", verifiedBatch.id);

      if (cleanEmail && cleanDigits) {
        rosterQuery = rosterQuery.or(`email.ilike.${cleanEmail},phone.ilike.%${cleanDigits}%`);
      } else if (cleanEmail) {
        rosterQuery = rosterQuery.ilike("email", cleanEmail);
      } else if (cleanDigits) {
        rosterQuery = rosterQuery.ilike("phone", `%${cleanDigits}%`);
      }

      const { data: rosterEntries } = await rosterQuery.limit(1);

      if (rosterEntries && rosterEntries.length > 0) {
        matchedRosterEntry = rosterEntries[0];
      } else {
        // Check if roster has any students at all
        const { count: totalRosterCount } = await supabaseAdmin
          .from("batch_students")
          .select("*", { count: "exact", head: true })
          .eq("batch_id", verifiedBatch.id);

        if (totalRosterCount && totalRosterCount > 0) {
          return NextResponse.json(
            { error: "Your email/phone is not listed on the authorized student roster for this college batch. Please contact your coordinator." },
            { status: 403 }
          );
        }
      }
    } catch (err) {
      console.warn("Roster verification non-blocking check error:", err);
    }

    // 6. Ensure user account ID exists
    let activeUserId = userId;
    if (!activeUserId && cleanEmail) {
      const { data: pRec } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .ilike("email", cleanEmail)
        .maybeSingle();
      if (pRec?.id) activeUserId = pRec.id;
    }

    if (!activeUserId) {
      return NextResponse.json(
        { error: "Student account not found. Please complete signup or sign in first." },
        { status: 400 }
      );
    }

    // 7. Atomic Database Execution: Try Stored Procedure first (< 3ms single transaction)
    let rpcSucceeded = false;
    try {
      const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc("join_college_batch", {
        p_user_id: activeUserId,
        p_name: name,
        p_email: cleanEmail || null,
        p_phone: phone || null,
        p_organization: verifiedBatch.college_name || organization,
        p_course_slug: slug,
        p_batch_id: verifiedBatch.id,
      });

      if (!rpcError && rpcResult?.success) {
        rpcSucceeded = true;
      }
    } catch (rpcErr) {
      // Fallback to direct parallel updates if RPC is not yet registered in database
    }

    // Fallback: Parallel direct upserts if RPC not yet present
    if (!rpcSucceeded) {
      await Promise.all([
        supabaseAdmin
          .from("profiles")
          .upsert(
            {
              id: activeUserId,
              name,
              full_name: name,
              email: cleanEmail || undefined,
              phone: phone || null,
              organization: verifiedBatch.college_name || organization,
              account_type: "college",
              role: "student",
            },
            { onConflict: "id" }
          ),
        supabaseAdmin
          .from("enrollments")
          .upsert(
            {
              user_id: activeUserId,
              course_slug: slug,
              enrollment_method: "college_code",
              status: "active",
            },
            { onConflict: "user_id,course_slug" }
          ),
      ]);

      if (matchedRosterEntry?.id) {
        await supabaseAdmin
          .from("batch_students")
          .update({
            status: "JOINED",
            profile_id: activeUserId,
          })
          .eq("id", matchedRosterEntry.id);
      }
    }

    return NextResponse.json({
      success: true,
      collegeName: verifiedBatch.college_name,
      courseSlug: slug,
    });
  } catch (error: any) {
    console.error("General join API error:", error);
    return NextResponse.json(
      { error: "Internal server error during batch enrollment." },
      { status: 500 }
    );
  }
}
