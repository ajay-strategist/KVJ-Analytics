import React from "react";
import fs from "fs";
import path from "path";
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

/**
 * Strip HTML block comments (<!-- ... -->) from the source.
 * This prevents the integration-guide comment block in local HTML files
 * from leaking as visible text inside the iframe (caused by </script>
 * tags inside the comment breaking the comment boundary).
 */
function stripHtmlComments(html: string): string {
  // Non-greedy match handles nested/multiple comment blocks
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; campaign?: string; form?: string }>;
}) {
  const params = await searchParams;
  const courseSlug = params.course;
  const campaignId = params.campaign;
  const formId = params.form;
  
  let courses: { id: string; slug: string; title: string }[] = [];
  let customFormHtml: string | null = null;
  const db = getAdminClient();

  // Helper: load static HTML files from "Course Registration Forms/" folder
  const loadLocalHtmlForm = (fileName?: string): string | null => {
    try {
      const dir = path.join(process.cwd(), "Course Registration Forms");
      if (fileName && fs.existsSync(path.join(dir, fileName))) {
        return fs.readFileSync(path.join(dir, fileName), "utf-8");
      }
      const defaultAiFile = path.join(dir, "AI Course Registration.html");
      if (fs.existsSync(defaultAiFile)) {
        return fs.readFileSync(defaultAiFile, "utf-8");
      }
    } catch (e) {
      console.error("Error reading local HTML form:", e);
    }
    return null;
  };
  
  if (db) {
    try {
      // 1. Campaign param → campaigns table
      if (campaignId) {
        const { data: campaignData } = await db
          .from("campaigns")
          .select("registration_form_html, registration_form_id")
          .or(`campaign_id.eq.${campaignId},id.eq.${campaignId}`)
          .maybeSingle();

        if (campaignData?.registration_form_html?.trim()) {
          customFormHtml = campaignData.registration_form_html;
        } else if (campaignData?.registration_form_id) {
          const { data: formData } = await db
            .from("registration_forms")
            .select("html_content")
            .eq("id", campaignData.registration_form_id)
            .maybeSingle();
          if (formData?.html_content?.trim()) {
            customFormHtml = formData.html_content;
          }
        }
      }

      // 2. Form param → registration_forms table
      if (!customFormHtml && formId) {
        const { data: formData } = await db
          .from("registration_forms")
          .select("html_content")
          .eq("id", formId)
          .maybeSingle();
        if (formData?.html_content?.trim()) {
          customFormHtml = formData.html_content;
        }
      }

      // 3. Fetch published courses (+ course-level custom form)
      const { data, error } = await db
        .from("courses")
        .select("id, slug, title, registration_form_html")
        .eq("is_published", true)
        .order("display_order", { ascending: true });
        
      if (!error && data) {
        courses = data.map(({ id, slug, title }: any) => ({ id, slug, title }));
        
        // If a specific course is requested, load course custom form HTML
        if (!customFormHtml && courseSlug) {
          const matched = data.find((c: any) => c.slug === courseSlug || c.id === courseSlug);
          if (matched?.registration_form_html?.trim()) {
            customFormHtml = matched.registration_form_html;
          }
        }
      }
    } catch (err) {
      console.error("Failed to load courses for registration page:", err);
    }
  }

  // 4. Local HTML file fallback for AI / Data Analytics slugs
  if (!customFormHtml) {
    if (courseSlug === "ai" || courseSlug === "ai-and-data-analytics" || courseSlug === "data-analytics" || formId === "ai") {
      customFormHtml = loadLocalHtmlForm("AI Course Registration.html");
    }
  }

  // Strip HTML comments BEFORE rendering to prevent integration-guide text leak
  if (customFormHtml) {
    customFormHtml = stripHtmlComments(customFormHtml);
  }

  // Fallback courses list if database is empty
  if (courses.length === 0) {
    courses = [
      { id: "fallback-excel-id", slug: "excel-mis-automation", title: "Advanced Excel & MIS Automation" },
      { id: "fallback-powerbi-id", slug: "power-bi-business-analytics", title: "Power BI Business Analytics & BI" },
      { id: "fallback-analytics-id", slug: "data-analytics", title: "Data Analytics" }
    ];
  }

  // ─── Custom HTML form: full-page iframe, no website chrome ───────────────
  if (customFormHtml) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#000",
          width: "100vw",
          height: "100dvh",
        }}
      >
        <iframe
          srcDoc={customFormHtml}
          sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          title="Course Registration Form"
        />
      </div>
    );
  }

  // ─── Generic dynamic form ─────────────────────────────────────────────────
  return (
    <div className="w-full bg-base text-slate min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#10B981]/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[#0D9488]/4 rounded-full blur-[160px] pointer-events-none" />

      <Container className="relative z-10">
        <Reveal className="max-w-3xl mx-auto text-center mb-12">
          <SplitHeading
            as="h1"
            className="text-[34px] lg:text-[48px] font-bold tracking-tight leading-[1.1] font-display text-ink mb-4"
          >
            Register Your Interest
          </SplitHeading>
          <p className="text-lg text-slate font-light leading-relaxed">
            Fill in your details below to request program details, schedule, fee structures, and
            counselor guidance for the selected training track.
          </p>
        </Reveal>

        <Reveal delay={100} className="w-full">
          <DynamicRegisterForm courses={courses} initialCourseSlug={courseSlug} />
        </Reveal>
      </Container>
    </div>
  );
}
