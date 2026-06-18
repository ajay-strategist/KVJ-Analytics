import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTOTP } from "@/lib/totp";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// In-memory rate limiting map for brute-force lockout on TOTP entry
// Key: IP address + course_slug
const limitStore = new Map<string, { count: number; lockUntil: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown-ip";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { name, phone, organization, code, userId } = body;

    // 1. Basic validation
    if (!name || !phone || !organization || !code || !userId) {
      return NextResponse.json(
        { error: "All student fields and access code are required." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase service role client is not configured." },
        { status: 500 }
      );
    }

    // 2. Rate-Limiting & Lockout
    const ip = getClientIp(req);
    const limitKey = `${ip}:${slug}`;
    const limitInfo = limitStore.get(limitKey);

    if (limitInfo && limitInfo.lockUntil > Date.now()) {
      const remainingSeconds = Math.ceil((limitInfo.lockUntil - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Too many failed attempts. Locked out. Try again in ${remainingSeconds} seconds.` },
        { status: 429 }
      );
    }

    // 3. Find active and valid batches for this course
    const nowISO = new Date().toISOString();
    const { data: activeBatches, error: fetchError } = await supabaseAdmin
      .from("batches")
      .select("*")
      .eq("course_slug", slug)
      .eq("active", true)
      .lte("valid_from", nowISO)
      .gte("valid_to", nowISO);

    if (fetchError) {
      console.error("Error fetching batches:", fetchError);
      return NextResponse.json(
        { error: "Database error verifying batch code." },
        { status: 500 }
      );
    }

    if (!activeBatches || activeBatches.length === 0) {
      return NextResponse.json(
        { error: "No active college batch found for this course syllabus. Code cannot be verified." },
        { status: 404 }
      );
    }

    // 4. Validate TOTP code against active secrets
    let codeIsValid = false;
    let verifiedBatch: any = null;

    for (const batch of activeBatches) {
      if (verifyTOTP(code, batch.totp_secret, 1)) {
        codeIsValid = true;
        verifiedBatch = batch;
        break;
      }
    }

    if (!codeIsValid) {
      // Record failure for rate limiting
      const currentFailures = limitInfo ? limitInfo.count + 1 : 1;
      let lockDuration = 0;
      if (currentFailures >= 5) {
        // Lockout for 5 minutes after 5 failures
        lockDuration = 5 * 60 * 1000; 
      } else if (currentFailures >= 3) {
        // Lockout for 1 minute after 3 failures
        lockDuration = 60 * 1000;
      }

      limitStore.set(limitKey, {
        count: currentFailures,
        lockUntil: Date.now() + lockDuration,
      });

      return NextResponse.json(
        { error: "Invalid access code. Please check with your college coordinator." },
        { status: 400 }
      );
    }

    // Reset rate limiting on success
    limitStore.delete(limitKey);

    // 5. Update Profile (Name, Phone, Org)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          name,
          phone,
          organization,
          role: "student",
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("Profile update error during join:", profileError);
      return NextResponse.json(
        { error: "Failed to update profile information." },
        { status: 500 }
      );
    }

    // 6. Create enrollment record
    const { error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .upsert(
        {
          user_id: userId,
          course_slug: slug,
          enrollment_method: "college_code",
          status: "active",
        },
        { onConflict: "user_id,course_slug" }
      );

    if (enrollError) {
      console.error("Enrollment record insertion error:", enrollError);
      return NextResponse.json(
        { error: "Failed to create enrollment record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, collegeName: verifiedBatch.college_name });
  } catch (error: any) {
    console.error("General join API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
