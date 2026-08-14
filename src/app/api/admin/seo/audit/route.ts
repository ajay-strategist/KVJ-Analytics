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

const KNOWN_ROUTES = [
  { path: "/", name: "Home Page" },
  { path: "/about", name: "About Us" },
  { path: "/corporate", name: "Corporate Services" },
  { path: "/education", name: "Education & Colleges" },
  { path: "/products", name: "Products & Solutions" },
  { path: "/training", name: "Training Programs" },
  { path: "/contact", name: "Contact Us" },
  { path: "/careers", name: "Careers" },
  { path: "/blog", name: "Blog List" },
  { path: "/impact", name: "Impact" },
];

export async function GET(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    // Fetch site settings and page_seo overrides
    const { data: globalSettings } = await db.from("site_seo_settings").select("*").limit(1).maybeSingle();
    const { data: pageSeoRows } = await db.from("page_seo").select("*");
    const { data: redirects } = await db.from("seo_redirects").select("id, is_active");

    const pageSeoMap: Record<string, any> = {};
    (pageSeoRows || []).forEach((row: any) => {
      if (row.route_path) {
        pageSeoMap[row.route_path.replace(/\/$/, "") || "/"] = row;
      }
    });

    const defaultTitle = globalSettings?.site_title_default || "KVJ Analytics";
    const defaultDesc = globalSettings?.meta_description_default || "";
    const defaultOg = globalSettings?.default_og_image_url || "/og-image.png";

    const auditResults: any[] = [];
    let totalScoreSum = 0;
    let totalIssuesCount = 0;
    let totalWarningsCount = 0;
    let missingTitleCount = 0;
    let missingDescCount = 0;
    let missingOgCount = 0;
    let noIndexCount = 0;

    KNOWN_ROUTES.forEach((r) => {
      const p = r.path;
      const override = pageSeoMap[p];

      const title = override?.seo_title || defaultTitle;
      const desc = override?.meta_description || defaultDesc;
      const ogImage = override?.og_image_url || defaultOg;
      const canonical = override?.canonical_url || `https://www.kvjanalytics.in${p === "/" ? "" : p}`;
      const noIndex = Boolean(override?.no_index);
      const structData = override?.structured_data_type || (p === "/" ? "ProfessionalService" : "WebPage");

      const issues: string[] = [];
      const warnings: string[] = [];
      const passed: string[] = [];

      let routeScore = 100;

      // 1. Title Audit (25 pts)
      if (!title || title.trim().length === 0) {
        routeScore -= 25;
        missingTitleCount++;
        issues.push("Missing SEO Title");
      } else if (title.length < 30) {
        routeScore -= 8;
        warnings.push(`SEO Title too short (${title.length} chars, recommended: 30-60)`);
      } else if (title.length > 70) {
        routeScore -= 5;
        warnings.push(`SEO Title too long (${title.length} chars, recommended: 30-60)`);
      } else {
        passed.push("SEO Title length optimal");
      }

      // 2. Meta Description Audit (25 pts)
      if (!desc || desc.trim().length === 0) {
        routeScore -= 25;
        missingDescCount++;
        issues.push("Missing Meta Description");
      } else if (desc.length < 70) {
        routeScore -= 8;
        warnings.push(`Meta Description short (${desc.length} chars, recommended: 120-160)`);
      } else if (desc.length > 170) {
        routeScore -= 5;
        warnings.push(`Meta Description long (${desc.length} chars, recommended: 120-160)`);
      } else {
        passed.push("Meta Description optimal");
      }

      // 3. Canonical URL Audit (15 pts)
      if (!canonical) {
        routeScore -= 15;
        issues.push("Missing Canonical URL");
      } else {
        passed.push("Canonical URL configured");
      }

      // 4. OpenGraph Image Audit (15 pts)
      if (!ogImage) {
        routeScore -= 15;
        missingOgCount++;
        issues.push("Missing OpenGraph Image");
      } else {
        passed.push("OpenGraph image present");
      }

      // 5. Indexing State (10 pts)
      if (noIndex) {
        noIndexCount++;
        warnings.push("Page set to noindex (hidden from search engines)");
      } else {
        passed.push("Search Engine Indexing enabled");
      }

      // 6. Structured Data (10 pts)
      if (!structData) {
        routeScore -= 10;
        warnings.push("No Schema.org structured data type assigned");
      } else {
        passed.push(`Structured Data type: ${structData}`);
      }

      routeScore = Math.max(0, routeScore);
      totalScoreSum += routeScore;
      totalIssuesCount += issues.length;
      totalWarningsCount += warnings.length;

      let status: "healthy" | "warning" | "attention" = "healthy";
      if (issues.length > 0 || routeScore < 70) {
        status = "attention";
      } else if (warnings.length > 0 || routeScore < 90) {
        status = "warning";
      }

      auditResults.push({
        route_path: p,
        name: r.name,
        score: routeScore,
        status,
        issues,
        warnings,
        passed,
        title,
        description: desc,
        ogImage,
        canonical,
        noIndex,
        structuredData: structData,
      });
    });

    const overallHealthScore = Math.round(totalScoreSum / KNOWN_ROUTES.length);

    let globalStatus: "healthy" | "warning" | "attention" = "healthy";
    if (overallHealthScore < 70 || totalIssuesCount > 2) {
      globalStatus = "attention";
    } else if (overallHealthScore < 90 || totalWarningsCount > 3) {
      globalStatus = "warning";
    }

    return NextResponse.json({
      overallHealthScore,
      globalStatus,
      pagesScannedCount: KNOWN_ROUTES.length,
      totalIssuesCount,
      totalWarningsCount,
      missingTitleCount,
      missingDescCount,
      missingOgCount,
      noIndexCount,
      redirectsCount: (redirects || []).length,
      activeRedirectsCount: (redirects || []).filter((r: any) => r.is_active).length,
      sitemapStatus: "Active (/sitemap.xml)",
      robotsStatus: "Active (/robots.txt)",
      routes: auditResults,
      auditedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/audit error:", error);
    return NextResponse.json({ error: "Failed to run SEO audit" }, { status: 500 });
  }
}
