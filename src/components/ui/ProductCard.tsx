"use client";

import React, { useRef, useState } from "react";
import { ArrowRight, Layers, Cpu, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  name: string;
  tagline: string;
  description: string;
  slug: string;
  keyFeatures: string[];
  isGradeScope: boolean;
  delay?: number;
}

// ────────────────────────────────────────────────────────
// Grade Scope 3D Animated Dashboard Hologram
// ────────────────────────────────────────────────────────
function GradeScopeHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#43F5FF]/40 transition-colors duration-500">
      {/* Projection laser grid glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 bg-brand/5 rounded-full blur-xl pointer-events-none" />
      
      {/* Hologram SVG */}
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        {/* Isometric 3D Dashboard base grid */}
        <g transform="translate(100, 75) rotate(-20) skewX(25) scale(0.9)">
          {/* Base plate */}
          <polygon points="-60,-40 60,-40 60,40 -60,40" fill="none" stroke="rgba(67, 245, 255, 0.25)" strokeWidth="1.5" />
          <polygon points="-50,-30 50,-30 50,30 -50,30" fill="none" stroke="rgba(58, 123, 255, 0.15)" strokeWidth="1" strokeDasharray="3, 2" />
          
          {/* Grid lines */}
          <line x1="-60" y1="-20" x2="60" y2="-20" stroke="rgba(67, 245, 255, 0.08)" strokeWidth="1" />
          <line x1="-60" y1="0" x2="60" y2="0" stroke="rgba(67, 245, 255, 0.08)" strokeWidth="1" />
          <line x1="-60" y1="20" x2="60" y2="20" stroke="rgba(67, 245, 255, 0.08)" strokeWidth="1" />
          <line x1="-40" y1="-40" x2="-40" y2="40" stroke="rgba(67, 245, 255, 0.08)" strokeWidth="1" />
          <line x1="0" y1="-40" x2="0" y2="40" stroke="rgba(67, 245, 255, 0.08)" strokeWidth="1" />
          <line x1="40" y1="-40" x2="40" y2="40" stroke="rgba(67, 245, 255, 0.08)" strokeWidth="1" />

          {/* Dynamic rising bar charts */}
          {/* Bar 1 (Cyan) */}
          <g className="animate-[bar-grow_3.5s_ease-in-out_infinite_0.2s]" style={{ transformOrigin: "-25px 0px" }}>
            <polygon points="-30,0 -20,0 -20,-25 -30,-25" fill="#43F5FF" opacity="0.8" />
            <polygon points="-30,-25 -20,-25 -15,-28 -25,-28" fill="#69FFFF" />
            <polygon points="-20,0 -15,-3 -15,-28 -20,-25" fill="#16E6D8" />
          </g>

          {/* Bar 2 (Blue) */}
          <g className="animate-[bar-grow_3.5s_ease-in-out_infinite_0.8s]" style={{ transformOrigin: "-5px 0px" }}>
            <polygon points="-10,0 0,0 0,-40 -10,-40" fill="#3A7BFF" opacity="0.85" />
            <polygon points="-10,-40 0,-40 5,-43 -5,-43" fill="#69FFFF" />
            <polygon points="0,0 5,-3 5,-43 0,-40" fill="#3A7BFF" />
          </g>

          {/* Bar 3 (Electric Blue) */}
          <g className="animate-[bar-grow_3.5s_ease-in-out_infinite_1.4s]" style={{ transformOrigin: "15px 0px" }}>
            <polygon points="10,0 20,0 20,-30 10,-30" fill="#3A7BFF" opacity="0.8" />
            <polygon points="10,-30 20,-30 25,-33 15,-33" fill="#69FFFF" />
            <polygon points="20,0 25,-3 25,-33 20,-30" fill="#3A7BFF" />
          </g>

          {/* Bar 4 (Cyan) */}
          <g className="animate-[bar-grow_3.5s_ease-in-out_infinite_2s]" style={{ transformOrigin: "35px 0px" }}>
            <polygon points="30,0 40,0 40,-50 30,-50" fill="#43F5FF" opacity="0.85" />
            <polygon points="30,-50 40,-50 45,-53 35,-53" fill="#69FFFF" />
            <polygon points="40,0 45,-3 45,-53 40,-50" fill="#16E6D8" />
          </g>

          {/* Analytics curve lines */}
          <path d="M -45 -10 Q -15 -35 15 -15 T 45 -42" fill="none" stroke="#43F5FF" strokeWidth="1.5" className="animate-pulse" />
          <circle cx="15" cy="-15" r="2.5" fill="#FFFFFF" className="animate-ping" />
          <circle cx="15" cy="-15" r="2" fill="#43F5FF" />
          <circle cx="-15" cy="-25" r="2" fill="#43F5FF" />
          <circle cx="45" cy="-42" r="2" fill="#0A0D13" />
        </g>

        {/* Projection laser streams */}
        <line x1="40" y1="110" x2="100" y2="75" stroke="rgba(67, 245, 255, 0.15)" strokeWidth="0.8" strokeDasharray="3, 3" />
        <line x1="160" y1="110" x2="100" y2="75" stroke="rgba(67, 245, 255, 0.15)" strokeWidth="0.8" strokeDasharray="3, 3" />
        
        {/* Floating status badge */}
        <g className="animate-[float-slow_5s_ease-in-out_infinite]">
          <rect x="25" y="15" width="150" height="20" rx="6" fill="rgba(15, 18, 28, 0.9)" stroke="rgba(67, 245, 255, 0.3)" strokeWidth="1.2" />
          <circle cx="36" cy="25" r="3" fill="#43F5FF" className="animate-pulse" />
          <text x="48" y="28" fill="#FFFFFF" fontSize="8" fontFamily="monospace" letterSpacing="0.1em">GRADESCOPE // ONLINE</text>
          <text x="145" y="28" fill="#43F5FF" fontSize="7" fontFamily="monospace" fontWeight="bold">98.4%</text>
        </g>
      </svg>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Protrix Rotating 3D Neural Microchip Hologram
