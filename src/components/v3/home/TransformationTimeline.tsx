"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, PenTool, Code2, Rocket, TrendingUp, Compass, Layers, Wrench } from "lucide-react";

interface Step { no?: string; title: string; body?: string }

/**
 * Digital-transformation framework as a premium scroll journey: a gradient rail grows and stage
 * nodes (with meaningful icons) light up as they enter view. Reduced-motion shows all active.
 * Stage descriptions are CMS-fillable (not fabricated).
 */
const ICONS: { test: RegExp; Icon: React.ComponentType<{ className?: string }> }[] = [
  { test: /discover/i, Icon: Search }, { test: /strateg/i, Icon: Compass },
  { test: /design/i, Icon: PenTool }, { test: /develop|build/i, Icon: Code2 },
  { test: /deploy/i, Icon: Rocket }, { test: /optimi/i, Icon: TrendingUp },
  { test: /support|maintain/i, Icon: Wrench },
];
const iconFor = (t: string) => ICONS.find((e) => e.test.test(t))?.Icon ?? Layers;

export function TransformationTimeline({
  eyebrow, heading, steps,
}: { eyebrow?: string; heading: string; steps: Step[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setActive(steps.length - 1); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive((p) => Math.max(p, Number((e.target as HTMLElement).dataset.idx)));
      });
    }, { threshold: 0.55 });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="beam absolute top-[30%] right-[-4%] h-[30rem] w-[22rem] bg-corporate/10" />
      <div className="relative z-10 mx-auto max-w-[920px] px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          {eyebrow ? <span className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span> : null}
          <h2 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight">{heading}</h2>
        </div>

        <div className="relative pl-16 md:pl-24">
          <div className="absolute left-[30px] md:left-[42px] top-3 bottom-3 w-[2px] bg-line" />
          <div className="absolute left-[30px] md:left-[42px] top-3 w-[2px] bg-gradient-to-b from-brand via-brand to-corporate transition-[height] duration-700 ease-out"
            style={{ height: `${((active + 1) / steps.length) * 100}%` }} />

          <div className="space-y-8 md:space-y-12">
            {steps.map((s, i) => {
              const on = i <= active;
              const Icon = iconFor(s.title);
              return (
                <div key={i} data-idx={i} ref={(el) => { refs.current[i] = el; }} className="relative">
                  <span className={`absolute -left-16 md:-left-24 top-0 grid h-14 w-14 md:h-[68px] md:w-[68px] place-items-center rounded-2xl border transition-all duration-500 ${
                    on ? "border-brand/50 bg-brand/12 text-brand shadow-[0_0_28px_-6px_rgba(16,185,129,0.7)] scale-100"
                       : "border-line bg-base text-muted scale-90"}`}>
                    <Icon className="h-6 w-6 md:h-7 md:w-7" />
                  </span>
                  <div className={`light-sweep rounded-2xl border p-6 transition-all duration-500 ${
                    on ? "border-brand/30 bg-white/[0.03]" : "border-line bg-white/[0.01] opacity-55"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-sm font-bold ${on ? "text-brand" : "text-muted"}`}>{s.no ?? String(i + 1).padStart(2, "0")}</span>
                      <h3 className={`text-xl font-bold ${on ? "text-ink" : "text-slate"}`}>{s.title}</h3>
                    </div>
                    {s.body ? <p className="mt-2 text-sm font-light text-slate leading-relaxed">{s.body}</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
