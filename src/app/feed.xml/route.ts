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

  let posts: any[] = [];

  try {
    posts = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc) [0..10] {
        title,
        "slug": slug.current,
        publishedAt,
        category->{ title },
        author->{ name },
        description
      }
    `);
  } catch (err) {
    console.error("RSS feed generation fetching error:", err);
    // Fallback posts list
    posts = [
      {
        title: "Smarter Excel Reports: 3 Automation Workflows for Modern Offices",
        slug: "excel-reports-automation",
        publishedAt: "2026-06-10T08:00:00.000Z",
        category: { title: "Report Automation" },
        author: { name: "K. V. Jacob" },
        description: "Repetitive MIS reporting costs businesses hundreds of hours. Discover how to streamline spreadsheets and connect live ERP data.",
      },
    ];
  }

  const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>KVJ Analytics - Blog & Insights</title>
  <link>${baseUrl}/blog</link>
  <description>Stay updated on report automation, dashboard designs, corporate training, and educational technology insights.</description>
  <language>en-in</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  ${posts
    .map(
      (post) => `
  <item>
    <title>${post.title}</title>
    <link>${baseUrl}/blog/${post.slug}</link>
    <guid>${baseUrl}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    <description><![CDATA[${post.description || "Read full details on KVJ Analytics blog."}]]></description>
    <category>${post.category?.title || "Data"}</category>
  </item>`
    )
    .join("")}
</channel>
</rss>`;

  return new NextResponse(feedXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
