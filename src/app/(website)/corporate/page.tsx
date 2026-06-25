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
  GraduationCap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CORPORATE } from "@/lib/constants";

export const revalidate = 3600;

export default async function CorporateSolutionsPage() {
  const pageData = await getPageContent("corporate");
  const page = mergePageContent(pageData, FALLBACK_CORPORATE);
  const services = page.services && page.services.length > 0 ? page.services : FALLBACK_CORPORATE.services;

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
    <>
      {/* ───── HERO (premium light) ───── */}
      <section className="hero-dark hero-grid hero-bleed relative overflow-hidden bg-gradient-hero">
        <div className="blob animate-blob absolute -top-24 right-[6%] w-[34rem] h-[34rem] bg-brand/10 pointer-events-none" />
        <div className="blob animate-blob absolute bottom-[-10rem] left-[-6rem] w-[24rem] h-[24rem] bg-brand/8 pointer-events-none" style={{ animationDelay: "3s" }} />
        <Container className="relative z-10 py-24 md:py-32 text-center">
          <Reveal>
            <p className="text-[13px] uppercase tracking-[0.2em] text-brand mb-5 font-bold">For Businesses &amp; Corporates</p>
          </Reveal>
          <RevealText
            as="h1"
            text={page.heading}
            className="font-display font-medium text-[40px] sm:text-[54px] lg:text-[64px] leading-[1.06] tracking-[-0.025em] mb-6 max-w-[18ch] mx-auto text-ink"
          />
          <Reveal delay={150}>
            <p className="text-xl md:text-2xl signature-gradient-text font-medium mb-6">{page.strapline}</p>
            <p className="text-lg text-slate font-light leading-relaxed max-w-2xl mx-auto">{page.intro}</p>
          </Reveal>
        </Container>
      </section>

      {/* ───── SERVICES GRID ───── */}
      <Section background="default" className="relative bg-aurora overflow-hidden">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 max-w-6xl mx-auto">
            {services.map((service: any, idx: number) => {
              // Determine animated icon based on slug
              let iconName: "visualization" | "automation" | "education" = "visualization";
              if (
                service.slug === "report-automation" ||
                service.slug === "process-automation" ||
                service.slug === "spreadsheet-consulting"
              ) {
                iconName = "automation";
              } else if (service.slug === "corporate-training") {
                iconName = "education";
              }

              return (
                <Reveal key={idx} delay={(idx % 3) * 90}>
                  <ServiceCard
                    title={service.title}
                    description={service.shortDescription}
                    href={`/corporate/${service.slug}`}
                    iconName={iconName}
                    tag="Corporate Solution"
                    accentColor={idx % 2 === 0 ? "cyan" : "blue"}
                  />
                </Reveal>
              );
            })}
          </div>

          {/* Closing CTA card */}
          <Reveal className="mt-20 md:mt-24 max-w-3xl mx-auto">
            <div className="card-premium relative overflow-hidden p-10 md:p-12 text-center">
              <div className="bg-radial-glow pointer-events-none absolute -top-16 left-1/2 h-56 w-72 -translate-x-1/2" />
              <h4 className="relative text-2xl md:text-3xl font-medium text-ink mb-4">
                Looking for custom automation, reports or dashboards?
              </h4>
              <p className="relative text-base text-slate font-light mb-8 max-w-lg mx-auto">
                We provide full-spectrum consultation, audit, development, and training integration tailored to your company.
              </p>
              <Button href="/contact" variant="accent" className="relative">
                Schedule a Free Discovery Session
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
