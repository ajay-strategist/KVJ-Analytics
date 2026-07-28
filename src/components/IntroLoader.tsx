"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Cinematic intro loader with GSAP-powered belt strips, logo reveal, and counter.
 * Inspired by Trionn.com's dramatic page-load experience.
 * Runs once per browser session, respects reduced-motion.
 */
/** Broadcast that the intro is finished so the hero can time its reveal to it.
 *  Sets a global flag (for consumers that mount/read late) and fires an event
 *  (for consumers already listening). Safe to call more than once. */
function signalIntroDone() {
  try {
    (window as unknown as { __kvjIntroDone?: boolean }).__kvjIntroDone = true;
    window.dispatchEvent(new Event("kvj:intro-done"));
  } catch { /* ignore */ }
}

export function IntroLoader() {
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("kvj-intro") === "1";
    } catch { /* ignore */ }

    if (reduce || seen) {
      setDone(true);
      signalIntroDone();
      return;
    }

    try { sessionStorage.setItem("kvj-intro", "1"); } catch { /* ignore */ }
    document.body.style.overflow = "hidden";

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    const run = async () => {
      const gsapMod = await import("gsap");
      const gsap = gsapMod.default || gsapMod;

      const container = containerRef.current;
      const counter = counterRef.current;
      const bar = barRef.current;
      const logo = logoRef.current;
      if (!container || !counter || !bar || !logo) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setDone(true);
            document.body.style.overflow = "";
            signalIntroDone();
          },
        });

        // Phase 1: Belt strips slide in from alternating directions
        const belts = container.querySelectorAll<HTMLElement>(".intro-belt");
        tl.set(belts, { xPercent: (i) => (i % 2 === 0 ? -110 : 110) });
        tl.to(belts, {
          xPercent: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: "power3.inOut",
        });

        // Phase 2: Logo glow in
        tl.fromTo(
          logo,
          { opacity: 0, filter: "blur(20px)", scale: 0.85 },
          { opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.7, ease: "power2.out" },
          "-=0.15"
        );

        // Phase 3: Counter 0→100 with progress bar
        const counterObj = { val: 0 };
        tl.to(counterObj, {
          val: 100,
          duration: 1.3,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = Math.round(counterObj.val);
            counter.textContent = String(v).padStart(2, "0");
            if (bar) bar.style.width = `${v}%`;
          },
        }, "-=0.3");

        // Phase 4: Everything fades then strips exit up/down
        tl.to(
          [logo, counter.parentElement, bar.parentElement?.parentElement],
          { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.4, ease: "power2.in" },
          "+=0.15"
        );

        tl.to(belts, {
          yPercent: (i) => (i % 2 === 0 ? -110 : 110),
          duration: 0.55,
          stagger: 0.03,
          ease: "power4.inOut",
        }, "-=0.15");

        // Final container fade out
        tl.to(container, { opacity: 0, duration: 0.25, ease: "power1.out" });
      });
    };

    run();

    return () => {
      ctx?.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center"
      style={{ background: "#050608" }}
    >
      {/* Belt strips — 10 horizontal bars */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="intro-belt absolute left-0 w-full bg-[#0A0D13]"
          style={{
            top: `${i * 10}%`,
            height: "10.1%",
            borderTop: "1px solid rgba(67,245,255,0.06)",
          }}
        />
      ))}

      {/* Center content — overlaid on top of belts */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 right-[-6rem] h-80 w-80 rounded-full bg-brand/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-corporate/10 blur-[100px]" />

        {/* Logo */}
        <div ref={logoRef} className="mb-10" style={{ opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="KVJ Analytics"
            className="h-9 md:h-12 w-auto object-contain brightness-0 invert opacity-90"
          />
        </div>

        {/* Counter */}
        <div className="relative">
          <div
            ref={counterRef}
            className="font-display font-medium leading-none text-white text-[72px] md:text-[110px] tabular-nums tracking-tight text-glow-hero"
          >
            00
          </div>
          <span className="absolute -right-8 md:-right-10 top-2 text-[28px] md:text-[36px] text-brand font-light">%</span>
        </div>

        {/* Progress bar */}
        <div className="relative mt-8 h-[2px] w-56 md:w-72 overflow-hidden rounded-full bg-white/10">
          <div
            ref={barRef}
            className="h-full rounded-full"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, #43F5FF, #3A7BFF)",
              boxShadow: "0 0 20px rgba(67, 245, 255, 0.5)",
            }}
          />
        </div>

        <p className="relative mt-6 text-[11px] uppercase tracking-[0.3em] text-white/40">
          Transforming Data Into Decisions
        </p>
      </div>
    </div>
  );
}
