"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// 1. Report Automation: 3D animated gears seamlessly processing a glowing document
function ReportAutomationIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-brand">
      <defs>
        <filter id="neonBlue" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* 3D-angled Document Page */}
      <g transform="rotate(10, 50, 50)">
        <rect x="25" y="20" width="50" height="60" rx="6" fill="rgba(10, 10, 15, 0.6)" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="2" />
        <line x1="35" y1="35" x2="65" y2="35" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="48" x2="55" y2="48" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="61" x2="65" y2="61" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Gear 1 (large, left) */}
      <g transform="translate(30, 68)" className="origin-center animate-[spin_10s_linear_infinite]">
        <circle cx="0" cy="0" r="14" fill="none" stroke="#0072FF" strokeWidth="2" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="-3"
            y="-18"
            width="6"
            height="6"
            fill="#0072FF"
            transform={`rotate(${i * 45}, 0, 0)`}
          />
        ))}
        <circle cx="0" cy="0" r="5" fill="#050505" />
      </g>

      {/* Gear 2 (small, right) */}
      <g transform="translate(68, 48)" className="origin-center animate-[spin_6s_linear_infinite_reverse]">
        <circle cx="0" cy="0" r="10" fill="none" stroke="#00F0FF" strokeWidth="1.8" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x="-2"
            y="-13"
            width="4"
            height="4"
            fill="#00F0FF"
            transform={`rotate(${i * 60}, 0, 0)`}
          />
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#050505" />
      </g>

      {/* Floating glowing data processing particles */}
      <circle cx="48" cy="40" r="2.5" fill="#00F0FF" filter="url(#neonBlue)" className="animate-[ping_2s_infinite]" />
      <circle cx="58" cy="55" r="2" fill="#0072FF" className="animate-[pulse_1.5s_infinite]" />
    </svg>
  );
}

// 2. Data Visualization: Interactive, glowing 3D bar charts and holographic pie charts
function DataVisIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-brand">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0072FF" />
        </linearGradient>
      </defs>

      {/* Holographic Pie Outline (Isometric) */}
      <g transform="translate(50, 32) scale(1, 0.45)">
        <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.5" />
        <path d="M 0 0 L 26 15 A 30 30 0 0 0 0 -30 Z" fill="rgba(0, 240, 255, 0.15)" stroke="#00F0FF" strokeWidth="1.5" />
        {/* Scan line */}
        <line x1="0" y1="0" x2="-21" y2="21" stroke="#0072FF" strokeWidth="2" className="origin-center animate-[spin_8s_linear_infinite]" />
      </g>

      {/* 3D Bar Columns */}
      <g transform="translate(18, 55)">
        {/* Column 1 */}
        <g transform="translate(0, 20)">
          {/* Top cover */}
          <polygon points="0,-12 8,-16 16,-12 8,-8" fill="#80FAFF" />
          {/* Left wall */}
          <polygon points="0,-12 8,-8 8,10 0,6" fill="rgba(0, 114, 255, 0.8)" />
          {/* Right wall */}
          <polygon points="8,-8 16,-12 16,6 8,10" fill="url(#barGrad)" />
        </g>
        
        {/* Column 2 */}
        <g transform="translate(22, 5)" className="animate-[bounce_3s_ease-in-out_infinite_0.4s]">
          <polygon points="0,-22 8,-26 16,-22 8,-18" fill="#80FAFF" />
          <polygon points="0,-22 8,-18 8,25 0,21" fill="rgba(0, 114, 255, 0.85)" />
          <polygon points="8,-18 16,-22 16,21 8,25" fill="url(#barGrad)" />
        </g>

        {/* Column 3 */}
        <g transform="translate(44, 12)" className="animate-[bounce_2.5s_ease-in-out_infinite_0.8s]">
          <polygon points="0,-16 8,-20 16,-16 8,-12" fill="#80FAFF" />
          <polygon points="0,-16 8,-12 8,18 0,14" fill="rgba(0, 114, 255, 0.8)" />
          <polygon points="8,-12 16,-16 16,14 8,18" fill="url(#barGrad)" />
        </g>
      </g>
    </svg>
  );
}

