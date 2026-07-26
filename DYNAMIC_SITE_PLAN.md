# KVJ Analytics — Dynamic Website Build Plan

**Decision basis:** Fresh rebuild · Operated day-to-day by a non-programmer · Fully dynamic content (pages/copy, blog, services/products, team/careers/media) · Marketing site + user accounts + leads-in-DB + payments.

---

## 1. Recommended Stack (and why)

| Layer | Choice | Why this, for a non-coder-operated company site |
|---|---|---|
| Frontend | **Next.js 14 (App Router) + TypeScript** | SEO-friendly SSR/SSG, fast, industry standard, easy to host. |
| Styling | **Tailwind CSS + a small design-system layer** | Consistent, maintainable on a fresh build (the old site used hand-rolled CSS that broke). |
| Content CMS | **Sanity v3** | The single most important pick. Best editing UX for non-programmers: visual Studio, live preview, image cropping, scheduled publishing. Fully hosted — nothing to maintain. |
| Database / Auth | **Supabase (Postgres + Auth)** | Stores users, leads, orders. Built-in auth (email + Google), row-level security, managed. |
| Payments | **Stripe (Checkout + webhooks)** | Standard, secure, PCI-handled. Webhooks write order status back to Supabase. |
| Transactional email | **Resend** | Lead notifications, receipts, welcome emails. Simple API. |
| Hosting | **Vercel** (frontend) + Sanity & Supabase managed clouds | Zero-ops deploys, preview URLs, fast CDN. |
| Analytics | **GA4 + GTM + Microsoft Clarity** | Already used on the current site; keep, but gated behind env vars. |

**Two-system note (be aware):** Content lives in Sanity, transactional data in Supabase. The non-coder almost only ever touches **Sanity Studio** (editing pages, blog, services, team). Leads/orders/users are viewed in a simple in-site `/admin` dashboard you build over Supabase, so they still have *one friendly place* to look. Alternative if you'd rather have a single backend: **Strapi** (self-hosted, content + leads + users in one panel) — but it needs a server to babysit, which is worse for a non-coder. Recommendation stands: **Sanity + Supabase + Stripe.**

---

## 2. Sanity Content Model (what becomes editable)

**Singletons**
- `siteSettings` — logo, nav menu, footer, social links, contact info, global SEO defaults, analytics IDs.
- `homePage` — hero, metrics, featured sections, CTAs.

**Documents (collections)**
- `page` — flexible **page builder**: an array of section blocks (hero, metrics band, rich text, image+text, CTA, FAQ, logo strip). Lets the editor build/reorder pages without code.
- `post` (Blog/Insights) — title, slug, `author→`, `category→`, cover image, Portable Text body, SEO, `publishedAt`, featured flag.
- `author`, `category` — supporting refs for the blog.
- `service` / `product` — name, slug, summary, feature list, media gallery, pricing tier (optional), CTA. (Covers Grade Scope, Corporate offerings, etc.)
- `teamMember` — name, role, photo, bio, social links, display order.
- `job` (Careers) — title, department, location, type, description, apply link/email, open/closed.
- `caseStudy` / `mediaItem` (Press & Media) — title, client, outcome metrics, images, external links.

Every document type gets an SEO sub-object (meta title, description, OG image).

---

## 3. Supabase Schema (transactional)

- `profiles` — extends Supabase auth users (name, company, role).
- `leads` — contact/enquiry submissions: name, email, phone, message, source page, status (`new/contacted/closed`), created_at.
- `orders` — Stripe-backed purchases/enrollments: user_id, product, amount, stripe_session_id, status.
- `bookings` *(only if you confirm appointments/courses need scheduling)* — user_id, service, slot, status.

Row-Level Security on by default; only authenticated admins read `leads`/`orders`.

---

## 4. Site Map (initial)

`Home · About/Impact · Services (Corporate, Data Visualization…) · Products (Grade Scope) · Insights (Blog) · Team · Careers · Media/Press · Contact · Login/Account · /studio (Sanity) · /admin (leads & orders dashboard)`

---

## 5. Build Phases

1. **Foundation** — Next.js + TS + Tailwind scaffold, design tokens, layout shell (header/footer from Sanity), env config, deploy to Vercel.
2. **CMS layer** — Sanity project + all schemas above + embedded Studio at `/studio`; GROQ data fetching; ISR/on-demand revalidation so edits go live fast.
3. **Marketing pages dynamic** — Home, About/Impact, Services, Products, Contact all rendered from Sanity (page builder). No hard-coded copy.
4. **Insights/Blog** — list, single post, categories, author pages, RSS, SEO.
5. **Auth & accounts** — Supabase email + Google login, protected `/account` area.
6. **Leads in DB** — contact forms write to `leads`, Resend notifies the team, `/admin` inbox to view/update status.
7. **Payments** — Stripe Checkout for the relevant product/service, webhook → `orders`, receipt email, gated content/enrollment if needed.
8. **Polish** — SEO (sitemap, robots, structured data), analytics gated on env vars, performance/Lighthouse, accessibility, responsive QA.
9. **Launch** — production env vars, domain, redirects, editor handover doc for the non-coder.

