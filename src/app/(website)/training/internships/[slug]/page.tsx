import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InternshipApplyForm } from "@/components/InternshipApplyForm";
import { supabase } from "@/lib/supabase";

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

const FALLBACK_INTERNSHIPS: Record<string, Internship> = {
  "data-analytics-intern": {
    id: "int1",
    slug: "data-analytics-intern",
    title: "Data Analytics Intern",
    description: "Learn database querying, dashboard layout building, and presentation skills under senior consultants.",
    banner_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    duration: "3 Months",
    stipend: "₹5,000 / Month (demo)",
  },
};

export default async function InternshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let internship: Internship | null = null;

  try {
    const { data, error } = await supabase
      .from("internships")
      .select("id, slug, title, description, banner_url, duration, stipend")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      internship = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description || "",
        banner_url: data.banner_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        duration: data.duration || "3 Months",
        stipend: data.stipend || "Unpaid",
      };
    }
  } catch (err) {
    console.warn("Supabase internship detail fetch error, falling back:", err);
  }

  if (!internship) {
    internship = FALLBACK_INTERNSHIPS[slug] || null;
  }

  if (!internship) {
    notFound();
  }

  return (
    <div className="w-full bg-base text-slate min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#0D9488]/5 rounded-full blur-[160px] pointer-events-none" />

      <Container>
        {/* Back Link */}
        <Link
          href="/training/internships"
          className="inline-flex items-center text-sm font-semibold text-slate hover:text-[#10B981] mb-12 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Internships</span>
        </Link>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Left Column (60%): Info, Banner, Desc */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-[#10B981] uppercase px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                Internship Program
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-6 leading-tight tracking-tight">
                {internship.title}
              </h1>
            </div>

            {/* Banner Image */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-line bg-zinc-950">
              <img src={internship.banner_url} alt={internship.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/75 via-transparent to-transparent" />
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl card-tone-emerald border border-line backdrop-blur-xl">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">Duration</span>
                <span className="text-ink font-medium text-sm md:text-base mt-1.5 flex items-center gap-1.5 font-mono">
                  <Clock className="w-4 h-4 text-[#0D9488] shrink-0" />
                  {internship.duration}
                </span>
              </div>
              <div className="border-l border-line pl-6">
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">Stipend / Comp</span>
                <span className="text-ink font-medium text-sm md:text-base mt-1.5 flex items-center gap-1.5 font-mono">
                  <DollarSign className="w-4 h-4 text-[#10B981] shrink-0" />
                  {internship.stipend}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-ink border-b border-line pb-2">Program Details</h2>
              <p className="text-slate font-light leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </div>
          </div>

          {/* Right Column (40%): Sticky application form */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <InternshipApplyForm internshipId={internship.id} internshipTitle={internship.title} />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
