import React from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Zap, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CORPORATE, CURRENT_EXP_YEARS } from "@/lib/constants";

export const revalidate = 3600;

import { Metadata } from "next";
import { resolveSeo, breadcrumbSchema } from "@/lib/seo";

const SERVICE_KEYWORDS: Record<string, string[]> = {
  "report-automation": [
    "report automation",
    "automated MIS reporting",
    "Excel automation consulting",
    "ERP data pipeline",
    "management reporting automation",
  ],
  "data-visualization": [
    "data visualization consulting",
    "Power BI executive dashboards",
    "business intelligence reporting",
    "interactive analytics visualizer",
  ],
  "spreadsheet-consulting": [
    "spreadsheet consulting",
    "advanced Excel financial modeling",
    "Excel formula audit",
    "spreadsheet performance optimization",
  ],
  "dashboard-development": [
    "Power BI dashboard development",
    "KPI tracking dashboards",
    "business performance dashboards",
    "operational analytics dashboards",
  ],
  "app-development": [
    "custom business application development",
    "reporting workflows",
    "internal tools development",
  ],
  "process-automation": [
    "business process automation",
    "reporting workflow automation",
    "data consolidation pipeline",
  ],
  "corporate-training": [
    "corporate Power BI training",
    "advanced Excel corporate workshops",
    "business analytics corporate training",
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let title = "Corporate Solution";
  let description = "Corporate dashboard, report automation and consulting solutions from KVJ Analytics.";

  try {
    const pageData = await getPageContent("corporate");
    const page = mergePageContent(pageData, FALLBACK_CORPORATE);
    const services = page.services && page.services.length > 0 ? page.services : FALLBACK_CORPORATE.services;
    const service = services.find((s: any) => s.slug === slug);

    if (service) {
      title = service.title;
      description = service.shortDescription || description;
    }
  } catch {}

  return resolveSeo(`/corporate/${slug}`, {
    title: `${title} | KVJ Analytics Solutions`,
    description,
    keywords: SERVICE_KEYWORDS[slug] || ["corporate analytics", "report automation", "Power BI"],
  });
}

export default async function CorporateServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pageData = await getPageContent("corporate");
  const page = mergePageContent(pageData, FALLBACK_CORPORATE);
  const services = page.services && page.services.length > 0 ? page.services : FALLBACK_CORPORATE.services;
  const service = services.find((s: any) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const title = service.title;
  const description = service.shortDescription;
  const problemSolved = service.problemSolved;
  const targetAudience = service.targetAudience || [];
  const details = service.details || [
    "Expertly designed workflows matching industry standards.",
    "Integrated analytics models built for immediate business utility.",
    "Tailored documentation and post-delivery operations support.",
  ];

  const otherServices = services.filter((s: any) => s.slug !== slug).slice(0, 3);

  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "KVJ Analytics",
      "url": "https://www.kvjanalytics.in"
    }
  };

  const schemaBreadcrumbs = breadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Corporate Solutions", item: "/corporate" },
    { name: title, item: `/corporate/${slug}` },
  ]);

  return (
    <Section background="default" className="bg-base relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />
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

            {/* Operational Challenge Callout */}
            {problemSolved ? (
              <div className="mb-8 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Operational Challenge Addressed
                </h4>
                <p className="text-slate text-sm leading-relaxed">{problemSolved}</p>
              </div>
            ) : null}

            {/* Target Audience / Best Suited For */}
            {targetAudience.length > 0 ? (
              <div className="mb-8 p-5 rounded-2xl border border-brand/20 bg-brand/[0.03]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Recommended For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {targetAudience.map((role: string, rIdx: number) => (
                    <span
                      key={rIdx}
                      className="px-3 py-1 rounded-full bg-surface border border-line text-xs font-semibold text-ink"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-6 mb-8">
              <h4 className="text-xl font-bold font-display text-ink flex items-center mb-4">
                <Zap className="w-5 h-5 text-corporate mr-2.5" />
                Key Capabilities &amp; Business Outcomes
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {details.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3.5 bg-surface/50 border border-line/70 rounded-xl p-4 shadow-soft hover:shadow-hover-lift transition-all duration-300"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-base text-ink font-semibold leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Conversion Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative overflow-hidden bg-surface/40 rounded-card border border-line/80 p-8 shadow-soft border-l-4 border-l-corporate hover:shadow-hover-lift hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-corporate/5 rounded-full blur-2xl pointer-events-none" />
              <span className="inline-flex p-3 rounded-xl bg-corporate/10 text-corporate mb-6 relative z-10">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h4 className="text-xl font-bold font-display text-ink mb-4 relative z-10">
                Discuss Your Requirements
              </h4>
              <p className="text-sm text-slate leading-relaxed mb-6 font-semibold relative z-10">
                Consult directly with our experienced analytics practitioners to review your current reporting models or automate recurring spreadsheets.
              </p>
              
              <div className="space-y-3 mb-8 relative z-10">
                {[
                  `${CURRENT_EXP_YEARS}+ years of practical reporting & analytics expertise`,
                  "Clear scope, predictable delivery timelines & zero lock-in",
                  "Maintainable handoffs your team can operate independently"
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
                Request a Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Related Corporate Solutions */}
        {otherServices.length > 0 ? (
          <div className="mt-20 pt-12 border-t border-line/80 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand">Related Solutions</span>
                <h3 className="font-display text-2xl font-bold text-ink mt-1">Explore Other Corporate Services</h3>
              </div>
              <Link
                href="/corporate"
                className="inline-flex items-center text-sm font-bold text-brand hover:underline"
              >
                View All Solutions <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherServices.map((rel: any, rIdx: number) => (
                <Link
                  key={rIdx}
                  href={`/corporate/${rel.slug}`}
                  className="group rounded-2xl border border-line bg-surface/50 p-6 hover:border-brand/40 hover:shadow-hover-lift transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-display font-bold text-lg text-ink group-hover:text-brand transition-colors mb-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate line-clamp-3 leading-relaxed mb-4">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-brand group-hover:underline mt-auto">
                    Learn More <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
