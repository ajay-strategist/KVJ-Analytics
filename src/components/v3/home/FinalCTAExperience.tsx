"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "./Magnetic";

interface Cta { label: string; href: string }

/**
 * Memorable closing CTA — a glowing sphere + rotating aura behind a glass statement panel, over an
 * animated particle field. Magnetic buttons. Reduced-motion safe.
 */
export function FinalCTAExperience({
  title, description, primaryCta, secondaryCta,
}: { title: string; description: string; primaryCta: Cta; secondaryCta: Cta }) {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden bg-base">
      <div className="absolute inset-0 particle-field opacity-50 pointer-events-none" />
      {/* glowing sphere + aura */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="aura h-[38rem] w-[38rem] rounded-full opacity-40"
          style={{ background: "conic-gradient(from 0deg, rgba(67,245,255,0.25), rgba(58,123,255,0.15), transparent 45%, rgba(22,230,216,0.2), transparent 80%, rgba(67,245,255,0.25))", filter: "blur(30px)" }} />
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-64 w-64 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(67,245,255,0.5),rgba(58,123,255,0.15)_45%,transparent_70%)] blur-2xl animate-glow-pulse" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <Reveal variant="scale">
          <div className="glow-ring rounded-[32px] card-glass px-8 py-14 md:px-16 md:py-20">
            <h2 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
              {title.replace(/\?$/, "")}
              <span className="text-brand">?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base md:text-lg font-light text-slate leading-relaxed">
              {description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Magnetic strength={0.5}>
                <Link href={primaryCta.href}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-[15px] font-semibold text-[#04121a] gradient-move shadow-[0_10px_44px_-8px_rgba(67,245,255,0.65)]">
                  <span className="light-sweep absolute inset-0 rounded-full" />
                  <span className="relative">{primaryCta.label}</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.4}>
                <Link href={secondaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-8 py-4 text-[15px] font-medium text-ink backdrop-blur-md hover:border-brand/40 transition-colors">
                  {secondaryCta.label}
                  <ArrowUpRight className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
