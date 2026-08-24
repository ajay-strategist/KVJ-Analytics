"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle, Database, Cog, BarChart3, Gauge, FileBarChart, TrendingUp,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const STAGES: { name: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { name: "Business Challenge", Icon: AlertTriangle },
  { name: "Data Collection", Icon: Database },
  { name: "Data Engineering", Icon: Cog },
  { name: "Analytics", Icon: BarChart3 },
  { name: "Visualization", Icon: Gauge },
  { name: "Report Automation", Icon: FileBarChart },
  { name: "Business Decisions", Icon: TrendingUp },
];

const STAGE_DESCRIPTIONS = [
  "We identify key business challenges, gather stakeholder requirements, and audit existing data assets to establish a clear digital roadmap.",
  "Our architects design robust database schemas, secure pipeline flows, and technical architectures optimized for scale, security, and cost.",
  "We build automated data integration pipelines (ETL/ELT), clean raw datasets, and construct resilient data warehouses on Google Cloud and other platforms.",
  "Data pipelines are deployed using modern CI/CD practices, robust monitoring frameworks, and automated schema migrations for high availability.",
  "We continuously monitor and tune query performance, reduce storage overhead, and optimize database indexing to ensure maximum efficiency.",
  "Manual reporting is replaced with automated dashboards, scheduled pipelines, and real-time business intelligence monitors.",
  "Empower leadership teams with clear, actionable insights, predictive analytics models, and automated reporting systems to drive growth."
];

