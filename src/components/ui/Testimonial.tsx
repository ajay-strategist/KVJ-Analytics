import React from "react";
import { Quote, Star } from "lucide-react";
import { Card } from "./Card";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  organization?: string;
  rating?: number;
}

export function Testimonial({
  quote,
  author,
  role,
  organization,
  rating = 5,
}: TestimonialProps) {
  return (
    <Card className="flex flex-col justify-between h-full relative" hoverLift>
      <div className="absolute top-6 right-6 text-brand/10 pointer-events-none">
        <Quote className="w-12 h-12 transform rotate-180" />
      </div>
      <div>
        {rating > 0 && (
          <div className="flex space-x-1 mb-6">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-cta text-cta" />
            ))}
          </div>
        )}
        <p className="text-base text-slate italic leading-relaxed mb-6 relative z-10">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
      <div className="border-t border-line pt-4 mt-auto">
        <h5 className="font-bold text-ink font-display">{author}</h5>
        <p className="text-xs text-slate font-medium">
          {role}
          {organization ? ` at ${organization}` : ""}
        </p>
      </div>
    </Card>
  );
}
