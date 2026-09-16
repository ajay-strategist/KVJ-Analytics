import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { newPassword, confirmPassword } = body;

    // Determine user ID from auth token or cookies
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const cookieToken = req.cookies.get("sb-access-token")?.value;
    const token = bearerToken || cookieToken;

    let targetUserId: string | null = null;
    if (token) {
      const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
      if (!userError && userData?.user?.id) {
        targetUserId = userData.user.id;
      }
    }

    // Fallback if userId or email is explicitly provided in body
    if (!targetUserId && body.userId) {
      targetUserId = body.userId;
    }

    if (!targetUserId && body.email) {
      const cleanEmail = String(body.email).toLowerCase().trim();
      const { data: pRec } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .ilike("email", cleanEmail)
        .maybeSingle();
      if (pRec?.id) {
        targetUserId = pRec.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to update your password." }, { status: 401 });
    }

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Please provide a valid new password." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (newPassword.toLowerCase().trim() === "password") {
      return NextResponse.json({
        error: 'You cannot use the default "password". Please choose a personal, secure password.'
      }, { status: 400 });
    }

    // Fetch existing user metadata
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
    const existingMeta = existingUser?.user?.user_metadata || {};

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
      password: newPassword,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        ...existingMeta,
        must_change_password: false,
        password_updated_at: new Date().toISOString(),
      }
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message || "Failed to update password." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully."
    });
  } catch (err: any) {
    console.error("Update password API error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred." }, { status: 500 });
  }
}
