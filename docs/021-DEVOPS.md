# 021 — DevOps
**KVJ Analytics Platform V3 · Phase 6 · Infrastructure**
Source control, CI/CD, environments, monitoring, rollback. **[in code]** partly, **[to add]** planned.

---

## 1. Stack
- **Hosting:** Vercel (Next.js 16, edge/serverless). Deploy: `npx vercel@latest --prod` (CLAUDE.md).
- **Data:** Supabase (Postgres/Auth/Storage). Migrations in `supabase/migrations/` run **before**
  deploy.
- **Source:** GitHub. **Sandbox note:** this environment can't run `next build` (no SWC binary/
  network) — verify with `npx tsc --noEmit` + logic review; real builds happen on Vercel (CLAUDE.md).

---

## 2. Environments
- **Development** — local + Supabase dev project; env in `.env.local` (`.env.local.example` documents
  keys).
- **Preview** — Vercel preview deploy per PR (auto) with a staging Supabase (or scoped) — test before merge.
- **Production** — `main` → Vercel prod; production Supabase; secrets in Vercel env (never committed).
Keep schemas in lockstep across envs (010 §8).

---

## 3. CI/CD **[to add]**
On PR: install → **typecheck (`tsc --noEmit`)** → **lint (ESLint)** → **build** → tests (022) →
Lighthouse budget (020) → preview deploy. On merge to `main`: run pending migrations → prod deploy →
smoke test. **[reconcile]** `next.config.ts` sets `typescript.ignoreBuildErrors: true` + ESLint not
enforced — flip these on in CI to meet the strict-TS/no-lint-errors bar (master rules; annotate the
existing implicit-any params).

---

## 4. Config & secrets (012)
All secrets in env (Vercel/`.env.local`), never in git; `.env.local.example` lists keys without
values; strong prod `ADMIN_SESSION_SECRET`; rotate on exposure. Feature flags (017) to ship dark.

---

## 5. Monitoring & observability **[to add]**
Error tracking (Sentry or similar) — client + server; uptime checks on key routes (home, payments
webhook, login); Vercel + Supabase logs/metrics; real-user CWV (020/016); alerting to admin channels
(019). Structured server logs feed audit (012).

---

## 6. Releases & rollback
Trunk-based with short-lived PRs; preview per PR; tag releases. **Rollback:** Vercel instant rollback
to a prior deployment; DB rollback via reverse migration or restore (023) — **never** destructive
migration without a backup + snapshot. Idempotent webhooks make retries safe (011).

---

## 7. Runbooks
Deploy, rollback, run-migration, rotate-secret, restore-backup, incident-response — documented (023),
each with exact commands. Keep CLAUDE.md build/deploy notes authoritative for this repo's quirks.

---

## 8. Definition of done
PRs gated by typecheck+lint+build+tests+Lighthouse · migrations run before deploy · secrets env-only ·
preview per PR · error/uptime/CWV monitoring + alerts · one-click rollback + backup-before-migration ·
`ignoreBuildErrors`/ESLint enforced in CI · runbooks current.

---
_Status: ✅ complete._
