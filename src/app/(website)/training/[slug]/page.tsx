import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { CourseClientWrapper } from "@/components/CourseClientWrapper";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

const FALLBACK_COURSES: Record<
  string,
  {
    title: string;
    segment: string;
    summary: string;
    priceINR: number;
    isPaid: boolean;
    introduction: string;
    syllabus: string[];
  }
> = {
  "excel-mis-automation": {
    title: "Advanced Excel & MIS Automation",
    segment: "college",
    summary:
      "Master formula consolidation, reporting loops, and dashboard designs using real corporate MIS datasets.",
    priceINR: 4999,
    isPaid: false,
    introduction: "<h3>Advanced Excel Syllabus</h3><p>Master MIS consolidation and workflows.</p>",
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
    introduction: "<h3>Power BI Course Intro</h3><p>Learn to connect live data sources and deploy boards.</p>",
    syllabus: [
      "Data ingestion modeling: defining facts, dimensions, and relationships.",
      "DAX logic: writing time intelligence formulas and performance indices.",
      "Data visualization: designing board templates and executive filters.",
      "Deployment & RLS: setting up role-based safety gates and sharing dashboards.",
    ],
  },
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch Course details from Supabase
  let course: any = null;
  let dbModules: any[] = [];

  try {
    const { data: dbCourse, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (dbCourse) {
      course = dbCourse;

      // Fetch Modules & Lessons
      const { data: mods, error: modsError } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", course.id)
        .order("display_order", { ascending: true });

      if (mods && mods.length > 0) {
        const { data: less, error: lessError } = await supabase
          .from("lessons")
          .select("*")
          .in("module_id", mods.map((m) => m.id))
          .order("display_order", { ascending: true });

        dbModules = mods.map((m) => ({
          id: m.id,
          title: m.title,
          lessons: (less || [])
            .filter((l) => l.module_id === m.id)
            .map((l) => ({
              id: l.id,
              title: l.title,
              kind: l.kind,
              max_score: l.max_score,
            })),
        }));
      }
    }
  } catch (err) {
    console.warn("Supabase fetch error in CourseDetailPage:", err);
  }

  const fallback = FALLBACK_COURSES[slug];

  if (!course && !fallback) {
    notFound();
  }

  const id = course?.id || `fallback-id-${slug}`;
  const title = course?.title || fallback?.title || "Untitled Course";
  const segment = course?.segment || fallback?.segment || "college";
  const summary = course?.summary || fallback?.summary || "";
  const priceINR = course?.price_inr !== undefined ? Number(course.price_inr) : (fallback?.priceINR ?? 0);
  const isPaid = course?.is_paid !== undefined ? !!course.is_paid : (fallback?.isPaid ?? false);
  const introduction = course?.introduction || fallback?.introduction || "";

  // Build modules list from fallback if not present in DB
  let modules = dbModules;
  if (modules.length === 0 && fallback) {
    modules = [
      {
        id: `fallback-mod-${slug}`,
        title: "Course Curriculum Outline",
        lessons: fallback.syllabus.map((item, idx) => ({
          id: `fallback-les-${slug}-${idx}`,
          title: item,
          kind: "material",
          max_score: null,
        })),
      },
    ];
  }

  return (
    <Section background="default" className="bg-base relative overflow-hidden">
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
                Syllabus &amp; Core Outline
              </BoldStatement>

              {introduction ? (
                <div
                  className="prose prose-slate max-w-none text-slate leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: introduction }}
                />
              ) : (
                <p className="text-slate italic">No course syllabus details uploaded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic client-side course panel (Syllabus items, Lock badges, Pay, Join code inputs) */}
        <div className="max-w-5xl mx-auto border-t border-line pt-12">
          <CourseClientWrapper
            course={{ id, title, slug, segment, summary, priceINR, isPaid }}
            modules={modules}
          />
        </div>
      </Container>
    </Section>
  );
}
