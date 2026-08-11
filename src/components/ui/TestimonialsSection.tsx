import React from "react";
import { Star } from "lucide-react";
import { Container } from "./Container";
import { Section } from "./Section";
import { Eyebrow } from "./Eyebrow";
import { BoldStatement } from "./BoldStatement";

export interface Testimonial {
  id?: string;
  client_name: string;
  client_title?: string;
  client_company?: string;
  quote: string;
  avatar_url?: string;
  rating?: number;
}

/**
 * Testimonials — admin-managed client quotes (Supabase `testimonials`).
 * Renders nothing when there are no active testimonials.
 */
export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (!items?.length) return null;

  return (
    <Section background="default" className="relative overflow-hidden py-16 md:py-24 border-t border-line bg-surface/20">
      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Eyebrow className="mb-4">Testimonials</Eyebrow>
          <BoldStatement variant="h2" className="mb-4 tracking-tight text-ink">
            What Our Clients Say
          </BoldStatement>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((t, i) => {
            const initials = t.client_name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            const rating = Math.max(0, Math.min(5, t.rating ?? 5));
            return (
              <figure
                key={t.id ?? i}
                className="flex flex-col rounded-card border border-line bg-card p-6 shadow-soft hover:border-brand/40 transition-colors duration-300"
              >
                {rating > 0 && (
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`h-4 w-4 ${s < rating ? "fill-amber-400 text-amber-400" : "text-line"}`} />
                    ))}
                  </div>
                )}
                <blockquote className="flex-1 text-[15px] leading-relaxed text-slate">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  {t.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar_url} alt={t.client_name} className="h-10 w-10 rounded-full object-cover border border-line" />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 border border-brand/25 text-[13px] font-bold text-brand">
                      {initials}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold text-ink leading-tight">{t.client_name}</div>
                    {(t.client_title || t.client_company) && (
                      <div className="text-[12.5px] text-slate leading-tight">
                        {[t.client_title, t.client_company].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
