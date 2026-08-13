"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Magnetic } from "./Magnetic";

interface Cta { label: string; href: string }

/**
 * Hero — full-viewport cinematic 3D hero.
 * Left: Headline, description, CTAs with GSAP split-text reveal.
 * Right: A professional sitting at a laptop surrounded by five beautiful,
 * interactive 3D floating cards representing Excel, Power BI, Power Platform,
 * Performance KPI dashboard, and SAP Integration.
 * Responsive, 3D mouse parallax depth, premium frosted glassmorphism.
 */
export function HeroCommandCenter({
  headline, paragraph, primaryCta, secondaryCta,
}: { headline: string; paragraph: string; primaryCta: Cta; secondaryCta: Cta; imageUrl?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // ── Split the headline into per-character spans ──
        const headlineEl = headlineRef.current;
        let chars: Element[] = [];
        if (headlineEl) {
          const text = headline.replace(/\.$/, "");
          const words = text.split(/\s+/).filter(Boolean);
          headlineEl.innerHTML = words
            .map((word, wi) =>
              `<span class="split-word" style="display:inline-block;overflow:hidden;vertical-align:top;margin-right:0.25em">${word
                .split("")
                .map(
                  (ch, ci) =>
                    `<span class="split-char" data-i="${wi * 10 + ci}" style="display:inline-block;will-change:transform,opacity">${ch}</span>`
                )
                .join("")}</span>`
            )
            .join("");
          chars = Array.from(headlineEl.querySelectorAll(".split-char"));
        }

        const para = paragraphRef.current;
        const cta = ctaRef.current;
        const ctaButtons = cta ? Array.from(cta.children) : [];
        const visual = visualContainerRef.current;
        const scrollInd = scrollIndicatorRef.current;

        // NOTE: we deliberately do NOT pre-hide via gsap.set(). The entrance below uses
        // `.from()` tweens with immediateRender:false, so the hero stays visible if GSAP
        // ever stalls (and for reduced-motion users) instead of being stuck invisible.

        // ── Animate the floating-card visuals (bars grow, ring + numbers count up, pie draws) ──
        const animateCards = () => {
          if (!visual) return;
          const bars = visual.querySelectorAll<HTMLElement>("[data-bar]");
          if (bars.length) {
            gsap.set(bars, { transformOrigin: "50% 100%" });
            gsap.fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.9, stagger: 0.03, ease: "power3.out" });
          }
          const ring = visual.querySelector<SVGCircleElement>("[data-ring]");
          if (ring) {
            const full = ring.getAttribute("data-ring") || "75";
            gsap.fromTo(ring, { attr: { "stroke-dasharray": "0 100" } },
              { attr: { "stroke-dasharray": `${full} 100` }, duration: 1.2, ease: "power2.inOut" });
          }
          const pie = visual.querySelector<SVGGElement>("[data-pie]");
          if (pie) gsap.fromTo(pie, { rotate: -90, transformOrigin: "50% 50%", opacity: 0 },
            { rotate: 0, opacity: 1, duration: 1.0, ease: "power3.out" });
          visual.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
            const target = parseFloat(el.getAttribute("data-count") || "0");
            const prefix = el.getAttribute("data-prefix") || "";
            const suffix = el.getAttribute("data-suffix") || "";
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target, duration: 1.3, ease: "power2.out",
              onUpdate: () => { el.textContent = prefix + Math.round(obj.v).toLocaleString() + suffix; },
            });
          });
        };

        // ── Entrance timeline (played once the intro loader signals completion) ──
        const playIntro = () => {
          // Using .fromTo() guarantees the final state is reached regardless of React Strict Mode re-mounts
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          
          if (visual) tl.fromTo(visual, 
            { opacity: 0, scale: 0.94, filter: "blur(16px)" }, 
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power2.out" }, 0);
            
          if (chars.length) tl.fromTo(chars, 
            { yPercent: 120, opacity: 0, rotateX: 80 }, 
            { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.02, ease: "power4.out" }, 0.1);
            
          if (para) tl.fromTo(para, 
            { y: 40, opacity: 0, filter: "blur(8px)" }, 
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 }, 0.4);
            
          if (ctaButtons.length) tl.fromTo(ctaButtons, 
            { y: 30, opacity: 0, scale: 0.95 }, 
            { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12 }, 0.55);
            
          if (scrollInd) tl.fromTo(scrollInd, 
            { opacity: 0, y: -10 }, 
            { opacity: 1, y: 0, duration: 0.6 }, 0.8);
            
          tl.add(animateCards, 0.35);
          // Once the slide-up reveal is done, un-clip the words so the text-glow
          // isn't boxed to each word's mask rectangle.
          if (headlineEl) {
            tl.set(Array.from(headlineEl.querySelectorAll<HTMLElement>(".split-word")), { overflow: "visible" }, 1.0);
          }
        };

        // Gate on the intro-done signal. Use setTimeout (not gsap.delayedCall) so the
        // gate never depends on the GSAP ticker's state during early page load.
        const w = window as unknown as { __kvjIntroDone?: boolean };
        let played = false;
        let timerId: NodeJS.Timeout | null = null;
        
        const go = () => { 
          if (played) return; 
          played = true; 
          // Use ctx.add to safely register this async timeline so it cleans up on unmount
          ctx?.add(() => playIntro()); 
        };

        if (w.__kvjIntroDone) {
          timerId = setTimeout(go, 80); // intro already finished (repeat visit / reduced motion)
        } else {
          window.addEventListener("kvj:intro-done", go, { once: true });
          timerId = setTimeout(go, 3600); // fallback if the signal never arrives
        }

        // Cleanups will be returned at the end of the context

        // ── Scroll-driven parallax: only the headline recedes with depth. ──
        // The right-hand visual is intentionally NOT faded/moved on scroll: doing so
        // (a) made the professional + cards "disappear" almost immediately on scroll,
        // and (b) fought the mouse-tilt, which writes the same inline transform.
        gsap.to(headlineRef.current, {
          y: -70,
          opacity: 0.35,
          filter: "blur(3px)",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.5 },
        });

        // ── Scroll indicator fades as you begin scrolling ──
        if (scrollInd) {
          gsap.to(scrollInd, {
            opacity: 0,
            y: 20,
            scrollTrigger: { trigger: section, start: "top top", end: "15% top", scrub: true },
          });
        }

        // Return cleanup function to GSAP context (executed on ctx.revert())
        return () => {
          if (timerId) clearTimeout(timerId);
          window.removeEventListener("kvj:intro-done", go);
        };
      }, section);
    };

    init();
    return () => {
      ctx?.revert(); 
    };
  }, []);

  // ── Mouse-driven 3D tilt and depth parallax ──
  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualContainerRef.current;
    if (!section || !visual) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width - 0.5;
      target.y = (e.clientY - r.top) / r.height - 0.5;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;

      // Subtle tilt on the visual container (calmed from ±8°/±6° to keep it premium, not jittery)
      visual.style.transform = `perspective(1800px) rotateY(${current.x * 4}deg) rotateX(${-current.y * 3}deg)`;

      // Gentle depth parallax on the floating cards
      visual.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const d = parseFloat(el.dataset.depth || "0");
        el.style.transform = `translate3d(${current.x * d * 28}px, ${current.y * d * 28}px, ${d * 30}px)`;
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    // Return cleanup function for the mouse tracker
    return () => { 
      window.removeEventListener("mousemove", onMove); 
      cancelAnimationFrame(raf); 
    };
  }, []);

  // Individual card tilt overrides on hover
  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const d = parseFloat(el.dataset.depth || "0.5");
    // Apply extra tilt on hover
    el.style.transform = `translate3d(${x * d * 12}px, ${y * d * 12}px, ${d * 40}px) perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 7}deg) scale(1.03)`;
    el.style.borderColor = "rgba(16, 185, 129, 0.4)";
    el.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.15)";
  };

  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = "";
    el.style.borderColor = "rgba(255, 255, 255, 0.08)";
    el.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
  };

  return (
    <section
      ref={sectionRef}
      className="hero-bleed relative flex min-h-[100svh] items-center overflow-hidden bg-base text-ink"
    >
      {/* Particle field background */}
      <div className="absolute inset-0 particle-field opacity-20 pointer-events-none" />

      {/* Grid overlay */}
      <div className="grid-fade absolute inset-0 pointer-events-none" />

      {/* Ambient color glows */}
      <div className="beam absolute -top-40 left-[6%] h-[46rem] w-[26rem] bg-brand/15" />
      <div className="beam absolute top-[8%] right-[2%] h-[44rem] w-[26rem] bg-emerald-500/10" style={{ animationDelay: "4s" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base pointer-events-none" />

      {/* Main Content Grid */}
      <div className="relative z-10 mx-auto w-full max-w-[1340px] px-5 sm:px-6 lg:px-8 py-28 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-8 items-center">

          {/* ── Left: Headline & Copy ── */}
          <div className="max-w-xl">
            <h1
              ref={headlineRef}
              className="font-display font-bold text-[46px] sm:text-[58px] lg:text-[70px] leading-[1.03] tracking-[-0.03em] mb-7 text-glow-hero"
              style={{ perspective: "1000px" }}
            >
              {headline.replace(/\.$/, "")}
            </h1>
            <p
              ref={paragraphRef}
              className="text-[17px] md:text-lg font-light text-slate leading-relaxed max-w-lg mb-10"
            >
              {paragraph}
            </p>
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Magnetic strength={0.5}>
                <Link
                  href={primaryCta.href}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-[15px] font-semibold text-[#04121a] gradient-move shadow-[0_10px_40px_-8px_rgba(16,185,129,0.6)]"
                >
                  <span className="light-sweep absolute inset-0 rounded-full" />
                  <span className="relative">{primaryCta.label}</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.4}>
                <Link
                  href={secondaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 text-[15px] font-medium text-ink backdrop-blur-md hover:border-brand/40 hover:bg-emerald-50 transition-colors"
                >
                  {secondaryCta.label}
                  <ArrowUpRight className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* ── Right: Immersive 3D Showcase (Professional + Floating Cards) ── */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px] w-full">
            <div
              ref={visualContainerRef}
              className="relative w-full h-full flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Green Glow / Grid Background for visual */}
              <div
                className="absolute inset-0 rounded-[40px] opacity-35"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 65%),
                    linear-gradient(rgba(16, 185, 129, 0.03) 1.5px, transparent 1.5px),
                    linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1.5px, transparent 1.5px)
                  `,
                  backgroundSize: "100% 100%, 32px 32px, 32px 32px",
                  transform: "translateZ(-80px)",
                }}
              />

              {/* Central Subject: Professional Working on Laptop */}
              <div
                data-depth={0.2}
                className="absolute bottom-2 h-[420px] w-[420px] rounded-full border border-emerald-500/10 shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden bg-white/45"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/professional-man-laptop.png"
                  alt="Professional Consultant"
                  className="h-full w-full object-cover object-top scale-105 contrast-[1.05] brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent opacity-85" />
              </div>

              {/* CARD 1: Microsoft Excel (Top-Left) */}
              <div
                data-depth={0.8}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                className="absolute left-[-20px] top-[40px] w-[210px] rounded-xl border border-line bg-glass-card p-4 backdrop-blur-md shadow-lg transition-all duration-300 ease-out select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ transform: "translateZ(10px)" }}>
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                    <span className="font-mono text-xs font-bold">X</span>
                  </div>
                  <span className="text-[12px] font-bold text-ink">Microsoft Excel</span>
                </div>
                {/* Mini chart visual */}
                <div className="h-16 w-full flex items-end gap-1 px-1" style={{ transform: "translateZ(15px)" }}>
                  {[12, 22, 16, 28, 20, 36, 28, 48, 40].map((h, i) => (
                    <div key={i} data-bar className="flex-1 rounded-sm bg-gradient-to-t from-emerald-600/50 to-emerald-400" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              {/* CARD 2: Microsoft Power BI (Middle-Left) */}
              <div
                data-depth={1.1}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                className="absolute left-[-50px] top-[200px] w-[220px] rounded-xl border border-line bg-glass-card p-4 backdrop-blur-md shadow-lg transition-all duration-300 ease-out select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ transform: "translateZ(10px)" }}>
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-600">
                    <span className="font-mono text-[9px] font-black">PBI</span>
                  </div>
                  <span className="text-[12px] font-bold text-ink">Microsoft Power BI</span>
                </div>
                <div className="flex gap-2 items-center" style={{ transform: "translateZ(15px)" }}>
                  {/* Pie chart SVG */}
                  <svg className="w-12 h-12" viewBox="0 0 36 36">
                    <g data-pie>
                      <path d="M18 18 L18 2 A16 16 0 0 1 34 18 Z" fill="#FBBF24" />
                      <path d="M18 18 L34 18 A16 16 0 1 1 18 2 Z" fill="#3B82F6" />
                    </g>
                  </svg>
                  <div className="flex-1 space-y-1">
                    <div data-count="45231" data-prefix="$" className="text-[14px] font-bold text-ink tabular-nums">$45,231</div>
                    <div className="text-[9px] text-emerald-600 font-medium">+20.5% vs last month</div>
                  </div>
                </div>
              </div>

              {/* CARD 3: Microsoft Power Platform (Bottom-Left) */}
              <div
                data-depth={0.9}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                className="absolute left-[-20px] bottom-[30px] w-[240px] rounded-xl border border-line bg-glass-card p-4 backdrop-blur-md shadow-lg transition-all duration-300 ease-out select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="block text-[11px] font-mono text-brand/90 font-bold uppercase tracking-wider mb-2" style={{ transform: "translateZ(10px)" }}>
                  Microsoft Power Platform
                </span>
                <div className="grid grid-cols-4 gap-2 text-center" style={{ transform: "translateZ(15px)" }}>
                  {[
                    { n: "Apps", c: "bg-purple-500/20 text-purple-600" },
                    { n: "Automate", c: "bg-blue-500/20 text-blue-600" },
                    { n: "Pages", c: "bg-teal-500/20 text-teal-600" },
                    { n: "Data", c: "bg-emerald-500/20 text-emerald-600" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 text-[10px] font-bold ${item.c}`}>
                        {item.n[0]}
                      </div>
                      <span className="text-[8px] text-slate font-medium leading-none">{item.n}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: Performance Indicator (Top-Right) */}
              <div
                data-depth={1.0}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                className="absolute right-[-20px] top-[40px] w-[210px] rounded-xl border border-line bg-glass-card p-4 backdrop-blur-md shadow-lg transition-all duration-300 ease-out select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="block text-[12px] font-bold text-ink mb-3" style={{ transform: "translateZ(10px)" }}>
                  Performance
                </span>
                <div className="flex gap-3 items-center" style={{ transform: "translateZ(15px)" }}>
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth="3.5" />
                      <circle data-ring="75" cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-brand)" strokeWidth="3.5" strokeDasharray="75 100" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[11px] font-black text-ink font-mono">75%</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-1.5 w-full rounded-full bg-base-2"><div className="h-full w-[75%] rounded-full bg-cyan-500" /></div>
                    <div className="h-1.5 w-full rounded-full bg-base-2"><div className="h-full w-[55%] rounded-full bg-brand" /></div>
                  </div>
                </div>
              </div>

              {/* CARD 5: App Integration (Bottom-Right) */}
              <div
                data-depth={0.8}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                className="absolute right-[-30px] bottom-[110px] w-[220px] rounded-xl border border-line bg-glass-card p-4 backdrop-blur-md shadow-lg transition-all duration-300 ease-out select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center justify-between mb-2.5" style={{ transform: "translateZ(10px)" }}>
                  <div className="flex h-5 w-11 items-center justify-center rounded bg-blue-600 px-1">
                    <span className="text-[9px] font-black text-white leading-none">App</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-brand uppercase tracking-wider">Integration</span>
                </div>
                <div className="h-12 w-full flex items-end gap-1 px-0.5" style={{ transform: "translateZ(15px)" }}>
                  {[15, 25, 30, 45, 55, 68, 85, 100].map((h, i) => (
                    <div key={i} data-bar className="flex-1 rounded-sm bg-gradient-to-t from-blue-600/40 to-blue-400" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate/70">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-[1px] bg-gradient-to-b from-brand to-transparent animate-glow-pulse" />
      </div>
    </section>
  );
}
