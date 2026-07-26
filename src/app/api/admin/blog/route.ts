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

const SORTABLE = ["title", "slug", "category_title", "author_name", "published_at", "created_at", "is_published"];

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  // Server-side pagination / search / sort / status filter (reference pattern; backward compatible).
  const sp = new URL(req.url).searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") || "10", 10) || 10));
  const q = (sp.get("q") || "").trim().replace(/[%,()]/g, ""); // sanitize for .or filter
  const status = sp.get("status") || "";
  const sort = SORTABLE.includes(sp.get("sort") || "") ? (sp.get("sort") as string) : "published_at";
  const ascending = (sp.get("dir") || "desc") === "asc";

  let query = db.from("blog_posts").select("*", { count: "exact" });
  if (q) query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%,category_title.ilike.%${q}%,author_name.ilike.%${q}%`);
  if (status === "published") query = query.eq("is_published", true);
  else if (status === "draft") query = query.eq("is_published", false);
  query = query.order(sort, { ascending }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data ?? [], total: count ?? (data?.length ?? 0) });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  try {
    const body = await req.json();
    const { data, error } = await db.from("blog_posts").insert([body]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    try { revalidatePath("/blog"); } catch {}
    return NextResponse.json({ post: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
