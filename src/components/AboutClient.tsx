"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { 
  Compass, Target, Workflow, MapPin, Mail, Phone, MessageSquare, 
  ChevronRight, Sparkles, Layers, BookOpen, GraduationCap, ArrowRight, Activity
} from "lucide-react";

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

// Paragraph viewport tracking revealer
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
      className="transition-all duration-700 ease-out py-6 border-l-2 pl-6 cursor-default"
      style={{
        borderColor: isActive ? "#00F0FF" : "rgba(255, 255, 255, 0.05)",
        opacity: isActive ? 1 : 0.25,
        transform: isActive ? "translateX(10px) scale(1.02)" : "translateX(0) scale(1)",
      }}
    >
      <div 
        className="font-display font-medium text-xl sm:text-2xl md:text-3xl transition-all duration-500"
        style={{
          color: isActive ? "#FFFFFF" : "#9CA3AF",
          textShadow: isActive ? "0 0 15px rgba(0, 240, 255, 0.45)" : "none"
        }}
      >
        {children}
      </div>
    </div>
  );
};

// 3D Holographic Brain Component
function HolographicBrain() {
  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center animate-[float-slow_6s_ease-in-out_infinite]">
      {/* Brain projection beam backlights */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 to-corporate/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10px] w-[80%] h-8 bg-brand/20 rounded-full blur-[8px] transform scale-y-[0.3] pointer-events-none" />

      {/* SVG Brain Circuits */}
      <svg viewBox="0 0 400 400" className="w-full h-full relative z-10 overflow-visible">
        <defs>
          <filter id="brainGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer hud circle */}
        <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="1" strokeDasharray="5, 8" />
        <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(0, 114, 255, 0.05)" strokeWidth="1.5" strokeDasharray="30, 20" className="animate-[spin_30s_linear_infinite]" />

        {/* Brain Hemispheres - Left & Right circuit lines */}
        <g filter="url(#brainGlow)" strokeWidth="2.2" strokeLinecap="round" fill="none">
          {/* Left Hemisphere (Neon Cyan) */}
          <g stroke="#00F0FF">
            {/* Frontal Lobe */}
            <path d="M 200 90 C 130 90, 100 130, 100 180 C 100 200, 110 220, 120 230" />
            <path d="M 120 120 Q 150 140, 180 130" strokeDasharray="5, 3" />
            <path d="M 100 180 Q 140 180, 170 170" />
            {/* Occipital / Temporal */}
            <path d="M 120 230 C 120 270, 160 300, 200 300" />
            <path d="M 150 250 Q 170 220, 195 210" />
            <path d="M 120 200 Q 150 210, 170 250" strokeWidth="1.5" />
          </g>

          {/* Right Hemisphere (Electric Blue) */}
          <g stroke="#0072FF">
            {/* Frontal Lobe */}
            <path d="M 200 90 C 270 90, 300 130, 300 180 C 300 200, 290 220, 280 230" />
            <path d="M 280 120 Q 250 140, 220 130" strokeDasharray="5, 3" />
            <path d="M 300 180 Q 260 180, 230 170" />
            {/* Occipital / Temporal */}
            <path d="M 280 230 C 280 270, 240 300, 200 300" />
            <path d="M 250 250 Q 230 220, 205 210" />
            <path d="M 280 200 Q 250 210, 230 250" strokeWidth="1.5" />
          </g>
        </g>

        {/* Brain Synapse Nodes (Pulsing circles) */}
        <g>
          {/* Central spine */}
          <line x1="200" y1="90" x2="200" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          
          {/* Synapses Left */}
          <circle cx="100" cy="180" r="5" fill="#00F0FF" className="animate-pulse" />
          <circle cx="130" cy="110" r="4.5" fill="#00F0FF" />
          <circle cx="170" cy="170" r="4" fill="#FFFFFF" />
          <circle cx="150" cy="250" r="5" fill="#00F0FF" className="animate-ping duration-2000" />
          <circle cx="150" cy="250" r="4" fill="#00F0FF" />

          {/* Synapses Right */}
          <circle cx="300" cy="180" r="5" fill="#0072FF" className="animate-pulse" />
          <circle cx="270" cy="110" r="4.5" fill="#0072FF" />
          <circle cx="230" cy="170" r="4" fill="#FFFFFF" />
          <circle cx="250" cy="250" r="5" fill="#0072FF" className="animate-ping duration-1500" />
          <circle cx="250" cy="250" r="4" fill="#0072FF" />
        </g>

        {/* Interconnected data streams flowing in/out */}
        <path d="M 200 200 L 50 150 M 200 130 L 350 100 M 200 250 L 50 280 M 200 280 L 350 260" stroke="rgba(0,240,255,0.1)" strokeWidth="1" strokeDasharray="4, 4" />
        <circle cx="50" cy="150" r="3" fill="#00F0FF" className="animate-ping" />
        <circle cx="350" cy="100" r="3" fill="#0072FF" className="animate-ping" />
        <circle cx="50" cy="280" r="3" fill="#00F0FF" />
        <circle cx="350" cy="260" r="3" fill="#0072FF" />
      </svg>
    </div>
  );
}

