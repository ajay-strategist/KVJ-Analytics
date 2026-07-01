"use client";

import React from "react";
import { Cpu, GraduationCap, LineChart, Activity } from "lucide-react";

export function AboutHeroVisual() {
  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center animate-[float-slow_7s_ease-in-out_infinite]">
      {/* Projection beam backlights */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00F0FF]/8 via-[#0072FF]/5 to-[#00F0FF]/12 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-15px] w-[80%] h-8 bg-[#00F0FF]/20 rounded-full blur-[10px] transform scale-y-[0.3] pointer-events-none" />

      {/* Floating glassmorphic badges - Strictly using approved words and numbers only */}
      {/* Badge 1: Top-Left (Automation) */}
      <div className="absolute top-2 -left-6 z-20 animate-[float-slow_6s_ease-in-out_infinite] group">
        <div className="bg-[#0A0A0C]/85 backdrop-blur-md border border-[#00F0FF]/25 hover:border-[#00F0FF] px-3 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.12)] transition-all duration-300">
          <div className="p-1 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF]">
            <Cpu className="w-3.5 h-3.5 animate-[spin_5s_linear_infinite]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">Automation</div>
          </div>
        </div>
      </div>

      {/* Badge 2: Top-Right (Alumni) */}
      <div className="absolute top-[18%] -right-6 z-20 animate-[float-slow_5s_ease-in-out_infinite_1s] group">
        <div className="bg-[#0A0A0C]/85 backdrop-blur-md border border-[#0072FF]/25 hover:border-[#0072FF] px-3 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,114,255,0.12)] transition-all duration-300">
          <div className="p-1 rounded-lg bg-[#0072FF]/10 text-[#0072FF]">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">50k+ Trained</div>
          </div>
        </div>
      </div>

      {/* Badge 3: Bottom-Left (Analytics) */}
      <div className="absolute bottom-6 -left-6 z-20 animate-[float-slow_8s_ease-in-out_infinite_2s] group">
        <div className="bg-[#0A0A0C]/85 backdrop-blur-md border border-[#00F0FF]/25 hover:border-[#00F0FF] px-3 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.12)] transition-all duration-300">
          <div className="p-1 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF]">
            <LineChart className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">Analytics</div>
          </div>
        </div>
      </div>

      {/* Badge 4: Bottom-Right (Global Reach) */}
      <div className="absolute bottom-8 -right-6 z-20 animate-[float-slow_7s_ease-in-out_infinite_1.5s] group">
        <div className="bg-[#0A0A0C]/85 backdrop-blur-md border border-[#0072FF]/25 hover:border-[#0072FF] px-3 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,114,255,0.12)] transition-all duration-300">
          <div className="p-1 rounded-lg bg-[#0072FF]/10 text-[#0072FF]">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">6 Regions</div>
          </div>
        </div>
      </div>

      {/* SVG Global Reach & Connections Telemetry */}
      <svg viewBox="0 0 400 400" className="w-full h-full relative z-10 overflow-visible">
        <defs>
          <filter id="cyberGlowVisual" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rotating Telemetry Rings */}
        <circle cx="200" cy="200" r="165" fill="none" stroke="rgba(0, 240, 255, 0.06)" strokeWidth="1" strokeDasharray="5, 8" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(0, 114, 255, 0.04)" strokeWidth="2" strokeDasharray="40, 30" className="animate-[spin_45s_linear_infinite]" style={{ transformOrigin: "200px 200px" }} />
        <circle cx="200" cy="200" r="135" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1.5" strokeDasharray="10, 15" className="animate-[spin_25s_linear_infinite_reverse]" style={{ transformOrigin: "200px 200px" }} />

        {/* Wireframe Globe grid lines */}
        <g stroke="rgba(255,255,255,0.03)" strokeWidth="1.2" fill="none">
          <ellipse cx="200" cy="200" rx="135" ry="40" />
          <ellipse cx="200" cy="200" rx="135" ry="90" />
          <ellipse cx="200" cy="200" rx="40" ry="135" />
          <ellipse cx="200" cy="200" rx="90" ry="135" />
          <line x1="65" y1="200" x2="335" y2="200" />
          <line x1="200" y1="65" x2="200" y2="335" />
        </g>

        {/* Connection Paths & Animated Motion Packets */}
        <g fill="none" strokeWidth="1.5" strokeLinecap="round">
          <path id="path-visual-usa" d="M 200 200 Q 130 160 90 140" stroke="rgba(0, 240, 255, 0.12)" />
          <path id="path-visual-europe" d="M 200 200 Q 160 140 140 100" stroke="rgba(0, 114, 255, 0.12)" />
          <path id="path-visual-uae" d="M 200 200 Q 250 170 290 150" stroke="rgba(0, 240, 255, 0.12)" />
          <path id="path-visual-oman" d="M 200 200 Q 260 210 310 220" stroke="rgba(0, 114, 255, 0.12)" />
          <path id="path-visual-india" d="M 200 200 Q 170 215 150 230" stroke="rgba(0, 240, 255, 0.12)" />
        </g>

        {/* Flowing Data Particles */}
        <circle r="3" fill="#00F0FF" filter="url(#cyberGlowVisual)">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#path-visual-usa" />
          </animateMotion>
        </circle>
        <circle r="3.2" fill="#0072FF" filter="url(#cyberGlowVisual)">
          <animateMotion dur="4s" repeatCount="indefinite" begin="0.8s">
            <mpath href="#path-visual-europe" />
          </animateMotion>
        </circle>
        <circle r="3" fill="#D4AF37" filter="url(#cyberGlowVisual)">
          <animateMotion dur="3.5s" repeatCount="indefinite" begin="0.4s">
            <mpath href="#path-visual-uae" />
          </animateMotion>
        </circle>
        <circle r="2.8" fill="#00F0FF" filter="url(#cyberGlowVisual)">
          <animateMotion dur="4.2s" repeatCount="indefinite" begin="1.2s">
            <mpath href="#path-visual-oman" />
          </animateMotion>
        </circle>
        <circle r="3" fill="#0072FF" filter="url(#cyberGlowVisual)">
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.2s">
            <mpath href="#path-visual-india" />
          </animateMotion>
        </circle>

        {/* Regional Pulse Nodes */}
        {/* USA */}
        <g>
          <circle cx="90" cy="140" r="8" fill="rgba(0, 240, 255, 0.1)" />
          <circle cx="90" cy="140" r="4.5" fill="#00F0FF" className="animate-pulse" />
          <text x="90" y="124" fill="#FFFFFF" fontSize="10" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" opacity="0.85">USA</text>
        </g>
        {/* Europe */}
        <g>
          <circle cx="140" cy="100" r="8" fill="rgba(0, 114, 255, 0.1)" />
          <circle cx="140" cy="100" r="4" fill="#0072FF" />
          <text x="140" y="84" fill="#FFFFFF" fontSize="10" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" opacity="0.85">EUROPE</text>
        </g>
        {/* UAE */}
        <g>
          <circle cx="290" cy="150" r="8" fill="rgba(0, 240, 255, 0.1)" />
          <circle cx="290" cy="150" r="4.5" fill="#00F0FF" className="animate-pulse" />
          <text x="290" y="134" fill="#FFFFFF" fontSize="10" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" opacity="0.85">UAE</text>
        </g>
        {/* Oman */}
        <g>
          <circle cx="310" cy="220" r="8" fill="rgba(0, 114, 255, 0.1)" />
          <circle cx="310" cy="220" r="4" fill="#0072FF" />
          <text x="310" y="204" fill="#FFFFFF" fontSize="10" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" opacity="0.85">OMAN</text>
        </g>
        {/* India */}
        <g>
          <circle cx="150" cy="230" r="8" fill="rgba(0, 240, 255, 0.1)" />
          <circle cx="150" cy="230" r="4" fill="#00F0FF" />
          <text x="138" y="234" fill="#FFFFFF" fontSize="10" fontWeight="bold" letterSpacing="0.05em" textAnchor="end" opacity="0.85">INDIA</text>
        </g>

        {/* Central Operations Hub (Kerala) */}
        <g>
          <circle cx="200" cy="200" r="12" fill="rgba(0, 240, 255, 0.15)" className="animate-ping duration-3000" />
          <circle cx="200" cy="200" r="7" fill="#050505" stroke="#00F0FF" strokeWidth="2.5" />
          <circle cx="200" cy="200" r="2.5" fill="#00F0FF" />
          <text x="216" y="204" fill="#00F0FF" fontSize="10" fontWeight="bold" letterSpacing="0.1em" textAnchor="start">KERALA</text>
        </g>
      </svg>
    </div>
  );
}
