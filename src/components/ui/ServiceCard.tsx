"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ==========================================
// 1. CORPORATE SERVICE ICONS
// ==========================================

// Report Automation: 3D animated document passing through neon gears
function CorpReportIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#00F0FF]">
      <g transform="rotate(8, 50, 50)" className="animate-[pulse_3s_ease-in-out_infinite]">
        <rect x="25" y="15" width="50" height="70" rx="6" fill="rgba(5, 5, 5, 0.75)" stroke="#00F0FF" strokeWidth="2.2" />
        <line x1="35" y1="30" x2="65" y2="30" stroke="rgba(0, 240, 255, 0.8)" strokeWidth="3" strokeLinecap="round" />
        <line x1="35" y1="45" x2="55" y2="45" stroke="rgba(0, 240, 255, 0.8)" strokeWidth="3" strokeLinecap="round" />
        <line x1="35" y1="60" x2="65" y2="60" stroke="rgba(0, 240, 255, 0.8)" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform="translate(30, 74)" className="origin-center animate-[spin_10s_linear_infinite]">
        <circle cx="0" cy="0" r="14" fill="none" stroke="#0072FF" strokeWidth="2" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-2.5" y="-17" width="5" height="5" fill="#0072FF" transform={`rotate(${i * 45}, 0, 0)`} />
        ))}
        <circle cx="0" cy="0" r="4" fill="#050505" />
      </g>
      <g transform="translate(70, 48)" className="origin-center animate-[spin_6s_linear_infinite_reverse]">
        <circle cx="0" cy="0" r="10" fill="none" stroke="#00F0FF" strokeWidth="1.8" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x="-2" y="-13" width="4" height="4" fill="#00F0FF" transform={`rotate(${i * 60}, 0, 0)`} />
        ))}
        <circle cx="0" cy="0" r="3" fill="#050505" />
      </g>
    </svg>
  );
}

// Data Visualization: 3D holographic Power BI-style dashboard with rising charts
function CorpVisIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#00F0FF]">
      <g transform="translate(50, 28) scale(1, 0.45)">
        <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="2" />
        <path d="M 0 0 L 24 14 A 28 28 0 0 0 0 -28 Z" fill="rgba(0, 240, 255, 0.2)" stroke="#00F0FF" strokeWidth="2" />
        <line x1="0" y1="0" x2="-20" y2="20" stroke="#0072FF" strokeWidth="2.5" className="origin-center animate-[spin_8s_linear_infinite]" />
      </g>
      <g transform="translate(18, 50)">
        <g transform="translate(0, 20)" className="animate-[bounce_3s_ease-in-out_infinite]">
          <polygon points="0,-12 8,-16 16,-12 8,-8" fill="#80FAFF" />
          <polygon points="0,-12 8,-8 8,12 0,8" fill="rgba(0, 114, 255, 0.8)" />
          <polygon points="8,-8 16,-12 16,8 8,12" fill="rgba(0, 240, 255, 0.85)" />
        </g>
        <g transform="translate(22, 5)" className="animate-[bounce_3s_ease-in-out_infinite_0.4s]">
          <polygon points="0,-22 8,-26 16,-22 8,-18" fill="#80FAFF" />
          <polygon points="0,-22 8,-18 8,27 0,23" fill="rgba(0, 114, 255, 0.85)" />
          <polygon points="8,-18 16,-22 16,23 8,27" fill="rgba(0, 240, 255, 0.9)" />
        </g>
        <g transform="translate(44, 12)" className="animate-[bounce_2.5s_ease-in-out_infinite_0.8s]">
          <polygon points="0,-16 8,-20 16,-16 8,-12" fill="#80FAFF" />
          <polygon points="0,-16 8,-12 8,20 0,16" fill="rgba(0, 114, 255, 0.75)" />
          <polygon points="8,-12 16,-16 16,16 8,20" fill="rgba(0, 240, 255, 0.8)" />
        </g>
      </g>
    </svg>
  );
}

