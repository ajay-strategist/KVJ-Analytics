# KVJ Analytics — Master Antigravity Task List

The ordered build plan Antigravity follows. Work **phase by phase, top to bottom**. After each phase, Antigravity must summarize what was built and how to verify it before moving on. Detailed content + per-page prompts live in `ANTIGRAVITY_BUILD_STEPS.md`. Verify each phase against `REVIEW_CHECKLIST.md`.

**Stack:** Next.js 14 (App Router) + TypeScript · Tailwind + premium design system · Sanity v3 (content, materials, test questions) · Supabase (auth, enrollments, attempts, leads, payments) · **Razorpay** (payments, India/GST) · Resend (email). Deploy on Vercel. All secrets via env vars.

**Golden rule:** A non-programmer operates everything. All content, course materials, and mock-test questions must be editable in Sanity Studio — nothing hard-coded.

---

## PHASE 0 — UI/UX & Foundation
- [x] Scaffold Next.js 14 + TypeScript (strict) + Tailwind.
- [x] Build premium design system / component library: `Eyebrow`, `BoldStatement`, `OfferingRow`, `MetricCounter`, `NumberedCard`, `LogoStrip`, `SegmentCard`, `Testimonial`, `CTASection`, `Container`, `Section`, `Button`, `Card`.
- [x] Apply the **premium LIGHT design system** from `DESIGN_SYSTEM.md` — "Azure & Teal" palette (brand #1D4ED8, education teal #0D9488, amber CTA #F59E0B), Sora/Inter type, soft shadows, scroll motion, animated metrics. No dark theme.
- [x] Apply global art direction (bold statements, short copy, strong visuals, two-segment Corporate/Education).
- [x] Integrate Sanity v3, Studio at `/studio`.
- [x] Integrate Supabase (project, client, auth scaffolding).
- [x] Global Header (two-segment nav) + Footer from `siteSettings`.
- [x] `.env.local.example` documenting every variable.
- [x] Responsive + accessibility baseline (semantic HTML, focus states, keyboard nav).

## PHASE 1 — Marketing Pages (dynamic via Sanity)
- [ ] **Home** — two-segment hero, key highlights metrics, Corporate & Education solution blocks, Why KVJ.
- [ ] **About Us** — intro, specializations, reach, impact, vision.
- [ ] **Corporate Solutions** — landing + service detail pages (category=corporate).
- [ ] **Educational Solutions** — landing + service detail pages (category=educational).
- [ ] **Products** — Grade Scope, Protrix (landing + detail).
- [ ] **Clients & Impact** — highlights + industries served.
- [ ] **Contact** — info from siteSettings + working form → Supabase `leads` + Resend.
- [ ] **Footer + Contact info + GST** (32BIDPK3118B1Z2).
- [ ] **Legal** — Privacy Policy, Terms (dynamic pages).

## PHASE 2 — Blog / Insights
- [ ] Sanity schemas: `post`, `author`, `category`.
- [ ] Blog list, single post (Portable Text), category & author pages.
- [ ] SEO per post, sitemap entries, RSS feed.
- [ ] Confirm a non-coder can publish a post in Studio.

## PHASE 3 — Training & Learning Platform (core new build)
**3a. Course model & catalog**
- [ ] `course` schema (Sanity): title, slug, segment (corporate/college), summary, syllabus, price (INR), thumbnail, isPaid, order, seo.
- [ ] Public training catalog + course detail pages (bold-statement style).

**3b. Course Materials (dynamic, gated)**
- [ ] `material` schema (Sanity): course ref, title, type (pdf/video/link/richtext), file/url/body, order, isPreview.
- [ ] Materials served **only to enrolled users** via authenticated server routes (no public CDN exposure of gated files).
- [ ] Non-coder can add/update materials in Studio.

**3c. Mock Tests / Quiz engine**
- [ ] `mockTest` schema (Sanity): course ref, title, durationMins, passMark, questions[] (stem, options[], correctIndex, marks).
- [ ] Server-side scoring only — **answer keys never sent to the client**.
- [ ] Supabase `test_attempts` (user, test, answers, score, started_at, submitted_at).
- [ ] Timed test UI, auto-submit, results screen, attempt history.
- [ ] Non-coder can add/edit questions in Studio.

**3d. Student auth & dashboard**
- [ ] Supabase Auth (email/OTP; Google optional). Roles: `admin`, `student`.
- [ ] Student dashboard: my courses, materials, mock tests, results.

**3e. Enrollment Method 1 — Paid (Razorpay)**
- [ ] Razorpay checkout for paid courses; verify webhook signature server-side.
- [ ] `orders` / `enrollments` in Supabase on successful payment; grant course access.
- [ ] GST invoice/receipt email via Resend.

**3f. Enrollment Method 2 — College code (no payment)**
- [ ] `batch` schema/table: college, course ref, rotating access code (TOTP-style, ~30s validity), validFrom/validTo, active.
- [ ] Admin view shows the current rotating code for a batch.
- [ ] Student join flow: enter current code (within window) → submit Name, Phone, Organization → create `enrollment` + lightweight student profile.
- [ ] Rate-limit + lock attempts to prevent code brute-forcing/sharing.

**3g. Admin (non-programmer) management**
- [ ] Manage courses, materials, mock-test questions in Sanity Studio.
- [ ] Supabase-backed `/admin`: view enrollments, payments, batches + generate codes, student details, test results; export CSV.

## PHASE 4 — Security & Compliance (review-critical)
- [ ] Role-based access control (admin vs student) enforced server-side.
- [ ] Supabase Row-Level Security on enrollments, attempts, leads, orders, profiles.
- [ ] Gated materials & tests behind authenticated API routes; signed/expiring URLs for files; no answer keys client-side.
- [ ] Razorpay webhook signature verification; never trust client-sent amounts.
- [ ] Rotating code: short validity, server-side verification, rate limiting, attempt lockout, CAPTCHA on public join/contact forms.
- [ ] PII protection for student data (name/phone/org): minimal collection, consent checkbox, encrypted at rest, privacy policy link.
- [ ] Secure headers (CSP, HSTS), secure/HTTP-only cookies, CSRF protection, server-side input validation.
- [ ] Audit logging for admin actions and enrollments.
- [ ] Secrets only in env vars; least-privilege keys.

## PHASE 5 — SEO, Analytics, Performance
- [ ] Per-page SEO from Sanity, sitemap.xml, robots.txt, JSON-LD.
- [ ] GA4 + GTM + Microsoft Clarity, gated on env vars.
- [ ] Lighthouse 90+ across categories; Core Web Vitals pass.

## PHASE 5B — Marketing, CRO & Lead Generation (see `MARKETING_GROWTH_PLAN.md`)
- [ ] Single primary CTA per page (segment-specific) above the fold, repeated mid + closing CTA band.
- [ ] Sticky header CTA + sticky mobile CTA bar; floating WhatsApp; click-to-call.
- [ ] Lead magnets with email-gated downloads (brochure, free mock test, checklist, syllabus).
- [ ] Exit-intent / scroll lead popup (frequency-capped).
- [ ] Short forms → Supabase `leads` (+ source_page, UTM) → Resend team alert + auto-reply.
- [ ] Trust signals near CTAs (metrics, logos, testimonials, GST, case studies).
- [ ] JSON-LD (Organization, LocalBusiness/Cochin NAP, Course, Article, FAQ); keyword+location SEO; internal linking.
- [ ] GA4 + GTM conversion events; Clarity; Meta Pixel; LinkedIn Insight (env-gated); UTM persisted with leads.
- [ ] Conversion overview in `/admin` (leads by source, status, CSV export).
- [ ] `MARKETING.md` documenting events, magnets, and how the non-coder edits CTAs/SEO.

## PHASE 6 — QA & Launch
- [ ] Cross-browser + responsive + accessibility (WCAG AA) pass.
- [ ] Test both enrollment flows end-to-end (paid in test mode + college code).
- [ ] Test quiz timing, scoring, and result storage.
- [ ] Editor handover guide (`EDITOR_GUIDE.md`) for the non-coder.
- [ ] Production env vars, custom domain, redirects, deploy.

## ✅ Both additional requirements received & integrated
- **Premium design system + color theme** → `DESIGN_SYSTEM.md`, applied in Phase 0 (light "Azure & Teal").
- **Marketing / CRO / SEO / lead-gen** → `MARKETING_GROWTH_PLAN.md`, built in Phase 5B.

---

### Open confirmations
1. Payment gateway: **Razorpay** (recommended for India/GST) — confirm.
2. Blog: build empty for you to publish, or migrate existing posts?
3. Legal (Privacy/Terms): provide content or use placeholders?
4. Logo file (provide your logo) — colors/fonts are now set in `DESIGN_SYSTEM.md` but tunable.
