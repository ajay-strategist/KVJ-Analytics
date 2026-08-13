"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { 
  Search, Calendar, User, Clock, ArrowRight, Tag, Bookmark, 
  Sparkles, ArrowUpRight, ChevronRight, BookOpen, BarChart3, Database, MessageSquare
} from "lucide-react";
import { Container } from "@/components/ui/Container";

interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  body_html: string;
  cover_url?: string;
  category_title: string;
  category_slug: string;
  author_name: string;
  author_slug: string;
  published_at: string;
  featured: boolean;
  featured_flags: string[];
  tags: string[];
}

interface BlogListClientProps {
  posts: Post[];
  header: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    intro: string;
  };
}

export function BlogListClient({ posts, header }: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState("all");

  const listRef = useRef<HTMLDivElement>(null);

  // Get all unique categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category_title));
    return ["all", ...Array.from(cats)];
  }, [posts]);

  // Get all unique tags dynamically
  const popularTags = useMemo(() => {
    const allTags = posts.flatMap(p => p.tags || []);
    const counts: Record<string, number> = {};
    allTags.forEach(t => counts[t] = (counts[t] || 0) + 1);
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 8);
  }, [posts]);

  // Estimate reading time helper
  const getReadingTime = (bodyHtml: string | null, description: string) => {
    let text = "";
    if (bodyHtml) {
      text = bodyHtml.replace(/<[^>]*>/g, "");
    } else {
      text = description;
    }
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // Fuzzy matching search logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Category filter
      if (activeCategory !== "all" && post.category_title !== activeCategory) {
        return false;
      }
      // Tag filter
      if (activeTag !== "all" && !(post.tags || []).includes(activeTag)) {
        return false;
      }
      // Text search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = post.title.toLowerCase().includes(query);
        const descMatch = (post.description || "").toLowerCase().includes(query);
        const contentMatch = (post.body_html || "").toLowerCase().includes(query);
        const catMatch = post.category_title.toLowerCase().includes(query);
        const authMatch = post.author_name.toLowerCase().includes(query);
        const tagMatch = (post.tags || []).some(t => t.toLowerCase().includes(query));
        return titleMatch || descMatch || contentMatch || catMatch || authMatch || tagMatch;
      }
      return true;
    });
  }, [posts, activeCategory, activeTag, searchQuery]);

  // Extract featured and trending posts
  const featuredPost = useMemo(() => {
    const found = posts.find(p => p.featured || p.featured_flags?.includes("featured"));
    return found || posts[0];
  }, [posts]);

  const trendingPosts = useMemo(() => {
    return posts.filter(p => 
      p.id !== featuredPost?.id && 
      (p.featured_flags?.includes("trending") || p.featured_flags?.includes("editors_pick"))
    ).slice(0, 3);
  }, [posts, featuredPost]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper to highlight search matches
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-brand/20 text-brand px-0.5 rounded">{part}</mark>
          ) : part
        )}
      </>
    );
  };

  const scrollToSection = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Abstract CSS Cover Renderer
  const renderCoverImage = (post: Post) => {
    if (post.cover_url) {
      return (
        <img
          src={post.cover_url}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      );
    }
    
    return (
      <div className="absolute inset-0 bg-[#0B2A22] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] flex flex-col justify-between p-6 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-colors duration-500" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-corporate/5 rounded-full blur-3xl group-hover:bg-corporate/10 transition-colors duration-500" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#10B981]/85 uppercase px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/15">
            {post.category_title}
          </span>
        </div>
        
        <div className="relative z-10 w-full h-12 flex items-end gap-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
          <div className="h-[25%] w-full bg-gradient-to-t from-brand to-corporate rounded-sm" />
          <div className="h-[45%] w-full bg-gradient-to-t from-brand to-corporate rounded-sm" />
          <div className="h-[35%] w-full bg-gradient-to-t from-brand to-corporate rounded-sm" />
          <div className="h-[80%] w-full bg-gradient-to-t from-brand to-corporate rounded-sm" />
          <div className="h-[60%] w-full bg-gradient-to-t from-brand to-corporate rounded-sm" />
          <div className="h-[95%] w-full bg-gradient-to-t from-brand to-corporate rounded-sm" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-16 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.25em] text-[#10B981] px-3.5 py-1.5 bg-[#10B981]/10 rounded-full w-fit border border-[#10B981]/20 animate-pulse">
                INSIGHTS / KNOWLEDGE
              </span>
              
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white max-w-3xl">
                Data Analytics, Excel <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-[#0D9488] to-brand animate-[signature-flow_6s_linear_infinite] bg-[size:200%_auto]">
                  & Power BI Insights
                </span>
              </h1>

              <p className="text-slate font-light text-base sm:text-lg leading-relaxed max-w-xl">
                Practical guides, expert tutorials, and corporate insights on building automated dashboard reports, writing advanced Excel models, and unlocking data-driven business intelligence.
              </p>

              <div className="pt-2">
                <button
                  onClick={scrollToSection}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white/[0.03] border border-line px-6 py-3.5 text-xs font-semibold text-white backdrop-blur-md hover:border-brand/40 transition-colors cursor-pointer"
                >
                  <span>Explore Articles</span>
                  <ArrowRight className="h-3.5 w-3.5 text-brand transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Column: Premium Floating Mockup Composition */}
            <div className="lg:col-span-5 flex items-center justify-center relative select-none">
              <div className="relative w-full max-w-[400px] h-[320px] animate-float">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Floating Widget 1 */}
                <div className="absolute top-4 left-0 w-64 glass-panel rounded-2xl p-4 shadow-lg border border-line z-20 float-a">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#10B981] uppercase">Insights Telemetry</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                      <BarChart3 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-bold leading-tight font-display">Reader Engagement</h4>
                      <p className="text-[9px] text-zinc-400 mt-0.5 leading-none">Top Topic: Power BI Insights</p>
                    </div>
                  </div>
                </div>

                {/* Floating Widget 2 */}
                <div className="absolute bottom-6 right-0 w-52 glass-panel rounded-2xl p-4 shadow-lg border border-line z-20 float-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488]">
                      <Database className="w-4.5 h-4.5 text-brand" />
                    </div>
                    <div className="text-left">
                      <span className="text-[8px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">Automation Metrics</span>
                      <h4 className="text-white text-xs font-bold font-display mt-0.5 leading-none">12+ Live Audits</h4>
                    </div>
                  </div>
                </div>

                {/* Floating Widget 3 */}
                <div className="absolute top-28 right-0 w-44 glass-panel rounded-2xl p-4.5 shadow-lg border border-line z-10 float-c text-left">
                  <span className="text-[8px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Weekly Reads</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold text-white font-mono">2,400+</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full mt-2.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand to-corporate rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-[#10B981]/5 rounded-full pointer-events-none z-0 animate-spin-slow" />
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 2. EXPLORE INSIGHTS SECTION (SEARCH + FILTERING) */}
      <section id="explore-insights" ref={listRef} className="py-8 scroll-mt-24">
        <Container>
          <div className="space-y-8 max-w-5xl mx-auto">
            
            {/* Elegant Search Bar */}
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/10 to-[#0D9488]/10 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-[#0B2A22]/85 border border-white/5 rounded-2xl px-4 py-3.5 shadow-lg focus-within:border-brand/40 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all">
                <Search className="w-4 h-4 text-[#10B981] shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search insights, topics and ideas..."
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate font-light"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="text-xs font-bold text-[#10B981] hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Editorial Category Pill Navigation */}
            <div className="flex overflow-x-auto gap-2.5 pb-4 px-6 md:px-1 justify-start md:justify-center scrollbar-none mask-fade">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveTag("all"); // reset tag filter
                  }}
                  className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-full border transition-all duration-300 shrink-0 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-brand text-[#050608] border-transparent shadow-[0_4px_16px_rgba(16,185,129,0.25)] font-extrabold"
                      : "bg-[#0B2A22]/50 text-zinc-400 border-white/5 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat === "all" ? "All Insights" : cat}
                </button>
              ))}
            </div>

            {/* Reduced Weight Popular Tags */}
            {popularTags.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center justify-start md:justify-center text-[11px] text-slate-350 bg-white/[0.01] border border-white/5 rounded-2xl px-4 py-2 w-fit mx-auto">
                <span className="font-semibold text-slate-400 select-none mr-1">Popular:</span>
                <button
                  onClick={() => setActiveTag("all")}
                  className={`px-2 py-0.5 rounded text-[10px] tracking-wide transition-colors cursor-pointer ${
                    activeTag === "all"
                      ? "text-brand font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-2 py-0.5 rounded text-[10px] tracking-wide transition-colors cursor-pointer ${
                      activeTag === tag
                        ? "text-brand font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

          </div>
        </Container>
      </section>

      {/* 3. FEATURED + EDITOR'S PICKS GRID */}
      <section className="py-4">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Featured Article (8/12) */}
            <div className="lg:col-span-8">
              {activeCategory === "all" && activeTag === "all" && searchQuery === "" && featuredPost && (
                <div className="space-y-4 text-left">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#10B981]">
                    Featured Insight
                  </span>
                  
                  <div className="bg-[#0B2A22]/60 border border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:border-brand/20 transition-all duration-500 relative group">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0">
                      
                      {/* Image frame */}
                      <div className="md:col-span-7 overflow-hidden aspect-[16/10] relative bg-brand/5 border-b md:border-b-0 md:border-r border-white/5">
                        {renderCoverImage(featuredPost)}
                        <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-[#07130E]/90 text-brand font-mono font-bold text-[9px] uppercase tracking-wider border border-white/5 z-10">
                          {featuredPost.category_title}
                        </span>
                      </div>

                      {/* Content panel */}
                      <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between">
                        <div className="space-y-4">
                          <span className="text-[9px] font-mono font-bold text-[#10B981] uppercase tracking-wider block">
                            {featuredPost.category_title}
                          </span>
                          <h3 className="text-xl md:text-2xl font-bold font-display text-white group-hover:text-brand transition-colors leading-snug">
                            <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                          </h3>
                          <p className="text-zinc-300 text-xs md:text-sm leading-relaxed line-clamp-4 font-light">
                            {featuredPost.description}
                          </p>
                        </div>

                        <div className="pt-6 mt-6 border-t border-white/5 flex flex-col gap-3">
                          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                            <span>{formatDate(featuredPost.published_at)}</span>
                            <span>•</span>
                            <span>{getReadingTime(featuredPost.body_html, featuredPost.description)} min read</span>
                          </div>
                          
                          <Link
                            href={`/blog/${featuredPost.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand uppercase tracking-wider group-hover:underline w-fit"
                          >
                            <span>Read Article</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Editor's Picks (4/12) */}
            <div className="lg:col-span-4 h-full">
              {trendingPosts.length > 0 && (
                <div className="space-y-4 text-left h-full">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#10B981]">
                    Editor&apos;s Picks
                  </span>
                  
                  <div className="bg-[#0B2A22]/60 border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col justify-between h-[calc(100%-24px)]">
                    <div className="space-y-6">
                      {trendingPosts.map((post, index) => (
                        <div key={post.slug} className="group flex gap-4 items-start border-b border-white/5 pb-6 last:border-0 last:pb-0">
                          <span className="text-2xl font-extrabold text-white/10 font-display leading-none mt-1 group-hover:text-brand transition-colors duration-300">
                            0{index + 1}
                          </span>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-[#10B981]/80 uppercase tracking-widest block">
                              {post.category_title}
                            </span>
                            <h5 className="text-sm font-bold text-white group-hover:text-brand transition-colors leading-snug group-hover:translate-x-0.5 duration-300">
                              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </Container>
      </section>

      {/* 4. LATEST INSIGHTS ARTICLE GRID */}
      <section className="py-8 border-t border-white/5">
        <Container>
          <div className="space-y-8 text-left">
            <h3 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand" /> Latest Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.length === 0 ? (
                <div className="col-span-full p-12 border border-dashed border-white/10 rounded-3xl text-center">
                  <Bookmark className="w-8 h-8 text-slate mx-auto mb-3" />
                  <h4 className="text-white font-bold text-base mb-1">No articles found</h4>
                  <p className="text-xs text-slate">Try adjusting your filters or search keywords.</p>
                </div>
              ) : (
                filteredPosts
                  .filter(p => searchQuery !== "" || activeCategory !== "all" || activeTag !== "all" || p.id !== featuredPost?.id)
                  .map(post => (
                    <div
                      key={post.id}
                      className="bg-[#0B2A22]/60 border border-white/5 hover:border-brand/20 p-5 rounded-3xl flex flex-col justify-between shadow-lg hover:-translate-y-1 transition-all duration-500 relative group overflow-hidden"
                    >
                      <div className="space-y-4">
                        {/* Image Frame */}
                        <div className="overflow-hidden rounded-2xl aspect-[16/10] relative bg-brand/5 border border-white/5">
                          {renderCoverImage(post)}
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#07130E]/90 text-brand font-mono font-bold text-[8px] uppercase tracking-wider border border-white/5">
                            {post.category_title}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-base md:text-[17px] font-bold text-white group-hover:text-brand transition-colors leading-snug">
                            <Link href={`/blog/${post.slug}`}>{highlightText(post.title, searchQuery)}</Link>
                          </h4>
                          <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3 font-light">
                            {highlightText(post.description, searchQuery)}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{formatDate(post.published_at)}</span>
                        
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="flex items-center gap-1 font-bold text-brand hover:underline"
                        >
                          <span>{getReadingTime(post.body_html, post.description)} min read</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  ))
              )}
            </div>

          </div>
        </Container>
      </section>

      {/* 5. PREMIUM SUBSCRIBE CTA */}
      <section className="py-8">
        <Container>
          <div className="relative bg-gradient-to-br from-[#0B2A22] to-[#050608] border border-white/5 p-8 md:p-14 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-left max-w-5xl mx-auto">
            <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-xl space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#10B981]">Newsletter</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white font-display leading-tight">Stay Ahead of What&apos;s Next</h3>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
                Practical perspectives on analytics, technology and business transformation. Join data leaders receiving weekly guides directly.
              </p>
            </div>
            
            <form action="/api/inquiries" method="POST" className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-2.5">
              <input 
                type="email" 
                name="email"
                placeholder="you@company.com" 
                required 
                className="px-4 py-3 text-xs bg-[#050608] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#10B981]/30 placeholder-zinc-500 w-full sm:w-64 font-medium" 
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-brand hover:bg-[#34D399] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 border-0 cursor-pointer"
              >
                Subscribe →
              </button>
            </form>
          </div>
        </Container>
      </section>

    </div>
  );
}
