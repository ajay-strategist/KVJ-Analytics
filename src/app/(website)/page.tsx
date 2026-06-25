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
import { ServiceCard } from "@/components/ui/ServiceCard";
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
                text={hp.hero?.headline || "Transforming Data Into Decisions"}
                className="font-display font-medium text-[42px] sm:text-[60px] lg:text-[76px] leading-[1.06] tracking-[-0.025em] mb-8 max-w-[16ch] text-ink text-left"
              />
              <Reveal delay={180}>
                <p className="text-[18px] md:text-[22px] font-light text-slate leading-[1.6] max-w-2xl mb-12 text-left">
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
 
      {/* ───── STATS — animated count-up inside glassmorphic pills ───── */}
      <section className="relative bg-[#08080A] border-b border-white/5 py-12 overflow-hidden">
        <div className="bg-radial-glow pointer-events-none absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 opacity-30" />
        <Container className="relative z-10">
          <div className="flex flex-wrap justify-center gap-5 md:gap-7">
            {highlights.map((hl: string, idx: number) => {
              const m = hl.match(/^([\d,]+)(\+)?\s*(.*)$/);
              const num = m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
              const suffix = m && m[2] ? "+" : "";
              const label = m ? m[3] : hl;
              return (
                <Reveal key={idx} delay={idx * 90}>
                  <div className="rounded-full border border-white/5 hover:border-corporate/40 bg-[#0A0A0C]/70 backdrop-blur-xl px-8 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 flex items-center justify-center gap-4 group cursor-default">
                    {num !== null ? (
                      <div className="text-2xl md:text-3xl font-bold font-display leading-none text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate">
                        <CountUp value={num} suffix={suffix} />
                      </div>
                    ) : null}
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
                      {label}
                    </div>
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

          <SolutionGrid label="Corporate Solutions" href="/corporate" items={corporateSolutions} accent="corporate" />
          <div className="mt-24 md:mt-32">
            <SolutionGrid label="Educational Solutions" href="/education" items={educationalSolutions} accent="education" />
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
                tag={isEdu ? "Academic Solution" : "Corporate Solution"}
                accentColor={isEdu ? "cyan" : "blue"}
              />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
