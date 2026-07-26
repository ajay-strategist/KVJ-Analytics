import React from "react";
import { CategoryPageClient } from "@/components/CategoryPageClient";
import { getPublicCourses } from "@/lib/courses";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CAT_COLLEGES } from "@/lib/constants";

export const revalidate = 120;

export default async function CollegesTrainingPage() {
  // Real college-segment courses (added via admin). No fabricated demo fallback.
  const courses = await getPublicCourses("college");

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
