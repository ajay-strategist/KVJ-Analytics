# 008 — SEO & Growth Engine
**KVJ Analytics Platform V3 · Phase 2 · Website Engine**
Two layers: (A) the **SEO foundation** that already ships, and (B) the **AI Growth OS** layered on
top. Full Growth-OS module detail lives in `GROWTH-OS-SPEC.md`; this doc is the engineering home and
reconciles it with the codebase. **[in code]** exists, **[to add]** planned. **Human-in-the-loop by
default** (AI proposes → admin approves).

---

## A. SEO foundation **[in code — `src/lib/seo.ts`, `sitemap.ts`, `robots.ts`]**
- `pageMeta({title, description, path, keywords?, image?})` → Next `Metadata` with **canonical**,
  **OpenGraph** (siteName KVJ Analytics, `en_IN`, 1200×630 OG), **Twitter** `summary_large_image`.
  Applied on key pages.
- `organizationSchema()` → `ProfessionalService` JSON-LD (name, url, logo, description, email, phone,
  `areaServed` India/UAE/Oman/USA/Europe, Cochin address, `knowsAbout`). `sameAs` empty **→ add
  social URLs when provided.** Rendered in root layout.
- `BlogPosting` JSON-LD on articles; dynamic **`sitemap.ts`** (from Supabase) + **`robots.ts`**.
- `SITE_URL` from `NEXT_PUBLIC_SITE_URL` (default `https://www.kvjanalytics.in`).

### Foundation gaps to close **[to add]**
- **Per-page SEO in CMS** — title/description/canonical/OG image/noindex editable per page (006 SEO
  panel), stored on the page, consumed by `pageMeta`. Today SEO is code-level per page.
- Add `BreadcrumbList` (005 §6), `Course`/`FAQPage`/`Product` schema where relevant, `og-image.png`
  default asset, per-page OG image via media library (007).
- Image `alt` everywhere (007), semantic headings (one H1, 001 §4), internal-link hygiene.

---

## B. AI Growth OS **[to add — see `GROWTH-OS-SPEC.md`]**
Admin-side engine that continuously audits and improves the site. Loop: CMS → AI analysis → SEO/
content/link optimization → social/email drafting → analytics → recommendations → improvement.

### Modules (summary; detail in GROWTH-OS-SPEC)
AI SEO audit · Content optimizer · AI content writer · Internal-link optimizer · Keyword
intelligence · Social media manager · Email marketing · AI image generator · Landing-page optimizer ·
AI analytics · Competitor intelligence (summaries only, never copy) · daily Growth Recommendations ·
conversational AI assistant · marketing dashboard.

### Automatable now vs integration-dependent (reality check)
- **Self-contained (ship first):** on-page SEO audit (reads the metadata/schema the foundation
  already emits), content quality checks, internal-link suggestions, sitemap/meta generation, AI
  drafting (needs an LLM API key only).
- **Needs integration + usually approval:** Google Search Console, Google Analytics, social
  publishing, email delivery (Resend exists for receipts — extend), AI image gen, competitor
  monitoring. These are **opt-in**, authorized, and gated by human approval (019 Integration Hub).

### Human-in-the-loop workflow (governing)
1. AI analyzes. 2. AI proposes a diff/draft. 3. Admin reviews → **Apply** (or enables *trusted
auto-apply* rules for low-risk tasks: ALT tags, internal links, sitemap). Never auto-publish content/
social/email without a gate. Every AI change is versioned (006) + audited (012).

### Fit
Extends the existing CMS (002) + SEO foundation (A) as `/admin/growth/*` routes + services; no
restructuring of earlier work. Overlaps 018 (AI Platform) — 018 owns shared AI infra (assistant,
model access, guardrails); 008 owns the marketing/SEO application of it.

---

## C. Analytics wiring
`NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL` auto-load when set (CLAUDE.md). Growth analytics +
platform analytics detailed in 016; this engine consumes those signals for recommendations.

---

## D. Definition of done
Foundation: every page has canonical + OG + Twitter + appropriate JSON-LD + sitemap/robots + editable
per-page SEO + alt text. Growth OS: self-contained modules ship first; integration modules opt-in +
authorized; **all AI changes proposed-then-approved**, versioned, audited; nothing auto-published.

---
_Status: ✅ complete. (Companion: `GROWTH-OS-SPEC.md`.)_
