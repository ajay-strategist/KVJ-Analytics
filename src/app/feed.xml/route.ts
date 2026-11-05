import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "www.kvjanalytics.in";
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl = `${protocol}://${host}`;

  let posts: Array<{
    title: string;
    slug: string;
    publishedAt: string;
    category?: { title?: string };
    author?: { name?: string };
    description?: string;
  }> = [];

  try {
    const { data } = await supabase
      .from("posts")
      .select("title, slug, published_at, category_title, author_name, description")
      .order("published_at", { ascending: false })
      .limit(10);

    if (data && data.length > 0) {
      posts = (data as Array<{
        title: string;
        slug: string;
        published_at?: string;
        category_title?: string;
        author_name?: string;
        description?: string;
      }>).map((p) => ({
        title: p.title,
        slug: p.slug,
        publishedAt: p.published_at || new Date().toISOString(),
        category: { title: p.category_title },
        author: { name: p.author_name },
        description: p.description,
      }));
    }
  } catch (err) {
    console.error("RSS feed generation fetching error:", err);
  }

  if (posts.length === 0) {
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
