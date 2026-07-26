import React from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Award, Zap } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_EDUCATION } from "@/lib/constants";

export const revalidate = 3600;

export default async function EducationalServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pageData = await getPageContent("education");
  const page = mergePageContent(pageData, FALLBACK_EDUCATION);
  const services = page.services && page.services.length > 0 ? page.services : FALLBACK_EDUCATION.services;
  const service = services.find((s: any) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const title = service.title;
  const description = service.shortDescription;
  const details = service.details || [
    "Integrated practical training models designed for immediate employability.",
    "Certified evaluation programs tracking student technical performance.",
    "Syllabus structures built in alignment with industry hiring metrics.",
  ];

  return (
    <Section background="default" className="bg-base relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Back Link */}
        <Link
          href="/education"
          className="inline-flex items-center text-sm font-bold text-slate hover:text-brand mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Educational Solutions</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Main Details */}
          <div className="lg:col-span-7">
            <Eyebrow segment="education" className="mb-3">
              Educational Solution Detail
            </Eyebrow>
            <BoldStatement variant="hero" className="mb-6 leading-tight text-ink">
              {title}
            </BoldStatement>
            <p className="text-lg text-slate leading-relaxed mb-8 font-medium">
              {description}
            </p>

            <div className="space-y-6 mb-8">
              <h4 className="text-xl font-bold font-display text-ink flex items-center mb-4">
                <Zap className="w-5 h-5 text-education mr-2.5" />
                Program Core Outcomes
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {details.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3.5 bg-surface/50 border border-line/70 rounded-xl p-4 shadow-soft hover:shadow-hover-lift transition-all duration-300"
                  >
                    <CheckCircle2 className="w-5 h-5 text-education shrink-0 mt-0.5" />
                    <span className="text-base text-ink font-semibold leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Conversion Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative overflow-hidden bg-surface/40 rounded-card border border-line/80 p-8 shadow-soft border-l-4 border-l-education hover:shadow-hover-lift hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-education/5 rounded-full blur-2xl pointer-events-none" />
              <span className="inline-flex p-3 rounded-xl bg-education/10 text-education mb-6 relative z-10">
                <Award className="w-6 h-6" />
              </span>
              <h4 className="text-xl font-bold font-display text-ink mb-4 relative z-10">
                Partner With KVJ Analytics
              </h4>
              <p className="text-sm text-slate leading-relaxed mb-6 font-semibold relative z-10">
                Collaborate with our team to bring industry-grade analytics labs, certification programs, and curriculum updates to your campus.
              </p>

              <div className="space-y-3 mb-8 relative z-10">
                {[
                  "Over 50,000+ students trained and certified",
                  "College credit course integrations available",
                  "Continuous practical evaluation support"
                ].map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center space-x-2 text-xs font-bold text-slate/85">
                    <span className="w-1.5 h-1.5 rounded-full bg-education shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <Button
                href={`/contact?interest=${encodeURIComponent("Educational " + title)}`}
                className="w-full py-4 text-center font-bold bg-education hover:bg-teal-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 relative z-10"
              >
                Partner With Us
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