// Spreadsheet Consulting: Animated Excel-style grid with pulsing calculation nodes
function CorpSpreadsheetIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#0072FF]">
      <g transform="translate(50, 48) rotate(-15) scale(1, 0.6)">
        <rect x="-35" y="-35" width="70" height="70" rx="6" fill="rgba(5, 5, 5, 0.7)" stroke="rgba(0, 114, 255, 0.4)" strokeWidth="2.5" />
        <line x1="-35" y1="-12" x2="35" y2="-12" stroke="rgba(0, 114, 255, 0.25)" strokeWidth="1.5" />
        <line x1="-35" y1="12" x2="35" y2="12" stroke="rgba(0, 114, 255, 0.25)" strokeWidth="1.5" />
        <line x1="-12" y1="-35" x2="-12" y2="35" stroke="rgba(0, 114, 255, 0.25)" strokeWidth="1.5" />
        <line x1="12" y1="-35" x2="12" y2="35" stroke="rgba(0, 114, 255, 0.25)" strokeWidth="1.5" />
        
        <rect x="-32" y="-32" width="18" height="18" fill="rgba(0, 240, 255, 0.35)" className="animate-[pulse_1.5s_infinite]" />
        <rect x="-9" y="-9" width="18" height="18" fill="rgba(0, 114, 255, 0.5)" className="animate-[pulse_2s_infinite_0.4s]" />
        <rect x="14" y="14" width="18" height="18" fill="rgba(0, 240, 255, 0.4)" className="animate-[pulse_1.7s_infinite_0.8s]" />
        <rect x="-9" y="-9" width="18" height="18" fill="none" stroke="#00F0FF" strokeWidth="2" className="animate-[ping_3s_infinite]" />
      </g>
    </svg>
  );
}

// Dashboard Development: Glowing circular KPI dials that fill up
function CorpDashboardIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#00F0FF]">
      <g transform="translate(50, 50)">
        <circle cx="0" cy="0" r="34" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="6" />
        <circle
          cx="0"
          cy="0"
          r="34"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="6"
          strokeDasharray="213.6"
          strokeDashoffset="60"
          strokeLinecap="round"
          transform="rotate(-90)"
          className="animate-[pulse_2.5s_ease-in-out_infinite]"
        />
        <circle cx="0" cy="0" r="26" fill="none" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="1.5" />
        <line x1="0" y1="0" x2="0" y2="-23" stroke="#0072FF" strokeWidth="2.5" strokeLinecap="round" className="origin-center animate-[spin_5s_ease-in-out_infinite_alternate]" />
        <circle cx="0" cy="0" r="4" fill="#00F0FF" />
      </g>
      <g transform="translate(80, 80) scale(0.4)">
        <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="#0072FF" strokeWidth="6" strokeDasharray="188.4" strokeDashoffset="45" transform="rotate(-90)" />
      </g>
    </svg>
  );
}

// Process Automation: Automated workflow lines sequentially lighting up
function CorpProcessIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#00F0FF]">
      <path d="M 15 50 Q 32 20, 50 50 T 85 50" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="2.5" />
      <path d="M 15 50 Q 32 80, 50 50 T 85 50" fill="none" stroke="rgba(0, 114, 255, 0.15)" strokeWidth="2.5" />
      <circle r="3.5" fill="#00F0FF">
        <animateMotion dur="3.5s" repeatCount="indefinite" path="M 15 50 Q 32 20, 50 50 T 85 50" />
      </circle>
      <circle r="3" fill="#0072FF">
        <animateMotion dur="3.5s" begin="1.75s" repeatCount="indefinite" path="M 15 50 Q 32 80, 50 50 T 85 50" />
      </circle>
      <circle cx="15" cy="50" r="7" fill="#050505" stroke="#00F0FF" strokeWidth="2" className="animate-[pulse_1.5s_infinite_0.1s]" />
      <circle cx="50" cy="50" r="8" fill="#050505" stroke="#0072FF" strokeWidth="2" className="animate-[pulse_1.5s_infinite_0.5s]" />
      <circle cx="85" cy="50" r="7" fill="#050505" stroke="#00F0FF" strokeWidth="2" className="animate-[pulse_1.5s_infinite_0.9s]" />
    </svg>
  );
}

// Corporate Training: Briefcase morphing into an analytics chart
function CorpTrainingIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#0072FF]">
      <g className="animate-[pulse_3s_ease-in-out_infinite]">
        <path
          d="M 25 35 L 75 35 A 4 4 0 0 1 79 39 L 79 75 A 4 4 0 0 1 75 79 L 25 79 A 4 4 0 0 1 21 75 L 21 39 A 4 4 0 0 1 25 35 Z"
          fill="rgba(5, 5, 5, 0.6)"
          stroke="#0072FF"
          strokeWidth="2"
        />
        <path d="M 40 35 L 40 28 A 2 2 0 0 1 42 26 L 58 26 A 2 2 0 0 1 60 28 L 60 35" fill="none" stroke="#00F0FF" strokeWidth="2.2" />
        <g transform="translate(25, 42)">
          <line x1="6" y1="28" x2="6" y2="10" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" className="animate-[bounce_2s_infinite]" />
          <line x1="18" y1="28" x2="18" y2="4" stroke="#0072FF" strokeWidth="2.5" strokeLinecap="round" className="animate-[bounce_2s_infinite_0.3s]" />
          <line x1="30" y1="28" x2="30" y2="16" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" className="animate-[bounce_2s_infinite_0.6s]" />
          <line x1="42" y1="28" x2="42" y2="8" stroke="#0072FF" strokeWidth="2.5" strokeLinecap="round" className="animate-[bounce_2s_infinite_0.9s]" />
        </g>
      </g>
    </svg>
  );
}

