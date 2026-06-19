import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Helper to check admin authorization cookie
function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return NextResponse.json(
      { 
        error: `Supabase not configured. url: ${url ? "defined (" + url.substring(0, 10) + "...)" : "undefined"}, serviceKey: ${key ? "defined (" + key.substring(0, 10) + "...)" : "undefined"}, anonKey: ${anonKey ? "defined (" + anonKey.substring(0, 10) + "...)" : "undefined"}` 
      },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ leads: data });
  } catch (error: any) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 500 }
    );
  }

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing lead ID or status." },
        { status: 400 }
      );
    }

    if (!["new", "contacted", "closed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update lead:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
