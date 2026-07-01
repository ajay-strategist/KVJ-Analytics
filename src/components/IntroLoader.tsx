"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Cinematic intro: a 0 → 100 counter on a dark panel that wipes upward to
 * reveal the site. Runs once per browser session, respects reduced-motion,
 * and locks scroll only while active. Brand/number only — no fabricated copy.
 */
export function IntroLoader() {
  const [count, setCount] = useState(0);
  const [wiping, setWiping] = useState(false);
  const [done, setDone] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("kvj-intro") === "1";
    } catch { /* ignore */ }

    if (reduce || seen) {
      setDone(true);
      return;
    }

    try { sessionStorage.setItem("kvj-intro", "1"); } catch { /* ignore */ }
    document.body.style.overflow = "hidden";

    const duration = 1500;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setWiping(true);
        window.setTimeout(() => {
          setDone(true);
          document.body.style.overflow = "";
        }, 900);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#0B0A14] ${wiping ? "intro-wipe" : ""}`}
    >
      {/* ambient accent glows */}
      <div className="pointer-events-none absolute -top-24 right-[12%] h-80 w-80 rounded-full bg-[#6E56F8]/25 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[8%] h-72 w-72 rounded-full bg-[#06B6D4]/15 blur-[90px]" />

      {/* brand wordmark */}
      <img
        src="/logo.png"
        alt="KVJ Analytics"
        className="relative h-9 md:h-11 w-auto object-contain brightness-0 invert mb-10 opacity-90"
      />

      {/* counter */}
      <div className="relative font-display font-medium leading-none text-white text-[64px] md:text-[96px] tabular-nums tracking-tight">
        {String(count).padStart(2, "0")}
        <span className="text-[#8C74FF]">%</span>
      </div>

      {/* progress bar */}
      <div className="relative mt-8 h-[2px] w-56 md:w-72 overflow-hidden rounded-full bg-white/10">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            width: `${count}%`,
            background: "linear-gradient(90deg, #06B6D4, #6E56F8, #D4AF37)",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      <p className="relative mt-6 text-[11px] uppercase tracking-[0.3em] text-white/40">
        Transforming Data Into Decisions
      </p>
    </div>
  );
}
