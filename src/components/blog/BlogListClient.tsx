"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, User, Clock, ArrowRight, Tag, Bookmark, Sparkles } from "lucide-react";

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
    // Priority: post with 'featured' flag or 'featured' boolean
    const found = posts.find(p => p.featured || p.featured_flags?.includes("featured"));
    return found || posts[0];
  }, [posts]);

  const trendingPosts = useMemo(() => {
    return posts.filter(p => 
      p.id !== featuredPost?.id && 
      (p.featured_flags?.includes("trending") || p.featured_flags?.includes("editors_pick"))
    ).slice(0, 4);
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

  return (
    <div className="space-y-12">
      {/* Search Input Banner */}
      <div className="max-w-2xl mx-auto relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/20 to-[#3A7BFF]/20 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-[#0E1117]/80 border border-white/10 rounded-2xl px-4 py-3 shadow-md focus-within:border-brand/40 transition-colors">
          <Search className="w-5 h-5 text-slate shrink-0 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, contents, tags, categories, authors..."
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="text-xs font-bold text-slate hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-white/5 pb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setActiveTag("all"); // reset tag filter
            }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-brand text-black border-transparent shadow-[0_0_15px_rgba(67,245,255,0.2)]"
                : "bg-card text-slate border-white/5 hover:text-white hover:border-white/15"
            }`}
          >
            {cat === "all" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {/* Popular Tags List */}
      {popularTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center justify-center max-w-4xl mx-auto text-xs">
          <span className="text-slate font-bold flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Popular Tags:
          </span>
          <button
            onClick={() => setActiveTag("all")}
            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all cursor-pointer ${
              activeTag === "all"
                ? "bg-white/10 text-white border-white/20"
                : "bg-transparent text-slate-350 border-white/5 hover:text-white hover:border-white/10"
            }`}
          >
            All
          </button>
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-2.5 py-1 rounded-md border text-[11px] transition-all cursor-pointer ${
                activeTag === tag
                  ? "bg-brand/20 text-brand border-brand/30"
                  : "bg-transparent text-slate-350 border-white/5 hover:text-white hover:border-white/10"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        
        {/* Left/Main Column: Articles Feed */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Featured Post Card */}
          {activeCategory === "all" && activeTag === "all" && searchQuery === "" && featuredPost && (
            <div className="bg-[#0E1117]/60 border border-white/5 rounded-3xl overflow-hidden shadow-soft hover:border-brand/30 hover:-translate-y-1 transition-all duration-300 relative text-left group">
              <div className="absolute top-0 left-0 right-0 h-1 signature-gradient" />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8 items-center">
                <div className="md:col-span-6 overflow-hidden rounded-2xl aspect-[16/10] relative bg-brand/5 border border-white/5">
                  {featuredPost.cover_url ? (
                    <img
                      src={featuredPost.cover_url}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <div className="absolute inset-0 signature-gradient opacity-90 flex items-center justify-center text-white p-8">
                      <span className="text-xl font-bold font-display text-center leading-tight">
                        {featuredPost.title}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-[#0A0D13]/90 text-brand font-bold text-[10px] uppercase tracking-wider border border-white/5">
                    {featuredPost.category_title}
                  </span>
                </div>
                <div className="md:col-span-6 space-y-4">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-wider">Featured Article</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-brand transition-colors leading-tight">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h3>
                  <p className="text-slate text-sm leading-relaxed line-clamp-3">
                    {featuredPost.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-350 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand" />
                      <span>{formatDate(featuredPost.published_at)}</span>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand uppercase tracking-wider group-hover:underline pt-2"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Standard Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {filteredPosts.length === 0 ? (
              <div className="col-span-2 p-12 border border-dashed border-white/10 rounded-3xl text-center">
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
                    className="bg-[#0E1117]/60 border border-white/5 hover:border-brand/20 p-5 rounded-3xl flex flex-col justify-between shadow-sm hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      {/* Image frame */}
                      <div className="overflow-hidden rounded-2xl aspect-[16/9] relative bg-brand/5 border border-white/5">
                        {post.cover_url ? (
                          <img
                            src={post.cover_url}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                        ) : (
                          <div className="absolute inset-0 signature-gradient opacity-90 flex items-center justify-center text-white p-6">
                            <span className="text-sm font-bold font-display text-center leading-snug">
                              {post.title}
                            </span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#0A0D13]/90 text-brand font-bold text-[9px] uppercase tracking-wider border border-white/5">
                          {post.category_title}
                        </span>
                      </div>
                      
                      <h4 className="text-base md:text-lg font-bold text-white group-hover:text-brand transition-colors leading-snug">
                        <Link href={`/blog/${post.slug}`}>{highlightText(post.title, searchQuery)}</Link>
                      </h4>
                      <p className="text-xs text-slate leading-relaxed line-clamp-3">
                        {highlightText(post.description, searchQuery)}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-[11px] text-slate-350">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand" />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>

        </div>

        {/* Right Column: Trending Sidebar, Promos */}
        <aside className="lg:col-span-4 space-y-6 w-full max-w-md mx-auto lg:mx-0">
          
          {/* Trending & Editor's Picks */}
          {trendingPosts.length > 0 && (
            <div className="bg-[#0E1117]/60 border border-white/5 p-6 rounded-3xl text-left">
              <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Sparkles className="w-3.5 h-3.5 text-brand" /> Editor&apos;s Picks
              </h4>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <div key={post.slug} className="group border-b border-white/5 pb-4 last:border-0 last:pb-0 flex gap-3 items-start">
                    <span className="text-lg font-extrabold text-white/20 font-display leading-none mt-1">
                      0{index + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-brand transition-colors leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h5>
                      <span className="text-[10px] text-slate mt-1.5 block">{post.category_title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Box */}
          <div className="bg-[#0E1117]/60 border border-white/5 p-6 rounded-3xl text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 signature-gradient" />
            <h4 className="text-sm font-bold text-white mb-2">Subscribe to Insights</h4>
            <p className="text-xs text-slate-350 leading-relaxed mb-4">Get practical guides and spreadsheets formulas direct to your inbox weekly.</p>
            <form action="/api/inquiries" method="POST" className="space-y-2">
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                required
                className="w-full px-3 py-2.5 text-xs bg-[#050608] border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand/40"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-brand hover:bg-[#16E6D8] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Training solutions promo */}
          <div className="bg-[#0E1117]/60 border border-white/5 p-6 rounded-3xl text-left relative overflow-hidden group">
            <span className="text-[10px] font-bold text-brand uppercase tracking-wider">Enterprise Solutions</span>
            <h4 className="text-base font-bold text-white mt-1 mb-2">Automate Your MIS Systems</h4>
            <p className="text-xs text-slate-350 leading-relaxed mb-4">We help corporate groups design customized reporting loops, dashboards, and automated folder imports. Schedule an audit with principal consultant.</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand uppercase tracking-wider group-hover:underline"
            >
              <span>Request Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </aside>

      </div>
    </div>
  );
}
