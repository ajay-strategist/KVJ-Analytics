import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, BookOpen, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { client } from "@/sanity/lib/client";
import { authorBySlugQuery, postsByAuthorQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const FALLBACK_AUTHORS: Record<string, { name: string; bio: string }> = {
  "k-v-jacob": {
    name: "K. V. Jacob",
    bio: "Founder & Director of KVJ Analytics. Leads corporate reporting automation consultancies and university practical analytics certifications across Cochin, UAE, Oman, and USA.",
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

export default async function AuthorFilterPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Query author info
  const authorInfo = await client
    .fetch(authorBySlugQuery, { slug })
    .catch(() => null);

  const fallbackAuthor = FALLBACK_AUTHORS[slug];

  if (!authorInfo && !fallbackAuthor) {
    notFound();
  }

  // Query posts matching author
  const postsData = await client
    .fetch(postsByAuthorQuery, { slug })
    .catch(() => null);

  const name = authorInfo?.name || fallbackAuthor.name;
  const bio = authorInfo?.bio || fallbackAuthor.bio;

  // Filter fallback posts
  const posts =
    postsData && postsData.length > 0
      ? postsData
      : FALLBACK_POSTS.filter((p) => p.author.slug === slug);

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

        {/* Author bio header */}
        <div className="max-w-4xl bg-white border border-line/80 rounded-card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-16 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 signature-gradient" />
          <div className="w-20 h-20 rounded-full bg-brand/10 border border-brand/20 text-brand flex items-center justify-center font-bold text-2xl font-display shrink-0 shadow-sm">
            {name[0]}
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-slate uppercase tracking-wider block mb-1">
              Author Profile
            </span>
            <BoldStatement variant="h2" className="text-ink mb-3 font-display tracking-tight">
              {name}
            </BoldStatement>
            <p className="text-base text-slate leading-relaxed mb-5 max-w-2xl font-medium">
              {bio}
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-3 text-xs font-semibold text-slate">
              <span className="flex items-center bg-surface border border-line px-3 py-1.5 rounded-btn shadow-sm">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-brand" />
                {posts.length} Articles
              </span>
              <a
                href="mailto:info@kvjanalytics.in"
                className="flex items-center bg-surface border border-line px-3 py-1.5 rounded-btn hover:text-brand hover:border-brand/40 shadow-sm transition-all active:scale-95"
              >
                <Mail className="w-3.5 h-3.5 mr-1.5 text-brand" />
                Contact Author
              </a>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <BoldStatement variant="h3" className="mb-8 font-display text-ink tracking-tight">
          Articles Written by {name}
        </BoldStatement>
        
        {posts.length === 0 ? (
          <div className="p-12 text-center text-slate max-w-md bg-white border border-line/80 rounded-card shadow-soft">
            <p className="text-base font-semibold">No articles published by this author yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {posts.map((post: any, idx: number) => (
              <Card key={idx} hoverLift className="flex flex-col justify-between h-full border-line/80 p-6 bg-white shadow-soft relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-surface" />
                <div>
                  <div className="text-[10px] font-bold text-corporate uppercase tracking-wider mb-2">
                    {post.category?.title}
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
                  <span>Written by {name}</span>
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
