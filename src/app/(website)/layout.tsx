import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { IntroLoader } from "@/components/effects/IntroLoader";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { AnimationProvider } from "@/components/effects/AnimationProvider";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_SITE_SETTINGS } from "@/lib/constants";

import { UtmTracker } from "@/components/layout/UtmTracker";

export const revalidate = 3600; // Cache for 1 hour, or revalidate on demand

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch settings from Supabase page_content with safety fallbacks
  const storedSettings = await getPageContent("site-settings");
  const siteSettings = mergePageContent(storedSettings, FALLBACK_SITE_SETTINGS);

  return (
    <AnimationProvider>
      <UtmTracker />
      <div className="min-h-screen flex flex-col justify-between">
        <IntroLoader />
        <ScrollProgress />
        <Header siteSettings={siteSettings} />
        <main className="flex-grow pt-[73px] md:pt-[81px]">
          {children}
        </main>
        <Footer siteSettings={siteSettings} />
        <WhatsAppFloat phone={(siteSettings.contactInfo?.phones?.[0] || "9961813730").replace(/\D/g, "").replace(/^(?!91)/, "91")} />
      </div>
    </AnimationProvider>
  );
}
