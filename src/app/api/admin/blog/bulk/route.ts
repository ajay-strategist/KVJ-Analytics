/**
 * POST /api/admin/blog/bulk — batch operations for the blog list bulk actions.
 * Body: { action: "publish" | "unpublish" | "delete", ids: string[] }.
 * One round-trip per action (`.in("id", ids)`). Admin-guarded. Reference pattern for future modules.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
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

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  let body: { action?: string; ids?: string[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const { action, ids } = body;
  if (!action || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "action and non-empty ids are required." }, { status: 400 });
  }

  let error;
  if (action === "delete") {
    ({ error } = await db.from("blog_posts").delete().in("id", ids));
  } else if (action === "publish" || action === "unpublish") {
    ({ error } = await db.from("blog_posts").update({ is_published: action === "publish" }).in("id", ids));
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  try { revalidatePath("/blog"); } catch { /* noop */ }
  return NextResponse.json({ success: true, count: ids.length });
}
