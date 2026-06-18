import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kvj-analytics",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "www.kvjanalytics.in";
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl = `${protocol}://${host}`;

  // Static URLs
  const staticPaths = [
    "",
    "/about",
    "/corporate",
    "/education",
    "/products",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const dynamicPaths: string[] = [];

  try {
    // Fetch dynamic content from Sanity
    const services = await client.fetch(`*[_type == "service"]{ "slug": slug.current, category }`);
    const products = await client.fetch(`*[_type == "product"]{ "slug": slug.current }`);
    const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);

    services.forEach((s: any) => {
      dynamicPaths.push(`/${s.category}/${s.slug}`);
    });
    products.forEach((p: any) => {
      dynamicPaths.push(`/products/${p.slug}`);
    });
    posts.forEach((post: any) => {
      dynamicPaths.push(`/blog/${post.slug}`);
    });
  } catch (err) {
    console.error("Sitemap generator fetching error:", err);
    // Add default placeholders if Sanity fetch fails during offline compile
    dynamicPaths.push("/corporate/report-automation");
    dynamicPaths.push("/corporate/dashboard-development");
    dynamicPaths.push("/education/training-programs");
    dynamicPaths.push("/products/grade-scope");
    dynamicPaths.push("/products/protrix");
    dynamicPaths.push("/blog/excel-reports-automation");
  }

  const allUrls = [...staticPaths, ...dynamicPaths].map((path) => `${baseUrl}${path}`);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${url.includes("/blog/") ? "monthly" : "weekly"}</changefreq>
    <priority>${url.endsWith("/") ? "1.0" : url.includes("/admin") ? "0.0" : "0.8"}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
