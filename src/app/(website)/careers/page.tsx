import React from "react";
import Link from "next/link";
import { Briefcase, MapPin, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CAREERS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";

export const revalidate = 120; // Revalidate every 2 minutes
export const metadata = pageMeta({
  title: "Careers — Join KVJ Analytics",
  description:
    "Build a career in analytics, Power BI, automation and consulting with KVJ Analytics. View open roles in Cochin and remote positions.",
  path: "/careers",
  keywords: ["analytics jobs Cochin", "Power BI developer jobs", "data analyst careers", "KVJ Analytics careers"],
});

interface Job {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: "full_time" | "part_time" | "internship";
  department: string;
  description: string;
}

const FALLBACK_JOBS: Job[] = [
  {
    id: "j1",
    slug: "power-bi-developer",
    title: "Power BI Developer",
    location: "Cochin / Remote",
    type: "full_time",
    department: "Consulting",
    description: "We are seeking a mid-level Power BI developer experienced with DAX, Power Query, and SQL.",
  },
];

export default async function CareersPage() {
  let jobs: Job[] = [];

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("id, slug, title, location, type, department, description")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      jobs = data.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        location: item.location || "Cochin, India",
        type: item.type as any,
        department: item.department || "Consulting",
        description: item.description || "",
      }));
    }
  } catch (err) {
    console.warn("Supabase jobs fetch error, falling back:", err);
  }

  if (jobs.length === 0) {
    jobs = FALLBACK_JOBS;
  }

  const header = mergePageContent(await getPageContent("careers"), FALLBACK_CAREERS);

  return (
    <div className="w-full bg-[#050505] text-zinc-200 min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#0072FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00F0FF] px-3.5 py-1.5 bg-[#00F0FF]/10 rounded-full w-fit border border-[#00F0FF]/20 font-mono">
            {header.eyebrow}
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mt-6 tracking-tight leading-tight">
            {header.headingLead} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#0072FF] to-[#00F0FF] bg-[size:200%_auto]">{header.headingAccent}</span>
          </h1>
          <p className="text-zinc-400 font-light text-lg md:text-xl leading-relaxed mt-4">
            {header.intro}
          </p>
        </div>

        {/* Jobs List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {jobs.map((job, idx) => (
            <Reveal key={job.id} delay={idx * 80} variant="up">
              <div className="bg-[#0A0A0C]/55 border border-white/5 p-6 md:p-8 rounded-3xl hover:border-[#0072FF]/30 hover:shadow-[0_8px_32px_rgba(0,240,255,0.04)] transition-all duration-300 relative group overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Job Title and Meta details */}
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] font-bold font-mono tracking-widest text-[#00F0FF] uppercase bg-[#00F0FF]/10 px-2.5 py-0.5 rounded border border-[#00F0FF]/15">
                      {job.department}
                    </span>
                    <span className="text-zinc-650 text-xs font-light">•</span>
                    <span className="text-[9px] font-bold font-mono tracking-widest text-zinc-400 uppercase bg-zinc-900 px-2.5 py-0.5 rounded border border-white/5">
                      {job.type.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-[#00F0FF] transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                    <span className="flex items-center gap-1.5 font-light">
                      <MapPin className="w-4 h-4 text-[#0072FF] shrink-0" />
                      {job.location}
                    </span>
                  </div>
                </div>

                {/* Apply Trigger Button */}
                <div className="shrink-0">
                  <Link href={`/careers/${job.slug}`}>
                    <Button className="py-2.5 px-6 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold text-xs border-none flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(0,240,255,0.08)]">
                      View Position <ArrowRight className="w-3.5 h-3.5" />
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
