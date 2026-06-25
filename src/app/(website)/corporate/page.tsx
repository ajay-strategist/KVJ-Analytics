import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CORPORATE } from "@/lib/constants";
import CorporateHeroGraphic from "@/components/CorporateHeroGraphic";

export const revalidate = 3600;

export default async function CorporateSolutionsPage() {
  const pageData = await getPageContent("corporate");
  const page = mergePageContent(pageData, FALLBACK_CORPORATE);
  const services = page.services && page.services.length > 0 ? page.services : FALLBACK_CORPORATE.services;

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
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />

      {/* ───── HERO (futuristic obsidian dark) ───── */}
      <section className="relative overflow-hidden bg-[#050505] py-24 md:py-32">
        {/* Subtle, slow-moving glowing data grid lines */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
            animation: "gridMove 30s linear infinite",
          }}
        />

        {/* WebGL-style 3D animated dashboard graphic behind the text */}
        <div className="absolute inset-0 z-0 flex items-center justify-center lg:justify-end opacity-40 lg:opacity-85 pointer-events-none overflow-hidden">
          <div className="relative w-full max-w-[550px] lg:-mr-12">
            <CorporateHeroGraphic />
          </div>
        </div>

        <Container className="relative z-10 text-left lg:text-left max-w-6xl">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[13px] uppercase tracking-[0.25em] text-[#00F0FF] mb-5 font-bold">
                For Businesses &amp; Corporates
              </p>
            </Reveal>
            <RevealText
              as="h1"
              text={page.heading}
              className="font-display font-medium text-[42px] sm:text-[56px] lg:text-[66px] leading-[1.05] tracking-[-0.035em] mb-6 text-white"
            />
            <Reveal delay={150}>
              <p className="text-xl md:text-2xl font-medium mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {page.strapline}
              </p>
              <p className="text-lg text-slate-400 font-light leading-relaxed max-w-xl">
                {page.intro}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ───── SERVICES GRID ───── */}
      <Section className="relative bg-[#050505] overflow-hidden z-10 border-t border-white/5">
        {/* Subtle background grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 114, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 114, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 90%)",
          }}
        />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 max-w-6xl mx-auto">
            {services.map((service: any, idx: number) => {
              // Determine animated icon based on slug
              let iconName = "corp-vis";
              if (service.slug === "report-automation") {
                iconName = "corp-report";
              } else if (service.slug === "data-visualization") {
                iconName = "corp-vis";
              } else if (service.slug === "spreadsheet-consulting") {
                iconName = "corp-spreadsheet";
              } else if (service.slug === "dashboard-development") {
                iconName = "corp-dashboard";
              } else if (service.slug === "process-automation") {
                iconName = "corp-process";
              } else if (service.slug === "corporate-training") {
                iconName = "corp-training";
              }

              return (
                <Reveal key={idx} delay={(idx % 3) * 90}>
                  <ServiceCard
                    title={service.title}
                    description={service.shortDescription}
                    href={`/corporate/${service.slug}`}
                    iconName={iconName}
                    tag="Corporate Solution"
                    accentColor="cyan"
                  />
                </Reveal>
              );
            })}
          </div>

          {/* Closing CTA card - Sleek Wide Glassmorphic Banner */}
          <Reveal className="mt-20 md:mt-24 max-w-4xl mx-auto">
            <div className="relative overflow-hidden p-10 md:p-14 text-center rounded-[32px] bg-black/60 border border-white/5 backdrop-blur-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Breathing background glow */}
              <div 
                className="absolute -inset-10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-[40px] blur-[80px] pointer-events-none"
                style={{
                  animation: "breathingGlow 8s ease-in-out infinite alternate",
                }}
              />
              
              <h4 className="relative z-10 text-2xl md:text-3xl font-medium text-white mb-4">
                Looking for custom automation, reports or dashboards?
              </h4>
              <p className="relative z-10 text-base text-slate-400 font-light mb-10 max-w-lg mx-auto leading-relaxed">
                We provide full-spectrum consultation, audit, development, and training integration tailored to your company.
              </p>
              
              <div className="relative z-10 inline-block overflow-visible">
                <Link 
                  href="/contact" 
                  className="relative inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] group overflow-visible"
                >
                  {/* Ripple rings */}
                  <span className="absolute -inset-2 rounded-full border border-cyan-500/40 animate-[ripple_3s_ease-out_infinite] pointer-events-none" />
                  <span className="absolute -inset-4 rounded-full border border-blue-500/25 animate-[ripple_3s_ease-out_infinite_1.5s] pointer-events-none" />
                  
                  {/* Sweeping shimmer effect */}
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  <span className="relative z-10">Schedule a Free Discovery Session</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
