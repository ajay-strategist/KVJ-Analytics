# KVJ Analytics Platform V3 — MASTER IMPLEMENTATION RULES
Version 1.0 — governing standard for ALL work on this platform. Read with `CLAUDE.md`
(architecture map) and `CONTENT-SPECS-V3.md` (page content).

## Role & bar
Lead Architect + Senior Full-Stack + UI/UX. Ship **production-ready**, scalable, secure,
reusable, enterprise-grade software. No prototypes. No placeholders unless requested.

## Product (one ecosystem)
Corporate Website · Educational Platform · LMS · Student Portal · Organization Portal ·
CRM · CMS · Product Management · Analytics Platform · Administration Portal.

## Design
Premium SaaS (Apple / Stripe / Linear / Vercel / Framer / Notion). Modern, elegant, minimal.
Single design system: typography, spacing, colors, radius, elevation, animation, icons,
buttons, forms, tables, cards, badges, alerts — all reusable components, never duplicated.
Every screen answers: where am I / what can I do / what next. Fewer clicks. Keyboard + touch + a11y.

## Responsive
Mobile · Tablet · Laptop · Desktop · Ultra-wide. No horizontal scroll, broken layouts or overlaps.

## Motion
Enhance usability, never distract. Page transitions, section reveal, card/hover/micro
interactions, button feedback, progress, skeletons. Respect reduced-motion.

## Tech stack (target)
Next.js · TypeScript (strict) · Tailwind · Framer Motion (+ GSAP where required) · Supabase
(Auth + Postgres) · Zustand (client state) · TanStack Query (server state) · React Hook Form +
Zod (forms/validation) · Recharts · Lucide · TanStack Table · TipTap (editor) · Sonner (toasts).

## Code quality
Strict TS · ESLint · Prettier · modular architecture · reusable components · absolute imports ·
meaningful names · no duplicated code. Folder separation: components / pages / hooks / services /
stores / types / utils / constants / api / validation. No mixed responsibilities.

## Component rules
Reusable · prop-driven · loading / empty / error states · dark mode · a11y · responsive.
No hardcoded data.

## CMS rules
Everything CMS-driven (pages, courses, lessons, images, videos, FAQs, testimonials,
case studies, menus, footer, forms, settings). No hardcoded content.

## Course content types
Rich text, image, gallery, video, audio, PDF, PPT, HTML lesson, interactive HTML, animation,
infographic, code block, download, external link, accordion, tabs, timeline, quiz, activity,
embed, callout, divider. New types must be easy to add.

## HTML lessons
Render in-page (never download). Sandboxed. Responsive. Secure JS bridge lesson↔LMS reporting
completion / score / time spent / progress / errors. No unsafe JS execution.

## Activity engine
HTML, drag-drop, matching, sorting, scenario, coding, Excel upload, Power BI upload, file
upload, simulations, games, AI activities. Each: marks, attempts, passing marks, feedback,
hints, time limits, analytics.

## Assessment engine
Single / multiple / true-false / fill-blank / numeric / short answer / essay / matching /
ordering / drag-drop / coding / file upload / HTML activity. Per question: marks, difficulty,
hints, explanation, negative marks, randomization, tags, categories.

## Mock test engine
Random questions, categories, unlimited/limited attempts, timer, review, leaderboard,
performance analytics, question navigation. **Mock tests do NOT issue certificates** — final
exams run through a separate examination portal.

## Student experience
Dashboard: continue learning, progress, achievements, certificates, mock tests, recommended +
available courses, notifications, learning calendar. Buy courses in-dashboard (never bounce to
public site).

## Course structure
Course → Modules → Lessons → Module Assessment → Activities → Mock Tests → eligible for Final
Examination (external).

## Admin panel (manageable)
Courses, categories, learning paths, modules, lessons, activities, assessments, question bank,
mock tests, students, corporate training, internships, voucher management, reports, analytics,
settings, media, menus, pages, users, roles, permissions.

