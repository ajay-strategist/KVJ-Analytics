import React from "react";
import Image from "next/image";
import { Check, ChevronDown, LayoutGrid, Target, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { CTASection } from "@/components/ui/CTASection";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

// Approved content (CEO)
const TRAINING_AREAS = [
  "Advanced Excel",
  "Power BI",
  "Data Analytics",
  "Dashboard Development",
  "Financial Analytics",
  "Automation Tools",
  "Business Intelligence",
];

const OUR_APPROACH = [
  "Hands-On Learning",
  "Real Business Scenarios",
  "Industry-Oriented Curriculum",
  "Assignment-Based Practice",
  "Placement-Focused Skill Development",
];

type Course = {
  title: string;
  slug: string;
  segment?: string;
  summary?: string;
  priceINR?: number;
  isPaid?: boolean;
  thumbnail?: string | null;
};

const FALLBACK_COURSES: Course[] = [
  {
    title: "Advanced Excel & MIS Automation",
    slug: "excel-mis-automation",
    segment: "college",
    summary:
      "Master formula consolidation, reporting loops, and dashboard designs using real corporate MIS datasets.",
    priceINR: 4999,
    isPaid: true,
    thumbnail: null,
  },
  {
    title: "Power BI Business Analytics & BI",
    slug: "power-bi-business-analytics",
    segment: "corporate",
    summary:
      "Connect live data sources, design KPI tiles, and deploy interactive boards for senior executives.",
    priceINR: 7999,
    isPaid: true,
    thumbnail: null,
  },
];

export default async function TrainingCatalogPage() {
  let courses: Course[] = [];
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("title, slug, segment, summary, price_inr, is_paid, thumbnail_url")
      .order("display_order", { ascending: true });

    if (error) throw error;
    courses = (data || []).map((c) => ({
      title: c.title,
      slug: c.slug,
      segment: c.segment,
      summary: c.summary || "",
      priceINR: Number(c.price_inr || 0),
      isPaid: !!c.is_paid,
      thumbnail: c.thumbnail_url || null,
    }));
  } catch (err) {
    console.warn("Supabase fetch error in TrainingCatalogPage:", err);
  }

  if (!courses || courses.length === 0) {
    courses = FALLBACK_COURSES;
  }

  return (
    <>
      {/* ───── HERO + INFO (premium light) ───── */}
      <section className="relative mesh-hero hero-grid hero-bleed overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-hero text-ink">
        <div className="blob animate-blob absolute -top-24 right-[-4rem] w-[30rem] h-[30rem] bg-brand/10 pointer-events-none" />
        <div className="blob animate-blob absolute bottom-[-6rem] left-[-4rem] w-[24rem] h-[24rem] bg-education/8 pointer-events-none" style={{ animationDelay: "4s" }} />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Reveal>
              <p className="text-[13px] uppercase tracking-[0.2em] text-brand mb-5 font-bold">Training</p>
            </Reveal>
            <RevealText
              as="h1"
              text="Training & Skill Development"
              className="font-display font-medium text-[40px] sm:text-[50px] lg:text-[60px] leading-[1.06] tracking-[-0.025em] mb-5 text-ink"
            />
            <Reveal delay={150}>
              <p className="text-xl md:text-2xl signature-gradient-text font-medium mb-5">
                Practical Learning With Industry Relevance
              </p>
              <p className="text-lg text-slate font-light leading-relaxed">
                Our programs are designed to build real-world skills through hands-on learning, live
                datasets, and practical assignments.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="#courses" variant="accent">
                  Explore Our Courses
                  <ChevronDown className="w-4 h-4 ml-1.5 inline-block" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Training Areas + Our Approach */}
          <div className="grid lg:grid-cols-2 gap-7 max-w-5xl mx-auto items-start">
            <Reveal className="card-premium p-8 sm:p-10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="grid place-items-center h-12 w-12 rounded-2xl bg-brand/10 border border-brand/20 text-brand">
                  <LayoutGrid className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-medium text-ink">Training Areas</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {TRAINING_AREAS.map((area) => (
                  <span
                    key={area}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 transition-colors"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} className="card-premium p-8 sm:p-10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="grid place-items-center h-12 w-12 rounded-2xl bg-education/10 border border-education/20 text-education">
                  <Target className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-medium text-ink">Our Approach</h2>
              </div>
              <ul className="space-y-3.5">
                {OUR_APPROACH.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="grid place-items-center h-6 w-6 rounded-full bg-education/10 text-education shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-base text-slate font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ───── COURSES ───── */}
      <Section id="courses" background="surface" className="border-t border-line scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[13px] uppercase tracking-[0.2em] text-brand mb-3">Courses</p>
            <BoldStatement variant="h1" as="h2">Explore Our Courses</BoldStatement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {courses.map((course, idx) => (
              <Reveal key={idx} delay={(idx % 3) * 100} className="h-full">
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Let's Build Smarter Systems Together"
        description="Request a demo or schedule a meeting to discuss training programs for your team or institution."
        primaryCtaText="Request a Demo"
        primaryCtaHref="/contact"
        secondaryCtaText="Contact Our Team"
        secondaryCtaHref="/contact"
      />
    </>
  );
}

function CourseCard({ course }: { course: Course }) {
  const isCorporate = course.segment === "corporate";
  return (
    <div className="card-premium group flex flex-col h-full p-5 overflow-hidden">
      {/* Thumbnail */}
      <div className="overflow-hidden rounded-xl aspect-[16/10] relative mb-5 border border-line">
        {course.thumbnail && typeof course.thumbnail === "string" ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-105"
            style={{
              background: isCorporate
                ? "radial-gradient(120% 120% at 80% 0%, rgba(45,214,206,0.5) 0%, transparent 55%), linear-gradient(150deg, #1A1340 0%, #0D0A1C 100%)"
                : "radial-gradient(120% 120% at 80% 0%, rgba(124,92,255,0.55) 0%, transparent 55%), linear-gradient(150deg, #1A1340 0%, #0D0A1C 100%)",
            }}
          >
            <span className="text-lg font-medium font-display text-white text-center leading-tight relative z-10">
              {course.title}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-xl font-medium text-ink mb-3 leading-snug group-hover:text-brand transition-colors duration-200">
        {course.title}
      </h3>
      <p className="text-sm text-slate leading-relaxed mb-6 font-light">{course.summary}</p>

      <div className="border-t border-line pt-4 flex items-center justify-between mt-auto">
        <div>
          <span className="text-[10px] font-semibold text-muted uppercase tracking-[0.12em] block leading-none">
            {course.isPaid ? "Investment" : "Program Code"}
          </span>
          <span className="text-lg font-medium text-ink font-display mt-1 block">
            {course.isPaid ? `₹${course.priceINR}` : "Campus Access"}
          </span>
        </div>
        <Button href={`/training/${course.slug}`} variant="secondary" className="px-4 py-2 text-xs">
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
