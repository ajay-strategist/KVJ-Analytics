"use client";

import React, { useRef } from "react";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** How strongly the element is pulled toward the cursor (px at edge). */
  strength?: number;
}

/**
 * Wraps an element so it is gently "pulled" toward the cursor while hovered,
 * then springs back on leave. Desktop pointer only; no-op on touch / reduced motion.
 */
export function Magnetic({ children, className = "", strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const allowed = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || !allowed()) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(mx / r.width) * strength * 2}px, ${(my / r.height) * strength * 2}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block will-change-transform transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </span>
  );
}
