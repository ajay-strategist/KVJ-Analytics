import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_EDUCATION } from "@/lib/constants";
import EducationHeroGraphic from "@/components/EducationHeroGraphic";

export const revalidate = 3600;

export default async function EducationalSolutionsPage() {
  const pageData = await getPageContent("education");
  const page = mergePageContent(pageData, FALLBACK_EDUCATION);
  const services = page.services && page.services.length > 0 ? page.services : FALLBACK_EDUCATION.services;

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

      {/* ───── HERO (futuristic obsidian dark) ───── */}
      <section className="relative overflow-hidden bg-[#050505]">
        {/* Abstract network of glowing connection lines */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="eduBG" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0072FF" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#050505" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#eduBG)" />
            
            <g className="origin-center animate-[spin_90s_linear_infinite]" style={{ transformOrigin: "50% 50%" }}>
              <line x1="15%" y1="20%" x2="35%" y2="40%" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="35%" y1="40%" x2="55%" y2="15%" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1" />
              <line x1="55%" y1="15%" x2="75%" y2="35%" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="75%" y1="35%" x2="92%" y2="20%" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.2" />
              <line x1="35%" y1="40%" x2="65%" y2="65%" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />
              <line x1="65%" y1="65%" x2="85%" y2="50%" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1" />
              
              <circle cx="15%" cy="20%" r="3" fill="#00F0FF" className="animate-pulse" />
              <circle cx="35%" cy="40%" r="4" fill="#0072FF" />
              <circle cx="55%" cy="15%" r="3.5" fill="#00F0FF" />
              <circle cx="75%" cy="35%" r="4" fill="#0072FF" className="animate-pulse" />
              <circle cx="92%" cy="20%" r="3" fill="#00F0FF" />
              <circle cx="65%" cy="65%" r="5" fill="#0072FF" />
              <circle cx="85%" cy="50%" r="3.5" fill="#00F0FF" />
            </g>
          </svg>
        </div>

        {/* 3D holographic cap animation behind text */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none overflow-hidden">
          <div className="relative w-full max-w-[600px]">
            <EducationHeroGraphic />
          </div>
        </div>

        <Container className="relative z-10 py-24 md:py-32 text-center">
          <Reveal>
            <p className="text-[13px] uppercase tracking-[0.2em] text-[#0072FF] mb-5 font-bold">
              For Colleges &amp; Universities
            </p>
          </Reveal>
          <RevealText
            as="h1"
            text={page.heading}
            className="font-display font-medium text-[40px] sm:text-[54px] lg:text-[64px] leading-[1.06] tracking-[-0.025em] mb-6 max-w-[18ch] mx-auto text-white"
          />
          <Reveal delay={150}>
            <p className="text-xl md:text-2xl signature-gradient-text font-medium mb-6">{page.strapline}</p>
            <p className="text-lg text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">{page.intro}</p>
          </Reveal>
        </Container>
      </section>

      {/* ───── SERVICES GRID ───── */}
      <Section className="relative bg-[#050505] overflow-hidden z-10 border-t border-white/5">
        {/* Subtle background nodes visual */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 max-w-5xl mx-auto">
            {services.map((service: any, idx: number) => {
              // Determine animated icon based on slug
              let iconName = "edu-training";
              if (service.slug === "training-programs") {
                iconName = "edu-training";
              } else if (service.slug === "certification-programs") {
                iconName = "edu-cert";
              } else if (service.slug === "curriculum-development") {
                iconName = "edu-curriculum";
              } else if (service.slug === "academic-analytics-solutions") {
                iconName = "edu-analytics";
              }

              return (
                <Reveal key={idx} delay={(idx % 2) * 90}>
                  <ServiceCard
                    title={service.title}
                    description={service.shortDescription}
                    href={`/education/${service.slug}`}
                    iconName={iconName}
                    tag="Academic Solution"
                    accentColor="blue"
                  />
                </Reveal>
              );
            })}
          </div>

          {/* Closing CTA card - Expansive Glassmorphic Banner */}
          <Reveal className="mt-20 md:mt-24 max-w-3xl mx-auto">
            <div className="relative overflow-hidden p-10 md:p-12 text-center rounded-[32px] bg-black/60 border border-white/5 backdrop-blur-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Breathing background glow (cyan to deep blue) */}
              <div 
                className="absolute -inset-10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-[40px] blur-[80px] pointer-events-none"
                style={{
                  animation: "breathingGlow 8s ease-in-out infinite alternate",
                }}
              />
              
              <h4 className="relative z-10 text-2xl md:text-3xl font-medium text-white mb-4">
                Looking to run a certificate program or skill lab?
              </h4>
              <p className="relative z-10 text-base text-slate-400 font-light mb-8 max-w-lg mx-auto leading-relaxed">
                We partner with academic institutions to provide practical workshops, syllabus updates, and assessment platforms.
              </p>
              
              <div className="relative z-10 inline-block overflow-visible mt-2">
                {/* Ripple rings */}
                <span className="absolute -inset-2 rounded-full border border-cyan-500/40 animate-[ripple_3s_ease-out_infinite] pointer-events-none z-0" />
                <span className="absolute -inset-4 rounded-full border border-blue-500/25 animate-[ripple_3s_ease-out_infinite_1.5s] pointer-events-none z-0" />
                
                <Button 
                  href="/contact" 
                  variant="accent" 
                  className="relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)]"
                >
                  Request an Institutional Partnership Proposal
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
