import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const { email, password, name, phone, profession } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fast indexed check in profiles table (0.5ms SQL lookup instead of heavy listUsers HTTP call)
    let existingUser: any = null;
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, name, full_name, phone, role")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (existingProfile) {
      const { data: authUserRec } = await supabaseAdmin.auth.admin.getUserById(existingProfile.id);
      if (authUserRec?.user) {
        existingUser = authUserRec.user;
      }
    }

    if (existingUser) {
      // Check if user is a pre-created placeholder account or incomplete account
      const fullName = existingUser.user_metadata?.full_name || existingUser.user_metadata?.name || existingProfile?.full_name || "";
      const isPlaceholder = !fullName || fullName.toLowerCase() === "student" || !existingUser.email_confirmed_at;

      if (isPlaceholder) {
        const { data: updatedUserData, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: name
          }
        });

        if (updateErr) throw updateErr;

        // Upsert profile
        await supabaseAdmin
          .from("profiles")
          .upsert({
            id: existingUser.id,
            name: name,
            full_name: name,
            email: normalizedEmail,
            phone: phone || existingProfile?.phone || null,
            profession: profession || null,
            role: "student"
          });

        return NextResponse.json({ success: true, preCreated: true, user: updatedUserData.user });
      } else {
        return NextResponse.json({ error: "Email is already registered. Please sign in." }, { status: 400 });
      }
    }

    // 2. User is completely new: create directly with email_confirm: true so no verification email is required
    let formattedPhone = phone?.trim();
    if (formattedPhone) {
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+91${formattedPhone.replace(/\D/g, "")}`;
      }
    }

    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: password,
      phone: formattedPhone || undefined,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        full_name: name,
        account_type: "individual",
      },
    });

    if (createErr) {
      const errMsg = (createErr.message || "").toLowerCase();
      if (errMsg.includes("already registered") || errMsg.includes("email_exists") || errMsg.includes("already exists")) {
        return NextResponse.json({ error: "Email is already registered. Please sign in." }, { status: 400 });
      }
      throw createErr;
    }

    // Upsert profile for the newly created user
    await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newUser.user.id,
        name: name,
        full_name: name,
        email: normalizedEmail,
        phone: formattedPhone || null,
        profession: profession || null,
        account_type: "individual",
        role: "student"
      });

    return NextResponse.json({ success: true, created: true, user: newUser.user });

  } catch (err: any) {
    console.error("Auth signup error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred during signup." }, { status: 500 });
  }
}

