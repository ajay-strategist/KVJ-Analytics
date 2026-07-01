import React from "react";
import { CategoryPageClient } from "@/components/CategoryPageClient";
import { supabase } from "@/lib/supabase";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CAT_CORPORATE } from "@/lib/constants";

export const revalidate = 120;

export default async function CorporateTrainingPage() {
  let courses: any[] = [];

  try {
    const { data: catData } = await supabase
      .from("course_categories")
      .select("id")
      .eq("slug", "corporate")
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
    console.warn("Supabase fetch corporate courses error:", err);
  }

  // Fallback if empty
  if (courses.length === 0) {
    courses = [
      {
        id: "c3",
        slug: "corporate-automation-bootcamp",
        title: "Corporate Automation Bootcamp (Demo)",
        summary: "Enterprise workflow design and automated reporting pipeline construction.",
        banner_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        duration: "4 Weeks",
        fee_inr: 12000,
        is_locked: true,
      },
    ];
  }

  const cat = mergePageContent(await getPageContent("training-corporate"), FALLBACK_CAT_CORPORATE);

  return (
    <CategoryPageClient
      categorySlug="corporate"
      categoryName={cat.name}
      categoryDesc={cat.description}
      courses={courses}
    />
  );
}
