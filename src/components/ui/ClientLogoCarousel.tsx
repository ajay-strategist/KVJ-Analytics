import React from "react";
import { urlFor } from "@/sanity/lib/image";

interface ClientData {
  name: string;
  logo?: Record<string, unknown>;
  websiteUrl?: string;
  featured?: boolean;
}

interface ClientLogoCarouselProps {
  title?: string;
  clients: ClientData[];
}

export function ClientLogoCarousel({
  title = "Trusted by Corporates & Institutions",
  clients,
}: ClientLogoCarouselProps) {
  // Only render real clients from the CMS — no placeholder/fabricated logos.
  const activeClients = clients && clients.length > 0 ? clients : [];
  if (activeClients.length === 0) return null;

  // Repeat the list for a seamless marquee loop
  const listToRender = activeClients;
  const marqueeItems = [...listToRender, ...listToRender, ...listToRender, ...listToRender];

  return (
    <div className="py-16 border-b border-line/50 bg-white relative overflow-hidden">

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.25em] text-slate/75">
          {title}
        </p>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative flex overflow-x-hidden w-full select-none">
        {/* Left & Right fade-out overlays for premium depth */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee Container */}
        <div className="animate-marquee flex flex-row items-center gap-6 py-4">
          {marqueeItems.map((item, idx) => {
            const name = item.name;
            const href = item.websiteUrl;

            const CardContent = () => (
              <div className="flex items-center space-x-3 bg-surface border border-line/60 rounded-xl px-6 py-4 shadow-sm hover:border-brand/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer min-w-[180px] md:min-w-[210px] justify-center">
                {item.logo ? (
                  <img
                    src={urlFor(item.logo).width(200).height(80).url()}
                    alt={`${name} Logo`}
                    className="h-7 w-auto object-contain max-w-[140px] opacity-85 hover:opacity-100 transition-opacity duration-300"
                  />
                ) : (
                  <span className="text-[15px] font-bold font-display tracking-tight text-navy">
                    {name}
                  </span>
                )}
              </div>
            );

            if (href) {
              return (
                <a
                  href={href}
                  key={idx}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block shrink-0"
                >
                  <CardContent />
                </a>
              );
            }

            return (
              <div key={idx} className="shrink-0">
                <CardContent />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
