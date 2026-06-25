import React from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowDown, BarChart3, LayoutDashboard, Table2,
  AppWindow, Workflow, GraduationCap, Award, BookOpen, LineChart, ClipboardCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { CTASection } from "@/components/ui/CTASection";
import { ClientLogoCarousel } from "@/components/ui/ClientLogoCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { HeroCanvas } from "@/components/ui/HeroCanvas";
import { HeroVisual } from "@/components/ui/HeroVisual";
import { CountUp } from "@/components/ui/CountUp";
import { client } from "@/sanity/lib/client";
import { homePageQuery, clientsQuery } from "@/sanity/lib/queries";
import { FALLBACK_HOME_PAGE } from "@/lib/constants";

export const revalidate = 3600;

const CORP_ICONS = [BarChart3, LayoutDashboard, Table2, AppWindow, Workflow, GraduationCap];
const EDU_ICONS = [Award, BookOpen, LineChart, ClipboardCheck];

// Short descriptors so each card reads as a designed tile (not an empty image slot)
const SOLUTION_DESC: Record<string, string> = {
  "Report Automation": "Automate MIS, financial, operational and management reports with speed and accuracy.",
  "Dashboards & Data Visualization": "Real-time dashboards and visual insights for KPI tracking and faster decisions.",
  "Spreadsheet Consulting": "Advanced Excel systems, automation, validation and optimization solutions.",
  "App Development": "Custom internal apps and tools built around the way your team actually works.",
  "Process Automation": "Cut manual effort with intelligent workflow and process automation.",
  "Corporate Training": "Hands-on training in Excel, Power BI, analytics, dashboards and automation.",
  "Training & Certification": "Industry-ready certification programs that build practical, job-relevant skills.",
  "Curriculum Development": "Structured, outcome-driven curricula aligned to real industry needs.",
  "Academic Analytics Platforms": "Institutional reporting and analytics that surface performance gaps.",
  "Assessment Automation": "Automated assignment generation, grading and feedback at scale.",
};

