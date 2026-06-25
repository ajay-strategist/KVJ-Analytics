import React from "react";
import { ArrowRight, Cpu, Layers, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
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
              const accent = isGradeScope ? "brand" : "education";
              const accentText = isGradeScope ? "text-brand" : "text-education";
              const Icon = isGradeScope ? Layers : Cpu;
              return (
                <Reveal key={idx} delay={idx * 110}>
                  <div className="card-premium group relative flex h-full flex-col overflow-hidden p-8 md:p-9">
                    {/* top accent line */}
                    <div className={`absolute inset-x-0 top-0 h-[3px] ${isGradeScope ? "bg-brand" : "bg-education"}`} />
                    <div className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${isGradeScope ? "bg-brand/25" : "bg-education/25"}`} />

                    <div className="relative flex items-center gap-4 mb-6">
                      <span className={`grid h-14 w-14 place-items-center rounded-2xl border ${isGradeScope ? "bg-brand/10 border-brand/20 text-brand" : "bg-education/10 border-education/20 text-education"}`}>
                        <Icon className="h-6 w-6 icon-anim" />
                      </span>
                      <div>
                        <h3 className={`text-2xl font-medium text-ink leading-tight transition-colors duration-300 ${isGradeScope ? "group-hover:text-brand" : "group-hover:text-education"}`}>
                          {product.name}
                        </h3>
                        <span className="text-[10px] font-semibold text-muted uppercase tracking-[0.18em]">Software Platform</span>
                      </div>
                    </div>

                    <p className="relative text-sm font-medium text-slate mb-4 italic">{product.tagline}</p>
                    <p className="relative text-[15px] text-slate font-light leading-relaxed mb-7">{product.description}</p>

                    <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                      {product.keyFeatures.map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-start gap-2.5 rounded-xl border border-line bg-white/[0.02] px-3.5 py-3">
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${accentText}`} />
                          <span className="text-[12.5px] font-medium text-ink/90 leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>

                    <Button href={`/products/${product.slug}`} variant="accent" className="relative mt-auto w-full">
                      Request Demo &amp; Details
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
