"use client";

import React, { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

/* ────────────────────────────────────────────────────────────────────────────
   ScrollFx — High-performance, lightweight scroll transition primitives.
   Optimized to run purely on browser-native CSS reveals and requestAnimationFrame,
   with ZERO external library dependencies.
   ─────────────────────────────────────────────────────────────────────────── */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Replaces split-text characters reveal with a lightweight, GPU-accelerated CSS reveal. */
export function SplitHeading({
  children, as: Tag = "h2", className = "",
}: {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  start?: string;
  stagger?: number;
}) {
  return (
    <Reveal className={className} as={Tag} variant="up">
      {children}
    </Reveal>
  );
}

/** Replaces GSAP ScaleIn with hardware-accelerated CSS scale entrance. */
export function ScaleIn({
  children, className = "", delay = 0, as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  start?: string;
  delay?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Reveal className={className} as={Tag} variant="scale" delay={delay}>
      {children}
    </Reveal>
  );
}

/** Lightweight GPU-accelerated parallax effect using native scroll passive listeners. */
export function Parallax({
  children, className = "", speed = 0.3, as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** fraction of scroll distance to offset */
  speed?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    let raf = 0;
    const tick = () => {
      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Calculate depth offset relative to viewport position
      const offset = (rect.top - viewHeight * 0.5) * speed;
      el.style.transform = `translate3d(0, ${offset * -0.5}px, 0)`;
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    tick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </Component>
  );
}

/** Count a number up from 0 to `value` when it enters the viewport. */
export function CountUp({
  value, prefix = "", suffix = "", decimals = 0, className = "", duration = 1.4,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReduced()) {
      setCount(value);
      return;
    }

    let startTimestamp: number | null = null;
    let animId: number;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
          setCount(progress * value);
          if (progress < 1) {
            animId = requestAnimationFrame(step);
          }
        };
        animId = requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [value, duration]);

  const fmt = (n: number) =>
    prefix + n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  return <span ref={ref} className={className}>{fmt(count)}</span>;
}
