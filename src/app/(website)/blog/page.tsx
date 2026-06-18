import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 3600;

const FALLBACK_POSTS = [
  {
    title: "Smarter Excel Reports: 3 Automation Workflows for Modern Offices",
    slug: "excel-reports-automation",
    publishedAt: "2026-06-10T08:00:00.000Z",
    featured: true,
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Report Automation", slug: "report-automation" },
    coverImage: null,
    description:
      "Repetitive MIS reporting costs businesses hundreds of hours. Discover how to streamline spreadsheets and connect live ERP data using single-click macros.",
  },
  {
    title: "Why Power BI is the Gold Standard for Business Dashboards in 2026",
    slug: "power-bi-gold-standard",
    publishedAt: "2026-06-05T09:00:00.000Z",
    featured: false,
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Data Analytics", slug: "data-analytics" },
    coverImage: null,
    description:
      "Visual interfaces change how teams analyze KPIs. Learn the differences between spreadsheet charts and live, secure interactive dashboard sheets.",
  },
  {
    title: "Bridging the College-to-Corporate Skill Gap: The Practical Analytics Approach",
    slug: "college-corporate-skill-gap",
    publishedAt: "2026-05-28T10:00:00.000Z",
    featured: false,
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Educational Technology", slug: "educational-tech" },
    coverImage: null,
    description:
      "Graduating with theoretical models is no longer enough. Colleges must transition to assignment-driven spreadsheet labs and data visualization certifications.",
  },
];

export default async function BlogPage() {
  const data = await client.fetch(postsQuery).catch((err) => {
    console.warn("Sanity fetch error in BlogPage:", err);
    return null;
  });

  const posts = data && data.length > 0 ? data : FALLBACK_POSTS;

  // Split into featured and standard
  const featuredPost = posts.find((p: any) => p.featured) || posts[0];
  const standardPosts = posts.filter((p: any) => p.slug !== featuredPost?.slug);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
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
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Eyebrow className="mb-4">Insights & Articles</Eyebrow>
          <BoldStatement variant="h1" className="mb-4 text-ink leading-tight tracking-tight">
            KVJ Analytics Blog
          </BoldStatement>
          <p className="text-lg text-slate leading-relaxed">
            Discover advanced Excel techniques, dashboard design rules, process automation case studies, and edtech updates.
          </p>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-line/80 rounded-card overflow-hidden p-6 md:p-8 shadow-soft hover:shadow-hover-lift hover:-translate-y-1 transition-all duration-300 relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 signature-gradient" />
              {/* Image box */}
              <div className="lg:col-span-6 overflow-hidden rounded-xl aspect-[16/10] relative bg-brand/5">
                {featuredPost.coverImage ? (
                  <Image
                    src={urlFor(featuredPost.coverImage).url()}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-102"
                  />
                ) : (
                  <div className="absolute inset-0 signature-gradient opacity-90 flex items-center justify-center text-white p-8">
                    <span className="text-2xl font-bold font-display text-center leading-tight">
                      {featuredPost.title}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-10">
                  <Link
                    href={`/blog/category/${featuredPost.category?.slug}`}
                    className="px-3 py-1 rounded bg-white text-brand font-bold text-xs shadow-sm uppercase tracking-wider hover:bg-brand hover:text-white transition-colors duration-200"
                  >
                    {featuredPost.category?.title}
                  </Link>
                </div>
              </div>

              {/* Content box */}
              <div className="lg:col-span-6 flex flex-col items-start justify-center">
                <span className="text-xs font-bold text-corporate uppercase tracking-wider mb-2">
                  Featured post
                </span>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <BoldStatement
                    variant="h2"
                    className="hover:text-brand transition-colors duration-200 mb-4 cursor-pointer text-2xl md:text-3xl leading-tight"
                  >
                    {featuredPost.title}
                  </BoldStatement>
                </Link>
                <p className="text-base text-slate leading-relaxed mb-6">
                  {featuredPost.description ||
                    "Get a complete breakdown of this topic, listing standard processes, calculations audits, and automation routines."}
                </p>

                {/* Author & Meta */}
                <div className="flex flex-wrap gap-4 items-center text-xs font-semibold text-slate/85 mb-8 border-t border-line pt-4 w-full">
                  <Link
                    href={`/blog/author/${featuredPost.author?.slug}`}
                    className="flex items-center hover:text-brand"
                  >
                    <User className="w-3.5 h-3.5 mr-1.5 text-corporate" />
                    <span>By {featuredPost.author?.name}</span>
                  </Link>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-corporate" />
                    <span>{formatDate(featuredPost.publishedAt)}</span>
                  </div>
                </div>

                <Button href={`/blog/${featuredPost.slug}`} variant="primary">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Standard Posts Grid */}
        {standardPosts.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <BoldStatement variant="h3" className="mb-8 font-display text-ink tracking-tight">
              Latest Insights
            </BoldStatement>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {standardPosts.map((post: any, idx: number) => (
                <Card
                  key={idx}
                  hoverLift
                  className="flex flex-col justify-between h-full border-line/80 p-6 bg-white shadow-soft relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-surface" />
                  <div>
                    {/* Cover image placeholder */}
                    <div className="overflow-hidden rounded-lg aspect-[16/10] relative mb-5 bg-brand/5">
                      {post.coverImage ? (
                        <Image
                          src={urlFor(post.coverImage).url()}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-102"
                        />
                      ) : (
                        <div className="absolute inset-0 signature-gradient opacity-80 flex items-center justify-center text-white p-6">
                          <span className="text-lg font-bold font-display text-center leading-tight">
                            {post.title}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 z-10">
                        <Link
                          href={`/blog/category/${post.category?.slug}`}
                          className="px-2.5 py-0.5 rounded bg-white text-brand font-bold text-[10px] shadow-sm uppercase tracking-wider hover:bg-brand hover:text-white transition-colors duration-200"
                        >
                          {post.category?.title}
                        </Link>
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold font-display text-ink mb-3 hover:text-brand cursor-pointer transition-colors duration-200">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate leading-relaxed mb-6">
                      {post.description ||
                        "Explore how advanced technical structures can support operational efficiency and educational tracking."}
                    </p>
                  </div>

                  <div className="border-t border-line pt-4 mt-auto">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate/85 mb-4">
                      <Link
                        href={`/blog/author/${post.author?.slug}`}
                        className="flex items-center hover:text-brand"
                      >
                        <User className="w-3.5 h-3.5 mr-1.5 text-education" />
                        <span>{post.author?.name}</span>
                      </Link>
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-education" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-bold text-brand hover:text-brand-700 transition-colors group"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
