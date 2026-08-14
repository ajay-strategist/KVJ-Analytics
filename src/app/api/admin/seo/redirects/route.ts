import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes("placeholder")) {
    try {
      return require("@/lib/mockSupabase").mockSupabaseClient;
    } catch {
      return null;
    }
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const { data: redirects, error } = await db
      .from("seo_redirects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch redirects:", error);
      return NextResponse.json({ redirects: [] });
    }

    return NextResponse.json({ redirects: redirects || [] });
  } catch (error: any) {
    console.error("GET /api/admin/seo/redirects error:", error);
    return NextResponse.json({ redirects: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await req.json();
    const { source_path, target_path, redirect_type = 301, is_active = true } = body;

    if (!source_path || !target_path) {
      return NextResponse.json({ error: "Both source path and target path are required." }, { status: 400 });
    }

    const cleanSource = source_path.trim().startsWith("/") ? source_path.trim() : `/${source_path.trim()}`;
    const cleanTarget = target_path.trim().startsWith("/") || target_path.trim().startsWith("http")
      ? target_path.trim()
      : `/${target_path.trim()}`;

    if (cleanSource === cleanTarget) {
      return NextResponse.json({ error: "Source path and target path cannot be identical (prevents redirect loop)." }, { status: 400 });
    }

    // Check duplicate source
    const { data: existing } = await db.from("seo_redirects").select("id").eq("source_path", cleanSource).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: `A redirect rule for source path '${cleanSource}' already exists.` }, { status: 400 });
    }

    const payload = {
      source_path: cleanSource,
      target_path: cleanTarget,
      redirect_type: Number(redirect_type) === 302 ? 302 : 301,
      is_active: Boolean(is_active),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertErr } = await db
      .from("seo_redirects")
      .insert([payload])
      .select()
      .single();

    if (insertErr || !inserted) {
      console.error("Failed to insert redirect:", insertErr);
      return NextResponse.json({ error: insertErr?.message || "Failed to create redirect rule." }, { status: 500 });
    }

    return NextResponse.json({ success: true, redirect: inserted });
  } catch (error: any) {
    console.error("POST /api/admin/seo/redirects error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await req.json();
    const { id, is_active, redirect_type, target_path } = body;

    if (!id) {
      return NextResponse.json({ error: "Redirect ID is required." }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (is_active !== undefined) updatePayload.is_active = Boolean(is_active);
    if (redirect_type !== undefined) updatePayload.redirect_type = Number(redirect_type) === 302 ? 302 : 301;
    if (target_path !== undefined) updatePayload.target_path = target_path.trim();

    const { data: updated, error: updateErr } = await db
      .from("seo_redirects")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateErr || !updated) {
      console.error("Failed to update redirect:", updateErr);
      return NextResponse.json({ error: "Failed to update redirect rule." }, { status: 500 });
    }

    return NextResponse.json({ success: true, redirect: updated });
  } catch (error: any) {
    console.error("PATCH /api/admin/seo/redirects error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Redirect ID parameter is required." }, { status: 400 });
    }

    const { error: delErr } = await db.from("seo_redirects").delete().eq("id", id);
    if (delErr) {
      console.error("Failed to delete redirect:", delErr);
      return NextResponse.json({ error: "Failed to delete redirect rule." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/admin/seo/redirects error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
