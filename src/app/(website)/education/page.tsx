import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading, Parallax } from "@/components/v3/ScrollFx";
import { SolutionsExplorer } from "@/components/v3/corporate/SolutionsExplorer";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_EDUCATION } from "@/lib/constants";
import EducationHeroGraphic from "@/components/EducationHeroGraphic";

import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Educational Solutions — Training, Certification & Academic Analytics",
  description:
    "Industry-ready training and certification, curriculum development, and academic analytics platforms for colleges and universities. Bridge the college-to-corporate skill gap with KVJ Analytics.",
  path: "/education",
  keywords: ["college training", "certification programs", "curriculum development", "academic analytics", "campus training", "Power BI training for students"],
});

export default async function EducationalSolutionsPage() {
  const pageData = await getPageContent("education");
  const page = mergePageContent(pageData, FALLBACK_EDUCATION);
  const services = page.services && page.services.length > 0 ? page.services : FALLBACK_EDUCATION.services;
  const cta = { ...FALLBACK_EDUCATION.cta, ...(page.cta || {}) };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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
        {/* Abstract network of glowing connection lines */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="eduBG" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.06" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#eduBG)" />
            
            <g className="origin-center animate-[spin_90s_linear_infinite]" style={{ transformOrigin: "50% 50%" }}>
              <line x1="15%" y1="20%" x2="35%" y2="40%" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="35%" y1="40%" x2="55%" y2="15%" stroke="rgba(13, 148, 136, 0.15)" strokeWidth="1" />
              <line x1="55%" y1="15%" x2="75%" y2="35%" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="75%" y1="35%" x2="92%" y2="20%" stroke="rgba(13, 148, 136, 0.15)" strokeWidth="1.2" />
              <line x1="35%" y1="40%" x2="65%" y2="65%" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
              <line x1="65%" y1="65%" x2="85%" y2="50%" stroke="rgba(13, 148, 136, 0.15)" strokeWidth="1" />
              
              <circle cx="15%" cy="20%" r="3" fill="#10B981" className="animate-pulse" />
              <circle cx="35%" cy="40%" r="4" fill="#0D9488" />
              <circle cx="55%" cy="15%" r="3.5" fill="#10B981" />
              <circle cx="75%" cy="35%" r="4" fill="#0D9488" className="animate-pulse" />
              <circle cx="92%" cy="20%" r="3" fill="#10B981" />
              <circle cx="65%" cy="65%" r="5" fill="#0D9488" />
              <circle cx="85%" cy="50%" r="3.5" fill="#10B981" />
            </g>
          </svg>
        </div>

        {/* 3D holographic cap animation behind text */}
        <Parallax speed={0.18} className="absolute inset-0 z-0 flex items-center justify-center opacity-25 pointer-events-none overflow-hidden">
          <div className="relative w-full max-w-[600px]">
            <EducationHeroGraphic />
          </div>
        </Parallax>

        <Container className="relative z-10 py-24 md:py-32 text-center">
          <Reveal>
            <p className="text-[13px] uppercase tracking-[0.2em] text-[#10B981] mb-5 font-bold animate-pulse">
              For Colleges &amp; Universities
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
        {/* Subtle background nodes visual */}
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
            basePath="education"
            accentColor="cyan"
            tag="Academic Solution"
            gridClassName="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 max-w-5xl mx-auto"
            iconMap={{
              "training-programs": "edu-training",
              "certification-programs": "edu-cert",
              "curriculum-development": "edu-curriculum",
              "academic-analytics-solutions": "edu-analytics",
            }}
            defaultIcon="edu-training"
          />

          {/* Closing CTA card - Expansive Glassmorphic Banner */}
          <Reveal className="mt-20 md:mt-24 max-w-3xl mx-auto">
            <div className="relative overflow-hidden p-10 md:p-12 text-center rounded-[32px] bg-[#0B2A22] border border-line backdrop-blur-[18px] shadow-soft">
              {/* Breathing background glow (cyan to deep blue) */}
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
                <span className="absolute -inset-2 rounded-full border border-[#10B981]/25 animate-[ripple_3s_ease-out_infinite] pointer-events-none z-0" />
                <span className="absolute -inset-4 rounded-full border border-[#0D9488]/15 animate-[ripple_3s_ease-out_infinite_1.5s] pointer-events-none z-0" />

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
