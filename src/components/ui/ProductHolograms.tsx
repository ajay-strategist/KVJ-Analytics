"use client";

import React from "react";

// 1. Grade Scope - 3D Bar Chart Dashboard (STATIC)
export function GradeScopeHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 bg-[#10B981]/5 rounded-full blur-xl pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 75) rotate(-20) skewX(25) scale(0.9)">
          <polygon points="-60,-40 60,-40 60,40 -60,40" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" />
          <polygon points="-50,-30 50,-30 50,30 -50,30" fill="none" stroke="rgba(13, 148, 136, 0.15)" strokeWidth="1" strokeDasharray="3, 2" />
          <line x1="-60" y1="-20" x2="60" y2="-20" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1" />
          <line x1="-60" y1="0" x2="60" y2="0" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1" />
          <line x1="-60" y1="20" x2="60" y2="20" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1" />
          <g style={{ transformOrigin: "-25px 0px" }}>
            <polygon points="-30,0 -20,0 -20,-25 -30,-25" fill="#10B981" opacity="0.8" />
            <polygon points="-30,-25 -20,-25 -15,-28 -25,-28" fill="#69FFFF" />
            <polygon points="-20,0 -15,-3 -15,-28 -20,-25" fill="#34D399" />
          </g>
          <g style={{ transformOrigin: "-5px 0px" }}>
            <polygon points="-10,0 0,0 0,-40 -10,-40" fill="#0D9488" opacity="0.85" />
            <polygon points="-10,-40 0,-40 5,-43 -5,-43" fill="#69FFFF" />
            <polygon points="0,0 5,-3 5,-43 0,-40" fill="#0D9488" />
          </g>
          <g style={{ transformOrigin: "15px 0px" }}>
            <polygon points="10,0 20,0 20,-30 10,-30" fill="#0D9488" opacity="0.8" />
            <polygon points="10,-30 20,-30 25,-33 15,-33" fill="#69FFFF" />
            <polygon points="20,0 25,-3 25,-33 20,-30" fill="#0D9488" />
          </g>
          <g style={{ transformOrigin: "35px 0px" }}>
            <polygon points="30,0 40,0 40,-50 30,-50" fill="#10B981" opacity="0.85" />
            <polygon points="30,-50 40,-50 45,-53 35,-53" fill="#69FFFF" />
            <polygon points="40,0 45,-3 45,-53 40,-50" fill="#34D399" />
          </g>
          <path d="M -45 -10 Q -15 -35 15 -15 T 45 -42" fill="none" stroke="#10B981" strokeWidth="1.5" />
          <circle cx="15" cy="-15" r="2" fill="#10B981" />
        </g>
        <g>
          <rect x="25" y="15" width="150" height="20" rx="6" fill="rgba(15, 18, 28, 0.9)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.2" />
          <circle cx="36" cy="25" r="3" fill="#10B981" />
          <text x="48" y="28" fill="#FFFFFF" fontSize="8" fontFamily="monospace" letterSpacing="0.1em">GRADESCOPE // ONLINE</text>
        </g>
      </svg>
    </div>
  );
}

// 2. Protrix - Microchip (STATIC)
export function ProtrixHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D9488]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 80) rotate(-20) skewX(25) scale(0.95)">
          <polygon points="-40,-40 40,-40 40,40 -40,40" fill="rgba(15, 18, 28, 0.85)" stroke="rgba(13, 148, 136, 0.25)" strokeWidth="2" />
          <polygon points="-32,-32 32,-32 32,32 -32,32" fill="none" stroke="#10B981" strokeWidth="1.2" />
          <polygon points="-16,-16 16,-16 16,16 -16,16" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="1.5" />
          {/* Pins */}
          <line x1="-40" y1="-20" x2="-48" y2="-20" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
          <line x1="-40" y1="0" x2="-48" y2="0" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
          <line x1="-40" y1="20" x2="-48" y2="20" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
          <line x1="40" y1="-20" x2="48" y2="-20" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
          <line x1="40" y1="0" x2="48" y2="0" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="48" y2="20" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
        </g>
        <g transform="translate(100, 50)">
          <g style={{ transformOrigin: "0px 0px" }}>
            <line x1="0" y1="0" x2="-35" y2="-20" stroke="#0D9488" strokeWidth="1.2" strokeDasharray="3, 2" />
            <line x1="0" y1="0" x2="35" y2="-15" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3, 2" />
            <circle cx="-35" cy="-20" r="5" fill="rgba(15, 18, 28, 0.85)" stroke="#0D9488" strokeWidth="2" />
            <circle cx="35" cy="-15" r="5" fill="rgba(15, 18, 28, 0.85)" stroke="#10B981" strokeWidth="2" />
          </g>
          <circle cx="0" cy="0" r="8" fill="rgba(15, 18, 28, 0.85)" stroke="#10B981" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

