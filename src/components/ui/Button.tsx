"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light" | "accent";
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
    // Magnetic pull calculation: pull towards mouse by up to 10px
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const baseClasses =
    "group/btn relative inline-flex items-center justify-center gap-2.5 font-body text-[15px] font-medium transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variantClasses = {
    // Primary: neon sweeping border pill with dark background and neon cyan text
    primary:
      "btn-sweeping-border bg-[#0A0A0E] text-brand rounded-full px-7 py-3.5 shadow-[0_4px_20px_rgba(0,240,255,0.15)] hover:shadow-[0_12px_32px_rgba(0,240,255,0.3)] hover:text-white hover:-translate-y-0.5 transition-all duration-300 border border-brand/40",
    // Secondary: translucent glass panel pill with electric blue outline
    secondary:
      "border border-corporate/30 bg-white/5 text-[#0072FF] hover:text-[#80B8FF] rounded-full px-7 py-3.5 hover:border-corporate hover:-translate-y-0.5 sheen shadow-sm transition-all duration-300",
    // Ghost text link
    ghost:
      "bg-transparent text-brand hover:text-accent-bright px-0 py-2 transition-colors font-semibold",
    // Translucent dark glass pill
    light:
      "bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-full px-7 py-3.5 shadow-md hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,240,255,0.18)] hover:border-brand/40 transition-all duration-300",
    // Accent: continuous liquid glow button for highlights
    accent:
      "animate-liquid-glow bg-gradient-to-r from-brand to-corporate text-white rounded-full px-7 py-3.5 shadow-[0_8px_25px_rgba(0,240,255,0.25)] hover:shadow-[0_16px_36px_rgba(0,240,255,0.45)] hover:-translate-y-0.5 transition-all duration-300 border border-brand/50 font-bold",
  };

  // Combine magnetic translate transform
  const magneticStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.15s ease-out",
    ...style,
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

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
          {children}
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
        {children}
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
      {children}
    </button>
  );
}