// 3. Spreadsheet Consulting: Futuristic, neon-lit Excel-like grid with actively pulsing cells
function SpreadsheetIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#0072FF]">
      {/* 3D Perspective Grid */}
      <g transform="translate(50, 48) rotate(-15) scale(1, 0.6)">
        {/* Borders */}
        <rect x="-35" y="-35" width="70" height="70" rx="4" fill="none" stroke="rgba(0, 114, 255, 0.3)" strokeWidth="2.5" />
        
        {/* Grid lines */}
        <line x1="-35" y1="-12" x2="35" y2="-12" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.5" />
        <line x1="-35" y1="12" x2="35" y2="12" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.5" />
        
        <line x1="-12" y1="-35" x2="-12" y2="35" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.5" />
        <line x1="12" y1="-35" x2="12" y2="35" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.5" />

        {/* Pulsing Active Cells */}
        <rect x="-32" y="-32" width="17" height="17" fill="rgba(0, 240, 255, 0.3)" className="animate-[pulse_1.5s_infinite]" />
        <rect x="-9" y="-9" width="18" height="18" fill="rgba(0, 114, 255, 0.45)" className="animate-[pulse_2s_infinite_0.4s]" />
        <rect x="14" y="14" width="18" height="18" fill="rgba(0, 240, 255, 0.35)" className="animate-[pulse_1.7s_infinite_0.8s]" />

        {/* Highlight Active Outline */}
        <rect x="-9" y="-9" width="18" height="18" fill="none" stroke="#00F0FF" strokeWidth="2" className="animate-[ping_3s_infinite]" />
      </g>
    </svg>
  );
}

// 4. Process Automation: Interconnected glowing tech-nodes lighting up in sequential workflow
function ProcessAutomationIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#00F0FF]">
      {/* Curved flow paths */}
      <path d="M 20 50 Q 35 25, 50 50 T 80 50" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="2.5" />
      <path d="M 20 50 Q 35 75, 50 50 T 80 50" fill="none" stroke="rgba(0, 114, 255, 0.15)" strokeWidth="2" />

      {/* Central flow loop particle animation */}
      <circle r="4" fill="#00F0FF" filter="url(#neonBlue)">
        <animateMotion dur="4s" repeatCount="indefinite" path="M 20 50 Q 35 25, 50 50 T 80 50" />
      </circle>
      <circle r="3" fill="#0072FF">
        <animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M 20 50 Q 35 75, 50 50 T 80 50" />
      </circle>

      {/* Nodes */}
      {/* Node 1: Left */}
      <g>
        <circle cx="20" cy="50" r="10" fill="#050505" stroke="#00F0FF" strokeWidth="2" />
        <circle cx="20" cy="50" r="4.5" fill="#00F0FF" className="animate-[pulse_1.5s_infinite_0.2s]" />
      </g>

      {/* Node 2: Center */}
      <g>
        <circle cx="50" cy="50" r="11" fill="#050505" stroke="#0072FF" strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill="#0072FF" className="animate-[pulse_1.5s_infinite_0.6s]" />
      </g>

      {/* Node 3: Right */}
      <g>
        <circle cx="80" cy="50" r="10" fill="#050505" stroke="#00F0FF" strokeWidth="2" />
        <circle cx="80" cy="50" r="4.5" fill="#00F0FF" className="animate-[pulse_1.5s_infinite_1s]" />
      </g>
    </svg>
  );
}

