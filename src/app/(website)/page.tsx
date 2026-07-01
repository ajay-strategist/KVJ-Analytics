import React from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowDown, BarChart3, LayoutDashboard, Table2,
  AppWindow, Workflow, GraduationCap, Award, BookOpen, LineChart, ClipboardCheck,
  CheckCircle2,
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
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_HOME_PAGE } from "@/lib/constants";

export const revalidate = 3600;

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

// Default CTA values used when admin hasn't customised the section yet
const DEFAULT_CTA = {
  title: "Let's Build Smarter Systems Together",
  description:
    "Whether you are a corporate organization looking for automation and analytics solutions or an educational institution seeking industry-oriented learning platforms, KVJ Analytics is ready to support your transformation journey.",
  primaryCtaText: "Contact Our Team",
  primaryCtaHref: "/contact",
  secondaryCtaText: "Request a Demo",
  secondaryCtaHref: "/contact",
};

export default async function HomePage() {
  // ── Fetch from Supabase page_content (same as all other pages) ──────────────
  const storedData = await getPageContent("home");
  const hp = mergePageContent(storedData, FALLBACK_HOME_PAGE);

  const corporateSolutions = hp.corporateSolutions || FALLBACK_HOME_PAGE.corporateSolutions;
  const educationalSolutions = hp.educationalSolutions || FALLBACK_HOME_PAGE.educationalSolutions;
  const highlights = hp.keyHighlights || FALLBACK_HOME_PAGE.keyHighlights;

  // Merge CTA section: admin-saved values win over defaults
  const cta = { ...DEFAULT_CTA, ...(hp as any).cta };

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
            <div className="lg:col-span-6 max-w-xl">
              <Reveal>
                <p className="text-[12px] md:text-[13px] uppercase tracking-[0.22em] text-slate-200 font-semibold mb-8">
                  {subheadParts.join("   ·   ")}
                </p>
              </Reveal>
              <RevealText
                as="h1"
                text={hp.hero?.headline || "Transforming Data Into Decisions"}
                className="font-display font-medium text-[42px] sm:text-[60px] lg:text-[76px] leading-[1.06] tracking-[-0.025em] mb-8 max-w-[16ch] text-ink text-left"
              />
              <Reveal delay={180}>
                <p className="text-[18px] md:text-[22px] font-light text-slate-200 leading-[1.6] max-w-2xl mb-12 text-left">
                  {hp.hero?.intro || FALLBACK_HOME_PAGE.hero.intro}
                </p>
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <Button href={hp.hero?.primaryCta?.href || "/contact"} variant="accent">
                    {hp.hero?.primaryCta?.label || "Get Started"}
                  </Button>
                  <Link href="/about" className="group inline-flex items-center gap-2 text-[16px] text-slate-200 hover:text-brand transition-colors font-medium">
                    About Us
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </Reveal>
            </div>
            
            {/* Layered 3D holographic charts floating on the right */}
            <div className="lg:col-span-6 relative hidden lg:block w-full">
              <HeroVisual />
            </div>
          </div>
        </Container>
 
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-300">
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-scroll-hint text-brand" />
        </div>
      </section>
 
      {/* ───── STATS — contained standout banner ───── */}
      <section className="relative py-12 md:py-16">
        <Container>
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-[#050912] via-[#0B0F19] to-[#050912] px-6 py-12 md:px-12 md:py-14 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              {/* top hairline accent + inner radial glow */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/8 via-transparent to-transparent opacity-60" />
              <div className="relative z-10">
          {(() => {
            const stats = highlights.filter((hl: string) => hl.match(/^([\d,]+)/));
            const textHighlights = highlights.filter((hl: string) => !hl.match(/^([\d,]+)/));
            
            const renderPill = (hl: string, idx: number, isStat: boolean) => {
              const m = hl.match(/^([\d,]+)(\+)?\s*(.*)$/);
              const num = m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
              const suffix = m && m[2] ? "+" : "";
              const label = m ? m[3] : hl;
              
              const isNumber = num !== null;
              
              return (
                <Reveal key={idx} delay={idx * 90}>
                  <div 
                    className={`border backdrop-blur-xl px-8 py-3.5 transition-all duration-300 flex items-center justify-center gap-4 group cursor-default ${
                      isNumber 
                        ? "rounded-full border-white/5 hover:border-blue-500/40 bg-[#0A0A0C]/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
                        : "rounded-xl border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    }`}
                  >
                    {isNumber ? (
                      <div className="text-2xl md:text-3xl font-bold font-display leading-none text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate">
                        <CountUp value={num} suffix={suffix} />
                      </div>
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-brand drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                    )}
                    <div 
                      className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                        isNumber ? "text-slate-400 group-hover:text-slate-200" : "text-white group-hover:text-brand"
                      }`}
                    >
                      {label}
                    </div>
                  </div>
                </Reveal>
              );
            };

            return (
              <div className="flex flex-col gap-6 md:gap-8">
                {/* Row 1: Statistics */}
                <div className="flex flex-wrap justify-center gap-5 md:gap-7">
                  {stats.map((hl: string, idx: number) => renderPill(hl, idx, true))}
                </div>
                
                {/* Row 2: Text Highlights */}
                <div className="flex flex-wrap justify-center gap-5 md:gap-7">
                  {textHighlights.map((hl: string, idx: number) => renderPill(hl, idx, false))}
                </div>
              </div>
            );
          })()}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ───── WHAT WE DO — solution cards ───── */}
      <Section background="default" className="relative bg-aurora overflow-hidden">
        <Container className="relative z-10">
          {/* The What We Do label was removed as requested */}
          <SolutionGrid label="Corporate Solutions" href="/corporate" items={corporateSolutions} accent="corporate" />
          <div className="mt-24 md:mt-32">
            <SolutionGrid label="Educational Solutions" href="/education" items={educationalSolutions} accent="education" />
          </div>
        </Container>
      </Section>

      {/* ───── CLIENTS ───── */}
      <ClientLogoCarousel clients={[]} />

      {/* ───── WHY KVJ — contained standout banner ───── */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-brand/12 via-[#0B0F19] to-corporate/10 px-8 py-14 md:px-16 md:py-20 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              {/* accent rail + glows + hairline */}
              <span className="absolute left-0 top-10 bottom-10 w-[3px] rounded-full bg-gradient-to-b from-brand to-corporate" />
              <div className="absolute -top-24 right-[6%] h-72 w-72 rounded-full bg-brand/20 blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 left-[10%] h-60 w-60 rounded-full bg-corporate/15 blur-[100px] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent pointer-events-none" />
              <div className="relative max-w-4xl">
                <p className="text-[13px] uppercase tracking-[0.22em] text-slate-200 mb-6 font-semibold">Why KVJ Analytics</p>
                <BoldStatement variant="h2" className="mb-7">
              {(() => {
                const text = hp.whyUs?.strapline || FALLBACK_HOME_PAGE.whyUs.strapline;
                if (text.includes(".")) {
                  return text
                    .split(".")
                    .filter(Boolean)
                    .map((word: string, idx: number, arr: string[]) => (
                      <React.Fragment key={idx}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate">
                          {word.trim()}
                        </span>
                        {idx < arr.length - 1 && (
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand/40 mx-3 md:mx-4 mb-1.5" />
                        )}
                      </React.Fragment>
                    ));
                }
                return (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate">
                    {text}
                  </span>
                );
              })()}
            </BoldStatement>
                <p className="text-[18px] md:text-[22px] font-light text-slate-200 leading-[1.6]">
                  {hp.whyUs?.body || FALLBACK_HOME_PAGE.whyUs.body}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <CTASection
        title={cta.title}
        description={cta.description}
        primaryCtaText={cta.primaryCtaText}
        primaryCtaHref={cta.primaryCtaHref}
        secondaryCtaText={cta.secondaryCtaText}
        secondaryCtaHref={cta.secondaryCtaHref}
      />
    </>
  );
}

function SolutionGrid({
  label,
  href,
  items,
  accent,
}: {
  label: string;
  href: string;
  items: { title: string }[];
  accent: "corporate" | "education";
}) {
  const isEdu = accent === "education";

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
          const desc = SOLUTION_DESC[item.title] || "Tailored solutions engineered around measurable business outcomes.";
          
          // Determine the most appropriate premium iconName based on the title
          let iconName = "corp-vis";
          const titleLower = item.title.toLowerCase();
          
          if (isEdu) {
            if (titleLower.includes("curriculum")) {
              iconName = "edu-curriculum";
            } else if (titleLower.includes("analytics") || titleLower.includes("platform")) {
              iconName = "edu-analytics";
            } else if (titleLower.includes("assessment")) {
              iconName = "edu-assessment";
            } else if (titleLower.includes("certification") || titleLower.includes("cert")) {
              iconName = "edu-cert";
            } else {
              // Training & Certification, Training Programs, or any other training
              iconName = "edu-training";
            }
          } else {
            if (titleLower.includes("report")) {
              iconName = "corp-report";
            } else if (titleLower.includes("spreadsheet") || titleLower.includes("consulting")) {
              iconName = "corp-spreadsheet";
            } else if (titleLower.includes("dashboard") || titleLower.includes("visualization") || titleLower.includes("data vis")) {
              iconName = "corp-dashboard";
            } else if (titleLower.includes("app")) {
              iconName = "corp-app";
            } else if (titleLower.includes("process") || titleLower.includes("automation")) {
              iconName = "corp-process";
            } else if (titleLower.includes("training")) {
              iconName = "corp-training";
            }
          }


          return (
            <Reveal key={idx} delay={(idx % 3) * 90}>
              <ServiceCard
                title={item.title}
                description={desc}
                href={href}
                iconName={iconName}
                accentColor={isEdu ? "cyan" : "blue"}
              />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
