import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const { email, phone, password } = await req.json();

    if (!email && !phone) {
      return NextResponse.json({ error: "Missing email or phone." }, { status: 400 });
    }

    const cleanEmail = email?.toLowerCase().trim();
    const cleanPhone = phone?.trim();

    // 1. Force email confirmation in Supabase GoTrue via generateLink
    if (cleanEmail) {
      try {
        await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: cleanEmail,
        });
      } catch (linkErr) {
        console.warn("generateLink auto-confirm warning:", linkErr);
      }
    }

    // 2. Find user in profiles (fast indexed lookup instead of listUsers)
    let matchedUserId: string | null = null;

    if (cleanEmail) {
      const { data: pRec } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .ilike("email", cleanEmail)
        .maybeSingle();
      if (pRec?.id) matchedUserId = pRec.id;
    }

    if (!matchedUserId && cleanPhone) {
      const last10 = cleanPhone.replace(/\D/g, "").slice(-10);
      const { data: pRec } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .or(`phone.ilike.%${last10}%`)
        .maybeSingle();
      if (pRec?.id) matchedUserId = pRec.id;
    }

    let matchedUser: any = null;
    if (matchedUserId) {
      const { data: uRec } = await supabaseAdmin.auth.admin.getUserById(matchedUserId);
      matchedUser = uRec?.user;
    }

    if (matchedUser) {
      const updateData: any = {
        email_confirm: true,
        phone_confirm: true,
        email_confirmed_at: new Date().toISOString(),
      };

      if (password) {
        updateData.password = password;
      }

      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(matchedUser.id, updateData);
      if (updateErr) {
        console.warn("updateUserById warning:", updateErr);
      }

      // 3. Server-side login attempt to generate session tokens for client
      let session = null;
      if (cleanEmail && password) {
        try {
          const { data: signInData } = await supabaseAdmin.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          });
          if (signInData?.session) {
            session = signInData.session;
          }
        } catch (signInErr) {
          console.warn("Server signInWithPassword warning:", signInErr);
        }
      }

      return NextResponse.json({
        success: true,
        user_id: matchedUser.id,
        session,
        message: "User email auto-confirmed successfully.",
      });
    }

    // If user not found in auth list but email & password provided, create auto-confirmed account
    if (cleanEmail && password) {
      try {
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: password,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: { full_name: "Student" },
        });

        if (!createErr && newUser?.user) {
          let session = null;
          try {
            const { data: signInData } = await supabaseAdmin.auth.signInWithPassword({
              email: cleanEmail,
              password: password,
            });
            session = signInData?.session || null;
          } catch (sErr) {
            console.warn("New user signin warning:", sErr);
          }

          return NextResponse.json({
            success: true,
            user_id: newUser.user.id,
            session,
            message: "Created auto-confirmed user account.",
          });
        }
      } catch (createErr) {
        console.warn("createUser auto-confirm warning:", createErr);
      }
    }

    return NextResponse.json({ success: true, message: "Auto-confirm attempted." });
  } catch (err: any) {
    console.error("Auto confirm error:", err);
    return NextResponse.json({ error: err.message || "Failed to confirm user." }, { status: 500 });
  }
}
