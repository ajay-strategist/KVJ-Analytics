"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealTextProps {
  text: string;
  className?: string;
  /** Per-word stagger in ms */
  stagger?: number;
  /** Initial delay in ms */
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Webandcrafts-style headline reveal: each word sits in a clipped mask and
 * slides up into view (staggered) the first time it scrolls into the viewport.
 * Renders inline, so it inherits the font/size of its parent heading.
 */
export function RevealText({ text, className = "", stagger = 55, delay = 0, as = "span" }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const Tag = as as React.ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block will-change-transform"
            style={{
              transform: shown ? "translateY(0)" : "translateY(115%)",
              opacity: shown ? 1 : 0,
              transition: `transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms, opacity 0.6s ease ${delay + i * stagger}ms`,
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
