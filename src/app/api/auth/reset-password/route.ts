import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const { identifier, newPassword, confirmPassword } = await req.json().catch(() => ({}));
    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return NextResponse.json({ error: "Please enter your email or phone number." }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match. Please re-enter them carefully." }, { status: 400 });
    }

    const rawInput = identifier.trim();
    const isEmail = rawInput.includes("@");
    const cleanDigits = rawInput.replace(/\D/g, "");

    // 1. Find user in profiles (0.5ms SQL lookup)
    let matchedUserId: string | null = null;
    let targetEmail: string | null = null;

    if (isEmail) {
      const { data: pRec } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .ilike("email", rawInput.toLowerCase())
        .maybeSingle();
      if (pRec) {
        matchedUserId = pRec.id;
        targetEmail = pRec.email || rawInput.toLowerCase();
      }
    } else if (cleanDigits) {
      const last10 = cleanDigits.slice(-10);
      const { data: pRec } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .or(`phone.ilike.%${last10}%`)
        .maybeSingle();
      if (pRec) {
        matchedUserId = pRec.id;
        targetEmail = pRec.email;
      }

      if (!matchedUserId) {
        const { data: bs } = await supabaseAdmin
          .from("batch_students")
          .select("profile_id, email")
          .ilike("phone", `%${last10}%`)
          .maybeSingle();
        if (bs?.profile_id) {
          matchedUserId = bs.profile_id;
          targetEmail = bs.email;
        } else if (bs?.email) {
          const { data: pByEmail } = await supabaseAdmin
            .from("profiles")
            .select("id, email")
            .ilike("email", bs.email.toLowerCase().trim())
            .maybeSingle();
          if (pByEmail) {
            matchedUserId = pByEmail.id;
            targetEmail = pByEmail.email;
          }
        }
      }
    }

    if (!matchedUserId) {
      return NextResponse.json(
        { error: "No account found matching this email address or phone number." },
        { status: 404 }
      );
    }

    const { data: userRec } = await supabaseAdmin.auth.admin.getUserById(matchedUserId);
    const matchedUser = userRec?.user;

    if (!matchedUser) {
      return NextResponse.json(
        { error: "No student account found. Please check your credentials or register." },
        { status: 404 }
      );
    }

    // 3. Reset user password directly to the new password and clear must_change_password flag
    const currentMeta = matchedUser.user_metadata || {};
    const { error: resetErr } = await supabaseAdmin.auth.admin.updateUserById(matchedUser.id, {
      password: newPassword,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        ...currentMeta,
        must_change_password: false,
        password_updated_at: new Date().toISOString(),
      },
    });

    if (resetErr) {
      console.error("Password reset error:", resetErr);
      return NextResponse.json({ error: resetErr.message || "Failed to reset password." }, { status: 500 });
    }

    const finalEmail = matchedUser.email || targetEmail || "";

    // 4. Automatically sign in with the new password so user enters immediately (no second update needed)
    const { data: signInData, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
      email: finalEmail,
      password: newPassword,
    });

    const response = NextResponse.json({
      success: true,
      email: matchedUser.email,
      mustChangePassword: false,
      session: signInData?.session || null,
      message: "Password has been successfully updated. Welcome back!",
    });

    if (signInData?.session?.access_token) {
      response.cookies.set("sb-access-token", signInData.session.access_token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
      });
    }

    return response;
  } catch (err: any) {
    console.error("Self-service reset password API error:", err);
    return NextResponse.json({ error: err.message || "Failed to process password reset." }, { status: 500 });
  }
}
