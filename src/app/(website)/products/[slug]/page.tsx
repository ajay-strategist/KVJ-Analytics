import React from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Monitor, Layers } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_PRODUCTS_PAGE } from "@/lib/constants";

export const revalidate = 3600;

import { Metadata } from "next";
import { resolveSeo, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let title = "Product";
  let description = "Product solutions from KVJ Analytics.";

  try {
    const pageData = await getPageContent("products");
    const page = mergePageContent(pageData, FALLBACK_PRODUCTS_PAGE);
    const products = page.products && page.products.length > 0 ? page.products : FALLBACK_PRODUCTS_PAGE.products;
    const product = products.find((p: any) => p.slug === slug);

    if (product) {
      title = product.name;
      description = product.tagline || product.description?.substring(0, 160) || description;
    }
  } catch {}

  return resolveSeo(`/products/${slug}`, {
    title: `${title} | KVJ Analytics Products`,
    description,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pageData = await getPageContent("products");
  const page = mergePageContent(pageData, FALLBACK_PRODUCTS_PAGE);
  const products = page.products && page.products.length > 0 ? page.products : FALLBACK_PRODUCTS_PAGE.products;
  const product = products.find((p: any) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const name = product.name;
  const tagline = product.tagline;
  const description = product.description;
  const features = product.keyFeatures || [];
  const isGradeScope = slug === "grade-scope";
  const demo = { ...FALLBACK_PRODUCTS_PAGE.demoCard, ...((page as any).demoCard || {}) };

  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description || tagline,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://www.kvjanalytics.in/products/${slug}`
    }
  };

  const schemaBreadcrumbs = breadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Products", item: "/products" },
    { name: name, item: `/products/${slug}` },
  ]);

  return (
    <Section background="default" className="bg-base relative overflow-hidden text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#0D9488]/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-bold text-slate hover:text-[#10B981] mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Main Details */}
          <div className="lg:col-span-7">
            <Eyebrow segment={isGradeScope ? "corporate" : "education"} className="mb-3">
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
                <Monitor className={`w-5 h-5 mr-2.5 ${isGradeScope ? "text-[#10B981]" : "text-[#0D9488]"}`} />
                Platform Capabilities
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {features.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3.5 card-tone-emerald border rounded-xl p-4 shadow-soft hover:shadow-hover-lift transition-all duration-300"
                  >
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isGradeScope ? "text-[#10B981]" : "text-[#0D9488]"}`} />
                    <span className="text-base text-slate font-semibold leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Conversion Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 w-full">
            <div className={`relative overflow-hidden card-tone-emerald rounded-[24px] border p-8 shadow-soft border-l-4 hover:shadow-hover-lift hover:-translate-y-1 transition-all duration-300 ${
              isGradeScope ? "border-l-[#10B981]" : "border-l-[#0D9488]"
            }`}>
              <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-2xl pointer-events-none ${
                isGradeScope ? "bg-[#10B981]/5" : "bg-[#0D9488]/5"
              }`} />
              <span
                className={`inline-flex p-3 rounded-xl mb-6 relative z-10 ${
                  isGradeScope
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "bg-[#0D9488]/10 text-[#0D9488]"
                }`}
              >
                <Layers className="w-6 h-6" />
              </span>
              <h4 className="text-xl font-bold font-display text-ink mb-4 relative z-10">
                {demo.title}
              </h4>
              <p className="text-sm text-slate leading-relaxed mb-6 font-semibold relative z-10">
                {demo.description}
              </p>

              <div className="space-y-3 mb-8 relative z-10">
                {(demo.bullets || []).map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="flex items-center space-x-2 text-xs font-bold text-slate/85">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isGradeScope ? "bg-[#10B981]" : "bg-[#0D9488]"
                    }`} />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {isGradeScope ? (
                <Button
                  href="/contact?interest=Product+Demonstrations"
                  className="w-full py-4 text-center font-bold text-black bg-[#10B981] hover:bg-[#10B981]/90 transition-all duration-200 relative z-10"
                >
                  Request a Product Demo
                </Button>
              ) : (
                <Button
                  href="/contact?interest=Product+Demonstrations"
                  className="w-full py-4 text-center font-bold text-white bg-[#0D9488] hover:bg-[#0D9488]/90 transition-all duration-200 relative z-10 border-none"
                >
                  Request a Product Demo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Related Software Platforms */}
        {products.filter((p: any) => p.slug !== slug).length > 0 ? (
          <div className="mt-20 pt-12 border-t border-line/80 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand">Institutional Software</span>
                <h3 className="font-display text-2xl font-bold text-ink mt-1">Explore Other KVJ Software Platforms</h3>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center text-sm font-bold text-brand hover:underline"
              >
                View All Products <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products
                .filter((p: any) => p.slug !== slug)
                .map((rel: any, rIdx: number) => (
                  <Link
                    key={rIdx}
                    href={`/products/${rel.slug}`}
                    className="group rounded-2xl border border-line bg-surface/50 p-6 hover:border-brand/40 hover:shadow-hover-lift transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-display font-bold text-xl text-ink group-hover:text-brand transition-colors mb-2">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-semibold text-brand mb-2 italic">{rel.tagline}</p>
                      <p className="text-xs text-slate line-clamp-3 leading-relaxed mb-4">
                        {rel.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center text-xs font-bold text-brand group-hover:underline mt-auto">
                      Explore Platform <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
