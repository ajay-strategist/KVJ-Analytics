import React from "react";
import { MapPin } from "lucide-react";

interface LogoStripProps {
  title?: string;
  items: string[];
}

export function LogoStrip({ title = "Regions We Serve", items }: LogoStripProps) {
  return (
    <div className="py-12 border-y border-line/50 bg-surface relative overflow-hidden regions Regions">
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full blur-3xl bg-brand/5 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full blur-3xl bg-cta/5 pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Brand Logo in the Ribbon Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <img
            src="/logo.png"
            alt="KVJ Analytics Logo"
            className="h-9 w-auto object-contain mb-3 opacity-95 hover:opacity-100 transition-opacity duration-300"
          />
          {title && (
            <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-slate/75 label section-label">
              {title}
            </p>
          )}
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center gap-4 md:gap-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-2.5 bg-white pl-5 pr-4 py-2.5 rounded-full border border-line/80 shadow-soft hover:border-brand/50 transition-all duration-300 hover:scale-[1.03] cursor-default"
            >
              <span className="text-[14.5px] font-bold font-display tracking-tight text-ink whitespace-nowrap">
                {item}
              </span>
              <MapPin className="h-4 w-4 text-cta shrink-0 transition-transform duration-300 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