export default async function HomePage() {
  const hpData = await client.fetch(homePageQuery).catch((err) => {
    console.warn("Sanity fetch error in HomePage:", err);
    return null;
  });
  const clientsData = await client.fetch(clientsQuery).catch(() => null);

  const hp = hpData || FALLBACK_HOME_PAGE;
  const clients = clientsData || [];
  const corporateSolutions = hp.corporateSolutions || FALLBACK_HOME_PAGE.corporateSolutions;
  const educationalSolutions = hp.educationalSolutions || FALLBACK_HOME_PAGE.educationalSolutions;
  const highlights = hp.keyHighlights || FALLBACK_HOME_PAGE.keyHighlights;

  const subheadParts = (hp.hero?.subhead || FALLBACK_HOME_PAGE.hero.subhead)
    .split("•").map((s: string) => s.trim()).filter(Boolean);

  return (
    <>
      {/* ───── CINEMATIC HERO (full height) ───── */}
      <section className="hero-bleed hero-grid relative min-h-[92vh] flex items-center bg-gradient-hero text-ink overflow-hidden">
        {/* Accent glows */}
        <div className="blob animate-blob absolute -top-32 right-[10%] w-[34rem] h-[34rem] bg-brand/12 pointer-events-none" />
        <div className="blob animate-blob absolute bottom-[-10rem] left-[-6rem] w-[26rem] h-[26rem] bg-education/10 pointer-events-none" style={{ animationDelay: "4s" }} />
        
        {/* Points globe rotates in background */}
        <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[62%] h-[140%] opacity-45 pointer-events-none hidden lg:block -z-10">
          <HeroCanvas />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-base via-base/80 to-transparent pointer-events-none" />

        <Container className="relative z-10 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 max-w-2xl">
              <Reveal>
                <p className="text-[12px] md:text-[13px] uppercase tracking-[0.22em] text-slate/75 font-semibold mb-8">
                  {subheadParts.join("   ·   ")}
                </p>
              </Reveal>
              <RevealText
                as="h1"
                text={hp.hero?.headline || FALLBACK_HOME_PAGE.hero.headline}
                className="font-display font-medium text-[42px] sm:text-[60px] lg:text-[76px] leading-[1.06] tracking-[-0.025em] mb-8 max-w-[16ch] text-ink"
              />
              <Reveal delay={180}>
                <p className="text-[18px] md:text-[22px] font-light text-slate leading-[1.6] max-w-2xl mb-12">
                  {hp.hero?.intro || FALLBACK_HOME_PAGE.hero.intro}
                </p>
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <Button href={hp.hero?.primaryCta?.href || "/contact"} variant="accent">
                    {hp.hero?.primaryCta?.label || "Get Started"}
                  </Button>
                  <Link href="/about" className="group inline-flex items-center gap-2 text-[16px] text-slate hover:text-brand transition-colors font-medium">
                    About Us
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </Reveal>
            </div>
            
            {/* Layered 3D holographic charts floating on the right */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </Container>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate/60">
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-scroll-hint text-brand" />
        </div>
      </section>

      {/* ───── STATS — animated count-up (light) ───── */}
      <section className="relative bg-surface border-b border-line overflow-hidden">
        <div className="bg-radial-glow pointer-events-none absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 opacity-70" />
        <Container className="relative z-10 py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8">
            {highlights.map((hl: string, idx: number) => {
              const m = hl.match(/^([\d,]+)(\+)?\s*(.*)$/);
              const num = m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
              const suffix = m && m[2] ? "+" : "";
              const label = m ? m[3] : hl;
              return (
                <Reveal key={idx} delay={idx * 90} className="border-l border-line pl-5 group">
                  {num !== null ? (
                    <div className="text-[36px] md:text-[48px] font-medium font-display leading-none mb-3">
                      <CountUp value={num} suffix={suffix} className="signature-gradient-text" />
                    </div>
                  ) : null}
                  <div className="text-[12px] md:text-[13px] font-medium text-slate leading-snug uppercase tracking-wide">
                    {label}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ───── WHAT WE DO — solution cards ───── */}
      <Section background="default" className="relative bg-aurora overflow-hidden">
        <Container className="relative z-10">
          <Reveal className="mb-14 md:mb-20 max-w-3xl">
            <p className="text-[13px] uppercase tracking-[0.22em] text-slate mb-5">What We Do</p>
            <BoldStatement variant="h1">Two audiences. One standard of engineering.</BoldStatement>
          </Reveal>

          <SolutionGrid label="Corporate Solutions" href="/corporate" items={corporateSolutions} icons={CORP_ICONS} accent="brand" />
          <div className="mt-24 md:mt-32">
            <SolutionGrid label="Educational Solutions" href="/education" items={educationalSolutions} icons={EDU_ICONS} accent="education" />
          </div>
        </Container>
      </Section>

      {/* ───── CLIENTS ───── */}
      <ClientLogoCarousel clients={clients} />

      {/* ───── WHY KVJ ───── */}
      <section className="bg-surface border-t border-line">
        <Container className="py-24 md:py-36">
          <Reveal className="max-w-4xl">
            <p className="text-[13px] uppercase tracking-[0.22em] text-slate mb-6">Why KVJ Analytics</p>
            <BoldStatement variant="h2" className="mb-7">
              {hp.whyUs?.strapline || FALLBACK_HOME_PAGE.whyUs.strapline}
            </BoldStatement>
            <p className="text-[18px] md:text-[22px] font-light text-slate leading-[1.6]">
              {hp.whyUs?.body || FALLBACK_HOME_PAGE.whyUs.body}
            </p>
          </Reveal>
        </Container>
      </section>

      <CTASection
        title="Let's Build Smarter Systems Together"
        description="Whether you are a corporate organization looking for automation and analytics solutions or an educational institution seeking industry-oriented learning platforms, KVJ Analytics is ready to support your transformation journey."
        primaryCtaText="Contact Our Team"
        primaryCtaHref="/contact"
        secondaryCtaText="Request a Demo"
        secondaryCtaHref="/contact"
      />
    </>
  );
}

function SolutionGrid({
  label,
  href,
  items,
  icons,
  accent,
}: {
  label: string;
  href: string;
  items: { title: string }[];
  icons: React.ComponentType<{ className?: string }>[];
  accent: "brand" | "education";
}) {
  const isEdu = accent === "education";
  const accentText = isEdu ? "text-education" : "text-brand";
  const tileBg = isEdu ? "bg-education/10 border-education/20 group-hover:bg-education/20" : "bg-brand/10 border-brand/20 group-hover:bg-brand/20";
  const hoverTitle = isEdu ? "group-hover:text-education" : "group-hover:text-brand";
  const hoverBorder = isEdu ? "hover:border-education/40" : "hover:border-brand/40";
  const tag = isEdu ? "Educational service" : "Corporate service";

  return (
    <div>
      <Reveal className="flex items-end justify-between gap-6 mb-10">
        <BoldStatement variant="h3">{label}</BoldStatement>
        <Link href={href} className="group hidden sm:inline-flex items-center gap-2 text-[15px] font-medium text-ink hover:text-brand transition-colors whitespace-nowrap">
          View all
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item, idx) => {
          const Icon = icons[idx % icons.length];
          const desc = SOLUTION_DESC[item.title] || "Tailored solutions engineered around measurable business outcomes.";
          return (
            <Reveal key={idx} delay={(idx % 3) * 90}>
              <Link
                href={href}
                className={`card-premium group relative flex h-full min-h-[250px] flex-col overflow-hidden p-7 md:p-8 ${hoverBorder}`}
              >
                {/* hover glow */}
                <div className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${isEdu ? "bg-education/15" : "bg-brand/15"}`} />

                <div className={`relative grid h-13 w-13 place-items-center rounded-2xl border transition-all duration-300 ${tileBg}`} style={{ width: 52, height: 52 }}>
                  <Icon className={`h-6 w-6 ${accentText} icon-anim`} />
                </div>

                <p className={`relative mt-6 text-[10px] uppercase tracking-[0.2em] font-semibold ${accentText}`}>{tag}</p>
                <h4 className={`relative mt-2 text-[19px] md:text-[21px] font-medium text-ink leading-snug transition-colors duration-300 ${hoverTitle}`}>
                  {item.title}
                </h4>
                <p className="relative mt-3 text-[14px] font-light leading-relaxed text-slate">
                  {desc}
                </p>

                <div className={`relative mt-auto pt-6 inline-flex items-center gap-2 text-[14px] font-medium ${accentText}`}>
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
