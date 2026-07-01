import type { Metadata } from "next";

// Production site URL (override with NEXT_PUBLIC_SITE_URL in Vercel/env).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.kvjanalytics.in";

export const SITE_NAME = "KVJ Analytics";

const DEFAULT_OG = "/og-image.png"; // add a 1200x630 image at /public/og-image.png

/**
 * Build page metadata with sensible SEO defaults (canonical, OpenGraph, Twitter).
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string; // e.g. "/corporate"
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${opts.path === "/" ? "" : opts.path}`;
  const image = opts.image || DEFAULT_OG;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

/**
 * Organization + LocalBusiness structured data (JSON-LD) for the homepage/site.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}${DEFAULT_OG}`,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Analytics, automation and training company delivering Power BI dashboards, Excel & report automation, spreadsheet consulting, and corporate, college & individual training.",
    email: "info@kvjanalytics.in",
    telephone: "+91-9961813730",
    areaServed: ["India", "UAE", "Oman", "USA", "Europe"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "3rd Floor, Lalan Towers, Banerji Road, High Court Jn.",
      addressLocality: "Cochin",
      addressRegion: "Kerala",
      postalCode: "682031",
      addressCountry: "IN",
    },
    sameAs: [] as string[],
    knowsAbout: [
      "Power BI",
      "Microsoft Excel",
      "Report Automation",
      "Data Analytics",
      "Business Intelligence",
      "Corporate Training",
      "Data Visualization Consulting",
    ],
  };
}
