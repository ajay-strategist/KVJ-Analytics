# 024 — Build Implementation Master Prompt
**KVJ Analytics Platform V3 · The document that starts development.**
When the CEO says "begin building," this is the operating contract for every implementation session.
Nothing is built before this doc is invoked. No shortcuts. No assumptions. Follow the documentation
exactly.

---

## 0. Prime directive
Build the KVJ Analytics Platform V3 — a premium analytics/AI/BI/digital-transformation company site
**+** a full LMS **+** an admin CMS — to a **production-ready, scalable, secure, reusable,
enterprise-grade** standard, exactly as specified in docs 001–023 and the companion specs. Ship
working software incrementally; verify every step.

---

## 1. Read before building (every session)
1. `CLAUDE.md` — live architecture map (current reality).
2. `docs/00-MASTER-INDEX.md` — the plan + status.
3. `docs/MASTER_IMPLEMENTATION_RULES.md` — standards (design/code/security/a11y/perf/DoD).
4. `docs/CONTENT-SPECS-V3.md` — exact approved page copy (content is CEO-locked).
5. The specific docs for the sprint's scope (e.g. 001+003+004 for a page; 010+011+012+013 for a
   backend module; 015 + `LMS-PLATFORM-SPEC.md` for LMS).
Never re-derive architecture from scratch — the docs are the source of truth. If a doc and the code
disagree, reconcile and update the doc (keep them true).

---

## 2. Non-negotiable rules (from the docs)
- **Content:** exact approved copy only (`constants.ts` `FALLBACK_*`); **never fabricate** stats/
  history/testimonials/clients. Design/layout/motion may change freely (001/CLAUDE.md).
- **Fallback-merge is sacred** — pages can't white-screen (002).
- **Dark, glass, cyan/blue, Plus Jakarta** design system; tokens only, zero magic values (001).
- **Reusable, prop-driven components**; no duplication (003); register page sections (002/006).
- **Security:** auth-guard + **Zod-validate** every route; authorization by permission, never
  client-trusted `userId`; sanitize/sandbox admin HTML; secrets env-only (011/012/013).
- **Accessibility** WCAG 2.2 AA + **reduced-motion**; **responsive** all five breakpoints (001/004).
- **Verify with `npx tsc --noEmit`** (+ logic review) — the sandbox can't `next build`; migrations
  run in Supabase before deploy (021/023/CLAUDE.md).
- **Don't break** admin/LMS/auth/payments; additive changes preferred (CLAUDE.md).

---

## 3. Sprint sequence (build order)
**Phase 0 — Guardrails (do first).** Turn off `ignoreBuildErrors` + enable ESLint; annotate existing
implicit-any; set strong `ADMIN_SESSION_SECRET`; standardize admin auth on `isAdminAuthed`; add Zod
to the highest-risk routes (payments/unlock/content). (021/011/012)

**Phase 1 — V3 Marketing Website.** Section registry + `SectionRenderer` (002/003) → **Home →
About → Corporate → Educational → Products → Learn → Blog → Careers → Contact**, from
CONTENT-SPECS-V3 + the V3 section library, per 001/004/005. Migrate each page to block mode
non-breaking; wire per-page SEO (008). Retire duplicate card/hero components opportunistically (003 §6).

**Phase 2 — Website Engine.** CMS Builder (006) + Media Library (007) + SEO/per-page + Forms & Lead
engine (009); Growth-OS self-contained modules (008) as time allows.

**Phase 3 — Enterprise Platform.** Consolidate DB into migrations (010); harden APIs (011); RBAC +
orgs (012/013).

**Phase 4 — Business Modules.** LMS gaps (015: vouchers, learning paths, gating, V3 dashboard,
HTML-activity bridge, certificates, final-exam eligibility) → CRM (014) → Analytics (016) →
Administration (017).

**Phase 5 — Intelligence.** AI platform gateway (018) → Growth-OS integration modules + Integration
Hub (008/019), all approval-gated.

**Phase 6 — Infrastructure (continuous).** Performance budgets (020), CI/CD (021), tests (022),
deployment/backup runbooks (023) — applied throughout, not just at the end.

---

## 4. Per-sprint loop
1. **Plan** — restate scope + the docs it must satisfy + its Definition of Done.
2. **Build** — smallest shippable slice; reuse before creating; tokens/components/patterns from docs.
3. **Validate** — `tsc --noEmit` clean; logic review; meet the doc's DoD + master-rules DoD (§5);
   tests for risky paths (022); a11y + responsive + reduced-motion check.
4. **Document** — update `CLAUDE.md` + `00-MASTER-INDEX.md` + the relevant doc if structure changed;
   note files created/modified, DB/API changes, known limitations.
5. **Review gate** — pause for CEO review before the next sprint (unless told to run through).
Then continue to the next sprint. Repeat to production.

---

## 5. Definition of done (global — verify before "complete")
Builds ✓ · no TS errors ✓ · no ESLint errors ✓ · responsive (5 breakpoints) ✓ · accessible (WCAG
2.2 AA, keyboard, reduced-motion) ✓ · secure (auth + Zod + permission + sanitized) ✓ · no duplication
✓ · performant (CWV/Lighthouse, 020) ✓ · CMS-integrated, nothing hardcoded ✓ · fallback-merge intact
✓ · content exact/approved ✓ · tests on risky paths ✓ · docs updated ✓.

---

## 6. Guardrails against drift
- If reality diverges from a doc, **update the doc** (don't silently deviate).
- If a change would break admin/LMS/auth/payments, stop and redesign additively.
- If asked to fabricate content or bypass security/a11y, decline and flag — these are hard limits.
- Prefer extension over rewrite: new features slot in without restructuring existing code.

---

## 7. Kickoff command (what to say to start)
> "Begin Phase 0, then Phase 1 Home V3. Read CLAUDE.md + 00-MASTER-INDEX + MASTER_IMPLEMENTATION_RULES
> + CONTENT-SPECS-V3 + 001–005. Build the section registry, then Home from the V3 library. Verify
> with tsc, meet the global DoD, update the docs, and pause for review."

---
_Status: ✅ complete. **Documentation set 001–024 complete — ready to build on command.**_
