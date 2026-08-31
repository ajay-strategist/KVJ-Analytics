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
    const { email, password, name, phone, profession } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. Fetch user to see if they already exist in auth
    const { data: usersPage, error: userErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (userErr) throw userErr;

    const existingUser = usersPage?.users?.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase().trim()
    );

    if (existingUser) {
      // Check if user is a pre-created placeholder account or incomplete account
      const fullName = existingUser.user_metadata?.full_name || "";
      const isPlaceholder = !fullName || fullName.toLowerCase() === "student" || !existingUser.email_confirmed_at;

      if (isPlaceholder) {
        // Update user password, email_confirm and name metadata
        const { data: updatedUserData, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: name
          }
        });

        if (updateErr) throw updateErr;

        // Upsert profile
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .upsert({
            id: existingUser.id,
            name: name,
            full_name: name,
            phone: phone || null,
            profession: profession || null,
            role: "student"
          });

        if (profileError) console.error("Profile upsert warning:", profileError);

        return NextResponse.json({ success: true, preCreated: true, user: updatedUserData.user });
      } else {
        // Email is already fully registered by someone else
        return NextResponse.json({ error: "Email is already registered. Please sign in." }, { status: 400 });
      }
    }

    // 2. User is completely new: create directly with email_confirm: true so no verification email is required
    // Format phone to E.164 if provided
    let formattedPhone = phone?.trim();
    if (formattedPhone) {
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+91${formattedPhone.replace(/\D/g, "")}`;
      }
    }

    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: password,
      phone: formattedPhone || undefined,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        full_name: name,
        account_type: "individual",
      },
    });

    if (createErr) throw createErr;

    // Upsert profile for the newly created user
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newUser.user.id,
        name: name,
        full_name: name,
        phone: formattedPhone || null,
        profession: profession || null,
        account_type: "individual",
        role: "student"
      });

    if (profileError) console.error("New user profile upsert warning:", profileError);

    return NextResponse.json({ success: true, created: true, user: newUser.user });

  } catch (err: any) {
    console.error("Auth signup error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred during signup." }, { status: 500 });
  }
}