// ────────────────────────────────────────────────────────
function ProtrixHologram() {
  return (
    <div className="relative w-full h-44 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-line overflow-hidden group-hover:border-[#43F5FF]/40 transition-colors duration-500">
      {/* Projection laser grid glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-corporate/5 via-transparent to-transparent opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 bg-corporate/5 rounded-full blur-xl pointer-events-none" />

      {/* Hologram SVG */}
      <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible relative z-10">
        {/* Isometric 3D Microchip Base */}
        <g transform="translate(100, 80) rotate(-20) skewX(25) scale(0.95)">
          {/* Microchip Body */}
          <polygon points="-40,-40 40,-40 40,40 -40,40" fill="rgba(15, 18, 28, 0.85)" stroke="rgba(58, 123, 255, 0.25)" strokeWidth="2" />
          <polygon points="-32,-32 32,-32 32,32 -32,32" fill="none" stroke="#43F5FF" strokeWidth="1.2" />
          
          {/* Core Processor inside */}
          <polygon points="-16,-16 16,-16 16,16 -16,16" fill="rgba(67, 245, 255, 0.15)" stroke="#43F5FF" strokeWidth="1.5" className="animate-pulse" />
          
          {/* Microchip Pins/Connectors */}
          {/* Left Pins */}
          <line x1="-40" y1="-25" x2="-48" y2="-25" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="-40" y1="-10" x2="-48" y2="-10" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="-40" y1="5" x2="-48" y2="5" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="-40" y1="20" x2="-48" y2="20" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          {/* Right Pins */}
          <line x1="40" y1="-25" x2="48" y2="-25" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="40" y1="-10" x2="48" y2="-10" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="40" y1="5" x2="48" y2="5" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="48" y2="20" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          {/* Top Pins */}
          <line x1="-25" y1="-40" x2="-25" y2="-48" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="-10" y1="-40" x2="-10" y2="-48" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="5" y1="-40" x2="5" y2="-48" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="20" y1="-40" x2="20" y2="-48" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          {/* Bottom Pins */}
          <line x1="-25" y1="40" x2="-25" y2="48" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="-10" y1="40" x2="-10" y2="48" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="5" y1="40" x2="5" y2="48" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
          <line x1="20" y1="40" x2="20" y2="48" stroke="rgba(67, 245, 255, 0.4)" strokeWidth="1.5" />
        </g>

        {/* 3D Neural Nodes rising from Chip center */}
        <g transform="translate(100, 50)" className="animate-[float-slow_6s_ease-in-out_infinite]">
          {/* Rotating orbit */}
          <g className="animate-[spin_10s_linear_infinite]" style={{ transformOrigin: "0px 0px" }}>
            <line x1="0" y1="0" x2="-35" y2="-20" stroke="#3A7BFF" strokeWidth="1.2" strokeDasharray="3, 2" />
            <line x1="0" y1="0" x2="35" y2="-15" stroke="#43F5FF" strokeWidth="1.2" strokeDasharray="3, 2" />
            <line x1="0" y1="0" x2="10" y2="35" stroke="#43F5FF" strokeWidth="1.2" strokeDasharray="3, 2" />

            {/* Orbit Synapse Nodes */}
            <circle cx="-35" cy="-20" r="5.5" fill="rgba(15, 18, 28, 0.85)" stroke="#3A7BFF" strokeWidth="2" />
            <circle cx="-35" cy="-20" r="2.5" fill="#3A7BFF" className="animate-pulse" />
            
            <circle cx="35" cy="-15" r="5.5" fill="rgba(15, 18, 28, 0.85)" stroke="#43F5FF" strokeWidth="2" />
            <circle cx="35" cy="-15" r="2.5" fill="#43F5FF" className="animate-pulse" />
            
            <circle cx="10" cy="35" r="5" fill="rgba(15, 18, 28, 0.85)" stroke="#43F5FF" strokeWidth="1.8" />
            <circle cx="10" cy="35" r="2" fill="#43F5FF" />
          </g>

          {/* Central main core node */}
          <circle cx="0" cy="0" r="8" fill="rgba(15, 18, 28, 0.85)" stroke="#43F5FF" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="3.5" fill="#43F5FF" className="animate-ping" />
          <circle cx="0" cy="0" r="3" fill="#43F5FF" />
        </g>

        {/* Faint rising code/data packets */}
        <g fontSize="6" fontFamily="monospace" fill="#43F5FF" opacity="0.6">
          <text x="35" y="80" className="animate-[fade-up-data_2.5s_linear_infinite]">0110</text>
          <text x="145" y="70" className="animate-[fade-up-data_3s_linear_infinite_1s]">PROTRIX</text>
          <text x="25" y="55" className="animate-[fade-up-data_2s_linear_infinite_0.5s]">OK</text>
        </g>
      </svg>
    </div>
  );
}

