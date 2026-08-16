import React from "react";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SplitHeading } from "@/components/v3/ScrollFx";
import { Reveal } from "@/components/ui/Reveal";
import { DynamicRegisterForm } from "@/components/shared/DynamicRegisterForm";
import { createClient } from "@supabase/supabase-js";
import { pageMeta, resolveSeo } from "@/lib/seo";
import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; campaign?: string; form?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const courseSlug = params.course;

  let pageTitle = "Register Interest — KVJ Analytics";
  let pageDesc =
    "Register for professional spreadsheet modeling, MIS automation, Power BI dashboards, and data analytics training programs.";

  const db = getAdminClient();
  if (db && courseSlug) {
    try {
      const { data } = await db
        .from("courses")
        .select("title")
        .eq("slug", courseSlug)
        .maybeSingle();
      if (data?.title) {
        pageTitle = `Register for ${data.title} — KVJ Analytics`;
        pageDesc = `Enroll in our professional ${data.title} training program. Reserve your seat today!`;
      }
    } catch {
      // ignore
    }
  }

  return resolveSeo("/training/register", {
    title: pageTitle,
    description: pageDesc,
    keywords: ["course registration", "analytics training", "enrollment interest"],
  });
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Map of course slug / form trigger keys → paths inside /public/forms/
 * When a match is found and the file exists, the server redirects the browser
 * directly to the standalone HTML page — no iframe, no z-index fights.
 */
const LOCAL_FORM_MAP: Record<string, string> = {
  "ai": "/forms/ai-registration.html",
  "ai-and-data-analytics": "/forms/ai-registration.html",
  "data-analytics": "/forms/ai-registration.html",
};

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

  if (db) {
    try {
      // 1. Campaign param → look up campaigns table for DB-stored HTML
      if (campaignId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(campaignId);
        let query = db
          .from("campaigns")
          .select("registration_form_html, registration_form_id");

        if (isUuid) {
          query = query.or(`campaign_id.eq.${campaignId},id.eq.${campaignId}`);
        } else {
          query = query.eq("campaign_id", campaignId);
        }

        const { data: campaignData } = await query.maybeSingle();

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

      // 3. Fetch published courses + optional course-level custom form HTML
      const { data, error } = await db
        .from("courses")
        .select("id, slug, title, registration_form_html")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        courses = data.map(({ id, slug, title }: any) => ({ id, slug, title }));

        if (!customFormHtml && courseSlug) {
          const matched = data.find(
            (c: any) => c.slug === courseSlug || c.id === courseSlug
          );
          if (matched?.registration_form_html?.trim()) {
            customFormHtml = matched.registration_form_html;
          }
        }
      }
    } catch (err) {
      console.error("Failed to load courses for registration page:", err);
    }
  }

  // 4. Local static HTML file redirect — ONLY when no campaign is specified.
  //    If a campaign is present (even with no HTML yet), skip this redirect so
  //    the admin can build/assign the form dynamically via the Code Editor.
  if (!customFormHtml && !campaignId) {
    const localKey = courseSlug ?? formId ?? "";
    const localPath = LOCAL_FORM_MAP[localKey];
    if (localPath) {
      redirect(localPath);
    }
  }

  // Fallback courses if database is empty
  if (courses.length === 0) {
    courses = [
      { id: "fallback-excel-id", slug: "excel-mis-automation", title: "Advanced Excel & MIS Automation" },
      { id: "fallback-powerbi-id", slug: "power-bi-business-analytics", title: "Power BI Business Analytics & BI" },
      { id: "fallback-analytics-id", slug: "data-analytics", title: "Data Analytics" },
    ];
  }

  // ─── DB-stored HTML form: render in a full-page iframe ─────────────────────
  if (customFormHtml) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          width: "100vw",
          height: "100dvh",
          overflow: "hidden",
          background: "#0a0f23",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Hide layout components that clash with the custom standalone page design */
              header, footer, .noise-overlay, .scroll-progress, a[href*="wa.me"] {
                display: none !important;
              }
              /* Lock parent scrolling and force full height layout */
              html, body {
                overflow: hidden !important;
                height: 100% !important;
              }
              /* Ensure the page wrapper does not constrain the fixed overlay */
              main {
                padding-top: 0 !important;
                height: 100vh !important;
              }
              /* Re-enable interactions and native scroll inside the iframe */
              iframe {
                pointer-events: auto !important;
              }
            `,
          }}
        />
        <iframe
          srcDoc={customFormHtml}
          sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title="Course Registration Form"
        />
      </div>
    );
  }

  // ─── Generic dynamic form ───────────────────────────────────────────────────
  return (
    <div className="w-full bg-base text-slate min-h-screen pt-28 pb-24 relative overflow-hidden">
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