// ==========================================
// 2. EDUCATIONAL SERVICE ICONS
// ==========================================

// Training Programs: Interactive workstation with Excel & Power BI screens
function EduTrainingIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#0072FF]">
      <g transform="translate(50, 50) rotate(-10) scale(1, 0.85)">
        <g transform="translate(-20, -14)">
          <rect x="-16" y="-11" width="32" height="22" rx="2" fill="rgba(5, 5, 5, 0.8)" stroke="#22C55E" strokeWidth="2" />
          <line x1="-16" y1="-3" x2="16" y2="-3" stroke="rgba(34, 197, 94, 0.25)" strokeWidth="1" />
          <line x1="-16" y1="3" x2="16" y2="3" stroke="rgba(34, 197, 94, 0.25)" strokeWidth="1" />
          <line x1="-5" y1="-11" x2="-5" y2="11" stroke="rgba(34, 197, 94, 0.25)" strokeWidth="1" />
          <line x1="5" y1="-11" x2="5" y2="11" stroke="rgba(34, 197, 94, 0.25)" strokeWidth="1" />
          <rect x="-4" y="-2.5" width="8" height="5" fill="rgba(34, 197, 94, 0.4)" className="animate-pulse" />
        </g>
        <g transform="translate(20, 10)">
          <rect x="-16" y="-11" width="32" height="22" rx="2" fill="rgba(5, 5, 5, 0.8)" stroke="#00F0FF" strokeWidth="2" />
          <g transform="translate(-10, 5)">
            <rect x="1" y="-12" width="3" height="12" fill="#0072FF" className="animate-[pulse_1.5s_infinite]" />
            <rect x="7" y="-18" width="3" height="18" fill="#00F0FF" className="animate-[pulse_1.8s_infinite_0.3s]" />
            <rect x="13" y="-7" width="3" height="7" fill="#0072FF" className="animate-[pulse_1.2s_infinite_0.6s]" />
          </g>
        </g>
        <path d="M -20 9 L -20 17" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
        <path d="M 20 32 L 20 40" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      </g>
    </svg>
  );
}

// Certification Programs: 3D floating glowing neon metallic badge/certificate
function EduCertIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#FFA751]">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE259" />
          <stop offset="50%" stopColor="#FFA751" />
          <stop offset="100%" stopColor="#FFE259" />
        </linearGradient>
      </defs>
      <g transform="translate(50, 48)" className="origin-center animate-[float-slow_4s_ease-in-out_infinite]">
        <polygon
          points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
          fill="rgba(5, 5, 5, 0.75)"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          className="animate-[spin_12s_linear_infinite]"
        />
        <circle cx="0" cy="0" r="15" fill="rgba(0, 114, 255, 0.2)" stroke="#00F0FF" strokeWidth="1.5" />
        <path d="M -18 -18 L 18 18" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="3" className="animate-[pulse_2s_infinite]" />
        <polygon points="0,-5 1.5,-1 6,-1 2.5,2 4,6 0,3.5 -4,6 -2.5,2 -6,-1 -1.5,-1" fill="#FFA751" />
      </g>
    </svg>
  );
}

