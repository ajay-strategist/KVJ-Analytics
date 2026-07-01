import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ProductCard } from "@/components/ui/ProductCard";
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
    <div className="w-full bg-[#FAFAFC] text-[#0F172A] relative min-h-screen overflow-hidden">
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
            linear-gradient(rgba(11, 31, 58, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11, 31, 58, 0.04) 1px, transparent 1px);
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

      {/* 3D Perspective Grid Background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 perspective-container">
        <div className="absolute inset-x-0 -top-40 bottom-0 h-[200%] grid-plane" />
      </div>

      {/* Data streams overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <line x1="200" y1="0" x2="200" y2="1000" stroke="rgba(11, 31, 58, 0.05)" strokeWidth="1" strokeDasharray="10, 20" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="rgba(11, 31, 58, 0.04)" strokeWidth="1" strokeDasharray="5, 15" />
          <line x1="800" y1="0" x2="800" y2="1000" stroke="rgba(11, 31, 58, 0.05)" strokeWidth="1" strokeDasharray="15, 25" />
        </svg>
      </div>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden pt-28 pb-16 border-b border-slate-100">
        <div className="blob animate-blob absolute -top-24 right-[10%] w-[34rem] h-[34rem] bg-brand/5 pointer-events-none blur-[100px]" />
        <div className="blob animate-blob absolute bottom-[-10rem] left-[2%] w-[26rem] h-[26rem] bg-corporate/5 pointer-events-none blur-[90px]" style={{ animationDelay: "3s" }} />
        
        <Container className="relative z-10 text-center">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand px-3.5 py-1.5 bg-brand/10 rounded-full w-fit border border-brand/20 mx-auto block mb-6">
              Proprietary Software Solutions
            </span>
          </Reveal>
          <RevealText
            as="h1"
            text={page.heading}
            className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-[#0B1F3A] mb-6 max-w-[18ch] mx-auto"
          />
          <Reveal delay={150}>
            <p className="text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-brand via-corporate to-brand animate-[signature-flow_6s_linear_infinite] bg-[size:200%_auto] max-w-2xl mx-auto mb-4">
              {page.intro}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ───── PRODUCT CARDS ───── */}
      <section className="py-20 relative bg-transparent overflow-hidden">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
      </section>
    </div>
  );
}
