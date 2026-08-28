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
      // Check if user is a pre-created placeholder account
      // Usually placeholder accounts have full_name as "Student", or blank/undefined full_name
      const fullName = existingUser.user_metadata?.full_name || "";
      const isPlaceholder = !fullName || fullName.toLowerCase() === "student";

      if (isPlaceholder) {
        // Update user password and name metadata
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          password: password,
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

        return NextResponse.json({ success: true, preCreated: true, user: existingUser });
      } else {
        // Email is already fully registered by someone else
        return NextResponse.json({ error: "Email is already registered. Please sign in." }, { status: 400 });
      }
    }

    // User is completely new, tell frontend to call standard auth.signUp
    return NextResponse.json({ success: true, preCreated: false });

  } catch (err: any) {
    console.error("Auth pre-signup error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred during signup check." }, { status: 500 });
  }
}
