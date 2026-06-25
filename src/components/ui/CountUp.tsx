"use client";

import React, { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

/** Counts up from 0 to `value` the first time it scrolls into view. */
export function CountUp({ value, suffix = "", className = "", duration = 1500 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setN(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min((t - start) / duration, 1);
              const eased = p * (2 - p); // ease-out
              setN(Math.floor(eased * value));
              if (p < 1) requestAnimationFrame(tick);
              else setN(value);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
