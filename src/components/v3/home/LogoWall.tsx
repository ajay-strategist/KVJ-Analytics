"use client";

import React from "react";

/**
 * Premium logo wall — infinite dual-row marquee, grayscale plates that light up on hover.
 * Admin uploads logos (image URLs) or names; no ratings, no fake stats. Pauses on hover.
 */
export function LogoWall({ heading, logos }: { heading: string; logos: string[] }) {
  if (!logos?.length) return null;
  const row = [...logos, ...logos]; // seamless loop

  const isUrl = (s: string) => /^https?:\/\//.test(s) || s.startsWith("/");

  const Plate = ({ item }: { item: string }) => (
    <div className="group shrink-0 mx-3">
      <div className="light-sweep flex h-16 min-w-[190px] items-center justify-center rounded-2xl border border-line bg-white/[0.02] px-8 backdrop-blur-md transition-all duration-500 hover:border-brand/40 hover:bg-white/[0.05]">
        {isUrl(item) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item} alt="" className="max-h-8 w-auto opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0" />
        ) : (
          <span className="whitespace-nowrap text-base font-semibold text-ink/45 transition-colors duration-500 group-hover:text-ink">
            {item}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section className="relative py-16 md:py-20 overflow-hidden border-y border-line/50">
      <p className="mb-10 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-slate">{heading}</p>
      <div className="relative">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-base to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-base to-transparent" />
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {row.map((l, i) => <Plate key={i} item={l} />)}
        </div>
      </div>
    </section>
  );
}