export function BusinessAnalyticsPipeline({
  eyebrow = "Our Approach", heading, stageNames,
}: { eyebrow?: string; heading: string; stageNames?: string[] }) {
  const nameAt = (i: number) => (stageNames?.[i]?.trim() || STAGES[i].name);
  const [active, setActive] = useState(0);

  // Auto-play cycling effect to make it feel alive and dynamic when not hovered
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 md:py-32 bg-base overflow-hidden">
      {/* Glow effect */}
      <div className="blob animate-blob absolute top-[20%] right-[10%] w-[32rem] h-[32rem] bg-brand/5 pointer-events-none" />
      <div className="blob animate-blob absolute bottom-[10%] left-[-5%] w-[24rem] h-[24rem] bg-corporate/5 pointer-events-none" style={{ animationDelay: "2s" }} />

      <Container className="relative z-10">
        {/* Title */}
        <Reveal className="mb-14 max-w-3xl">
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight text-glow-hero">{heading}</h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Timeline List */}
          <div className="lg:col-span-6 relative flex flex-col gap-4">
            {STAGES.map((s, i) => {
              const isActive = i === active;
              const isCompleted = i < active;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group relative flex items-center gap-4 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-xl py-2 px-3 transition-all duration-300 hover:bg-white/[0.02]"
                >
                  {/* Icon badge */}
                  <div className="relative z-10 shrink-0">
                    {isActive && <span className="absolute -inset-1.5 rounded-full bg-brand/20 animate-ping opacity-60" />}
                    <span className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 ${
                      isActive 
                        ? "border-brand bg-brand/20 text-brand shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                        : isCompleted 
                        ? "border-brand/40 bg-brand/5 text-brand/80" 
                        : "border-line bg-base text-muted group-hover:border-slate/40 group-hover:text-slate"}`}>
                      <s.Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                    </span>
                  </div>

                  {/* Stage Text */}
                  <div className="min-w-0 flex-1">
                    <span className={`block font-mono text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 ${
                      isActive ? "text-brand" : "text-muted"
                    }`}>
                      STAGE {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`block text-[16px] font-semibold leading-tight transition-colors duration-300 ${
                      isActive ? "text-ink" : "text-slate/70 group-hover:text-ink"
                    }`}>
                      {nameAt(i)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Premium Stage Dashboard Card */}
          <div className="lg:col-span-6">
            <Reveal variant="scale" className="w-full">
              <div className="glow-ring relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-cyan-500/30 p-8 min-h-[360px] shadow-2xl flex flex-col justify-between">
                <div className="absolute -top-16 -right-12 h-52 w-52 rounded-full bg-cyan-500/20 blur-[80px] pointer-events-none" />
                
                <div key={active} className="animate-fade-up relative z-10 space-y-5">
                  {/* Card Header */}
                  <div>
                    <span className="font-mono text-[11px] font-bold text-cyan-400 tracking-widest uppercase">
                      STAGE {String(active + 1).padStart(2, "0")} / {STAGES.length}
                    </span>
                    <h3 className="mt-1 font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">
                      {nameAt(active)}
                    </h3>
                  </div>

                  {/* Stage Rich Description */}
                  <p className="text-slate/85 text-[15px] font-light leading-relaxed max-w-md">
                    {STAGE_DESCRIPTIONS[active]}
                  </p>

                  {/* Stage Viz */}
                  <div className="pt-2 h-[80px] flex items-center">
                    <StageViz variant={active} />
                  </div>
                </div>

                {/* 7 Stage Progress Indicator Dots */}
                <div className="relative z-10 flex items-center gap-2 mt-6">
                  {STAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActive(idx)}
                      aria-label={`Go to Stage ${idx + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        idx === active
                          ? "bg-cyan-400 ring-4 ring-cyan-400/30 scale-110 shadow-[0_0_12px_#22d3ee]"
                          : idx < active
                          ? "bg-cyan-500/40 hover:bg-cyan-500/70"
                          : "bg-slate-900 border border-slate-700 hover:border-slate-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Abstract per-stage dashboard (High Visibility Slate/Cyan Theme) */
function StageViz({ variant }: { variant: number }) {
  const cls = "h-[70px] w-full max-w-sm";
  if (variant === 0)
    return <div className="flex max-w-sm flex-wrap gap-2.5">{[...Array(9)].map((_, i) => <span key={i} className="h-3.5 w-3.5 rounded-full border border-cyan-400/40 bg-cyan-400/20 shadow-sm" style={{ opacity: 0.5 + (i % 3) * 0.25 }} />)}</div>;
  if (variant === 1)
    return <div className="relative h-8 w-full max-w-sm overflow-hidden">{[0, 1, 2, 3].map((i) => <span key={i} className="stream-dot absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" style={{ animationDelay: `${i * 0.5}s` }} />)}</div>;
  if (variant === 2)
    return <div className="flex w-full max-w-sm items-end gap-1.5 h-[70px]">{[40, 62, 50, 78, 56, 84, 66].map((h, i) => <div key={i} className="build-line flex-1 rounded-t bg-gradient-to-t from-slate-900 to-cyan-400" style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }} />)}</div>;
  if (variant === 3)
    return <svg viewBox="0 0 240 70" className={cls} preserveAspectRatio="none"><path d="M0 56 C30 50 46 26 70 32 S120 8 150 18 S210 6 240 12" fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" /></svg>;
  if (variant === 4)
    return (
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 42 42" className="h-16 w-16 -rotate-90"><circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" /><circle cx="21" cy="21" r="15.9" fill="none" stroke="#22d3ee" strokeWidth="6" strokeDasharray="64 100" strokeLinecap="round" /></svg>
        <div className="space-y-2">{[70, 48, 32].map((w, i) => <div key={i} className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300" style={{ width: `${w * 1.6}px` }} />)}</div>
      </div>
    );
  if (variant === 5)
    return <div className="w-full max-w-xs space-y-2">{[92, 76, 84, 62].map((w, i) => <div key={i} className="h-2.5 rounded-full bg-slate-900 border border-slate-700"><div className="build-line h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-300" style={{ width: `${w}%`, animationDelay: `${i * 0.4}s` }} /></div>)}</div>;
  return <div className="flex items-end gap-1.5 h-[70px]">{[40, 52, 60, 72, 88, 100].map((h, i) => <div key={i} className="w-6 rounded-t bg-gradient-to-t from-slate-900 to-cyan-400" style={{ height: `${h}%` }} />)}</div>;
}
