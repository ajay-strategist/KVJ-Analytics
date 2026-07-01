import React from "react";
import { CategoryPageClient } from "@/components/CategoryPageClient";
import { supabase } from "@/lib/supabase";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CAT_COLLEGES } from "@/lib/constants";

export const revalidate = 120;

export default async function CollegesTrainingPage() {
  let courses: any[] = [];

  try {
    const { data: catData } = await supabase
      .from("course_categories")
      .select("id")
      .eq("slug", "colleges")
      .single();

    if (catData) {
      const { data, error } = await supabase
        .from("courses")
        .select("id, slug, title, summary, banner_url, duration, fee_inr, is_locked")
        .eq("category_id", catData.id)
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
          is_locked: !!c.is_locked,
        }));
      }
    }
  } catch (err) {
    console.warn("Supabase fetch college courses error:", err);
  }

  // Fallback if empty
  if (courses.length === 0) {
    courses = [
      {
        id: "c1",
        slug: "excel-mis-automation",
        title: "Advanced Excel & MIS Automation (Demo)",
        summary: "Master formula consolidation, reporting loops, and dashboard designs using real corporate MIS datasets.",
        banner_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        duration: "6 Weeks",
        fee_inr: 4999,
        is_locked: false,
      },
    ];
  }

  const cat = mergePageContent(await getPageContent("training-colleges"), FALLBACK_CAT_COLLEGES);

  return (
    <CategoryPageClient
      categorySlug="colleges"
      categoryName={cat.name}
      categoryDesc={cat.description}
      courses={courses}
    />
  );
}
