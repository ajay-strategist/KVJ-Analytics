import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { SplitHeading, ScaleIn, Parallax } from "@/components/v3/ScrollFx";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_PRODUCTS_PAGE } from "@/lib/constants";

import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "EdTech Products — Grade Scope & Protrix",
  description:
    "Grade Scope and Protrix: KVJ Analytics' proprietary platforms for automated educational reporting, assessment automation, and institutional analytics. Request a demo.",
  path: "/products",
  keywords: ["Grade Scope", "Protrix", "assessment automation", "educational reporting software", "institutional analytics"],
});

export default async function ProductsPage() {
  const pageData = await getPageContent("products");
  const page = mergePageContent(pageData, FALLBACK_PRODUCTS_PAGE);
  const products = page.products && page.products.length > 0 ? page.products : FALLBACK_PRODUCTS_PAGE.products;

  return (
    <div className="w-full bg-white relative min-h-screen overflow-hidden">
      {/* 3D scrolling grid style keyframe */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes grid-move {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(60px);
          }
        }
        .perspective-container {
          perspective: 350px;
          perspective-origin: 50% 20%;
        }
        .grid-plane {
          background-image: 
          linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: rotateX(75deg);
          transform-origin: top center;
          animation: grid-move 4s linear infinite;
        }
        @keyframes signature-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden hero-emerald text-white pt-28 pb-16 border-b border-line">
        {/* 3D Perspective Grid Background layer */}
        <Parallax speed={0.28} className="absolute inset-0 z-0 pointer-events-none opacity-40 perspective-container">
          <div className="absolute inset-x-0 -top-40 bottom-0 h-[200%] grid-plane" />
        </Parallax>

        {/* Data streams overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <line x1="200" y1="0" x2="200" y2="1000" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" strokeDasharray="10, 20" />
            <line x1="500" y1="0" x2="500" y2="1000" stroke="rgba(13, 148, 136, 0.04)" strokeWidth="1" strokeDasharray="5, 15" />
            <line x1="800" y1="0" x2="800" y2="1000" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" strokeDasharray="15, 25" />
          </svg>
        </div>

        <div className="absolute -top-24 right-[10%] w-[34rem] h-[34rem] bg-brand/5 pointer-events-none blur-[100px]" />
        <div className="absolute bottom-[-10rem] left-[2%] w-[26rem] h-[26rem] bg-corporate/5 pointer-events-none blur-[90px]" />
        
        <Container className="relative z-10 text-center">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#10B981] px-3.5 py-1.5 bg-brand/10 rounded-full w-fit border border-[#10B981]/20 mx-auto block mb-6">
              Proprietary Software Solutions
            </span>
          </Reveal>
          <SplitHeading
            as="h1"
            className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-white mb-6 max-w-[18ch] mx-auto"
          >
            {page.heading}
          </SplitHeading>
          <Reveal delay={150}>
            <p className="text-xl md:text-2xl font-medium text-emerald-300 max-w-2xl mx-auto mb-4">
              {page.intro}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ───── PRODUCT CARDS ───── */}
      <section className="py-20 relative bg-white overflow-hidden text-ink">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product: any, idx: number) => {
              const isGradeScope = product.slug === "grade-scope";
              return (
                <ScaleIn key={idx} delay={idx * 0.12}>
                  <ProductCard
                    name={product.name}
                    tagline={product.tagline}
                    description={product.description}
                    slug={product.slug}
                    keyFeatures={product.keyFeatures}
                    isGradeScope={isGradeScope}
                    animationStyle={product.animation_style || product.animationStyle}
                    customAnimationHtml={product.customAnimationHtml || product.custom_animation_html}
                  />
                </ScaleIn>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
