"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ==========================================
// 1. CORPORATE SERVICE ICONS (STATIC)
// ==========================================

// Report Automation: Document with gears and auto-generated lines
function CorpReportIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Document */}
      <g>
        <rect x="22" y="12" width="44" height="58" rx="5" fill="rgba(5,5,5,0.8)" stroke="#10B981" strokeWidth="2" />
        <line x1="32" y1="28" x2="56" y2="28" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <line x1="32" y1="38" x2="50" y2="38" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="32" y1="48" x2="56" y2="48" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <line x1="32" y1="58" x2="46" y2="58" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </g>
      {/* Static gear bottom-right */}
      <g transform="translate(68, 70)" className="origin-center">
        <circle cx="0" cy="0" r="12" fill="none" stroke="#0D9488" strokeWidth="2" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-2" y="-15" width="4" height="5" fill="#0D9488" transform={`rotate(${i * 45}, 0, 0)`} rx="1" />
        ))}
        <circle cx="0" cy="0" r="4" fill="#050505" stroke="#0D9488" strokeWidth="1.5" />
      </g>
      {/* Static counter-gear */}
      <g transform="translate(55, 80)" className="origin-center">
        <circle cx="0" cy="0" r="7" fill="none" stroke="#10B981" strokeWidth="1.5" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x="-1.5" y="-9" width="3" height="4" fill="#10B981" transform={`rotate(${i * 60}, 0, 0)`} rx="0.5" />
        ))}
        <circle cx="0" cy="0" r="2.5" fill="#050505" />
      </g>
    </svg>
  );
}

// Data Visualization: Raw data points flowing into a clean chart
function CorpVisIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Raw scatter dots on left */}
      {[
        [14, 28], [18, 55], [12, 70], [20, 40], [16, 82],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#0D9488" opacity="0.6" />
      ))}
      {/* Arrow / flow */}
      <path d="M 28 50 L 42 50" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      <polygon points="42,47 47,50 42,53" fill="#10B981" opacity="0.7" />
      {/* Bar chart on right */}
      <g transform="translate(52, 82)">
        <rect x="0" y="-44" width="8" height="44" rx="2" fill="rgba(13,148,136,0.7)" />
        <rect x="12" y="-60" width="8" height="60" rx="2" fill="rgba(16,185,129,0.85)" />
        <rect x="24" y="-32" width="8" height="32" rx="2" fill="rgba(13,148,136,0.7)" />
      </g>
      {/* Baseline */}
      <line x1="50" y1="83" x2="88" y2="83" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
    </svg>
  );
}

// Spreadsheet Consulting: Excel-style grid with glowing formula bar
function CorpSpreadsheetIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Green X mark (Excel-inspired) */}
      <rect x="18" y="14" width="22" height="26" rx="3" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" />
      <text x="25" y="31" fill="#22C55E" fontSize="12" fontWeight="bold" fontFamily="monospace">X</text>
      {/* Main grid body */}
      <rect x="14" y="40" width="72" height="48" rx="4" fill="rgba(5,5,5,0.75)" stroke="#0D9488" strokeWidth="2" />
      {/* Column separators */}
      <line x1="38" y1="40" x2="38" y2="88" stroke="rgba(13,148,136,0.3)" strokeWidth="1" />
      <line x1="62" y1="40" x2="62" y2="88" stroke="rgba(13,148,136,0.3)" strokeWidth="1" />
      {/* Row separators */}
      <line x1="14" y1="56" x2="86" y2="56" stroke="rgba(13,148,136,0.3)" strokeWidth="1" />
      <line x1="14" y1="72" x2="86" y2="72" stroke="rgba(13,148,136,0.3)" strokeWidth="1" />
      {/* Active cell highlight */}
      <rect x="38" y="56" width="24" height="16" fill="rgba(16,185,129,0.12)" stroke="#10B981" strokeWidth="1.2" />
      {/* Formula hint */}
      <text x="22" y="18" fill="#10B981" fontSize="6" fontFamily="monospace" opacity="0.6">=SUM</text>
    </svg>
  );
}

