import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading, Parallax } from "@/components/v3/ScrollFx";
import { SolutionsExplorer } from "@/components/v3/corporate/SolutionsExplorer";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CORPORATE } from "@/lib/constants";
import CorporateHeroGraphic from "@/components/CorporateHeroGraphic";

import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Corporate Solutions — Report Automation, Power BI & Data Analytics",
  description:
    "Automate reports, build Power BI dashboards, and optimize workflows with KVJ Analytics. Data visualization, process automation, spreadsheet consulting and corporate training for enterprise teams.",
  path: "/corporate",
  keywords: ["report automation", "Power BI dashboards", "data visualization", "process automation", "corporate training", "business intelligence consulting"],
});

export default async function CorporateSolutionsPage() {
  const pageData = await getPageContent("corporate");
  const page = mergePageContent(pageData, FALLBACK_CORPORATE);
  const services = page.services && page.services.length > 0 ? page.services : FALLBACK_CORPORATE.services;
  const cta = { ...FALLBACK_CORPORATE.cta, ...(page.cta || {}) };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes breathingGlow {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1.05); opacity: 0.95; }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}} />

      {/* ───── HERO (premium dark theme) ───── */}
      <section className="relative overflow-hidden hero-emerald text-white border-b border-line">
        {/* Subtle, slow-moving glowing data grid lines */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
            animation: "gridMove 30s linear infinite",
          }}
        />

        {/* WebGL-style 3D animated dashboard graphic behind the text */}
        <Parallax speed={0.18} className="absolute inset-0 z-0 flex items-center justify-center opacity-25 pointer-events-none overflow-hidden">
          <div className="relative w-full max-w-[600px]">
            <CorporateHeroGraphic />
          </div>
        </Parallax>

        <Container className="relative z-10 py-24 md:py-32 text-center">
          <Reveal>
            <p className="text-[13px] uppercase tracking-[0.2em] text-[#10B981] mb-5 font-bold animate-pulse">
              For Businesses &amp; Corporates
            </p>
          </Reveal>
          <SplitHeading
            as="h1"
            className="font-display font-medium text-[40px] sm:text-[54px] lg:text-[64px] leading-[1.06] tracking-[-0.025em] mb-6 max-w-[18ch] mx-auto text-white"
          >
            {page.heading}
          </SplitHeading>
          <Reveal delay={150}>
            <p className="text-xl md:text-2xl text-[#0D9488] font-medium mb-6">{page.strapline}</p>
            <p className="text-lg text-slate font-light leading-relaxed max-w-2xl mx-auto">{page.intro}</p>
          </Reveal>
        </Container>
      </section>

      {/* ───── SERVICES GRID ───── */}
      <Section className="relative bg-base overflow-hidden z-10 border-t border-line">
        {/* Subtle background grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(16, 185, 129, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16, 185, 129, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 90%)",
          }}
        />

        <Container className="relative z-10">
          <SolutionsExplorer
            services={services}
            basePath="corporate"
            accentColor="blue"
            tag="Corporate Solution"
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 max-w-6xl mx-auto"
            iconMap={{
              "report-automation": "corp-report",
              "data-visualization": "corp-vis",
              "spreadsheet-consulting": "corp-spreadsheet",
              "dashboard-development": "corp-dashboard",
              "app-development": "corp-app",
              "process-automation": "corp-process",
              "corporate-training": "corp-training",
            }}
            defaultIcon="corp-vis"
          />

          {/* Closing CTA card - Sleek Wide Glassmorphic Banner */}
          <Reveal className="mt-20 md:mt-24 max-w-3xl mx-auto">
            <div className="relative overflow-hidden p-10 md:p-12 text-center rounded-[32px] bg-[#0B2A22] border border-line backdrop-blur-[18px] shadow-soft">
              {/* Breathing background glow */}
              <div 
                className="absolute -inset-10 bg-gradient-to-r from-[#10B981]/5 via-[#0D9488]/5 to-transparent rounded-[40px] blur-[80px] pointer-events-none"
                style={{
                  animation: "breathingGlow 8s ease-in-out infinite alternate",
                }}
              />
              
              <h4 className="relative z-10 text-2xl md:text-3xl font-medium text-white mb-4">
                {cta.title}
              </h4>
              <p className="relative z-10 text-base text-emerald-50/90 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
                {cta.description}
              </p>

              <div className="relative z-10 inline-block overflow-visible mt-2">
                {/* Ripple rings */}
                <span className="absolute -inset-2 rounded-full border border-[#10B981]/20 animate-[ripple_3s_ease-out_infinite] pointer-events-none z-0" />
                <span className="absolute -inset-4 rounded-full border border-[#0D9488]/10 animate-[ripple_3s_ease-out_infinite_1.5s] pointer-events-none z-0" />

                <Button
                  href={cta.primaryHref || "/contact"}
                  variant="primary"
                  className="relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)]"
                >
                  {cta.primaryText}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
