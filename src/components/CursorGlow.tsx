"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Modern custom cursor (desktop only).
 * Renders a small glowing dot and an outer lagging ring.
 * The outer ring expands when hovering over interactive elements.
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;

    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const onMouseEnterWindow = () => {
      setIsVisible(true);
    };

    const onMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    const updateCursor = () => {
      // Lerp calculations
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;

      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    // Attach listeners to interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .card-premium, .offering-card, .service-card, [data-hover-glow]'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    };

    // Re-attach hover listeners when DOM changes (e.g. page transition)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnterWindow);
    document.addEventListener("mouseleave", onMouseLeaveWindow);
    
    // Initial attachment
    addHoverListeners();
    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnterWindow);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();

      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .card-premium, .offering-card, .service-card'
      );
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, [isVisible]);

  return (
    <>
      {/* Small center dot */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block rounded-full bg-brand shadow-[0_0_10px_#43F5FF] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: "6px",
          height: "6px",
          willChange: "transform",
        }}
      />
      {/* Outer lagging ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block rounded-full border border-brand/50 transition-all duration-300 ease-out will-change-[transform,width,height,background-color] ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: isHovered ? "48px" : "28px",
          height: isHovered ? "48px" : "28px",
          backgroundColor: isHovered ? "rgba(67, 245, 255, 0.08)" : "transparent",
          borderColor: isHovered ? "#69FFFF" : "rgba(67, 245, 255, 0.4)",
          boxShadow: isHovered ? "0 0 15px rgba(67, 245, 255, 0.3)" : "none",
        }}
      />
    </>
  );
}
