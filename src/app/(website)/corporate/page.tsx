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
              const Icon = getIcon(service.slug);
              return (
                <Reveal key={idx} delay={(idx % 3) * 90}>
                  <Link
                    href={`/corporate/${service.slug}`}
                    className="card-premium group relative flex h-full flex-col p-7 md:p-8 overflow-hidden"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative mb-6 flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 border border-brand/20 text-brand transition-all duration-300 group-hover:bg-brand/20">
                        <Icon className="h-5 w-5 icon-anim" />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Corporate Service</span>
                    </div>
                    <h3 className="relative text-[20px] md:text-[22px] font-medium text-ink mb-3 transition-colors duration-300 group-hover:text-brand">
                      {service.title}
                    </h3>
                    <p className="relative text-[14px] text-slate font-light leading-relaxed mb-6">
                      {service.shortDescription}
                    </p>
                    <div className="relative mt-auto inline-flex items-center gap-2 text-[14px] font-medium text-brand">
                      Read Service Details
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </Link>
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
