"use client";

import React, { useEffect, useRef } from "react";

/**
 * Subtle spotlight that follows the cursor (desktop only).
 * Uses `mix-blend-mode: multiply` with a faint violet so it reads as a soft
 * moving tint on light sections and stays unobtrusive. Smoothed with lerp.
 * Disabled for touch devices and prefers-reduced-motion.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block opacity-0 transition-opacity duration-500"
      style={{
        width: 520,
        height: 520,
        borderRadius: "9999px",
        background:
          "radial-gradient(circle, rgba(110,86,248,0.07) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)",
        mixBlendMode: "multiply",
        willChange: "transform",
      }}
    />
  );
}