// Context-sensitive animations for timeline
// 1. Founding: Startup garage made of circuit lines
function GarageCircuitAnimation() {
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-brand mx-auto">
      {/* Circuit board house outline */}
      <polygon points="50,15 85,45 85,85 15,85 15,45" fill="none" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="15" y1="45" x2="85" y2="45" stroke="#0072FF" strokeWidth="2" />
      {/* Garage door grid lines */}
      <rect x="30" y="55" width="40" height="30" fill="none" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" />
      <line x1="30" y1="65" x2="70" y2="65" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" />
      <line x1="30" y1="75" x2="70" y2="75" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" />
      
      {/* Glowing node connections */}
      <circle cx="50" cy="15" r="4" fill="#FFF" className="animate-pulse" />
      <circle cx="15" y1="85" r="3.5" fill="#00F0FF" />
      <circle cx="85" y1="85" r="3.5" fill="#0072FF" />
    </svg>
  );
}

// 2. AI Integration: Swirling Neural Network
function NeuralNetworkAnimation() {
  return (
    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Swirling orbits */}
        <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(0, 114, 255, 0.25)" strokeWidth="1.5" strokeDasharray="10, 5" className="animate-[spin_8s_linear_infinite]" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1.5" strokeDasharray="15, 8" className="animate-[spin_12s_linear_infinite_reverse]" />
        
        {/* Network connections */}
        <line x1="25" y1="25" x2="50" y2="50" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" />
        <line x1="75" y1="25" x2="50" y2="50" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" />
        <line x1="50" y1="78" x2="50" y2="50" stroke="rgba(0, 114, 255, 0.3)" strokeWidth="1.5" />
        
        {/* Core node */}
        <circle cx="50" cy="50" r="7" fill="#050505" stroke="#00F0FF" strokeWidth="2.2" />
        <circle cx="50" cy="50" r="3" fill="#00F0FF" className="animate-ping" />

        {/* Orbit nodes */}
        <circle cx="25" cy="25" r="4.5" fill="#0072FF" />
        <circle cx="75" cy="25" r="4.5" fill="#00F0FF" />
        <circle cx="50" cy="78" r="4.5" fill="#0072FF" />
      </svg>
    </div>
  );
}

// 3. Client Expansion: Global Nodes
function GlobalNodesAnimation() {
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#0072FF] mx-auto">
      {/* Globe grid */}
      <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(0, 114, 255, 0.25)" strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.5" />
      <ellipse cx="50" cy="50" rx="12" ry="35" fill="none" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.5" />
      
      {/* Blinking connection lines */}
      <line x1="25" y1="35" x2="75" y2="65" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1.5" strokeDasharray="4, 2" />
      <line x1="25" y1="65" x2="75" y2="35" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1.5" strokeDasharray="4, 2" />

      {/* Nodes */}
      <circle cx="25" cy="35" r="4" fill="#00F0FF" className="animate-pulse" />
      <circle cx="75" cy="65" r="4" fill="#00F0FF" />
      <circle cx="50" cy="15" r="3.5" fill="#0072FF" />
      <circle cx="50" cy="85" r="3.5" fill="#0072FF" />
    </svg>
  );
}

