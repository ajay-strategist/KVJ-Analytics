import React from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { client } from "@/sanity/lib/client";
import { serviceBySlugQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const FALLBACK_SERVICES: Record<string, { title: string; desc: string; details: string[] }> = {
  "report-automation": {
    title: "Report Automation",
    desc: "Automate MIS, financial, operational, and management reports with speed and accuracy.",
    details: [
      "Say goodbye to hours of copying and pasting cells manually.",
      "Consolidate multiple files and ERP data pipelines with single-click routines.",
      "Reduce calculation errors and data mismatch issues.",
      "Create scalable macros, scripts, and scheduled data loaders.",
    ],
  },
  "data-visualization": {
    title: "Data Visualization",
    desc: "Convert complex data into meaningful visual insights and interactive reports.",
    details: [
      "Design clear visual hierarchies that highlight operational insights.",
      "Map out comparative trends and monthly performance breakdowns.",
      "Structure charts and KPIs to align with corporate audit standards.",
      "Incorporate company color styles for unified board presentations.",
    ],
  },
  "spreadsheet-consulting": {
    title: "Spreadsheet Consulting",
    desc: "Advanced Excel systems, automation, validation, and optimization solutions.",
    details: [
      "Audit existing formulas for performance bottle-necks and calculation lag.",
      "Build robust financial models with dynamic inputs and forecasting.",
      "Structure spreadsheet rules to validate inputs and prevent accidental data loss.",
      "Implement custom VBA scripts to extend spreadsheet capabilities.",
    ],
  },
  "dashboard-development": {
    title: "Dashboard Development",
    desc: "Real-time dashboards for KPI tracking, performance monitoring, and business intelligence.",
    details: [
      "Connect live data sources directly to unified dashboard portals.",
      "Track daily operations metrics, sales volumes, and regional outputs.",
      "Build drill-down layers to view details from global maps to specific transactions.",
      "Share interactive reports securely with team leaders and managers.",
    ],
  },
  "process-automation": {
    title: "Process Automation",
    desc: "Reduce manual work through intelligent workflow and process automation.",
    details: [
      "Analyze business processes to isolate repetitive manual steps.",
      "Integrate tools to sync data across folders, spreadsheets, and databases.",
      "Deploy background automation jobs that run 24/7 without intervention.",
      "Configure automated email alerts and task assignments on critical events.",
    ],
  },
  "corporate-training": {
    title: "Corporate Training",
    desc: "Hands-on training in Excel, Power BI, analytics, dashboards, and automation tools.",
    details: [
      "Deliver customized training programs matching your team's skill gap.",
      "Provide practical datasets and assignments modeled after actual business MIS.",
      "Increase worker efficiency in using advanced formatting and modeling.",
      "Review post-training skill assessments and performance scorecards.",
    ],
  },
};

export default async function CorporateServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Query Sanity for service matching this slug
  const service = await client
    .fetch(serviceBySlugQuery, { slug })
    .catch(() => null);

  const fallback = FALLBACK_SERVICES[slug];

  if (!service && !fallback) {
    notFound();
  }

  const title = service?.title || fallback.title;
  const description = service?.shortDescription || fallback.desc;
  const details = fallback?.details || [
    "Expertly designed workflows matching industry standards.",
    "Integrated analytics models built for immediate business utility.",
    "Tailored documentation and post-delivery operations support.",
  ];

  return (
    <Section background="default" className="bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Back Link */}
        <Link
          href="/corporate"
          className="inline-flex items-center text-sm font-bold text-slate hover:text-brand mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Corporate Solutions</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Main Details */}
          <div className="lg:col-span-7">
            <Eyebrow segment="corporate" className="mb-3">
              Corporate Solution Detail
            </Eyebrow>
            <BoldStatement variant="hero" className="mb-6 leading-tight text-ink">
              {title}
            </BoldStatement>
            <p className="text-lg text-slate leading-relaxed mb-8 font-medium">
              {description}
            </p>

            {/* Rich portable text from Sanity if available */}
            {service?.body ? (
              <div className="prose prose-slate prose-lg max-w-none mb-8 text-slate leading-relaxed">
                <PortableText value={service.body} />
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                <h4 className="text-xl font-bold font-display text-ink flex items-center mb-4">
                  <Zap className="w-5 h-5 text-corporate mr-2.5" />
                  Key Capabilities & Outcomes
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {details.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3.5 bg-surface/50 border border-line/70 rounded-xl p-4 shadow-soft hover:shadow-hover-lift transition-all duration-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-education shrink-0 mt-0.5" />
                      <span className="text-base text-ink font-semibold leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Conversion Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative overflow-hidden bg-surface/40 rounded-card border border-line/80 p-8 shadow-soft border-l-4 border-l-corporate hover:shadow-hover-lift hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-corporate/5 rounded-full blur-2xl pointer-events-none" />
              <span className="inline-flex p-3 rounded-xl bg-corporate/10 text-corporate mb-6 relative z-10">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h4 className="text-xl font-bold font-display text-ink mb-4 relative z-10">
                Smarter Systems. Zero Lag.
              </h4>
              <p className="text-sm text-slate leading-relaxed mb-6 font-semibold relative z-10">
                Consult with our Cochin-based developers to audit your manual excel files or automate operational dashboard structures.
              </p>
              
              <div className="space-y-3 mb-8 relative z-10">
                {[
                  "Over 16+ years of consulting expertise",
                  "Serving India, UAE, Oman, Europe, & USA",
                  "Scalable, non-programmer operated handoffs"
                ].map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center space-x-2 text-xs font-bold text-slate/85">
                    <span className="w-1.5 h-1.5 rounded-full bg-corporate shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <Button
                href={`/contact?interest=${encodeURIComponent(title)}`}
                className="w-full py-4 text-center font-bold bg-corporate hover:bg-brand-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 relative z-10"
              >
                Book a Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
