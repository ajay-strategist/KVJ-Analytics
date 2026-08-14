"use client";

import React, { useEffect, useRef } from "react";
import { Brain, Workflow, Sparkles, Layers, Puzzle, Rocket } from "lucide-react";

interface Card { title: string; body?: string }

/**
 * "Why KVJ" — dramatic split-text heading + 3D feature block reveals.
 * Each feature block slides in from right with perspective rotation.
 */
export function WhyKvj({ eyebrow, heading, cards }: { eyebrow?: string; heading: string; cards: Card[] }) {
  const icons = [Brain, Workflow, Sparkles, Layers, Puzzle, Rocket];
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const heading = headingRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Heading character reveal
        if (heading) {
          let text = heading.dataset.splitText; if (text == null) { text = heading.textContent || ""; heading.dataset.splitText = text; }
          const words = text.split(/\s+/).filter(Boolean);
          heading.innerHTML = words
            .map(
              (word) =>
                `<span class="split-word">${word
                  .split("")
                  .map((ch) => `<span class="split-char">${ch}</span>`)
                  .join("")}</span>`
            )
            .join('<span style="display:inline-block;width:0.3em"></span>');

          gsap.fromTo(
            heading.querySelectorAll(".split-char"),
            { y: "110%", opacity: 0, rotateX: 70 },
            {
              y: "0%", opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.025, ease: "power4.out",
              scrollTrigger: { trigger: heading, start: "top 85%", toggleActions: "play none none reverse" },
            }
          );
        }

        // Feature blocks: 3D slide from right with rotation
        if (grid) {
          const blocks = grid.querySelectorAll(".why-block");
          blocks.forEach((block, i) => {
            gsap.fromTo(
              block,
              {
                x: 80,
                rotateY: -15,
                z: -100,
                opacity: 0,
                filter: "blur(4px)",
              },
              {
                x: 0, rotateY: 0, z: 0, opacity: 1, filter: "blur(0px)",
                duration: 0.9,
                delay: i * 0.1,
                ease: "power3.out",
                scrollTrigger: { trigger: block, start: "top 90%", toggleActions: "play none none reverse" },
              }
            );
          });
        }
      }, section);
    })();

    return () => { ctx?.revert(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden perspective-container">
      <div className="beam absolute bottom-[-10rem] right-[-4%] h-[34rem] w-[24rem] bg-corporate/12" />
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* statement */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              {eyebrow ? <span className="mb-5 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span> : null}
              <h2
                ref={headingRef}
                className="font-display font-bold text-3xl md:text-5xl leading-[1.08] tracking-tight text-ink"
                style={{ perspective: "1000px" }}
              >
                {heading}
              </h2>
              <div className="mt-8 h-px w-40 bg-gradient-to-r from-brand to-transparent" />
              <p className="mt-6 text-base font-light text-slate leading-relaxed max-w-sm">
                Enterprise capability across intelligence, automation and platforms — engineered around
                measurable business outcomes.
              </p>
            </div>
          </div>

          {/* feature blocks */}
          <div ref={gridRef} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((c, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div
                  key={i}
                  className="why-block group light-sweep glow-ring relative h-full rounded-2xl border card-tone-emerald p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.08)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand/10 border border-brand/20 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold text-ink group-hover:text-brand transition-colors">{c.title}</h3>
                  {c.body ? <p className="mt-2 text-sm font-light text-slate leading-relaxed">{c.body}</p> : null}
                  <span className="absolute right-5 top-6 text-[11px] font-mono text-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    0{i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
