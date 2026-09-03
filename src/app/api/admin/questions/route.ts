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

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
function notConfigured() {
  return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
}

function normalizeQuestionRecord(q: any) {
  if (!q) return q;
  const copy = { ...q };
  let config = copy.config;
  if (typeof config === "string") {
    try { config = JSON.parse(config); } catch { config = {}; }
  }
  if (copy.type === "dragtable" && (config?.isPivotTable || config?.sourceTable || config?.sourceMode)) {
    copy.type = "pivot_table";
  }
  return copy;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  const url = new URL(req.url);
  const testId = url.searchParams.get("test_id");
  if (!testId) return NextResponse.json({ error: "test_id query param is required" }, { status: 400 });

  try {
    const { data, error } = await db
      .from("questions")
      .select("*")
      .eq("test_id", testId)
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const formatted = (data || []).map(normalizeQuestionRecord);
    return NextResponse.json({ questions: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  try {
    let body = await req.json();
    
    // First try inserting as-is
    let { data, error } = await db.from("questions").insert([body]).select().single();

    // If check constraint questions_type_check failed for pivot_table, fallback to dragtable with isPivotTable flag
    if (error && body.type === "pivot_table" && (error.message.includes("questions_type_check") || error.message.includes("check constraint"))) {
      const fallbackBody = {
        ...body,
        type: "dragtable",
        config: {
          ...(typeof body.config === "object" ? body.config : {}),
          isPivotTable: true,
        },
      };
      const retry = await db.from("questions").insert([fallbackBody]).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ question: normalizeQuestionRecord(data) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Question ID is required" }, { status: 400 });

    let { data, error } = await db
      .from("questions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    // Fallback if pivot_table check constraint fails
    if (error && updates.type === "pivot_table" && (error.message.includes("questions_type_check") || error.message.includes("check constraint"))) {
      const fallbackUpdates = {
        ...updates,
        type: "dragtable",
        config: {
          ...(typeof updates.config === "object" ? updates.config : {}),
          isPivotTable: true,
        },
      };
      const retry = await db
        .from("questions")
        .update(fallbackUpdates)
        .eq("id", id)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ question: normalizeQuestionRecord(data) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Question ID is required" }, { status: 400 });

    const { error } = await db.from("questions").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request body" }, { status: 400 });
  }
}
