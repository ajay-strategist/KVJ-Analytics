import React from "react";
import { TrendingUp, BarChart3, PieChart, Zap, Sparkles, Activity } from "lucide-react";

/**
 * Premium 3D Holographic Floating Charts for KVJ Analytics Hero Section.
 * Implements isometric rotation, glassmorphism, metallic gradients, 
 * and independent floating parallax effects.
 */
export function HeroVisual() {
  return (
    <div className="relative w-full max-w-[600px] mx-auto min-h-[480px] flex items-center justify-center py-8 select-none">
      {/* Background neon pastel glowing circles */}
      <div className="absolute top-[10%] left-[20%] w-72 h-72 rounded-full bg-brand/12 blur-[80px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-[10%] right-[10%] w-80 h-80 rounded-full bg-education/10 blur-[90px] pointer-events-none animate-pulse duration-[8s]" />
      
      {/* 3D Perspective Container */}
      <div 
        className="relative w-full h-[400px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Layer 1: Base holographic grid plane (furthest back) */}
        <div 
          className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-[0_30px_70px_rgba(123,97,255,0.06)] p-6 flex flex-col justify-between overflow-hidden"
          style={{
            transform: "rotateX(24deg) rotateY(-18deg) rotateZ(4deg)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Faint Grid overlay inside base */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.25] rounded-[32px]" />
          
          {/* Header element of base */}
          <div className="flex items-center justify-between border-b border-slate/10 pb-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.5)]" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.5)]" />
              <span className="h-3 w-3 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.5)]" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate/5 border border-slate/10">
              <Activity className="w-3.5 h-3.5 text-brand animate-pulse" />
              <span className="text-[10px] font-bold text-slate uppercase tracking-wider">Holo_OS v4.1</span>
            </div>
          </div>

          {/* Core content of base */}
          <div className="grid grid-cols-2 gap-4 my-auto relative z-10">
            <div className="space-y-2.5">
              <div className="h-3.5 w-24 rounded-full bg-slate/10" />
              <div className="h-2 w-36 rounded-full bg-slate/5" />
              <div className="h-2 w-28 rounded-full bg-slate/5" />
            </div>
            <div className="flex items-center justify-end">
              {/* Radial donut graph in background */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="30" fill="transparent" stroke="rgba(123,97,255,0.08)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="30" fill="transparent" stroke="#7B61FF" strokeWidth="6" strokeDasharray="188" strokeDashoffset="50" strokeLinecap="round" />
                </svg>
                <PieChart className="absolute w-6 h-6 text-brand" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate/10 pt-4 relative z-10">
            <div className="h-2.5 w-16 rounded-full bg-slate/10" />
            <div className="h-2.5 w-10 rounded-full bg-slate/10" />
          </div>
        </div>

        {/* Layer 2: Main Floating Bar Chart (Z-Offset: 45px) */}
        <div 
          className="absolute top-[8%] left-[5%] w-[68%] bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-[0_20px_50px_rgba(123,97,255,0.12)] p-5 animate-[float-slow_6s_ease-in-out_infinite]"
          style={{
            transform: "rotateX(24deg) rotateY(-18deg) rotateZ(4deg) translateZ(45px)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand/10 text-brand">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[12px] font-bold text-ink tracking-tight">Report Automation</h4>
                <span className="text-[9px] text-slate/60 font-semibold uppercase tracking-wider">MIS Delivery</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-success flex items-center gap-0.5">
              +14.8%
            </span>
          </div>

          {/* Bar Chart Graphics */}
          <div className="h-[90px] flex items-end justify-between gap-2.5 pt-3">
            {[45, 75, 55, 95, 60, 85].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full relative rounded-t-md overflow-hidden bg-slate/5" style={{ height: "75px" }}>
                  {/* Glowing 3D-looking pastel gradients */}
                  <div 
                    className="absolute bottom-0 inset-x-0 rounded-t-md transition-all duration-500 ease-out origin-bottom bg-gradient-to-t from-brand to-brand/60"
                    style={{ 
                      height: `${h}%`,
                      boxShadow: "0 0 12px rgba(123,97,255,0.25)"
                    }}
                  />
                  {/* Sheen accent overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:animate-[shine_1.2s_ease-in-out]" />
                </div>
                <span className="text-[8px] font-bold text-slate/50 font-mono">0{idx+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3: Overlay Trending Line Chart (Z-Offset: 90px) */}
        <div 
          className="absolute bottom-[6%] right-[5%] w-[64%] bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-[0_25px_60px_rgba(15,181,171,0.14)] p-5 animate-[float-slow_8s_ease-in-out_infinite_1.5s] holo-card border-r-4 border-r-education/40"
          style={{
            transform: "rotateX(24deg) rotateY(-18deg) rotateZ(4deg) translateZ(90px)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-education/10 text-education">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[12px] font-bold text-ink tracking-tight">Active Analytics</h4>
                <span className="text-[9px] text-slate/60 font-semibold uppercase tracking-wider">KPI Trends</span>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-education animate-ping" />
          </div>

          {/* SVG Line Graph with glowing filters */}
          <div className="relative pt-1">
            <svg viewBox="0 0 200 65" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(15,181,171,0.35)" />
                  <stop offset="100%" stopColor="rgba(15,181,171,0)" />
                </linearGradient>
              </defs>
              
              {/* Fill area */}
              <path 
                d="M 0 50 C 30 45, 45 25, 75 30 C 105 35, 125 10, 155 15 C 185 20, 200 5, 200 5 L 200 60 L 0 60 Z" 
                fill="url(#glowGrad)" 
              />
              
              {/* Stroke line */}
              <path 
                d="M 0 50 C 30 45, 45 25, 75 30 C 105 35, 125 10, 155 15 C 185 20, 200 5, 200 5" 
                fill="none" 
                stroke="#0FB5AB" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />

              {/* Glowing trend marker dot */}
              <circle cx="200" cy="5" r="4.5" fill="#FFFFFF" stroke="#0FB5AB" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Layer 4: Miniature Holographic Badge (Z-Offset: 120px - closest to screen) */}
        <div 
          className="absolute top-[28%] right-[8%] bg-white/90 backdrop-blur-2xl border border-white/90 rounded-xl shadow-[0_15px_35px_rgba(245,158,11,0.15)] px-4 py-3 flex items-center gap-3 animate-[float-slow_5s_ease-in-out_infinite_3.2s] border-l-4 border-l-brand"
          style={{
            transform: "rotateX(24deg) rotateY(-18deg) rotateZ(4deg) translateZ(120px)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
            <Zap className="w-4.5 h-4.5 animate-bounce" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate/50 uppercase tracking-widest leading-none">Speed</div>
            <div className="text-[16px] font-extrabold text-ink font-display mt-0.5 leading-none">99.8%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
