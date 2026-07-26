import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * KVJ Analytics — V3 reusable section library.
 * Premium dark / glassmorphism sections composed by every V3 page (Home, About,
 * Corporate, Educational, Products, Blog, Careers, Contact). Prop-driven, no hardcoded
 * content, dark-mode native, responsive, reduced-motion friendly (via Reveal).
 * Built on the existing animation system (swap in Framer Motion later without changing APIs).
 */

// ── Types ──────────────────────────────────────────────────────────────────────
export interface CtaLink { label: string; href: string }
export interface CategoryCard { title: string; points?: string[]; body?: string }
export interface TimelineStep { no?: string; title: string; body?: string; points?: string[] }
export interface FaqItem { q: string; a: string }

// ── Shared bits ─────────────────────────────────────────────────────────────────
function SectionShell({
  children, className = "", id,
}: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative py-20 md:py-28 overflow-hidden ${className}`}>
      <Container className="relative z-10">{children}</Container>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow, heading, description, center = false,
}: { eyebrow?: string; heading: string; description?: string; center?: boolean }) {
  return (
    <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-12 md:mb-16`}>
      {eyebrow ? <div className="mb-4">{Eyebrow({ children: eyebrow })}</div> : null}
      <h2 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight">
        {heading}
      </h2>
      {description ? (
        <p className="mt-4 text-base md:text-lg font-light text-slate leading-relaxed">{description}</p>
      ) : null}
    </Reveal>
  );
}

// ── V3 HERO ─────────────────────────────────────────────────────────────────────
export function V3Hero({
  badge, headline, supporting, description, primaryCta, secondaryCta, visual,
}: {
  badge?: string;
  headline: string;
  supporting?: string;
  description?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  visual?: React.ReactNode;
}) {
  return (
    <section className="hero-bleed relative min-h-[88vh] flex items-center overflow-hidden bg-base text-ink">
      <div className="blob animate-blob absolute -top-32 right-[8%] w-[36rem] h-[36rem] bg-brand/12 pointer-events-none" />
      <div className="blob animate-blob absolute bottom-[-10rem] left-[-6rem] w-[28rem] h-[28rem] bg-corporate/10 pointer-events-none" style={{ animationDelay: "4s" }} />
      <Container className="relative z-10 py-24 md:py-28">
        <div className={`grid grid-cols-1 ${visual ? "lg:grid-cols-12" : ""} gap-12 items-center`}>
          <div className={visual ? "lg:col-span-6" : "max-w-4xl"}>
            {badge ? (
              <Reveal>
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-brand px-3.5 py-1.5 rounded-full border border-brand/25 bg-brand/5 mb-6">
                  {badge}
                </span>
              </Reveal>
            ) : null}
            <Reveal delay={80}>
              <h1 className="font-display font-bold text-[40px] sm:text-[54px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] text-ink mb-6">
                {headline}
              </h1>
            </Reveal>
            {supporting ? (
              <Reveal delay={150}>
                <p className="text-lg md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate mb-5 max-w-2xl">
                  {supporting}
                </p>
              </Reveal>
            ) : null}
            {description ? (
              <Reveal delay={210}>
                <p className="text-base md:text-lg font-light text-slate leading-relaxed max-w-2xl mb-9">
                  {description}
                </p>
              </Reveal>
            ) : null}
            {(primaryCta || secondaryCta) && (
              <Reveal delay={280}>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {primaryCta ? <Button href={primaryCta.href} variant="accent">{primaryCta.label}</Button> : null}
                  {secondaryCta ? (
                    <Link href={secondaryCta.href} className="group inline-flex items-center gap-2 text-[15px] font-medium text-slate hover:text-brand transition-colors">
                      {secondaryCta.label}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  ) : null}
                </div>
              </Reveal>
            )}
          </div>
          {visual ? <div className="lg:col-span-6 relative hidden lg:block w-full">{visual}</div> : null}
        </div>
      </Container>
    </section>
  );
}

