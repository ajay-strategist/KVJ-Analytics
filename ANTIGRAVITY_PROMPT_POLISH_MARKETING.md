# Antigravity Prompt — Polish Current Build + Digital Marketing Layer (KVJ Analytics)

Paste everything below the line into Antigravity. Based on an audit of the live site (kvj-analytics-six.vercel.app) and the current codebase on 2026-07-05.

---

You are a senior full-stack + growth engineer working on the EXISTING KVJ Analytics Next.js site. Do NOT rebuild it. Two jobs, in order: **(A) polish the current design for consistency**, **(B) add the digital-marketing/CRO/SEO/lead-gen layer**. Work step by step; after each step summarize what changed and how to verify.

## ⛔ ABSOLUTE CONTENT RULE — READ FIRST
The CEO approved the exact website copy. It lives in `src/lib/constants.ts` (FALLBACK_* objects) and is rendered via `getPageContent`/`mergePageContent`.
1. You may NOT change, rewrite, shorten, "improve", or truncate ANY existing visible copy. Design/layout/styling/motion changes only.
2. You may NOT invent facts: no fake dates, timelines, client names, statistics, awards, partnerships, or testimonials. (A previous AI run fabricated an About-page timeline and placeholder gibberish — this was a serious incident. Do not repeat it.)
3. The ONLY numbers/claims you may use anywhere: 16+ years experience; 50,000+ Young Professionals Trained; 5,000+ Senior Professionals Trained; regions Kerala, India, UAE, Oman, USA, Europe; contact details and GSTIN exactly as in constants.ts.
4. Any NEW copy this task requires (lead-magnet titles, popup text, email subject lines, CTA microcopy) must: (a) be strictly factual per rule 3, (b) live in ONE new file `src/lib/marketingCopy.ts` with a `// PENDING CEO APPROVAL` header so it can be reviewed and swapped in one place. Never scatter new copy across components.
5. Before finishing, diff every page's visible text against `constants.ts` and confirm zero drift.

## Current state (do not re-create what exists)
- Next.js App Router + TypeScript + Tailwind v4 (`@theme` tokens in globals.css), Supabase (leads, courses, enrollments, admin), content fallbacks in `constants.ts`.
- Theme: premium dark (obsidian base `#050505`, neon-cyan `#00F0FF` / electric-blue `#0072FF` accents), Plus Jakarta Sans. **Keep this theme** — polish it, don't replace it.
- Already built (extend, don't duplicate): `src/lib/seo.ts` (pageMeta: canonical/OG/Twitter), `src/app/sitemap.ts`, `src/app/robots.ts`, JSON-LD in root layout + blog posts, env-gated GA4 + Meta Pixel (`src/components/Analytics.tsx`), contact form → `/api/contact` → Supabase `leads` with `source_page` + UTM fields + Resend notification, `WhatsAppFloat.tsx`, admin leads inbox.

## PART A — Design polish (visual consistency pass)
Goal: every page looks like ONE deliberate premium product. No copy changes.
1. **Audit all routes** (Home, About, Corporate + [slug], Education, Products + [slug], Training hub + one-to-one/online-courses/colleges/corporate/internships + course pages, Blog, Impact, Careers, Contact, Privacy/Terms, signin/signup, account) and list inconsistencies: spacing rhythm, heading scale, card styles, button variants, section backgrounds, hover states.
2. Normalize to the token system in `globals.css`: one section padding scale, one card style (translucent glass, `--color-line` hairline, consistent radius/shadow), one button set (primary/secondary/ghost), consistent eyebrow labels, consistent hero treatment on every page (dark animated hero pattern already used on Home).
3. Motion: consistent fade/slide-up on scroll, count-up metrics, hover lift; honor `prefers-reduced-motion`.
4. Fix responsive breakpoints and any layout breaks on mobile; WCAG AA contrast (verify neon-cyan text on dark passes; darken where needed for small text).
5. Deliver a per-page before/after summary.

## PART B — Digital marketing layer

### B1. Conversion (CRO)
- One primary CTA per segment, using EXISTING approved CTA text where available: Corporate pages → "Request a Demo" / "Contact Our Team"; Education → "Partner With Us" style CTA (text from marketingCopy.ts, pending approval); Training/courses → "Enroll Now". Place above the fold, repeat mid-page, and end every page with the existing closing CTA band pattern.
- Sticky header CTA (exists — verify) + **sticky mobile bottom CTA bar** (Call | WhatsApp | Enquire) on marketing pages.
- Click-to-call on all phone numbers (already partially done — make universal).
- **Lead magnets** (email-gated): brochure PDF download, course syllabus PDF, "Analytics Readiness Checklist". Gate = short form (Name, Email/Phone, Interest) → `leads` with `lead_magnet` + `source_page` + UTM → Resend team alert + auto-reply with the file link. Use placeholder PDFs; titles/copy in marketingCopy.ts.
- **Exit-intent / 60% scroll-depth popup** offering one magnet; frequency-capped via localStorage (max once per 7 days); never on admin/account/learn pages; easy dismiss.
- Trust signals near every CTA: the four approved metrics, GSTIN/registered business, regions served. NO invented logos or testimonials — if a testimonial component exists with no real data, hide it.

### B2. Analytics & measurement (all env-gated; render nothing when unset)
- Extend `Analytics.tsx`: add GTM (`NEXT_PUBLIC_GTM_ID`), Microsoft Clarity (`NEXT_PUBLIC_CLARITY_ID`), LinkedIn Insight (`NEXT_PUBLIC_LINKEDIN_PARTNER_ID`); keep GA4 + Meta Pixel.
- Fire conversion events (GA4 + dataLayer + fbq where set): `form_submit`, `demo_request`, `enroll_start`, `payment_success`, `brochure_download`, `call_click`, `whatsapp_click`, `popup_open`, `popup_submit`. Central helper `src/lib/track.ts`; every CTA/form wired through it.
- Persist UTM params (first-touch, sessionStorage) and attach to every lead insert (fields already exist in `/api/contact` — reuse the pattern for all new forms).
- `/admin` leads page: add source/UTM/magnet columns, counts by source, CSV export (extend existing page).

### B3. SEO
- Verify `pageMeta` is used on EVERY route with unique title/description; add intent+location keywords (e.g. "Power BI training Kochi", "report automation services India", "corporate Excel training Kerala") — meta only, never visible copy.
- JSON-LD additions: `LocalBusiness` (exact NAP: 3rd Floor, Lalan Towers, Banerji Road, High Court Jn., Cochin-682 031, Ernakulam, Kerala, India; phones from constants.ts) in root layout; `Course` schema on course detail pages (only fields that exist in DB); `BreadcrumbList` on detail pages; keep existing Organization + Article.
- Confirm `sitemap.ts` covers all public routes incl. dynamic course/blog/service slugs; canonicals point to https://www.kvjanalytics.in.
- Internal linking: related-services links on corporate/education detail pages, related courses on training pages, relevant course CTA at the end of each blog post — link labels from existing nav titles only.
- Performance: next/image everywhere, lazy-load below fold, font display swap, target Lighthouse 90+ / Core Web Vitals pass.

### B4. Deliverables
- `MARKETING.md`: every event name, env var, lead magnet, popup rules, and how a non-coder edits marketingCopy.ts.
- `.env.local.example` updated with all new vars.
- Final checklist: content diff vs constants.ts ✅, all events firing (show test steps) ✅, Lighthouse scores ✅.

Begin with Part A step 1 (the route-by-route audit) and show me the audit before changing anything.
