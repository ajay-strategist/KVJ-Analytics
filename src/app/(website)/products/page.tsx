import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ProductCard } from "@/components/ui/ProductCard";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_PRODUCTS_PAGE } from "@/lib/constants";

export const revalidate = 3600;

export default async function ProductsPage() {
  const pageData = await getPageContent("products");
  const page = mergePageContent(pageData, FALLBACK_PRODUCTS_PAGE);
  const products = page.products && page.products.length > 0 ? page.products : FALLBACK_PRODUCTS_PAGE.products;

  return (
    <>
      {/* ───── HERO (premium light) ───── */}
      <section className="hero-dark hero-grid hero-bleed relative overflow-hidden bg-gradient-hero">
        <div className="blob animate-blob absolute -top-24 right-[10%] w-[34rem] h-[34rem] bg-brand/10 pointer-events-none" />
        <div className="blob animate-blob absolute bottom-[-10rem] left-[2%] w-[26rem] h-[26rem] bg-education/8 pointer-events-none" style={{ animationDelay: "3s" }} />
        <Container className="relative z-10 py-24 md:py-32 text-center">
          <Reveal>
            <p className="text-[13px] uppercase tracking-[0.2em] text-education mb-5 font-bold">Proprietary Software Solutions</p>
          </Reveal>
          <RevealText
            as="h1"
            text={page.heading}
            className="font-display font-medium text-[40px] sm:text-[54px] lg:text-[64px] leading-[1.06] tracking-[-0.025em] mb-6 max-w-[18ch] mx-auto text-ink"
          />
          <Reveal delay={150}>
            <p className="text-xl md:text-2xl signature-gradient-text font-medium">{page.intro}</p>
          </Reveal>
        </Container>
      </section>

      {/* ───── PRODUCT CARDS ───── */}
      <Section background="default" className="relative bg-aurora overflow-hidden">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-5xl mx-auto">
            {products.map((product: any, idx: number) => {
              const isGradeScope = product.slug === "grade-scope";
              return (
                <Reveal key={idx} delay={idx * 110}>
                  <ProductCard
                    name={product.name}
                    tagline={product.tagline}
                    description={product.description}
                    slug={product.slug}
                    keyFeatures={product.keyFeatures}
                    isGradeScope={isGradeScope}
                  />
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
