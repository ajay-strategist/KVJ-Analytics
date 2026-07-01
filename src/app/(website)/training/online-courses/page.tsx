import React from "react";
import { OnlineCoursesClient } from "@/components/OnlineCoursesClient";
import { supabase } from "@/lib/supabase";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_ONLINE_COURSES } from "@/lib/constants";

export const revalidate = 120; // Revalidate every 2 minutes for updates

export default async function OnlineCoursesCatalogPage() {
  let courses: any[] = [];

  try {
    // 1. Fetch category ID for "online-courses"
    const { data: categoryData } = await supabase
      .from("course_categories")
      .select("id")
      .eq("slug", "online-courses")
      .single();

    if (categoryData) {
      // 2. Fetch published courses matching category_id
      const { data, error } = await supabase
        .from("courses")
        .select("id, slug, title, summary, banner_url, duration, fee_inr, offer_price_inr, offer_label, is_locked")
        .eq("category_id", categoryData.id)
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        courses = data.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          summary: c.summary || "",
          banner_url: c.banner_url || null,
          duration: c.duration || "Self-Paced",
          fee_inr: Number(c.fee_inr || 0),
          offer_price_inr: c.offer_price_inr != null ? Number(c.offer_price_inr) : null,
          offer_label: c.offer_label || null,
          is_locked: !!c.is_locked,
        }));
      }
    }
  } catch (err) {
    console.warn("Supabase fetch error in OnlineCoursesCatalogPage:", err);
  }

  // Fallback courses if DB is empty or fails (e.g. in test env)
  if (courses.length === 0) {
    courses = [
      {
        id: "c1",
        slug: "excel-mis-automation",
        title: "Advanced Excel & MIS Automation (Demo)",
        summary: "Master formula consolidation, reporting loops, and dashboard designs using real corporate MIS datasets.",
        banner_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        duration: "6 Weeks",
        fee_inr: 4999,
        offer_price_inr: 3499,
        offer_label: "Early Bird 30% Off",
        is_locked: false,
      },
      {
        id: "c2",
        slug: "power-bi-business-analytics",
        title: "Power BI Business Analytics & BI (Demo)",
        summary: "Connect live data sources, design KPI tiles, and deploy interactive boards for senior executives.",
        banner_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
        duration: "8 Weeks",
        fee_inr: 7999,
        offer_price_inr: 5999,
        offer_label: "Special Launch Pricing",
        is_locked: false,
      },
    ];
  }

  const header = mergePageContent(await getPageContent("online-courses"), FALLBACK_ONLINE_COURSES);

  return <OnlineCoursesClient courses={courses} header={header} />;
}
