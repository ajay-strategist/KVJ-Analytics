import React from "react";
import { CategoryPageClient } from "@/components/CategoryPageClient";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CAT_ONE_TO_ONE } from "@/lib/constants";

export const revalidate = 120;

export default async function OneToOneTrainingPage() {
  // One-to-one is a personalised-mentoring (inquiry) category — no self-serve course list.
  const courses: never[] = [];

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
