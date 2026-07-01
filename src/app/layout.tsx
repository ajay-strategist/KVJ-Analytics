import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Analytics } from "@/components/Analytics";
import { SITE_URL, SITE_NAME, organizationSchema } from "@/lib/seo";

// Webandcrafts primary font pairing: Plus Jakarta Sans for both display and body.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KVJ Analytics | Power BI, Excel & Report Automation Training & Consulting",
    template: "%s | KVJ Analytics",
  },
  description:
    "KVJ Analytics delivers Power BI dashboards, Excel & report automation, and data analytics consulting — plus corporate, college & individual training. 16+ years, based in Cochin, serving India, UAE, Oman, USA & Europe.",
  keywords: [
    "Power BI training", "Excel training", "report automation", "data analytics consulting",
    "corporate training", "college training", "Power BI consulting", "dashboard development",
    "business intelligence", "Excel automation", "Cochin", "Kerala", "KVJ Analytics",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website", locale: "en_IN", url: SITE_URL, siteName: SITE_NAME,
    title: "KVJ Analytics | Power BI, Excel & Report Automation Training & Consulting",
    description:
      "Power BI dashboards, Excel & report automation, analytics consulting, and corporate/college/individual training. Talk to KVJ Analytics.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "KVJ Analytics" }],
  },
  twitter: { card: "summary_large_image", title: "KVJ Analytics", description: "Power BI, Excel & report automation training and consulting." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-ink font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <SmoothScroll />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
