# KVJ Analytics — Project Map & Working Guide

> Read this first. It's the single source of truth for how this site is built so we
> don't re-analyze the whole codebase every time. Keep it updated when structure changes.
>
> **Governing docs (read alongside this):**
> - `docs/MASTER_IMPLEMENTATION_RULES.md` — engineering/design/security standards for all work.
> - `docs/CONTENT-SPECS-V3.md` — finalized V3 page content (Home, About, Corporate, Educational,
>   Products, Blog, Careers, Contact) — build pages from here, exact copy.
> - `docs/LMS-PLATFORM-SPEC.md` — Learn page + LMS/learning-platform spec (enrollment, activities,
>   assessments, mock/final exams, certificates, vouchers, analytics) mapped to what exists.
> - `docs/GROWTH-OS-SPEC.md` — future AI "Growth OS" (SEO/content/social/email/analytics),
>   human-in-the-loop by default.

KVJ Analytics is an analytics, automation & training company. This is its marketing
website **+ a full LMS** (courses, payments, tests) **+ an admin CMS** so a non-programmer
can edit everything.

## Stack
- **Next.js 16** (App Router, React 19, TypeScript, Turbopack)
- **Tailwind CSS v4** (`@theme` tokens in `src/app/globals.css`)
- **Supabase** (Postgres + Auth + Storage + RLS) — all dynamic data
- **Razorpay** (course payments), **Resend** (receipt emails)
- Fonts: **Plus Jakarta Sans** (current). Deployed on **Vercel**.
- Sanity is legacy/unused — do not add new Sanity code.

## 🔒 Golden rules (read before editing)
1. **Content is CEO-locked.** Use the *exact approved copy*. Design/layout/animation may
   change freely; **words may not**, and **never fabricate** content (no fake stats,
   history, testimonials). Approved copy lives in `src/lib/constants.ts` (`FALLBACK_*`).
2. **Fallback-merge pattern is sacred.** Public pages read stored content and merge it over
   a fallback so a page can never white-screen: `mergePageContent(await getPageContent(slug), FALLBACK_X)`.
3. **Theme is dark** (deep near-black + cyan/blue + violet accents). Don't switch to light.
4. **Don't break** the admin panel, LMS, auth, or payments. Additive changes preferred.
5. **Verify with `npx tsc --noEmit`** after edits. The build ignores TS errors
   (`typescript.ignoreBuildErrors: true`), so *real* runtime bugs won't show as build fails —
   check logic yourself. Duplicate routes / missing default exports DO fail the build.
6. Next 16: server-component `params`/`searchParams` are **Promises → `await` them**.
   Client components use `useParams()`.

## Directory map
```
src/
  app/
    layout.tsx                 # root: fonts, <Analytics/>, Organization JSON-LD, base <metadata>
    globals.css                # theme tokens (@theme), utilities, animations
    sitemap.ts, robots.ts      # SEO (dynamic sitemap from Supabase)
    (website)/                 # PUBLIC site
      layout.tsx               # Header, Footer, ScrollProgress, CursorGlow, IntroLoader, WhatsAppFloat
      page.tsx                 # HOME
      about|corporate|education|products|training|contact|blog|careers|impact|privacy|terms/
      corporate/[slug] ...     # service/product/course/blog/job detail pages
      training/...             # LMS front-end (hub, catalogs, [slug] detail, learn, tests, join)
      signin|signup|account/   # student auth + dashboard
    admin/                     # ADMIN PANEL (auth-gated) — see below
    api/                       # route handlers — see below
  components/                  # React components (see "Components")
    ui/                        # design-system primitives
  lib/
    constants.ts               # FALLBACK_* approved content (source of truth for copy)
    content.ts                 # getPageContent(slug) + mergePageContent(stored, fallback)
    supabase.ts                # anon client (public reads)
    adminAuth.ts               # HMAC admin session token
    seo.ts                     # SITE_URL, pageMeta(), organizationSchema()
    mockSupabase.ts            # fallback client when Supabase env is absent
supabase/migrations/*.sql      # DB schema (run these in Supabase)
```