// Dashboard Development: Multi-panel BI dashboard with KPI ring + mini charts
function CorpDashboardIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Dashboard frame */}
      <rect x="8" y="14" width="84" height="72" rx="6" fill="rgba(5,5,5,0.8)" stroke="#10B981" strokeWidth="2" />
      {/* Top bar */}
      <rect x="8" y="14" width="84" height="12" rx="4" fill="rgba(13,148,136,0.15)" />
      <circle cx="20" cy="20" r="2.5" fill="#10B981" opacity="0.7" />
      <circle cx="28" cy="20" r="2.5" fill="#0D9488" opacity="0.5" />
      {/* Left KPI ring */}
      <g transform="translate(32, 57)">
        <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="0" cy="0" r="18" fill="none" stroke="#10B981" strokeWidth="5"
          strokeDasharray="113" strokeDashoffset="32" strokeLinecap="round"
          transform="rotate(-90)" />
        <text x="-5" y="4" fill="#10B981" fontSize="8" fontWeight="bold">74%</text>
      </g>
      {/* Right sparkline */}
      <polyline points="58,72 64,62 70,68 76,54 82,58 88,48"
        fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="88" cy="48" r="3" fill="#0D9488" />
    </svg>
  );
}

// App Development: Browser window with code tags
function CorpAppIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Browser chrome */}
      <rect x="10" y="16" width="80" height="68" rx="6" fill="rgba(5,5,5,0.8)" stroke="#10B981" strokeWidth="2" />
      <rect x="10" y="16" width="80" height="16" rx="4" fill="rgba(13,148,136,0.2)" />
      {/* Traffic lights */}
      <circle cx="22" cy="24" r="3" fill="#EF4444" />
      <circle cx="32" cy="24" r="3" fill="#FBBF24" />
      <circle cx="42" cy="24" r="3" fill="#22C55E" />
      {/* URL bar */}
      <rect x="50" y="19" width="34" height="10" rx="3" fill="rgba(255,255,255,0.06)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      {/* Code content */}
      <text x="18" y="52" fill="#10B981" fontSize="9" fontFamily="monospace">{"<App />"}</text>
      <text x="18" y="64" fill="#0D9488" fontSize="9" fontFamily="monospace" opacity="0.75">{"{ data }"}</text>
      <text x="18" y="76" fill="#22C55E" fontSize="9" fontFamily="monospace" opacity="0.6">{"=> render"}</text>
    </svg>
  );
}

// Process Automation: Workflow nodes connected by static lines
function CorpProcessIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Flow path top */}
      <path d="M 15 35 L 40 35 L 40 50 L 60 50 L 60 35 L 85 35"
        fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="2" strokeLinecap="round" />
      {/* Flow path bottom */}
      <path d="M 15 65 L 85 65"
        fill="none" stroke="rgba(13,148,136,0.4)" strokeWidth="2" strokeLinecap="round" />
      {/* Static dots */}
      <circle cx="50" cy="50" r="3.5" fill="#10B981" />
      <circle cx="50" cy="65" r="3" fill="#0D9488" />
      {/* Nodes */}
      <circle cx="15" cy="35" r="7" fill="#050505" stroke="#10B981" strokeWidth="2" />
      <circle cx="50" cy="50" r="8" fill="#050505" stroke="#0D9488" strokeWidth="2" />
      <circle cx="85" cy="35" r="7" fill="#050505" stroke="#10B981" strokeWidth="2" />
      <circle cx="15" cy="65" r="6" fill="#050505" stroke="#0D9488" strokeWidth="1.5" />
      <circle cx="85" cy="65" r="6" fill="#050505" stroke="#0D9488" strokeWidth="1.5" />
    </svg>
  );
}

// Corporate Training: Presenter at a screen delivering analytics training
function CorpTrainingIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Presentation screen */}
      <rect x="20" y="14" width="60" height="40" rx="4" fill="rgba(5,5,5,0.8)" stroke="#0D9488" strokeWidth="2" />
      {/* Chart on screen */}
      <g transform="translate(25, 46)">
        <rect x="4" y="-20" width="7" height="20" rx="1" fill="rgba(16,185,129,0.7)" />
        <rect x="16" y="-30" width="7" height="30" rx="1" fill="rgba(13,148,136,0.8)" />
        <rect x="28" y="-14" width="7" height="14" rx="1" fill="rgba(16,185,129,0.7)" />
        <rect x="40" y="-26" width="7" height="26" rx="1" fill="rgba(13,148,136,0.8)" />
      </g>
      {/* Podium / stand */}
      <line x1="50" y1="54" x2="50" y2="68" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <line x1="36" y1="68" x2="64" y2="68" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {/* Audience dots */}
      <circle cx="30" cy="82" r="4" fill="rgba(13,148,136,0.4)" stroke="#0D9488" strokeWidth="1.5" />
      <circle cx="44" cy="82" r="4" fill="rgba(13,148,136,0.4)" stroke="#0D9488" strokeWidth="1.5" />
      <circle cx="56" cy="82" r="4" fill="rgba(13,148,136,0.4)" stroke="#0D9488" strokeWidth="1.5" />
      <circle cx="70" cy="82" r="4" fill="rgba(13,148,136,0.4)" stroke="#0D9488" strokeWidth="1.5" />
    </svg>
  );
}

