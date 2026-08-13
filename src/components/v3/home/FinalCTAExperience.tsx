"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Magnetic } from "./Magnetic";

interface Cta { label: string; href: string }

/**
 * Cinematic closing CTA — 3D glass panel scales in from depth, glowing sphere
 * with orbiting particles, split-text character reveal, all GSAP-powered.
 */
export function FinalCTAExperience({
  title, description, primaryCta, secondaryCta,
}: { title: string; description: string; primaryCta: Cta; secondaryCta: Cta }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const titleEl = titleRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Panel scales up from depth
        if (panel) {
          gsap.fromTo(
            panel,
            { scale: 0.7, opacity: 0, filter: "blur(12px)", rotateX: 8 },
            {
              scale: 1, opacity: 1, filter: "blur(0px)", rotateX: 0,
              duration: 1.2, ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none reverse" },
            }
          );
        }

        // Title character reveal
        if (titleEl) {
          let text = titleEl.dataset.splitText; if (text == null) { text = titleEl.textContent || ""; titleEl.dataset.splitText = text; }
          const clean = text.replace(/\?$/, "");
          const words = clean.split(/\s+/).filter(Boolean);
          titleEl.innerHTML = words
            .map(
              (word) =>
                `<span class="split-word">${word
                  .split("")
                  .map((ch) => `<span class="split-char">${ch}</span>`)
                  .join("")}</span>`
            )
            .join('<span style="display:inline-block;width:0.3em"></span>')
            + '<span class="split-char text-brand">?</span>';

          gsap.fromTo(
            titleEl.querySelectorAll(".split-char"),
            { y: "100%", opacity: 0, rotateX: 60 },
            {
              y: "0%", opacity: 1, rotateX: 0,
              duration: 0.7, stagger: 0.02, ease: "power4.out",
              scrollTrigger: { trigger: titleEl, start: "top 85%", toggleActions: "play none none none" },
              // Un-clip the words once revealed so the heading's text-glow isn't
              // clipped into a faint box behind each word (clarity).
              onComplete: () => {
                titleEl.querySelectorAll<HTMLElement>(".split-word").forEach((w) => { w.style.overflow = "visible"; });
              },
            }
          );
        }
      }, section);
    })();

    return () => { ctx?.revert(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 overflow-hidden bg-base perspective-container">
      <div className="absolute inset-0 particle-field opacity-50 pointer-events-none" />



      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <div
          ref={panelRef}
          className="card-premium rounded-[32px] px-8 py-14 md:px-16 md:py-20"
          style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
        >
          <h2
            ref={titleRef}
            className="font-display font-bold text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink text-glow-hero"
            style={{ perspective: "1000px" }}
          >
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base md:text-lg font-light text-slate leading-relaxed">
            {description}
          </p>

          {/* Stats strip */}
          <div className="mt-10 mb-10 grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Projects Delivered" },
              { value: "98%", label: "Client Retention" },
              { value: "12+", label: "Years of Expertise" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-line bg-white/[0.04] px-4 py-4 hover:border-brand/40 transition-colors">
                <div className="font-display text-2xl md:text-3xl font-black text-brand">{s.value}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate/80">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Magnetic strength={0.5}>
              <Link
                href={primaryCta.href}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-[15px] font-semibold text-[#04121a] gradient-move shadow-[0_10px_44px_-8px_rgba(16,185,129,0.65)]"
              >
                <span className="light-sweep absolute inset-0 rounded-full" />
                <span className="relative">{primaryCta.label}</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.4}>
              <Link
                href={secondaryCta.href}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-8 py-4 text-[15px] font-medium text-ink backdrop-blur-md hover:border-brand/40 transition-colors"
              >
                {secondaryCta.label}
                <ArrowUpRight className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
