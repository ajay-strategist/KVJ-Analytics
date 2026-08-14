import type { MetadataRoute } from "next";
import { SITE_URL, getSiteSeoSettings } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSeoSettings();

  // Mandatory security disallow routes (cannot be overridden to preserve system security)
  const mandatoryDisallow = ["/admin", "/api/", "/account"];

  let customDisallow: string[] = [];

  // Parse user-specified disallow lines if custom_robots_txt is provided
  if (settings.custom_robots_txt) {
    const lines = settings.custom_robots_txt.split("\n");
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().startsWith("disallow:")) {
        const path = trimmed.split(":")[1]?.trim();
        if (path && !mandatoryDisallow.includes(path)) {
          customDisallow.push(path);
        }
      }
    });
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: Array.from(new Set([...mandatoryDisallow, ...customDisallow])),
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
