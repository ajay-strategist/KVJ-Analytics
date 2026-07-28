"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   High-end scroll animation hooks powered by GSAP + ScrollTrigger.
   Each hook lazily imports gsap so they're tree-shakeable on non-animated pages.
   ────────────────────────────────────────────────────────────────────────── */

/** Scroll-driven Y-axis parallax on an element */
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(el, {
          y: () => speed * 200,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    })();

    return () => { ctx?.revert(); };
  }, [speed]);

  return ref;
}

/** Stagger-reveal children as they scroll into view */
export function useStaggerReveal(selector = ".stagger-item") {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      const items = el.querySelectorAll(selector);
      if (!items.length) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          items,
          { y: 60, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 30%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    })();

    return () => { ctx?.revert(); };
  }, [selector]);

  return ref;
}

/** 3D perspective tilt that follows mouse position */
export function use3DTilt(intensity = 12) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleLeave = () => {
      el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
    };

    el.style.transition = "transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)";
    el.style.transformStyle = "preserve-3d";
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [intensity]);

  return ref;
}

/** Split text into individual characters for animation. Returns a ref and a split function. */
export function useSplitText() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      // Split text into words, then chars
      const text = el.textContent || "";
      const words = text.split(/\s+/).filter(Boolean);
      el.innerHTML = words
        .map(
          (word) =>
            `<span class="split-word" style="display:inline-block;overflow:hidden;vertical-align:top">${word
              .split("")
              .map(
                (ch) =>
                  `<span class="split-char" style="display:inline-block;will-change:transform,opacity">${ch}</span>`
              )
              .join("")}</span>`
        )
        .join('<span style="display:inline-block;width:0.3em"></span>');

      const chars = el.querySelectorAll(".split-char");

      ctx = gsap.context(() => {
        gsap.fromTo(
          chars,
          {
            y: "110%",
            opacity: 0,
            rotateX: 90,
          },
          {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.025,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    })();

    return () => { ctx?.revert(); };
  }, []);

  return ref;
}

/** Scroll-linked 3D card entrance — card flies in from depth */
export function use3DEntrance(fromDirection: "left" | "right" | "bottom" = "bottom", delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      const fromVals: Record<string, object> = {
        left: { x: -120, rotateY: 25, z: -200 },
        right: { x: 120, rotateY: -25, z: -200 },
        bottom: { y: 80, rotateX: 15, z: -150 },
      };

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { ...fromVals[fromDirection], opacity: 0, filter: "blur(6px)" },
          {
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    })();

    return () => { ctx?.revert(); };
  }, [fromDirection, delay]);

  return ref;
}

/** Horizontal scroll-driven scrub (e.g. for pipeline/timeline) */
export function useScrollScrub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const totalWidth = track.scrollWidth - container.offsetWidth;
        gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      });
    })();

    return () => { ctx?.revert(); };
  }, []);

  return { containerRef, trackRef };
}
