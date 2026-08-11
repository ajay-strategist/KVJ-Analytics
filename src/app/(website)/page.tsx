import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { V3SuccessStories } from "@/components/v3/Sections";
import { HeroCommandCenter } from "@/components/v3/home/HeroCommandCenter";
import { CapabilityStrip } from "@/components/v3/home/CapabilityStrip";
import { LogoWall } from "@/components/v3/home/LogoWall";
import { SolutionExplorer } from "@/components/v3/home/SolutionExplorer";
import { WhyKvj } from "@/components/v3/home/WhyKvj";
import { IndustryGrid } from "@/components/v3/home/IndustryGrid";
import { BusinessAnalyticsPipeline } from "@/components/v3/home/BusinessAnalyticsPipeline";
import { FinalCTAExperience } from "@/components/v3/home/FinalCTAExperience";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_HOME_PAGE } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

/**
 * HOME (V3 — refined). Analytics / AI / BI / Digital-Transformation positioning.
 * Sections (components/v3/home/*) over CMS content merged onto FALLBACK_HOME_PAGE (never
 * white-screens). Exact approved copy; no fabricated stats/clients. Tech-Ecosystem section removed
 * per review. Rhythm: hero → capabilities → proof → solutions → story → industries → journey →
 * explorer → stories → insights → CTA.
 */
export default async function HomePage() {
  const page = mergePageContent(await getPageContent("home"), FALLBACK_HOME_PAGE);
  const { hero, trustedBy, solutions, whyUs, industries, approach, successStories, insights, finalCta } = page;

  // Capability names come from the approved hero badge (no new copy).
  const capabilities = (hero.badge || "").split("•").map((s) => s.trim()).filter(Boolean);

  // "Trusted by" wall: prefer real client LOGOS from the admin-managed `clients` table
  // (logo_url), falling back to the client name where no logo is uploaded, then to the
  // CMS logo list if there are no clients at all. LogoWall renders <img> for URLs.
  // A logo_url is only usable if it's a DIRECT image (uploaded file / storage URL), not a
  // share link (e.g. OneDrive 1drv.ms) which renders as a broken image. Otherwise show the name.
  const isDirectImage = (u?: string | null) =>
    !!u && typeof u === "string" && u.trim().length > 0 &&
    (/^https?:\/\//i.test(u) || u.startsWith("/"));
  let trustedLogos: string[] = trustedBy.logos;
  try {
    const { data: clientRows } = await supabase
      .from("clients")
      .select("name, logo_url, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    const fromClients = (clientRows ?? [])
      .map((c: { name: string; logo_url: string | null }) => (isDirectImage(c.logo_url) ? c.logo_url! : c.name))
      .filter(Boolean) as string[];
    if (fromClients.length) trustedLogos = fromClients;
  } catch {
    /* fall back to CMS logos on any error */
  }

  return (
    <>
      <HeroCommandCenter
        headline={hero.headline}
        paragraph={hero.description}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
      />

      <CapabilityStrip items={capabilities} />

      <LogoWall heading={trustedBy.heading} logos={trustedLogos} />

      <SolutionExplorer
        eyebrow="Our Solutions"
        heading={solutions.heading}
        description={solutions.description}
        cards={solutions.cards}
        cta={solutions.cta}
      />

      <WhyKvj eyebrow="Why KVJ Analytics" heading={whyUs.heading} cards={whyUs.cards} />

      <IndustryGrid eyebrow="Industries" heading={industries.heading} items={industries.items} />

      <BusinessAnalyticsPipeline
        eyebrow="Our Approach"
        heading={approach.heading}
        stageNames={(approach.steps || []).map((s: { title?: string }) => s.title || "")}
      />

      {successStories?.items?.length ? (
        <V3SuccessStories
          eyebrow="Success Stories"
          heading={successStories.heading}
          items={successStories.items}
          cta={successStories.cta}
        />
      ) : null}

      <section className="relative py-24 md:py-32 overflow-hidden bg-aurora grid-fade">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Insights</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight mb-8">
              {insights.heading}
            </h2>
            <Link href={insights.cta.href}
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-6 py-3 text-[15px] font-medium text-ink backdrop-blur-md hover:border-brand/40 transition-colors">
              {insights.cta.label}
              <ArrowRight className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        </Container>
      </section>

      <FinalCTAExperience
        title={finalCta.title}
        description={finalCta.description}
        primaryCta={finalCta.primaryCta}
        secondaryCta={finalCta.secondaryCta}
      />
    </>
  );
}
