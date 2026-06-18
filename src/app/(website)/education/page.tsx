import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  BookOpen, 
  Award, 
  FileText, 
  BarChart2, 
  Sparkles 
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { client } from "@/sanity/lib/client";
import { solutionsPageQuery, servicesQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const FALLBACK_PAGE = {
  heading: "Educational Solutions",
  strapline: "Industry-Ready Talent. Built Faster.",
  intro:
    "KVJ Analytics helps institutions bridge the gap between academics and industry through practical training, automation, and analytics platforms.",
};

const FALLBACK_SERVICES = [
  {
    title: "Training Programs",
    slug: "training-programs",
    shortDescription:
      "Practical programs in Excel, Power BI, Data Analytics, Financial Analytics, and Business Intelligence.",
  },
  {
    title: "Certification Programs",
    slug: "certification-programs",
    shortDescription:
      "Industry-oriented certifications focused on employability and practical skills.",
  },
  {
    title: "Curriculum Development",
    slug: "curriculum-development",
    shortDescription:
      "Modern, analytics-driven curriculum aligned with industry expectations.",
  },
  {
    title: "Academic Analytics Solutions",
    slug: "academic-analytics-solutions",
    shortDescription:
      "Technology platforms for reporting, evaluation, analytics, and performance tracking.",
  },
];

export default async function EducationalSolutionsPage() {
  const pageData = await client
    .fetch(solutionsPageQuery, { category: "educational" })
    .catch(() => null);

  const servicesData = await client
    .fetch(servicesQuery, { category: "educational" })
    .catch(() => null);

  const page = pageData || FALLBACK_PAGE;
  const services = servicesData && servicesData.length > 0 ? servicesData : FALLBACK_SERVICES;

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
    <Section background="default" className="bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-education/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Eyebrow segment="education" className="mb-4">
            For Colleges & Universities
          </Eyebrow>
          <BoldStatement variant="hero" className="mb-6 text-education">
            {page.heading}
          </BoldStatement>
          <p className="text-xl md:text-2xl font-bold font-display signature-gradient-text mb-6">
            {page.strapline}
          </p>
          <p className="text-lg md:text-xl text-slate font-medium leading-relaxed max-w-2xl mx-auto">
            {page.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service: any, idx: number) => {
            const IconComponent = getIcon(service.slug);
            return (
              <Card
                key={idx}
                hoverLift
                className="flex flex-col justify-between h-full border-t-4 border-t-education border-line/80 relative overflow-hidden group hover:shadow-[0_12px_32px_rgba(13,148,136,0.12)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-education/80 uppercase tracking-widest">
                      academic service
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-education/5 text-education flex items-center justify-center">
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-display text-ink mb-3 group-hover:text-education transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate font-medium leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                </div>
                <Link
                  href={`/education/${service.slug}`}
                  className="inline-flex items-center text-sm font-bold text-education hover:underline mt-auto group/link"
                >
                  <span className="mr-1.5">Read Program Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Closing Quick Info Card */}
        <div className="mt-24 text-center max-w-2xl mx-auto border border-line/80 rounded-card p-10 bg-surface/40 relative overflow-hidden shadow-soft hover:shadow-hover-lift hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-education/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
          <h4 className="text-xl font-bold font-display text-ink mb-4 relative z-10">
            Looking to run a certificate program or skill lab?
          </h4>
          <p className="text-base text-slate mb-8 max-w-lg mx-auto relative z-10 font-medium">
            We partner with academic institutions to provide practical workshops, syllabus updates, and assessment platforms.
          </p>
          <Button href="/contact" className="relative z-10 px-8 py-3.5 bg-cta hover:bg-cta-600 text-white border-none shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-bold">
            Request an Institutional Partnership Proposal
          </Button>
        </div>
      </Container>
    </Section>
  );
}
