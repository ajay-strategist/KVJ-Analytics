"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard, type ServiceCardTone } from "@/components/ui/ServiceCard";

interface Sol { title: string; slug: string; shortDescription?: string }

/**
 * Solutions grid (Corporate + Educational). Cards navigate to the dedicated detail page (best for
 * SEO / sharing / deep content). Every target route is eagerly **prefetched** on mount so the next
 * navigation is already in memory and feels instant; the detail route's `loading.tsx` shows a premium
 * skeleton if data isn't ready. No popup.
 */
export function SolutionsExplorer({
  services, basePath, accentColor, iconMap, defaultIcon, tag, gridClassName, tone,
}: {
  services: Sol[];
  basePath: string;
  accentColor: "cyan" | "blue";
  iconMap: Record<string, string>;
  defaultIcon: string;
  tag: string;
  gridClassName: string;
  tone?: ServiceCardTone;
}) {
  const router = useRouter();
  const cardTone: ServiceCardTone = tone ?? (basePath === "education" ? "emerald" : "teal");

  useEffect(() => {
    services.forEach((s) => { try { router.prefetch(`/${basePath}/${s.slug}`); } catch { /* noop */ } });
  }, [services, basePath, router]);

  return (
    <div className={gridClassName}>
      {services.map((s, idx) => (
        <Reveal key={idx} delay={(idx % 3) * 90}>
          <ServiceCard
            title={s.title}
            description={s.shortDescription || ""}
            href={`/${basePath}/${s.slug}`}
            iconName={iconMap[s.slug] || defaultIcon}
            tag={tag}
            accentColor={accentColor}
            tone={cardTone}
          />
        </Reveal>
      ))}
    </div>
  );
}
