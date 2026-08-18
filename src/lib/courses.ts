import { supabase } from "@/lib/supabase";

/** The shape the public training card components (`OnlineCoursesClient`, `CategoryPageClient`) render. */
export interface PublicCourse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  banner_url?: string;
  duration: string;
  fee_inr: number;
  offer_price_inr: number | null;
  offer_label: string | null;
  is_locked: boolean;
  hide_pricing?: boolean;
}

/**
 * Normalise a raw `courses` row into `PublicCourse`, tolerant of BOTH schemas:
 *  - legacy (what the admin writes today): `price_inr`, `thumbnail_url`, `segment`, `is_paid`
 *  - target (`training_platform.sql`): `fee_inr`, `banner_url`, `category_id`, `is_published`, `duration`, offers
 */
function mapCourse(c: Record<string, any>): PublicCourse {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    summary: c.summary || c.introduction || "",
    banner_url: c.banner_url || c.thumbnail_url || undefined,
    duration: c.duration || "Self-Paced",
    // Prefer whichever price is actually set. The target schema adds `fee_inr` defaulting to 0,
    // so a 0 there must fall through to the legacy `price_inr` rather than winning.
    fee_inr: Number(c.fee_inr) || Number(c.price_inr) || 0,
    offer_price_inr: c.offer_price_inr != null ? Number(c.offer_price_inr) : null,
    offer_label: c.offer_label || null,
    is_locked: c.is_locked != null ? !!c.is_locked : false,
    hide_pricing: c.hide_pricing != null ? !!c.hide_pricing : false,
  };
}

/**
 * Fetch published courses for a public training page.
 *
 * Reads the REAL `courses` table (so courses added in the admin actually appear) and is resilient
 * to the legacy vs. target schema. There is **no fabricated demo fallback** — if nothing matches,
 * the caller renders an honest empty state (per the project's no-fabricated-content rule).
 *
 * @param segment  Restrict to a segment ("corporate" | "college"). Omit to return the whole
 *                 published catalog (used by the Online Courses page).
 */
export async function getPublicCourses(segment?: "corporate" | "college"): Promise<PublicCourse[]> {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data) return [];

    return (data as Record<string, any>[])
      // legacy schema has no `is_published` → treat every row as live; target schema hides drafts
      .filter((c) => c.is_published === undefined || c.is_published === null || c.is_published === true)
      .filter((c) => !segment || String(c.segment ?? "").toLowerCase() === segment)
      .map(mapCourse);
  } catch (err) {
    console.warn("getPublicCourses error:", err);
    return [];
  }
}
