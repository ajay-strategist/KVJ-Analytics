import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

const FALLBACK_AUTHORS: Record<string, { name: string; bio: string }> = {
  "k-v-jacob": {
    name: "K. V. Jacob",
    bio: "Founder & Director of KVJ Analytics. Leads corporate reporting automation consultancies and university practical analytics certifications across Cochin, UAE, Oman, and USA.",
  },
};

const FALLBACK_POSTS = [
  {
    title: "Why Data-Driven Organizations Consistently Outperform Their Competition",
    slug: "why-data-driven-organizations-consistently-outperform-their-competition",
    publishedAt: "2026-07-20T08:00:00.000Z",
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Business Intelligence", slug: "business-intelligence" },
    description: "Leaders who make decisions backed by evidence rather than assumptions consistently outperform. Discover how Business Intelligence creates a single source of truth for competitive advantage.",
  },
  {
    title: "Digital Transformation: Building Smarter Businesses for the Future",
    slug: "digital-transformation-building-smarter-businesses-for-the-future",
    publishedAt: "2026-07-15T09:00:00.000Z",
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Digital Transformation", slug: "digital-transformation" },
    description: "Digital Transformation is about improving how organisations operate, collaborate, and create value using data, processes, and technology.",
  },
  {
    title: "How Artificial Intelligence is Revolutionising Business Analytics",
    slug: "how-artificial-intelligence-is-revolutionising-business-analytics",
    publishedAt: "2026-07-10T09:00:00.000Z",
    author: { name: "K. V. Jacob", slug: "k-v-jacob" },
    category: { title: "Artificial Intelligence", slug: "artificial-intelligence" },
    description: "AI has evolved from a futuristic concept into a practical business tool, empowering organisations to move from reactive analytics to proactive business planning.",
  },
];

export default async function AuthorFilterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Posts by this author from Supabase
  let postsData: any[] | null = null;
  let dbAuthor: { name?: string; bio?: string } | null = null;
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("author_slug", slug)
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (data) {
      postsData = data.map((r: any) => ({
        title: r.title,
        slug: r.slug,
        publishedAt: r.published_at,
        author: { name: r.author_name || "KVJ Analytics", slug: r.author_slug },
        category: { title: r.category_title, slug: r.category_slug },
        description: r.description || "",
      }));
      if (data[0]) dbAuthor = { name: data[0].author_name, bio: data[0].author_bio };
    }
  } catch {
    postsData = null;
  }

  const fallbackAuthor = FALLBACK_AUTHORS[slug];
  const fallbackFiltered = FALLBACK_POSTS.filter((p) => p.author.slug === slug);

  if ((!postsData || postsData.length === 0) && !fallbackAuthor && fallbackFiltered.length === 0) {
    notFound();
  }

  const posts = postsData && postsData.length > 0 ? postsData : fallbackFiltered;
  const name = dbAuthor?.name || fallbackAuthor?.name || posts[0]?.author?.name || "KVJ Analytics";
  const bio = dbAuthor?.bio || fallbackAuthor?.bio || "Contributor at KVJ Analytics.";

  return (
    <div className="relative min-h-screen bg-[#050608] text-white pt-32 pb-16 overflow-hidden">
      {/* Decorative background glows & patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-950/15 rounded-full blur-[130px] pointer-events-none" />

      <Container className="relative z-10 max-w-5xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-xs font-bold font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-brand mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Blog</span>
        </Link>

        {/* Author bio header */}
        <div className="max-w-4xl bg-[#0B2A22]/60 border border-white/5 rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-[#0D9488] to-brand" />
          <div className="w-20 h-20 rounded-full bg-brand/10 border border-brand/20 text-brand flex items-center justify-center font-bold text-2xl font-display shrink-0 shadow-sm">
            {name[0]}
          </div>
          <div className="text-center sm:text-left space-y-3">
            <div>
              <span className="text-[10px] font-bold font-mono text-brand uppercase tracking-[0.25em] block mb-1">
                Author Profile
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight">
                {name}
              </h2>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl font-light">
              {bio}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-zinc-300 pt-2">
              <span className="flex items-center bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-full shadow-sm text-[11px]">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-brand" />
                {posts.length} Articles
              </span>
              <a
                href="mailto:info@kvjanalytics.in"
                className="flex items-center bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-full hover:text-brand hover:border-brand/40 shadow-sm transition-all text-[11px]"
              >
                <Mail className="w-3.5 h-3.5 mr-1.5 text-brand" />
                Contact Author
              </a>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <h3 className="text-lg md:text-xl font-bold font-display text-white tracking-tight mb-8">
          Articles Written by {name}
        </h3>
        
        {posts.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl max-w-md mx-auto">
            <p className="text-sm text-zinc-400 font-light">No articles published by this author yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-[#0B2A22]/60 border border-white/5 hover:border-brand/20 p-6 rounded-3xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-500 relative group overflow-hidden"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-wider block mb-3">
                    {post.category?.title || "Insights"}
                  </span>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-brand transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-zinc-450 leading-relaxed mb-6 font-light">
                    {post.description || "Discover automation techniques and models for immediate workplace application."}
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 mt-auto">
                  <span>Written by {name}</span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
