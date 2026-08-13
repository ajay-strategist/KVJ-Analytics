"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Workflow, Cpu, Boxes, Check } from "lucide-react";

interface Card { title: string; points?: string[] }

/**
 * Enterprise Solutions — cards fly in from 3D space with GSAP.
 * Mouse spotlight + 3D tilt on hover. Premium glass cards.
 */
export function SolutionExplorer({
  eyebrow, heading, description, cards, cta,
}: {
  eyebrow?: string; heading: string; description?: string;
  cards: Card[]; cta?: { label: string; href: string };
}) {
  const icons = [BarChart3, Workflow, Cpu, Boxes];
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 3D card entrance via GSAP
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const heading = headingRef.current;
    if (!section || !grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Heading split-text reveal
        if (heading) {
          // Cache original text so a re-run never re-splits the (space-less) DOM.
          let text = heading.dataset.splitText;
          if (text == null) { text = heading.textContent || ""; heading.dataset.splitText = text; }
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
            { y: "100%", opacity: 0 },
            {
              y: "0%", opacity: 1, duration: 0.7, stagger: 0.02, ease: "power4.out",
              scrollTrigger: { trigger: heading, start: "top 85%", toggleActions: "play none none reverse" },
            }
          );
        }

        // Cards fly in from 3D depth
        const cardEls = grid.querySelectorAll(".solution-card");
        cardEls.forEach((card, i) => {
          const fromLeft = i % 2 === 0;
          gsap.fromTo(
            card,
            {
              x: fromLeft ? -100 : 100,
              rotateY: fromLeft ? 20 : -20,
              z: -200,
              opacity: 0,
              filter: "blur(6px)",
            },
            {
              x: 0, rotateY: 0, z: 0, opacity: 1, filter: "blur(0px)",
              duration: 1,
              delay: i * 0.12,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
            }
          );
        });
      }, section);
    })();

    return () => { ctx?.revert(); };
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);

    // 3D tilt on hover
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  };

  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-aurora grid-fade perspective-container">
      <div className="beam absolute top-[18%] left-[-6%] h-[30rem] w-[22rem] bg-brand/12" />
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          {eyebrow ? <span className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span> : null}
          <h2 ref={headingRef} className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight" style={{ perspective: "1000px" }}>{heading}</h2>
          {description ? <p className="mt-4 text-base md:text-lg font-light text-slate leading-relaxed">{description}</p> : null}
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {cards.map((c, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={i}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="solution-card group light-sweep glow-ring relative h-full overflow-hidden rounded-3xl border card-tone-emerald p-7 md:p-8 transition-all duration-500 hover:border-brand/50"
                style={{
                  backgroundImage: "radial-gradient(340px circle at var(--sx,80%) var(--sy,0%), rgba(16,185,129,0.07), transparent 70%)",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99), border-color 0.5s ease",
                }}
              >
                {/* Numbered badge */}
                <span className="absolute right-6 top-6 font-mono text-[11px] font-black text-brand/50 group-hover:text-brand transition-colors duration-500 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="mb-4 flex items-center gap-3" style={{ transform: "translateZ(30px)" }}>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 border border-brand/20 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-ink group-hover:text-brand transition-colors">{c.title}</h3>
                </div>

                {/* Separator */}
                <div className="mb-5 h-px bg-gradient-to-r from-brand/20 via-line to-transparent" style={{ transform: "translateZ(15px)" }} />

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5" style={{ transform: "translateZ(15px)" }}>
                  {(c.points ?? []).map((p, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-[14px] text-slate">
                      <Check className="h-4 w-4 shrink-0 text-brand/80" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {cta ? (
          <div className="mt-12">
            <Link href={cta.href} className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-6 py-3 text-[15px] font-medium text-ink backdrop-blur-md hover:border-brand/40 transition-colors">
              {cta.label}
              <ArrowRight className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
