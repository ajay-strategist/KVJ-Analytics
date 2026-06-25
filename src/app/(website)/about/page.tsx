import React from "react";
import { AboutClientContent } from "@/components/AboutClient";
import { CTASection } from "@/components/ui/CTASection";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_ABOUT } from "@/lib/constants";

export const revalidate = 3600;

export default async function AboutPage() {
  const data = await getPageContent("about");
  const page = mergePageContent(data, FALLBACK_ABOUT);

  return (
    <>
      <AboutClientContent pageData={page} />

      <CTASection
        title="Let's Build Smarter Systems Together"
        description="Whether you are a corporate organization seeking automation and analytics, or an institution wanting industry-ready outcomes, KVJ Analytics is ready to support your transformation journey."
        primaryCtaText="Contact Our Team"
        primaryCtaHref="/contact"
        secondaryCtaText="View Solutions"
        secondaryCtaHref="/corporate"
      />
    </>
  );
}
