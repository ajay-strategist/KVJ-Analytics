import React from "react";
import { TrainingClientContent } from "@/components/TrainingClient";
import { CTASection } from "@/components/ui/CTASection";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

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
      <TrainingClientContent courses={courses} />

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
