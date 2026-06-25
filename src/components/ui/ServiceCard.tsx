"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, AppWindow, Workflow, GraduationCap } from "lucide-react";

// 1. Data Visualization animated SVG
function DataVisIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-brand">
      {/* Wave line */}
      <path
        d="M 10 70 Q 25 30, 45 60 T 80 20"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="3.5"
        strokeLinecap="round"
        className="animate-[dash_3s_ease-in-out_infinite]"
        style={{
          strokeDasharray: 200,
          strokeDashoffset: 0,
        }}
      />
      {/* Bars rising and falling */}
      <rect x="15" y="80" width="10" height="20" rx="2" fill="rgba(0, 240, 255, 0.45)" className="animate-[pulse_1.8s_ease-in-out_infinite_0.2s]" />
      <rect x="35" y="80" width="10" height="35" rx="2" fill="rgba(0, 114, 255, 0.6)" className="animate-[pulse_2.2s_ease-in-out_infinite_0.6s]" />
      <rect x="55" y="80" width="10" height="25" rx="2" fill="rgba(0, 240, 255, 0.5)" className="animate-[pulse_1.5s_ease-in-out_infinite_0.4s]" />
      <rect x="75" y="80" width="10" height="45" rx="2" fill="rgba(0, 114, 255, 0.7)" className="animate-[pulse_2s_ease-in-out_infinite_0.8s]" />
      
      {/* Floating nodes */}
      <circle cx="80" cy="20" r="4.5" fill="#FFF" className="animate-ping" />
      <circle cx="80" cy="20" r="3.5" fill="#00F0FF" />
      <circle cx="45" cy="60" r="3.5" fill="#0072FF" />
    </svg>
  );
}

// 2. Excel / Spreadsheet Automation animated SVG
function ExcelAutomationIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#0072FF]">
      {/* Table grid borders */}
      <rect x="10" y="10" width="80" height="80" rx="8" fill="none" stroke="rgba(0, 114, 255, 0.25)" strokeWidth="2.5" />
      <line x1="10" y1="36" x2="90" y2="36" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="2" />
      <line x1="10" y1="63" x2="90" y2="63" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="2" />
      <line x1="36" y1="10" x2="36" y2="90" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="2" />
      <line x1="63" y1="10" x2="63" y2="90" stroke="rgba(0, 114, 255, 0.2)" strokeWidth="2" />

      {/* Pulsing automation check cells */}
      <rect x="14" y="14" width="18" height="18" rx="4" fill="rgba(0, 240, 255, 0.25)" className="animate-pulse" />
      <rect x="40" y="40" width="18" height="18" rx="4" fill="rgba(0, 114, 255, 0.35)" className="animate-[pulse_1.7s_infinite_0.4s]" />
      <rect x="67" y="67" width="18" height="18" rx="4" fill="rgba(0, 240, 255, 0.3)" className="animate-[pulse_2.1s_infinite_0.8s]" />

      {/* Floating gears/arrows */}
      <circle cx="50" cy="50" r="14" fill="none" stroke="#00F0FF" strokeWidth="2" strokeDasharray="6 4" className="animate-[spin_8s_linear_infinite]" />
    </svg>
  );
}

// 3. Educational Workflow animated SVG
function EduWorkflowIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 text-brand">
      {/* Graduation Cap floating */}
      <g className="animate-[float-slow_4s_ease-in-out_infinite]">
        <path d="M 50 15 L 85 30 L 50 45 L 15 30 Z" fill="none" stroke="#00F0FF" strokeWidth="3" />
        <path d="M 85 30 L 85 55" fill="none" stroke="#00F0FF" strokeWidth="2" />
        <path d="M 30 37.5 L 30 65 Q 50 78, 70 65 L 70 37.5" fill="none" stroke="#0072FF" strokeWidth="2.5" />
        <circle cx="85" cy="55" r="4.5" fill="#0072FF" />
      </g>
      
      {/* Glowing particles */}
      <circle cx="20" cy="70" r="3" fill="#00F0FF" className="animate-[pulse_1.5s_infinite]" />
      <circle cx="80" cy="70" r="2" fill="#0072FF" className="animate-[pulse_2s_infinite_0.5s]" />
      <circle cx="50" cy="78" r="3" fill="#FFF" className="animate-ping" />
    </svg>
  );
}

const ICONS: Record<string, React.ComponentType> = {
  visualization: DataVisIcon,
  automation: ExcelAutomationIcon,
  education: EduWorkflowIcon,
};

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  iconName: "visualization" | "automation" | "education";
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
    // Maximum tilt angles in degrees
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
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div 
          className="relative h-full flex flex-col justify-between p-8 rounded-[24px] bg-[#12121A]/70 backdrop-blur-[24px] border border-white/5 overflow-hidden transition-all duration-500"
          style={{
            borderColor: isHovered 
              ? (accentColor === "cyan" ? "rgba(0, 240, 255, 0.4)" : "rgba(0, 114, 255, 0.4)")
              : "rgba(255, 255, 255, 0.05)",
            boxShadow: isHovered
              ? (accentColor === "cyan" ? "0 15px 40px rgba(0, 240, 255, 0.12)" : "0 15px 40px rgba(0, 114, 255, 0.12)")
              : "none",
          }}
        >
          {/* Inner Glow Gradient that follows the exact cursor coordinates */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${
                  accentColor === "cyan" ? "rgba(0, 240, 255, 0.12)" : "rgba(0, 114, 255, 0.12)"
                }, transparent 80%)`,
              }}
            />
          )}

          {/* Icon Container with slight float */}
          <div 
            className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10"
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
            className="mt-8 flex-grow"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-500">
              {tag}
            </span>
            <h3 
              className="text-xl font-bold mt-2 mb-3 text-white transition-colors duration-300"
              style={{
                color: isHovered ? (accentColor === "cyan" ? "#00F0FF" : "#80B8FF") : "#FFFFFF",
              }}
            >
              {title}
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              {description}
            </p>
          </div>

          <div
            className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-300"
            style={{
              color: isHovered ? (accentColor === "cyan" ? "#00F0FF" : "#80B8FF") : "#9CA3AF",
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