// ==========================================
// 2. EDUCATIONAL SERVICE ICONS (STATIC)
// ==========================================

// Training Programs: Dual monitors — Excel grid + Power BI bar chart
function EduTrainingIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Left monitor — spreadsheet */}
      <rect x="6" y="24" width="38" height="28" rx="3" fill="rgba(15,18,28,0.72)" stroke="#28E79E" strokeWidth="1.8" />
      <line x1="6" y1="33" x2="44" y2="33" stroke="rgba(40,231,158,0.25)" strokeWidth="1" />
      <line x1="6" y1="40" x2="44" y2="40" stroke="rgba(40,231,158,0.25)" strokeWidth="1" />
      <line x1="19" y1="24" x2="19" y2="52" stroke="rgba(40,231,158,0.25)" strokeWidth="1" />
      <line x1="31" y1="24" x2="31" y2="52" stroke="rgba(40,231,158,0.25)" strokeWidth="1" />
      <rect x="19" y="33" width="12" height="7" fill="rgba(40,231,158,0.35)" />
      {/* Stand */}
      <line x1="25" y1="52" x2="25" y2="60" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <line x1="18" y1="60" x2="32" y2="60" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      {/* Right monitor — bar chart */}
      <rect x="56" y="20" width="38" height="32" rx="3" fill="rgba(15,18,28,0.72)" stroke="#10B981" strokeWidth="1.8" />
      <g transform="translate(62, 50)">
        <rect x="0" y="-20" width="5" height="20" rx="1" fill="#0D9488" />
        <rect x="9" y="-28" width="5" height="28" rx="1" fill="#10B981" />
        <rect x="18" y="-12" width="5" height="12" rx="1" fill="#0D9488" />
        <rect x="27" y="-22" width="5" height="22" rx="1" fill="#10B981" />
      </g>
      <line x1="56" y1="52" x2="94" y2="52" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      {/* Stand */}
      <line x1="75" y1="52" x2="75" y2="60" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <line x1="68" y1="60" x2="82" y2="60" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      {/* Students bar at bottom */}
      {[20, 40, 60, 80].map((x, i) => (
        <circle key={i} cx={x} cy="80" r="5" fill="rgba(13,148,136,0.3)" stroke="#0D9488" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// Certification Programs: Scroll / certificate ribbon
function EduCertIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      <defs>
        <linearGradient id="cyanBlueGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      {/* Certificate scroll */}
      <rect x="16" y="20" width="68" height="50" rx="5" fill="rgba(15,18,28,0.72)"
        stroke="url(#cyanBlueGrad2)" strokeWidth="2.2" />
      {/* Scroll rolls at top & bottom */}
      <ellipse cx="50" cy="20" rx="34" ry="6" fill="rgba(15,18,28,0.85)" stroke="url(#cyanBlueGrad2)" strokeWidth="1.8" />
      <ellipse cx="50" cy="70" rx="34" ry="6" fill="rgba(15,18,28,0.85)" stroke="url(#cyanBlueGrad2)" strokeWidth="1.8" />
      {/* Text lines */}
      <line x1="30" y1="36" x2="70" y2="36" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="44" x2="66" y2="44" stroke="rgba(16,185,129,0.35)" strokeWidth="1" strokeLinecap="round" />
      {/* Star seal */}
      <polygon points="50,50 52.5,57 60,57 54,61.5 56,69 50,64.5 44,69 46,61.5 40,57 47.5,57"
        fill="url(#cyanBlueGrad2)" />
    </svg>
  );
}

// Curriculum Development: Branching learning tree / roadmap
function EduCurriculumIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Root node */}
      <circle cx="50" cy="20" r="8" fill="rgba(15,18,28,0.72)" stroke="#0D9488" strokeWidth="2.2" />
      <circle cx="50" cy="20" r="4" fill="#0D9488" />
      {/* Trunk */}
      <line x1="50" y1="28" x2="50" y2="45" stroke="#0D9488" strokeWidth="2" />
      {/* Left branch */}
      <line x1="50" y1="45" x2="28" y2="58" stroke="#0D9488" strokeWidth="1.8" />
      <circle cx="28" cy="62" r="7" fill="rgba(15,18,28,0.72)" stroke="#10B981" strokeWidth="2" />
      <circle cx="28" cy="62" r="3.5" fill="#10B981" />
      {/* Left sub-branches */}
      <line x1="28" y1="69" x2="18" y2="80" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <circle cx="18" cy="84" r="5" fill="rgba(15,18,28,0.72)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
      <line x1="28" y1="69" x2="36" y2="80" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <circle cx="36" cy="84" r="5" fill="rgba(15,18,28,0.72)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
      {/* Right branch */}
      <line x1="50" y1="45" x2="72" y2="58" stroke="#0D9488" strokeWidth="1.8" />
      <circle cx="72" cy="62" r="7" fill="rgba(15,18,28,0.72)" stroke="#10B981" strokeWidth="2" />
      <circle cx="72" cy="62" r="3.5" fill="#10B981" />
      {/* Right sub-branches */}
      <line x1="72" y1="69" x2="62" y2="80" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <circle cx="62" cy="84" r="5" fill="rgba(15,18,28,0.72)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
      <line x1="72" y1="69" x2="82" y2="80" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <circle cx="82" cy="84" r="5" fill="rgba(15,18,28,0.72)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
    </svg>
  );
}

