"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "./Container";

export interface HeroSlide {
  eyebrow?: string;
  headline?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: Record<string, unknown> | string; // Sanity image (optional)
  imageUrl?: string; // Direct image URL or /public path (optional)
  theme?: "blue" | "navy" | "teal"; // Fallback gradient when no image is set
}

interface HeroCarouselProps {
  slides?: HeroSlide[];
  /** Auto-advance interval in ms */
  interval?: number;
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    eyebrow: "Analytics • Automation • Training • Educational Technology",
    headline: "Transforming Data Into Decisions",
    subtext:
      "KVJ Analytics helps corporates and educational institutions automate operations, visualize data, improve decision-making, and build industry-ready talent.",
    ctaLabel: "Contact Our Team",
    ctaHref: "/contact",
    theme: "blue",
  },
  {
    eyebrow: "Corporate Solutions",
    headline: "Smarter Reporting. Faster Decisions.",
    subtext:
      "We help organizations automate reporting, improve visibility, optimize workflows, and make faster business decisions.",
    ctaLabel: "Explore Corporate Solutions",
    ctaHref: "/corporate",
    theme: "navy",
  },
  {
    eyebrow: "Educational Solutions",
    headline: "Building Industry-Ready Learning Systems",
    subtext:
      "KVJ Analytics helps institutions bridge the gap between academics and industry through practical training, automation, and analytics platforms.",
    ctaLabel: "Explore Educational Solutions",
    ctaHref: "/education",
    theme: "teal",
  },
];

const THEME_BG: Record<NonNullable<HeroSlide["theme"]>, string> = {
  blue: "linear-gradient(135deg, #1A56DB 0%, #1E40AF 55%, #0F1C3F 100%)",
  navy: "linear-gradient(135deg, #0F1C3F 0%, #1E3A5F 55%, #1A56DB 100%)",
  teal: "linear-gradient(135deg, #0891B2 0%, #1A56DB 60%, #0F1C3F 100%)",
};

export function HeroCarousel({ slides, interval = 6000 }: HeroCarouselProps) {
  const data = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  const count = data.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Auto-advance (respects reduced-motion + pause on hover/focus)
  useEffect(() => {
    if (count <= 1 || paused) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    timerRef.current = setInterval(next, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count, paused, interval, next]);

  return (
    <section
      className="relative w-full overflow-hidden bg-navy select-none"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[58vh] min-h-[420px] md:h-[70vh] md:min-h-[520px] max-h-[760px]">
        {data.map((slide, i) => {
          const active = i === index;
          const imgUrl = slide.image
            ? urlFor(slide.image).width(2000).height(1100).fit("crop").url()
            : null;
          return (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!active}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              {/* Background: Sanity image OR themed gradient */}
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={slide.headline || "Slide"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: THEME_BG[slide.theme || "blue"] }}
                />
              )}

              {/* Readability overlay + subtle grid */}
              <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/60 to-navy/20" />
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.12]" />

              {/* Content */}
              <Container className="relative z-10 h-full flex items-center">
                <div
                  className={`max-w-2xl transition-all duration-700 ${
                    active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  {slide.eyebrow && (
                    <span className="inline-block text-[12px] font-extrabold uppercase tracking-[0.18em] text-cta mb-4">
                      {slide.eyebrow}
                    </span>
                  )}
                  {slide.headline && (
                    <h2 className="font-display font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-5">
                      {slide.headline}
                    </h2>
                  )}
                  {slide.subtext && (
                    <p className="text-base md:text-lg text-white/85 leading-relaxed mb-8 max-w-xl">
                      {slide.subtext}
                    </p>
                  )}
                  {slide.ctaLabel && slide.ctaHref && (
                    <Link
                      href={slide.ctaHref}
                      className="inline-flex items-center justify-center rounded-btn px-7 py-3.5 font-bold text-[15px] text-white transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(135deg, #F97316 0%, #EA6C00 100%)",
                        boxShadow: "0 4px 20px rgba(249,115,22,0.42)",
                      }}
                    >
                      {slide.ctaLabel}
                    </Link>
                  )}
                </div>
              </Container>
            </div>
          );
        })}

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 grid place-items-center h-11 w-11 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 grid place-items-center h-11 w-11 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {data.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-cta" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
