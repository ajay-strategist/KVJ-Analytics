import React from "react";
import { urlFor } from "@/sanity/lib/image";

interface ClientData {
  name: string;
  logo?: Record<string, unknown>;
  logoUrl?: string;
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
  const activeClients = clients && clients.length > 0 ? clients : [];
  if (activeClients.length === 0) return null;

  // If clients count is small, display them statically. If they increase (> 4), scroll from right to left.
  const shouldScroll = activeClients.length > 4;

  const CardContent = ({ item, name }: { item: ClientData; name: string }) => (
    <div className="flex items-center justify-center px-4 py-2 hover:scale-105 transition-transform duration-300 select-none">
      {item.logoUrl ? (
        <img
          src={item.logoUrl}
          alt={`${name} Logo`}
          className="h-10 md:h-12 w-auto object-contain max-w-[180px] opacity-75 hover:opacity-100 transition-opacity duration-300"
        />
      ) : item.logo ? (
        <img
          src={urlFor(item.logo).width(200).height(80).url()}
          alt={`${name} Logo`}
          className="h-10 md:h-12 w-auto object-contain max-w-[180px] opacity-75 hover:opacity-100 transition-opacity duration-300"
        />
      ) : (
        <span className="text-base font-semibold font-display tracking-tight text-slate hover:text-ink transition-colors">
          {name}
        </span>
      )}
    </div>
  );

  const renderItem = (item: ClientData, idx: number) => {
    const name = item.name;
    const href = item.websiteUrl;

    if (href) {
      return (
        <a
          href={href}
          key={idx}
          target="_blank"
          rel="noopener noreferrer"
          className="block shrink-0"
        >
          <CardContent item={item} name={name} />
        </a>
      );
    }

    return (
      <div key={idx} className="shrink-0">
        <CardContent item={item} name={name} />
      </div>
    );
  };

  if (!shouldScroll) {
    return (
      <div className="py-16 border-b border-line/50 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.25em] text-slate/75">
            {title}
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 max-w-[1200px] mx-auto px-4 relative z-10 animate-fade-in">
          {activeClients.map((item, idx) => renderItem(item, idx))}
        </div>
      </div>
    );
  }

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
        <div className="animate-marquee flex flex-row items-center gap-16 md:gap-24 py-4">
          {marqueeItems.map((item, idx) => renderItem(item, idx))}
        </div>
      </div>
    </div>
  );
}
