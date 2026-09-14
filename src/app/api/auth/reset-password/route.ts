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

    // 1. Find user in auth list
    const { data: usersPage, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (listErr) throw listErr;

    let matchedUser = (usersPage?.users || []).find((u: any) => {
      if (isEmail && u.email?.toLowerCase().trim() === rawInput.toLowerCase()) return true;
      if (!isEmail && cleanDigits) {
        const p = (u.phone || "").replace(/\D/g, "");
        if (p && (p === cleanDigits || p.endsWith(cleanDigits) || cleanDigits.endsWith(p))) return true;
      }
      return false;
    });

    // 2. If not found in auth by phone, check batch_students
    if (!matchedUser && !isEmail && cleanDigits) {
      const { data: batchStudent } = await supabaseAdmin
        .from("batch_students")
        .select("email, phone, name")
        .ilike("phone", `%${cleanDigits.slice(-10)}%`)
        .maybeSingle();

      if (batchStudent?.email) {
        matchedUser = (usersPage?.users || []).find(
          (u: any) => u.email?.toLowerCase().trim() === batchStudent.email.toLowerCase().trim()
        );
      }
    }

    if (!matchedUser || !matchedUser.email) {
      return NextResponse.json(
        { error: "No account found matching this email or phone number. Please check or register." },
        { status: 404 }
      );
    }

    // 3. Reset user password directly to the new password and clear must_change_password flag
    const currentMeta = matchedUser.user_metadata || {};
    const { error: resetErr } = await supabaseAdmin.auth.admin.updateUserById(matchedUser.id, {
      password: newPassword,
      email_confirm: true,
      phone_confirm: true,
      email_confirmed_at: new Date().toISOString(),
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

    // 4. Automatically sign in with the new password so user enters immediately (no second update needed)
    const { data: signInData, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
      email: matchedUser.email,
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
        maxAge: signInData.session.expires_in || 60 * 60 * 24 * 7,
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
