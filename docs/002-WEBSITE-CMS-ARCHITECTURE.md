# 002 — Website CMS Architecture
**KVJ Analytics Platform V3 · Foundation doc ⭐⭐⭐⭐⭐**
How every page is stored, edited, merged, revalidated, and (in the target state) composed from
reusable blocks. Read with **001** (design system) and **003** (component library). Current
implementation is quoted verbatim and marked **[in code]**; target additions **[to add]**.

---

## 1. Principle
A non-programmer must be able to edit **everything** — copy, images, ordering, SEO — with **zero
risk of white-screening the site**. Two rules make that safe and are non-negotiable:

1. **Fallback-merge is sacred.** Public pages render `mergePageContent(await getPageContent(slug),
   FALLBACK_X)`. Stored CMS JSON is merged *over* CEO-approved fallback constants, so any missing/
   empty field silently falls back. A page can never render empty. **[in code]**
2. **Content is CEO-locked** (per 001 + CLAUDE.md golden rules): approved copy lives in
   `constants.ts` `FALLBACK_*`; the CMS overrides *design-safe* fields, never fabricates.

---

## 2. Current architecture **[in code]**
### Store
- Table **`page_content`**: `slug` (PK/unique), `data` (JSONB), `updated_at`.
- One row per page/fragment, keyed by **slug** (`home`, `about`, `corporate`, `education`,
  `products`, `contact`, `training`, `online-courses`, `internships`, `training-corporate`,
  `training-colleges`, `training-one-to-one`, `careers`, `blog`, `impact`, `privacy`, `terms`,
  `site-settings`).

### Read path (public, server components)
`src/lib/content.ts`:
- `getPageContent(slug)` — anon Supabase read of `page_content.data`; **returns `{}` on any error,
  never throws**. Falls back to `mockSupabaseClient` when env is absent.
- `mergePageContent(stored, fallback)` → `deepMerge(fallback, stored)` where **stored wins**, with
  these merge rules: `null`/`undefined`/`""` → keep fallback; non-empty array → replace; plain
  object → recurse; scalar → replace. Empty arrays and blank strings **do not** clobber fallback.
- Pages set `export const revalidate = 3600` and call the merge in their server component.

### Write path (admin)
`src/app/api/admin/content/[slug]/route.ts`:
- **Auth:** `admin_session` cookie must equal `adminToken()` (HMAC, `lib/adminAuth.ts`) — same guard
  as all admin APIs.
- **GET** → `{ slug, stored, fallback, updated_at }` (fallback from a `FALLBACKS` slug→const map).
- **PUT** → `upsert({ slug, data, updated_at }, { onConflict: "slug" })` then **`revalidatePath`**
  for the matching route(s) (e.g. `home`→`/`; `corporate`→`/corporate` + `/corporate/[slug]`;
  `site-settings`→`/` layout). Invalid JSON → 400; unauthorized → 401.

### Editor UI
`src/app/admin/content/page.tsx` — client component. Left = `PAGES` list; right = a **bespoke
structured form per page** (typed interfaces `HomeData`, `AboutData`, `CorporateData`, …) bound to
`genericData`/`setGenericData`, saved as full JSON via PUT. Images via `POST /api/admin/upload`
(Supabase Storage). Editor components: `SimpleHeaderEditor`, `ImpactEditor`, `LegalEditor`, etc.

### Recipe to make a new page editable **[in code]**
1. Add `FALLBACK_X` to `constants.ts`.
2. Public page: `mergePageContent(await getPageContent("slug"), FALLBACK_X)` → render `page.*`.
3. Add slug to the route's `FALLBACKS` map + a `revalidatePath` branch.
4. Add to `PAGES` + a render branch/editor in `admin/content/page.tsx`.

---

## 3. Limitations of the current model (why we evolve it)
- **Bespoke editor per page** — each page needs a hand-coded form + typed interface + render branch.
  Doesn't scale to arbitrary marketing pages or CEO-created pages.
- **No block model** — a page is a fixed-shape JSON object, not an ordered list of reorderable
  sections. CEO can't add/remove/reorder sections or spin up a brand-new page from templates.
- **No versioning / draft / publish / preview** — PUT overwrites live immediately.
- **Media is ad-hoc** — uploads return URLs pasted into fields; no media library/reuse (see 007).
- **SEO is page-code-level** (`seo.ts` `pageMeta()`), not editable per page in the CMS.

The target keeps §1–2 intact (fallback-merge, slug store, revalidate) and layers a **block model**
on top — additive, non-breaking.

---

