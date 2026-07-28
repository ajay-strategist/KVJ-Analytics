"use client";

import React, { useEffect, useRef } from "react";
import {
  HeartPulse, GraduationCap, Landmark, Factory, ShoppingBag, Banknote,
  HandHeart, Rocket, Building2, Boxes, ArrowUpRight,
} from "lucide-react";

/**
 * Industries — 3D card-flip entrance via GSAP. Each card starts rotated 90°
 * on the Y-axis and flips to face-front as the user scrolls. Hover: perspective
 * tilt + glow intensification.
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
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Heading reveal
        const h = headingRef.current;
        if (h) {
          gsap.fromTo(h,
            { y: 40, opacity: 0, filter: "blur(8px)" },
            {
              y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: h, start: "top 88%", toggleActions: "play none none reverse" },
            }
          );
        }

        // 3D card-flip entrance
        const cards = section.querySelectorAll<HTMLElement>(".industry-card");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { rotateY: 90, opacity: 0, scale: 0.85 },
            {
              rotateY: 0, opacity: 1, scale: 1,
              duration: 0.8,
              delay: i * 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none reverse" },
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
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  };

  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-aurora overflow-hidden perspective-container">
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 text-center mx-auto">
          {eyebrow ? <span className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span> : null}
          <h2 ref={headingRef} className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight">{heading}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((name, i) => {
            const { Icon, tint } = meta(name);
            return (
              <div
                key={i}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="industry-card group grid-fade relative h-48 overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-5 hover:border-brand/40"
                style={{
                  backgroundImage: `radial-gradient(200px circle at var(--sx,50%) var(--sy,0%), rgba(${tint},0.14), transparent 70%)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99), border-color 0.5s ease",
                }}
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl border transition-all duration-500 group-hover:scale-110"
                  style={{ backgroundColor: `rgba(${tint},0.10)`, borderColor: `rgba(${tint},0.28)`, color: `rgb(${tint})`, transform: "translateZ(25px)" }}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-brand opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute left-5 bottom-5 right-5 text-[15px] font-semibold text-ink group-hover:text-brand transition-colors" style={{ transform: "translateZ(15px)" }}>
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
