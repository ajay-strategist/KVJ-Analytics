import React from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_PRODUCTS_PAGE } from "@/lib/constants";

export const revalidate = 3600;

export default async function ProductsPage() {
  const pageData = await getPageContent("products");
  const page = mergePageContent(pageData, FALLBACK_PRODUCTS_PAGE);
  const products = page.products && page.products.length > 0 ? page.products : FALLBACK_PRODUCTS_PAGE.products;

  return (
    <Section background="default" className="bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-45 pointer-events-none" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Eyebrow segment="education" className="mb-4">
            Proprietary Software Solutions
          </Eyebrow>
          <BoldStatement variant="hero" className="mb-6">
            {page.heading}
          </BoldStatement>
          <p className="text-xl md:text-2xl font-bold font-display signature-gradient-text mb-6">
            {page.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {products.map((product: any, idx: number) => {
            const isGradeScope = product.slug === "grade-scope";
            const shadowHover = isGradeScope 
              ? "hover:shadow-[0_12px_32px_rgba(29,78,216,0.12)]"
              : "hover:shadow-[0_12px_32px_rgba(13,148,136,0.12)]";
            return (
              <Card
                key={idx}
                hoverLift
                className={`flex flex-col justify-between h-full border-t-4 p-8 relative overflow-hidden group transition-all duration-300 ${shadowHover} ${
                  isGradeScope ? "border-t-brand" : "border-t-education"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-3.5 mb-6">
                    <div
                      className={`p-3 rounded-xl ${
                        isGradeScope
                          ? "bg-brand/10 text-brand"
                          : "bg-education/10 text-education"
                      }`}
                    >
                      {isGradeScope ? (
                        <Layers className="w-6 h-6" />
                      ) : (
                        <Cpu className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-display text-ink leading-tight group-hover:text-brand transition-colors duration-200">
                        {product.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate uppercase tracking-widest block mt-0.5">
                        software platform
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-semibold text-slate/85 mb-4 italic">
                    {product.tagline}
                  </p>
                  
                  <p className="text-base text-slate leading-relaxed mb-6 font-medium">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                    {product.keyFeatures.map((feat: string, fIdx: number) => (
                      <div
                        key={fIdx}
                        className="flex items-center space-x-2 bg-surface/50 px-3.5 py-2.5 rounded-lg border border-line/60"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isGradeScope ? "bg-brand" : "bg-education"
                          }`}
                        />
                        <span className="text-xs font-bold text-ink leading-none">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  href={`/products/${product.slug}`}
                  className={`w-full py-3.5 text-center font-bold border-2 rounded-btn transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-1 ${
                    isGradeScope
                      ? "border-brand text-brand hover:bg-brand/5 hover:shadow-sm"
                      : "border-education text-education hover:bg-education/5 hover:shadow-sm"
                  }`}
                >
                  <span>Request Demo & Details</span>
                  <span>→</span>
                </Button>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
