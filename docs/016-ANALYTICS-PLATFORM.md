# 016 — Analytics Platform
**KVJ Analytics Platform V3 · Phase 4 · Business Modules**
Unified measurement across the whole ecosystem — the through-line that also showcases KVJ's own
craft (BI is the business). **[in code]** GA/Pixel hooks, **[to add]** the platform.

---

## 1. Two layers
- **Web analytics [in code]:** `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL` auto-load when set
  (CLAUDE.md); Vercel `<Analytics/>` in root layout. Traffic, sources, page views.
- **Product analytics [to add]:** first-party event tracking of platform behavior (learning,
  commerce, CRM) stored/queried for dashboards + Growth OS (008) + CRM insights (014).

---

## 2. What to track (the LMS spine + more)
`Student → Course → Lesson → Module → Activity → Assessment → Mock → Final → Certificate` — every hop
is an event. Plus: page/lesson views, course progress %, activity completion + score + time,
assessment scores/attempts, mock results, enrollments, payments, unlock redemptions, search queries,
downloads, form submissions, funnel drop-off, session depth/scroll (LMS-PLATFORM-SPEC/master rules).

---

## 3. Event model **[to add]**
`events(id, user_id?, session_id, type, entity_type, entity_id, props jsonb, org_id?, ts)`. Emit from
client (page/scroll/click) + server (enroll/pay/submit) via a small `track()` helper. Roll up into
summary tables / materialized views (010) for fast dashboards; or export to a warehouse/Power BI for
heavy analysis. Respect consent + privacy (012 §8); anonymize where possible.

---

## 4. Dashboards
- **Admin/business:** traffic, top pages/courses/products, conversion, lead gen, course sales, revenue,
  funnel — the "Marketing Dashboard" (008/GROWTH-OS): SEO/Content/Conversion scores, Social reach,
  trends with arrows.
- **Instructor:** course engagement, completion, assessment performance, drop-off by lesson.
- **Org (corporate/college):** their learners' progress, completion, certificates (org-scoped, 013).
- **Student:** personal progress, streak, scores, goals (LMS dashboard 015).
Built with **Recharts** (target stack); KPIs, widgets, filters, date ranges; embedded **Power BI**
where deeper analysis fits (master rules).

---

## 5. Reports
Scheduled/exportable (CSV/PDF): enrollments, revenue, funnel, cohort progress, org rollups,
campaign performance. Feed daily Growth Recommendations (008).

---

## 6. Privacy, performance, integrity
Consent-aware tracking; no PII in event props; aggregate for display; sample/batch to avoid
performance cost (020); server events are source of truth for money/enrollment (never client-trusted).
Org data isolation (013). Heatmaps/scroll/GSC/GA are **integrations** (019), opt-in.

---

## 7. Build order
1. `track()` helper + `events` table; instrument key server events (enroll/pay/submit) first (trustworthy).
2. Client events (page/lesson views, activity/assessment outcomes).
3. Rollups + admin dashboard (Recharts).
4. Instructor/org/student dashboards (permission-scoped).
5. Reports + Growth-OS/CRM feeds; Power BI embed; external integrations (019).

---

## 8. Definition of done
Full journey instrumented (server-authoritative for money/enrollment) · dashboards per audience,
permission/org-scoped · Recharts + optional Power BI embed · exportable reports · consent + privacy
respected · no material perf hit · feeds Growth OS + CRM.

---
_Status: ✅ complete._
