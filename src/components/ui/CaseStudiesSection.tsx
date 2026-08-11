import React from "react";
import { Container } from "./Container";
import { Section } from "./Section";
import { Eyebrow } from "./Eyebrow";
import { BoldStatement } from "./BoldStatement";

export interface CaseStudy {
  id?: string;
  title: string;
  client_name?: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  result?: string;
  image_url?: string;
}

/**
 * Case Studies — admin-managed proof stories (Supabase `case_studies`).
 * Renders nothing when there are no active case studies, so the page never
 * shows an empty shell.
 */
export function CaseStudiesSection({ items }: { items: CaseStudy[] }) {
  if (!items?.length) return null;

  return (
    <Section background="default" className="relative overflow-hidden py-16 md:py-24 border-t border-line">
      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Eyebrow className="mb-4">Case Studies</Eyebrow>
          <BoldStatement variant="h2" className="mb-4 tracking-tight text-ink">
            Outcomes We&apos;ve Delivered
          </BoldStatement>
          <p className="text-lg text-slate leading-relaxed">
            Real engagements where analytics and automation moved the numbers that matter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((c, i) => (
            <article
              key={c.id ?? i}
              className="group flex flex-col rounded-card border border-line bg-card overflow-hidden shadow-soft hover:border-brand/40 transition-colors duration-300"
            >
              {c.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image_url} alt={c.title} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-1.5 w-full signature-gradient" />
              )}
              <div className="flex flex-1 flex-col p-6">
                {(c.industry || c.client_name) && (
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {c.industry && (
                      <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">
                        {c.industry}
                      </span>
                    )}
                    {c.client_name && (
                      <span className="text-[13px] font-semibold text-slate">{c.client_name}</span>
                    )}
                  </div>
                )}
                <h3 className="font-display text-lg font-bold text-ink leading-tight group-hover:text-brand transition-colors">
                  {c.title}
                </h3>

                <div className="mt-4 space-y-3 text-[13.5px] leading-relaxed">
                  {c.challenge && (
                    <p className="text-slate"><span className="font-bold text-ink">Challenge — </span>{c.challenge}</p>
                  )}
                  {c.solution && (
                    <p className="text-slate"><span className="font-bold text-ink">Solution — </span>{c.solution}</p>
                  )}
                </div>

                {c.result && (
                  <div className="mt-auto pt-4">
                    <div className="rounded-xl border border-line bg-surface/40 px-4 py-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand">Result</span>
                      <p className="mt-1 text-[14px] font-semibold text-ink leading-snug">{c.result}</p>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
