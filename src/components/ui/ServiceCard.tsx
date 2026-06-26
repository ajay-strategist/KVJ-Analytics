"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ==========================================
// 1. CORPORATE SERVICE ICONS (uses currentColor)
// ==========================================

function CorpReportIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Document */}
      <g className="animate-[pulse_3s_ease-in-out_infinite]">
        <rect x="22" y="12" width="44" height="58" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="32" y1="28" x2="56" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <line x1="32" y1="38" x2="50" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="32" y1="48" x2="56" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <line x1="32" y1="58" x2="46" y2="58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </g>
      {/* Spinning gear bottom-right */}
      <g transform="translate(68, 70)" className="origin-center animate-[spin_8s_linear_infinite]">
        <circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-2" y="-15" width="4" height="5" fill="currentColor" transform={`rotate(${i * 45}, 0, 0)`} rx="1" opacity="0.8" />
        ))}
        <circle cx="0" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </g>
      {/* Small counter-gear */}
      <g transform="translate(55, 80)" className="origin-center animate-[spin_8s_linear_infinite_reverse]">
        <circle cx="0" cy="0" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x="-1.5" y="-9" width="3" height="4" fill="currentColor" transform={`rotate(${i * 60}, 0, 0)`} rx="0.5" opacity="0.5" />
        ))}
      </g>
    </svg>
  );
}

function CorpVisIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Raw scatter dots on left */}
      {[
        [14, 28], [18, 55], [12, 70], [20, 40], [16, 82],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="currentColor" opacity="0.5"
          className="animate-[pulse_2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      {/* Arrow / flow */}
      <path d="M 28 50 L 42 50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      <polygon points="42,47 47,50 42,53" fill="currentColor" opacity="0.7" />
      {/* Bar chart on right */}
      <g transform="translate(52, 82)">
        <rect x="0" y="-44" width="8" height="44" rx="2" fill="currentColor" opacity="0.75" className="animate-[pulse_2s_ease-in-out_infinite]" />
        <rect x="12" y="-60" width="8" height="60" rx="2" fill="currentColor" opacity="0.9" className="animate-[pulse_2.4s_ease-in-out_infinite_0.3s]" />
        <rect x="24" y="-32" width="8" height="32" rx="2" fill="currentColor" opacity="0.75" className="animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
      </g>
      {/* Baseline */}
      <line x1="50" y1="83" x2="88" y2="83" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function CorpSpreadsheetIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Green X mark (Excel-inspired) */}
      <rect x="18" y="14" width="22" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="25" y="31" fill="currentColor" fontSize="12" fontWeight="bold" fontFamily="monospace">X</text>
      {/* Main grid body */}
      <rect x="14" y="40" width="72" height="48" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Column separators */}
      <line x1="38" y1="40" x2="38" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="62" y1="40" x2="62" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Row separators */}
      <line x1="14" y1="56" x2="86" y2="56" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="14" y1="72" x2="86" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Active cell highlight */}
      <rect x="38" y="56" width="24" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1.2" opacity="0.2"
        className="animate-[pulse_2s_ease-in-out_infinite]" />
      {/* Formula hint */}
      <text x="22" y="18" fill="currentColor" fontSize="6" fontFamily="monospace" opacity="0.6">=SUM</text>
    </svg>
  );
}

function CorpDashboardIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Dashboard frame */}
      <rect x="8" y="14" width="84" height="72" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Top bar */}
      <rect x="8" y="14" width="84" height="12" rx="4" fill="currentColor" opacity="0.15" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="28" cy="20" r="2.5" fill="currentColor" opacity="0.5" />
      {/* Left KPI ring */}
      <g transform="translate(32, 57)">
        <circle cx="0" cy="0" r="18" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.1" />
        <circle cx="0" cy="0" r="18" fill="none" stroke="currentColor" strokeWidth="5"
          strokeDasharray="113" strokeDashoffset="32" strokeLinecap="round"
          transform="rotate(-90)" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
        <text x="-5" y="4" fill="currentColor" fontSize="8" fontWeight="bold">74%</text>
      </g>
      {/* Right sparkline */}
      <polyline points="58,72 64,62 70,68 76,54 82,58 88,48"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="animate-[pulse_3s_ease-in-out_infinite]" />
      <circle cx="88" cy="48" r="3" fill="currentColor" />
    </svg>
  );
}

function CorpAppIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Browser chrome */}
      <rect x="10" y="16" width="80" height="68" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="16" width="80" height="16" rx="4" fill="currentColor" opacity="0.15" />
      {/* Traffic lights */}
      <circle cx="22" cy="24" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="24" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="42" cy="24" r="3" fill="currentColor" opacity="0.5" />
      {/* URL bar */}
      <rect x="50" y="19" width="34" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* Code content */}
      <text x="18" y="52" fill="currentColor" fontSize="9" fontFamily="monospace" className="animate-[pulse_2s_ease-in-out_infinite]">{"<App />"}</text>
      <text x="18" y="64" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.75">{"{ data }"}</text>
      <text x="18" y="76" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.6">{"=> render"}</text>
    </svg>
  );
}

function CorpProcessIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Flow path top */}
      <path d="M 15 35 L 40 35 L 40 50 L 60 50 L 60 35 L 85 35"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      {/* Flow path bottom */}
      <path d="M 15 65 L 85 65"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      {/* Animated dot top path */}
      <circle r="3.5" fill="currentColor">
        <animateMotion dur="3s" repeatCount="indefinite"
          path="M 15 35 L 40 35 L 40 50 L 60 50 L 60 35 L 85 35" />
      </circle>
      {/* Animated dot bottom path */}
      <circle r="3" fill="currentColor" opacity="0.75">
        <animateMotion dur="2.5s" begin="1s" repeatCount="indefinite"
          path="M 15 65 L 85 65" />
      </circle>
      {/* Nodes */}
      <circle cx="15" cy="35" r="7" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[pulse_1.8s_infinite]" />
      <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[pulse_1.8s_infinite_0.5s]" />
      <circle cx="85" cy="35" r="7" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[pulse_1.8s_infinite_1s]" />
      <circle cx="15" cy="65" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="85" cy="65" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-[pulse_2s_infinite_0.8s]" />
    </svg>
  );
}

function CorpTrainingIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Presentation screen */}
      <rect x="20" y="14" width="60" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Chart on screen */}
      <g transform="translate(25, 46)">
        <rect x="4" y="-20" width="7" height="20" rx="1" fill="currentColor" opacity="0.6" className="animate-[pulse_2s_infinite]" />
        <rect x="16" y="-30" width="7" height="30" rx="1" fill="currentColor" opacity="0.9" className="animate-[pulse_2s_infinite_0.3s]" />
        <rect x="28" y="-14" width="7" height="14" rx="1" fill="currentColor" opacity="0.6" className="animate-[pulse_2s_infinite_0.6s]" />
        <rect x="40" y="-26" width="7" height="26" rx="1" fill="currentColor" opacity="0.9" className="animate-[pulse_2s_infinite_0.9s]" />
      </g>
      {/* Podium / stand */}
      <line x1="50" y1="54" x2="50" y2="68" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="36" y1="68" x2="64" y2="68" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      {/* Audience dots */}
      <circle cx="30" cy="82" r="4" fill="currentColor" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="44" cy="82" r="4" fill="currentColor" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="56" cy="82" r="4" fill="currentColor" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="70" cy="82" r="4" fill="currentColor" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

// ==========================================
// 2. EDUCATIONAL SERVICE ICONS (uses currentColor)
// ==========================================

function EduTrainingIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Left monitor — spreadsheet */}
      <rect x="6" y="24" width="38" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="6" y1="33" x2="44" y2="33" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="6" y1="40" x2="44" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="19" y1="24" x2="19" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="31" y1="24" x2="31" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <rect x="19" y="33" width="12" height="7" fill="currentColor" opacity="0.35" className="animate-pulse" />
      {/* Stand */}
      <line x1="25" y1="52" x2="25" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="18" y1="60" x2="32" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {/* Right monitor — bar chart */}
      <rect x="56" y="20" width="38" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <g transform="translate(62, 50)">
        <rect x="0" y="-20" width="5" height="20" rx="1" fill="currentColor" opacity="0.7" className="animate-[pulse_1.5s_infinite]" />
        <rect x="9" y="-28" width="5" height="28" rx="1" fill="currentColor" opacity="0.9" className="animate-[pulse_1.8s_infinite_0.3s]" />
        <rect x="18" y="-12" width="5" height="12" rx="1" fill="currentColor" opacity="0.7" className="animate-[pulse_1.3s_infinite_0.6s]" />
        <rect x="27" y="-22" width="5" height="22" rx="1" fill="currentColor" opacity="0.9" className="animate-[pulse_1.5s_infinite_0.9s]" />
      </g>
      <line x1="56" y1="52" x2="94" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Stand */}
      <line x1="75" y1="52" x2="75" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="68" y1="60" x2="82" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

function EduCertIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Certificate scroll */}
      <rect x="16" y="20" width="68" height="50" rx="5" fill="none"
        stroke="currentColor" strokeWidth="2.2" className="animate-[pulse_3s_ease-in-out_infinite]" />
      {/* Scroll rolls at top & bottom */}
      <ellipse cx="50" cy="20" rx="34" ry="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="50" cy="70" rx="34" ry="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {/* Text lines */}
      <line x1="30" y1="36" x2="70" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="34" y1="44" x2="66" y2="44" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      {/* Star seal */}
      <polygon points="50,50 52.5,57 60,57 54,61.5 56,69 50,64.5 44,69 46,61.5 40,57 47.5,57"
        fill="currentColor" className="animate-[pulse_2s_ease-in-out_infinite]" />
    </svg>
  );
}

function EduCurriculumIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Root node */}
      <circle cx="50" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2.2"
        className="animate-[pulse_2s_ease-in-out_infinite]" />
      <circle cx="50" cy="20" r="4" fill="currentColor" />
      {/* Trunk */}
      <line x1="50" y1="28" x2="50" y2="45" stroke="currentColor" strokeWidth="2" />
      {/* Left branch */}
      <line x1="50" y1="45" x2="28" y2="58" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="28" cy="62" r="7" fill="none" stroke="currentColor" strokeWidth="2"
        className="animate-[pulse_2s_ease-in-out_infinite_0.4s]" />
      <circle cx="28" cy="62" r="3.5" fill="currentColor" />
      {/* Left sub-branches */}
      <line x1="28" y1="69" x2="18" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="18" cy="84" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"
        className="animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
      <line x1="28" y1="69" x2="36" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="36" cy="84" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"
        className="animate-[pulse_2s_ease-in-out_infinite_0.8s]" />
      {/* Right branch */}
      <line x1="50" y1="45" x2="72" y2="58" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="72" cy="62" r="7" fill="none" stroke="currentColor" strokeWidth="2"
        className="animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
      <circle cx="72" cy="62" r="3.5" fill="currentColor" />
      {/* Right sub-branches */}
      <line x1="72" y1="69" x2="62" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="62" cy="84" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"
        className="animate-[pulse_2s_ease-in-out_infinite_1s]" />
      <line x1="72" y1="69" x2="82" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="82" cy="84" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"
        className="animate-[pulse_2s_ease-in-out_infinite_1.2s]" />
    </svg>
  );
}

function EduAnalyticsIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Frame */}
      <rect x="15" y="15" width="70" height="70" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="35" x2="85" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* A+ Circle */}
      <circle cx="36" cy="60" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="30.5" y="65" fill="currentColor" fontSize="13" fontWeight="bold" fontFamily="monospace">A+</text>
      {/* Attendance bars right side */}
      <g transform="translate(60, 80)">
        <rect x="0" y="-36" width="6" height="36" rx="1" fill="currentColor" opacity="0.75" className="animate-[pulse_1.8s_infinite]" />
        <rect x="10" y="-48" width="6" height="48" rx="1" fill="currentColor" opacity="0.9" className="animate-[pulse_2s_infinite_0.3s]" />
        <rect x="20" y="-24" width="6" height="24" rx="1" fill="currentColor" opacity="0.75" className="animate-[pulse_1.6s_infinite_0.6s]" />
      </g>
    </svg>
  );
}

function EduAssessmentIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Clipboard */}
      <rect x="20" y="20" width="60" height="70" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Clipboard top clip */}
      <rect x="36" y="14" width="28" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Question lines */}
      <line x1="32" y1="42" x2="68" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="32" y1="54" x2="68" y2="54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="32" y1="66" x2="60" y2="66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* Animated check marks */}
      <g transform="translate(26, 42)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-[pulse_1.5s_infinite]" />
        <path d="M -2.5 0 L -0.5 2 L 3 -2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <g transform="translate(26, 54)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-[pulse_1.5s_infinite_0.4s]" />
        <path d="M -2.5 0 L -0.5 2 L 3 -2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const ICONS: Record<string, React.ComponentType> = {
  // Compatibility keys
  report: CorpReportIcon,
  visualization: CorpVisIcon,
  spreadsheet: CorpSpreadsheetIcon,
  dashboard: CorpDashboardIcon,
  automation: CorpProcessIcon,
  education: EduTrainingIcon,

  // Corporate specific
  "corp-report": CorpReportIcon,
  "corp-vis": CorpVisIcon,
  "corp-spreadsheet": CorpSpreadsheetIcon,
  "corp-dashboard": CorpDashboardIcon,
  "corp-app": CorpAppIcon,
  "corp-process": CorpProcessIcon,
  "corp-training": CorpTrainingIcon,

  // Educational specific
  "edu-training": EduTrainingIcon,
  "edu-cert": EduCertIcon,
  "edu-curriculum": EduCurriculumIcon,
  "edu-analytics": EduAnalyticsIcon,
  "edu-assessment": EduAssessmentIcon,
};

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  iconName: string;
  accentColor?: "cyan" | "blue";
  tag: string;
  delay?: number;
  variant?: "corporate" | "education" | "dark";
  glow?: boolean;
}

