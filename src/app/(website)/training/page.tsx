import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Cpu, Laptop, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/ui/CTASection";
import { supabase } from "@/lib/supabase";
import { TrainingLoginCTA } from "@/components/TrainingLoginCTA";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_TRAINING_HUB } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Training — Power BI, Excel, Data Analytics Courses & Programs",
  description:
    "Practical, placement-focused training in Advanced Excel, Power BI, Data Analytics, dashboards and automation. Online courses, corporate & college programs, one-to-one mentoring and internships.",
  path: "/training",
  keywords: ["Power BI training", "Excel training", "data analytics course", "corporate training", "college training", "online analytics courses", "internships"],
});

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  type: "self_serve" | "inquiry";
}

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat1",
    slug: "one-to-one",
    name: "One-to-One",
    description: "Personalized mentoring sessions tailored for custom growth plans.",
    image_url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800",
    type: "inquiry",
  },
  {
    id: "cat2",
    slug: "corporate",
    name: "Corporate",
    description: "Dedicated team automation, reports, and analytical solutions training.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    type: "inquiry",
  },
  {
    id: "cat3",
    slug: "colleges",
    name: "Colleges",
    description: "Curriculum partnerships and evaluation systems for students and academies.",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    type: "inquiry",
  },
  {
    id: "cat4",
    slug: "online-courses",
    name: "Online Courses",
    description: "Self-paced video courses for professional spreadsheet modeling and analytics.",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    type: "self_serve",
  },
  {
    id: "cat5",
    slug: "internships",
    name: "Internships",
    description: "Hands-on project experience with placement-focused learning paths.",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
    type: "self_serve",
  },
];

const CATEGORY_ICONS: Record<string, any> = {
  "one-to-one": Users,
  corporate: Cpu,
  colleges: GraduationCap,
  "online-courses": Laptop,
  internships: BookOpen,
};

export default async function TrainingHubPage() {
  let categories: Category[] = [];

  try {
    const { data, error } = await supabase
      .from("course_categories")
      .select("id, slug, name, description, image_url, type")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      categories = data.map((cat: any) => ({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description || "",
        image_url: cat.image_url || FALLBACK_CATEGORIES.find(c => c.slug === cat.slug)?.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        type: cat.type as any,
      }));
    }
  } catch (err) {
    console.warn("Supabase category fetch error, falling back:", err);
  }

  if (categories.length === 0) {
    categories = FALLBACK_CATEGORIES;
  }

  // Editable page content (admin-managed via /admin/content → "Training Hub")
  const hub = mergePageContent(await getPageContent("training"), FALLBACK_TRAINING_HUB);
  const hubCta = { ...FALLBACK_TRAINING_HUB.cta, ...(hub as any).cta };

  return (
    <div className="w-full bg-[#050505] text-zinc-200 relative min-h-screen pt-28">
      {/* Glowing backdrop spotlights */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[#0072FF]/5 rounded-full blur-[160px] pointer-events-none" />

      <Container className="pb-24">
        {/* Title */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00F0FF] px-3.5 py-1.5 bg-[#00F0FF]/10 rounded-full w-fit border border-[#00F0FF]/20">
            {hub.eyebrow}
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mt-6 tracking-tight leading-tight">
            {hub.headingLead} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#0072FF] to-[#00F0FF] bg-[size:200%_auto]">{hub.headingAccent}</span>
          </h1>
          <p className="text-zinc-400 font-light text-lg md:text-xl leading-relaxed mt-4">
            {hub.intro}
          </p>
          <TrainingLoginCTA />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = CATEGORY_ICONS[cat.slug] || Laptop;
            const targetUrl = `/training/${cat.slug}`;

            // Make the first card span 2 cols on tablet/desktop if total items is odd/5 to look extremely premium
            const isLargeCard = idx === 0 || idx === 3;

            return (
              <Reveal key={cat.id} delay={idx * 80} variant="up" className={isLargeCard ? "md:col-span-2 lg:col-span-2" : "col-span-1"}>
                <Link
                  href={targetUrl}
                  className="group relative flex flex-col justify-end min-h-[350px] rounded-3xl overflow-hidden border border-white/5 hover:border-[#00F0FF]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,240,255,0.08)] bg-[#0A0A0C]"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${cat.image_url})` }}
                  />
                  {/* Dark Shade Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/65 to-transparent z-10" />

                  {/* Glassmorphic border glow effect on hover */}
                  <div className="absolute inset-0 bg-[#00F0FF]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  {/* Card Content */}
                  <div className="relative z-20 p-8 flex flex-col space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/25 flex items-center justify-center text-[#00F0FF] group-hover:bg-[#00F0FF] group-hover:text-black transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold font-mono tracking-widest text-[#00F0FF] uppercase px-2 py-0.5 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/15">
                        {cat.type === "inquiry" ? "B2B / Program" : "Self-Serve"}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold font-display text-white group-hover:text-[#00F0FF] transition-colors flex items-center gap-2">
                        {cat.name}
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#00F0FF]" />
                      </h2>
                      <p className="text-zinc-350 text-sm font-light mt-2 leading-relaxed max-w-md">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>

      <CTASection
        title={hubCta.title}
        description={hubCta.description}
        primaryCtaText={hubCta.primaryCtaText}
        primaryCtaHref={hubCta.primaryCtaHref}
        secondaryCtaText={hubCta.secondaryCtaText}
        secondaryCtaHref={hubCta.secondaryCtaHref}
      />
    </div>
  );
}
