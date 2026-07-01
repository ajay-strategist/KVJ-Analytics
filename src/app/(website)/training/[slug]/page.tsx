import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Award, CheckCircle, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CourseClientWrapper } from "@/components/CourseClientWrapper";
import { supabase } from "@/lib/supabase";

export const revalidate = 120; // Revalidate every 2 minutes

const FALLBACK_COURSES: Record<
  string,
  {
    id?: string;
    title: string;
    segment: string;
    summary: string;
    fee_inr: number;
    offer_price_inr: number | null;
    offer_label: string | null;
    offer_expiry: string | null;
    is_locked: boolean;
    isPaid: boolean;
    duration: string;
    banner_url: string;
    introduction: string;
    syllabus: string[];
  }
> = {
  "excel-mis-automation": {
    title: "Advanced Excel & MIS Automation",
    segment: "college",
    summary:
      "Master formula consolidation, reporting loops, and dashboard designs using real corporate MIS datasets.",
    fee_inr: 4999,
    offer_price_inr: 3499,
    offer_label: "Early Bird 30% Off",
    offer_expiry: new Date(Date.now() + 3 * 86400000).toISOString(),
    is_locked: false,
    isPaid: true,
    duration: "6 Weeks",
    banner_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
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
    fee_inr: 7999,
    offer_price_inr: 5999,
    offer_label: "Special Launch Pricing",
    offer_expiry: new Date(Date.now() + 5 * 86400000).toISOString(),
    is_locked: false,
    isPaid: true,
    duration: "8 Weeks",
    banner_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
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
          .in("module_id", mods.map((m: any) => m.id))
          .order("display_order", { ascending: true });

        dbModules = mods.map((m: any) => ({
          id: m.id,
          title: m.title,
          lessons: (less || [])
            .filter((l: any) => l.module_id === m.id)
            .map((l: any) => ({
              id: l.id,
              title: l.title,
              kind: l.kind as any,
              max_score: l.max_score,
              video_url: l.video_url || null,
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

  const id = course?.id || fallback?.id || `fallback-id-${slug}`;
  const title = course?.title || fallback?.title || "Untitled Course";
  const segment = course?.segment || fallback?.segment || "college";
  const summary = course?.summary || fallback?.summary || "";
  const fee_inr = course?.fee_inr !== undefined ? Number(course.fee_inr) : (fallback?.fee_inr ?? 0);
  const offer_price_inr = course?.offer_price_inr !== undefined ? (course.offer_price_inr !== null ? Number(course.offer_price_inr) : null) : (fallback?.offer_price_inr ?? null);
  const offer_label = course?.offer_label || fallback?.offer_label || null;
  const offer_expiry = course?.offer_expiry || fallback?.offer_expiry || null;
  const is_locked = course?.is_locked !== undefined ? !!course.is_locked : (fallback?.is_locked ?? false);
  const isPaid = course?.is_paid !== undefined ? !!course.is_paid : (fallback?.isPaid ?? false);
  const duration = course?.duration || fallback?.duration || "Self-Paced";
  const banner_url = course?.banner_url || fallback?.banner_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";
  const introduction = course?.introduction || fallback?.introduction || "";
  const syllabus = course?.syllabus || fallback?.syllabus || [];

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
          video_url: null,
        })),
      },
    ];
  }

  return (
    <div className="w-full bg-[#050505] text-zinc-200 min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#0072FF]/5 rounded-full blur-[160px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Back Link */}
        <Link
          href="/training/online-courses"
          className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-[#00F0FF] mb-12 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Courses</span>
        </Link>

        {/* Client Wrapper renders the unified 2-column grid */}
        <CourseClientWrapper
          course={{
            id,
            title,
            slug,
            segment,
            summary,
            banner_url,
            duration,
            fee_inr,
            offer_price_inr,
            offer_label,
            offer_expiry,
            is_locked,
            isPaid,
            introduction,
            syllabus,
          }}
          modules={modules}
        />
      </Container>
    </div>
  );
}