// Academic Analytics Solutions: Dashboard with academic metrics (grades, attendance)
function EduAnalyticsIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Dashboard frame */}
      <rect x="10" y="16" width="80" height="68" rx="6" fill="rgba(15,18,28,0.72)" stroke="#0D9488" strokeWidth="2" />
      <rect x="10" y="16" width="80" height="14" rx="4" fill="rgba(13,148,136,0.15)" />
      {/* Header dots */}
      <circle cx="22" cy="23" r="2.5" fill="#10B981" opacity="0.7" />
      <circle cx="30" cy="23" r="2.5" fill="#0D9488" opacity="0.5" />
      {/* Grade ring */}
      <g transform="translate(34, 57)">
        <circle cx="0" cy="0" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="#10B981" strokeWidth="5"
          strokeDasharray="100" strokeDashoffset="28" strokeLinecap="round"
          transform="rotate(-90)" />
        <text x="-6" y="4" fill="#10B981" fontSize="7" fontWeight="bold">A+</text>
      </g>
      {/* Attendance bars right side */}
      <g transform="translate(60, 80)">
        <rect x="0" y="-36" width="6" height="36" rx="1" fill="rgba(13,148,136,0.7)" />
        <rect x="10" y="-48" width="6" height="48" rx="1" fill="rgba(16,185,129,0.8)" />
        <rect x="20" y="-24" width="6" height="24" rx="1" fill="rgba(13,148,136,0.7)" />
      </g>
      <line x1="58" y1="81" x2="90" y2="81" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
    </svg>
  );
}

// Assessment Automation: Terminal/clipboard with static check marks
function EduAssessmentIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {/* Clipboard */}
      <rect x="20" y="20" width="60" height="70" rx="5" fill="rgba(15,18,28,0.72)" stroke="#0D9488" strokeWidth="2" />
      {/* Clipboard top clip */}
      <rect x="36" y="14" width="28" height="14" rx="4" fill="rgba(15,18,28,0.85)" stroke="#0D9488" strokeWidth="2" />
      <rect x="42" y="17" width="16" height="8" rx="2" fill="rgba(13,148,136,0.25)" />
      {/* Question lines */}
      <line x1="32" y1="42" x2="68" y2="42" stroke="rgba(13,148,136,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="54" x2="68" y2="54" stroke="rgba(13,148,136,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="66" x2="60" y2="66" stroke="rgba(13,148,136,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Static check marks */}
      <g transform="translate(26, 42)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="#28E79E" strokeWidth="1.5" />
        <path d="M -2.5 0 L -0.5 2 L 3 -2" fill="none" stroke="#28E79E" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <g transform="translate(26, 54)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="#28E79E" strokeWidth="1.5" />
        <path d="M -2.5 0 L -0.5 2 L 3 -2" fill="none" stroke="#28E79E" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      {/* Progress indicator bottom-right */}
      <g transform="translate(72, 76)">
        <circle cx="0" cy="0" r="8" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="8" fill="none" stroke="#10B981" strokeWidth="2.5"
          strokeDasharray="50" strokeDashoffset="15" strokeLinecap="round" />
      </g>
    </svg>
  );
}


