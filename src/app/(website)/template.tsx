import React from "react";

/**
 * App Router template — remounts on every navigation, so the `.route-fade` entry animation replays
 * on each route change. Opacity-only (no transform) to stay safe with sticky/fixed descendants.
 * Gives a subtle, fast page transition without a blank flash.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
