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

// Only these keys are real unlock_codes columns. Everything else the form/UI
// sends (bulk, bulk_count, prefix, …) is dropped so it can never be mistaken
// for a column ("Could not find the 'bulk' column …").
const UNLOCK_CODE_COLUMNS = [
  "training_type", "code", "course_id", "batch_label",
  "seats", "seats_used", "max_uses", "used_count",
  "valid_from", "valid_until", "expires_at",
  "college_id", "organization_id",
  "coordinator_name", "coordinator_email", "allowed_email_domain",
  "notes", "is_active", "status",
] as const;

function pickCodeColumns(body: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(body).filter(([k, v]) => UNLOCK_CODE_COLUMNS.includes(k as never) && v !== undefined)
  );
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  // We don't keep expired vouchers around — purge any whose expiry has passed before listing.
  // Best-effort: a purge failure must never block the list.
  try {
    await db
      .from("unlock_codes")
      .delete()
      .not("expires_at", "is", null)
      .lt("expires_at", new Date().toISOString());
  } catch { /* noop */ }

  // Only `courses` is a real FK on unlock_codes. `colleges`/`clients` are NOT related here —
  // joining them makes PostgREST throw "could not find a relationship …" and crashes the page.
  const { data, error } = await db
    .from("unlock_codes")
    .select("*, courses(title)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ codes: data });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  try {
    const body = await req.json();
    
    // Check if bulk generation is requested
    if (body.bulk && body.bulk_count && typeof body.bulk_count === "number") {
      const { bulk_count, prefix } = body;
      const commonFields = pickCodeColumns(body);
      const codesToInsert = [];
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
      for (let i = 0; i < bulk_count; i++) {
        let randomPart = "";
        for (let j = 0; j < 6; j++) {
          randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        codesToInsert.push({
          ...commonFields,
          code: `${prefix || ""}${randomPart}`,
        });
      }
      
      const { data, error } = await db.from("unlock_codes").insert(codesToInsert).select();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      
      // Log audit trail
      try {
        await db.from("audit_logs").insert(
          data.map((c: any) => ({
            actor: "admin",
            action: "bulk_create_access_code",
            entity_type: "unlock_codes",
            entity_id: c.id,
            meta: { code: c.code, training_type: c.training_type },
          }))
        );
      } catch (logErr) {
        console.error("Failed to write bulk audit logs:", logErr);
      }
      
      return NextResponse.json({ codes: data });
    } else {
      // Single code generation — insert only real columns (drops bulk/prefix/etc.)
      const row = pickCodeColumns(body);
      const { data, error } = await db.from("unlock_codes").insert([row]).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      
      // Log audit trail
      try {
        await db.from("audit_logs").insert([
          {
            actor: "admin",
            action: "create_access_code",
            entity_type: "unlock_codes",
            entity_id: data.id,
            meta: { code: data.code, training_type: data.training_type },
          }
        ]);
      } catch (logErr) {
        console.error("Failed to write audit log:", logErr);
      }
      
      return NextResponse.json({ code: data });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
