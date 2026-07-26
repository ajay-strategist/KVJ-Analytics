"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { LivingAnalyticsConsole } from "./LivingAnalyticsConsole";

interface Cta { label: string; href: string }

/**
 * Hero — Enterprise Intelligence Command Center. Left: approved headline + one paragraph + CTAs.
 * Right: a single cohesive glass console with abstract, living modules — report automation building,
 * AI insight, BI bars, data visualization, and an automation workflow with a travelling data packet.
 * A scan line sweeps the console. Tilts to the pointer. No network diagrams / orbiting nodes /
 * generic widgets. Pure CSS + one rAF parallax loop; reduced-motion & touch aware.
 */
export function HeroCommandCenter({
  headline, paragraph, primaryCta, secondaryCta,
}: { headline: string; paragraph: string; primaryCta: Cta; secondaryCta: Cta }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const t = useRef({ x: 0, y: 0 });
  const c = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const scene = sceneRef.current, panel = consoleRef.current;
    if (!scene || !panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = scene.getBoundingClientRect();
      t.current.x = (e.clientX - r.left) / r.width - 0.5;
      t.current.y = (e.clientY - r.top) / r.height - 0.5;
    };
    const tick = () => {
      c.current.x += (t.current.x - c.current.x) * 0.06;
      c.current.y += (t.current.y - c.current.y) * 0.06;
      panel.style.transform = `perspective(1600px) rotateY(${c.current.x * 7}deg) rotateX(${c.current.y * -6}deg)`;
      panel.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const d = parseFloat(el.dataset.depth || "0");
        el.style.transform = `translate3d(${c.current.x * d * 16}px, ${c.current.y * d * 16}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={sceneRef} className="hero-bleed relative flex min-h-[100svh] items-center overflow-hidden bg-base text-ink grid-fade">
      <div className="absolute inset-0 particle-field opacity-45 pointer-events-none" />
      <div className="beam absolute -top-40 left-[6%] h-[46rem] w-[26rem] bg-brand/18" />
      <div className="beam absolute top-[10%] right-[0%] h-[42rem] w-[24rem] bg-corporate/18" style={{ animationDelay: "5s" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-base/20 via-transparent to-base pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8 py-28 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-14 lg:gap-12 items-center">
          {/* message */}
          <div className="max-w-xl">
            <h1 className="font-display font-bold text-[46px] sm:text-[60px] lg:text-[70px] leading-[1.02] tracking-[-0.03em] mb-7">
              {headline.replace(/\.$/, "")}<span className="text-brand">.</span>
            </h1>
            <p className="text-[17px] md:text-lg font-light text-slate leading-relaxed max-w-lg mb-10">{paragraph}</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Magnetic strength={0.5}>
                <Link href={primaryCta.href}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-[15px] font-semibold text-[#04121a] gradient-move shadow-[0_10px_40px_-8px_rgba(67,245,255,0.6)]">
                  <span className="light-sweep absolute inset-0 rounded-full" />
                  <span className="relative">{primaryCta.label}</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.4}>
                <Link href={secondaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-7 py-3.5 text-[15px] font-medium text-ink backdrop-blur-md hover:border-brand/40 hover:bg-white/[0.06] transition-colors">
                  {secondaryCta.label}
                  <ArrowUpRight className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* living enterprise analytics console */}
          <div className="hidden md:block [perspective:1600px]" aria-hidden>
            <div ref={consoleRef} className="transition-transform duration-300 ease-out will-change-transform">
              <LivingAnalyticsConsole />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate/70">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-[1px] bg-gradient-to-b from-brand to-transparent animate-glow-pulse" />
      </div>
    </section>
  );
}
