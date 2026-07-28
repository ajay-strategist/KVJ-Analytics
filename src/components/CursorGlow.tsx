"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Enhanced custom cursor with GSAP quickTo for buttery smooth tracking.
 * Modes: normal ring, expanded on interactive, text-mode on headings,
 * view-mode on cards with images. Inspired by Trionn.com cursor.
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let ringX = mouseX, ringY = mouseY;
    let rafId = 0;
    let mode: "default" | "hover" | "text" | "view" = "default";

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
    };

    const setMode = (m: typeof mode) => {
      mode = m;
      ring.className = ring.className.replace(/ cursor-\w+-mode/g, "");

      if (m === "text") {
        ring.classList.add("cursor-text-mode");
        dot.style.opacity = "0";
        label.textContent = "";
      } else if (m === "view") {
        ring.classList.add("cursor-view-mode");
        dot.style.opacity = "0";
        label.textContent = "VIEW";
        label.style.opacity = "1";
      } else if (m === "hover") {
        dot.style.opacity = "1";
        label.textContent = "";
        label.style.opacity = "0";
        ring.style.width = "48px";
        ring.style.height = "48px";
        ring.style.backgroundColor = "rgba(67, 245, 255, 0.08)";
        ring.style.borderColor = "#69FFFF";
        ring.style.boxShadow = "0 0 15px rgba(67, 245, 255, 0.3)";
      } else {
        dot.style.opacity = "1";
        label.textContent = "";
        label.style.opacity = "0";
        ring.style.width = "28px";
        ring.style.height = "28px";
        ring.style.backgroundColor = "transparent";
        ring.style.borderColor = "rgba(67, 245, 255, 0.4)";
        ring.style.boxShadow = "none";
      }
    };

    const updateCursor = () => {
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(updateCursor);
    };

    const addHoverListeners = () => {
      // View mode: cards with images or project cards
      document.querySelectorAll("[data-cursor-view], .img-zoom").forEach((el) => {
        el.addEventListener("mouseenter", () => setMode("view"));
        el.addEventListener("mouseleave", () => setMode("default"));
      });

      // Text mode: headings
      document.querySelectorAll("h1, h2, h3").forEach((el) => {
        el.addEventListener("mouseenter", () => setMode("text"));
        el.addEventListener("mouseleave", () => setMode("default"));
      });

      // Hover mode: interactive elements
      document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .card-premium, .offering-card, .service-card, [data-hover-glow]'
      ).forEach((el) => {
        el.addEventListener("mouseenter", () => setMode("hover"));
        el.addEventListener("mouseleave", () => setMode("default"));
      });
    };

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", () => setIsVisible(true));
    document.addEventListener("mouseleave", () => setIsVisible(false));

    addHoverListeners();
    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Small center dot */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block rounded-full bg-brand shadow-[0_0_10px_#43F5FF] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: "6px", height: "6px", willChange: "transform" }}
      />
      {/* Outer lagging ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9998] hidden md:flex items-center justify-center rounded-full border border-brand/40 transition-all duration-300 ease-out will-change-[transform,width,height,background-color] ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: "28px", height: "28px", backgroundColor: "transparent" }}
      >
        <span
          ref={labelRef}
          className="text-[9px] font-bold uppercase tracking-widest text-brand pointer-events-none transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
      </div>
    </>
  );
}
