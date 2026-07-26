"use client";

import React from "react";
import { Brain, Workflow, Sparkles, Layers, Puzzle, Rocket } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

interface Card { title: string; body?: string }

/**
 * "Why KVJ" as a premium split: a large sticky statement (left) beside interactive feature blocks
 * (right) that reveal on scroll and lift/glow on hover. Storytelling, not a repeated card grid.
 */
export function WhyKvj({ eyebrow, heading, cards }: { eyebrow?: string; heading: string; cards: Card[] }) {
  const icons = [Brain, Workflow, Sparkles, Layers, Puzzle, Rocket];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="beam absolute bottom-[-10rem] right-[-4%] h-[34rem] w-[24rem] bg-corporate/12" />
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* statement */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                {eyebrow ? <span className="mb-5 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span> : null}
                <h2 className="font-display font-bold text-3xl md:text-5xl leading-[1.08] tracking-tight text-ink">
                  {heading}
                </h2>
                <div className="mt-8 h-px w-40 bg-gradient-to-r from-brand to-transparent" />
                <p className="mt-6 text-base font-light text-slate leading-relaxed max-w-sm">
                  Enterprise capability across intelligence, automation and platforms — engineered around
                  measurable business outcomes.
                </p>
              </Reveal>
            </div>
          </div>

          {/* feature blocks */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((c, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Reveal key={i} delay={(i % 2) * 90}>
                  <div className="group light-sweep glow-ring relative h-full rounded-2xl border border-line bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:bg-white/[0.04]">
                    <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand/10 border border-brand/20 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-ink group-hover:text-brand transition-colors">{c.title}</h3>
                    {c.body ? <p className="mt-2 text-sm font-light text-slate leading-relaxed">{c.body}</p> : null}
                    <span className="absolute right-5 top-6 text-[11px] font-mono text-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      0{i + 1}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
