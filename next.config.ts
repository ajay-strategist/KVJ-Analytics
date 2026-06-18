import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Sanity-hosted images if next/image is used in future.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