## Page → data source (where each page's content comes from)
| Route | Content source | CMS slug | Fallback const |
|---|---|---|---|
| `/` | CMS + Supabase | `home` | `FALLBACK_HOME_PAGE` |
| `/about` | CMS (via `AboutClient`) | `about` | `FALLBACK_ABOUT` |
| `/corporate` `/education` `/products` | CMS + services/products list | `corporate`/`education`/`products` | `FALLBACK_CORPORATE`/`_EDUCATION`/`_PRODUCTS_PAGE` |
| `/corporate/[slug]` etc. | finds service by slug (constants/DB) | — | same |
| `/contact` | CMS + `ContactForm` → `/api/contact` → `leads` | `contact` | `FALLBACK_CONTACT` |
| `/training` (hub) | Supabase `course_categories` + CMS header | `training` | `FALLBACK_TRAINING_HUB` |
| `/training/online-courses` | Supabase `courses` + CMS header | `online-courses` | `FALLBACK_ONLINE_COURSES` |
| `/training/internships` | Supabase `internships` + CMS header | `internships` | `FALLBACK_INTERNSHIPS_PAGE` |
| `/training/{corporate,colleges,one-to-one}` | Supabase courses + CMS name/desc | `training-corporate` etc. | `FALLBACK_CAT_*` |
| `/training/[slug]` | Supabase `courses`+`modules`+`lessons` | — | inline demo |
| `/careers` | Supabase `jobs` + CMS header | `careers` | `FALLBACK_CAREERS` |
| `/blog`, `/blog/[slug]`, category, author | Supabase `blog_posts` + CMS header | `blog` | `FALLBACK_BLOG` |
| `/impact` | CMS | `impact` | `FALLBACK_IMPACT` |
| `/privacy` `/terms` | CMS (HTML body override) | `privacy`/`terms` | `FALLBACK_PRIVACY`/`_TERMS` |
| Header/Footer/contact/logo | CMS | `site-settings` | `FALLBACK_SITE_SETTINGS` |

## The CMS (how "everything is editable")
- Editor UI: **`/admin/content`** (`src/app/admin/content/page.tsx`) — left page list, right form.
- Storage: table **`page_content`** (`slug`, `data` JSON). API: `PUT/GET /api/admin/content/[slug]`
  (upserts JSON + `revalidatePath`). Registered fallbacks live in that route's `FALLBACKS` map.
- **Recipe — make a new page editable:**
  1. Add `FALLBACK_X` to `constants.ts` (approved defaults).
  2. Public page: `const page = mergePageContent(await getPageContent("slug"), FALLBACK_X)` and render `page.*`.
  3. `api/admin/content/[slug]/route.ts`: add to `FALLBACKS` map + a `revalidatePath` branch.
  4. `admin/content/page.tsx`: add to `PAGES` (with `href`), and a render branch using an
     editor component (`SimpleHeaderEditor`, `ImpactEditor`, `LegalEditor`, or a new one) bound
     to `genericData`/`setGenericData` (simple pages) — no new state needed.

## The LMS
- **Model:** `courses` → `modules` → `lessons` (`kind: theory|activity`, HTML `content_html`,
  optional `video_url`) + `mock_tests` (`module_id` = per-module; `null` = whole-course) → `questions`.
- **Question types (all supported):** single, multiple, truefalse, fillblank, dragdrop,
  sequence, matrix, code. Built at **`/admin/courses/[id]`** (visual type-picker).
- **Course detail** `/training/[slug]` → **learn player** `/training/[slug]/learn` (sidebar +
  content/video + prev/next) → **tests** `/training/[slug]/tests/[testId]`.
- **Enrollment paths:**
  - **Paid:** `CourseClientWrapper` → `POST /api/payments/razorpay` (creates order, stores in
    `orders`) → Razorpay checkout → `POST /api/payments/razorpay/webhook` (verifies HMAC
    signature, **looks up the order** for trusted user/course/amount, writes `enrollments`,
    emails receipt). Idempotent.
  - **Code unlock (colleges/corporate):** enter 6-digit code → `POST /api/unlock` → validates
    `unlock_codes` (active/expiry/max_uses) → `enrollments` + `code_redemptions`.
- **Enrollment upsert** uses `onConflict: "user_id,course_slug"` → DB MUST have a UNIQUE
  constraint on `enrollments(user_id, course_slug)`, or enrollment fails.
- Auth: Supabase (`/signin`, `/signup` with Google + profession). `Header` syncs session → cookie.

