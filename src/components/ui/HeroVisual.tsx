"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Activity, Globe, Cpu, Shield, Zap } from "lucide-react";

/**
 * Holographic 3D Rotating Data Globe and HUD Interface.
 * Pure React/SVG/CSS 3D design that animates smoothly at 60fps.
 * Uses neon cyan and electric blue styling on the dark theme.
 */
export function HeroVisual() {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setT((prev) => (prev + 0.015) % (Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Compute positions of floating nodes on the holographic globe
  const nodeCount = 5;
  const nodes = Array.from({ length: nodeCount }).map((_, i) => {
    const angle = t + (i * Math.PI * 2) / nodeCount;
    // Project 3D circle points into 2D ellipse
    const radiusX = 140;
    const radiusY = 45;
    const cx = 200 + Math.cos(angle) * radiusX;
    const cy = 200 + Math.sin(angle) * radiusY;
    const z = Math.sin(angle); // -1 (back) to 1 (front)
    const scale = 0.5 + (z + 1) * 0.45; // larger in front
    const opacity = 0.35 + (z + 1) * 0.55;
    return { cx, cy, scale, opacity, z };
  });

  return (
    <div className="relative w-full max-w-[550px] mx-auto min-h-[500px] flex items-center justify-center py-8 select-none">
      {/* Background ambient glowing backlights */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 rounded-full bg-brand/8 blur-[100px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-[#0072FF]/10 blur-[100px] pointer-events-none animate-pulse duration-[8s]" />
      
      {/* Holographic HUD Container */}
      <div className="relative w-full aspect-square max-w-[440px] flex items-center justify-center">
        
        {/* Decorative corner target brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand/40 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand/40 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand/40 rounded-br-lg" />
        
        {/* Holographic HUD Stats Readout (left) */}
        <div className="absolute left-[-40px] top-[20%] glass-panel rounded-xl px-3 py-2 flex flex-col gap-1 border border-brand/20 shadow-lg text-[9px] font-mono tracking-widest text-[#00F0FF]/80">
          <div className="flex items-center gap-1.5 border-b border-brand/15 pb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-ping" />
            <span>SYS_ONLINE</span>
          </div>
          <div>LAT: 40.7128</div>
          <div>LON: -74.0060</div>
          <div>FEED: 8.6 KB/s</div>
        </div>

        {/* Holographic HUD Stats Readout (right) */}
        <div className="absolute right-[-40px] bottom-[25%] glass-panel rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-brand/20 shadow-lg">
          <Activity className="w-5 h-5 text-brand animate-pulse" />
          <div className="font-mono text-left">
            <div className="text-[8px] text-slate-400 uppercase">SYS STATUS</div>
            <div className="text-[12px] font-bold text-white leading-none mt-0.5">SECURE_</div>
          </div>
        </div>

        {/* Master SVG Globe Visual */}
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full overflow-visible relative z-10"
        >
          <defs>
            {/* Glow filters */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Radial shader for holographic sphere depth */}
            <radialGradient id="sphereShader" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="rgba(0, 240, 255, 0.12)" />
              <stop offset="70%" stopColor="rgba(0, 114, 255, 0.03)" />
              <stop offset="100%" stopColor="rgba(10, 10, 15, 0.85)" />
            </radialGradient>
          </defs>

          {/* 1. Main Transparent Sphere Shader */}
          <circle 
            cx="200" 
            cy="200" 
            r="150" 
            fill="url(#sphereShader)" 
            stroke="rgba(0, 240, 255, 0.22)" 
            strokeWidth="1"
          />

          {/* 2. Outer Ring Orbital (Golden Ratio Angle) */}
          <ellipse 
            cx="200" 
            cy="200" 
            rx="180" 
            ry="60" 
            fill="none" 
            stroke="rgba(0, 114, 255, 0.18)" 
            strokeWidth="1.5" 
            strokeDasharray="8 6"
            className="origin-center animate-spin-slow"
            style={{ transform: "rotate(-15deg)" }}
          />

          {/* 3. Latitude Lines */}
          <ellipse cx="200" cy="200" rx="150" ry="25" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />
          <ellipse cx="200" cy="150" rx="140" ry="20" fill="none" stroke="rgba(0, 240, 255, 0.12)" strokeWidth="0.75" />
          <ellipse cx="200" cy="250" rx="140" ry="20" fill="none" stroke="rgba(0, 240, 255, 0.12)" strokeWidth="0.75" />
          <ellipse cx="200" cy="110" rx="110" ry="15" fill="none" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="0.75" />
          <ellipse cx="200" cy="290" rx="110" ry="15" fill="none" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="0.75" />

          {/* 4. Rotating Longitude Rings (Opposing rotations) */}
          <g 
            className="origin-center"
            style={{ 
              transform: `rotateY(${t * 45}deg)`,
              transformStyle: "preserve-3d" 
            }}
          >
            <ellipse cx="200" cy="200" rx="45" ry="150" fill="none" stroke="rgba(0, 240, 255, 0.22)" strokeWidth="1" />
            <ellipse cx="200" cy="200" rx="125" ry="150" fill="none" stroke="rgba(0, 114, 255, 0.15)" strokeWidth="1" />
          </g>

          <g 
            className="origin-center"
            style={{ 
              transform: `rotateY(${-t * 30}deg)`,
              transformStyle: "preserve-3d" 
            }}
          >
            <ellipse cx="200" cy="200" rx="85" ry="150" fill="none" stroke="rgba(0, 240, 255, 0.18)" strokeWidth="1" strokeDasharray="5 5" />
          </g>

          {/* 5. Scanning satellite beam */}
          <path 
            d={`M 200 200 L ${200 + Math.cos(t * 1.5) * 170} ${200 + Math.sin(t * 1.5) * 55}`} 
            stroke="rgba(0, 240, 255, 0.35)" 
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* 6. Dynamic Floating Data Nodes (Front & Back layers) */}
          {/* Back layer nodes (z < 0) */}
          {nodes
            .filter((n) => n.z < 0)
            .map((n, idx) => (
              <g key={idx} opacity={n.opacity} transform={`translate(${n.cx}, ${n.cy}) scale(${n.scale})`}>
                <circle cx="0" cy="0" r="5" fill="#0072FF" />
                <circle cx="0" cy="0" r="10" fill="none" stroke="#0072FF" strokeWidth="1" />
              </g>
            ))}

          {/* Front layer nodes (z >= 0) */}
          {nodes
            .filter((n) => n.z >= 0)
            .map((n, idx) => (
              <g 
                key={idx} 
                opacity={n.opacity} 
                transform={`translate(${n.cx}, ${n.cy}) scale(${n.scale})`}
                filter="url(#neonGlow)"
              >
                <circle cx="0" cy="0" r="5" fill="#00F0FF" />
                <circle cx="0" cy="0" r="12" fill="none" stroke="#00F0FF" strokeWidth="1" className="animate-ping duration-1500" />
                <circle cx="0" cy="0" r="8" fill="none" stroke="#00F0FF" strokeWidth="1.2" />
                {/* Horizontal data tooltip */}
                <line x1="8" y1="0" x2="35" y2="0" stroke="rgba(0,240,255,0.5)" strokeWidth="1" />
                <rect x="35" y="-8" width="40" height="14" rx="3" fill="rgba(10, 10, 14, 0.85)" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="0.8" />
                <text x="55" y="2" fill="#00F0FF" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  VAL_{Math.floor(n.scale * 100)}
                </text>
              </g>
            ))}

          {/* 7. Holographic outer rings for HUD aesthetic */}
          <circle cx="200" cy="200" r="162" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" strokeDasharray="30 15 10 15" />
          <circle cx="200" cy="200" r="172" fill="none" stroke="rgba(0, 114, 255, 0.08)" strokeWidth="1.5" strokeDasharray="4 8" />
        </svg>

        {/* Lower Ring HUD Platform */}
        <div 
          className="absolute bottom-5 w-[85%] h-5 bg-gradient-to-t from-brand/20 to-transparent rounded-full blur-[8px] transform scale-y-50 pointer-events-none"
          style={{ transform: "rotateX(75deg)" }}
        />
      </div>
    </div>
  );
}
