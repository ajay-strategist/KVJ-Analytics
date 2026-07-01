"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { Cpu, GraduationCap, LineChart, Activity } from "lucide-react";
import { AboutHeroVisual } from "@/components/ui/AboutHeroVisual";
import { FALLBACK_ABOUT } from "@/lib/constants";

interface AboutClientProps {
  pageData: {
    title: string;
    intro: string;
    specializations?: string[];
    impact?: string[];
    reachLine?: string;
    vision?: {
      heading: string;
      body: string;
    };
  };
}

// Paragraph viewport tracking revealer for Hero Section
const ScrollRevealParagraph = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const elementCenter = rect.top + rect.height / 2;
      const viewCenter = viewportHeight * 0.45;
      
      const distance = Math.abs(elementCenter - viewCenter);
      const threshold = viewportHeight * 0.22;
      
      if (distance < threshold) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    const timer = setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out py-6 border-l-4 pl-6 cursor-default"
      style={{
        borderColor: isActive ? "#00F0FF" : "rgba(255, 255, 255, 0.05)",
        opacity: isActive ? 1 : 0.35,
        transform: isActive ? "translateX(10px) scale(1.01)" : "translateX(0) scale(1)",
      }}
    >
      <div 
        className="font-display font-medium text-lg sm:text-xl md:text-2xl transition-all duration-500 text-zinc-100"
        style={{
          textShadow: isActive ? "0 0 15px rgba(0, 240, 255, 0.2)" : "none"
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Vision: Stylized glowing compass with swirling data points around the Gold north needle
function VisionCompass() {
  return (
    <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(0, 240, 255, 0.18)" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0, 114, 255, 0.12)" strokeWidth="1" strokeDasharray="3, 5" />
        
        {/* Tick marks */}
        <line x1="50" y1="10" x2="50" y2="15" stroke="#00F0FF" strokeWidth="2" />
        <line x1="50" y1="85" x2="50" y2="90" stroke="rgba(0, 240, 255, 0.5)" strokeWidth="1.5" />
        <line x1="10" y1="50" x2="15" y2="50" stroke="rgba(0, 240, 255, 0.5)" strokeWidth="1.5" />
        <line x1="85" y1="50" x2="90" y2="50" stroke="rgba(0, 240, 255, 0.5)" strokeWidth="1.5" />
        
        {/* Swirling data points around the north needle */}
        <g className="animate-[spin_7s_linear_infinite]" style={{ transformOrigin: "50px 50px" }}>
          <circle cx="50" cy="22" r="3" fill="#D4AF37" className="animate-pulse" /> {/* Gold */}
          <circle cx="68" cy="32" r="2" fill="#00F0FF" />
          <circle cx="32" cy="32" r="1.5" fill="#0072FF" />
        </g>

        {/* Compass needle */}
        <g className="animate-[float-slow_4s_ease-in-out_infinite]" style={{ transformOrigin: "50px 50px" }}>
          <polygon points="50,15 55,50 45,50" fill="#D4AF37" filter="drop-shadow(0 0 4px rgba(212, 175, 55, 0.6))" /> {/* Gold North */}
          <polygon points="50,85 55,50 45,50" fill="#0072FF" /> {/* Blue South */}
          <circle cx="50" cy="50" r="4.5" fill="#050505" stroke="#FFFFFF" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

function getSpecializationLabel(spec: any): string {
  if (!spec) return "";
  if (typeof spec === "string") return spec;
  if (typeof spec === "object") {
    return spec.label || spec.name || spec.value || "";
  }
  return String(spec);
}

export function AboutClientContent({ pageData }: AboutClientProps) {
  const expYears = new Date().getFullYear() - 2010;
  const expStat = { num: expYears, suffix: "+", label: "Years of Experience" };

  // Parse experience highlights (the new impact points)
  const parsedStats = (pageData.impact || []).map((imp) => {
    const m = imp.match(/^([\d,]+)(\+)?\s*(.*)$/);
    if (m) {
      const num = parseInt(m[1].replace(/,/g, ""), 10);
      const suffix = m[2] ? "+" : "";
      const label = m[3];
      return { num, suffix, label, isStat: true };
    }
    return { num: null, suffix: "", label: imp, isStat: false };
  });

  // Resolve specializations with strict fallback to ensure all 7 items are displayed correctly
  const rawSpecializations = pageData.specializations || [];
  const specializations = rawSpecializations.length > 0 && rawSpecializations.some(s => {
    const lbl = getSpecializationLabel(s);
    return lbl && lbl.trim() !== "";
  })
    ? rawSpecializations
    : FALLBACK_ABOUT.specializations;

  return (
    <div className="w-full bg-[#050505] text-zinc-200 relative min-h-screen">
      {/* 1. HERO SECTION — Asymmetric 60/40 Split Screen */}
      <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        {/* Glowing backdrop spotlights */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/8 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8s]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-corporate/8 rounded-full blur-[160px] pointer-events-none animate-pulse duration-[10s]" />

        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (60% width): Plain label, heading, intro block, single pill */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00F0FF] px-3.5 py-1.5 bg-brand/10 rounded-full w-fit border border-brand/20">
                About
              </span>
              
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-white">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-corporate to-brand animate-[signature-flow_6s_linear_infinite] bg-[size:200%_auto]">KVJ Analytics</span>
              </h1>

              {/* Accent-bar intro block */}
              <div className="max-w-xl">
                <ScrollRevealParagraph>
                  {pageData.intro}
                </ScrollRevealParagraph>
              </div>

              {/* Single experience pill */}
              <Reveal delay={200}>
                <div className="rounded-full border border-brand/35 bg-[#0A0A0C]/75 backdrop-blur-xl px-7 py-3.5 shadow-[0_8px_32px_rgba(0,240,255,0.14)] hover:border-brand transition-all duration-300 flex items-center gap-4 w-fit group">
                  <div className="text-3xl md:text-4xl font-extrabold font-display leading-none text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate">
                    <CountUp value={expStat.num} suffix={expStat.suffix} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors">
                    {expStat.label}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column (40% width): Vertically centered animated globe constellation */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <AboutHeroVisual />
            </div>

          </div>
        </Container>
      </section>

      {/* 2. WE SPECIALIZE IN SECTION — Full-width Band */}
      <section className="py-20 relative bg-[#08080A] border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,240,255,0.03),transparent)] pointer-events-none" />
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight">
              We Specialize In
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {specializations.map((spec, idx) => {
              const label = getSpecializationLabel(spec) || FALLBACK_ABOUT.specializations[idx] || "";
              return (
                <Reveal key={idx} delay={idx * 50} variant="up">
                  <div className="bg-[#0A0A0C]/65 border border-white/5 hover:border-brand/40 px-6 py-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,240,255,0.04)] transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
                    <span className="text-zinc-100 text-[16px] md:text-[17px] font-medium tracking-wide leading-snug">{label}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. OUR IMPACT SECTION — Band */}
      <section className="py-20 relative bg-[#050505] overflow-hidden border-b border-white/5">
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight mb-6">
              Our Impact
            </h2>
            <p className="text-zinc-300 font-light text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              {pageData.reachLine}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
            {parsedStats.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 80} variant="scale" className="h-full">
                <div className="bg-[#0A0A0C]/55 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between h-full hover:border-brand/40 transition-all duration-300 relative group overflow-hidden shadow-soft">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {stat.isStat ? (
                    <div className="flex flex-col h-full justify-between">
                      <div className="text-3xl md:text-4xl font-extrabold font-display leading-none text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate mb-6">
                        <CountUp value={stat.num!} suffix={stat.suffix} />
                      </div>
                      <p className="text-sm font-semibold text-zinc-200 leading-normal mt-auto">
                        {stat.label}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between h-full">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-6">
                        {idx === 2 ? (
                          <GraduationCap className="w-5 h-5 text-brand" />
                        ) : (
                          <Activity className="w-5 h-5 text-brand" />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-zinc-200 leading-normal mt-auto">
                        {stat.label}
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. OUR VISION SECTION — Centered Statement Band */}
      <section className="py-24 relative bg-[#08080A] border-b border-white/5 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

        <Container className="relative z-10">
          <Reveal variant="scale">
            <div className="max-w-4xl mx-auto bg-[#0A0A0C]/75 border border-[#00F0FF]/20 rounded-[32px] p-8 md:p-12 backdrop-blur-xl hover:border-[#00F0FF]/40 transition-all duration-300 relative overflow-hidden group shadow-[0_12px_40px_rgba(0,240,255,0.05)] text-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
              
              <div className="flex flex-col items-center justify-center relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand">
                  <VisionCompass />
                </div>
                
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00F0FF]">
                  Our Vision
                </span>
                
                <p className="text-xl md:text-2xl font-light text-zinc-100 leading-relaxed max-w-2xl mx-auto">
                  {pageData.vision?.body || "To build smarter organizations and industry-ready professionals through analytics, automation, and practical learning."}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
