"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Workflow, Cpu, Boxes, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

interface Card { title: string; points?: string[] }

/**
 * Enterprise Solutions — every solution and all its capabilities are visible at once (no hover/
 * click hiding). Premium glass cards with a pointer spotlight + light sweep; value communicated
 * immediately. Approved titles + sub-items only.
 */
export function SolutionExplorer({
  eyebrow, heading, description, cards, cta,
}: {
  eyebrow?: string; heading: string; description?: string;
  cards: Card[]; cta?: { label: string; href: string };
}) {
  const icons = [BarChart3, Workflow, Cpu, Boxes];
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-aurora grid-fade">
      <div className="beam absolute top-[18%] left-[-6%] h-[30rem] w-[22rem] bg-brand/12" />
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-14">
          {eyebrow ? <span className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span> : null}
          <h2 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight">{heading}</h2>
          {description ? <p className="mt-4 text-base md:text-lg font-light text-slate leading-relaxed">{description}</p> : null}
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {cards.map((c, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={i} delay={(i % 2) * 90}>
                <div
                  onMouseMove={onMove}
                  className="group light-sweep glow-ring relative h-full overflow-hidden rounded-3xl border border-line bg-white/[0.025] p-7 md:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40"
                  style={{ backgroundImage: "radial-gradient(340px circle at var(--sx,80%) var(--sy,0%), rgba(67,245,255,0.07), transparent 70%)" }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 border border-brand/20 text-brand transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-ink group-hover:text-brand transition-colors">{c.title}</h3>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                    {(c.points ?? []).map((p, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-[14px] text-slate">
                        <Check className="h-4 w-4 shrink-0 text-brand/80" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        {cta ? (
          <Reveal className="mt-12">
            <Link href={cta.href} className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-6 py-3 text-[15px] font-medium text-ink backdrop-blur-md hover:border-brand/40 transition-colors">
              {cta.label}
              <ArrowRight className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
