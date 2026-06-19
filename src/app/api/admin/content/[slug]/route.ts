/**
 * /api/admin/content/[slug]
 * GET  → returns stored JSON merged with fallback
 * PUT  → upserts JSON into page_content table
 * Protected by admin_session cookie (same as all other admin APIs).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  FALLBACK_HOME_PAGE,
  FALLBACK_SITE_SETTINGS,
  FALLBACK_ABOUT,
  FALLBACK_CORPORATE,
  FALLBACK_EDUCATION,
  FALLBACK_PRODUCTS_PAGE,
  FALLBACK_CONTACT
} from "@/lib/constants";

// ---------------------------------------------------------------------------
// Service-role admin client (write access)
// ---------------------------------------------------------------------------
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// ---------------------------------------------------------------------------
// Auth guard (same pattern as all other admin API routes)
// ---------------------------------------------------------------------------
function isAuthorized(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === "authenticated";
}

// ---------------------------------------------------------------------------
// Fallback map (slug → default object)
// ---------------------------------------------------------------------------
const FALLBACKS: Record<string, Record<string, unknown>> = {
  home: FALLBACK_HOME_PAGE as unknown as Record<string, unknown>,
  "site-settings": FALLBACK_SITE_SETTINGS as unknown as Record<string, unknown>,
  about: FALLBACK_ABOUT as unknown as Record<string, unknown>,
  corporate: FALLBACK_CORPORATE as unknown as Record<string, unknown>,
  education: FALLBACK_EDUCATION as unknown as Record<string, unknown>,
  products: FALLBACK_PRODUCTS_PAGE as unknown as Record<string, unknown>,
  contact: FALLBACK_CONTACT as unknown as Record<string, unknown>,
};

// ---------------------------------------------------------------------------
// GET /api/admin/content/[slug]
// ---------------------------------------------------------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { slug } = await params;
  const client = getAdminClient();
  if (!client)
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const { data, error } = await client
    .from("page_content")
    .select("data, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const stored = (data?.data as Record<string, unknown>) ?? {};
  const fallback = FALLBACKS[slug] ?? {};

  return NextResponse.json({
    slug,
    stored,
    fallback,
    updated_at: data?.updated_at ?? null,
  });
}

// ---------------------------------------------------------------------------
// PUT /api/admin/content/[slug]
// ---------------------------------------------------------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { slug } = await params;
  const client = getAdminClient();
  if (!client)
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { error } = await client.from("page_content").upsert(
    { slug, data: body, updated_at: new Date().toISOString() },
    { onConflict: "slug" }
  );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Revalidate corresponding page paths dynamically
  try {
    if (slug === "home") {
      revalidatePath("/");
    } else if (slug === "about") {
      revalidatePath("/about");
    } else if (slug === "corporate") {
      revalidatePath("/corporate");
      revalidatePath("/corporate/[slug]", "page");
    } else if (slug === "education") {
      revalidatePath("/education");
      revalidatePath("/education/[slug]", "page");
      revalidatePath("/training");
    } else if (slug === "products") {
      revalidatePath("/products");
      revalidatePath("/products/[slug]", "page");
    } else if (slug === "contact") {
      revalidatePath("/contact");
    } else if (slug === "site-settings") {
      revalidatePath("/", "layout");
    }
  } catch (err) {
    console.error("Revalidation failed for slug:", slug, err);
  }

  return NextResponse.json({ success: true, slug });
}
