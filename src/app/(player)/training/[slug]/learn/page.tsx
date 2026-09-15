import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ContentPlayerClient } from "@/components/assessment/ContentPlayerClient";
import { supabase } from "@/lib/supabase";
import { adminToken } from "@/lib/adminAuth";

export const revalidate = 0; // Dynamic route

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string; lesson?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isPreviewParam = resolvedSearchParams?.preview === "1" || resolvedSearchParams?.preview === "true";
  const initialLessonId = resolvedSearchParams?.lesson || null;

  // Any signed-in admin (verified server-side via the admin cookie) who EXPLICITLY requests a preview
  // gets full access to the materials — no student login, enrolment or payment. A student without this cookie
  // or the preview flag still hits the normal enrolment gate in ContentPlayerClient.
  const cookieStore = await cookies();
  const adminPreview = (cookieStore.get("admin_session")?.value === adminToken()) && isPreviewParam;

  // 1. Fetch Course with nested modules and lessons in a single relational query (eliminating 2 extra roundtrips)
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      slug,
      modules (
        id,
        title,
        display_order,
        lessons (
          id,
          module_id,
          title,
          kind,
          max_score,
          video_url,
          content_html,
          display_order
        )
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (courseError || !course) {
    notFound();
  }

  // Sort modules and lessons in memory by display_order
  let modules: any[] = [];
  if (course.modules && course.modules.length > 0) {
    const rawModules = [...course.modules].sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0));
    modules = rawModules.map((m: any) => ({
      id: m.id,
      title: m.title,
      lessons: (m.lessons || [])
        .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((l: any) => ({
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

  return <ContentPlayerClient course={course} modules={modules} adminPreview={adminPreview} initialLessonId={initialLessonId} />;
}
