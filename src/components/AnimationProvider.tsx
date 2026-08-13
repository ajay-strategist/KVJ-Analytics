"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   AnimationProvider
   Sets up Lenis smooth-scroll ↔ GSAP ScrollTrigger sync.
   Wraps the website layout so every section can use scroll-driven animations.
   ────────────────────────────────────────────────────────────────────────── */

interface AnimationCtx {
  /** true once GSAP + Lenis are wired up and running */
  ready: boolean;
}

const Ctx = createContext<AnimationCtx>({ ready: false });

export const useAnimation = () => useContext(Ctx);

import { usePathname } from "next/navigation";

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<InstanceType<typeof import("lenis").default> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let lenis: any = null;
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const Lenis = (await import("lenis")).default;

      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      // Skip if reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setReady(true);
        return;
      }

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });
      lenisRef.current = lenis;

      // Sync Lenis → GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time: number) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Recompute all trigger positions once layout/fonts settle so inner-page
      // scroll animations fire at the correct scroll position.
      requestAnimationFrame(() => ScrollTrigger.refresh());
      window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

      setReady(true);
    };

    init();

    return () => {
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle client-side route changes
  useEffect(() => {
    if (ready && lenisRef.current) {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        lenisRef.current?.scrollTo(0, { immediate: true });
        // Wait a frame for DOM to settle
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    }
  }, [pathname, ready]);

  return <Ctx.Provider value={{ ready }}>{children}</Ctx.Provider>;
}
