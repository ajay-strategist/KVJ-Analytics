import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === adminToken();
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { bulk, bulk_count, prefix, ...updateData } = body;
    const { data, error } = await db
      .from("unlock_codes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Log audit trail
    try {
      await db.from("audit_logs").insert([
        {
          actor: "admin",
          action: "update_access_code",
          entity_type: "unlock_codes",
          entity_id: id,
          meta: { updates: body, code: data?.code },
        }
      ]);
    } catch (logErr) {
      console.error("Failed to write audit log:", logErr);
    }

    return NextResponse.json({ code: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const { id } = await params;
  
  // Fetch code details before deleting for meta info in log
  let codeDetail: any = null;
  try {
    const { data } = await db.from("unlock_codes").select("code, training_type").eq("id", id).maybeSingle();
    codeDetail = data;
  } catch { /* noop */ }

  const { error } = await db.from("unlock_codes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log audit trail
  try {
    await db.from("audit_logs").insert([
      {
        actor: "admin",
        action: "delete_access_code",
        entity_type: "unlock_codes",
        entity_id: id,
        meta: { code: codeDetail?.code, training_type: codeDetail?.training_type },
      }
    ]);
  } catch (logErr) {
    console.error("Failed to write audit log:", logErr);
  }

  return NextResponse.json({ success: true });
}