## Security
RBAC · input validation · sanitized HTML · secure auth · permission checks · audit logs ·
secure uploads · rate limiting · CSRF · never expose secrets.

## Performance
Lazy load · code splitting · dynamic imports · image optimization · caching · virtualization ·
debounced search · optimized queries.

## Accessibility
WCAG 2.2 AA · keyboard nav · screen readers · focus indicators · ARIA · contrast · reduced motion.

## SEO
Metadata · structured data · canonical · OG · Twitter cards · dynamic sitemap · robots.

## Analytics
Track page/lesson views, course progress, activity completion, assessment scores, mock results,
search, downloads, enrollments, behaviour.

## Error handling (every module)
Loading / empty / error states · retry · offline detection · graceful recovery.

## Documentation (every change)
Architecture summary · files created · files modified · DB changes · API changes · known
limitations · future improvements.

## Definition of done (verify before "complete")
Builds ✓ · no TS errors ✓ · no ESLint errors ✓ · responsive ✓ · accessible ✓ · secure ✓ ·
no duplication ✓ · performant ✓ · CMS integrated ✓.

## Final rule
Design for extension: future features must slot in without restructuring existing code.
Extensible, maintainable, production-ready.

---
## Student learning journey (target flow → current mapping)
Learn (public) → Course Marketplace → Course Details → Purchase/Register → Student Account →
Learning Dashboard → My Courses → Course Player → Activities → Assessments → Mock Tests →
**Final Examination** → **Certificate** → Continue Learning.

Maps to current code:
- Marketplace → `/training/online-courses` (+ category catalogs).  ✅ exists
- Course Details → `/training/[slug]`.  ✅ exists
- Purchase/Register → Razorpay (`/api/payments/razorpay` + webhook) or 6-digit unlock (`/api/unlock`).  ✅ exists
- Student Account / Dashboard / My Courses → `/account`.  ✅ exists (needs V3 dashboard polish: continue-learning, progress, achievements, recommended, calendar, buy-in-dashboard).
- Course Player → `/training/[slug]/learn` (sidebar + lesson + prev/next).  ✅ exists
- Activities / Assessments / Mock Tests → lessons(kind=activity) + `mock_tests`/`questions` engine (all types).  ✅ exists (extend per Activity/Assessment-engine rules).
- **Final Examination → external examination portal.  ❌ NEW (separate portal; mock tests do NOT certify).**
- **Certificate → issued only after final exam.  ❌ NEW (certificate generation + verification).**
- Continue Learning → resume last lesson via progress.  ⚠️ partial.

## Reconciliation with current codebase (as of this doc)
Read honestly before applying:
- **Already built:** Next.js 16 + TS + Tailwind v4 + Supabase; full CMS (page_content +
  /admin/content); LMS (courses→modules→lessons theory/activity HTML, mock tests w/ all
  question types, enrollment, Razorpay pay + webhook, 6-digit unlock, student /account); admin
  panel; SEO (metadata/sitemap/robots/JSON-LD); custom animation system (reveal, cursor,
  scroll-progress, canvas visuals).
- **New libs to add (need `npm install` on the dev machine — cannot verify build in sandbox):**
  framer-motion, gsap, zustand, @tanstack/react-query, @tanstack/react-table, react-hook-form,
  zod, recharts, @tiptap/*, sonner.
- **Rule conflicts to resolve:** `next.config.ts` currently sets `typescript.ignoreBuildErrors:
  true` and there are ~15 implicit-`any` warnings → to meet "strict TS / no TS errors" we must
  flip that off and annotate types. ESLint is not enforced in build → enable it.
- **Not yet built (future phases):** CRM, Organization portal, RBAC/roles/permissions, audit
  logs, voucher management, learning paths, examination portal, advanced analytics, activity
  engine beyond current types, TipTap-based lesson editor, notifications/calendar.
