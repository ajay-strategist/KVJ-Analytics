import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Award, FileText, BarChart2, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_EDUCATION } from "@/lib/constants";

export const revalidate = 3600;

export default async function EducationalSolutionsPage() {
  const pageData = await getPageContent("education");
  const page = mergePageContent(pageData, FALLBACK_EDUCATION);
  const services = page.services && page.services.length > 0 ? page.services : FALLBACK_EDUCATION.services;

  const getIcon = (slug: string) => {
    switch (slug) {
      case "training-programs": return BookOpen;
      case "certification-programs": return Award;
      case "curriculum-development": return FileText;
      case "academic-analytics-solutions": return BarChart2;
      default: return Sparkles;
    }
  };

  return (
    <>
      {/* ───── HERO (premium light) ───── */}
      <section className="hero-dark hero-grid hero-bleed relative overflow-hidden bg-gradient-hero">
        <div className="blob animate-blob absolute -top-24 right-[6%] w-[34rem] h-[34rem] bg-education/10 pointer-events-none" />
        <div className="blob animate-blob absolute bottom-[-10rem] left-[-6rem] w-[24rem] h-[24rem] bg-brand/8 pointer-events-none" style={{ animationDelay: "3s" }} />
        <Container className="relative z-10 py-24 md:py-32 text-center">
          <Reveal>
            <p className="text-[13px] uppercase tracking-[0.2em] text-education mb-5 font-bold">For Colleges &amp; Universities</p>
          </Reveal>
          <RevealText
            as="h1"
            text={page.heading}
            className="font-display font-medium text-[40px] sm:text-[54px] lg:text-[64px] leading-[1.06] tracking-[-0.025em] mb-6 max-w-[18ch] mx-auto text-ink"
          />
          <Reveal delay={150}>
            <p className="text-xl md:text-2xl signature-gradient-text font-medium mb-6">{page.strapline}</p>
            <p className="text-lg text-slate font-light leading-relaxed max-w-2xl mx-auto">{page.intro}</p>
          </Reveal>
        </Container>
      </section>

      {/* ───── SERVICES GRID ───── */}
      <Section background="default" className="relative bg-aurora overflow-hidden">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 max-w-5xl mx-auto">
            {services.map((service: any, idx: number) => {
              const Icon = getIcon(service.slug);
              return (
                <Reveal key={idx} delay={(idx % 2) * 90}>
                  <Link
                    href={`/education/${service.slug}`}
                    className="card-premium group relative flex h-full flex-col p-7 md:p-8 overflow-hidden hover:border-education/45"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-education/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative mb-6 flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-education/10 border border-education/20 text-education transition-all duration-300 group-hover:bg-education/20">
                        <Icon className="h-5 w-5 icon-anim" />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Academic Service</span>
                    </div>
                    <h3 className="relative text-[20px] md:text-[22px] font-medium text-ink mb-3 transition-colors duration-300 group-hover:text-education">
                      {service.title}
                    </h3>
                    <p className="relative text-[14px] text-slate font-light leading-relaxed mb-6">
                      {service.shortDescription}
                    </p>
                    <div className="relative mt-auto inline-flex items-center gap-2 text-[14px] font-medium text-education">
                      Read Program Details
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* Closing CTA card */}
          <Reveal className="mt-20 md:mt-24 max-w-3xl mx-auto">
            <div className="card-premium relative overflow-hidden p-10 md:p-12 text-center">
              <div className="bg-radial-glow-teal pointer-events-none absolute -top-16 left-1/2 h-56 w-72 -translate-x-1/2" />
              <h4 className="relative text-2xl md:text-3xl font-medium text-ink mb-4">
                Looking to run a certificate program or skill lab?
              </h4>
              <p className="relative text-base text-slate font-light mb-8 max-w-lg mx-auto">
                We partner with academic institutions to provide practical workshops, syllabus updates, and assessment platforms.
              </p>
              <Button href="/contact" variant="accent" className="relative">
                Request an Institutional Partnership Proposal
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
