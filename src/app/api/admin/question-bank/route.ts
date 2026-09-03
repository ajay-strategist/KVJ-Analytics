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

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return unauthorized();
  const db = getAdmin();
  if (!db) return notConfigured();

  try {
    const { data, error } = await db
      .from("questions")
      .select("*");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const formatted = (data || []).map((q: any) => {
      const copy = { ...q };
      let config = copy.config;
      if (typeof config === "string") {
        try { config = JSON.parse(config); } catch { config = {}; }
      }
      if (copy.type === "dragtable" && (config?.isPivotTable || config?.sourceTable || config?.sourceMode)) {
        copy.type = "pivot_table";
      }
      return copy;
    });

    // Deduplicate by stem to present a clean question bank list
    const uniqueQuestions: any[] = [];
    const stems = new Set<string>();
    formatted.forEach((q: any) => {
      const cleanStem = String(q.stem || "").trim().toLowerCase();
      if (cleanStem && !stems.has(cleanStem)) {
        stems.add(cleanStem);
        uniqueQuestions.push(q);
      }
    });

    return NextResponse.json({ questions: uniqueQuestions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 });
  }
}
