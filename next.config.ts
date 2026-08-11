import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // CMS editors paste image links from many hosts (OneDrive, Google Drive,
    // Supabase Storage, stock sites…). List the known-good hosts, then a
    // catch-all so a pasted link from a non-technical editor never 400s.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google Drive (converted)
      { protocol: "https", hostname: "api.onedrive.com" },          // OneDrive (converted)
      { protocol: "https", hostname: "**.supabase.co" },            // Supabase uploads
      { protocol: "https", hostname: "**.sharepoint.com" },         // OneDrive/SharePoint business
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },                        // catch-all for any pasted link
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