// ── CARD GRID (solutions / why-us / values / capabilities) ──────────────────────
export function V3CardGrid({
  eyebrow, heading, description, cards, columns = 3, cta,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  cards: CategoryCard[];
  columns?: 2 | 3 | 4;
  cta?: CtaLink;
}) {
  const cols = columns === 4 ? "lg:grid-cols-4" : columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <SectionShell className="bg-aurora">
      <SectionHeading eyebrow={eyebrow} heading={heading} description={description} />
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-6 md:gap-7`}>
        {cards.map((c, i) => (
          <Reveal key={i} delay={(i % 3) * 80}>
            <div className="card-premium group h-full p-7 md:p-8">
              <div className="mb-4 h-11 w-11 rounded-2xl bg-brand/10 border border-brand/20 grid place-items-center text-brand">
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-ink mb-2 group-hover:text-brand transition-colors">{c.title}</h3>
              {c.body ? <p className="text-sm text-slate font-light leading-relaxed">{c.body}</p> : null}
              {c.points?.length ? (
                <ul className="mt-3 space-y-1.5">
                  {c.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate font-light">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand/60 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
      {cta ? (
        <Reveal className="mt-12 text-center">
          <Button href={cta.href} variant="secondary">{cta.label}</Button>
        </Reveal>
      ) : null}
    </SectionShell>
  );
}

// ── INDUSTRIES ROW (pills) ──────────────────────────────────────────────────────
export function V3Industries({ eyebrow, heading, items }: { eyebrow?: string; heading: string; items: string[] }) {
  return (
    <SectionShell>
      <SectionHeading eyebrow={eyebrow} heading={heading} center />
      <Reveal className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
        {items.map((it, i) => (
          <span key={i} className="px-5 py-2.5 rounded-full text-sm font-medium bg-white/[0.04] text-ink border border-line hover:border-brand/40 hover:text-brand transition-colors">
            {it}
          </span>
        ))}
      </Reveal>
    </SectionShell>
  );
}

// ── APPROACH / PROCESS TIMELINE (numbered steps) ────────────────────────────────
export function V3Timeline({ eyebrow, heading, steps }: { eyebrow?: string; heading: string; steps: TimelineStep[] }) {
  return (
    <SectionShell className="bg-aurora">
      <SectionHeading eyebrow={eyebrow} heading={heading} center />
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <Reveal key={i} delay={(i % 3) * 90}>
            <div className="card-premium h-full p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono font-bold text-brand text-lg">{s.no || String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-bold text-ink">{s.title}</h3>
              </div>
              {s.body ? <p className="text-sm text-slate font-light leading-relaxed">{s.body}</p> : null}
              {s.points?.length ? (
                <ul className="mt-3 space-y-1.5">
                  {s.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate font-light">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand/60 shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

// ── SUCCESS STORIES / IMPACT (outcome statements) ───────────────────────────────
export function V3SuccessStories({
  eyebrow, heading, items, cta,
}: { eyebrow?: string; heading: string; items: string[]; cta?: CtaLink }) {
  return (
    <SectionShell>
      <SectionHeading eyebrow={eyebrow} heading={heading} center />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((it, i) => (
          <Reveal key={i} delay={(i % 2) * 90}>
            <div className="card-premium h-full p-7 flex items-start gap-4">
              <span className="mt-1 h-8 w-8 rounded-xl bg-brand/10 border border-brand/20 grid place-items-center text-brand shrink-0">
                <ArrowRight className="h-4 w-4" />
              </span>
              <p className="text-base text-ink font-medium leading-relaxed">{it}</p>
            </div>
          </Reveal>
        ))}
      </div>
      {cta ? (
        <Reveal className="mt-12 text-center">
          <Button href={cta.href} variant="secondary">{cta.label}</Button>
        </Reveal>
      ) : null}
    </SectionShell>
  );
}

// ── FAQ (accordion via <details>) ───────────────────────────────────────────────
export function V3Faq({ eyebrow, heading, items }: { eyebrow?: string; heading: string; items: FaqItem[] }) {
  return (
    <SectionShell className="bg-aurora">
      <SectionHeading eyebrow={eyebrow} heading={heading} center />
      <div className="max-w-3xl mx-auto divide-y divide-line border-y border-line">
        {items.map((it, i) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-base md:text-lg font-medium text-ink list-none">
              {it.q}
              <span className="text-brand transition-transform duration-300 group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <p className="mt-3 text-sm md:text-base text-slate font-light leading-relaxed">{it.a}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