// 5. Educational Solutions/Training: Stylized, glowing neon graduation cap integrated with data analytics symbols
function EducationalIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-brand">
      {/* Data Analytics line chart path behind/underneath the cap */}
      <path
        d="M 15 75 Q 35 60, 50 78 T 85 45"
        fill="none"
        stroke="rgba(0, 114, 255, 0.25)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 15 75 Q 35 60, 50 78 T 85 45"
        fill="none"
        stroke="#0072FF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="140"
        strokeDashoffset="140"
        className="animate-[dash_4s_linear_infinite]"
        style={{ strokeDashoffset: 0 }}
      />
      
      {/* Data nodes on graph */}
      <circle cx="50" cy="78" r="3.5" fill="#0072FF" />
      <circle cx="85" cy="45" r="3.5" fill="#00F0FF" className="animate-pulse" />

      {/* Glowing Neon Graduation Cap */}
      <g className="animate-[float-slow_4.5s_ease-in-out_infinite]">
        {/* Cap Diamond */}
        <polygon points="50,15 85,28 50,41 15,28" fill="#050505" stroke="#00F0FF" strokeWidth="2.5" />
        
        {/* Cap Base */}
        <path d="M 30 35 L 30 52 Q 50 62, 70 52 L 70 35" fill="none" stroke="#0072FF" strokeWidth="2" />
        
        {/* Tassel */}
        <path d="M 85 28 L 85 46 Q 82 50, 80 50" fill="none" stroke="#00F0FF" strokeWidth="1.5" />
        <circle cx="80" cy="50" r="2.5" fill="#00F0FF" />
      </g>
    </svg>
  );
}

const ICONS: Record<string, React.ComponentType> = {
  report: ReportAutomationIcon,
  visualization: DataVisIcon,
  spreadsheet: SpreadsheetIcon,
  process: ProcessAutomationIcon,
  education: EducationalIcon,
};

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  iconName: "report" | "visualization" | "spreadsheet" | "process" | "education";
  accentColor?: "cyan" | "blue";
  tag: string;
  delay?: number;
}

export function ServiceCard({
  title,
  description,
  href,
  iconName,
  accentColor = "cyan",
  tag,
  delay = 0,
}: ServiceCardProps) {
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
    const maxTilt = 8; // gentle premium tilt
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

  const IconComponent = ICONS[iconName] || DataVisIcon;

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
      <Link
        href={href}
        className="block h-full transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.025 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div 
          className="relative h-full flex flex-col justify-between p-8 rounded-[24px] bg-[#0A0A0C]/70 backdrop-blur-[24px] border border-white/5 overflow-hidden transition-all duration-500"
          style={{
            borderColor: isHovered 
              ? "rgba(0, 114, 255, 0.55)" // Electric blue glowing border on hover
              : "rgba(255, 255, 255, 0.05)",
            boxShadow: isHovered
              ? "0 15px 45px rgba(0, 114, 255, 0.16)"
              : "none",
          }}
        >
          {/* Inner Glow Gradient tracking cursor coordinates */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 114, 255, 0.14), transparent 80%)`,
              }}
            />
          )}

          {/* Icon Container with slight float */}
          <div 
            className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
            style={{
              transform: isHovered ? "translateZ(30px)" : "translateZ(0)",
            }}
          >
            <IconComponent />
          </div>

          <div
            style={{
              transform: isHovered ? "translateZ(20px)" : "translateZ(0)",
              transition: "transform 0.3s ease-out",
            }}
            className="mt-8 flex-grow text-left"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-500">
              {tag}
            </span>
            <h3 
              className="text-xl font-bold mt-2 mb-3 text-white transition-colors duration-300"
              style={{
                color: isHovered ? "#00F0FF" : "#FFFFFF",
              }}
            >
              {title}
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              {description}
            </p>
          </div>

          <div
            className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-300 text-slate-400 group-hover:text-brand"
            style={{
              color: isHovered ? "#00F0FF" : "#9CA3AF",
              transform: isHovered ? "translateZ(25px)" : "translateZ(0)",
            }}
          >
            <span>Learn More</span>
            <ArrowRight 
              className="w-4 h-4 transition-transform duration-300" 
              style={{
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
              }}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
