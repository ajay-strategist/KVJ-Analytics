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
    const { email, phone } = await req.json();

    if (!email && !phone) {
      return NextResponse.json({ error: "Missing email or phone." }, { status: 400 });
    }

    const { data: usersPage, error: userErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (userErr) throw userErr;

    const cleanEmail = email?.toLowerCase().trim();
    const cleanPhone = phone?.trim();

    const matchedUser = usersPage?.users?.find((u: any) => {
      if (cleanEmail && u.email?.toLowerCase().trim() === cleanEmail) return true;
      if (cleanPhone && u.phone?.trim() === cleanPhone) return true;
      return false;
    });

    if (matchedUser) {
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(matchedUser.id, {
        email_confirm: true,
        phone_confirm: true,
      });

      if (updateErr) throw updateErr;

      return NextResponse.json({ success: true, user_id: matchedUser.id, message: "User email auto-confirmed." });
    }

    return NextResponse.json({ error: "User not found." }, { status: 404 });
  } catch (err: any) {
    console.error("Auto confirm error:", err);
    return NextResponse.json({ error: err.message || "Failed to confirm user." }, { status: 500 });
  }
}
