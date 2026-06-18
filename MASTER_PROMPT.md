# Antigravity Master Prompt — KVJ Analytics Dynamic Website

Paste everything below the line into Antigravity as the project brief. It builds **phase by phase** — after each phase Antigravity must summarize what it built and how to verify it, then continue. Detailed per-page seed copy and per-feature prompts are in `ANTIGRAVITY_BUILD_STEPS.md`; verify against `REVIEW_CHECKLIST.md`.

---

You are a senior full-stack team building a **production, fully-dynamic company website** for **KVJ Analytics** (analytics, automation, training & educational technology; 16+ years; Cochin, India; serves India, UAE, Oman, USA, Europe). Build it from scratch, phase by phase. After each phase, stop and summarize what was built + how to verify, then proceed.

## Non-negotiable principles
1. **Fully dynamic + non-programmer operated.** A non-technical person edits ALL content, course materials, and mock-test questions in **Sanity Studio**. Nothing user-visible is hard-coded.
2. **Premium, professional LIGHT design** (no dark theme) — see Design System below.
3. **High-conversion + SEO** baked in (no marketing team) — see Marketing below.
4. **Secure** — gated content, payments, and student data handled per the Security section.

## Stack (use exactly)
- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + a small reusable design system
- **Sanity v3** headless CMS, Studio embedded at `/studio` (marketing content, course materials, mock-test questions)
- **Supabase** (Postgres + Auth) for users, enrollments, test attempts, leads, orders
- **Razorpay** for payments (INR / GST)
- **Resend** for transactional email
- Deploy on Vercel. ALL secrets & analytics IDs via env vars; ship `.env.local.example`.

## Design System — "Azure & Teal" (light)
Colors (CSS vars + tailwind.config): brand `#1D4ED8`, brand-700 `#1E40AF`, navy `#0B1F3A`, corporate `#2563EB`, education `#0D9488`, cta `#F59E0B`, cta-600 `#D97706`, ink `#0F172A`, slate `#475569`, muted `#94A3B8`, line `#E2E8F0`, surface `#F8FAFC`, card `#FFFFFF`, success `#16A34A`, error `#DC2626`. Signature gradient `linear-gradient(135deg,#1D4ED8,#0D9488)`.
Type: headings **Sora** (600/700), body **Inter** (400/500) via next/font. Scale: hero 56/36, H1 40/30, H2 32/24, H3 24/20, body 17/1.6, eyebrow 12 uppercase tracked.
Shape/motion: card radius 16, button radius 10; soft layered shadows; 200–300ms ease; fade-up on scroll; animated count-up metrics; hover lift; honor `prefers-reduced-motion`.
Components: Eyebrow, BoldStatement, OfferingRow (alternating image/text), MetricCounter, NumberedCard, SegmentCard (corporate=blue, education=teal), LogoStrip, Testimonial, CTASection, Button (primary=amber CTA with ink text, secondary=brand outline, ghost), Container, Section, Card, Form controls.
Art direction: two-segment identity (Corporate=blue, Education=teal); bold-statement headlines (3–5 words) + eyebrow + short copy; metrics surfaced; generous whitespace; max width 1200px; WCAG AA. Keep theme colors/fonts in one editable config.

## Information architecture (two segments)
Home · About · Corporate Solutions (+ detail pages) · Educational Solutions (+ detail pages) · Products (Grade Scope, Protrix) · Training (catalog + learning platform) · Insights/Blog · Clients & Impact · Contact · Privacy · Terms · `/studio` · `/account` (student) · `/admin` (staff). App Development is excluded.

## Build order

### PHASE 0 — Foundation & design system
Scaffold Next.js+TS+Tailwind; implement the Design System tokens + components; integrate Sanity (Studio at /studio) and Supabase; build global Header (two-segment nav) + Footer from `siteSettings`; `.env.local.example`; responsive + a11y baseline.

`siteSettings` (singleton): companyName "KVJ Analytics", tagline "Analytics • Automation • Training • Educational Technology", logo, nav, regionsServed [India, UAE, Oman, USA, Europe], socials, **contactInfo** { email info@kvjanalytics.in; phones 9961813730 / 0484-4059310 / 7902661012; address "3rd Floor, Lalan Towers, Banerji Road, High Court Jn., Cochin-682 031, Ernakulam, Kerala, India"; gstNumber 32BIDPK3118B1Z2 }, footerDescription, footerTagline "Empowering Businesses and Institutions Through Analytics, Automation & Practical Learning.", footerColumns (Corporate: Report Automation, Dashboard Development, Data Visualization, Process Automation, Corporate Training | Education: Certification Programs, Curriculum Development, Grade Scope, Protrix, Skill Development Programs), quickLinks (Home, About Us, Corporate Solutions, Educational Solutions, Products, Training, Contact), analytics IDs, global SEO defaults.

