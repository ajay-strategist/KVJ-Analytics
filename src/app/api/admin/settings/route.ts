import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";
import { logAudit } from "@/lib/admin/auditLog";

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

const DEFAULTS = {
  siteName: "KVJ Analytics",
  supportEmail: "support@kvjanalytics.com",
  supportPhone: "",
  whatsappNumber: "",
  leadNotificationEmail: "",
  maintenanceMode: false,
  // Notification Integrations
  teamsWebhookUrl: "",
  telegramBotToken: "",
  telegramChatId: "",
};

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  const { data, error } = await db.from("page_content").select("data").eq("slug", "admin-settings").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: { ...DEFAULTS, ...(data?.data ?? {}) } });
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  const body = await req.json();
  const { error } = await db.from("page_content").upsert({ slug: "admin-settings", data: body, updated_at: new Date().toISOString() }, { onConflict: "slug" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(db, { action: "updated", entity_type: "settings" });
  return NextResponse.json({ settings: body });
}