// Curriculum Development: Structured learning roadmap showing nodes sequentially lighting up
function EduCurriculumIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#0072FF]">
      <g opacity="0.25">
        <line x1="10" y1="20" x2="90" y2="20" stroke="rgba(0,114,255,0.4)" strokeWidth="0.8" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(0,114,255,0.4)" strokeWidth="0.8" />
        <line x1="10" y1="80" x2="90" y2="80" stroke="rgba(0,114,255,0.4)" strokeWidth="0.8" />
        <line x1="20" y1="10" x2="20" y2="90" stroke="rgba(0,114,255,0.4)" strokeWidth="0.8" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(0,114,255,0.4)" strokeWidth="0.8" />
        <line x1="80" y1="10" x2="80" y2="90" stroke="rgba(0,114,255,0.4)" strokeWidth="0.8" />
      </g>
      <path
        d="M 20 75 Q 50 85, 50 50 T 80 25"
        fill="none"
        stroke="#0072FF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray="100"
        strokeDashoffset="100"
        className="animate-[dash_6s_linear_infinite]"
        style={{ strokeDashoffset: 0 }}
      />
      <g transform="translate(20, 75)">
        <circle cx="0" cy="0" r="7.5" fill="#050505" stroke="#00F0FF" strokeWidth="2" className="animate-[pulse_1.5s_infinite]" />
        <circle cx="0" cy="0" r="3.2" fill="#00F0FF" />
      </g>
      <g transform="translate(50, 50)">
        <circle cx="0" cy="0" r="7.5" fill="#050505" stroke="#0072FF" strokeWidth="2" className="animate-[pulse_1.5s_infinite_0.5s]" />
        <circle cx="0" cy="0" r="3.2" fill="#0072FF" />
      </g>
      <g transform="translate(80, 25)">
        <circle cx="0" cy="0" r="7.5" fill="#050505" stroke="#00F0FF" strokeWidth="2" className="animate-[pulse_1.5s_infinite_1s]" />
        <circle cx="0" cy="0" r="3.2" fill="#00F0FF" />
      </g>
    </svg>
  );
}

// Academic Analytics Solutions: Dashboard showing performance metrics, bar charts rising
function EduAnalyticsIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#00F0FF]">
      <g transform="translate(50, 50) rotate(-10) scale(1, 0.7)">
        <rect x="-35" y="-28" width="70" height="56" rx="4" fill="rgba(5, 5, 5, 0.8)" stroke="#0072FF" strokeWidth="2.5" />
        <g transform="translate(-16, -6)">
          <circle cx="0" cy="0" r="13" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="3"
            strokeDasharray="81.6"
            strokeDashoffset="24"
            strokeLinecap="round"
            transform="rotate(-90)"
            className="animate-[pulse_2s_infinite]"
          />
          <text x="-4.5" y="3.5" fill="#00F0FF" fontSize="9px" fontWeight="bold">A</text>
        </g>
        <g transform="translate(14, 10)">
          <rect x="2" y="-18" width="5" height="18" fill="#0072FF" className="animate-[pulse_1.5s_infinite]" />
          <rect x="10" y="-28" width="5" height="28" fill="#00F0FF" className="animate-[pulse_1.8s_infinite_0.3s]" />
        </g>
      </g>
    </svg>
  );
}

const ICONS: Record<string, React.ComponentType> = {
  // Corporate
  "corp-report": CorpReportIcon,
  "corp-vis": CorpVisIcon,
  "corp-spreadsheet": CorpSpreadsheetIcon,
  "corp-dashboard": CorpDashboardIcon,
  "corp-process": CorpProcessIcon,
  "corp-training": CorpTrainingIcon,
  // Educational
  "edu-training": EduTrainingIcon,
  "edu-cert": EduCertIcon,
  "edu-curriculum": EduCurriculumIcon,
  "edu-analytics": EduAnalyticsIcon,
};

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  iconName: string;
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

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const maxTilt = 8;
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

  const IconComponent = ICONS[iconName] || CorpVisIcon;

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
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <Link
        href={href}
        className="block h-full transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.025 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative h-full flex flex-col justify-between p-8 rounded-[24px] bg-[#050505]/75 backdrop-blur-[24px] border border-white/5 overflow-hidden transition-all duration-500"
          style={{
            boxShadow: isHovered
              ? accentColor === "cyan"
                ? "0 15px 40px rgba(0, 240, 255, 0.12)"
                : "0 15px 40px rgba(0, 114, 255, 0.12)"
              : "none",
          }}
        >
          {/* Cursor-tracking border glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[24px] transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: accentColor === "cyan"
                ? `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.8), transparent 75%)`
                : `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 114, 255, 0.8), transparent 75%)`,
              padding: "1.5px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Icon Container */}
          <div
            className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
            style={{
              transform: isHovered ? "translateZ(30px)" : "translateZ(0)",
              borderColor: isHovered 
                ? accentColor === "cyan" ? "rgba(0, 240, 255, 0.4)" : "rgba(0, 114, 255, 0.4)"
                : "rgba(255, 255, 255, 0.1)",
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
              className="text-xl font-bold mt-2 mb-3 transition-colors duration-300"
              style={{
                color: isHovered 
                  ? accentColor === "cyan" ? "#00F0FF" : "#0072FF"
                  : "#FFFFFF",
              }}
            >
              {title}
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              {description}
            </p>
          </div>

          <div
            className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-300 text-slate-400"
            style={{
              color: isHovered 
                ? accentColor === "cyan" ? "#00F0FF" : "#0072FF"
                : "#9CA3AF",
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
