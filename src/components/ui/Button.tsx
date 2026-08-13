"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light" | "accent" | "corporate" | "education";
  href?: string;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  style = {},
  ...props
}: ButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Magnetic pull calculation: pull towards mouse by up to 8px
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const baseClasses =
    "group/btn relative inline-flex items-center justify-center gap-2.5 font-body text-[15px] font-semibold transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden";

  const variantClasses = {
    // Primary: Cyan -> Blue gradient pill with strong neon glow, hover scale 1.04, glow expand
    primary:
      "bg-gradient-to-r from-brand to-corporate text-white rounded-full px-7 py-3.5 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_36px_rgba(16,185,129,0.55)] hover:scale-[1.04] border border-brand/20 active:scale-[0.98]",
    
    // Secondary: Glass button with glowing border and outline reveal sweep animation
    secondary:
      "border border-brand/30 bg-white/70 backdrop-blur-md text-ink rounded-full px-7 py-3.5 hover:border-brand hover:scale-[1.02] shadow-sm hover:shadow-[0_0_18px_rgba(16,185,129,0.18)] hover:text-brand active:scale-[0.98] btn-sweeping-border",
    
    // Ghost text link with hover neon highlight
    ghost:
      "bg-transparent text-brand hover:text-[#69FFFF] px-0 py-2 transition-colors font-semibold",
    
    // Translucent dark glass pill
    light:
      "bg-ink/85 backdrop-blur-md text-white hover:text-white border border-white/5 rounded-full px-7 py-3.5 shadow-md hover:border-brand/35 hover:scale-[1.02] transition-all duration-300",
    
    // Accent (Continuous glowing accent)
    accent:
      "animate-liquid-glow bg-gradient-to-r from-brand to-corporate text-white rounded-full px-7 py-3.5 shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_16px_36px_rgba(16,185,129,0.55)] hover:scale-[1.04] transition-all duration-300 border border-brand/30",
    
    // Corporate solution button
    corporate:
      "bg-corporate text-white rounded-full px-7 py-3.5 shadow-[0_4px_15px_rgba(13,148,136,0.25)] hover:shadow-[0_12px_28px_rgba(13,148,136,0.45)] hover:scale-[1.04] border border-corporate/30 hover:border-brand/45 active:scale-[0.98]",
    
    // Education solution button
    education:
      "bg-[#34D399] text-[#050608] rounded-full px-7 py-3.5 shadow-[0_4px_15px_rgba(22,230,216,0.25)] hover:shadow-[0_12px_28px_rgba(22,230,216,0.45)] hover:scale-[1.04] border border-[#34D399] hover:border-[#10B981] active:scale-[0.98] font-bold",
  };

  // Combine magnetic translate transform
  const magneticStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.1s ease-out",
    ...style,
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  // Renders the button contents. If primary, include a sliding arrow wrapper
  const renderContent = () => {
    if (variant === "primary" || variant === "accent") {
      return (
        <span className="flex items-center gap-1.5 relative z-10">
          <span className="flex items-center gap-2">{children}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          {/* Subtle ripple layer */}
          <span className="absolute -inset-x-8 -inset-y-4 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full blur-[10px] mix-blend-screen" />
        </span>
      );
    }
    return <span className="flex items-center gap-2 relative z-10">{children}</span>;
  };

  if (href) {
    const isPlainAnchor = href.startsWith("#") || /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

    if (isPlainAnchor) {
      return (
        <a 
          href={href} 
          className={finalClasses}
          style={magneticStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {renderContent()}
        </a>
      );
    }

    return (
      <Link 
        href={href} 
        className={finalClasses}
        style={magneticStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
      </Link>
    );
  }

  return (
    <button 
      className={finalClasses} 
      style={magneticStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {renderContent()}
    </button>
  );
}
