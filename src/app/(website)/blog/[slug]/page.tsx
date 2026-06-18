import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 3600;

const FALLBACK_POSTS: Record<string, { title: string; date: string; category: string; catSlug: string; author: string; authorSlug: string; body: string[] }> = {
  "excel-reports-automation": {
    title: "Smarter Excel Reports: 3 Automation Workflows for Modern Offices",
    date: "2026-06-10T08:00:00.000Z",
    category: "Report Automation",
    catSlug: "report-automation",
    author: "K. V. Jacob",
    authorSlug: "k-v-jacob",
    body: [
      "In most modern corporate settings, administrative staff spend hours every week running report pipelines. They open source sheets, copy numbers, filter data rows, paste them into operational workbooks, recalculate equations, and export PDFs. This process is slow, expensive, and error-prone.",
      "By integrating report automation, these manual steps are replaced. We outline three standard workflows that offices can deploy immediately:",
      "1. Consolidated Folder Ingestion: Set up scripts that automatically read all spreadsheets placed in an operations directory, validate their column headers, merge them into a single consolidated log, and alert administrators of format errors.",
      "2. Live ERP Connectors: Avoid raw exports entirely. Configure Power Query or database scripts to fetch raw inventory and financial logs directly from central database systems, updating pivot sheets instantly on click.",
      "3. Automated PDF Scorecards: Configure macros or background tasks that split monthly reports by department and email each manager their specific PDF overview without manual sorting.",
    ],
  },
  "power-bi-gold-standard": {
    title: "Why Power BI is the Gold Standard for Business Dashboards in 2026",
    date: "2026-06-05T09:00:00.000Z",
    category: "Data Analytics",
    catSlug: "data-analytics",
    author: "K. V. Jacob",
    authorSlug: "k-v-jacob",
    body: [
      "Organizations frequently struggle with reporting latency. By the time an analyst formats operational data and emails a spreadsheet, the information is already several days old. Decision-makers need live visibility. This is where Power BI bridges the gap.",
      "Unlike standard static sheets, Power BI establishes direct database pipelines. Managers open a secure link to view current visual charts representing sales metrics, regional distribution logs, and operational speeds.",
      "Additionally, role-based security filters data automatically. A regional director only sees their local charts, while the global operations head reviews the entire company dashboard. This security and speed makes Power BI the gold standard for modern corporate reporting.",
    ],
  },
  "college-corporate-skill-gap": {
    title: "Bridging the College-to-Corporate Skill Gap: The Practical Analytics Approach",
    date: "2026-05-28T10:00:00.000Z",
    category: "Educational Technology",
    catSlug: "educational-tech",
    author: "K. V. Jacob",
    authorSlug: "k-v-jacob",
    body: [
      "Employers routinely report that while fresh college graduates understand basic mathematical definitions, they struggle when handed raw corporate spreadsheets. This skill gap affects entry-level productivity and student hiring rates.",
      "Traditional academic structures rely heavily on textbook theory. To bridge the gap, institutions must transition to practical, tool-based curricula. Graded assignments should require students to filter messy datasets, structure visual dashboards, and explain anomalies.",
      "By integrating tools like Grade Scope and Protrix, colleges can automate evaluation loops while giving students continuous feedback on Excel models. This practical approach is the key to building industry-ready professionals.",
    ],
  },
};

export default async function BlogPostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Query Sanity for post
  const post = await client
    .fetch(postBySlugQuery, { slug })
    .catch(() => null);

  const fallback = FALLBACK_POSTS[slug];

  if (!post && !fallback) {
    notFound();
  }

  const title = post?.title || fallback.title;
  const dateStr = post?.publishedAt || fallback.date;
  const authorName = post?.author?.name || fallback.author;
  const authorSlug = post?.author?.slug || fallback.authorSlug;
  const categoryTitle = post?.category?.title || fallback.category;
  const categorySlug = post?.category?.slug || fallback.catSlug;
  
  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
          <span>Back to Insights</span>
        </Link>

        <Card className="p-8 md:p-12 border border-line/80 shadow-soft bg-white relative overflow-hidden max-w-4xl mx-auto">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 signature-gradient" />

          <article className="max-w-3xl mx-auto">
            {/* Cover Image */}
            <div className="overflow-hidden rounded-card aspect-[16/9] relative mb-8 bg-brand/5 border border-line/80">
              {post?.coverImage ? (
                <Image
                  src={urlFor(post.coverImage).url()}
                  alt={title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 signature-gradient opacity-90 flex items-center justify-center text-white p-8">
                  <span className="text-3xl font-bold font-display text-center leading-tight">
                    {title}
                  </span>
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 items-center text-xs font-bold uppercase tracking-wider text-slate mb-6 border-b border-line pb-6">
              <Link
                href={`/blog/category/${categorySlug}`}
                className="px-3 py-1 rounded bg-brand/10 text-brand hover:bg-brand/20 transition-all"
              >
                {categoryTitle}
              </Link>
              <span className="text-line">|</span>
              <Link
                href={`/blog/author/${authorSlug}`}
                className="flex items-center hover:text-brand"
              >
                <User className="w-4 h-4 mr-1 text-slate" />
                <span>By {authorName}</span>
              </Link>
              <span className="text-line">|</span>
              <div className="flex items-center text-slate">
                <Calendar className="w-4 h-4 mr-1 text-slate" />
                <span>{formatDate(dateStr)}</span>
              </div>
            </div>

            <BoldStatement variant="h1" className="mb-8 leading-tight tracking-tight text-ink">
              {title}
            </BoldStatement>

            {/* Content Body */}
            {post?.body ? (
              <div className="prose prose-slate prose-lg max-w-none text-slate leading-relaxed space-y-6 font-medium">
                <PortableText value={post.body} />
              </div>
            ) : (
              <div className="text-slate leading-relaxed space-y-6 text-base md:text-lg font-medium">
                {fallback.body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            )}

            {/* Author Bio Box */}
            {post?.author?.bio || fallback.authorSlug === "k-v-jacob" ? (
              <div className="mt-16 p-8 bg-surface/50 border border-line rounded-card flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm animate-fade-up">
                <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center shrink-0 font-bold text-xl text-brand font-display border border-brand/20 shadow-sm">
                  {authorName[0]}
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-bold font-display text-ink text-lg mb-2">
                    About {authorName}
                  </h4>
                  <p className="text-sm text-slate leading-relaxed">
                    {post?.author?.bio ||
                      "Founder & Director of KVJ Analytics. Leads corporate reporting automation consultancies and university practical analytics certifications across Cochin, UAE, Oman, and USA."}
                  </p>
                </div>
              </div>
            ) : null}
          </article>
        </Card>
      </Container>
    </Section>
  );
}
