"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { LineChart, Cpu, GraduationCap, Database, Activity, ArrowRight, Zap, Play } from "lucide-react";

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

const ScrollRevealParagraph = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how close the center of the paragraph is to the center of the viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewCenter = viewportHeight * 0.45; // slightly above absolute center
      
      const distance = Math.abs(elementCenter - viewCenter);
      const threshold = viewportHeight * 0.22; // middle zone height
      
      if (distance < threshold) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // run once initially and with a slight delay to ensure layout is complete
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
      className="transition-all duration-700 ease-out py-6 md:py-8 border-l-2 pl-6 cursor-default group"
      style={{
        borderColor: isActive ? "rgba(0, 240, 255, 0.8)" : "rgba(255, 255, 255, 0.05)",
        opacity: isActive ? 1 : 0.25,
        transform: isActive ? "translateX(10px) scale(1.02)" : "translateX(0) scale(1.0)",
      }}
    >
      <div 
        className="font-display font-medium text-2xl md:text-3xl lg:text-4xl transition-all duration-500"
        style={{
          color: isActive ? "#FFFFFF" : "#9CA3AF",
          textShadow: isActive ? "0 0 20px rgba(0, 240, 255, 0.5)" : "none"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export function AboutClientContent({ pageData }: AboutClientProps) {
  const specializations = pageData.specializations || [];
  const impact = pageData.impact || [];
  const [activeTab, setActiveTab] = useState(0);

  // Parse statistics
  const parsedStats = impact.map((imp) => {
    const m = imp.match(/^([\d,]+)(\+)?\s*(.*)$/);
    const num = m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
    const suffix = m && m[2] ? "+" : "";
    const label = m ? m[3] : imp;
    return { num, suffix, label };
  });

  return (
    <div className="w-full bg-[#0A0A0E] text-slate-100 relative min-h-screen">
      {/* 1. HERO SECTION — Asymmetric Split Screen */}
      <section className="relative min-h-screen flex items-center pt-24 md:pt-32 pb-16 overflow-hidden border-b border-white/5">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        {/* Radial ambient backlights */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-corporate/10 rounded-full blur-[160px] pointer-events-none" />

        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Interactive scrolling text layout */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand px-3 py-1 bg-brand/10 rounded-full w-fit border border-brand/20">
                Pioneering Data & AI
              </span>
              
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white mb-6">
                Redefining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate">Future of Analytics</span>
              </h1>

              {/* Scrolling Text reveal container */}
              <div className="space-y-4 max-w-xl pr-4">
                <ScrollRevealParagraph index={0}>
                  {pageData.intro}
                </ScrollRevealParagraph>
                <ScrollRevealParagraph index={1}>
                  We bridge the gap between complex raw data and strategic board decisions using deep cognitive engineering.
                </ScrollRevealParagraph>
                <ScrollRevealParagraph index={2}>
                  From automated pipelines to custom machine learning integrations, we elevate organizational intelligence.
                </ScrollRevealParagraph>
              </div>

              <div className="pt-6 flex flex-wrap gap-4">
                <Button variant="accent" href="#stats" className="group">
                  <span>Explore Impact</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" href="/contact">
                  Request a Demo
                </Button>
              </div>
            </div>

            {/* Right Column: 3D data pipeline dynamic visual & float badges */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[450px] md:min-h-[500px]">
              
              {/* Loop Animated 3D Pipeline SVG Graphic */}
              <div className="relative w-full max-w-[450px] aspect-square rounded-full border border-white/5 bg-[#12121A]/30 backdrop-blur-3xl flex items-center justify-center shadow-2xl p-6">
                
                {/* Floating, glowing badges that pulse gently */}
                {/* Badge 1: Analytics (Top Left) */}
                <div className="absolute -top-4 -left-6 z-20 animate-[float-slow_6s_ease-in-out_infinite] group">
                  <div className="bg-[#12121A]/85 backdrop-blur-md border border-brand/20 hover:border-brand px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-300">
                    <div className="p-1.5 rounded-lg bg-brand/10 text-brand">
                      <LineChart className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Decision Intel</div>
                      <div className="text-xs font-bold text-white mt-0.5">Analytics</div>
                    </div>
                  </div>
                </div>

                {/* Badge 2: Automation (Bottom Right) */}
                <div className="absolute -bottom-4 -right-4 z-20 animate-[float-slow_5s_ease-in-out_infinite_1.5s] group">
                  <div className="bg-[#12121A]/85 backdrop-blur-md border border-corporate/25 hover:border-corporate px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,114,255,0.15)] hover:shadow-[0_0_25px_rgba(0,114,255,0.3)] transition-all duration-300">
                    <div className="p-1.5 rounded-lg bg-corporate/10 text-corporate">
                      <Cpu className="w-4 h-4 animate-spin duration-3000" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">AI Pipelines</div>
                      <div className="text-xs font-bold text-white mt-0.5">Automation</div>
                    </div>
                  </div>
                </div>

                {/* Badge 3: Training (Top Right) */}
                <div className="absolute top-[30%] -right-8 z-20 animate-[float-slow_7s_ease-in-out_infinite_3s] group">
                  <div className="bg-[#12121A]/85 backdrop-blur-md border border-brand/20 hover:border-brand px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-300">
                    <div className="p-1.5 rounded-lg bg-brand/10 text-brand">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Knowledge</div>
                      <div className="text-xs font-bold text-white mt-0.5">Training</div>
                    </div>
                  </div>
                </div>

                {/* 3D Isometric Pipeline SVG drawing */}
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <defs>
                    <linearGradient id="cyberGlow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" />
                      <stop offset="50%" stopColor="#0072FF" />
                      <stop offset="100%" stopColor="#00F0FF" />
                    </linearGradient>
                    <filter id="glow-heavy" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-light" x="-10%" y="-10%" width="120%" height="120%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer Orbit HUD */}
                  <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1" strokeDasharray="10, 5" />
                  <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(0, 114, 255, 0.08)" strokeWidth="2" strokeDasharray="40, 20" className="animate-[spin_40s_linear_infinite]" />

                  {/* Isometric Grid Floor (back layer) */}
                  <g opacity="0.12" transform="rotate(30, 200, 200)">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`v-${i}`} x1={40 + i * 40} y1="40" x2={40 + i * 40} y2="360" stroke="#00F0FF" strokeWidth="1" />
                    ))}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`h-${i}`} x1="40" y1={40 + i * 40} x2="360" y2={40 + i * 40} stroke="#00F0FF" strokeWidth="1" />
                    ))}
                  </g>

                  {/* Data Pipeline Streams (Glowing Lines) */}
                  {/* Pipeline path 1: Left to Right S-curve */}
                  <path 
                    d="M 50 180 C 120 180, 120 280, 200 280 C 280 280, 280 120, 350 120" 
                    fill="none" 
                    stroke="url(#cyberGlow)" 
                    strokeWidth="3" 
                    opacity="0.8"
                    filter="url(#glow-light)"
                  />
                  {/* Pipeline path 2: Right to Left S-curve */}
                  <path 
                    d="M 350 280 C 280 280, 280 120, 200 120 C 120 120, 120 220, 50 220" 
                    fill="none" 
                    stroke="rgba(0, 114, 255, 0.5)" 
                    strokeWidth="2" 
                    strokeDasharray="8 6"
                  />

                  {/* Central Cognitive Core (AI Brain Sphere) */}
                  <g transform="translate(200, 200)">
                    {/* Glowing outer aura */}
                    <circle cx="0" cy="0" r="45" fill="rgba(0, 240, 255, 0.04)" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" filter="url(#glow-heavy)" />
                    <circle cx="0" cy="0" r="32" fill="rgba(0, 114, 255, 0.08)" stroke="rgba(0, 114, 255, 0.3)" strokeWidth="1.5" />
                    
                    {/* Inner core */}
                    <circle cx="0" cy="0" r="18" fill="#0A0A0E" stroke="#00F0FF" strokeWidth="2.5" filter="url(#glow-light)" />
                    <circle cx="0" cy="0" r="6" fill="#00F0FF" className="animate-ping" />
                    <circle cx="0" cy="0" r="5" fill="#00F0FF" />

                    {/* Orbiting particles */}
                    <g className="animate-[spin_10s_linear_infinite]">
                      <circle cx="28" cy="0" r="3" fill="#00F0FF" />
                      <line x1="0" y1="0" x2="28" y2="0" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1" />
                    </g>
                    <g className="animate-[spin_15s_linear_infinite_reverse]">
                      <circle cx="0" cy="-35" r="3" fill="#0072FF" />
                      <line x1="0" y1="0" x2="0" y2="-35" stroke="rgba(0, 114, 255, 0.3)" strokeWidth="1" />
                    </g>
                  </g>

                  {/* Flowing Data Packets along path 1 */}
                  {/* Packet 1 */}
                  <circle r="5" fill="#FFF" filter="url(#glow-light)">
                    <animateMotion 
                      dur="5s" 
                      repeatCount="indefinite" 
                      path="M 50 180 C 120 180, 120 280, 200 280 C 280 280, 280 120, 350 120"
                    />
                  </circle>
                  {/* Packet 2 (delayed) */}
                  <circle r="4" fill="#00F0FF">
                    <animateMotion 
                      dur="5s" 
                      begin="1.8s"
                      repeatCount="indefinite" 
                      path="M 50 180 C 120 180, 120 280, 200 280 C 280 280, 280 120, 350 120"
                    />
                  </circle>

                  {/* Flowing Data Packets along path 2 */}
                  <circle r="4.5" fill="#0072FF" filter="url(#glow-light)">
                    <animateMotion 
                      dur="4s" 
                      repeatCount="indefinite" 
                      path="M 350 280 C 280 280, 280 120, 200 120 C 120 120, 120 220, 50 220"
                    />
                  </circle>

                  {/* Connecting lines from Core to badging target points */}
                  <line x1="200" y1="200" x2="60" y2="80" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="200" y1="200" x2="330" y2="150" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="200" y1="200" x2="320" y2="330" stroke="rgba(0, 114, 255, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* 2. STATS SECTION — Countup Scroll-triggered */}
      <section id="stats" className="py-24 md:py-32 relative bg-[#0D0D14] border-b border-white/5 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-brand/5 rounded-full blur-[130px] pointer-events-none" />
        
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Metrics of Excellence</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 mb-6">
              Proven Capabilities, Measurable Impact
            </h2>
            <p className="text-slate-400 font-light text-base md:text-lg">
              {pageData.reachLine || "We deliver strategic advantages across global markets with data systems designed to scale."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {parsedStats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-[#12121A]/50 backdrop-blur-md border border-white/5 hover:border-brand/20 p-8 rounded-3xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="text-[44px] md:text-[54px] font-bold text-white font-display leading-none mb-3 flex items-baseline">
                  <CountUp value={stat.num} suffix={stat.suffix} className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate" />
                </div>
                <div className="text-sm font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  {stat.label}
                </div>
                <div className="w-12 h-[2px] bg-gradient-to-r from-brand to-transparent mt-4 opacity-50 group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. SPECIALIZATIONS SECTION — Glowing Tabs / Cards */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-[#0A0A0E] border-b border-white/5">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">What We Specialize In</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
                Core Domains of Strategic Innovation
              </h2>
              <p className="text-slate-400 font-light text-sm md:text-base leading-relaxed">
                KVJ Analytics transforms industrial workflows by injecting state-of-the-art data modeling and cognitive engines. Here is how we specialize.
              </p>
              
              <div className="hidden lg:flex flex-col gap-2.5 pt-4">
                {specializations.map((spec, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
                      activeTab === idx
                        ? "bg-brand/10 border-brand/40 text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                        : "bg-[#12121A]/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {specializations.map((spec, idx) => {
                  const icons = [LineChart, Cpu, GraduationCap, Database];
                  const Icon = icons[idx % icons.length];
                  
                  return (
                    <div
                      key={idx}
                      className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-[230px] group ${
                        activeTab === idx || activeTab === -1
                          ? "bg-[#12121A] border-brand/30 shadow-[0_0_30px_rgba(0,240,255,0.05)]"
                          : "bg-[#12121A]/40 border-white/5 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${
                          activeTab === idx ? "bg-brand/15 text-brand" : "bg-white/5 text-slate-400"
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono text-slate-500 font-bold">0{idx + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand transition-colors">
                          {spec}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">
                          Empowering enterprise decision makers with robust tools engineered to convert complexity into clear pathways.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. VISION SECTION — High-Tech Holographic Statement */}
      <section className="py-24 md:py-32 relative bg-[#0D0D14] overflow-hidden">
        {/* Abstract glowing waves */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(ellipse_at_bottom,rgba(0,240,255,0.08),transparent)] pointer-events-none" />
        
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
              {pageData.vision?.heading || "Our Core Vision"}
            </span>
            <blockquote className="font-display font-medium text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed tracking-tight text-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              &ldquo;{pageData.vision?.body || "To establish a cognitive global standard in data accessibility, automating human error out of strategy execution."}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-brand/50" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">KVJ Analytics Directive</span>
              <span className="w-8 h-[1px] bg-brand/50" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
