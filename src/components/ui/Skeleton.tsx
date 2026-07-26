import React from "react";

/** Shimmer skeleton block. Uses the `.skeleton` utility (reduced-motion safe). */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

/**
 * Premium detail-page skeleton — preserves layout (hero + content grid) so navigation shows a
 * structured placeholder instead of a blank screen or spinner, then streams in the real content.
 */
export function DetailPageSkeleton() {
  return (
    <div className="route-fade" aria-busy="true" aria-label="Loading">
      <section className="hero-bleed bg-base pt-32 pb-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <Skeleton className="mb-6 h-4 w-40" />
          <Skeleton className="mb-4 h-12 w-3/4 max-w-2xl" />
          <Skeleton className="mb-8 h-12 w-2/3 max-w-xl" />
          <Skeleton className="mb-2.5 h-5 w-full max-w-lg" />
          <Skeleton className="mb-10 h-5 w-4/5 max-w-md" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-44 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </section>
      <section className="bg-base py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <Skeleton className="mb-8 h-8 w-64" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-line p-7">
                <Skeleton className="mb-5 h-12 w-12 rounded-2xl" />
                <Skeleton className="mb-3 h-5 w-3/4" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
