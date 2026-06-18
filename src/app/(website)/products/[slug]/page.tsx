import React from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Monitor, Layers } from "lucide-react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { client } from "@/sanity/lib/client";
import { productBySlugQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const FALLBACK_PRODUCTS: Record<string, { name: string; tagline: string; desc: string; features: string[] }> = {
  "grade-scope": {
    name: "Grade Scope",
    tagline: "Educational Reporting & Analytics Platform",
    desc: "Grade Scope automates student progress reports, placement reports, training reports, and institutional analytics.",
    features: [
      "Single-click PDF scorecard generation.",
      "Multi-cohort progress analytics showing performance gaps.",
      "NAAC and board-audit compliance reports.",
      "Secure database synchronization across departments.",
    ],
  },
  "protrix": {
    name: "Protrix",
    tagline: "Assignment & Assessment Automation Platform",
    desc: "Protrix helps teachers generate, manage, and evaluate practical assignments while helping students practice and improve skills.",
    features: [
      "Automatic grading of spreadsheet assignments with immediate feedback loops.",
      "Randomized question blocks preventing copy-pasting among students.",
      "Detailed instructor dashboards outlining completion speed and score spreads.",
      "Custom grade export integrations to common learning systems.",
    ],
  },
};

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Query Sanity for product matching this slug
  const product = await client
    .fetch(productBySlugQuery, { slug })
    .catch(() => null);

  const fallback = FALLBACK_PRODUCTS[slug];

  if (!product && !fallback) {
    notFound();
  }

  const name = product?.name || fallback.name;
  const tagline = product?.tagline || fallback.tagline;
  const description = product?.description || fallback.desc;
  const features = product?.keyFeatures || fallback.features;
  const isGradeScope = slug === "grade-scope";

  return (
    <Section background="default" className="bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-bold text-slate hover:text-brand mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Main Details */}
          <div className="lg:col-span-7">
            <Eyebrow segment="education" className="mb-3">
              EdTech Platform
            </Eyebrow>
            <BoldStatement variant="hero" className="mb-4 leading-tight text-ink">
              {name}
            </BoldStatement>
            <p className="text-lg md:text-xl font-bold font-display signature-gradient-text mb-6">
              {tagline}
            </p>
            <p className="text-base md:text-lg text-slate leading-relaxed mb-8 font-medium">
              {description}
            </p>

            <div className="space-y-6 mb-8">
              <h4 className="text-xl font-bold font-display text-ink flex items-center mb-4">
                <Monitor className={`w-5 h-5 mr-2.5 ${isGradeScope ? "text-brand" : "text-education"}`} />
                Platform Capabilities
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {features.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3.5 bg-surface/50 border border-line/70 rounded-xl p-4 shadow-soft hover:shadow-hover-lift transition-all duration-300"
                  >
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isGradeScope ? "text-brand" : "text-education"}`} />
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
            <div className={`relative overflow-hidden bg-surface/40 rounded-card border border-line/80 p-8 shadow-soft border-l-4 hover:shadow-hover-lift hover:-translate-y-1 transition-all duration-300 ${
              isGradeScope ? "border-l-brand" : "border-l-education"
            }`}>
              <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-2xl pointer-events-none ${
                isGradeScope ? "bg-brand/5" : "bg-education/5"
              }`} />
              <span
                className={`inline-flex p-3 rounded-xl mb-6 relative z-10 ${
                  isGradeScope
                    ? "bg-brand/10 text-brand"
                    : "bg-education/10 text-education"
                }`}
              >
                <Layers className="w-6 h-6" />
              </span>
              <h4 className="text-xl font-bold font-display text-ink mb-4 relative z-10">
                Request a Product Demonstration
              </h4>
              <p className="text-sm text-slate leading-relaxed mb-6 font-semibold relative z-10">
                Connect with our product specialists to schedule an interactive video walkthrough of the software and see how it fits your institution.
              </p>

              <div className="space-y-3 mb-8 relative z-10">
                {[
                  "Custom setup configured for your course structure",
                  "Integration audits and student sandbox environment",
                  "Free consultation for college administrators"
                ].map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center space-x-2 text-xs font-bold text-slate/85">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isGradeScope ? "bg-brand" : "bg-education"
                    }`} />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <Button
                href={`/contact?interest=${encodeURIComponent("Demo Request " + name)}`}
                className={`w-full py-4 text-center font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 relative z-10 ${
                  isGradeScope
                    ? "bg-brand hover:bg-brand-700"
                    : "bg-education hover:bg-teal-700"
                }`}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