const ICONS: Record<string, React.ComponentType> = {
  // Compatibility keys (original mapping)
  report: CorpReportIcon,
  visualization: CorpVisIcon,
  spreadsheet: CorpSpreadsheetIcon,
  process: CorpProcessIcon,
  education: EduTrainingIcon,
  automation: CorpProcessIcon,

  // Corporate
  "corp-report": CorpReportIcon,
  "corp-vis": CorpVisIcon,
  "corp-spreadsheet": CorpSpreadsheetIcon,
  "corp-dashboard": CorpDashboardIcon,
  "corp-app": CorpAppIcon,
  "corp-process": CorpProcessIcon,
  "corp-training": CorpTrainingIcon,

  // Educational
  "edu-training": EduTrainingIcon,
  "edu-cert": EduCertIcon,
  "edu-curriculum": EduCurriculumIcon,
  "edu-analytics": EduAnalyticsIcon,
  "edu-assessment": EduAssessmentIcon,
};

export type ServiceCardTone = "emerald" | "teal" | "amber" | "violet" | "blue" | "neutral";
const TONE_ACCENT: Record<ServiceCardTone, string> = {
  emerald: "#10B981", teal: "#10B981", amber: "#B45309",
  violet: "#6D28D9", blue: "#1D4ED8", neutral: "#0B2A22",
};

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  iconName: string;
  /** Static icon image URL uploaded from admin panel / CMS */
  iconUrl?: string | null;
  accentColor?: "cyan" | "blue";
  /** Soft category color for the card. */
  tone?: ServiceCardTone;
  tag?: string;
  delay?: number;
  /** When provided, clicking the card opens this handler (e.g. a drawer) instead of navigating.
   *  `href` is kept for deep-linking / no-JS fallback (progressive enhancement). */
  onLearnMore?: () => void;
}

export function ServiceCard({
  title,
  description,
  href,
  iconName,
  iconUrl,
  accentColor = "cyan",
  tone = "teal",
  tag,
  delay = 0,
  onLearnMore,
}: ServiceCardProps) {
  const accent = TONE_ACCENT[tone];
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

  const renderIcon = () => {
    if (iconUrl && typeof iconUrl === "string" && iconUrl.trim().length > 0) {
      return <img src={iconUrl} alt={title} className="w-9 h-9 object-contain" />;
    }
    const IconComponent = ICONS[iconName] || CorpVisIcon;
    return <IconComponent />;
  };

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
        onClick={onLearnMore ? (e) => { e.preventDefault(); onLearnMore(); } : undefined}
        aria-haspopup={onLearnMore ? "dialog" : undefined}
        className="block h-full transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.025 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className={`relative h-full flex flex-col justify-between p-8 rounded-[24px] card-tone-${tone} border overflow-hidden transition-all duration-500`}
          style={{
            boxShadow: isHovered
              ? accentColor === "cyan"
                ? "0 15px 40px rgba(16, 185, 129, 0.16)"
                : "0 15px 40px rgba(13, 148, 136, 0.16)"
              : "none",
          }}
        >
          {/* Cursor-tracking border glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[24px] transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: accentColor === "cyan"
                ? `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.8), transparent 75%)`
                : `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(13, 148, 136, 0.8), transparent 75%)`,
              padding: "1.5px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Icon Container */}
          <div
            className={`w-16 h-16 rounded-2xl card-chip-${tone} border border-line flex items-center justify-center transition-all duration-300`}
            style={{
              transform: isHovered ? "translateZ(30px)" : "translateZ(0)",
              borderColor: isHovered ? accent : "var(--color-line)",
            }}
          >
            {renderIcon()}
          </div>

          <div
            style={{
              transform: isHovered ? "translateZ(20px)" : "translateZ(0)",
              transition: "transform 0.3s ease-out",
            }}
            className="mt-8 flex-grow text-left"
          >
            {tag && (
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-350">
                {tag}
              </span>
            )}
            <h3
              className="text-xl font-bold mt-2 mb-3 transition-colors duration-300"
              style={{ color: isHovered ? accent : "var(--color-ink)" }}
            >
              {title}
            </h3>
            <p className="text-sm text-slate leading-relaxed font-light">
              {description}
            </p>
          </div>

          <div
            className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-300"
            style={{
              color: isHovered ? accent : "var(--color-slate)",
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


