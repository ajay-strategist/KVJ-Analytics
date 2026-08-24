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
  const pathname = usePathname();

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      // Recompute all trigger positions once layout/fonts settle so inner-page
      // scroll animations fire at the correct scroll position.
      requestAnimationFrame(() => ScrollTrigger.refresh());
      window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

      setReady(true);
    };

    init();
  }, []);

  // Handle client-side route changes
  useEffect(() => {
    if (ready) {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        window.scrollTo({ top: 0 });
        // Wait a frame for DOM to settle
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    }
  }, [pathname, ready]);

  return <Ctx.Provider value={{ ready }}>{children}</Ctx.Provider>;
}