// 4. Training Launch: Graduation Cap node
function GraduationCapAnimation() {
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 text-brand mx-auto animate-[float-slow_4s_ease-in-out_infinite]">
      {/* Cap diamond */}
      <polygon points="50,22 82,35 50,48 18,35" fill="none" stroke="#00F0FF" strokeWidth="2.2" />
      {/* Cap skull */}
      <path d="M 32,41 L 32,60 Q 50,70 68,60 L 68,41" fill="none" stroke="#0072FF" strokeWidth="2" />
      {/* Tassel */}
      <path d="M 82,35 L 82,52 Q 78,56 76,56" fill="none" stroke="#00F0FF" strokeWidth="1.5" />
      <circle cx="76" cy="56" r="2" fill="#00F0FF" />
      
      {/* Data curves underneath */}
      <path d="M 20,78 Q 50,65 80,78" fill="none" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="2" strokeDasharray="4, 4" />
      <circle cx="50" cy="71" r="3" fill="#0072FF" />
    </svg>
  );
}

export function AboutClientContent({ pageData }: AboutClientProps) {
  // Parse experience highlights
  const parsedStats = (pageData.impact || []).map((imp) => {
    const m = imp.match(/^([\d,]+)(\+)?\s*(.*)$/);
    const num = m ? parseInt(m[1].replace(/,/g, ""), 10) : 16;
    const suffix = m && m[2] ? "+" : "";
    const label = m ? m[3] : imp;
    return { num, suffix, label };
  });

  // Filter out the experience stat specifically for the Hero section
  const expStat = parsedStats.find(s => s.label.toLowerCase().includes("experience")) || { num: 16, suffix: "+", label: "Years Experience" };
  const otherStats = parsedStats.filter(s => !s.label.toLowerCase().includes("experience"));

  return (
    <div className="w-full bg-[#050505] text-slate-150 relative min-h-screen">
      {/* 1. HERO SECTION — Asymmetric Split Screen */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        {/* Glowing backdrop spotlights */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/8 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8s]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-corporate/8 rounded-full blur-[160px] pointer-events-none animate-pulse duration-[10s]" />

        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Glowing Typography & Stats Pill */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-8 text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand px-3.5 py-1.5 bg-brand/10 rounded-full w-fit border border-brand/20">
                Strategic Intelligence
              </span>
              
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-white">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-corporate to-brand animate-[signature-flow_6s_linear_infinite] bg-[size:200%_auto]">KVJ Analytics</span>
              </h1>

              {/* Scrolling text reveal paragraphs */}
              <div className="space-y-2 max-w-xl">
                <ScrollRevealParagraph>
                  {pageData.intro}
                </ScrollRevealParagraph>
                <ScrollRevealParagraph>
                  We synthesize human auditing expertise with modular machine pipelines to ensure data translates seamlessly into high-yield decisions.
                </ScrollRevealParagraph>
              </div>

              {/* 16+ Years Experience Pill (cyan border + count-up) */}
              <Reveal delay={300}>
                <div className="rounded-full border border-brand/35 bg-[#0A0A0C]/75 backdrop-blur-xl px-7 py-3.5 shadow-[0_8px_32px_rgba(0,240,255,0.14)] hover:border-brand transition-all duration-300 flex items-center gap-4 w-fit group">
                  <div className="text-3xl md:text-4xl font-extrabold font-display leading-none text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate">
                    <CountUp value={expStat.num} suffix={expStat.suffix} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-350 group-hover:text-white transition-colors">
                    {expStat.label}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Holographic Brain Circuit Projection */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <HolographicBrain />
            </div>

          </div>
        </Container>
      </section>

      {/* 2. THE JOURNEY (Timeline Section) */}
      <section className="py-24 md:py-36 relative bg-[#08080A] border-b border-white/5 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#0072FF]/5 rounded-full blur-[130px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Our Legacy</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 mb-6">
              The Journey of Innovation
            </h2>
            <p className="text-slate-400 font-light text-base md:text-lg">
              Tracing our evolution from a core automation consultancy into a multi-disciplinary analytics powerhouse.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Center track (shifts left on mobile) */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand via-corporate to-brand -translate-x-1/2 opacity-25" />

            {/* Milestone 1: 2010 - Founding */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
              <div className="lg:col-span-5 lg:text-right flex flex-col justify-center order-2 lg:order-1 pl-10 lg:pl-0">
                <Reveal>
                  <span className="text-xs font-mono font-bold text-brand block mb-1">STAGE 01 // 2010</span>
                  <h3 className="text-2xl font-bold text-white mb-3">Startup Founding</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    KVJ Analytics was established in Kerala, focused initially on custom report compilation, Excel auditing, and automating manual enterprise workflows.
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-2 flex items-center justify-start lg:justify-center order-1 lg:order-2 z-10 pl-2 lg:pl-0">
                <div className="w-10 h-10 rounded-full bg-[#050505] border-2 border-brand flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse">
                  <span className="w-3.5 h-3.5 rounded-full bg-brand" />
                </div>
              </div>
              <div className="lg:col-span-5 flex items-center order-3 pl-10 lg:pl-8">
                <Reveal className="p-6 bg-[#0A0A0C]/50 border border-white/5 rounded-2xl w-full">
                  <GarageCircuitAnimation />
                </Reveal>
              </div>
            </div>

            {/* Milestone 2: 2015 - Expansion */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
              <div className="lg:col-span-5 flex items-center order-3 lg:order-1 pl-10 lg:pl-0 pr-0 lg:pr-8">
                <Reveal className="p-6 bg-[#0A0A0C]/50 border border-white/5 rounded-2xl w-full">
                  <GlobalNodesAnimation />
                </Reveal>
              </div>
              <div className="lg:col-span-2 flex items-center justify-start lg:justify-center order-1 lg:order-2 z-10 pl-2 lg:pl-0">
                <div className="w-10 h-10 rounded-full bg-[#050505] border-2 border-corporate flex items-center justify-center shadow-[0_0_15px_rgba(0,114,255,0.3)]">
                  <span className="w-3.5 h-3.5 rounded-full bg-corporate" />
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center order-2 pl-10 lg:pl-0">
                <Reveal>
                  <span className="text-xs font-mono font-bold text-corporate block mb-1">STAGE 02 // 2015</span>
                  <h3 className="text-2xl font-bold text-white mb-3">Enterprise Operations</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Expanded operations across South India, delivering custom dashboard infrastructures, database pipelines, and spreadsheet risk-auditing models.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* Milestone 3: 2020 - AI Integration */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
              <div className="lg:col-span-5 lg:text-right flex flex-col justify-center order-2 lg:order-1 pl-10 lg:pl-0">
                <Reveal>
                  <span className="text-xs font-mono font-bold text-brand block mb-1">STAGE 03 // 2020</span>
                  <h3 className="text-2xl font-bold text-white mb-3">Cognitive Analytics &amp; AI</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Integrated machine learning and cognitive algorithms, establishing automated pipeline workflows that convert raw datastreams into predictive business insights.
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-2 flex items-center justify-start lg:justify-center order-1 lg:order-2 z-10 pl-2 lg:pl-0">
                <div className="w-10 h-10 rounded-full bg-[#050505] border-2 border-brand flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse">
                  <span className="w-3.5 h-3.5 rounded-full bg-brand" />
                </div>
              </div>
              <div className="lg:col-span-5 flex items-center order-3 pl-10 lg:pl-8">
                <Reveal className="p-6 bg-[#0A0A0C]/50 border border-white/5 rounded-2xl w-full">
                  <NeuralNetworkAnimation />
                </Reveal>
              </div>
            </div>

            {/* Milestone 4: 2024 - Training Launch */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 flex items-center order-3 lg:order-1 pl-10 lg:pl-0 pr-0 lg:pr-8">
                <Reveal className="p-6 bg-[#0A0A0C]/50 border border-white/5 rounded-2xl w-full">
                  <GraduationCapAnimation />
                </Reveal>
              </div>
              <div className="lg:col-span-2 flex items-center justify-start lg:justify-center order-1 lg:order-2 z-10 pl-2 lg:pl-0">
                <div className="w-10 h-10 rounded-full bg-[#050505] border-2 border-corporate flex items-center justify-center shadow-[0_0_15px_rgba(0,114,255,0.3)]">
                  <span className="w-3.5 h-3.5 rounded-full bg-corporate" />
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center order-2 pl-10 lg:pl-0">
                <Reveal>
                  <span className="text-xs font-mono font-bold text-corporate block mb-1">STAGE 04 // 2024</span>
                  <h3 className="text-2xl font-bold text-white mb-3">Academic &amp; Training Divisions</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Launched structured training frameworks and partnerships with top universities, delivering certified outcomes in Power BI, Excel analytics, and Python automation.
                  </p>
                </Reveal>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 3. CORE PILLARS (Vision, Mission, Values) */}
      <section className="py-24 md:py-36 relative bg-[#050505] border-b border-white/5 overflow-hidden">
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Our Foundations</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 mb-6">
              Our Core Pillars
            </h2>
            <p className="text-slate-400 font-light text-base md:text-lg">
              Three fundamental vectors driving our engineering standards and training excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Vision Pillar */}
            <Reveal delay={0}>
              <div className="bg-[#0A0A0C]/75 border border-white/5 rounded-[32px] p-8 md:p-9 backdrop-blur-xl flex flex-col justify-between h-[360px] group hover:border-[#0072FF]/40 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand">
                    <Compass className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
                  </div>
                  <span className="text-xs font-mono text-slate-650 font-bold">PILLAR 01</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand transition-colors group-hover:text-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                    Vision
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    To establish a cognitive standard where complexity is automated and strategic strategies are backed by clean, verified data.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Mission Pillar */}
            <Reveal delay={100}>
              <div className="bg-[#0A0A0C]/75 border border-white/5 rounded-[32px] p-8 md:p-9 backdrop-blur-xl flex flex-col justify-between h-[360px] group hover:border-[#0072FF]/40 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand">
                    <Target className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-xs font-mono text-slate-650 font-bold">PILLAR 02</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand transition-colors group-hover:text-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                    Mission
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Deploying custom analytics and automation to eliminate manual errors and raise job-relevant corporate outcomes.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Values Pillar */}
            <Reveal delay={200}>
              <div className="bg-[#0A0A0C]/75 border border-white/5 rounded-[32px] p-8 md:p-9 backdrop-blur-xl flex flex-col justify-between h-[360px] group hover:border-[#0072FF]/40 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand">
                    <Workflow className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-slate-650 font-bold">PILLAR 03</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand transition-colors group-hover:text-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                    Values
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Sustained auditing integrity, engineering modular structures, and delivering clear value that converts complexity to clarity.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4. EXPERTISE & TEAM SECTION */}
      <section className="py-24 md:py-36 relative bg-[#08080A] overflow-hidden">
        {/* Parallax background floating particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <circle cx="150" cy="150" r="3" fill="#00F0FF" className="animate-pulse" />
            <circle cx="850" cy="200" r="2.5" fill="#0072FF" className="animate-pulse" />
            <circle cx="500" cy="800" r="3" fill="#00F0FF" className="animate-pulse" />
            <circle cx="200" cy="700" r="2" fill="#0072FF" />
            <circle cx="800" cy="750" r="3.5" fill="#00F0FF" />
          </svg>
        </div>

        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">The Experts</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 mb-6">
              Our Core Team &amp; Skillsets
            </h2>
            <p className="text-slate-400 font-light text-base md:text-lg">
              KVJ Analytics is led by seasoned database architects, financial auditors, and corporate skill educators.
            </p>
          </div>

          {/* Grid of Team Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Team Member 1 */}
            <Reveal delay={0}>
              <div className="bg-[#0A0A0C]/70 border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-[#0072FF]/40 transition-all duration-500 min-h-[340px]">
                {/* Circular profile placeholder with glowing neon halo */}
                <div className="relative w-28 h-28 rounded-full flex items-center justify-center p-1.5 bg-gradient-to-tr from-brand to-corporate mb-6 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-white text-3xl font-bold font-display">
                    JT
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand transition-colors">Ajay Thomas</h3>
                <span className="text-xs text-brand font-mono font-bold uppercase tracking-wider mb-4">Founder &amp; Principal Architect</span>
                
                <p className="text-xs text-slate-400 leading-relaxed font-light mb-6">
                  16+ years auditing data models, custom scripting process workflows, and guiding university curriculums.
                </p>

                {/* Skill Badges (Slide-up Overlay on Hover) */}
                <div className="absolute inset-x-0 bottom-0 bg-[#0A0A0C] border-t border-white/10 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-mono text-slate-400 uppercase mb-2">Expertise</span>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#0072FF]/10 border border-[#0072FF]/20 text-[10px] font-mono text-white">Power BI</span>
                      <span className="px-2.5 py-1 rounded bg-brand/10 border border-brand/20 text-[10px] font-mono text-white">Python</span>
                      <span className="px-2.5 py-1 rounded bg-brand/10 border border-brand/20 text-[10px] font-mono text-white">Excel</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Team Member 2 */}
            <Reveal delay={100}>
              <div className="bg-[#0A0A0C]/70 border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-[#0072FF]/40 transition-all duration-500 min-h-[340px]">
                <div className="relative w-28 h-28 rounded-full flex items-center justify-center p-1.5 bg-gradient-to-tr from-brand to-corporate mb-6 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-white text-3xl font-bold font-display">
                    KV
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand transition-colors">KV Jose</h3>
                <span className="text-xs text-brand font-mono font-bold uppercase tracking-wider mb-4">Director of Academic Programs</span>
                
                <p className="text-xs text-slate-400 leading-relaxed font-light mb-6">
                  Spearheading university collaborations, certified labs, and student placement analytics structures.
                </p>

                {/* Skill Badges (Slide-up Overlay on Hover) */}
                <div className="absolute inset-x-0 bottom-0 bg-[#0A0A0C] border-t border-white/10 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-mono text-slate-400 uppercase mb-2">Expertise</span>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#0072FF]/10 border border-[#0072FF]/20 text-[10px] font-mono text-white">Analytics</span>
                      <span className="px-2.5 py-1 rounded bg-brand/10 border border-brand/20 text-[10px] font-mono text-white">L&amp;D</span>
                      <span className="px-2.5 py-1 rounded bg-brand/10 border border-brand/20 text-[10px] font-mono text-white">Academic</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Team Member 3 */}
            <Reveal delay={200}>
              <div className="bg-[#0A0A0C]/70 border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-[#0072FF]/40 transition-all duration-500 min-h-[340px]">
                <div className="relative w-28 h-28 rounded-full flex items-center justify-center p-1.5 bg-gradient-to-tr from-brand to-corporate mb-6 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-white text-3xl font-bold font-display">
                    SA
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand transition-colors">Saji Augustine</h3>
                <span className="text-xs text-brand font-mono font-bold uppercase tracking-wider mb-4">Senior Automation Consultant</span>
                
                <p className="text-xs text-slate-400 leading-relaxed font-light mb-6">
                  Esterifying SQL databases, custom reporting scripts, and spreadsheet optimization engines.
                </p>

                {/* Skill Badges (Slide-up Overlay on Hover) */}
                <div className="absolute inset-x-0 bottom-0 bg-[#0A0A0C] border-t border-white/10 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-mono text-slate-400 uppercase mb-2">Expertise</span>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#0072FF]/10 border border-[#0072FF]/20 text-[10px] font-mono text-white">SQL</span>
                      <span className="px-2.5 py-1 rounded bg-brand/10 border border-brand/20 text-[10px] font-mono text-white">VBA</span>
                      <span className="px-2.5 py-1 rounded bg-brand/10 border border-brand/20 text-[10px] font-mono text-white">ETL</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
