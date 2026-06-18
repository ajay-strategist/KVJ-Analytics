import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { CourseClientWrapper } from "@/components/CourseClientWrapper";
import { client } from "@/sanity/lib/client";

export const revalidate = 3600;

const FALLBACK_COURSES: Record<string, { title: string; segment: string; summary: string; priceINR: number; isPaid: boolean; syllabus: string[] }> = {
  "excel-mis-automation": {
    title: "Advanced Excel & MIS Automation",
    segment: "college",
    summary:
      "Master formula consolidation, reporting loops, and dashboard designs using real corporate MIS datasets.",
    priceINR: 4999,
    isPaid: false,
    syllabus: [
      "Introduction to advanced nested formulas and logical criteria tests.",
      "Power Query data pipeline building: merging directory files with single-click refresh.",
      "Interactive KPI creation: sparklines, conditional formats, and dynamic ranges.",
      "VBA macros: writing simple script loops to parse data scorecards and email them.",
    ],
  },
  "power-bi-business-analytics": {
    title: "Power BI Business Analytics & BI",
    segment: "corporate",
    summary:
      "Connect live data sources, design KPI tiles, and deploy interactive boards for senior executives.",
    priceINR: 7999,
    isPaid: true,
    syllabus: [
      "Data ingestion modeling: defining facts, dimensions, and relationships.",
      "DAX logic: writing time intelligence formulas and performance indices.",
      "Data visualization: designing board templates and executive filters.",
      "Deployment & RLS: setting up role-based safety gates and sharing dashboards.",
    ],
  },
};

const FALLBACK_MATERIALS = [
  { _id: "m1", title: "MIS Consolidation Worksheet (Excel Template)", type: "pdf" as const, isPreview: true },
  { _id: "m2", title: "Power Query Data Loader Guide (PDF Manual)", type: "pdf" as const, isPreview: false },
  { _id: "m3", title: "Interactive Charts & Slicer Tutorial (Video Link)", type: "video" as const, isPreview: false },
];

const FALLBACK_TESTS = [
  { _id: "t1", title: "Advanced Formulas & Logical Functions Test", durationMins: 30, passMark: 10, questionCount: 10 },
];

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // 1. Fetch Course details
  const course = await client
    .fetch(
      `*[_type == "course" && slug.current == $slug][0] {
        title,
        "slug": slug.current,
        segment,
        summary,
        syllabus,
        priceINR,
        isPaid
      }`,
      { slug }
    )
    .catch(() => null);

  const fallback = FALLBACK_COURSES[slug];

  if (!course && !fallback) {
    notFound();
  }

  // 2. Fetch associated materials
  let materials = await client
    .fetch(
      `*[_type == "material" && course->slug.current == $slug] | order(order asc) {
        _id,
        title,
        type,
        isPreview
      }`,
      { slug }
    )
    .catch(() => []);

  // 3. Fetch associated mock tests
  let tests = await client
    .fetch(
      `*[_type == "mockTest" && course->slug.current == $slug] | order(created_at desc) {
        _id,
        title,
        durationMins,
        passMark,
        "questionCount": count(questions)
      }`,
      { slug }
    )
    .catch(() => []);

  const title = course?.title || fallback.title;
  const segment = course?.segment || fallback.segment;
  const summary = course?.summary || fallback.summary;
  const priceINR = course?.priceINR || fallback.priceINR;
  const isPaid = course?.isPaid !== undefined ? course.isPaid : fallback.isPaid;

  if (materials.length === 0) {
    materials = FALLBACK_MATERIALS;
  }
  if (tests.length === 0) {
    tests = FALLBACK_TESTS;
  }

  return (
    <Section background="default" className="bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Back Link */}
        <Link
          href="/training"
          className="inline-flex items-center text-sm font-bold text-slate hover:text-brand mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Catalog</span>
        </Link>

        {/* Course Core details */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex items-center space-x-2.5 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${
                segment === "corporate" ? "bg-corporate" : "bg-education"
              }`}
            >
              {segment} program
            </span>
          </div>
          <BoldStatement variant="hero" className="mb-6 leading-tight text-ink">
            {title}
          </BoldStatement>
          <p className="text-lg md:text-xl text-slate font-medium leading-relaxed mb-10 max-w-3xl">
            {summary}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8 items-start">
            <div className="lg:col-span-12">
              <BoldStatement variant="h3" className="mb-8">
                Syllabus & Core Outline
              </BoldStatement>

              {course?.syllabus ? (
                <div className="prose prose-slate max-w-none text-slate leading-relaxed">
                  <PortableText value={course.syllabus} />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {fallback.syllabus.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-4 bg-surface/50 border border-line/60 rounded-xl p-4.5 shadow-soft hover:shadow-hover-lift hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="w-6.5 h-6.5 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-base text-ink font-semibold leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic client-side course panel (Syllabus items, Lock badges, Pay, Join code inputs) */}
        <div className="max-w-5xl mx-auto border-t border-line pt-12">
          <CourseClientWrapper
            course={{ title, slug, segment, summary, priceINR, isPaid }}
            materials={materials}
            tests={tests}
          />
        </div>
      </Container>
    </Section>
  );
}
