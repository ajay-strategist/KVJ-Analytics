import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

const STATIC_PATHS = [
  "", "/about", "/corporate", "/education", "/products", "/training",
  "/training/online-courses", "/training/internships", "/training/corporate",
  "/training/colleges", "/training/one-to-one", "/contact", "/careers",
  "/blog", "/impact", "/privacy", "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p.startsWith("/training") || p === "/contact" ? 0.8 : 0.6,
  }));

  // Dynamic: published courses
  try {
    const { data } = await supabase.from("courses").select("slug, updated_at").eq("is_published", true);
    (data || []).forEach((c: any) => {
      if (c.slug) entries.push({ url: `${SITE_URL}/training/${c.slug}`, lastModified: c.updated_at ? new Date(c.updated_at) : now, changeFrequency: "weekly", priority: 0.7 });
    });
  } catch {}

  // Dynamic: published blog posts
  try {
    const { data } = await supabase.from("blog_posts").select("slug, published_at").eq("is_published", true);
    (data || []).forEach((b: any) => {
      if (b.slug) entries.push({ url: `${SITE_URL}/blog/${b.slug}`, lastModified: b.published_at ? new Date(b.published_at) : now, changeFrequency: "monthly", priority: 0.5 });
    });
  } catch {}

  // Dynamic: published jobs
  try {
    const { data } = await supabase.from("jobs").select("slug").eq("is_published", true);
    (data || []).forEach((j: any) => {
      if (j.slug) entries.push({ url: `${SITE_URL}/careers/${j.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });
    });
  } catch {}

  return entries;
}
