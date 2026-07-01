import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { JobApplyForm } from "@/components/JobApplyForm";
import { supabase } from "@/lib/supabase";

export const revalidate = 120; // Revalidate every 2 minutes

interface Job {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: "full_time" | "part_time" | "internship";
  department: string;
  description: string;
}

const FALLBACK_JOBS: Record<string, Job> = {
  "power-bi-developer": {
    id: "j1",
    slug: "power-bi-developer",
    title: "Power BI Developer",
    location: "Cochin / Remote",
    type: "full_time",
    department: "Consulting",
    description: `KVJ Analytics is looking for a mid-level Power BI developer experienced with DAX, Power Query, and SQL. You will build and deploy dashboards for enterprise clients, establish ETL pipelines, and audit query performance.

### Responsibilities:
- Model business database schemas into facts and dimensions.
- Write calculated DAX expressions for time intelligence and key metrics.
- Interface directly with client finance departments to map analytical pipelines.

### Requirements:
- 2+ years of professional dashboard building experience.
- Strong knowledge of database queries and SQL Joins.
- Excel spreadsheet macros (VBA) or Power Apps scripting is a plus.`,
  },
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let job: Job | null = null;

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("id, slug, title, location, type, department, description")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      job = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        location: data.location || "Cochin, India",
        type: data.type as any,
        department: data.department || "Consulting",
        description: data.description || "",
      };
    }
  } catch (err) {
    console.warn("Supabase job detail fetch error, falling back:", err);
  }

  if (!job) {
    job = FALLBACK_JOBS[slug] || null;
  }

  if (!job) {
    notFound();
  }

  return (
    <div className="w-full bg-[#050505] text-zinc-200 min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#0072FF]/5 rounded-full blur-[160px] pointer-events-none" />

      <Container>
        {/* Back Link */}
        <Link
          href="/careers"
          className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-[#00F0FF] mb-12 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Careers Board</span>
        </Link>

        {/* Split Details & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Left Column (60%): Job Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[9px] font-bold font-mono tracking-widest text-[#00F0FF] uppercase bg-[#00F0FF]/10 px-3 py-1 rounded-full border border-[#00F0FF]/15">
                  {job.department}
                </span>
                <span className="text-zinc-650 text-xs font-light">•</span>
                <span className="text-[9px] font-bold font-mono tracking-widest text-zinc-400 uppercase bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
                  {job.type.replace("_", " ")}
                </span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mt-6 leading-tight tracking-tight">
                {job.title}
              </h1>
            </div>

            {/* Meta Specs */}
            <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#0A0A0C]/55 border border-white/5 backdrop-blur-xl">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block font-mono">Location</span>
                <span className="text-white font-medium text-sm md:text-base mt-1.5 flex items-center gap-1.5 font-mono">
                  <MapPin className="w-4 h-4 text-[#0072FF] shrink-0" />
                  {job.location}
                </span>
              </div>
              <div className="border-l border-white/5 pl-6">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block font-mono">Job Classification</span>
                <span className="text-white font-medium text-sm md:text-base mt-1.5 flex items-center gap-1.5 font-mono">
                  <Briefcase className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  {job.type.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-white border-b border-white/5 pb-2">Role &amp; Requirements</h2>
              <div className="text-zinc-400 font-light leading-relaxed whitespace-pre-line space-y-4 prose prose-invert max-w-none">
                {job.description}
              </div>
            </div>
          </div>

          {/* Right Column (40%): Sticky Application Form */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <JobApplyForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
