import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { CTASection } from "@/components/ui/CTASection";
import { ClientLogoCarousel } from "@/components/ui/ClientLogoCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { HeroCanvas } from "@/components/ui/HeroCanvas";
import { HeroDashboardCanvas } from "@/components/ui/HeroDashboardCanvas";
import { CountUp } from "@/components/ui/CountUp";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ParallaxBlob } from "@/components/ui/ParallaxBlob";
import { client } from "@/sanity/lib/client";
import { homePageQuery, clientsQuery } from "@/sanity/lib/queries";
import { FALLBACK_HOME_PAGE } from "@/lib/constants";

export const revalidate = 3600;

// Corporate solutions descriptors (6 items)
const CORP_DESC: Record<string, string> = {
  "Report Automation": "Automate MIS, financial, operational and management reports with speed and accuracy.",
  "Dashboards & Data Visualization": "Real-time dashboards and visual insights for KPI tracking and faster decisions.",
  "Spreadsheet Consulting": "Advanced Excel systems, automation, validation and optimization solutions.",
  "App Development": "Custom internal apps and tools built around the way your team actually works.",
  "Process Automation": "Cut manual effort with intelligent workflow and process automation.",
  "Corporate Training": "Hands-on training in Excel, Power BI, analytics, dashboards and automation.",
};

// Educational solutions (3 items requested: Training, Certification, Curriculum)
const EDU_SERVICES = [
  {
    title: "Training",
    description: "Hands-on training programs in Excel, Power BI, data analytics, and business intelligence modeled after real industry operations.",
    iconName: "edu-training",
  },
  {
    title: "Certification",
    description: "Employability-focused certification programs validating Advanced Excel and Power BI capabilities for young professionals.",
    iconName: "edu-cert",
  },
  {
    title: "Curriculum",
    description: "Structured, credit-based curricula development aligned with analytical tools commonly used by hiring companies.",
    iconName: "edu-curriculum",
  },
];

