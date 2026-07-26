"use client";

import React from "react";
import {
  HeartPulse, GraduationCap, Landmark, Factory, ShoppingBag, Banknote,
  HandHeart, Rocket, Building2, Boxes, ArrowUpRight,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Industries — richer illustrated cards: per-industry icon, a representative gradient wash + fine
 * grid motif, pointer spotlight, and a hover affordance. Visual storytelling without fabricated
 * per-industry claims (copy is CMS-fillable).
 */
const MAP: { test: RegExp; Icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { test: /health/i, Icon: HeartPulse, tint: "16,230,216" },
  { test: /educat/i, Icon: GraduationCap, tint: "67,245,255" },
  { test: /govern/i, Icon: Landmark, tint: "58,123,255" },
  { test: /manufact/i, Icon: Factory, tint: "67,245,255" },
  { test: /retail/i, Icon: ShoppingBag, tint: "16,230,216" },
  { test: /financ|bank/i, Icon: Banknote, tint: "58,123,255" },
  { test: /ngo|non/i, Icon: HandHeart, tint: "16,230,216" },
  { test: /startup/i, Icon: Rocket, tint: "67,245,255" },
  { test: /enterprise|large/i, Icon: Building2, tint: "58,123,255" },
];
function meta(name: string) {
  return MAP.find((e) => e.test.test(name)) ?? { Icon: Boxes, tint: "67,245,255" };
}

export function IndustryGrid({ eyebrow, heading, items }: { eyebrow?: string; heading: string; items: string[] }) {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <section className="relative py-24 md:py-32 bg-aurora overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-14 text-center mx-auto">
          {eyebrow ? <span className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span> : null}
          <h2 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight">{heading}</h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((name, i) => {
            const { Icon, tint } = meta(name);
            return (
              <Reveal key={i} delay={(i % 5) * 60}>
                <div
                  onMouseMove={onMove}
                  className="group grid-fade relative h-48 overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40"
                  style={{ backgroundImage: `radial-gradient(200px circle at var(--sx,50%) var(--sy,0%), rgba(${tint},0.14), transparent 70%)` }}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl border transition-all duration-500 group-hover:scale-110"
                    style={{ backgroundColor: `rgba(${tint},0.10)`, borderColor: `rgba(${tint},0.28)`, color: `rgb(${tint})` }}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-brand opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span className="absolute left-5 bottom-5 right-5 text-[15px] font-semibold text-ink group-hover:text-brand transition-colors">
                    {name}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
