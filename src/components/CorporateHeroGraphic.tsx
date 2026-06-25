"use client";

import React from "react";

export default function CorporateHeroGraphic() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-visible pointer-events-none select-none">
      <style jsx>{`
        @keyframes floatHero {
          0%, 100% { transform: translateY(0px) rotateX(55deg) rotateZ(-30deg); }
          50% { transform: translateY(-15px) rotateX(58deg) rotateZ(-28deg); }
        }
        @keyframes flowLine {
          to { stroke-dashoffset: -100; }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4)); }
          50% { filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.7)); }
        }
      `}</style>
      
      {/* 3D Isometric Viewport */}
      <div 
        className="relative w-[480px] h-[340px] transition-all duration-1000 origin-center"
        style={{
          transform: "perspective(1200px) rotateX(55deg) rotateZ(-30deg)",
          transformStyle: "preserve-3d",
          animation: "floatHero 8s ease-in-out infinite",
        }}
      >
        {/* Layer 1: Base Grid Layer */}
        <div className="absolute inset-0 bg-[#0A0A0E]/50 backdrop-blur-md rounded-[20px] border border-cyan-500/20 shadow-[0_0_50px_rgba(0,240,255,0.05)] overflow-hidden"
          style={{ transform: "translateZ(0px)" }}>
          {/* Internal Grid Lines */}
          <div className="w-full h-full opacity-20"
            style={{
              backgroundImage: "linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)",
              backgroundSize: "25px 25px"
            }}
          />
        </div>

        {/* Layer 2: Main Dashboard Visuals */}
        <svg 
          viewBox="0 0 500 350" 
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ 
            transform: "translateZ(30px)", 
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.5))"
          }}
        >
          <defs>
            <linearGradient id="heroBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0072FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="heroCyanGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0072FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Line Chart 1 */}
          <path
            d="M 50 200 Q 120 120, 180 180 T 320 100 T 450 150"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              animation: "pulseGlow 4s ease-in-out infinite",
            }}
          />
          <path
            d="M 50 200 Q 120 120, 180 180 T 320 100 T 450 150 L 450 280 L 50 280 Z"
            fill="url(#heroBlueGrad)"
            opacity="0.15"
          />

          {/* Glowing flow lines representing data pipelines */}
          <path
            d="M 60 80 L 220 80 L 220 220 L 380 220 L 440 160"
            fill="none"
            stroke="#0072FF"
            strokeWidth="2.5"
            strokeDasharray="10 15"
            style={{
              animation: "flowLine 15s linear infinite"
            }}
          />
          
          <path
            d="M 80 260 L 280 260 L 350 180"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2"
            strokeDasharray="8 12"
            style={{
              animation: "flowLine 10s linear infinite reverse"
            }}
          />

          {/* Rising Bar Columns */}
          <g transform="translate(300, 180)">
            {/* Bar 1 */}
            <g className="animate-[pulse_2.5s_infinite]">
              <rect x="10" y="-40" width="16" height="40" fill="url(#heroCyanGrad)" stroke="#00F0FF" strokeWidth="1" />
              <polygon points="10,-40 18,-45 26,-40 18,-35" fill="#80FAFF" />
            </g>
            {/* Bar 2 */}
            <g transform="translate(25, -20)" className="animate-[pulse_3s_infinite_0.5s]">
              <rect x="10" y="-55" width="16" height="55" fill="url(#heroCyanGrad)" stroke="#00F0FF" strokeWidth="1" />
              <polygon points="10,-55 18,-60 26,-55 18,-50" fill="#80FAFF" />
            </g>
            {/* Bar 3 */}
            <g transform="translate(50, -10)" className="animate-[pulse_2s_infinite_1s]">
              <rect x="10" y="-30" width="16" height="30" fill="url(#heroCyanGrad)" stroke="#00F0FF" strokeWidth="1" />
              <polygon points="10,-30 18,-35 26,-30 18,-25" fill="#80FAFF" />
            </g>
          </g>

          {/* Interconnected data nodes */}
          <g transform="translate(100, 100)">
            <circle cx="0" cy="0" r="8" fill="#050505" stroke="#00F0FF" strokeWidth="2" />
            <circle cx="0" cy="0" r="3.5" fill="#00F0FF" className="animate-ping" />
          </g>
          <g transform="translate(220, 150)">
            <circle cx="0" cy="0" r="8" fill="#050505" stroke="#0072FF" strokeWidth="2" />
            <circle cx="0" cy="0" r="3.5" fill="#0072FF" className="animate-ping" />
          </g>
          <g transform="translate(380, 110)">
            <circle cx="0" cy="0" r="8" fill="#050505" stroke="#00F0FF" strokeWidth="2" />
            <circle cx="0" cy="0" r="3.5" fill="#00F0FF" className="animate-ping" />
          </g>
        </svg>

        {/* Layer 3: Concentric Holographic HUD Gauges */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: "translateZ(65px)", transformStyle: "preserve-3d" }}
        >
          <svg viewBox="0 0 150 150" className="w-[160px] h-[160px] overflow-visible">
            <circle
              cx="75"
              cy="75"
              r="60"
              fill="none"
              stroke="rgba(0, 240, 255, 0.4)"
              strokeWidth="2"
              strokeDasharray="40 20 10 30"
              className="origin-center animate-[spin_20s_linear_infinite]"
            />
            <circle
              cx="75"
              cy="75"
              r="48"
              fill="none"
              stroke="rgba(0, 114, 255, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="20 15 40 10"
              className="origin-center animate-[spin_12s_linear_infinite_reverse]"
            />
            <circle cx="75" cy="75" r="10" fill="rgba(0, 240, 255, 0.2)" stroke="#00F0FF" strokeWidth="2" className="animate-pulse" />
          </svg>
        </div>
      </div>
      
      {/* Dynamic Glow Spotlight behind the graphic */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-radial from-cyan-500/10 via-blue-500/5 to-transparent blur-[60px] -z-10 pointer-events-none" />
    </div>
  );
}