### PHASE 1 — Marketing pages (dynamic via Sanity)
Build singletons/schemas and pages with the seed content from `ANTIGRAVITY_BUILD_STEPS.md` Steps 1–8:
- **Home** (homePage): hero "Transforming Data Into Decisions", intro + supporting line, keyHighlights [16+ Years; 50,000+ Young Professionals Trained; 5,000+ Senior Professionals Trained; Global Training & Consulting Exposure; Trusted by Corporates & Institutions], corporateSolutions [Report Automation, Dashboards & Data Visualization, Spreadsheet Consulting, Process Automation, Corporate Training], educationalSolutions [Training & Certification, Curriculum Development, Academic Analytics Platforms, Assessment Automation], whyUs "Practical. Scalable. Industry-Focused."
- **About** (aboutPage), **Corporate** & **Education** (solutionsPage + reusable `service` with category), **Products** (`product`: Grade Scope, Protrix), **Impact** (impactPage), **Contact** (contactPage + working form → Supabase `leads` + Resend), **Privacy/Terms** (use placeholders if no content supplied).
Use the exact seed copy in Build Steps. Bold-statement headlines per page (Corporate "Smarter Reporting. Faster Decisions.", Education "Industry-Ready Talent. Built Faster.", etc.).

### PHASE 2 — Blog / Insights
Schemas post/author/category; /blog list + [slug] + category + author; RSS, sitemap, per-post SEO; non-coder publishes in Studio.

### PHASE 3 — Training & learning platform
Sanity: `course` (segment corporate|college, summary, syllabus, priceINR, isPaid, thumbnail), `material` (type pdf|video|link|richtext, isPreview), `mockTest` (questions: stem, options, correctIndex, marks, durationMins, passMark). Supabase: profiles(role), enrollments, test_attempts.
- Public catalog + course detail pages.
- **Gated delivery:** materials & tests served only to enrolled users via authenticated server routes; files via signed expiring URLs; mock-test questions sent WITHOUT answers, scored server-side, results stored in test_attempts; timed UI with auto-submit.
- Student dashboard `/account` (my courses, materials, tests, results).
- **Enrollment Method 1 (Paid):** Razorpay Checkout; verify webhook signature server-side; record order+enrollment only on verified payment; GST receipt email.
- **Enrollment Method 2 (College code):** `batches` (college, course, totp_secret, valid window); rotating ~30s code shown to admin; student enters current code (server-verified, in-window) then submits Name/Phone/Organization (with consent) → enrollment; rate-limit + lockout + CAPTCHA.
- `/admin`: manage enrollments, payments, batches/codes, students, results, CSV export. (Course content edited in Studio.)

### PHASE 4 — Marketing / CRO / SEO / lead-gen
Per `MARKETING_GROWTH_PLAN.md`: one primary segment CTA per page (above fold + repeated + closing band); sticky header CTA + sticky mobile bar; floating WhatsApp + click-to-call; email-gated lead magnets (brochure, free mock test, checklist, syllabus); exit-intent/scroll popup (capped); forms → Supabase `leads` with source_page + UTM → Resend team alert + auto-reply; trust signals near CTAs; JSON-LD (Organization, LocalBusiness/Cochin NAP, Course, Article, FAQ); editable titles/meta/H1; keyword+location SEO; internal linking; sitemap.xml/robots.txt/canonicals. Analytics (env-gated): GA4+GTM conversion events (form_submit, demo_request, enroll_start, brochure_download, call_click, whatsapp_click), Clarity, Meta Pixel, LinkedIn Insight; persist UTM with leads; conversion overview in /admin. Produce MARKETING.md.

### PHASE 5 — Security hardening
RBAC (admin vs student) server-side; Supabase RLS on profiles/enrollments/test_attempts/leads/orders/batches; gated files via signed expiring URLs; answer keys never client-side; Razorpay webhook signature verification; rotating-code server verification + rate limit + lockout; student PII consent/minimization/encryption + privacy policy; security headers (CSP, HSTS), HTTP-only secure cookies, CSRF, input validation; audit logging; least-privilege keys. Produce SECURITY.md.

### PHASE 6 — SEO/perf, QA & launch
Lighthouse 90+ all categories; Core Web Vitals pass; cross-browser/responsive/a11y (WCAG AA); test both enrollment flows (paid test-mode + college code) and quiz scoring; EDITOR_GUIDE.md for the non-coder; production env vars + domain + deploy.

## Quality bar
TypeScript strict (no `any`); ISR/on-demand revalidation so Sanity edits appear fast; fully responsive & accessible; seed 1–2 example documents per content type; document every env var; after each phase, summarize and give verification steps.

Begin with **Phase 0** now.
