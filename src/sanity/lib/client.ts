import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kvj-analytics";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

// "kvj-analytics" / "your-project-id" are placeholder defaults, not real Sanity
// projects. When Sanity isn't actually configured we must NOT make network
// requests on every page render — they fail and just add latency. Pages already
// fall back to their built-in (CEO-approved) content via `.catch`/`|| fallback`.
export const isSanityConfigured =
  !!projectId && projectId !== "kvj-analytics" && projectId !== "your-project-id";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

if (!isSanityConfigured) {
  // Short-circuit every query to null instantly (no network round-trip).
  // Pages then render their fallback content immediately.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (client as any).fetch = async () => null;
}
