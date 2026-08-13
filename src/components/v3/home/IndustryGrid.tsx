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
// All industry cards unified to brand cyan for a cohesive premium look
const TINT = "16,185,129";
const MAP: { test: RegExp; Icon: React.ComponentType<{ className?: string }> }[] = [
  { test: /health/i, Icon: HeartPulse },
  { test: /educat/i, Icon: GraduationCap },
  { test: /govern/i, Icon: Landmark },
  { test: /manufact/i, Icon: Factory },
  { test: /retail/i, Icon: ShoppingBag },
  { test: /financ|bank/i, Icon: Banknote },
  { test: /ngo|non/i, Icon: HandHeart },
  { test: /startup/i, Icon: Rocket },
  { test: /enterprise|large/i, Icon: Building2 },
];
function meta(name: string) {
  return { ...(MAP.find((e) => e.test.test(name)) ?? { Icon: Boxes }), tint: TINT };
}

/**
 * Choose the column count (3–5) that keeps rows the most balanced for a given
 * item count, so we never get a lonely orphan card on the last row. Prefers 4.
 */
function bestCols(n: number): 3 | 4 | 5 {
  if (n <= 3) return (n as 3);
  const score = (cols: number) => {
    const rem = n % cols;               // items on the last (partial) row
    const orphan = rem === 0 ? 0 : cols - rem; // empty slots on last row
    return orphan;
  };
  // Prefer 4, then whichever of 3/5 leaves the fewest empty slots.
  const options: (3 | 4 | 5)[] = [4, 3, 5];
  return options.reduce((best, c) => (score(c) < score(best) ? c : best), 4 as 3 | 4 | 5);
}
const COL_CLASS: Record<3 | 4 | 5, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

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

        <div className={`grid grid-cols-2 ${COL_CLASS[bestCols(items.length)]} gap-6 justify-center`}>
          {items.map((name, i) => {
            const { Icon, tint } = meta(name);
            return (
              <div
                key={i}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="industry-card group grid-fade relative h-52 overflow-hidden rounded-2xl border card-tone-emerald p-5 hover:border-brand/60"
                style={{
                  backgroundImage: `radial-gradient(220px circle at var(--sx,50%) var(--sy,0%), rgba(${tint},0.16), transparent 70%)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99), border-color 0.5s ease, background 0.4s ease",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.35)",
                }}
              >
                {/* Icon badge */}
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl border transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]"
                  style={{ backgroundColor: `rgba(${tint},0.10)`, borderColor: `rgba(${tint},0.30)`, color: `rgb(${tint})`, transform: "translateZ(25px)" }}
                >
                  <Icon className="h-6 w-6" />
                </span>

                {/* Arrow */}
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-brand opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                {/* Name */}
                <span className="absolute left-5 bottom-5 right-5 text-[15px] font-semibold text-ink group-hover:text-brand transition-colors duration-300" style={{ transform: "translateZ(15px)" }}>
                  {name}
                </span>

                {/* Bottom shimmer line on hover */}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-brand/80 via-brand to-transparent transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
