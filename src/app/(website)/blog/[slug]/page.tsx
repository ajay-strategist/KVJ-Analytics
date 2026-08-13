import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Calendar, User, Clock, ChevronRight, BookOpen, 
  GraduationCap, Building2, PhoneCall, Mail, ArrowUpRight, ShieldCheck, Heart 
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { supabase } from "@/lib/supabase";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { LessonIframe } from "@/components/shared/LessonIframe";
import { BlogClientFurniture } from "@/components/blog/BlogClientFurniture";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let title = "Article";
  let description = "Insights from KVJ Analytics.";
  let image: string | undefined;
  try {
    const { data } = await supabase.from("blog_posts").select("title, description, cover_url").eq("slug", slug).maybeSingle();
    if (data) { 
      title = data.title; 
      description = data.description || description; 
      image = data.cover_url || undefined; 
    }
  } catch {}
  return pageMeta({ title, description, path: `/blog/${slug}`, image });
}

const FALLBACK_POSTS: Record<string, { title: string; date: string; category: string; catSlug: string; author: string; authorSlug: string; description: string; body: string[] }> = {
  "why-data-driven-organizations-consistently-outperform-their-competition": {
    title: "Why Data-Driven Organizations Consistently Outperform Their Competition",
    date: "2026-07-20T08:00:00.000Z",
    category: "Business Intelligence",
    catSlug: "business-intelligence",
    author: "K. V. Jacob",
    authorSlug: "k-v-jacob",
    description: "Leaders who make decisions backed by evidence rather than assumptions consistently outperform. Discover how Business Intelligence creates a single source of truth for competitive advantage.",
    body: [
      "In today's rapidly evolving business environment, every organisation generates vast amounts of data—from customer interactions and sales transactions to operational workflows and financial records. However, data alone does not create value. The real advantage lies in transforming that data into meaningful insights that support confident, strategic decision-making.",
      "Data-driven organisations consistently outperform their competitors because they rely on evidence rather than assumptions. With Business Intelligence (BI), leaders gain a clear understanding of performance, identify opportunities early, and respond quickly to changing market conditions.",
      "Business Intelligence is the process of collecting, integrating, analysing, and visualising data to support better business decisions.",
      "Rather than manually reviewing spreadsheets and reports, organisations use interactive dashboards and automated analytics to monitor key performance indicators (KPIs), identify trends, and measure outcomes in real time.",
    ],
  },
  "digital-transformation-building-smarter-businesses-for-the-future": {
    title: "Digital Transformation: Building Smarter Businesses for the Future",
    date: "2026-07-15T09:00:00.000Z",
    category: "Digital Transformation",
    catSlug: "digital-transformation",
    author: "K. V. Jacob",
    authorSlug: "k-v-jacob",
    description: "Digital Transformation is about improving how organisations operate, collaborate, and create value using data, processes, and technology.",
    body: [
      "Digital Transformation is often associated with adopting new software or migrating to cloud platforms. While technology plays a significant role, successful transformation is ultimately about improving the way organisations operate, collaborate, and create value.",
      "It is a strategic journey that combines people, processes, technology, and data to achieve measurable business outcomes.",
      "Customers expect faster service, employees require efficient tools, and business leaders need accurate insights to make informed decisions. Digital Transformation enables organisations to meet these expectations while improving productivity and reducing operational costs.",
    ],
  },
  "how-artificial-intelligence-is-revolutionising-business-analytics": {
    title: "How Artificial Intelligence is Revolutionising Business Analytics",
    date: "2026-07-10T09:00:00.000Z",
    category: "Artificial Intelligence",
    catSlug: "artificial-intelligence",
    author: "K. V. Jacob",
    authorSlug: "k-v-jacob",
    description: "AI has evolved from a futuristic concept into a practical business tool, empowering organisations to move from reactive analytics to proactive business planning.",
    body: [
      "Artificial Intelligence (AI) has evolved from a futuristic concept into a practical business tool that is reshaping industries worldwide.",
      "Today, organisations use AI to analyse large volumes of information, automate repetitive tasks, improve forecasting, and support better decision-making.",
      "When combined with Business Intelligence and Data Analytics, AI empowers organisations to make smarter decisions faster than ever before.",
    ],
  },
};

function parseHeadings(html: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    headings.push({ level, text, id });
  }
  return headings;
}