## 4. Target content model: Page → Sections → Blocks → Components → Content → Media → SEO
```
Page
 ├─ meta:      slug · title · status(draft|published) · seo{…} · updatedAt · version
 └─ sections[] (ordered, reorderable)
      ├─ type:  "hero" | "cardGrid" | "timeline" | "faq" | "industries" | "successStories" | …
      ├─ id:    stable uuid (for reorder/version diff)
      ├─ props: { eyebrow, heading, description, columns, … }   ← maps 1:1 to a 003 component
      └─ blocks[] (optional, for repeatable child items)
           ├─ type:  "card" | "step" | "faqItem" | "stat" | "logo" | …
           └─ content: { title, body, points[], mediaRef, href, … }
```
- **Section** = a full-width band on the page; renders exactly one **003 component** (`V3Hero`,
  `V3CardGrid`, `V3Timeline`, `V3Faq`, …). `section.type` → component; `section.props` → its props.
- **Block** = a repeatable child inside a section (a card, a step, an FAQ item). Maps to the
  component's item type (`CategoryCard`, `TimelineStep`, `FaqItem` — already defined in
  `components/v3/Sections.tsx`).
- **Content** = the leaf fields (strings, arrays, refs). Always design-safe; approved copy still
  governed by 001.
- **Media** = referenced by id (`mediaRef`) into the media library (007), never inlined as blobs.
- **SEO** = a per-page object (title, description, canonical, OG image ref, noindex) editable in CMS,
  consumed by `seo.ts` (see 008).

### Renderer
A single `<SectionRenderer sections={page.sections} />` **[to add]** maps each `section.type` to its
003 component via a registry:
```ts
const SECTION_REGISTRY = { hero: V3Hero, cardGrid: V3CardGrid, timeline: V3Timeline,
  faq: V3Faq, industries: V3Industries, successStories: V3SuccessStories, /* … */ };
```
Unknown types render nothing (forward-compatible). Adding a new section type = add a component (003)
+ one registry entry + one editor block — no page rewrites.

---

## 5. Storage evolution (non-breaking)
Keep `page_content(slug, data, updated_at)`. `data` gains an optional `sections[]` array alongside
today's flat fields. Precedence in the renderer:
1. If `data.sections` exists and is non-empty → render via `SectionRenderer` (block mode).
2. Else → render the legacy fixed layout with `mergePageContent` (current pages keep working).

This lets us migrate pages **one at a time** to block mode without touching the others, and the
fallback-merge safety net still applies to each section's props. Fallbacks become **default section
arrays** (`FALLBACK_HOME_SECTIONS`) merged the same way.

### Target tables **[to add]** (when versioning/preview lands — see 006)
- `pages` (id, slug, title, status, seo jsonb, current_version_id) — supersedes the flat row.
- `page_versions` (id, page_id, sections jsonb, created_by, created_at, label) — history + draft.
- `page_content` retained as the **published projection** (fast public read) written on publish.
Public reads never change shape → zero risk to the live site.

---

## 6. Draft / publish / preview / versioning (target — detailed in 006)
- **Draft**: edits write to a draft `page_version`, not the published projection.
- **Preview**: `/admin/preview/[slug]?v=draft` renders the draft through the real renderer.
- **Publish**: copies draft → `page_content.data` + bumps `pages.current_version_id` +
  `revalidatePath`. Atomic.
- **Version history / rollback**: restore any `page_version` by re-publishing it.
- **Autosave** + optimistic UI + "unsaved changes" guard.

---

## 7. What is CMS-managed (nothing hardcoded)
Per master rules + Learn spec: hero/banner, all sections + ordering, cards, categories, learning
paths, featured items + ordering, testimonials, FAQs, CTAs, enrollment methods, promotional
sections, menus/footer (`site-settings`), forms config, and per-page **SEO**. Course/blog/job/
product records live in their own Supabase tables (courses, blog_posts, jobs, products) and are
managed by their admin modules — the CMS composes *pages*, those modules manage *records*.

---

## 8. Security & integrity
- All writes behind the `admin_session` HMAC guard; service-role key server-only (never shipped).
- Validate section/block shapes with **Zod** on write **[to add]** (reject unknown/oversized
  payloads); today PUT accepts arbitrary JSON — harden.
- Admin-authored HTML (blocks like Interactive HTML / legal / lessons) is `dangerouslySetInnerHTML`
  from **trusted admin input**; sanitize + sandbox per 001 §15 / LMS spec.
- Every publish is auditable (created_by/at on `page_versions`) — feeds 012 audit logs.

---

## 9. Definition of done (CMS work)
Fallback-merge preserved (page can't white-screen) · stored-wins merge rules intact · public read
shape unchanged · new section types are additive (component + registry + editor block only) ·
writes auth, validated (Zod), audited · revalidatePath fires for every edited route · draft/publish
never mutates live until publish.

---
_Status: ✅ complete. Next: 003 — Website Component Library (after review)._
