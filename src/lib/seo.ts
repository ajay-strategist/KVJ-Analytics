import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

// Production site URL (override with NEXT_PUBLIC_SITE_URL in Vercel/env).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.kvjanalytics.in";

export const SITE_NAME = "KVJ Analytics";

const DEFAULT_OG = "/og-image.png";

export interface SiteSeoSettings {
  id?: string;
  site_title_default?: string;
  title_template?: string;
  meta_description_default?: string;
  default_og_image_url?: string;
  twitter_handle?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  google_site_verification?: string;
  bing_site_verification?: string;
  custom_robots_txt?: string;
  updated_at?: string;
}

export interface PageSeoRecord {
  id?: string;
  route_path: string;
  seo_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  no_index?: boolean;
  no_follow?: boolean;
  structured_data_type?: string | null;
  custom_schema_json?: any;
  updated_at?: string;
}

export interface SeoRedirectRecord {
  id?: string;
  source_path: string;
  target_path: string;
  redirect_type: 301 | 302;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

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

// In-memory server cache to avoid excessive DB hits during page rendering
let siteSettingsCache: { at: number; data: SiteSeoSettings } | null = null;
let pageSeoCache: { at: number; map: Record<string, PageSeoRecord> } | null = null;

/**
 * Fetch global SEO & Analytics settings with 60s in-memory caching.
 */
export async function getSiteSeoSettings(): Promise<SiteSeoSettings> {
  if (siteSettingsCache && Date.now() - siteSettingsCache.at < 60_000) {
    return siteSettingsCache.data;
  }

  const defaults: SiteSeoSettings = {
    site_title_default: "KVJ Analytics | Power BI, Excel & Report Automation Training & Consulting",
    title_template: "%s | KVJ Analytics",
    meta_description_default: "KVJ Analytics delivers Power BI dashboards, Excel & report automation, and data analytics consulting — plus corporate, college & individual training.",
    default_og_image_url: DEFAULT_OG,
    twitter_handle: "@kvjanalytics",
    google_analytics_id: process.env.NEXT_PUBLIC_GA_ID || "",
    google_tag_manager_id: process.env.NEXT_PUBLIC_GTM_ID || "",
    google_site_verification: "",
    bing_site_verification: "",
    custom_robots_txt: "",
  };

  try {
    const db = getSupabaseClient();
    if (!db) return defaults;

    const { data } = await db.from("site_seo_settings").select("*").limit(1).maybeSingle();
    const result = data ? { ...defaults, ...data } : defaults;
    siteSettingsCache = { at: Date.now(), data: result };
    return result;
  } catch {
    return defaults;
  }
}

/**
 * Fetch single page SEO override record with caching.
 */
export async function getPageSeo(routePath: string): Promise<PageSeoRecord | null> {
  const cleanPath = routePath.replace(/\/$/, "") || "/";
  if (pageSeoCache && Date.now() - pageSeoCache.at < 60_000) {
    return pageSeoCache.map[cleanPath] || null;
  }

  try {
    const db = getSupabaseClient();
    if (!db) return null;

    const { data } = await db.from("page_seo").select("*");
    const map: Record<string, PageSeoRecord> = {};
    (data || []).forEach((row: PageSeoRecord) => {
      if (row.route_path) {
        const p = row.route_path.replace(/\/$/, "") || "/";
        map[p] = row;
      }
    });

    pageSeoCache = { at: Date.now(), map };
    return map[cleanPath] || null;
  } catch {
    return null;
  }
}

/**
 * Build page metadata with sensible SEO defaults (canonical, OpenGraph, Twitter).
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string; // e.g. "/corporate"
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${opts.path === "/" ? "" : opts.path}`;
  const image = opts.image || DEFAULT_OG;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

/**
 * Server-side dynamic SEO Resolver.
 * Resolves priority: 1. Admin Page Override -> 2. Page Fallback Options -> 3. Global DB Defaults -> 4. Hardcoded Fallback.
 */
export async function resolveSeo(
  routePath: string,
  fallbackOpts?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  }
): Promise<Metadata> {
  const cleanPath = routePath.replace(/\/$/, "") || "/";
  const globalSettings = await getSiteSeoSettings();
  const pageOverride = await getPageSeo(cleanPath);

  const defaultTitle = fallbackOpts?.title || globalSettings.site_title_default || "KVJ Analytics";
  const defaultDesc = fallbackOpts?.description || globalSettings.meta_description_default || "";
  const defaultImg = fallbackOpts?.image || globalSettings.default_og_image_url || DEFAULT_OG;

  const resolvedTitle = pageOverride?.seo_title || defaultTitle;
  const resolvedDesc = pageOverride?.meta_description || defaultDesc;
  const resolvedOgTitle = pageOverride?.og_title || pageOverride?.seo_title || resolvedTitle;
  const resolvedOgDesc = pageOverride?.og_description || pageOverride?.meta_description || resolvedDesc;
  const resolvedOgImage = pageOverride?.og_image_url || defaultImg;
  const resolvedCanonical = pageOverride?.canonical_url || `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;

  const resolvedKeywords = pageOverride?.keywords
    ? pageOverride.keywords.split(",").map((k) => k.trim())
    : fallbackOpts?.keywords || [];

  const isNoIndex = Boolean(pageOverride?.no_index);
  const isNoFollow = Boolean(pageOverride?.no_follow);

  return {
    title: resolvedTitle,
    description: resolvedDesc,
    keywords: resolvedKeywords.length > 0 ? resolvedKeywords : undefined,
    alternates: { canonical: resolvedCanonical },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
      googleBot: {
        index: !isNoIndex,
        follow: !isNoFollow,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDesc,
      url: resolvedCanonical,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: resolvedOgImage, width: 1200, height: 630, alt: resolvedOgTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description: resolvedOgDesc,
      images: [resolvedOgImage],
    },
  };
}

/**
 * Organization + LocalBusiness structured data (JSON-LD) for the homepage/site.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}${DEFAULT_OG}`,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Analytics, automation and training company delivering Power BI dashboards, Excel & report automation, spreadsheet consulting, and corporate, college & individual training.",
    email: "info@kvjanalytics.in",
    telephone: "+91-9961813730",
    areaServed: ["India", "UAE", "Oman", "USA", "Europe"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "3rd Floor, Lalan Towers, Banerji Road, High Court Jn.",
      addressLocality: "Cochin",
      addressRegion: "Kerala",
      postalCode: "682031",
      addressCountry: "IN",
    },
    sameAs: [] as string[],
    knowsAbout: [
      "Power BI",
      "Microsoft Excel",
      "Report Automation",
      "Data Analytics",
      "Business Intelligence",
      "Corporate Training",
      "Data Visualization Consulting",
    ],
  };
}

/**
 * Course JSON-LD Structured Data
 */
export function courseSchema(course: {
  title: string;
  description?: string;
  slug: string;
  provider?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description || `${course.title} training program by KVJ Analytics.`,
    provider: {
      "@type": "Organization",
      name: course.provider || SITE_NAME,
      sameAs: SITE_URL,
    },
    url: `${SITE_URL}/training/${course.slug}`,
  };
}

/**
 * BlogPosting JSON-LD Structured Data
 */
export function blogPostingSchema(post: {
  title: string;
  excerpt?: string;
  slug: string;
  published_at?: string;
  author_name?: string;
  cover_image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.published_at || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: post.author_name || "KVJ Analytics Team",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    image: post.cover_image ? `${SITE_URL}${post.cover_image}` : `${SITE_URL}${DEFAULT_OG}`,
  };
}

/**
 * BreadcrumbList JSON-LD Structured Data
 */
export function breadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith("http") ? it.item : `${SITE_URL}${it.item}`,
    })),
  };
}
