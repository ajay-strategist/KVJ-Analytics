import React from "react";
import { AboutClientContent } from "@/components/AboutClient";
import { CTASection } from "@/components/ui/CTASection";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_ABOUT } from "@/lib/constants";

import { Metadata } from "next";
import { resolveSeo } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("/about", {
    title: "About Us | KVJ Analytics",
    description: "Learn about KVJ Analytics, our team, founding history, and our values in business intelligence, automation, and data analytics consulting.",
  });
}

export default async function AboutPage() {
  const data = await getPageContent("about");
  const page = mergePageContent(data, FALLBACK_ABOUT);
  const cta = { ...FALLBACK_ABOUT.cta, ...(page.cta || {}) };

  return (
    <>
      <AboutClientContent pageData={page} />

      <CTASection
        title={cta.title}
        description={cta.description}
        primaryCtaText={cta.primaryText}
        primaryCtaHref={cta.primaryHref || "/contact"}
        secondaryCtaText={cta.secondaryText || undefined}
        secondaryCtaHref={cta.secondaryHref || undefined}
      />
    </>
  );
}
