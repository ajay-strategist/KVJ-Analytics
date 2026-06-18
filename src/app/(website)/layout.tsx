import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { FALLBACK_SITE_SETTINGS } from "@/lib/constants";

export const revalidate = 3600; // Cache for 1 hour, or revalidate on demand

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch settings from Sanity with absolute safety fallbacks
  const data = await client.fetch(siteSettingsQuery).catch((err) => {
    console.warn("Sanity fetch error in WebsiteLayout:", err);
    return null;
  });

  const siteSettings = data || FALLBACK_SITE_SETTINGS;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header siteSettings={siteSettings} />
      <main className="flex-grow pt-[73px] md:pt-[81px]">
        {children}
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
