import React from "react";
import Link from "next/link";
import { Briefcase, GraduationCap, Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { MetricCounter } from "@/components/ui/MetricCounter";
import { LogoStrip } from "@/components/ui/LogoStrip";
import { CTASection } from "@/components/ui/CTASection";
import { ClientLogoCarousel } from "@/components/ui/ClientLogoCarousel";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { HeroVisual } from "@/components/ui/HeroVisual";
import { Reveal } from "@/components/ui/Reveal";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_HOME_PAGE, FALLBACK_SITE_SETTINGS } from "@/lib/constants";

export const revalidate = 3600; // Cache for 1 hour

export default async function HomePage() {
  // ── Load from Supabase content store, fall back to CEO-approved constants ──
  const [storedHome, storedSettings] = await Promise.all([
    getPageContent("home"),
    getPageContent("site-settings"),
  ]);

  const hp       = mergePageContent(storedHome,    FALLBACK_HOME_PAGE);
  const settings = mergePageContent(storedSettings, FALLBACK_SITE_SETTINGS);

  const corporateSolutions   = hp.corporateSolutions   ?? FALLBACK_HOME_PAGE.corporateSolutions;
  const educationalSolutions = hp.educationalSolutions ?? FALLBACK_HOME_PAGE.educationalSolutions;

  // Clients from Supabase clients table (already built)
  const clients: { name: string; logo_url: string; website_url: string }[] = [];

  const renderHeadline = (text: string) => {
    const highlightWord = "Data Into Decisions";
    if (text.includes(highlightWord)) {
      const parts = text.split(highlightWord);
      return (
        <>
          {parts[0]}
          <span className="signature-gradient-text font-extrabold">{highlightWord}</span>
          {parts[1]}
        </>
      );
    }
    const words = text.split(" ");
    if (words.length > 2) {
      const lastWords  = words.slice(-3).join(" ");
      const firstWords = words.slice(0, -3).join(" ");
      return (
        <>
          {firstWords}{" "}
          <span className="signature-gradient-text font-extrabold">{lastWords}</span>
        </>
      );
    }
    return text;
  };

  return (
    <>
      {/* 0. Hero Image Carousel (CMS-managed via heroCarousel key) */}
      <HeroCarousel slides={(hp as any).heroCarousel} />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden mesh-hero pt-16 pb-20 md:pt-24 md:pb-28 border-b border-line/50">
        <div className="blob animate-blob absolute -top-24 right-[-4rem] w-[28rem] h-[28rem] bg-brand/10 pointer-events-none" />
        <div className="blob animate-blob absolute top-1/3 left-[-6rem] w-[26rem] h-[26rem] bg-education/10 pointer-events-none" style={{ animationDelay: "3s" }} />
        <div className="blob animate-blob absolute bottom-[-6rem] right-1/3 w-[22rem] h-[22rem] bg-cta/10 pointer-events-none" style={{ animationDelay: "6s" }} />

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left animate-fade-up">
              <BoldStatement variant="hero" className="mb-6 tracking-tight leading-[1.05]">
                {renderHeadline(hp.hero?.headline ?? FALLBACK_HOME_PAGE.hero.headline)}
              </BoldStatement>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-3 gap-y-2 mb-7 font-display text-xs md:text-sm font-semibold tracking-wider uppercase">
                {(hp.hero?.subhead ?? FALLBACK_HOME_PAGE.hero.subhead)
                  .split("•")
                  .map((item: string, idx: number) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-slate/30">•</span>}
                      <span className="text-brand font-bold bg-brand/5 px-3 py-1 rounded-full">
                        {item.trim()}
                      </span>
                    </React.Fragment>
                  ))}
              </div>

              <p className="text-lg md:text-xl text-slate leading-relaxed mb-7 max-w-xl mx-auto lg:mx-0 font-medium">
                {hp.hero?.intro ?? FALLBACK_HOME_PAGE.hero.intro}
              </p>
              <blockquote className="text-sm font-semibold text-slate/75 mb-9 max-w-xl mx-auto lg:mx-0 border-l-2 border-brand/20 pl-4 italic text-left">
                {hp.hero?.supportingLine ?? FALLBACK_HOME_PAGE.hero.supportingLine}
              </blockquote>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Button href={hp.hero?.primaryCta?.href ?? "/contact"} variant="primary" className="px-8 py-4 w-full sm:w-auto shadow-md">
                  {hp.hero?.primaryCta?.label ?? "Get Started"}
                </Button>
                <Button href="/about" variant="secondary" className="px-8 py-3.5 w-full sm:w-auto">
                  About Us
                </Button>
              </div>
            </div>

            {/* Right: abstract dashboard visual */}
            <div className="hidden lg:block animate-fade-up" style={{ animationDelay: "150ms" }}>
              <div className="animate-float">
                <HeroVisual />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Key Highlights Band (Metrics) */}
      <section className="relative z-20 py-12 bg-white border-b border-line/50">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {(hp.keyHighlights ?? FALLBACK_HOME_PAGE.keyHighlights).map((hl: string, idx: number) => (
              <Reveal
                key={idx}
                delay={idx * 90}
                className="bg-card rounded-card border border-line shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-center"
              >
                <MetricCounter label={hl} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Regions Served Strip */}
      <LogoStrip items={settings.regionsServed ?? FALLBACK_SITE_SETTINGS.regionsServed} />

      {/* 3b. Client Logo Carousel */}
      <ClientLogoCarousel clients={clients} />

      {/* 4. Corporate & Educational Solutions */}
      <Section background="default" className="bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow-teal pointer-events-none" />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Corporate Solutions */}
            <Reveal className="card-premium border-t-4 border-t-corporate p-8 sm:p-10">
              <div className="inline-flex p-3.5 rounded-2xl mb-6 bg-corporate/10 text-corporate">
                <Briefcase className="w-7 h-7" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-ink mb-6 tracking-tight">Corporate Solutions</h2>
              <ul className="space-y-3.5 mb-8">
                {(corporateSolutions as { title: string; href?: string }[]).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="grid place-items-center h-6 w-6 rounded-full bg-corporate/10 text-corporate shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-base text-slate font-medium">{item.title}</span>
                  </li>
                ))}
              </ul>
              <Link href="/corporate" className="inline-flex items-center gap-2 font-bold text-sm text-corporate hover:gap-3 transition-all">
                Explore Corporate Solutions <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>

            {/* Educational Solutions */}
            <Reveal delay={120} className="card-premium border-t-4 border-t-education p-8 sm:p-10">
              <div className="inline-flex p-3.5 rounded-2xl mb-6 bg-education/10 text-education">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-ink mb-6 tracking-tight">Educational Solutions</h2>
              <ul className="space-y-3.5 mb-8">
                {(educationalSolutions as { title: string; href?: string }[]).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="grid place-items-center h-6 w-6 rounded-full bg-education/10 text-education shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-base text-slate font-medium">{item.title}</span>
                  </li>
                ))}
              </ul>
              <Link href="/education" className="inline-flex items-center gap-2 font-bold text-sm text-education hover:gap-3 transition-all">
                Explore Educational Solutions <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 5. Why KVJ Analytics */}
      <Section background="surface" className="border-t border-b border-line/60 relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-radial-glow opacity-50 pointer-events-none" />
        <Container className="relative z-10">
          <Reveal className="max-w-3xl mx-auto text-center">
            <Eyebrow segment="corporate" className="mb-3">
              Why KVJ Analytics
            </Eyebrow>
            <BoldStatement variant="h1" as="h2" className="mb-5">
              {hp.whyUs?.strapline ?? FALLBACK_HOME_PAGE.whyUs.strapline}
            </BoldStatement>
            <p className="text-lg text-slate leading-relaxed">
              {hp.whyUs?.body ?? FALLBACK_HOME_PAGE.whyUs.body}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* 6. Closing CTA Section */}
      <CTASection
        title={(hp as Record<string, any>).cta?.title ?? "Let's Build Smarter Systems Together"}
        description={(hp as Record<string, any>).cta?.description ?? "Whether you are a corporate organization looking for automation and analytics solutions or an educational institution seeking industry-oriented learning platforms, KVJ Analytics is ready to support your transformation journey."}
        primaryCtaText={(hp as Record<string, any>).cta?.primaryCtaText ?? "Contact Our Team"}
        primaryCtaHref={(hp as Record<string, any>).cta?.primaryCtaHref ?? "/contact"}
        secondaryCtaText={(hp as Record<string, any>).cta?.secondaryCtaText ?? "Request a Demo"}
        secondaryCtaHref={(hp as Record<string, any>).cta?.secondaryCtaHref ?? "/contact"}
      />
    </>
  );
}