export default async function HomePage() {
  const hpData = await client.fetch(homePageQuery).catch((err) => {
    console.warn("Sanity fetch error in HomePage:", err);
    return null;
  });
  const clientsData = await client.fetch(clientsQuery).catch(() => null);

  const hp = hpData || FALLBACK_HOME_PAGE;
  const clients = clientsData || [];
  const corporateSolutions = hp.corporateSolutions || FALLBACK_HOME_PAGE.corporateSolutions;
  const highlights = hp.keyHighlights || FALLBACK_HOME_PAGE.keyHighlights;

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] relative min-h-screen overflow-x-hidden font-body selection:bg-[#0B1F3A]/10 selection:text-[#0B1F3A]">
      
      {/* ───── PARALLAX BACKGROUND ACCENTS ───── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParallaxBlob speed={0.12} className="absolute top-[15%] left-[-10rem] w-[35rem] h-[35rem] bg-[#00F0FF]/3 rounded-full blur-[100px]" />
        <ParallaxBlob speed={0.25} className="absolute top-[45%] right-[-12rem] w-[40rem] h-[40rem] bg-[#8B5CF6]/3 rounded-full blur-[120px]" />
        <ParallaxBlob speed={0.18} className="absolute bottom-[20%] left-[-8rem] w-[30rem] h-[30rem] bg-[#D4AF37]/2 rounded-full blur-[90px]" />
      </div>

      {/* ───── 1. HERO SECTION ───── */}
      <section className="hero-bleed relative min-h-[92vh] flex items-center bg-white border-b border-slate-100 overflow-hidden">
        {/* Background active network grid */}
        <div className="absolute inset-0 opacity-40 pointer-events-none -z-10">
          <HeroCanvas theme="light" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFC]/95 via-[#FAFAFC]/80 to-transparent pointer-events-none -z-10" />

        <Container className="relative z-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column Copy (Left-aligned, Navy headline) */}
            <div className="lg:col-span-7 max-w-2xl text-left">
              <Reveal>
                <p className="text-[12px] uppercase tracking-[0.25em] text-[#475569] font-bold mb-6">
                  Analytics   ·   Automation   ·   Training   ·   EdTech
                </p>
              </Reveal>
              <RevealText
                as="h1"
                text="Transforming Data Into Decisions"
                className="font-display font-bold text-[44px] sm:text-[62px] lg:text-[76px] leading-[1.05] tracking-[-0.025em] mb-8 text-[#0B1F3A]"
              />
              <Reveal delay={180}>
                <p className="text-[18px] md:text-[21px] font-light text-[#475569] leading-[1.6] max-w-xl mb-10">
                  {hp.hero?.intro || FALLBACK_HOME_PAGE.hero.intro}
                </p>
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  {/* Navy background with gold hover glow */}
                  <Button href="/contact" variant="corporate">
                    Get Started
                  </Button>
                  <Link href="/about" className="group inline-flex items-center gap-2 text-[15px] text-[#475569] hover:text-[#0B1F3A] transition-colors font-semibold">
                    About Us
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </Reveal>
            </div>
            
            {/* Right Column: Dynamic holographic line chart WebGL-style simulation */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <HeroDashboardCanvas />
            </div>
          </div>
        </Container>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400">
          <span className="text-[9px] uppercase tracking-[0.25em] font-semibold">Scroll</span>
          <ArrowDown className="w-3.5 h-3.5 animate-scroll-hint text-[#0B1F3A]" />
        </div>
      </section>

      {/* ───── 2. STATISTICS SECTION (Minimalist glass capsules) ───── */}
      <section className="relative py-12 bg-slate-50/50 border-b border-slate-200/60 overflow-hidden">
        <Container className="relative z-10">
          <div className="flex flex-wrap justify-center gap-5 md:gap-7">
            {highlights.map((hl: string, idx: number) => {
              const m = hl.match(/^([\d,]+)(\+)?\s*(.*)$/);
              const num = m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
              const suffix = m && m[2] ? "+" : "";
              const label = m ? m[3] : hl;
              return (
                <Reveal key={idx} delay={idx * 90}>
                  <div className="rounded-full border border-slate-200 bg-white/70 backdrop-blur-md px-8 py-3.5 shadow-sm transition-all duration-300 flex items-center justify-center gap-4 group cursor-default hover:border-[#D4AF37]/35">
                    {num !== null ? (
                      <div className="text-2xl md:text-3xl font-bold font-display leading-none text-[#0B1F3A]">
                        <CountUp value={num} suffix={suffix} />
                      </div>
                    ) : null}
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#0B1F3A] transition-colors">
                      {label}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ───── 3. CORPORATE & EDUCATIONAL SOLUTIONS ───── */}
      <Section background="default" className="relative bg-white py-24 md:py-32 overflow-hidden border-b border-slate-100">
        <Container className="relative z-10">
          
          {/* Corporate segment */}
          <div className="mb-24">
            <Reveal className="mb-14 max-w-3xl text-left border-l-4 border-[#0B1F3A] pl-5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Solutions for Enterprise</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#0B1F3A] mt-2 mb-4">Corporate Solutions</h2>
              <p className="text-[#475569] font-light text-base leading-relaxed">
                Streamline operational pipelines, automate dashboard updates, and eliminate manual spreadsheet redundancies.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {corporateSolutions.slice(0, 6).map((item, idx) => {
                const desc = CORP_DESC[item.title] || "Tailored corporate solution engineered to optimize workflow and analytics output.";
                
                // Icon matching
                let iconName = "corp-vis";
                const titleLower = item.title.toLowerCase();
                if (titleLower.includes("report")) iconName = "corp-report";
                else if (titleLower.includes("spreadsheet") || titleLower.includes("consulting")) iconName = "corp-spreadsheet";
                else if (titleLower.includes("dashboard") || titleLower.includes("visualization")) iconName = "corp-dashboard";
                else if (titleLower.includes("app")) iconName = "corp-app";
                else if (titleLower.includes("process") || titleLower.includes("automation")) iconName = "corp-process";
                else if (titleLower.includes("training")) iconName = "corp-training";

                return (
                  <Reveal key={idx} delay={(idx % 3) * 90}>
                    <ServiceCard
                      title={item.title}
                      description={desc}
                      href="/corporate"
                      iconName={iconName}
                      tag="Corporate Solution"
                      variant="corporate"
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Educational segment (exactly 3 items: Training, Certification, Curriculum) */}
          <div className="mt-32">
            <Reveal className="mb-14 max-w-3xl text-left border-l-4 border-[#0096C7] pl-5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8B5CF6] font-bold">Solutions for Academia</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#0096C7] mt-2 mb-4">Educational Solutions</h2>
              <p className="text-[#475569] font-light text-base leading-relaxed">
                Build employability, introduce industry-relevant courses, and standardize practical technical testing.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {EDU_SERVICES.map((item, idx) => (
                <Reveal key={idx} delay={idx * 90}>
                  <ServiceCard
                    title={item.title}
                    description={item.description}
                    href="/education"
                    iconName={item.iconName}
                    tag="Educational Solution"
                    variant="education"
                  />
                </Reveal>
              ))}
            </div>
          </div>

        </Container>
      </Section>

      {/* ───── CLIENTS CAROUSEL ───── */}
      <ClientLogoCarousel clients={clients} />

      {/* ───── WHY KVJ ANALYTICS ───── */}
      <section className="bg-slate-50/50 border-t border-b border-slate-200/60 relative overflow-hidden py-24 md:py-32">
        <Container className="relative z-10">
          <Reveal className="max-w-4xl text-left">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#0B1F3A] font-bold mb-3 block">Why KVJ Analytics</span>
            <BoldStatement variant="h2" className="mb-6 text-[#0B1F3A]">
              {hp.whyUs?.strapline || FALLBACK_HOME_PAGE.whyUs.strapline}
            </BoldStatement>
            <p className="text-[18px] md:text-[21px] font-light text-[#475569] leading-[1.6]">
              {hp.whyUs?.body || FALLBACK_HOME_PAGE.whyUs.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ───── CLOSING CTA SECTION ───── */}
      <CTASection
        title="Let's Build Smarter Systems Together"
        description="Whether you are a corporate organization looking for automation and analytics solutions or an educational institution seeking industry-oriented learning platforms, KVJ Analytics is ready to support your transformation journey."
        primaryCtaText="Contact Our Team"
        primaryCtaHref="/contact"
        secondaryCtaText="Request a Demo"
        secondaryCtaHref="/contact"
      />
    </div>
  );
}