export function ServiceCard({
  title,
  description,
  href,
  iconName,
  accentColor = "cyan",
  tag,
  delay = 0,
  variant = "dark",
  glow = false,
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

  // Determine card styles dynamically based on variant
  let containerClass = "";
  let hoverShadow = "none";
  let borderGlowColor = "";
  let iconContainerBase = "";
  let iconContainerHover = "";
  let tagColorClass = "";
  let titleStyle = {};
  let linkStyle = {};

  if (variant === "corporate") {
    containerClass = "bg-white border-2 border-[#D4AF37]/70 text-[#0F172A]";
    hoverShadow = "0 20px 48px rgba(212, 175, 55, 0.4)";
    borderGlowColor = "rgba(212, 175, 55, 0.9)"; // Gold
    iconContainerBase = "bg-[#0B1F3A] text-[#D4AF37] rounded-full border-2 border-[#D4AF37]/30 shadow-inner";
    iconContainerHover = "bg-[#0B1F3A] text-[#D4AF37] rounded-full border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]";
    tagColorClass = "text-slate-500 font-semibold";
    titleStyle = {
      color: isHovered ? "#D4AF37" : "#0B1F3A",
    };
    linkStyle = {
      color: isHovered ? "#D4AF37" : "#94A3B8",
    };
  } else if (variant === "education") {
    containerClass = "bg-white text-[#0F172A] shadow-[0_4px_24px_rgba(0,240,255,0.03)]";
    hoverShadow = "0 18px 48px rgba(139, 92, 246, 0.2)";
    borderGlowColor = "rgba(139, 92, 246, 0.75)"; // Purple
    iconContainerBase = "bg-[#00F0FF]/5 border border-[#00F0FF]/25 text-[#0096C7]";
    iconContainerHover = "bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.2)]";
    tagColorClass = "text-slate-500 font-semibold";
    titleStyle = {
      color: isHovered ? "#8B5CF6" : "#0096C7",
    };
    linkStyle = {
      color: isHovered ? "#8B5CF6" : "#94A3B8",
    };
  } else {
    // Default dark variant
    containerClass = "bg-[#050505]/75 border border-white/5 text-white";
    hoverShadow = accentColor === "cyan" ? "0 15px 40px rgba(0, 240, 255, 0.12)" : "0 15px 40px rgba(0, 114, 255, 0.12)";
    borderGlowColor = accentColor === "cyan" ? "rgba(0, 240, 255, 0.6)" : "rgba(0, 114, 255, 0.6)";
    iconContainerBase = "bg-white/5 border border-white/10 text-white";
    iconContainerHover = accentColor === "cyan" ? "bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]" : "bg-[#0072FF]/10 border-[#0072FF] text-[#0072FF]";
    tagColorClass = "text-slate-500";
    titleStyle = {
      color: isHovered 
        ? accentColor === "cyan" ? "#00F0FF" : "#0072FF"
        : "#FFFFFF",
    };
    linkStyle = {
      color: isHovered 
        ? accentColor === "cyan" ? "#00F0FF" : "#0072FF"
        : "#9CA3AF",
    };
  }

  // Set card styling overrides (for gradients, glow, etc.)
  let cardInnerStyle: React.CSSProperties = {
    boxShadow: isHovered ? hoverShadow : (glow ? "0 0 28px rgba(212, 175, 55, 0.55)" : "none"),
  };

  if (variant === "education") {
    cardInnerStyle = {
      ...cardInnerStyle,
      background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #00F0FF, #8B5CF6) border-box",
      border: "2.5px solid transparent",
    };
  }

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
          className={`relative h-full flex flex-col justify-between p-8 rounded-[24px] overflow-hidden transition-all duration-500 ${containerClass}`}
          style={cardInnerStyle}
        >
          {/* Cursor-tracking border glow */}
          {variant !== "education" && (
            <div
              className="absolute inset-0 pointer-events-none rounded-[24px] transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, ${borderGlowColor}, transparent 75%)`,
                padding: "1.5px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
          )}

          {/* Icon Container */}
          <div
            className={`w-16 h-16 ${variant === "corporate" ? "rounded-full" : "rounded-2xl"} flex items-center justify-center transition-all duration-300 ${
              isHovered ? iconContainerHover : iconContainerBase
            }`}
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
            <span className={`text-[10px] uppercase font-bold tracking-[0.25em] ${tagColorClass}`}>
              {tag}
            </span>
            <h3
              className="text-xl font-bold mt-2 mb-3 transition-colors duration-300 font-display"
              style={titleStyle}
            >
              {title}
            </h3>
            <p className={`text-sm font-light leading-relaxed ${variant === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              {description}
            </p>
          </div>

          <div
            className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-300"
            style={{
              ...linkStyle,
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
