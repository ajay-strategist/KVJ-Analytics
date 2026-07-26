"use client";

import React, { useRef } from "react";

/** Lightweight magnetic-hover wrapper (no deps). Wrap CTAs / icons. */
export function Magnetic({
  children, strength = 0.4, className = "",
}: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate(0px, 0px)"; };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}
