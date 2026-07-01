import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_INTERNSHIPS_PAGE } from "@/lib/constants";

export const revalidate = 120; // Revalidate every 2 minutes

interface Internship {
  id: string;
  slug: string;
  title: string;
  description: string;
  banner_url?: string;
  duration: string;
  stipend: string;
}

const FALLBACK_INTERNSHIPS: Internship[] = [
  {
    id: "int1",
    slug: "data-analytics-intern",
    title: "Data Analytics Intern",
    description: "Learn database querying, dashboard layout building, and presentation skills under senior consultants.",
    banner_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    duration: "3 Months",
    stipend: "₹5,000 / Month (demo)",
  },
];

export default async function InternshipsPage() {
  let internships: Internship[] = [];

  try {
    const { data, error } = await supabase
      .from("internships")
      .select("id, slug, title, description, banner_url, duration, stipend")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      internships = data.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description || "",
        banner_url: item.banner_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        duration: item.duration || "3 Months",
        stipend: item.stipend || "Unpaid",
      }));
    }
  } catch (err) {
    console.warn("Supabase internships fetch error, falling back:", err);
  }

  if (internships.length === 0) {
    internships = FALLBACK_INTERNSHIPS;
  }

  const header = mergePageContent(await getPageContent("internships"), FALLBACK_INTERNSHIPS_PAGE);

  return (
    <div className="w-full bg-[#050505] text-zinc-200 min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#0072FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        {/* Title */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-sm text-zinc-400 font-light mb-4">
            <Link href="/training" className="hover:text-[#00F0FF] transition-colors">Training Hub</Link>
            <span>/</span>
            <span className="text-[#00F0FF]">Internships</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
            {header.headingLead} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#0072FF] to-[#00F0FF] bg-[size:200%_auto]">{header.headingAccent}</span>
          </h1>
          <p className="text-zinc-400 font-light text-lg leading-relaxed mt-4">
            {header.intro}
          </p>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {internships.map((intern, idx) => (
            <Reveal key={intern.id} delay={idx * 80} variant="up">
              <div className="bg-[#0A0A0C]/55 border border-white/5 p-6 rounded-3xl flex flex-col h-full hover:border-[#00F0FF]/25 hover:shadow-[0_8px_32px_rgba(0,240,255,0.04)] transition-all duration-300 relative group overflow-hidden">
                
                {/* Banner */}
                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 mb-5 shrink-0">
                  <img src={intern.banner_url} alt={intern.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/85 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                      {intern.title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-light leading-relaxed mt-2.5 line-clamp-3">
                      {intern.description}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="border-t border-white/5 pt-4 mt-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span className="flex items-center gap-1.5 font-light">
                        <Clock className="w-4 h-4 text-[#0072FF]" /> Duration
                      </span>
                      <span className="text-zinc-200 font-bold">{intern.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span className="flex items-center gap-1.5 font-light">
                        <DollarSign className="w-4 h-4 text-[#00F0FF]" /> Stipend
                      </span>
                      <span className="text-zinc-200 font-bold">{intern.stipend}</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="border-t border-white/5 pt-4 mt-5 shrink-0">
                  <Link href={`/training/internships/${intern.slug}`} className="w-full">
                    <Button className="w-full py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold text-xs border-none flex items-center justify-center gap-1.5">
                      View Details &amp; Apply <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
