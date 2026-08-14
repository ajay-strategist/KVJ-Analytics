import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { SITE_URL, organizationSchema, resolveSeo, getSiteSeoSettings } from "@/lib/seo";

// Webandcrafts primary font pairing: Plus Jakarta Sans for both display and body.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const baseMeta = await resolveSeo("/");
  const settings = await getSiteSeoSettings();

  return {
    ...baseMeta,
    metadataBase: new URL(SITE_URL),
    verification: {
      google: settings.google_site_verification || undefined,
      other: settings.bing_site_verification
        ? { "msvalidate.01": [settings.bing_site_verification] }
        : undefined,
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      shortcut: "/favicon-32x32.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSeoSettings();

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-ink font-body">
        <div className="noise-overlay" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        {children}
        <Analytics settings={settings} />
      </body>
    </html>
  );
}