// 3. Globe Database (STATIC)
export function GlobeDatabaseHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 60)">
          <circle cx="0" cy="0" r="36" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.2" />
          <ellipse rx="36" ry="12" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1" style={{ transformOrigin: "0px 0px" }} />
          <ellipse rx="12" ry="36" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" style={{ transformOrigin: "0px 0px" }} />
          <circle cx="0" cy="0" r="20" fill="rgba(16, 185, 129, 0.05)" stroke="#10B981" strokeWidth="1.5" />
          <g style={{ transformOrigin: "0px 0px" }}>
            <circle cx="48" cy="0" r="3" fill="#10B981" />
            <circle cx="48" cy="0" r="2" fill="#10B981" />
            <circle cx="-48" cy="0" r="2" fill="#0D9488" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// 4. Security Shield (STATIC)
export function SecurityShieldHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 60)">
          <ellipse rx="50" ry="15" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
          <ellipse rx="35" ry="10" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
          <path d="M -15 -25 L 15 -25 C 15 -25 18 0 15 15 C 11 25 0 30 0 30 C 0 30 -11 25 -15 15 C -18 0 -15 -25 -15 -25 Z" 
            fill="rgba(13, 148, 136, 0.1)" stroke="#10B981" strokeWidth="2.2" />
          <path d="M -6 0 L -2 4 L 6 -4" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28" cy="-18" r="2.5" fill="#10B981" />
          <circle cx="-25" cy="12" r="1.5" fill="#0D9488" />
        </g>
      </svg>
    </div>
  );
}

// 5. Data Pipeline (STATIC)
export function DataPipelineHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D9488]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 60)">
          <path d="M -60 -20 H 60 M -60 20 H 60 M -60 0 H 60" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="2" />
          <circle cx="-40" cy="-20" r="5" fill="#07130E" stroke="#10B981" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="#07130E" stroke="#0D9488" strokeWidth="2.5" />
          <circle cx="40" cy="20" r="5" fill="#07130E" stroke="#10B981" strokeWidth="2" />
          <circle cx="10" cy="-20" r="2.5" fill="#10B981" />
          <circle cx="-25" cy="0" r="2.5" fill="#0D9488" />
          <circle cx="-10" cy="20" r="2.5" fill="#10B981" />
        </g>
      </svg>
    </div>
  );
}

// 6. AI Brain Synapses (STATIC)
export function AIBrainHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 60)">
          <path d="M -25 -15 L -10 -25 L 10 -25 L 25 -15 L 20 10 L 0 20 L -20 10 Z" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.2" />
          <line x1="-10" y1="-25" x2="0" y2="0" stroke="rgba(13, 148, 136, 0.3)" strokeWidth="1" />
          <line x1="10" y1="-25" x2="0" y2="0" stroke="rgba(13, 148, 136, 0.3)" strokeWidth="1" />
          <line x1="25" y1="-15" x2="0" y2="0" stroke="rgba(13, 148, 136, 0.3)" strokeWidth="1" />
          <line x1="-25" y1="-15" x2="0" y2="0" stroke="rgba(13, 148, 136, 0.3)" strokeWidth="1" />
          <line x1="0" y1="20" x2="0" y2="0" stroke="rgba(13, 148, 136, 0.3)" strokeWidth="1" />
          <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.2" />
          <circle cx="-25" cy="-15" r="3" fill="#0D9488" />
          <circle cx="25" cy="-15" r="3" fill="#0D9488" />
          <circle cx="-10" cy="-25" r="3" fill="#10B981" />
          <circle cx="10" cy="-25" r="3" fill="#10B981" />
        </g>
      </svg>
    </div>
  );
}

// 7. Executive Radar (STATIC)
export function ExecutiveRadarHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 60)">
          <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="25" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
          <line x1="-45" y1="0" x2="45" y2="0" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="1" />
          <line x1="0" y1="-45" x2="0" y2="45" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="1" />
          <g style={{ transformOrigin: "0px 0px" }}>
            <polygon points="0,0 35,-20 40,0" fill="url(#radarSweep)" opacity="0.4" />
          </g>
          <circle cx="22" cy="-18" r="2" fill="#10B981" />
          <circle cx="-20" cy="15" r="2" fill="#0D9488" />
        </g>
        <defs>
          <linearGradient id="radarSweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// 8. Financial Donut Chart (STATIC)
