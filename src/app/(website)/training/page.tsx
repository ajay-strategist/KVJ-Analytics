import React from "react";
import Image from "next/image";
import { Check, ChevronDown, LayoutGrid, Target } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/ui/CTASection";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

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
  thumbnail?: Record<string, unknown> | null;
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
    courses = await client.fetch(
      `*[_type == "course"] | order(order asc) {
        title,
        "slug": slug.current,
        segment,
        summary,
        priceINR,
        isPaid,
        thumbnail
      }`
    );
  } catch (err) {
    console.warn("Sanity fetch error in TrainingCatalogPage:", err);
  }

  if (!courses || courses.length === 0) {
    courses = FALLBACK_COURSES;
  }

  return (
    <>
      {/* Top Section — Approved content */}
      <Section background="default" className="mesh-hero relative overflow-hidden">
        <div className="blob animate-blob absolute -top-24 right-[-4rem] w-[26rem] h-[26rem] bg-brand/10 pointer-events-none" />
        <div className="blob animate-blob absolute bottom-[-6rem] left-[-4rem] w-[22rem] h-[22rem] bg-education/10 pointer-events-none" style={{ animationDelay: "4s" }} />

        <Container className="relative z-10">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-up">
            <Eyebrow className="mb-4">Training</Eyebrow>
            <BoldStatement variant="hero" className="mb-5">
              Training &amp; Skill Development
            </BoldStatement>
            <p className="text-xl md:text-2xl font-bold font-display signature-gradient-text mb-5">
              Practical Learning With Industry Relevance
            </p>
            <p className="text-lg text-slate font-medium leading-relaxed">
              Our programs are designed to build real-world skills through hands-on learning, live
              datasets, and practical assignments.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="#courses" variant="primary" className="px-8 py-4">
                Explore Our Courses
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Training Areas + Our Approach */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
            <Reveal className="card-premium border-t-4 border-t-brand p-8 sm:p-10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="grid place-items-center h-11 w-11 rounded-2xl bg-brand/10 text-brand">
                  <LayoutGrid className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-bold font-display text-ink tracking-tight">Training Areas</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {TRAINING_AREAS.map((area) => (
                  <span
                    key={area}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-brand/5 text-brand border border-brand/10 hover:bg-brand/10 transition-colors"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} className="card-premium border-t-4 border-t-education p-8 sm:p-10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="grid place-items-center h-11 w-11 rounded-2xl bg-education/10 text-education">
                  <Target className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-bold font-display text-ink tracking-tight">Our Approach</h2>
              </div>
              <ul className="space-y-3.5">
                {OUR_APPROACH.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="grid place-items-center h-6 w-6 rounded-full bg-education/10 text-education shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-base text-slate font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Courses — unified list */}
      <Section id="courses" background="surface" className="bg-surface border-t border-line/60 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow className="mb-3">Courses</Eyebrow>
            <BoldStatement variant="h1" as="h2">
              Explore Our Courses
            </BoldStatement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  const shadowHover = isCorporate
    ? "hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)]"
    : "hover:shadow-[0_12px_32px_rgba(13,148,136,0.12)]";

  return (
    <Card hoverLift className={`flex flex-col justify-between h-full border-line/80 p-6 transition-all duration-300 relative overflow-hidden group ${shadowHover}`}>
      <div>
        {/* Thumbnail Box */}
        <div className="overflow-hidden rounded-xl aspect-[16/10] relative mb-5 bg-brand/5 border border-line/80">
          {course.thumbnail ? (
            <Image
              src={urlFor(course.thumbnail).url()}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 signature-gradient opacity-80 flex items-center justify-center text-white p-6">
              <span className="text-lg font-bold font-display text-center leading-tight transition-transform duration-300 group-hover:scale-105 relative z-10">
                {course.title}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold font-display text-ink mb-3 leading-snug group-hover:text-brand transition-colors duration-200">
          {course.title}
        </h3>
        <p className="text-sm text-slate leading-relaxed mb-6 font-medium">
          {course.summary}
        </p>
      </div>

      <div className="border-t border-line/80 pt-4 flex items-center justify-between mt-auto">
        <div>
          <span className="text-[10px] font-bold text-slate uppercase tracking-[0.1em] block leading-none">
            {course.isPaid ? "Investment" : "Program Code"}
          </span>
          <span className="text-lg font-bold text-ink font-display mt-1 block">
            {course.isPaid ? `₹${course.priceINR}` : "Campus Access"}
          </span>
        </div>
        <Button href={`/training/${course.slug}`} variant="secondary" className="px-4 py-2 text-xs">
          View Details
        </Button>
      </div>
    </Card>
  );
}
