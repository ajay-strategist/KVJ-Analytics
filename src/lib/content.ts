/**
 * content.ts — server-side content store helpers.
 * Reads page JSON from `public.page_content` in Supabase (anon/public read).
 * Merges stored content over CEO-approved fallback constants so missing fields
 * always fall back gracefully. Never throws — on any error returns the fallback.
 */

import { createClient } from "@supabase/supabase-js";
import { mockSupabaseClient } from "./mockSupabase";

// ---------------------------------------------------------------------------
// Supabase anon client (read-only, used by public page server components)
// ---------------------------------------------------------------------------
function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return mockSupabaseClient as any;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// ---------------------------------------------------------------------------
// Deep-merge: stored values WIN over fallback values.
// Rules:
//   - null / undefined / "" stored value → keep fallback
//   - Non-empty array stored value → replace entire array
//   - Plain object stored value → recurse
//   - Scalar stored value → replace
// ---------------------------------------------------------------------------
function deepMerge<T extends Record<string, unknown>>(
  fallback: T,
  stored: Record<string, unknown>
): T {
  const result: Record<string, unknown> = { ...fallback };

  for (const key of Object.keys(stored)) {
    const sv = stored[key];
    const fv = (fallback as Record<string, unknown>)[key];

    if (sv === null || sv === undefined || sv === "") continue;

    if (Array.isArray(sv)) {
      // Use stored array only when non-empty
      if (sv.length > 0) result[key] = sv;
    } else if (
      typeof sv === "object" &&
      typeof fv === "object" &&
      fv !== null &&
      !Array.isArray(fv)
    ) {
      // Both are plain objects — recurse
      result[key] = deepMerge(
        fv as Record<string, unknown>,
        sv as Record<string, unknown>
      );
    } else {
      result[key] = sv;
    }
  }

  return result as T;
}

// ---------------------------------------------------------------------------
// getPageContent — fetch raw stored JSON for a slug.
// Returns {} on any error (no throw).
// ---------------------------------------------------------------------------
export async function getPageContent(
  slug: string
): Promise<Record<string, unknown>> {
  try {
    const client = getAnonClient();
    if (!client) return {};

    const { data, error } = await client
      .from("page_content")
      .select("data")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return {};
    return (data.data as Record<string, unknown>) ?? {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// mergePageContent — deep-merge stored content over a typed fallback.
// Returns fallback on any error (never throws).
// ---------------------------------------------------------------------------
export function mergePageContent<T extends Record<string, unknown>>(
  stored: Record<string, unknown>,
  fallback: T
): T {
  try {
    return deepMerge(fallback, stored);
  } catch {
    return fallback;
  }
}
