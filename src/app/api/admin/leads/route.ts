import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Helper to check admin authorization cookie
function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === adminToken();
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
      .select("*, course:courses(id, title)")
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
    const { id, status, notes, rating } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing lead ID." },
        { status: 400 }
      );
    }

    const updatePayload: any = {};

    if (status !== undefined) {
      const allowedStatuses = [
        "draft",
        "new",
        "contacted",
        "interested",
        "follow_up",
        "qualified",
        "converted",
        "rejected",
        "closed",
      ];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
      }
      updatePayload.status = status;
    }

    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    if (rating !== undefined) {
      const ratingVal = parseInt(rating);
      if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
        return NextResponse.json({ error: "Invalid rating value." }, { status: 400 });
      }
      updatePayload.rating = ratingVal;
    }

    const { error } = await supabaseAdmin
      .from("leads")
      .update(updatePayload)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update lead:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
