import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { CTASection } from "@/components/ui/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { HeroCanvas } from "@/components/ui/HeroCanvas";
import { CountUp } from "@/components/ui/CountUp";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_ABOUT } from "@/lib/constants";

export const revalidate = 3600;

export default async function AboutPage() {
  const data = await getPageContent("about");
  const page = mergePageContent(data, FALLBACK_ABOUT);

  const specializations = page.specializations || FALLBACK_ABOUT.specializations;
  const impact = page.impact || FALLBACK_ABOUT.impact;

  return (
    <>
      {/* ───── HERO — premium light + accent glow + visual ───── */}
      <section className="hero-dark hero-grid hero-bleed relative min-h-[78vh] flex items-center overflow-hidden bg-gradient-hero">
        <div className="blob animate-blob absolute -top-24 right-[8%] w-[34rem] h-[34rem] bg-brand/12 pointer-events-none" />
        <div className="blob animate-blob absolute bottom-[-8rem] left-[-4rem] w-[24rem] h-[24rem] bg-education/10 pointer-events-none" style={{ animationDelay: "3s" }} />
        <div className="absolute right-[-6%] top-1/2 -translate-y-1/2 w-[55%] h-[130%] opacity-40 pointer-events-none hidden md:block">
          <HeroCanvas />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-base via-base/80 to-transparent pointer-events-none" />

        <Container className="relative z-10 py-28 md:py-36">
          <Reveal className="max-w-4xl">
            <p className="text-[13px] uppercase tracking-[0.2em] text-brand font-semibold mb-8">Who We Are</p>
            <RevealText
              as="h1"
              text={page.title}
              className="font-display font-medium text-[42px] sm:text-[56px] lg:text-[66px] leading-[1.08] tracking-[-0.025em] mb-8 max-w-[16ch] text-ink"
            />
            <p className="text-[18px] md:text-[21px] font-light text-slate leading-[1.6] max-w-3xl">
              {page.intro}
            </p>
          </Reveal>
        </Container>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate/50">
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <span className="block h-9 w-[1px] bg-gradient-to-b from-brand/50 to-transparent" />
        </div>
      </section>

      {/* ───── WE SPECIALIZE IN — hairline list ───── */}
      <Section background="default" className="relative bg-aurora overflow-hidden">
        <Container className="relative z-10">
          <Reveal className="mb-10 md:mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] text-brand mb-4">What We Do</p>
            <BoldStatement variant="h2">We Specialize In</BoldStatement>
          </Reveal>
          <Reveal className="border-t border-line">
            {specializations.map((spec: string, idx: number) => (
              <div
                key={idx}
                className="group relative flex items-center gap-5 md:gap-8 border-b border-line py-6 md:py-7 transition-colors duration-300 hover:bg-surface px-3 -mx-3 rounded-lg"
              >
                <span className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 bg-brand transition-all duration-300 group-hover:h-2/3" />
                <span className="text-[13px] font-light text-muted tabular-nums shrink-0 transition-colors duration-300 group-hover:text-brand">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[22px] md:text-[30px] font-medium text-ink leading-tight transition-transform duration-300 group-hover:translate-x-2">
                  {spec}
                </span>
                <ArrowUpRight className="h-6 w-6 text-brand shrink-0 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* ───── OUR IMPACT — stats band, animated (light) ───── */}
      <section className="relative bg-surface border-y border-line overflow-hidden">
        <div className="bg-radial-glow pointer-events-none absolute right-[12%] top-0 h-72 w-72 opacity-70" />
        <Container className="relative z-10 py-20 md:py-28">
          <Reveal className="mb-12 md:mb-16 max-w-3xl">
            <p className="text-[13px] uppercase tracking-[0.2em] text-brand mb-4 font-semibold">Our Impact</p>
            <p className="text-[18px] md:text-[22px] font-light text-slate leading-[1.5]">
              {page.reachLine || FALLBACK_ABOUT.reachLine}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
            {impact.map((imp: string, idx: number) => {
              const m = imp.match(/^([\d,]+)(\+)?\s*(.*)$/);
              const num = m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
              const suffix = m && m[2] ? "+" : "";
              const label = m ? m[3] : imp;
              return (
                <Reveal key={idx} delay={idx * 80} className="border-l border-line pl-5">
                  {num !== null ? (
                    <div className="text-[34px] md:text-[46px] font-medium leading-none mb-3 font-display">
                      <CountUp value={num} suffix={suffix} className="signature-gradient-text" />
                    </div>
                  ) : null}
                  <div className="text-[14px] font-light text-slate leading-snug">{label}</div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ───── OUR VISION — statement with accent glow ───── */}
      <section className="relative overflow-hidden bg-base border-t border-line">
        <div className="bg-radial-glow pointer-events-none absolute -left-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2" />
        <div className="bg-radial-glow-teal pointer-events-none absolute -right-24 bottom-[-8rem] h-[26rem] w-[26rem]" />
        <Container className="relative z-10 py-24 md:py-32">
          <Reveal className="max-w-4xl">
            <p className="text-[13px] uppercase tracking-[0.2em] text-brand mb-6">
              {page.vision?.heading || FALLBACK_ABOUT.vision.heading}
            </p>
            <BoldStatement variant="h2" className="leading-[1.3]">
              {page.vision?.body || FALLBACK_ABOUT.vision.body}
            </BoldStatement>
          </Reveal>
        </Container>
      </section>

      {/* ───── CTA ───── */}
      <CTASection
        title="Let's Build Smarter Systems Together"
        description="Whether you are a corporate organization seeking automation and analytics, or an institution wanting industry-ready outcomes, KVJ Analytics is ready to support your transformation journey."
        primaryCtaText="Contact Our Team"
        primaryCtaHref="/contact"
        secondaryCtaText="View Solutions"
        secondaryCtaHref="/corporate"
      />
    </>
  );
}
