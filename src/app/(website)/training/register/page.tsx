import React from "react";
import { Container } from "@/components/ui/Container";
import { SplitHeading } from "@/components/v3/ScrollFx";
import { Reveal } from "@/components/ui/Reveal";
import { DynamicRegisterForm } from "@/components/shared/DynamicRegisterForm";
import { createClient } from "@supabase/supabase-js";
import { pageMeta } from "@/lib/seo";

export const revalidate = 0; // Dynamic route

export const metadata = pageMeta({
  title: "Register Interest — KVJ Analytics",
  description:
    "Register for professional spreadsheet modeling, MIS automation, Power BI dashboards, and data analytics training programs.",
  path: "/training/register",
  keywords: ["course registration", "analytics training", "enrollment interest"],
});

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course: courseSlug } = await searchParams;
  
  // Fetch dynamic published courses list from Supabase
  let courses: { id: string; slug: string; title: string }[] = [];
  const db = getAdminClient();
  
  if (db) {
    try {
      const { data, error } = await db
        .from("courses")
        .select("id, slug, title")
        .eq("is_published", true)
        .order("display_order", { ascending: true });
        
      if (!error && data) {
        courses = data;
      }
    } catch (err) {
      console.error("Failed to load courses for registration page:", err);
    }
  }

  // Fallback courses if database is empty/unconfigured
  if (courses.length === 0) {
    courses = [
      { id: "fallback-excel-id", slug: "excel-mis-automation", title: "Advanced Excel & MIS Automation" },
      { id: "fallback-powerbi-id", slug: "power-bi-business-analytics", title: "Power BI Business Analytics & BI" },
      { id: "fallback-analytics-id", slug: "data-analytics", title: "Data Analytics" }
    ];
  }

  return (
    <div className="w-full bg-base text-slate min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#10B981]/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[#0D9488]/4 rounded-full blur-[160px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Header Block */}
        <Reveal className="max-w-3xl mx-auto text-center mb-12">
          <SplitHeading
            as="h1"
            className="text-[34px] lg:text-[48px] font-bold tracking-tight leading-[1.1] font-display text-ink mb-4"
          >
            Register Your Interest
          </SplitHeading>
          <p className="text-lg text-slate font-light leading-relaxed">
            Fill in your details below to request program details, schedule, fee structures, and counselor guidance for the selected training track.
          </p>
        </Reveal>

        {/* Dynamic Form block */}
        <Reveal delay={100} className="w-full">
          <DynamicRegisterForm courses={courses} initialCourseSlug={courseSlug} />
        </Reveal>
      </Container>
    </div>
  );
}
