"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Link2, Check, BookOpen, ChevronRight, ArrowUp, Share2, 
  Bookmark, MessageSquare, Mail, Menu, X, Clock, HelpCircle 
} from "lucide-react";

interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

interface BlogClientLayoutProps {
  headings: HeadingItem[];
  shareUrl: string;
  shareTitle: string;
  readingTime: number;
  wordCount: number;
  publishedDate: string;
  categoryTitle: string;
  articleSlug: string;
  children: React.ReactNode;
}

export function BlogClientFurniture({
  headings,
  shareUrl,
  shareTitle,
  readingTime,
  wordCount,
  publishedDate,
  categoryTitle,
  articleSlug,
  children
}: BlogClientLayoutProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [eta, setEta] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const iframeWrapperRef = useRef<HTMLDivElement>(null);

  // Initialize bookmark state from localStorage
  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("blog_bookmarks") || "{}");
      setIsBookmarked(!!bookmarks[articleSlug]);
    } catch {}
  }, [articleSlug]);

  const toggleBookmark = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("blog_bookmarks") || "{}");
      if (bookmarks[articleSlug]) {
        delete bookmarks[articleSlug];
        setIsBookmarked(false);
      } else {
        bookmarks[articleSlug] = { title: shareTitle, url: shareUrl, date: new Date().toISOString() };
        setIsBookmarked(true);
      }
      localStorage.setItem("blog_bookmarks", JSON.stringify(bookmarks));
    } catch {}
  };

  // Track scrolling (progress, back to top button, and ETA update)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (totalHeight > 0) {
        setScrollProgress((currentScroll / totalHeight) * 100);
      }
      
      setShowBackToTop(currentScroll > 400);

      // Dynamically calculate ETA based on remaining reading time
      const percentRemaining = totalHeight > 0 ? 1 - (currentScroll / totalHeight) : 1;
      const remainingMinutes = Math.max(0, readingTime * percentRemaining);
      const completionDate = new Date(Date.now() + remainingMinutes * 60 * 1000);
      
      setEta(completionDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [readingTime]);

  // Listen to messages from the sandboxed iframe
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data.type === "SCROLL_PARENT" && iframeWrapperRef.current) {
        const iframe = iframeWrapperRef.current.querySelector("iframe");
        if (iframe) {
          const iframeTop = iframe.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: iframeTop + e.data.top - 100,
            behavior: "smooth"
          });
        }
      } else if (e.data.type === "COPY_LINK") {
        const linkStr = `${window.location.origin}${window.location.pathname}#${e.data.id}`;
        navigator.clipboard.writeText(linkStr);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else if (e.data.type === "ACTIVE_HEADING") {
        setActiveHeading(e.data.id);
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  const handleHeadingClick = (id: string) => {
    setActiveHeading(id);
    setMobileDrawerOpen(false);
    const iframe = iframeWrapperRef.current?.querySelector("iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "SCROLL_TO_HEADING", id }, "*");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mailtoLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`;
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " - " + shareUrl)}`;
  const twitterLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
  const linkedinLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <>
      {/* Sticky top reading progress bar with subtle gradient & glow */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/5 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#00F0FF] via-[#3A7BFF] to-[#16E6D8] transition-all duration-75 shadow-[0_0_8px_rgba(0,240,255,0.6)]"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={scrollProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
        {/* Floating percentage bubble at top-right */}
        <div className="absolute right-4 top-2 bg-[#0A0D13]/80 backdrop-blur-md border border-white/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#00F0FF] select-none">
          {Math.round(scrollProgress)}% read
        </div>
      </div>

      {/* Main 12-Column Responsive Reading Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sticky Table of Contents */}
        <aside className="lg:col-span-3 hidden lg:block sticky top-28 self-start">
          <div className="bg-[#0A0D13]/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl space-y-6">
            <div>
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-white/5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#00F0FF]" /> Outline
              </h5>
              
              {headings.length > 0 ? (
                <nav className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
                  {headings.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => handleHeadingClick(h.id)}
                      className={`block text-left text-[12px] font-medium leading-relaxed transition-all duration-200 w-full hover:translate-x-0.5 ${
                        h.level === 3 ? "pl-3 border-l border-white/5 text-[11px]" : ""
                      } ${
                        activeHeading === h.id 
                          ? "text-[#00F0FF] font-bold pl-1 border-l-2 border-[#00F0FF]" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {h.text}
                    </button>
                  ))}
                </nav>
              ) : (
                <span className="text-xs text-slate-500 italic">No headings found.</span>
              )}
            </div>

            {/* Reading Stats Widget */}
            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Reading Time:</span>
                <span className="font-bold text-white">{readingTime} min</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Word Count:</span>
                <span className="font-bold text-white">{wordCount} words</span>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Sandboxed Article Iframe Wrapper */}
        <main className="col-span-1 lg:col-span-6 w-full max-w-[72ch] mx-auto" ref={iframeWrapperRef}>
          {children}
        </main>

        {/* RIGHT COLUMN: Floating Share Panel */}
        <aside className="lg:col-span-3 hidden lg:block sticky top-28 self-start space-y-6">
          <div className="bg-[#0A0D13]/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl space-y-6">
            
            {/* Share Panel Action Items */}
            <div>
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-white/5">
                Actions
              </h5>
              
              <div className="flex items-center gap-3 mb-6">
                {/* Bookmark Toggle */}
                <button
                  onClick={toggleBookmark}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isBookmarked 
                      ? "bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF]" 
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                  <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <a
                  href={twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-center"
                  title="Share on X (Twitter)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-center"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-center"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-center"
                  title="Share on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href={mailtoLink}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-center"
                  title="Share via Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer flex items-center justify-center"
                  title="Copy direct URL"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Progress Stats */}
            {eta && (
              <div className="border-t border-white/5 pt-4 space-y-2.5 text-[11px] text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Scroll Progress:</span>
                  <span className="font-bold text-white font-mono">{Math.round(scrollProgress)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Finish ETA:</span>
                  <span className="font-bold text-[#00F0FF] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {eta}
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* Floating Action Elements (TOC Drawer Trigger + Back to top) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full bg-[#0E1117] border border-white/10 text-white shadow-xl hover:bg-slate-900 transition-all cursor-pointer"
          aria-label="Toggle Outline"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Back to top button */}
        {showBackToTop && (
          <button
            onClick={handleBackToTop}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0E1117]/90 backdrop-blur-md border border-white/10 text-[#00F0FF] shadow-xl hover:bg-[#0E1117] transition-all hover:scale-105 cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mobile Drawer (Table of Contents + Share list) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden flex items-end justify-center">
          <div className="bg-[#0E1117] border-t border-white/10 rounded-t-3xl w-full p-6 space-y-6 max-h-[75vh] overflow-y-auto relative animate-slide-up">
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold border-0 bg-transparent text-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#00F0FF]" /> Article Outline
              </h4>
              
              {headings.length > 0 ? (
                <nav className="space-y-3.5 pr-2 max-h-[30vh] overflow-y-auto scrollbar-thin">
                  {headings.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => handleHeadingClick(h.id)}
                      className={`block text-left text-xs font-semibold leading-relaxed transition-all w-full ${
                        h.level === 3 ? "pl-4 text-[11px] text-slate-400" : "text-white"
                      } ${
                        activeHeading === h.id ? "text-[#00F0FF] font-bold" : "hover:text-[#00F0FF]"
                      }`}
                    >
                      {h.text}
                    </button>
                  ))}
                </nav>
              ) : (
                <span className="text-xs text-slate-500 italic">No headings found.</span>
              )}
            </div>

            {/* Share Panel in Drawer */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Share insights</h4>
              <div className="flex gap-3 justify-between items-center">
                <a href={twitterLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-350 flex-1 flex justify-center hover:text-white" title="Share on X">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-350 flex-1 flex justify-center hover:text-white" title="Share on LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-350 flex-1 flex justify-center hover:text-white" title="Share on WhatsApp"><MessageSquare className="w-4 h-4" /></a>
                <button onClick={handleCopyLink} className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-300 flex-1 flex justify-center cursor-pointer">
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bookmark in Drawer */}
            <button
              onClick={toggleBookmark}
              className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isBookmarked 
                  ? "bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF]" 
                  : "bg-white/5 border-white/10 text-slate-300"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              <span>{isBookmarked ? "Bookmarked (Saved)" : "Save Bookmark"}</span>
            </button>

          </div>
        </div>
      )}

      {/* Floating toast notification for link copying */}
      {copiedLink && (
        <div className="fixed bottom-6 right-6 bg-[#0E1117] border border-[#00F0FF]/30 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-fade-in z-50">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Anchor link copied to clipboard</span>
        </div>
      )}
    </>
  );
}
