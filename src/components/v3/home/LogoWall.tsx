"use client";

import React, { useEffect, useRef } from "react";

function ClientLogoBadge({ name }: { name: string }) {
  const words = name.trim().split(/\s+/);
  const initials = words.length === 1
    ? words[0].substring(0, 3).toUpperCase()
    : words.map((w) => w[0]).join("").substring(0, 3).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 via-corporate/15 to-transparent border border-brand/35 group-hover:border-brand group-hover:from-brand/30 transition-all duration-500 shadow-[0_0_12px_rgba(14,165,233,0.1)] shrink-0">
        <span className="font-mono text-xs font-black tracking-tight text-brand">
          {initials}
        </span>
      </div>
      <div className="flex flex-col text-left">
        <span className="whitespace-nowrap font-display text-sm font-bold tracking-tight text-ink/90 group-hover:text-brand transition-colors duration-500">
          {name}
        </span>
        <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-brand/70">
          Partner Institution
        </span>
      </div>
    </div>
  );
}

/**
 * Premium logo wall — infinite marquee with 3D hover tilt + GSAP scroll-reveal heading.
 */
export function LogoWall({ heading, logos }: { heading: string; logos: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const h = headingRef.current;
    if (!section || !h || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default || gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(h,
          { y: 30, opacity: 0, filter: "blur(6px)" },
          {
            y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: h, start: "top 90%", toggleActions: "play none none reverse" },
          }
        );
      }, section);
    })();

    return () => { ctx?.revert(); };
  }, []);

  if (!logos?.length) return null;
  const row = [...logos, ...logos];
  const isUrl = (s: string) => /^https?:\/\//.test(s) || s.startsWith("/");

  // 3D tilt on hover for plates
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  const Plate = ({ item }: { item: string }) => (
    <div className="group shrink-0 mx-3">
      <div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="light-sweep flex h-16 min-w-[210px] items-center justify-center rounded-2xl border border-line bg-base-2/80 px-5 backdrop-blur-md hover:border-brand/40 hover:bg-white hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
        style={{ transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99), border-color 0.5s, background 0.5s, box-shadow 0.5s", transformStyle: "preserve-3d" }}
      >
        {isUrl(item) ? (
          <div className="flex h-10 w-full items-center justify-center rounded-xl bg-white border border-slate-100 px-4 py-1.5 transition-all duration-300 group-hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] group-hover:scale-105" style={{ transform: "translateZ(15px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item}
              alt="Client Logo"
              className="max-h-7 max-w-[150px] object-contain brightness-105 contrast-105"
            />
          </div>
        ) : (
          <ClientLogoBadge name={item} />
        )}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative py-16 md:py-20 overflow-hidden border-y border-line/50">
      <p ref={headingRef} className="mb-10 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-slate">{heading}</p>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-base to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-base to-transparent" />
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {row.map((l, i) => <Plate key={i} item={l} />)}
        </div>
      </div>
    </section>
  );
}