export function ProductCard({
  name,
  tagline,
  description,
  slug,
  keyFeatures,
  isGradeScope,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // 3D Parallax Tilt Calculation
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const maxTilt = 10;
    const rotateX = -((y - yc) / yc) * maxTilt;
    const rotateY = ((x - xc) / xc) * maxTilt;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setMousePos({ x: -1000, y: -1000 });
  };

  const Icon = isGradeScope ? Layers : Cpu;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full"
      style={{
        perspective: "1000px",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bar-grow {
          0%, 100% {
            transform: scaleY(0.35);
          }
          50% {
            transform: scaleY(1);
          }
        }
        @keyframes fade-up-data {
          0% {
            transform: translateY(12px);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-24px);
            opacity: 0;
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes rotate-sweep {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .btn-liquid-glow-sweep {
          position: relative;
          overflow: hidden;
          background: #0E1117 !important;
          border: 1px solid rgba(67, 245, 255, 0.25) !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 15px rgba(67, 245, 255, 0.1) !important;
          transition: all 0.3s ease !important;
        }
        .btn-liquid-glow-sweep::before {
          content: "";
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: conic-gradient(from 0deg, transparent 40%, #43F5FF 50%, transparent 60%);
          animation: rotate-sweep 4s linear infinite;
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .btn-liquid-glow-sweep:hover {
          border-color: #43F5FF !important;
          box-shadow: 0 0 25px rgba(67, 245, 255, 0.3) !important;
        }
        .btn-liquid-glow-sweep:hover::before {
          opacity: 1;
        }
        .btn-liquid-glow-sweep > span {
          position: relative;
          z-index: 10;
        }
      `}} />

      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative h-full flex flex-col overflow-hidden p-8 md:p-9 rounded-[24px] bg-glass-card backdrop-blur-[18px] border border-line transition-all duration-500 shadow-soft"
          style={{
            borderColor: isHovered
              ? isGradeScope ? "rgba(67, 245, 255, 0.55)" : "rgba(58, 123, 255, 0.55)"
              : "rgba(60, 255, 255, 0.15)",
            boxShadow: isHovered
              ? isGradeScope 
                ? "0 24px 60px rgba(67, 245, 255, 0.22)" 
                : "0 24px 60px rgba(58, 123, 255, 0.22)"
              : "none",
          }}
        >
          {/* Top accent line */}
          <div className={`absolute inset-x-0 top-0 h-[3px] ${isGradeScope ? "bg-[#43F5FF]" : "bg-[#3A7BFF]"}`} />

          {/* Cursor following glow */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(67, 245, 255, 0.05), transparent 80%)`,
              }}
            />
          )}

          {/* 3D Hologram Projection at the top */}
          {isGradeScope ? <GradeScopeHologram /> : <ProtrixHologram />}

          <div 
            className="relative flex items-center gap-4 mb-6 text-left"
            style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0)", transition: "transform 0.3s ease" }}
          >
            <span className={`grid h-14 w-14 place-items-center rounded-2xl border ${isGradeScope ? "bg-brand/10 border-brand/20 text-brand" : "bg-corporate/10 border-corporate/20 text-corporate"}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 
                className="text-2xl font-bold leading-tight transition-colors duration-300"
                style={{
                  color: isHovered ? (isGradeScope ? "#43F5FF" : "#3A7BFF") : "#FFFFFF",
                }}
              >
                {name}
              </h3>
              <span className="text-[10px] font-semibold text-slate uppercase tracking-[0.18em]">Software Platform</span>
            </div>
          </div>

          <div style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)", transition: "transform 0.3s ease" }} className="flex-grow flex flex-col text-left">
            <p className="relative text-sm font-semibold text-brand mb-4 italic">{tagline}</p>
            <p className="relative text-[15px] text-slate font-light leading-relaxed mb-7">{description}</p>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {keyFeatures.map((feat: string, fIdx: number) => (
                <div key={fIdx} className="flex items-start gap-2.5 rounded-xl border border-line bg-white/5 px-3.5 py-3 transition-colors duration-250 hover:bg-white/10">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isGradeScope ? "text-[#43F5FF]" : "text-[#3A7BFF]"}`} />
                  <span className="text-[12.5px] font-medium text-white leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            href={`/products/${slug}`} 
            variant={isGradeScope ? "education" : "corporate"} 
            className="relative mt-auto w-full group btn-liquid-glow-sweep"
            style={{ transform: isHovered ? "translateZ(25px)" : "translateZ(0)", transition: "transform 0.3s ease" }}
          >
            <span>Request Demo &amp; Details</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
