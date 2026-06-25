import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { MetricCounter } from "@/components/ui/MetricCounter";
import { LogoStrip } from "@/components/ui/LogoStrip";
import { CTASection } from "@/components/ui/CTASection";
import { ClientLogoCarousel } from "@/components/ui/ClientLogoCarousel";
import { client } from "@/sanity/lib/client";
import { impactPageQuery, clientsQuery } from "@/sanity/lib/queries";
import { GraduationCap, Briefcase, ShoppingBag, Users, Truck, Settings, TrendingUp, HelpCircle } from "lucide-react";

export const revalidate = 3600;

const FALLBACK_IMPACT = {
  heading: "Our Impact",
  intro:
    "For over 16 years, KVJ Analytics has delivered analytics, automation, and training solutions to corporates and educational institutions.",
  highlights: [
    "50,000+ Young Professionals Trained",
    "5,000+ Senior Professionals Trained",
    "Clients Across India & International Markets",
    "Services Delivered in UAE, Oman, USA & Europe",
  ],
  industriesServed: [
    "Education",
    "Finance",
    "Retail",
    "HR",
    "Logistics",
    "Operations",
    "Consulting",
  ],
};

const getIndustryIcon = (industry: string) => {
  switch (industry.toLowerCase()) {
    case "education":
      return <GraduationCap className="w-5 h-5 text-education" />;
    case "finance":
      return <Briefcase className="w-5 h-5 text-brand" />;
    case "retail":
      return <ShoppingBag className="w-5 h-5 text-cta-600" />;
    case "hr":
      return <Users className="w-5 h-5 text-brand" />;
    case "logistics":
      return <Truck className="w-5 h-5 text-education" />;
    case "operations":
      return <Settings className="w-5 h-5 text-slate" />;
    case "consulting":
      return <TrendingUp className="w-5 h-5 text-brand" />;
    default:
      return <HelpCircle className="w-5 h-5 text-slate" />;
  }
};

export default async function ImpactPage() {
  const data = await client.fetch(impactPageQuery).catch((err) => {
    console.warn("Sanity fetch error in ImpactPage:", err);
    return null;
  });

  const clientsData = await client.fetch(clientsQuery).catch((err) => {
    console.warn("Sanity fetch error in ImpactPage clients:", err);
    return null;
  });

  const page = data || FALLBACK_IMPACT;
  const clients = clientsData || [];

  return (
    <>
      <Section background="default" className="bg-surface/30 relative overflow-hidden py-16 md:py-24">
        {/* Background visual glows & patterns */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial-glow opacity-80 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial-glow-teal opacity-60 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Eyebrow className="mb-4">Clients & Milestones</Eyebrow>
            <BoldStatement variant="h1" className="mb-6 leading-tight tracking-tight text-ink">
              {page.heading}
            </BoldStatement>
            <p className="text-xl text-slate leading-relaxed">
              {page.intro}
            </p>
          </div>

          {/* Highlights Band */}
          <div className="bg-card border border-line/80 rounded-card py-6 px-6 max-w-5xl mx-auto mb-20 shadow-soft relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 signature-gradient" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-line">
              {(page.highlights || FALLBACK_IMPACT.highlights).map((hl: string, idx: number) => (
                <div key={idx} className="pt-6 sm:pt-0 sm:first:pl-0 flex items-center justify-center">
                  <MetricCounter label={hl} />
                </div>
              ))}
            </div>
          </div>

          {/* Industries Served */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <BoldStatement variant="h2" className="mb-8 font-display text-ink tracking-tight">
              Industries We Serve
            </BoldStatement>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {(page.industriesServed || FALLBACK_IMPACT.industriesServed).map((ind: string, idx: number) => (
                <span
                  key={idx}
                  className="px-6 py-3.5 rounded-full text-base font-bold bg-card text-ink border border-line/80 shadow-soft hover:border-brand hover:text-brand hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2.5"
                >
                  {getIndustryIcon(ind)}
                  <span>{ind}</span>
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Global logo strip */}
      <LogoStrip
        title="Regions of Impact"
        items={["United States", "European Union", "United Arab Emirates", "Sultanate of Oman", "Republic of India"]}
      />

      {/* Dynamic Client Logo Carousel */}
      <ClientLogoCarousel clients={clients} />

      {/* Closing CTA */}
      <CTASection
        title="Ready to Scale Your Internal Analytics?"
        description="Collaborate with KVJ Analytics to automate reporting infrastructure or set up corporate learning frameworks for your teams."
        primaryCtaText="Contact Our Consultants"
        primaryCtaHref="/contact"
        secondaryCtaText="Explore Solutions"
        secondaryCtaHref="/corporate"
      />
    </>
  );
}
