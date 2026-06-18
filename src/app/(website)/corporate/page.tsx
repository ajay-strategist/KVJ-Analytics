import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles,
  FileSpreadsheet,
  BarChart3,
  TableProperties,
  LayoutDashboard,
  Cpu,
  GraduationCap
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { client } from "@/sanity/lib/client";
import { solutionsPageQuery, servicesQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const FALLBACK_PAGE = {
  heading: "Corporate Solutions",
  strapline: "Smarter Reporting. Faster Decisions.",
  intro:
    "We help organizations automate reporting, improve visibility, optimize workflows, and make faster business decisions.",
};

const FALLBACK_SERVICES = [
  {
    title: "Report Automation",
    slug: "report-automation",
    shortDescription:
      "Automate MIS, financial, operational, and management reports with speed and accuracy.",
  },
  {
    title: "Data Visualization",
    slug: "data-visualization",
    shortDescription:
      "Convert complex data into meaningful visual insights and interactive reports.",
  },
  {
    title: "Spreadsheet Consulting",
    slug: "spreadsheet-consulting",
    shortDescription:
      "Advanced Excel systems, automation, validation, and optimization solutions.",
  },
  {
    title: "Dashboard Development",
    slug: "dashboard-development",
    shortDescription:
      "Real-time dashboards for KPI tracking, performance monitoring, and business intelligence.",
  },
  {
    title: "Process Automation",
    slug: "process-automation",
    shortDescription:
      "Reduce manual work through intelligent workflow and process automation.",
  },
  {
    title: "Corporate Training",
    slug: "corporate-training",
    shortDescription:
      "Hands-on training in Excel, Power BI, analytics, dashboards, and automation tools.",
  },
];

export default async function CorporateSolutionsPage() {
  const pageData = await client
    .fetch(solutionsPageQuery, { category: "corporate" })
    .catch(() => null);

  const servicesData = await client
    .fetch(servicesQuery, { category: "corporate" })
    .catch(() => null);

  const page = pageData || FALLBACK_PAGE;
  const services = servicesData && servicesData.length > 0 ? servicesData : FALLBACK_SERVICES;

  const getIcon = (slug: string) => {
    switch (slug) {
      case "report-automation": return FileSpreadsheet;
      case "data-visualization": return BarChart3;
      case "spreadsheet-consulting": return TableProperties;
      case "dashboard-development": return LayoutDashboard;
      case "process-automation": return Cpu;
      case "corporate-training": return GraduationCap;
      default: return Sparkles;
    }
  };

  return (
    <Section background="default" className="bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-corporate/5 rounded-full blur-3xl pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Eyebrow segment="corporate" className="mb-4">
            For Businesses & Corporates
          </Eyebrow>
          <BoldStatement variant="h1" className="mb-6">
            {page.heading}
          </BoldStatement>
          <p className="text-xl md:text-2xl font-bold font-display signature-gradient-text mb-6">
            {page.strapline}
          </p>
          <p className="text-lg md:text-xl text-slate font-medium leading-relaxed max-w-2xl mx-auto">
            {page.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service: any, idx: number) => {
            const IconComponent = getIcon(service.slug);
            return (
              <Card
                key={idx}
                hoverLift
                className="flex flex-col justify-between h-full border-t-4 border-t-corporate border-line/80 relative overflow-hidden group hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-corporate/80 uppercase tracking-widest">
                      corporate service
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-corporate/5 text-corporate flex items-center justify-center">
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-display text-ink mb-3 group-hover:text-corporate transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate font-medium leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                </div>
                <Link
                  href={`/corporate/${service.slug}`}
                  className="inline-flex items-center text-sm font-bold text-corporate hover:underline mt-auto group/link"
                >
                  <span className="mr-1.5">Read Service Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Closing Quick Form Link */}
        <div className="mt-24 text-center max-w-2xl mx-auto border border-line/80 rounded-card p-10 bg-surface/40 relative overflow-hidden shadow-soft hover:shadow-hover-lift hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-corporate/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
          <h4 className="text-xl font-bold font-display text-ink mb-4 relative z-10">
            Looking for a custom automation report or dashboards?
          </h4>
          <p className="text-base text-slate mb-8 max-w-lg mx-auto relative z-10 font-medium">
            We provide full-spectrum consultation, audit, development, and training integration tailored to your company.
          </p>
          <Button href="/contact" className="relative z-10 px-8 py-3.5 bg-cta hover:bg-cta-600 text-white border-none shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-bold">
            Schedule a Free Discovery Session
          </Button>
        </div>
      </Container>
    </Section>
  );
}
