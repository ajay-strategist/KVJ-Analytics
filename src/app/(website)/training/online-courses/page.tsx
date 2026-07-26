import React from "react";
import { OnlineCoursesClient } from "@/components/OnlineCoursesClient";
import { getPublicCourses } from "@/lib/courses";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_ONLINE_COURSES } from "@/lib/constants";

export const revalidate = 120; // Revalidate every 2 minutes for updates

export default async function OnlineCoursesCatalogPage() {
  // Full published catalogue of real courses (added via the admin). No fabricated demos —
  // an empty catalogue renders an honest empty state.
  const courses = await getPublicCourses();

  const header = mergePageContent(await getPageContent("online-courses"), FALLBACK_ONLINE_COURSES);

  return <OnlineCoursesClient courses={courses} header={header} />;
}