---

## 6. Open Decisions (need your call before/within the Antigravity prompt)

1. **Payments scope** — what exactly is sold? (Grade Scope subscription? Course enrollment? One-off?) This shapes the Stripe + bookings work.
2. **User accounts purpose** — what do logged-in users *get*? (Dashboard, gated reports, purchase history?) Right now it's listed but undefined.
3. **Design** — reuse the current visual identity/branding, or fresh design? (Fonts, colors, logo assets.)
4. **Languages** — single language or multilingual?
5. **Migration** — bring existing copy/images from the current site into Sanity, or start content fresh?

---

## 7. Ready-to-Paste Antigravity Prompt

> Fill the bracketed `[…]` items using your answers to Section 6, then paste into Antigravity.

```
You are building a production, fully-dynamic company website for "KVJ Analytics" from scratch.

## Stack (use exactly this)
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with a small reusable design-system (Button, Section, Container, Card components)
- Sanity v3 as the headless CMS, Studio embedded at /studio
- Supabase (Postgres + Auth) for users, leads, and orders
- Stripe Checkout (+ webhooks) for payments
- Resend for transactional email
- Deploy target: Vercel. Use environment variables for ALL secrets and analytics IDs (no hard-coded keys).

## Core principle
A NON-PROGRAMMER operates this site daily. ALL public content must be editable in Sanity Studio — no copy, metric, image, nav item, or SEO field hard-coded in components. Transactional data (leads, users, orders) lives in Supabase and is viewable in a simple /admin dashboard.

## Sanity schemas to create
- siteSettings (singleton): logo, nav, footer, socials, contact info, global SEO defaults, analytics IDs
- homePage (singleton): hero, metrics band, featured sections, CTAs
- page: a flexible page-builder with an array of section blocks (hero, metricsBand, richText, imageText, ctaBanner, faq, logoStrip)
- post: title, slug, author(ref), category(ref), coverImage, Portable Text body, seo, publishedAt, featured
- author, category
- service and product: name, slug, summary, features[], mediaGallery, optional pricing, cta
- teamMember: name, role, photo, bio, socials, order
- job: title, department, location, type, description, applyLink, isOpen
- caseStudy and mediaItem: title, client, outcomeMetrics, images, externalLinks
- Reusable `seo` object (metaTitle, metaDescription, ogImage) embedded in all document types
Seed each type with 1–2 example documents.

## Supabase
Tables: profiles (extends auth.users), leads (name, email, phone, message, source_page, status, created_at), orders (user_id, product, amount, stripe_session_id, status). Enable Row-Level Security; only admins read leads/orders.

## Pages & features
- Dynamic, Sanity-driven: Home, About/Impact, Services, Products, Insights (blog list + post + category + author), Team, Careers, Media/Press, Contact.
- Auth: Supabase email + Google login; protected /account area showing [DEFINE: dashboard / gated reports / purchase history].
- Contact/enquiry forms POST to an API route that inserts into Supabase `leads` AND sends a Resend notification email. Build /admin to list leads and update status.
- Payments: Stripe Checkout for [DEFINE PRODUCT/SERVICE & MODEL: subscription / course enrollment / one-off]; webhook writes to `orders`; send a Resend receipt; [grant gated access if applicable].
- SEO: per-page meta from Sanity, sitemap.xml, robots.txt, JSON-LD structured data, OG images.
- Analytics: GA4, GTM, Microsoft Clarity — all gated on env vars, render nothing if unset.

## Quality bar
- TypeScript strict, no `any` in app code.
- Use ISR / on-demand revalidation so Sanity edits appear quickly.
- Fully responsive, accessible (semantic HTML, alt text from CMS, keyboard nav), Lighthouse 90+ on all categories.
- Provide a .env.local.example documenting every variable.
- Provide a short EDITOR_GUIDE.md explaining to a non-coder how to edit content in Sanity Studio.

## Branding
[DEFINE: reuse current KVJ identity (attach colors/fonts/logo) OR fresh design direction].

Build in the phase order: foundation → CMS schemas + Studio → dynamic marketing pages → blog → auth → leads → payments → SEO/analytics/polish. After each phase, summarize what was built and how to verify it.
```

---

*Next step: answer the five items in Section 6 and I'll bake them into the prompt so it's fully concrete.*
