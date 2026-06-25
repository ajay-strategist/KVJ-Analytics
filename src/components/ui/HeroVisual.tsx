"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, BarChart3, PieChart, Zap, Sparkles, Activity, Layers, Database } from "lucide-react";

/**
 * Futuristic WebGL-style 3D Rotating Dashboard centerpiece for the Hero section.
 * Designed with a crisp white & glass theme, deep navy blue borders/typography,
 * and glowing metallic gold details and gradients.
 */
export function HeroVisual() {
  const [rotate, setRotate] = useState({ x: 22, y: -16, z: 2 });
  
  useEffect(() => {
    // Add subtle auto-rotation/breathing animation based on time
    let raf = 0;
    let t = 0;
    
    const animate = () => {
      t += 0.008;
      // Gentle oscillation around the base rotation values
      setRotate({
        x: 22 + Math.sin(t * 0.8) * 3,
        y: -16 + Math.cos(t * 0.6) * 4,
        z: 2 + Math.sin(t * 0.4) * 2
      });
      raf = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full max-w-[620px] mx-auto min-h-[500px] flex items-center justify-center py-8 select-none">
      {/* Background ambient gold and soft purple backlights */}
      <div className="absolute top-[15%] left-[20%] w-72 h-72 rounded-full bg-brand/10 blur-[90px] pointer-events-none animate-pulse duration-[7s]" />
      <div className="absolute bottom-[15%] right-[15%] w-80 h-80 rounded-full bg-slate/10 blur-[100px] pointer-events-none animate-pulse duration-[9s]" />
      
      {/* 3D Perspective Container */}
      <div 
        className="relative w-full h-[430px] transition-transform duration-500 ease-out hover:scale-[1.04]"
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Layer 1: Base Platform - Dynamic Power BI Board (Z-Offset: 0px) */}
        <div 
          className="absolute inset-0 bg-white/55 backdrop-blur-2xl border-[1.5px] border-navy/15 rounded-[32px] shadow-[0_32px_80px_rgba(10,17,40,0.06)] p-6 flex flex-col justify-between overflow-hidden"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg)`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Futuristic mesh/grid layer */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] rounded-[32px]" />
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-navy/10 pb-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-navy/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-navy/20" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/5 border border-navy/10">
              <Activity className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span className="text-[10px] font-bold text-navy uppercase tracking-wider font-display">Power_BI Engine v5.0</span>
            </div>
          </div>

          {/* Grid Layout inside Dashboard */}
          <div className="grid grid-cols-12 gap-4 my-auto relative z-10">
            {/* Left part: interconnected grid nodes */}
            <div className="col-span-7 space-y-3.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-navy" />
                <div className="h-3 w-32 rounded-full bg-navy/10" />
              </div>
              
              {/* Connected node mock */}
              <div className="relative h-[80px] w-full border border-navy/10 rounded-xl bg-white/40 p-2 flex items-center justify-center">
                <svg className="w-full h-full opacity-60">
                  <line x1="20" y1="40" x2="80" y2="20" stroke="#0A1128" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="80" y1="20" x2="140" y2="60" stroke="#D4AF37" strokeWidth="1" />
                  <line x1="140" y1="60" x2="200" y2="40" stroke="#0A1128" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="20" cy="40" r="3" fill="#0A1128" />
                  <circle cx="80" cy="20" r="4.5" fill="#D4AF37" className="animate-ping duration-1000" />
                  <circle cx="80" cy="20" r="3.5" fill="#D4AF37" />
                  <circle cx="140" cy="60" r="3" fill="#0A1128" />
                  <circle cx="200" cy="40" r="3.5" fill="#D4AF37" />
                </svg>
              </div>
            </div>

            {/* Right part: Donut KPI */}
            <div className="col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="36" fill="transparent" stroke="rgba(10,17,40,0.06)" strokeWidth="7" />
                  <circle cx="48" cy="48" r="36" fill="transparent" stroke="#D4AF37" strokeWidth="7" strokeDasharray="226" strokeDashoffset="65" strokeLinecap="round" />
                  <circle cx="48" cy="48" r="36" fill="transparent" stroke="#0A1128" strokeWidth="7" strokeDasharray="226" strokeDashoffset="160" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[14px] font-extrabold text-navy font-display">86%</span>
                  <span className="text-[8px] font-bold text-navy/50 uppercase tracking-widest">Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-navy/10 pt-4 relative z-10">
            <div className="h-2 w-20 rounded-full bg-navy/15" />
            <div className="h-2.5 w-12 rounded-full bg-navy/10" />
          </div>
        </div>

        {/* Layer 2: Glowing Financial Bar Chart Panel (Z-Offset: 55px) */}
        <div 
          className="absolute top-[6%] left-[6%] w-[68%] bg-white/65 backdrop-blur-2xl border-[1.5px] border-navy/15 rounded-2xl shadow-[0_20px_50px_rgba(10,17,40,0.08)] p-5 animate-[float-slow_6s_ease-in-out_infinite]"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg) translateZ(55px)`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-navy/5 text-navy">
                <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-[12px] font-bold text-navy tracking-tight">Financial Modeling</h4>
                <span className="text-[9px] text-slate/70 font-semibold uppercase tracking-wider">Automated Forecasts</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-navy flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35">
              USD +18.2%
            </span>
          </div>

          {/* Bar Chart Graphics - Metallic Gold Theme */}
          <div className="h-[95px] flex items-end justify-between gap-3 pt-3">
            {[40, 75, 60, 95, 50, 85].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full relative rounded-t-md overflow-hidden bg-navy/5" style={{ height: "75px" }}>
                  {/* Glowing gold metallic gradient */}
                  <div 
                    className="absolute bottom-0 inset-x-0 rounded-t-md transition-all duration-500 ease-out origin-bottom bg-gradient-to-t from-[#B38728] via-[#D4AF37] to-[#FCF6BA]"
                    style={{ 
                      height: `${h}%`,
                      boxShadow: "0 0 10px rgba(212,175,55,0.25)"
                    }}
                  />
                  {/* Hover shine reflection */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:animate-[shine_1.2s_ease-in-out]" />
                </div>
                <span className="text-[8px] font-bold text-navy/40 font-mono">Q{idx+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3: Interactive Trending Line Chart (Z-Offset: 100px) */}
        <div 
          className="absolute bottom-[4%] right-[4%] w-[64%] bg-white/75 backdrop-blur-2xl border-[1.5px] border-navy/15 rounded-2xl shadow-[0_24px_60px_rgba(191,149,63,0.18)] p-5 animate-[float-slow_8s_ease-in-out_infinite_1.5s] holo-card border-r-[3px] border-r-[#D4AF37]"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg) translateZ(100px)`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-[12px] font-bold text-navy tracking-tight font-display">Active KPI Trends</h4>
                <span className="text-[9px] text-slate/70 font-semibold uppercase tracking-wider">Predictive Modeling</span>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
          </div>

          {/* SVG Line Graph with glowing filters */}
          <div className="relative pt-1">
            <svg viewBox="0 0 200 65" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="goldGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(212,175,55,0.4)" />
                  <stop offset="100%" stopColor="rgba(212,175,55,0)" />
                </linearGradient>
              </defs>
              
              {/* Navy grid support lines */}
              <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(10,17,40,0.06)" strokeWidth="0.75" />
              <line x1="0" y1="40" x2="200" y2="40" stroke="rgba(10,17,40,0.06)" strokeWidth="0.75" />
              <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(10,17,40,0.06)" strokeWidth="0.75" />
              
              {/* Fill area */}
              <path 
                d="M 0 45 C 30 40, 45 15, 75 22 C 105 30, 125 5, 155 10 C 185 15, 200 2, 200 2 L 200 65 L 0 65 Z" 
                fill="url(#goldGlowGrad)" 
              />
              
              {/* Stroke line */}
              <path 
                d="M 0 45 C 30 40, 45 15, 75 22 C 105 30, 125 5, 155 10 C 185 15, 200 2, 200 2" 
                fill="none" 
                stroke="#D4AF37" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />

              {/* Glowing trend marker dot */}
              <circle cx="200" cy="2" r="5" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Layer 4: Close-up Speed Badge (Z-Offset: 135px - closest to viewer) */}
        <div 
          className="absolute top-[28%] right-[5%] bg-white/85 backdrop-blur-2xl border-[1.5px] border-navy/15 rounded-xl shadow-[0_16px_36px_rgba(10,17,40,0.06)] px-4 py-3.5 flex items-center gap-3 animate-[float-slow_5s_ease-in-out_infinite_3.2s] border-l-4 border-l-[#D4AF37]"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg) translateZ(135px)`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="h-8 w-8 rounded-full bg-navy/5 flex items-center justify-center text-[#D4AF37]">
            <Zap className="w-4.5 h-4.5 animate-bounce" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-navy/50 uppercase tracking-widest leading-none">Response Speed</div>
            <div className="text-[16px] font-extrabold text-navy font-display mt-1 leading-none tracking-tight">99.9%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
