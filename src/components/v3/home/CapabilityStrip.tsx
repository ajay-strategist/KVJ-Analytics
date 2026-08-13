"use client";

import React, { useState, useEffect, useRef } from "react";
import { BarChart3, Database, Cpu, Layers } from "lucide-react";

/**
 * Interactive capability strip with GSAP scroll-driven 3D entrances.
 * Items scale from small+blurred → full as they enter the viewport.
 */
const ICONS = [BarChart3, Database, Cpu, Layers];

export function CapabilityStrip({ items }: { items: string[] }) {
  const [on, setOn] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const tiles = el.querySelectorAll(".cap-tile");
        gsap.fromTo(
          tiles,
          {
            y: 40,
            opacity: 0,
            scale: 0.85,
            filter: "blur(8px)",
            rotateX: 15,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            rotateX: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, el);
    })();

    return () => { ctx?.revert(); };
  }, []);

  if (!items?.length) return null;
  const caps = items.slice(0, 4);

  return (
    <section className="relative -mt-2 border-y border-line/50 bg-white/[0.015] perspective-container">
      <div ref={stripRef} className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-line/40">
          {caps.map((label, i) => {
            const Icon = ICONS[i % ICONS.length];
            const active = on === i;
            return (
              <button
                key={i}
                onMouseEnter={() => setOn(i)}
                onMouseLeave={() => setOn(null)}
                onFocus={() => setOn(i)}
                onBlur={() => setOn(null)}
                className="cap-tile group relative flex w-full items-center gap-3 overflow-hidden px-5 py-6 text-left transition-colors hover:bg-brand/[0.03] focus:outline-none focus-visible:bg-brand/[0.05]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-all duration-300 ${
                  active ? "border-brand/40 bg-brand/15 text-brand scale-110" : "border-line bg-white/[0.03] text-slate"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[13px] font-semibold leading-tight transition-colors ${active ? "text-brand" : "text-ink"}`}>
                    {label}
                  </span>
                  <span className="mt-2 block h-5">
                    <BarsMini on={active} idx={i} />
                  </span>
                </span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-brand to-corporate transition-all duration-500 ${active ? "w-full" : "w-0"}`} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BarsMini({ on, idx }: { on: boolean; idx: number }) {
  const colors = ["#10B981", "#0D9488", "#34D399", "#10B981"];
  const hs = [[40,70,50,90,60],[60,40,80,55,75],[50,80,45,70,90],[70,50,85,60,40]];
  const h = hs[idx % hs.length];
  return (
    <svg viewBox="0 0 80 20" className="h-full w-24">
      {h.map((v, i) => (
        <rect key={i} x={i * 16} y={20 - (on ? v : v * 0.5) / 5} width="9" height={(on ? v : v * 0.5) / 5}
          rx="1.5" className="transition-all duration-500" fill={on ? colors[idx % colors.length] : "rgba(167,177,196,0.4)"} />
      ))}
    </svg>
  );
}
