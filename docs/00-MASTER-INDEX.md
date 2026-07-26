# KVJ Analytics Platform V3 — Master Documentation Index

> The documentation-first build plan. **No website/app code is written until doc `024` says go.**
> 24 documents across 6 phases. Build order is top-to-bottom. Legend: ✅ written · 🟡 partial
> (content exists, needs formalizing into its own doc) · ⬜ not started.
>
> Cross-cutting governing docs (already written, apply to everything):
> - `MASTER_IMPLEMENTATION_RULES.md` — engineering/design/security standards. ✅
> - `CONTENT-SPECS-V3.md` — exact approved page copy (Home…Contact). ✅
> - `CLAUDE.md` (repo root) — live architecture map of what currently exists. ✅

## Phase 1 — Foundation (critical)
| # | Document | Priority | Status | Notes / maps to |
|---|---|---|---|---|
| 001 | Brand & Design System | ⭐⭐⭐⭐⭐ | ✅ | → `001-BRAND-AND-DESIGN-SYSTEM.md`. Grounded in `globals.css`; flags legacy tokens to reconcile (§16). |
| 002 | Website CMS Architecture | ⭐⭐⭐⭐⭐ | ✅ | → `002-WEBSITE-CMS-ARCHITECTURE.md`. Documents current fallback-merge store + target block model (Page→Sections→Blocks→…), non-breaking migration. |
| 003 | Website Component Library | ⭐⭐⭐⭐⭐ | ✅ | → `003-WEBSITE-COMPONENT-LIBRARY.md`. Full inventory (ui/ + v3/ + feature), checklist mapped, consolidation backlog. |
| 004 | Motion System | ⭐⭐⭐⭐⭐ | ✅ | → `004-MOTION-SYSTEM.md`. Principles, timing/easing scale, reveal patterns, global FX, CSS-first + Framer/GSAP/Lottie gate, reduced-motion, perf budget. |
| 005 | Navigation System | ⭐⭐⭐⭐ | ✅ | → `005-NAVIGATION-SYSTEM.md`. Floating-pill header, mega menu, mobile drawer, footer, breadcrumb, search, ⌘K palette, admin/student sidebars, a11y. **Phase 1 complete.** |

## Phase 2 — Website Engine
| # | Document | Status | Notes / maps to |
|---|---|---|---|
| 006 | Website CMS Builder | ✅ | → `006-WEBSITE-CMS-BUILDER.md`. Block builder, schema registry, draft/preview/publish/versioning. |
| 007 | Media Management System | ✅ | → `007-MEDIA-MANAGEMENT-SYSTEM.md`. Library, optimization pipeline, HTML-package sandbox. |
| 008 | SEO & Growth Engine (AI marketing) | ✅ | → `008-SEO-AND-GROWTH-ENGINE.md` (+ `GROWTH-OS-SPEC.md`). SEO foundation + AI Growth OS. |
| 009 | Forms & Lead Engine | ✅ | → `009-FORMS-AND-LEAD-ENGINE.md`. RHF+Zod, spam/OTP, lead lifecycle→CRM. |

## Phase 3 — Enterprise Platform
| # | Document | Status | Notes / maps to |
|---|---|---|---|
| 010 | Database Architecture | ✅ | → `010-DATABASE-ARCHITECTURE.md`. Current + target schema; flags split source-of-truth to consolidate into migrations. |
| 011 | API Architecture | ✅ | → `011-API-ARCHITECTURE.md`. ~45 routes documented; Zod/auth/idempotency/webhook conventions. |
| 012 | Authentication & Security | ✅ | → `012-AUTHENTICATION-AND-SECURITY.md`. HMAC admin + Supabase student; hardening + audit + MFA. |
| 013 | Roles & Permissions | ✅ | → `013-ROLES-AND-PERMISSIONS.md`. RBAC model, roles, permission catalogue, orgs, migration. |

## Phase 4 — Business Modules
| # | Document | Status | Notes / maps to |
|---|---|---|---|
| 014 | CRM | ✅ | → `014-CRM.md`. Contacts/orgs/pipelines/activities/tasks over existing leads; AI insights. |
| 015 | Learning Platform | ✅ | → `015-LEARNING-PLATFORM.md` (+ `LMS-PLATFORM-SPEC.md`). Architecture + build map. |
| 016 | Analytics Platform | ✅ | → `016-ANALYTICS-PLATFORM.md`. Event model, journey tracking, dashboards (Recharts/Power BI). |
| 017 | Administration | ✅ | → `017-ADMINISTRATION.md`. Module map, settings/integrations/users/roles, audit/backups/notifications. |

## Phase 5 — Intelligence
| # | Document | Status | Notes / maps to |
|---|---|---|---|
| 018 | AI Platform | ✅ | → `018-AI-PLATFORM.md`. Shared model gateway, assistant, guardrails (human-in-the-loop). |
| 019 | Integration Hub | ✅ | → `019-INTEGRATION-HUB.md`. Connector registry, OAuth/keys, adapters, webhooks, reliability. |

## Phase 6 — Infrastructure
| # | Document | Status | Notes / maps to |
|---|---|---|---|
| 020 | Performance Standards | ✅ | → `020-PERFORMANCE-STANDARDS.md`. CWV targets, rendering/assets/motion budgets, monitoring. |
| 021 | DevOps | ✅ | → `021-DEVOPS.md`. Envs, CI/CD gates, monitoring, rollback; flip ignoreBuildErrors/ESLint on. |
| 022 | Testing Strategy | ✅ | → `022-TESTING-STRATEGY.md`. Layers + critical money/auth/LMS cases + CI. |
| 023 | Deployment Guide | ✅ | → `023-DEPLOYMENT-GUIDE.md`. Deploy/migrate/backup/restore/rollback runbooks. |

## Final
| # | Document | Status | Notes |
|---|---|---|---|
| 024 | BUILD_IMPLEMENTATION_MASTER_PROMPT | ✅ | → `024-BUILD-IMPLEMENTATION-MASTER-PROMPT.md`. The operating contract: read-order, rules, sprint sequence, per-sprint loop, global DoD, kickoff command. |

## Reconciliation of already-written docs
- `MASTER_IMPLEMENTATION_RULES.md` → cross-cutting (feeds 001, 011, 012, 020, 022).
- `CONTENT-SPECS-V3.md` → page content (consumed by 002/003 when pages are built).
- `LMS-PLATFORM-SPEC.md` → **015**.
- `GROWTH-OS-SPEC.md` → **008** (and **018**).
- `CLAUDE.md` → living map of current reality; every doc's "maps to" column points back to it.

## Working rule
Write docs in phase order (001 → 024). Each finished doc updates its row here to ✅. Only after
024 is written and approved does implementation begin. Building the marketing pages (Home…Contact,
Learn) happens under the design system (001) + component library (003) once those are locked.
