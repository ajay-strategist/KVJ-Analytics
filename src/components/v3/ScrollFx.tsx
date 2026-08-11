"use client";

import React, { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   ScrollFx — reusable GSAP scroll animation primitives that bring inner pages
   up to the home page's motion language. All are:
   • Robust: content is visible by default and animates IN (immediateRender:false),
     so a stalled GSAP or reduced-motion never leaves anything hidden.
   • Lazy: GSAP + ScrollTrigger are dynamically imported on mount.
   • Play-once by default via ScrollTrigger `once`.
   ─────────────────────────────────────────────────────────────────────────── */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type GsapCtx = ReturnType<typeof import("gsap").default.context> | null;

/** Split a heading into per-character spans and reveal them on scroll-in.
 *  Un-clips the word masks after the reveal so any text-glow isn't boxed. */
export function SplitHeading({
  children, as: Tag = "h2", className = "", start = "top 85%", stagger = 0.02,
}: {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  start?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    let ctx: GsapCtx = null;
    let isMounted = true;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!isMounted) return;
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Cache the ORIGINAL text so a re-run (StrictMode/HMR) never re-splits the
        // already-split DOM (whose textContent has no spaces → jammed heading).
        let text = el.dataset.fxText;
        if (text == null) { text = el.textContent || ""; el.dataset.fxText = text; }
        const words = text.split(/\s+/).filter(Boolean);
        el.innerHTML = words
          .map(
            (word) =>
              `<span class="fx-word" style="display:inline-block;overflow:hidden;vertical-align:top;margin-right:0.26em">${word
                .split("")
                .map((ch) => `<span class="fx-char" style="display:inline-block;will-change:transform,opacity">${ch}</span>`)
                .join("")}</span>`
          )
          .join("");

        const chars = el.querySelectorAll(".fx-char");
        gsap.from(chars, {
          yPercent: 115,
          opacity: 0,
          rotateX: 60,
          duration: 0.7,
          stagger,
          ease: "power4.out",
          immediateRender: false,
          scrollTrigger: { trigger: el, start, once: true },
          onComplete: () => {
            el.querySelectorAll<HTMLElement>(".fx-word").forEach((w) => { w.style.overflow = "visible"; });
          },
        });
      }, el);
    })();

    return () => { 
      isMounted = false;
      ctx?.revert(); 
    };
  }, [start, stagger]);

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}

/** Scale + blur + fade a panel/card in from slight depth on scroll-in. */
export function ScaleIn({
  children, className = "", start = "top 82%", delay = 0, y = 40, as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  start?: string;
  delay?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    let ctx: GsapCtx = null;
    let isMounted = true;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!isMounted) return;
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.from(el, {
          scale: 0.94,
          y,
          opacity: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: el, start, once: true },
        });
      }, el);
    })();

    return () => { 
      isMounted = false;
      ctx?.revert(); 
    };
  }, [start, delay, y]);

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}

/** Scroll-linked vertical parallax. `speed` > 0 moves slower (further away),
 *  negative moves opposite. Great for background layers and hero art. */
export function Parallax({
  children, className = "", speed = 0.3, as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** fraction of scroll distance to offset (e.g. 0.3 = 30%) */
  speed?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    let ctx: GsapCtx = null;
    let isMounted = true;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!isMounted) return;
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(el, {
          yPercent: () => -speed * 100,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }, el);
    })();

    return () => { 
      isMounted = false;
      ctx?.revert(); 
    };
  }, [speed]);

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}

/** Count a number up from 0 to `value` when it scrolls into view. */
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
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) =>
      prefix + n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (prefersReduced()) { el.textContent = fmt(value); return; }
    let ctx: GsapCtx = null;
    let isMounted = true;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!isMounted) return;
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: value,
          duration,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => { el.textContent = fmt(obj.v); },
        });
      }, el);
    })();

    return () => { 
      isMounted = false;
      ctx?.revert(); 
    };
  }, [value, prefix, suffix, decimals, duration]);

  return <span ref={ref} className={className}>{`${prefix}${value.toLocaleString()}${suffix}`}</span>;
}
