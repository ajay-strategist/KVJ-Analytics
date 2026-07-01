import React from "react";
import { CategoryPageClient } from "@/components/CategoryPageClient";
import { supabase } from "@/lib/supabase";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CAT_ONE_TO_ONE } from "@/lib/constants";

export const revalidate = 120;

export default async function OneToOneTrainingPage() {
  let courses: any[] = [];

  try {
    const { data: catData } = await supabase
      .from("course_categories")
      .select("id")
      .eq("slug", "one-to-one")
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
    console.warn("Supabase fetch one-to-one courses error:", err);
  }

  const oneToOneCat = mergePageContent(await getPageContent("training-one-to-one"), FALLBACK_CAT_ONE_TO_ONE);

  return (
    <CategoryPageClient
      categorySlug="one-to-one"
      categoryName={oneToOneCat.name}
      categoryDesc={oneToOneCat.description}
      courses={courses}
    />
  );
}
