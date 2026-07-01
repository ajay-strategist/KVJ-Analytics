import React from "react";
import { notFound } from "next/navigation";
import { ContentPlayerClient } from "@/components/ContentPlayerClient";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Dynamic route

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch Course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (courseError || !course) {
    notFound();
  }

  // 2. Fetch Modules
  const { data: dbMods } = await supabase
    .from("modules")
    .select("id, title, display_order")
    .eq("course_id", course.id)
    .order("display_order", { ascending: true });

  let modules: any[] = [];
  if (dbMods && dbMods.length > 0) {
    // 3. Fetch Lessons
    const { data: dbLessons } = await supabase
      .from("lessons")
      .select("id, module_id, title, kind, max_score, video_url, content_html, display_order")
      .in("module_id", dbMods.map((m) => m.id))
      .order("display_order", { ascending: true });

    modules = dbMods.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: (dbLessons || [])
        .filter((l) => l.module_id === m.id)
        .map((l) => ({
          id: l.id,
          title: l.title,
          kind: l.kind as any,
          max_score: l.max_score,
          video_url: l.video_url || null,
          content_html: l.content_html || null,
        })),
    }));
  }

  // Fallback modules if empty
  if (modules.length === 0) {
    modules = [
      {
        id: "fallback-mod-1",
        title: "Introduction",
        lessons: [
          {
            id: "fallback-les-1",
            title: "Course Overview & Objectives",
            kind: "material",
            max_score: null,
            video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            content_html: "<h3>Overview</h3><p>Welcome to the training course. Follow these lessons and complete mock tests to get certified.</p>"
          }
        ]
      }
    ];
  }

  return <ContentPlayerClient course={course} modules={modules} />;
}