const getReadingTime = (html: string | null, fallbackBody?: string[]) => {
  let text = "";
  if (html) {
    text = html.replace(/<[^>]*>/g, "");
  } else if (fallbackBody) {
    text = fallbackBody.join(" ");
  }
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const getWordCount = (html: string | null, fallbackBody?: string[]) => {
  let text = "";
  if (html) {
    text = html.replace(/<[^>]*>/g, "");
  } else if (fallbackBody) {
    text = fallbackBody.join(" ");
  }
  return text.split(/\s+/).filter(Boolean).length;
};

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch post from Supabase `blog_posts`
  let post: any = null;
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    post = data || null;
  } catch {
    post = null;
  }

  const fallback = FALLBACK_POSTS[slug];

  if (!post && !fallback) {
    notFound();
  }

  const title = post?.title || fallback.title;
  const dateStr = post?.published_at || fallback.date;
  const coverUrl = post?.cover_url || null;
  const bodyHtml = post?.body_html || null;
  
  // Inject IDs into headings for anchor scrolls and scroll spy
  let processedHtml = bodyHtml;
  if (bodyHtml) {
    processedHtml = bodyHtml.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match: string, level: string, attrs: string, text: string) => {
      const id = text.replace(/<[^>]*>/g, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (!attrs.includes("id=")) {
        return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
      }
      return match;
    });
  }
  
  // Category variables
  const categoryTitle = post?.category_title || fallback.category;
  const categorySlug = post?.category_slug || fallback.catSlug;

  // Extract metadata properties
  const headings = bodyHtml ? parseHeadings(bodyHtml) : [];
  const readingTime = getReadingTime(bodyHtml, fallback?.body);
  const wordCount = getWordCount(bodyHtml, fallback?.body);
  const shareUrl = `${SITE_URL}/blog/${slug}`;

  // Check if post should use sandbox renderer
  const isLegacy = post && !post.status && (!post.authors_json || post.authors_json.length === 0);

  // Fetch related posts
  let relatedPosts: any[] = [];
  if (post) {
    try {
      if (post.related_ids && post.related_ids.length > 0) {
        const { data: rels } = await supabase
          .from("blog_posts")
          .select("title, slug, cover_url, published_at, description, body_html, category_title, category_slug")
          .in("id", post.related_ids);
        relatedPosts = rels || [];
      } else {
        const { data: rels } = await supabase
          .from("blog_posts")
          .select("title, slug, cover_url, published_at, description, body_html, category_title, category_slug")
          .eq("is_published", true)
          .eq("category_slug", categorySlug)
          .neq("slug", slug)
          .limit(2);
        relatedPosts = rels || [];
      }
    } catch {}
  }

  // Fetch courses to promote
  let promoCourses: any[] = [];
  try {
    const { data: courses } = await supabase
      .from("courses")
      .select("title, slug, summary, banner_url")
      .eq("is_published", true)
      .limit(2);
    promoCourses = courses || [];
  } catch {}

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const iframeRef = React.createRef<HTMLIFrameElement>();

  // Format authors
  const authors = post?.authors_json && post.authors_json.length > 0
    ? post.authors_json
    : [
        {
          name: post?.author_name || fallback?.author || "KVJ Analytics",
          slug: post?.author_slug || fallback?.authorSlug || "k-v-jacob",
          bio: post?.author_bio || "Director & Lead Consultant at KVJ Analytics.",
          avatar_url: "",
          designation: "Principal Consultant",
          company: "KVJ Analytics"
        }
      ];

  return (
    <div className="relative bg-[#050608] min-h-screen overflow-hidden text-slate-100 font-sans">
      
      {/* Background Gradient Mesh & Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-15%] w-[700px] h-[700px] bg-indigo-950/20 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[5%] left-[10%] w-[500px] h-[500px] bg-teal-950/15 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          datePublished: dateStr,
          author: authors.map((a: any) => ({ "@type": "Person", name: a.name, jobTitle: a.designation, affiliation: { "@type": "Organization", name: a.company } })),
          publisher: { "@type": "Organization", name: "KVJ Analytics", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
          image: coverUrl ? [coverUrl] : undefined,
          articleSection: categoryTitle,
          mainEntityOfPage: shareUrl,
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${SITE_URL}/blog`
            },
            {
              "@type": "ListItem",
              position: 3,
              name: categoryTitle,
              item: `${SITE_URL}/blog/category/${categorySlug}`
            },
            {
              "@type": "ListItem",
              position: 4,
              name: title,
              item: shareUrl
            }
          ]
        }) }}
      />

      {/* Premium Hero Section */}
      <header className="relative w-full pt-32 pb-16 min-h-[380px] flex items-end border-b border-white/5 z-10 bg-slate-950/30 overflow-hidden">
        {/* Banner Image Backdrop */}
        <div className="absolute inset-0 select-none pointer-events-none z-0">
          {coverUrl ? (
            <>
              <img src={coverUrl} alt={title} className="w-full h-full object-cover opacity-[0.22] filter blur-[0.5px] scale-102" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/75 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-[#050608]/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-[#0B2A22] relative">
              <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-corporate/5 rounded-full blur-[140px] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>
          )}
        </div>

        <Container className="relative z-10 w-full pb-16 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-6 font-mono select-none">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <Link href="/blog" className="hover:text-brand transition-colors">Blog</Link>
            <span className="text-white/20">/</span>
            <Link href={`/blog/category/${categorySlug}`} className="hover:text-brand transition-colors text-brand">{categoryTitle}</Link>
          </nav>

          <div className="space-y-4 max-w-4xl text-left animate-fade-in">
            {/* Category */}
            <div>
              <Link
                href={`/blog/category/${categorySlug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 rounded-full hover:bg-[#10B981]/25 transition-all"
              >
                {categoryTitle}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight font-display">
              {title}
            </h1>

            {/* Short Description */}
            <p className="text-base md:text-lg text-slate-350 leading-relaxed font-light max-w-3xl">
              {post?.description || fallback?.description}
            </p>

            {/* Metadata Bar */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 items-center text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-500" /> {formatDate(dateStr)}</span>
              <span className="h-3 w-px bg-white/10 hidden sm:inline" />
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-500" /> {readingTime} min read</span>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content Layout Section */}
      <Section className="relative z-10 py-16 md:py-24 bg-transparent">
        <Container className="max-w-7xl">
          
          <BlogClientFurniture
            headings={headings}
            shareUrl={shareUrl}
            shareTitle={title}
            readingTime={readingTime}
            wordCount={wordCount}
            publishedDate={dateStr}
            categoryTitle={categoryTitle}
            categorySlug={categorySlug}
            articleSlug={slug}
          >
            {/* Elegant Custom Styles for HTML Rendering */}
            <style dangerouslySetInnerHTML={{ __html: `
              .prose-editorial h2 { font-size: 1.75rem; font-weight: 700; color: #ffffff; margin-top: 2.5rem; margin-bottom: 1.25rem; font-family: var(--font-display); border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem; }
              .prose-editorial h3 { font-size: 1.35rem; font-weight: 600; color: #ffffff; margin-top: 2rem; margin-bottom: 0.75rem; font-family: var(--font-display); }
              .prose-editorial h4 { font-size: 1.15rem; font-weight: 600; color: #ffffff; margin-top: 1.75rem; margin-bottom: 0.5rem; }
              .prose-editorial p { font-size: 1.05rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 1.5rem; font-weight: 300; }
              .prose-editorial ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; color: #cbd5e1; }
              .prose-editorial ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; color: #cbd5e1; }
              .prose-editorial li { margin-bottom: 0.5rem; font-weight: 300; line-height: 1.7; }
              .prose-editorial a { color: #10B981; font-weight: 500; text-decoration: underline; text-underline-offset: 4px; transition: color 0.2s; }
              .prose-editorial a:hover { color: #34D399; }
              .prose-editorial blockquote { background: rgba(16, 185, 129, 0.03); border-left: 3px solid #10B981; padding: 1.25rem 1.75rem; margin: 2rem 0; border-radius: 0 12px 12px 0; }
              .prose-editorial blockquote p { color: #f1f5f9; font-style: italic; margin-bottom: 0; font-size: 1.1rem; }
              .prose-editorial img { border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); margin: 2.5rem auto; max-width: 100%; height: auto; }
              .prose-editorial table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem; }
              .prose-editorial th { background: rgba(255, 255, 255, 0.02); color: #ffffff; font-weight: 600; text-align: left; padding: 0.75rem 1rem; border-bottom: 2px solid rgba(255, 255, 255, 0.08); }
              .prose-editorial td { padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.04); color: #cbd5e1; }
              .prose-editorial code { background: rgba(255, 255, 255, 0.05); color: #10B981; padding: 0.2rem 0.4rem; border-radius: 6px; font-size: 0.85em; font-family: monospace; }
              .prose-editorial pre { background: #0B2A22; border: 1px solid rgba(255, 255, 255, 0.05); padding: 1.25rem; border-radius: 16px; overflow-x: auto; margin: 2rem 0; }
              .prose-editorial pre code { background: transparent; color: #cbd5e1; padding: 0; font-size: 0.9rem; }
            ` }} />
            {processedHtml ? (
              isLegacy ? (
                /* Legacy fallback text formatting */
                <div 
                  className="prose-editorial max-w-none text-slate-300 leading-relaxed font-normal text-[16px]"
                  dangerouslySetInnerHTML={{ __html: processedHtml }}
                />
              ) : (
                /* Premium Sandbox Iframe Renderer */
                <div className="w-full overflow-hidden bg-transparent">
                  <LessonIframe
                    html={processedHtml}
                    onContentWindow={(win) => {
                      if (iframeRef.current) {
                        (iframeRef as any).current.contentWindow = win;
                      }
                    }}
                  />
                  {/* Internal anchor listener dummy */}
                  <iframe ref={iframeRef} className="hidden" />
                </div>
              )
            ) : (
              /* Hardcoded Fallback Body Paragraphs */
              <div className="prose-editorial text-slate-300 leading-relaxed font-normal">
                {(fallback?.body || []).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            )}
          </BlogClientFurniture>

          {/* EDITORIAL CONCLUSION SECTION */}
          <footer className="mt-24 pt-20 border-t border-white/5 space-y-20 max-w-5xl mx-auto">
            
            {/* Promo CTA Cards (Training & Services) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Promo Card 1: Enterprise Training */}
              <div className="relative group bg-[#07130E]/40 border border-white/5 rounded-3xl p-8 hover:border-[#10B981]/25 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-soft">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-2xl bg-cyan-950/20 border border-[#10B981]/15 flex items-center justify-center text-[#10B981]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Unlock Live Analytics Training</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Access certified courses in Power BI dashboards, advanced spreadsheets, and automated SQL databases. Scoped for cohorts or corporate groups.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enterprise &amp; College Cohorts</span>
                  <Link 
                    href="/training" 
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#10B981] hover:underline"
                  >
                    <span>Explore training</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Promo Card 2: Consulting Services */}
              <div className="relative group bg-[#07130E]/40 border border-white/5 rounded-3xl p-8 hover:border-[#0D9488]/25 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-soft">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0D9488]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-2xl bg-blue-950/20 border border-[#0D9488]/15 flex items-center justify-center text-[#0D9488]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Bespoke Reporting Audits</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Partner with our engineering team to audit your current spreadsheets, connect direct database endpoints, and eliminate manual copy-paste bottlenecks.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Consulting &amp; Solutions</span>
                  <Link 
                    href="/#contact" 
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#0D9488] hover:underline"
                  >
                    <span>Explore services</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Newsletter Glass Card */}
            <div className="relative bg-gradient-to-br from-[#0B2A22]/80 to-[#07130E]/40 border border-white/5 p-8 md:p-12 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
              <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">Stay Informed</span>
                <h3 className="text-2xl font-extrabold text-white">Subscribe to Analytics Insights</h3>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
                  Join 2,000+ data leaders receiving weekly spreadsheet automations, dashboard layouts, and direct SQL workflows directly in their inbox.
                </p>
              </div>
              <form action="/api/inquiries" method="POST" className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-2.5">
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@company.com" 
                  required 
                  className="px-4 py-2.5 text-xs bg-[#050608] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#10B981]/30 placeholder-zinc-500 w-full sm:w-64 font-medium" 
                />
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 border-0"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Related Articles list */}
            {relatedPosts.length > 0 && (
              <div className="space-y-8 pt-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#10B981]" /> Related Articles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedPosts.map((rel: any) => {
                    const relReadingTime = getReadingTime(rel.body_html, [rel.description]);
                    return (
                      <div key={rel.slug} className="group bg-[#0B2A22]/35 border border-white/5 rounded-3xl p-5 hover:border-[#10B981]/20 transition-all flex flex-col md:flex-row gap-4 items-start shadow-soft">
                        <div className="w-full md:w-32 aspect-video md:aspect-square overflow-hidden rounded-2xl shrink-0 bg-white/5 border border-white/5 relative">
                          {rel.cover_url ? (
                            <img src={rel.cover_url} alt={rel.title} className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-102" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#050608] via-[#0B2A22] to-cyan-950/15" />
                          )}
                          <div className="absolute top-2 left-2 bg-[#050608]/75 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-[#10B981] uppercase tracking-wider">
                            {rel.category_title}
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between h-full pt-1">
                          <div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                              <span>{formatDate(rel.published_at)}</span>
                              <span>•</span>
                              <span>{relReadingTime} min read</span>
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-[#10B981] transition-colors mt-1.5 leading-snug">
                              <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                              {rel.description}
                            </p>
                          </div>
                          <Link href={`/blog/${rel.slug}`} className="text-[10px] font-extrabold uppercase text-[#10B981] tracking-wider mt-4 flex items-center gap-1">
                            <span>Read Article</span>
                            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Direct Contact Footer CTA */}
            <div className="pt-10 border-t border-white/5 text-center max-w-2xl mx-auto space-y-4">
              <h3 className="text-xl font-bold text-white">Have a specific challenge?</h3>
              <p className="text-xs text-slate-450 leading-relaxed max-w-md mx-auto">
                Schedule a 15-minute diagnostic call with our principal consultants. We'll outline automated reporting alternatives for your workflows.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link 
                  href="/#contact"
                  className="px-4 py-2 bg-[#07130E]/60 border border-white/10 hover:border-[#10B981]/30 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#10B981]" /> Consult an Engineer
                </Link>
              </div>
            </div>

          </footer>

        </Container>
      </Section>

    </div>
  );
}