export function FinancialDonutHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 60)">
          <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(13, 148, 136, 0.2)" strokeWidth="8" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="120 188" strokeLinecap="round" />
          <circle cx="0" cy="0" r="22" fill="#07130E" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
          <text x="0" y="3" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">64%</text>
        </g>
      </svg>
    </div>
  );
}

// 9. Performance Gauge Dial (STATIC)
export function PerformanceGaugeHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 68)">
          <path d="M -40 0 A 40 40 0 0 1 40 0" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="6" strokeLinecap="round" />
          <path d="M -40 0 A 40 40 0 0 1 20 -34.6" fill="none" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
          <g style={{ transformOrigin: "0px 0px" }}>
            <line x1="0" y1="0" x2="15" y2="-26" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <circle cx="0" cy="0" r="5" fill="#07130E" stroke="#10B981" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

// 10. Predictive Forecast Line (STATIC)
export function PredictiveForecastHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 65)">
          <line x1="-60" y1="0" x2="60" y2="0" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
          <path d="M -60 15 Q -30 -15 0 0 T 60 -30 L 60 -10 T 0 15 Q -30 5 -60 15 Z" fill="rgba(16, 185, 129, 0.08)" />
          <path d="M -60 15 Q -30 -5 0 5" fill="none" stroke="#0D9488" strokeWidth="2.2" />
          <path d="M 0 5 Q 30 15 60 -20" fill="none" stroke="#10B981" strokeWidth="2.2" strokeDasharray="4, 3" />
          <circle cx="0" cy="5" r="3" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

// 11. Tech Ecosystem Constellation (STATIC)
export function TechEcosystemHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 60)">
          <g style={{ transformOrigin: "0px 0px" }}>
            <line x1="-30" y1="-25" x2="30" y2="-25" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
            <line x1="30" y1="-25" x2="40" y2="15" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
            <line x1="40" y1="15" x2="-10" y2="30" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
            <line x1="-10" y1="30" x2="-45" y2="5" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
            <line x1="-45" y1="5" x2="-30" y2="-25" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
            <circle cx="-30" cy="-25" r="5" fill="#07130E" stroke="#10B981" strokeWidth="1.8" />
            <circle cx="30" cy="-25" r="4" fill="#07130E" stroke="#0D9488" strokeWidth="1.5" />
            <circle cx="40" cy="15" r="5" fill="#07130E" stroke="#10B981" strokeWidth="1.8" />
          </g>
          <circle cx="0" cy="0" r="8" fill="#07130E" stroke="#10B981" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="3" fill="#10B981" />
        </g>
      </svg>
    </div>
  );
}

// 12. Time Scheduler Clockwork (STATIC)
export function TimeSchedulerHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#10B981]/40 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D9488]/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        <g transform="translate(100, 60)">
          <circle cx="0" cy="0" r="32" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="2" />
          <circle cx="0" cy="0" r="38" fill="none" stroke="rgba(13, 148, 136, 0.12)" strokeWidth="1.2" strokeDasharray="6, 6" />
          <g style={{ transformOrigin: "0px 0px" }}>
            <line x1="0" y1="0" x2="0" y2="-28" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <g style={{ transformOrigin: "0px 0px" }}>
            <line x1="0" y1="0" x2="20" y2="12" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <circle cx="0" cy="0" r="5" fill="#07130E" stroke="#10B981" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

// Mapping of style identifier to component renderer
export const HOLOGRAM_MAP: Record<string, React.ComponentType> = {
  "grade-scope": GradeScopeHologram,
  "bar-chart": GradeScopeHologram,
  "protrix": ProtrixHologram,
  "microchip": ProtrixHologram,
  "globe-database": GlobeDatabaseHologram,
  "secure-shield": SecurityShieldHologram,
  "data-pipeline": DataPipelineHologram,
  "ai-brain": AIBrainHologram,
  "executive-radar": ExecutiveRadarHologram,
  "financial-donut": FinancialDonutHologram,
  "performance-gauge": PerformanceGaugeHologram,
  "predictive-forecast": PredictiveForecastHologram,
  "tech-ecosystem": TechEcosystemHologram,
  "time-scheduler": TimeSchedulerHologram,
};

export function renderHologram(style: string | undefined, isGradeScopeDefault: boolean) {
  if (style && HOLOGRAM_MAP[style]) {
    const Comp = HOLOGRAM_MAP[style];
    return <Comp />;
  }
  return isGradeScopeDefault ? <GradeScopeHologram /> : <ProtrixHologram />;
}

