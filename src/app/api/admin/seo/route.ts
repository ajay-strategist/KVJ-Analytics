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

    // 1. Global site settings
    const { data: globalSettings } = await db.from("site_seo_settings").select("*").limit(1).maybeSingle();

    // 2. Page SEO records
    const { data: pageSeoRows } = await db.from("page_seo").select("*").order("route_path", { ascending: true });

    // 3. Existing Courses & Blog Posts for SEO override tab
    const { data: courses } = await db.from("courses").select("id, slug, title, is_published, updated_at");
    const { data: blogPosts } = await db.from("blog_posts").select("id, slug, title, is_published, published_at");

    return NextResponse.json({
      siteSettings: globalSettings || {},
      pageSeo: pageSeoRows || [],
      courses: courses || [],
      blogPosts: blogPosts || [],
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await req.json();
    const { type } = body;

    // A. Update Global Settings
    if (type === "global") {
      const { settings } = body;
      if (!settings) {
        return NextResponse.json({ error: "Settings payload required." }, { status: 400 });
      }

      // Format validations
      if (settings.google_analytics_id && !/^G-[A-Z0-9]+$/i.test(settings.google_analytics_id.trim())) {
        return NextResponse.json({ error: "Invalid GA4 Measurement ID format (e.g. G-XXXXXXXXXX)." }, { status: 400 });
      }

      if (settings.google_tag_manager_id && !/^GTM-[A-Z0-9]+$/i.test(settings.google_tag_manager_id.trim())) {
        return NextResponse.json({ error: "Invalid GTM Container ID format (e.g. GTM-XXXXXXX)." }, { status: 400 });
      }

      const payload = {
        site_title_default: settings.site_title_default || "KVJ Analytics",
        title_template: settings.title_template || "%s | KVJ Analytics",
        meta_description_default: settings.meta_description_default || "",
        default_og_image_url: settings.default_og_image_url || "/og-image.png",
        twitter_handle: settings.twitter_handle || "@kvjanalytics",
        google_analytics_id: settings.google_analytics_id?.trim() || null,
        google_tag_manager_id: settings.google_tag_manager_id?.trim() || null,
        google_site_verification: settings.google_site_verification?.trim() || null,
        bing_site_verification: settings.bing_site_verification?.trim() || null,
        custom_robots_txt: settings.custom_robots_txt || null,
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await db.from("site_seo_settings").select("id").limit(1).maybeSingle();

      let saved: any = null;
      let saveErr: any = null;

      if (existing?.id) {
        const res = await db.from("site_seo_settings").update(payload).eq("id", existing.id).select().single();
        saved = res.data;
        saveErr = res.error;
      } else {
        const res = await db.from("site_seo_settings").insert([payload]).select().single();
        saved = res.data;
        saveErr = res.error;
      }

      if (saveErr) {
        console.error("Failed to save global SEO settings:", saveErr);
        return NextResponse.json({ error: saveErr.message || "Failed to save global settings." }, { status: 500 });
      }

      return NextResponse.json({ success: true, settings: saved });
    }

    // B. Update / Create Page SEO Record
    if (type === "page") {
      const { page } = body;
      if (!page || !page.route_path) {
        return NextResponse.json({ error: "Route path is required for page SEO." }, { status: 400 });
      }

      const cleanRoutePath = page.route_path.trim().startsWith("/")
        ? page.route_path.trim()
        : `/${page.route_path.trim()}`;

      // Validate custom schema JSON if provided
      let validCustomSchema = null;
      if (page.custom_schema_json) {
        try {
          if (typeof page.custom_schema_json === "string") {
            validCustomSchema = JSON.parse(page.custom_schema_json);
          } else {
            validCustomSchema = page.custom_schema_json;
          }
        } catch {
          return NextResponse.json({ error: "Invalid Custom Schema JSON format." }, { status: 400 });
        }
      }

      const payload = {
        route_path: cleanRoutePath,
        seo_title: page.seo_title || null,
        meta_description: page.meta_description || null,
        keywords: page.keywords || null,
        canonical_url: page.canonical_url || null,
        og_title: page.og_title || null,
        og_description: page.og_description || null,
        og_image_url: page.og_image_url || null,
        no_index: Boolean(page.no_index),
        no_follow: Boolean(page.no_follow),
        structured_data_type: page.structured_data_type || "WebPage",
        custom_schema_json: validCustomSchema,
        updated_at: new Date().toISOString(),
      };

      const { data: existingPage } = await db.from("page_seo").select("id").eq("route_path", cleanRoutePath).maybeSingle();

      let saved: any = null;
      let saveErr: any = null;

      if (existingPage?.id) {
        const res = await db.from("page_seo").update(payload).eq("id", existingPage.id).select().single();
        saved = res.data;
        saveErr = res.error;
      } else {
        const res = await db.from("page_seo").insert([payload]).select().single();
        saved = res.data;
        saveErr = res.error;
      }

      if (saveErr) {
        console.error("Failed to save page SEO record:", saveErr);
        return NextResponse.json({ error: saveErr.message || "Failed to save page SEO." }, { status: 500 });
      }

      return NextResponse.json({ success: true, page: saved });
    }

    return NextResponse.json({ error: "Invalid type specified." }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/admin/seo error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
