import React from "react";
import { Check, Target, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { MetricCounter } from "@/components/ui/MetricCounter";
import { CTASection } from "@/components/ui/CTASection";
import { client } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const FALLBACK_ABOUT = {
  title: "About KVJ Analytics",
  intro:
    "KVJ Analytics is an analytics, automation, and training company with 16+ years of experience supporting corporates and educational institutions.",
  specializations: [
    "Report Automation",
    "Dashboard Development",
    "Data Visualization",
    "Spreadsheet Consulting",
    "Process Automation",
    "Corporate Training",
    "Educational Technology Solutions",
  ],
  reachLine:
    "Our services and training programs have reached clients across Kerala, India, UAE, Oman, USA, and Europe.",
  impact: [
    "16+ Years of Experience",
    "50,000+ Young Professionals Trained",
    "5,000+ Senior Professionals Trained",
    "Trusted Corporate & Academic Partnerships",
  ],
  vision: {
    heading: "Our Vision",
    body: "To build smarter organizations and industry-ready professionals through analytics, automation, and practical learning.",
  },
};

export default async function AboutPage() {
  const data = await client.fetch(aboutPageQuery).catch((err) => {
    console.warn("Sanity fetch error in AboutPage:", err);
    return null;
  });

  const page = data || FALLBACK_ABOUT;

  return (
    <>
      <Section background="default" className="bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
        
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Eyebrow className="mb-4">Who We Are</Eyebrow>
            <BoldStatement variant="hero" className="mb-6">
              {page.title}
            </BoldStatement>
            <p className="text-lg md:text-xl text-slate font-medium leading-relaxed max-w-2xl mx-auto">
              {page.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto mt-8">
            <div className="lg:col-span-7">
              <Eyebrow segment="corporate" className="mb-3">Core Skills</Eyebrow>
              <BoldStatement variant="h2" className="mb-4">
                Specializations & Focus Areas
              </BoldStatement>
              <p className="text-base text-slate leading-relaxed mb-6 font-medium">
                Over the past 16 years, we have focused on delivering practical skillsets and building workflows that save hours of manual operational labor.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8">
                {(page.specializations || FALLBACK_ABOUT.specializations).map((spec: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 bg-surface border border-line/60 rounded-xl px-4 py-3 shadow-soft hover:shadow-hover-lift hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-ink leading-snug">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden bg-surface/40 rounded-card border border-line/80 p-8 shadow-soft hover:shadow-hover-lift hover:-translate-y-1.5 transition-all duration-300 border-l-4 border-l-education">
                <div className="absolute -bottom-8 -right-8 text-education/5 pointer-events-none">
                  <Target className="w-36 h-36" />
                </div>
                <div className="absolute top-6 right-6 text-education/10">
                  <Compass className="w-10 h-10 animate-[spin_12s_linear_infinite]" />
                </div>
                <BoldStatement variant="h3" className="mb-4 text-education">
                  {page.vision?.heading || FALLBACK_ABOUT.vision.heading}
                </BoldStatement>
                <p className="text-base text-slate leading-relaxed font-semibold relative z-10">
                  {page.vision?.body || FALLBACK_ABOUT.vision.body}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Impact metrics band */}
      <Section background="surface" className="border-t border-b border-line/50 relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-grid-pattern opacity-35 pointer-events-none" />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Eyebrow className="mb-3">Our Track Record</Eyebrow>
            <BoldStatement variant="h2" className="mb-4">
              Making a Measurable Difference
            </BoldStatement>
            <p className="text-base font-semibold text-slate leading-relaxed max-w-xl mx-auto">
              {page.reachLine || FALLBACK_ABOUT.reachLine}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {(page.impact || FALLBACK_ABOUT.impact).map((imp: string, idx: number) => (
              <div
                key={idx}
                className="bg-card rounded-card border border-line/80 shadow-soft hover:shadow-hover-lift hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-center glass-panel"
              >
                <MetricCounter label={imp} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Let's Build Something Meaningful Together"
        description="Whether you're a corporation seeking analytics automation or an institution wanting better student outcomes, KVJ Analytics has the expertise."
        primaryCtaText="Start a Conversation"
        primaryCtaHref="/contact"
        secondaryCtaText="View Solutions"
        secondaryCtaHref="/corporate"
      />
    </>
  );
}
