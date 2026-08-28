"use client";

import React, { useEffect, useRef } from "react";

/**
 * Slim gradient scroll-progress bar pinned to the very top of the page.
 * Uses requestAnimationFrame + transform scaleX for smooth, GPU-friendly motion.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (el) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
        el.style.transform = `scaleX(${p})`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] origin-left"
      style={{
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, #10B981 0%, #34D399 50%, #0D9488 100%)",
        boxShadow: "0 1px 8px rgba(16,185,129,0.4)",
      }}
      ref={ref}
    />
  );
}
