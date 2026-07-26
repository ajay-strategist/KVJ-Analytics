# 023 — Deployment Guide
**KVJ Analytics Platform V3 · Phase 6 · Infrastructure**
Exact runbooks for shipping, migrating, backing up, restoring, and monitoring production.
Extends CLAUDE.md build/deploy. **[in code]** partly, **[to add]** planned.

---

## 1. Pre-deploy checklist
- `npx tsc --noEmit` clean (no TS errors) + ESLint clean (021/022).
- Pending `supabase/migrations/*.sql` reviewed and ready.
- Required env vars present in Vercel (see §6): Supabase, Razorpay, Resend, site URL, admin secret,
  GA/Pixel, LLM/integration keys as applicable.
- Preview deploy tested (critical journeys, 022); backup taken if a destructive migration is involved.

---

## 2. Standard deploy (runbook)
1. Merge PR to `main` (CI green).
2. **Run migrations in Supabase first** (SQL editor or CLI) — schema before code (CLAUDE.md/010).
3. Deploy: `npx vercel@latest --prod` (or auto on merge, 021).
4. Smoke test: home, a course detail + enroll, admin login + publish a page, contact form → lead,
   payment webhook health.
5. Watch logs/monitoring (021) for 15–30 min.

> Repo quirk: the sandbox can't `next build` (no SWC/network) — real build runs on Vercel; verify
> locally with `tsc` + logic review (CLAUDE.md). Old duplicate routes / missing default exports DO
> fail the Vercel build — check those.

---

## 3. Migrations
Additive, timestamp-named, never edit shipped ones (010 §8). Apply before code deploy. For
destructive/irreversible changes: snapshot/backup first (§5), write a reverse migration, apply in a
low-traffic window, verify.

---

## 4. Environment promotion
Dev → Preview (per-PR, staging Supabase) → Production. Keep schema in lockstep. Feature flags (017)
to ship incomplete modules dark and enable per environment.

---

## 5. Backup & restore
- **Backups:** scheduled Supabase backups (automated) + manual snapshot before risky migrations +
  periodic media/storage export.
- **Restore runbook:** identify target snapshot → restore DB → reconcile storage → re-run any
  post-restore migration → smoke test → announce. Practice restores periodically (a backup you
  haven't restored isn't a backup).

---

## 6. Env vars (reference — 012 for handling)
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL`, `ADMIN_SESSION_SECRET`/`ADMIN_PASSWORD` (+ future
LLM/integration keys, 019). Secrets in Vercel env only; strong prod `ADMIN_SESSION_SECRET`.

---

## 7. Rollback & incident response
- **Code:** Vercel instant rollback to prior deployment.
- **Data:** reverse migration or restore (§5) — never leave prod broken; prefer roll-forward fix if
  safe, else rollback.
- **Incident:** detect (monitoring/alerts 021) → assess blast radius → mitigate (rollback/flag off) →
  communicate → post-mortem + regression test (022). Idempotent webhooks make payment retries safe.

---

## 8. Post-deploy
Verify CWV/monitoring (020/021), confirm sitemap/robots/SEO intact (008), tag the release, update
docs if structure changed (keep CLAUDE.md + 00-MASTER-INDEX current).

---

## 9. Definition of done
Repeatable deploy runbook · migrations-before-code · env complete + secrets safe · preview-tested ·
backup-before-destructive · one-click rollback + tested restore · smoke tests + monitoring · incident
runbook.

---
_Status: ✅ complete._
