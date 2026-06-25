"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Activity, Cpu, Workflow, Layers, CheckCircle2 } from "lucide-react";

/**
 * Highly detailed 3D animated holographic projection.
 * Displays a complex Power BI-style financial dashboard,
 * interactive data charts, and interconnected automation workflow nodes.
 * Utilizes hardware-accelerated CSS 3D transforms for a smooth floating animation.
 */
export function HeroVisual() {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setT((prev) => (prev + 0.01) % (Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Compute rotation offsets for a organic floating breathing effect
  const rotX = 58 + Math.sin(t) * 3;
  const rotY = -12 + Math.cos(t * 1.2) * 3;
  const rotZ = 4 + Math.sin(t * 0.8) * 2;
  const translateZ = Math.sin(t * 1.5) * 12;

  return (
    <div className="relative w-full max-w-[550px] mx-auto min-h-[520px] flex items-center justify-center py-10 select-none">
      {/* Background ambient neon cyan/blue glowing backlights */}
      <div className="absolute top-[10%] left-[10%] w-80 h-80 rounded-full bg-brand/10 blur-[110px] pointer-events-none animate-pulse duration-[7s]" />
      <div className="absolute bottom-[10%] right-[10%] w-[340px] h-[340px] rounded-full bg-[#0072FF]/12 blur-[120px] pointer-events-none animate-pulse duration-[9s]" />

      {/* Holographic Projection HUD Ring Base */}
      <div className="absolute bottom-4 w-[90%] h-12 bg-gradient-to-t from-brand/20 to-transparent rounded-full blur-[10px] transform scale-y-[0.35] opacity-80 pointer-events-none" />
      <div className="absolute bottom-6 w-[80%] h-6 border-2 border-brand/20 rounded-full transform scale-y-[0.25] opacity-60 pointer-events-none animate-ping" />

      {/* Isometric 3D Space Wrapper */}
      <div
        className="relative w-full aspect-square max-w-[460px] flex items-center justify-center"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) translateY(${translateZ}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ==================== LAYER 1: AUTOMATION NODES (Bottom Layer, Z-offset: -50px) ==================== */}
          <div
            className="absolute inset-4 rounded-[28px] border border-brand/10 bg-brand/[0.02] flex items-center justify-center"
            style={{
              transform: "translateZ(-50px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.04)_1px,transparent_1px)] bg-[size:2rem_2rem] rounded-[28px]" />
            
            {/* Connected Node Network SVG */}
            <svg viewBox="0 0 400 400" className="w-full h-full opacity-65">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0072FF" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Connection lines */}
              <line x1="80" y1="120" x2="200" y2="200" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="5 3" />
              <line x1="320" y1="120" x2="200" y2="200" stroke="url(#lineGrad)" strokeWidth="1.5" />
              <line x1="200" y1="200" x2="200" y2="320" stroke="url(#lineGrad)" strokeWidth="2" />
              <line x1="80" y1="280" x2="200" y2="320" stroke="url(#lineGrad)" strokeWidth="1.5" />
              <line x1="320" y1="280" x2="200" y2="320" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="5 3" />

              {/* Pulsing automation node loops */}
              <g>
                <circle cx="80" cy="120" r="14" fill="#0A0A0E" stroke="#00F0FF" strokeWidth="1.5" />
                <circle cx="80" cy="120" r="6" fill="#00F0FF" className="animate-pulse" />
              </g>
              <g>
                <circle cx="320" cy="120" r="14" fill="#0A0A0E" stroke="#0072FF" strokeWidth="1.5" />
                <circle cx="320" cy="120" r="6" fill="#0072FF" />
              </g>
              <g>
                <circle cx="200" cy="200" r="20" fill="#0A0A0E" stroke="#00F0FF" strokeWidth="2" />
                <circle cx="200" cy="200" r="6" fill="#00F0FF" />
              </g>
              <g>
                <circle cx="200" cy="320" r="16" fill="#0A0A0E" stroke="#0072FF" strokeWidth="1.5" />
                <circle cx="200" cy="320" r="6" fill="#0072FF" className="animate-ping" />
              </g>
              <g>
                <circle cx="80" cy="280" r="12" fill="#0A0A0E" stroke="#00F0FF" strokeWidth="1.2" />
              </g>
              <g>
                <circle cx="320" cy="280" r="12" fill="#0A0A0E" stroke="#0072FF" strokeWidth="1.2" />
              </g>
            </svg>
          </div>

          {/* ==================== LAYER 2: POWER BI FINANCIAL DASHBOARD (Middle Layer, Z-offset: 0px) ==================== */}
          <div
            className="absolute inset-0 rounded-[28px] border border-white/10 bg-[#12121A]/75 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between"
            style={{
              transform: "translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Dashboard Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand/10 text-brand">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold tracking-widest text-[#00F0FF]">FINANCE_BI_HUB</div>
                  <div className="text-[7px] text-slate-500 font-mono">SECURE INTEGRATION v4.2</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand/5 border border-brand/20">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-ping" />
                <span className="text-[7px] font-mono font-bold text-white tracking-wider">LIVE</span>
              </div>
            </div>

            {/* Dashboard Visual Grid */}
            <div className="grid grid-cols-12 gap-3.5 my-4 flex-grow items-stretch">
              
              {/* Left Column: KPI Ring Dial Gauge */}
              <div className="col-span-4 rounded-xl border border-white/5 bg-white/[0.01] p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[7px] font-mono uppercase tracking-widest text-slate-500">MIS Target</span>
                
                <div className="relative w-18 h-18 my-2 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="#00F0FF" 
                      strokeWidth="3.5" 
                      strokeDasharray="100" 
                      strokeDashoffset="16" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-mono font-bold text-white">84%</span>
                </div>
                
                <span className="text-[8px] font-bold text-[#00F0FF] font-mono leading-none">Automated</span>
              </div>

              {/* Middle Column: Financial Bar Charts */}
              <div className="col-span-8 rounded-xl border border-white/5 bg-white/[0.01] p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[7px] font-mono uppercase tracking-widest text-slate-500">Yield Analytics</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0072FF]" />
                  </div>
                </div>
                
                {/* Bar heights modulated slightly dynamically */}
                <div className="h-14 flex items-end justify-between gap-1.5 pt-2">
                  {[30, 65, 50, 90, 45, 75, 60, 95].map((h, idx) => (
                    <div key={idx} className="flex-1 flex flex-col gap-1 items-center">
                      <div className="w-full relative rounded bg-white/5" style={{ height: "45px" }}>
                        <div 
                          className="absolute bottom-0 inset-x-0 rounded bg-gradient-to-t from-[#0072FF] to-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all duration-1000"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className="text-[5px] font-bold text-slate-500 font-mono">Q{idx+1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row status banner */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[7px] font-mono text-slate-400">
              <div className="flex items-center gap-1">
                <Workflow className="w-3.5 h-3.5 text-brand mr-1" />
                <span>INTEGRATION: ACTIVE</span>
              </div>
              <div>LATENCY: 0.12ms</div>
            </div>
          </div>

          {/* ==================== LAYER 3: FLOATING TOOLTIPS & METRICS (Top Layer, Z-offset: 50px) ==================== */}
          {/* Floating Line Chart Tooltip (Top Right) */}
          <div
            className="absolute top-[8%] right-[-30px] rounded-2xl border border-brand/35 bg-[#12121A]/90 backdrop-blur-xl px-4 py-3 shadow-[0_12px_32px_rgba(0,240,255,0.18)] max-w-[170px]"
            style={{
              transform: "translateZ(50px)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1 rounded bg-brand/10 text-brand">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-bold text-white font-display">Revenue Growth</span>
            </div>
            
            <div className="text-lg font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate leading-none mb-1">
              +142.8%
            </div>
            
            <p className="text-[6px] text-slate-500 font-mono leading-normal">
              Continuous dashboard generation successfully loaded.
            </p>
          </div>

          {/* Floating Performance Indicator Badge (Bottom Left) */}
          <div
            className="absolute bottom-[12%] left-[-40px] rounded-xl border border-[#0072FF]/40 bg-[#12121A]/90 backdrop-blur-xl px-3 py-2.5 shadow-[0_12px_28px_rgba(0,114,255,0.18)] flex items-center gap-2"
            style={{
              transform: "translateZ(65px)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="w-6 h-6 rounded-full bg-[#0072FF]/10 flex items-center justify-center text-[#0072FF]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-left font-mono">
              <span className="text-[6px] text-slate-500 uppercase tracking-wider block">MIS AUDIT</span>
              <span className="text-[10px] font-bold text-white leading-none mt-0.5">COMPLIANT</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
