"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Render element tag */
  as?: keyof React.JSX.IntrinsicElements;
  /** Entrance style */
  variant?: "up" | "left" | "right" | "scale" | "blur";
}

const VARIANT_CLASS: Record<NonNullable<RevealProps["variant"]>, string> = {
  up: "",
  left: "rv-left",
  right: "rv-right",
  scale: "rv-scale",
  blur: "rv-blur",
};

/**
 * Animates its children into view the first time they scroll into view.
 * Falls back to visible immediately if IntersectionObserver is unavailable
 * or the user prefers reduced motion (handled in CSS).
 */
export function Reveal({ children, className = "", delay = 0, as = "div", variant = "up" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const Tag = as as React.ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${VARIANT_CLASS[variant]} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