## Admin panel (`/admin/*`, HMAC-gated via `adminAuth.ts`)
content · courses(+[id] builder) · categories · unlock-codes · internships · jobs · blog ·
leads · inquiries · applications · enrollments · batches · clients · testimonials · case-studies · team
**+ Phase 2.x modules (all `adminNav.ts` rows now `active`):** media (library over uploads) ·
students (read-only roster from `profiles`) · users (staff directory, `admin_users` — RBAC data model
only, login still single shared password) · assessments + question-bank (read-only cross-course views
over `mock_tests`/`questions`; editing stays in the course builder) · certificates (issue/revoke +
public `/certificates/verify/[code]`) · orders + payments (over `orders`; joins courses by
`course_slug`, not the FK) · reports + analytics (live aggregations, CSS `BarList` — no chart deps) ·
audit-logs (via `lib/admin/auditLog.ts` best-effort writes) · settings (stored in `page_content`
slug `admin-settings`).
Each has a matching `api/admin/<name>` route (GET/POST + `[id]` PUT/DELETE or PATCH/DELETE by body id).
Images upload via `POST /api/admin/upload` (Supabase Storage).
**New tables need `supabase/migrations/admin_platform_modules.sql`** (media_library, admin_users,
certificates, audit_logs + orders `refunded` status) — until it's run those four modules show a
load error; everything else works on the existing schema.

## Design system
- Tokens in `globals.css` `@theme`: `--color-base/base-2/surface/card/line`, `--color-ink/slate/muted`,
  `--color-brand/corporate/education/cta`. Use token classes (`bg-base`, `text-ink`, `text-brand`).
- Primitives (`src/components/ui/`): `Container`, `Section`, `Button`, `Card`, `Reveal`
  (scroll-in; variants up/left/right/scale/blur), `RevealText`, `CountUp`, `BoldStatement`,
  `Eyebrow`, `CTASection`, `ServiceCard` (use **`accentColor` "cyan"|"blue"`**, NOT `variant`).
- Global FX (public layout): `ScrollProgress`, `CursorGlow`, `IntroLoader` (once/session),
  `WhatsAppFloat`, `SmoothScroll` (Lenis).

## SEO
`seo.ts` → `pageMeta()` on key pages, `organizationSchema()` + BlogPosting JSON-LD, `sitemap.ts`,
`robots.ts`. Analytics: `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL` (auto-load when set).

## Env vars
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL`, `ADMIN_SESSION_SECRET`/`ADMIN_PASSWORD`.

## Build / deploy
- Verify: `npx tsc --noEmit` (implicit-any warnings are ignored/harmless).
- Deploy: `npx vercel@latest --prod`. Run `supabase/migrations/*.sql` in Supabase first.
- The sandbox here CANNOT run `next build` (no SWC binary/network) — use `tsc` + logic review.

## V3 build status
- **Home is a cinematic redesign** (`(website)/page.tsx`) — composed from bespoke premium sections
  in **`components/v3/home/*`** (`HeroExperience` floating-dashboard parallax, `LogoWall` marquee,
  `SolutionExplorer` interactive nodes, `WhyKvj` split story, `IndustryGrid` spotlight cards,
  `TransformationTimeline` scroll-activated, `TechEcosystem` network, `DashboardShowcase`,
  `FinalCTAExperience`, `Magnetic`). Motion = CSS + light rAF/IO/mouse JS, **no new deps**; premium
  primitives live at the bottom of `globals.css` (beam/glow-ring/light-sweep/float/particle-field/
  grid-fade/aura/gradient-move). `components/v3/Sections.tsx` (V3Hero/V3CardGrid/…) still exists for
  the other pages. Content still merges over a **new `FALLBACK_HOME_PAGE`
  shape** (`hero/trustedBy/solutions/whyUs/industries/approach/successStories/insights/finalCta`).
  The old V2 home fields (`corporateSolutions/educationalSolutions/keyHighlights/whyUs.strapline`)
  are GONE — admin `HomeData` editor updated to match. Why-KVJ card bodies + Approach step bodies +
  Success-Story outcomes are intentionally blank (CMS-fillable; not fabricated).
- Build docs live in `docs/00-MASTER-INDEX.md` → `001`–`024` (+ `CONTENT-SPECS-V3`, `LMS-PLATFORM-
  SPEC`, `GROWTH-OS-SPEC`, `MASTER_IMPLEMENTATION_RULES`). Build order + kickoff in `024`.

## Gotchas / known
- `FALLBACK_PRODUCTS` vs `FALLBACK_PRODUCTS_PAGE` both exist — products page uses `_PAGE`.
- `dangerouslySetInnerHTML` is used for admin-authored HTML (blog/legal/lessons) — trusted admin input.
- Payment/unlock take `userId` from the client; hardening TODO: derive from server session.
- Some files carry pre-existing `implicit-any` params (harmless).
