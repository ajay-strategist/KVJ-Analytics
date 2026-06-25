import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { client } from "@/sanity/lib/client";
import { categoryBySlugQuery, postsByCategoryQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const FALLBACK_CATEGORIES: Record<string, { title: string; desc: string }> = {
  "report-automation": {
    title: "Report Automation",
    desc: "Guides and strategies for reducing manual MIS workload and connecting spreadsheets to live ERP logs.",
  },
  "data-analytics": {
    title: "Data Analytics",
    desc: "Articles on structuring dashboard interfaces, defining KPIs, and analyzing visual operational metrics.",
  },
  "educational-tech": {
    title: "Educational Technology",
    desc: "Insights on academic evaluation platforms, curriculum formatting, and bridging the classroom skill gap.",
  },
};

const FALLBACK_POSTS = [
  {
    title: "Smarter Excel Reports: 3 Automation Workflows for Modern Offices",
    slug: "excel-reports-automation",
    publishedAt: "2026-06-10T08:00:00.000Z",
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Report Automation", slug: "report-automation" },
    description: "Repetitive MIS reporting costs businesses hundreds of hours. Discover how to streamline spreadsheets and connect live ERP data.",
  },
  {
    title: "Why Power BI is the Gold Standard for Business Dashboards in 2026",
    slug: "power-bi-gold-standard",
    publishedAt: "2026-06-05T09:00:00.000Z",
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Data Analytics", slug: "data-analytics" },
    description: "Visual interfaces change how teams analyze KPIs. Learn the differences between spreadsheet charts and live dashboards.",
  },
  {
    title: "Bridging the College-to-Corporate Skill Gap: The Practical Analytics Approach",
    slug: "college-corporate-skill-gap",
    publishedAt: "2026-05-28T10:00:00.000Z",
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Educational Technology", slug: "educational-tech" },
    description: "Graduating with theoretical models is no longer enough. Colleges must transition to assignment-driven spreadsheet labs.",
  },
];

export default async function CategoryFilterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Query category info
  const categoryInfo = await client
    .fetch(categoryBySlugQuery, { slug })
    .catch(() => null);

  const fallbackCat = FALLBACK_CATEGORIES[slug];

  if (!categoryInfo && !fallbackCat) {
    notFound();
  }

  // Query posts matching category
  const postsData = await client
    .fetch(postsByCategoryQuery, { slug })
    .catch(() => null);

  const categoryTitle = categoryInfo?.title || fallbackCat.title;
  const categoryDesc = categoryInfo?.description || fallbackCat.desc;
  
  // Filter fallback posts
  const posts =
    postsData && postsData.length > 0
      ? postsData
      : FALLBACK_POSTS.filter((p) => p.category.slug === slug);

  return (
    <Section background="default" className="bg-surface/30 relative overflow-hidden py-16 md:py-24">
      {/* Decorative background glows & patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial-glow opacity-80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial-glow-teal opacity-60 pointer-events-none" />

      <Container className="relative z-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-bold text-slate hover:text-brand mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Blog</span>
        </Link>

        {/* Category Header */}
        <div className="max-w-3xl mb-12 border-l-4 border-brand pl-6 relative">
          <span className="text-xs font-bold text-slate uppercase tracking-wider">
            Category Archive
          </span>
          <BoldStatement variant="h1" className="mt-1 mb-3 text-ink tracking-tight leading-tight">
            {categoryTitle}
          </BoldStatement>
          <p className="text-base text-slate leading-relaxed">
            {categoryDesc}
          </p>
        </div>

        {/* List Grid */}
        {posts.length === 0 ? (
          <div className="p-12 text-center text-slate max-w-md mx-auto bg-card border border-line/80 rounded-card shadow-soft">
            <p className="text-base font-semibold">No posts in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {posts.map((post: any, idx: number) => (
              <Card key={idx} hoverLift className="flex flex-col justify-between h-full border-line/80 p-6 bg-card shadow-soft relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-surface" />
                <div>
                  <div className="text-[10px] font-bold text-corporate uppercase tracking-wider mb-2">
                    {categoryTitle}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold font-display text-ink mb-3 hover:text-brand cursor-pointer transition-colors duration-200">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate leading-relaxed mb-6 font-medium">
                    {post.description || "Discover automation techniques and models for immediate workplace application."}
                  </p>
                </div>
                <div className="border-t border-line pt-4 flex items-center justify-between text-xs font-semibold text-slate/85 mt-auto">
                  <span className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate/60" />
                    {post.author?.name || "K. V. Jacob"}
                  </span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
