import React from "react";
import { CategoryPageClient } from "@/components/CategoryPageClient";
import { getPublicCourses } from "@/lib/courses";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CAT_CORPORATE } from "@/lib/constants";

export const revalidate = 120;

export default async function CorporateTrainingPage() {
  // Real corporate-segment courses (added via admin). No fabricated demo fallback.
  const courses = await getPublicCourses("corporate");

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
