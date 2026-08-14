import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

const STATIC_PATHS = [
  "", "/about", "/corporate", "/education", "/products", "/training",
  "/training/online-courses", "/training/internships", "/training/corporate",
  "/training/colleges", "/training/one-to-one", "/contact", "/careers",
  "/blog", "/impact", "/privacy", "/terms",
];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("placeholder")) {
    try {
      return require("@/lib/mockSupabase").mockSupabaseClient;
    } catch {
      return null;
    }
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const db = getSupabaseClient();

  // Fetch page_seo records to check no_index flags
  let noIndexPaths = new Set<string>();
  if (db) {
    try {
      const { data: pageSeoRows } = await db.from("page_seo").select("route_path, no_index");
      (pageSeoRows || []).forEach((row: any) => {
        if (row.no_index && row.route_path) {
          noIndexPaths.add(row.route_path.replace(/\/$/, "") || "/");
        }
      });
    } catch (err) {
      console.warn("Sitemap: Failed to fetch page_seo noIndex flags:", err);
    }
  }

  const entries: MetadataRoute.Sitemap = [];

  // Static routes (skipping no_index routes)
  STATIC_PATHS.forEach((p) => {
    const cleanP = p === "" ? "/" : p;
    if (!noIndexPaths.has(cleanP)) {
      entries.push({
        url: `${SITE_URL}${p}`,
        lastModified: now,
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: p === "" ? 1 : p.startsWith("/training") || p === "/contact" ? 0.8 : 0.6,
      });
    }
  });

  // Dynamic: published courses
  if (db) {
    try {
      const { data } = await db.from("courses").select("slug, updated_at").eq("is_published", true);
      (data || []).forEach((c: any) => {
        if (c.slug) {
          const path = `/training/${c.slug}`;
          if (!noIndexPaths.has(path)) {
            entries.push({
              url: `${SITE_URL}${path}`,
              lastModified: c.updated_at ? new Date(c.updated_at) : now,
              changeFrequency: "weekly",
              priority: 0.7,
            });
          }
        }
      });
    } catch {}

    // Dynamic: published blog posts
    try {
      const { data } = await db.from("blog_posts").select("slug, published_at").eq("is_published", true);
      (data || []).forEach((b: any) => {
        if (b.slug) {
          const path = `/blog/${b.slug}`;
          if (!noIndexPaths.has(path)) {
            entries.push({
              url: `${SITE_URL}${path}`,
              lastModified: b.published_at ? new Date(b.published_at) : now,
              changeFrequency: "monthly",
              priority: 0.5,
            });
          }
        }
      });
    } catch {}

    // Dynamic: published jobs
    try {
      const { data } = await db.from("jobs").select("slug").eq("is_published", true);
      (data || []).forEach((j: any) => {
        if (j.slug) {
          const path = `/careers/${j.slug}`;
          if (!noIndexPaths.has(path)) {
            entries.push({
              url: `${SITE_URL}${path}`,
              lastModified: now,
              changeFrequency: "monthly",
              priority: 0.5,
            });
          }
        }
      });
    } catch {}
  }

  return entries;
}
