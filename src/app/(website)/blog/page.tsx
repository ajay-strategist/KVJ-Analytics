import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { supabase } from "@/lib/supabase";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_BLOG } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { BlogListClient } from "@/components/blog/BlogListClient";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Blog — Excel, Power BI, Automation & Analytics Insights",
  description:
    "Practical guides on Excel automation, Power BI dashboards, report automation, and data analytics for businesses and institutions — from the KVJ Analytics team.",
  path: "/blog",
  keywords: ["Excel tips", "Power BI blog", "report automation guide", "data analytics articles", "business intelligence blog"],
});

const FALLBACK_POSTS = [
  {
    id: "post1",
    title: "Why Data-Driven Organizations Consistently Outperform Their Competition",
    slug: "why-data-driven-organizations-consistently-outperform-their-competition",
    description: "Leaders who make decisions backed by evidence rather than assumptions consistently outperform. Discover how Business Intelligence creates a single source of truth for competitive advantage.",
    body_html: "<p>Leaders who make decisions backed by evidence rather than assumptions consistently outperform.</p>",
    published_at: "2026-07-20T08:00:00.000Z",
    featured: true,
    author_name: "K. V. Jacob",
    author_slug: "k-v-jacob",
    category_title: "Business Intelligence",
    category_slug: "business-intelligence",
    cover_url: "",
    featured_flags: ["featured", "latest"],
    tags: ["business-intelligence", "data-driven", "decision-making"],
  },
  {
    id: "post2",
    title: "Digital Transformation: Building Smarter Businesses for the Future",
    slug: "digital-transformation-building-smarter-businesses-for-the-future",
    description: "Digital Transformation is about improving how organisations operate, collaborate, and create value using data, processes, and technology.",
    body_html: "<p>Digital Transformation is a strategic journey that combines people, processes, technology, and data.</p>",
    published_at: "2026-07-15T09:00:00.000Z",
    featured: false,
    author_name: "K. V. Jacob",
    author_slug: "k-v-jacob",
    category_title: "Digital Transformation",
    category_slug: "digital-transformation",
    cover_url: "",
    featured_flags: ["trending", "popular"],
    tags: ["digital-transformation", "cloud", "automation", "strategy"],
  },
  {
    id: "post3",
    title: "How Artificial Intelligence is Revolutionising Business Analytics",
    slug: "how-artificial-intelligence-is-revolutionising-business-analytics",
    description: "AI has evolved from a futuristic concept into a practical business tool, empowering organisations to move from reactive analytics to proactive business planning.",
    body_html: "<p>Artificial Intelligence empowers organisations to make smarter decisions faster than ever before.</p>",
    published_at: "2026-07-10T09:00:00.000Z",
    featured: false,
    author_name: "K. V. Jacob",
    author_slug: "k-v-jacob",
    category_title: "Artificial Intelligence",
    category_slug: "artificial-intelligence",
    cover_url: "",
    featured_flags: ["latest"],
    tags: ["artificial-intelligence", "ai", "predictive-analytics", "machine-learning"],
  },
];

export default async function BlogPage() {
  // Fetch posts from Supabase `blog_posts` (or fallback to memory mockDb)
  let fetchedPosts: any[] = [];
  try {
    const { data: rows, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
      
    if (!error && rows && rows.length > 0) {
      fetchedPosts = rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        description: r.description || "",
        body_html: r.body_html || "",
        cover_url: r.cover_url || undefined,
        category_title: r.category_title || "Insights",
        category_slug: r.category_slug || "insights",
        author_name: r.author_name || "KVJ Analytics",
        author_slug: r.author_slug || "kvj-analytics",
        published_at: r.published_at,
        featured: !!r.featured,
        featured_flags: r.featured_flags || (r.featured ? ["featured"] : []),
        tags: r.tags || [],
      }));
    }
  } catch (err) {
    console.warn("Supabase blog fetch error, falling back:", err);
  }

  const header = mergePageContent(await getPageContent("blog"), FALLBACK_BLOG);
  const posts = fetchedPosts.length > 0 ? fetchedPosts : FALLBACK_POSTS;

  return (
    <Section background="default" className="bg-[#050608] relative overflow-hidden py-16 md:py-24">
      {/* Decorative background glows & patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial-glow opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial-glow-teal opacity-40 pointer-events-none" />

      <Container className="relative z-10 max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Eyebrow className="mb-4">{header.eyebrow}</Eyebrow>
          <BoldStatement variant="h1" className="mb-4 text-white leading-tight tracking-tight">
            {header.headingLead}{header.headingAccent ? ` ${header.headingAccent}` : ""}
          </BoldStatement>
          <p className="text-lg text-slate leading-relaxed font-light">
            {header.intro}
          </p>
        </div>

        {/* Dynamic client list component with search, filter, and bento layouts */}
        <BlogListClient posts={posts} header={header} />
      </Container>
    </Section>
  );
}
