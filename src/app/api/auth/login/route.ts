import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const identifier = (body.identifier || body.email || body.username || "").trim();
    const password = body.password || "";

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email or phone number and password are required." },
        { status: 400 }
      );
    }

    const isEmail = identifier.includes("@");
    let targetEmail: string | null = null;
    let matchedUserId: string | null = null;

    if (isEmail) {
      targetEmail = identifier.toLowerCase();
    } else {
      // Identifier is a phone number
      const cleanDigits = identifier.replace(/\D/g, "");
      const last10 = cleanDigits.slice(-10);

      if (last10.length < 10) {
        return NextResponse.json(
          { error: "Please enter a valid 10-digit mobile number or email address." },
          { status: 400 }
        );
      }

      // 1. Direct indexed check in profiles table by phone
      const { data: prof } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, phone, email")
        .or(`phone.ilike.%${last10}%`)
        .limit(1)
        .maybeSingle();

      if (prof?.id) {
        matchedUserId = prof.id;
        if (prof.email) {
          targetEmail = prof.email.toLowerCase();
        } else {
          const { data: userRec } = await supabaseAdmin.auth.admin.getUserById(prof.id);
          if (userRec?.user?.email) {
            targetEmail = userRec.user.email.toLowerCase();
          }
        }
      }

      // 2. If student is not registered in auth but is on a batch roster
      if (!targetEmail) {
        const { data: rosterEntry } = await supabaseAdmin
          .from("batch_students")
          .select("id, name, phone, status, batch_id, batches(course_slug, college_name)")
          .or(`phone.ilike.%${last10}%`)
          .limit(1)
          .maybeSingle();

        if (rosterEntry) {
          const courseSlug = (rosterEntry as any).batches?.course_slug || "power-bi";
          const collegeName = (rosterEntry as any).batches?.college_name || "College Batch";
          return NextResponse.json(
            {
              error: "Account not activated yet.",
              isInvitedStudent: true,
              name: rosterEntry.name,
              phone: identifier,
              courseSlug,
              collegeName,
              message: `Hi ${rosterEntry.name || "Student"}! Your mobile number is registered for ${collegeName}. Please activate your student account using your batch join page.`,
              joinUrl: `/training/${courseSlug}/join`,
            },
            { status: 403 }
          );
        }

        return NextResponse.json(
          {
            error: "No student account found for this phone number. Please check your number or register first.",
          },
          { status: 404 }
        );
      }
    }

    if (!targetEmail) {
      return NextResponse.json({ error: "Invalid login credentials." }, { status: 400 });
    }

    // Attempt sign in via Supabase Admin
    let { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: targetEmail,
      password: password,
    });

    // Auto-confirm resolution if email is not confirmed
    if (signInError) {
      const errMsg = (signInError.message || "").toLowerCase();
      const isConfirmIssue =
        errMsg.includes("email not confirmed") ||
        errMsg.includes("email_not_confirmed") ||
        errMsg.includes("confirm") ||
        errMsg.includes("unconfirmed");

      if (isConfirmIssue) {
        try {
          // Find user ID if not already known via profiles
          if (!matchedUserId) {
            const { data: pRec } = await supabaseAdmin
              .from("profiles")
              .select("id")
              .ilike("email", targetEmail!.toLowerCase().trim())
              .maybeSingle();
            if (pRec?.id) matchedUserId = pRec.id;
          }

          if (matchedUserId) {
            await supabaseAdmin.auth.admin.updateUserById(matchedUserId, {
              email_confirm: true,
              phone_confirm: true,
            });

            // Retry sign in
            const retry = await supabaseAdmin.auth.signInWithPassword({
              email: targetEmail,
              password: password,
            });
            signInData = retry.data;
            signInError = retry.error;
          }
        } catch (confirmErr) {
          console.error("Auto confirm during login failed:", confirmErr);
        }
      }
    }

    if (signInError || !signInData?.session) {
      return NextResponse.json(
        { error: signInError?.message || "Invalid email/phone or password. Please try again." },
        { status: 401 }
      );
    }

    // Auto claim any pending invited batch enrollments (targeted query instead of full-table scan)
    try {
      if (signInData.user?.id) {
        const cleanDigits = !isEmail ? identifier.replace(/\D/g, "").slice(-10) : "";
        
        let batchQuery = supabaseAdmin
          .from("batch_students")
          .select("id, email, phone, batches(course_slug, college_name)")
          .eq("status", "INVITED");

        if (cleanDigits && targetEmail) {
          batchQuery = batchQuery.or(`email.ilike.${targetEmail},phone.ilike.%${cleanDigits}%`);
        } else if (targetEmail) {
          batchQuery = batchQuery.ilike("email", targetEmail);
        } else if (cleanDigits) {
          batchQuery = batchQuery.ilike("phone", `%${cleanDigits}%`);
        }

        const { data: matched } = await batchQuery;

        if (matched && matched.length > 0) {
          for (const record of matched) {
            const b = (record as any).batches;
            if (b?.course_slug) {
              await supabaseAdmin.from("enrollments").upsert(
                {
                  user_id: signInData.user.id,
                  course_slug: b.course_slug,
                  enrollment_method: "college_code",
                  status: "active",
                },
                { onConflict: "user_id,course_slug" }
              );

              await supabaseAdmin
                .from("profiles")
                .update({
                  organization: b.college_name,
                  account_type: "college",
                  email: targetEmail || undefined,
                })
                .eq("id", signInData.user.id);

              await supabaseAdmin
                .from("batch_students")
                .update({ status: "JOINED", profile_id: signInData.user.id })
                .eq("id", record.id);
            }
          }
        }
      }
    } catch (claimErr) {
      console.warn("Claim enrollments on login warning:", claimErr);
    }

    const mustChangePassword =
      password === "password" ||
      Boolean(signInData.user?.user_metadata?.must_change_password);

    const response = NextResponse.json({
      success: true,
      user: signInData.user,
      session: signInData.session,
      mustChangePassword,
    });

    // Set sb-access-token cookie directly on the response headers (30 days persistence)
    response.cookies.set("sb-access-token", signInData.session.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
    });

    return response;
  } catch (err: any) {
    console.error("Auth login API error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
