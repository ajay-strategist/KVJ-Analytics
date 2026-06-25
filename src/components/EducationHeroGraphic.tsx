"use client";

import React from "react";

export default function EducationHeroGraphic() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-visible pointer-events-none select-none">
      <style jsx>{`
        @keyframes floatEdu {
          0%, 100% { transform: translateY(0px) rotateY(-15deg) rotateX(15deg); }
          50% { transform: translateY(-12px) rotateY(15deg) rotateX(10deg); }
        }
        @keyframes pulseGlowEdu {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 114, 255, 0.45)) drop-shadow(0 0 2px rgba(0, 240, 255, 0.2)); }
          50% { filter: drop-shadow(0 0 22px rgba(0, 114, 255, 0.8)) drop-shadow(0 0 5px rgba(0, 240, 255, 0.45)); }
        }
      `}</style>

      {/* 3D Viewport wrapper */}
      <div 
        className="relative w-[440px] h-[340px] origin-center"
        style={{
          transform: "perspective(1000px) rotateY(-15deg) rotateX(15deg)",
          transformStyle: "preserve-3d",
          animation: "floatEdu 10s ease-in-out infinite",
        }}
      >
        {/* Layer 1: Holographic Graduation Cap & Neural Net */}
        <svg
          viewBox="0 0 500 350"
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{
            transform: "translateZ(20px)",
            transformStyle: "preserve-3d",
            animation: "pulseGlowEdu 4s ease-in-out infinite",
          }}
        >
          <defs>
            <filter id="eduGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Neural Network Pathways interwoven */}
          <path d="M 120 220 Q 250 280, 380 220" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1.5" />
          <path d="M 150 240 Q 250 180, 350 240" fill="none" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.5" />
          <path d="M 250 90 L 150 240 M 250 90 L 350 240 M 250 90 L 250 270" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.2" />

          {/* Cap Diamond */}
          <g className="origin-center animate-[spin_30s_linear_infinite]" style={{ transformOrigin: "250px 140px" }}>
            <polygon
              points="250,90 380,140 250,190 120,140"
              fill="rgba(5, 5, 5, 0.65)"
              stroke="#00F0FF"
              strokeWidth="2.5"
              filter="url(#eduGlow)"
            />
            <line x1="250" y1="90" x2="250" y2="190" stroke="rgba(0,240,255,0.3)" strokeWidth="1" />
            <line x1="120" y1="140" x2="380" y2="140" stroke="rgba(0,240,255,0.3)" strokeWidth="1" />
            
            {/* Cap Base */}
            <path
              d="M 180 163 L 180 210 Q 250 240, 320 210 L 320 163"
              fill="none"
              stroke="#0072FF"
              strokeWidth="2"
            />
            
            {/* Tassel */}
            <path
              d="M 380 140 L 395 195 Q 390 205, 385 205"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="1.8"
            />
            <circle cx="385" cy="205" r="3.5" fill="#00F0FF" />
          </g>

          {/* Floating Data Nodes (Neural Network Nodes) */}
          <g>
            <g transform="translate(150, 240)" className="animate-[pulse_1.5s_infinite]">
              <circle cx="0" cy="0" r="7" fill="#050505" stroke="#00F0FF" strokeWidth="2" />
              <circle cx="0" cy="0" r="3" fill="#00F0FF" />
            </g>
            <g transform="translate(350, 240)" className="animate-[pulse_2s_infinite_0.4s]">
              <circle cx="0" cy="0" r="7" fill="#050505" stroke="#0072FF" strokeWidth="2" />
              <circle cx="0" cy="0" r="3" fill="#0072FF" />
            </g>
            <g transform="translate(250, 270)" className="animate-[pulse_1.8s_infinite_0.8s]">
              <circle cx="0" cy="0" r="8" fill="#050505" stroke="#00F0FF" strokeWidth="2" />
              <circle cx="0" cy="0" r="3.5" fill="#00F0FF" />
            </g>
            <g transform="translate(250, 60)" className="animate-[pulse_2.2s_infinite_1.2s]">
              <circle cx="0" cy="0" r="6" fill="#050505" stroke="#0072FF" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="#0072FF" />
            </g>
          </g>

          {/* Data signals traveling along neural paths */}
          <circle r="3" fill="#00F0FF">
            <animateMotion dur="4s" repeatCount="indefinite" path="M 250 90 L 150 240" />
          </circle>
          <circle r="3" fill="#0072FF">
            <animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M 250 90 L 350 240" />
          </circle>
          <circle r="2.5" fill="#00F0FF">
            <animateMotion dur="5s" begin="1s" repeatCount="indefinite" path="M 250 90 L 250 270" />
          </circle>
        </svg>

        {/* Layer 2: Concentric orbiting rings */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
        >
          <svg viewBox="0 0 150 150" className="w-[190px] h-[190px] overflow-visible">
            <circle
              cx="75"
              cy="75"
              r="68"
              fill="none"
              stroke="rgba(0, 114, 255, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="30 25 10 15"
              className="origin-center animate-[spin_25s_linear_infinite]"
            />
            <circle
              cx="75"
              cy="75"
              r="52"
              fill="none"
              stroke="rgba(0, 240, 255, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="15 20 40 10"
              className="origin-center animate-[spin_15s_linear_infinite_reverse]"
            />
          </svg>
        </div>
      </div>
      
      {/* Background radial spotlight */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-radial from-blue-500/10 via-cyan-500/5 to-transparent blur-[60px] -z-10 pointer-events-none" />
    </div>
  );
}
