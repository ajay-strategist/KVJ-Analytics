# 019 — Integration Hub
**KVJ Analytics Platform V3 · Phase 5 · Intelligence**
Every third-party connection, managed in one place with consistent auth, config, and health.
**[in code]** exists, **[to add]** planned. Integrations are **opt-in + authorized**; outbound
actions respect human-in-the-loop (008/018).

---

## 1. Current integrations **[in code]**
- **Razorpay** — course payments (order + HMAC-verified webhook, 015/011).
- **Resend** — transactional email (receipts); extend to auto-replies/campaigns (008/009).
- **Supabase** — Auth/Postgres/Storage (010/012).
- **GA / Meta Pixel** — auto-load when env set (016).
- **Vercel** — hosting/analytics (021).

---

## 2. Target integrations
| Provider | Use | Doc |
|---|---|---|
| Google (Search Console, Analytics, OAuth) | SEO/keyword data, sign-in | 008/016/012 |
| Microsoft / Power BI | Embedded analytics, OAuth | 016 |
| Meta / social (LinkedIn, Instagram, Facebook, X, YouTube, Pinterest, Threads) | Social publishing/insights | 008 |
| WhatsApp / SMTP / Slack | Notifications, auto-reply, alerts | 009/017 |
| GitHub | DevOps/CI (021) | 021 |
| LLM provider | AI platform | 018 |
| Storage/CDN | Media delivery | 007 |
| Payment (future: cards/UPI/coupons) | Commerce | 015 |

---

## 3. Architecture
- **Connector registry:** each integration = a config record (`integrations` table): provider, status
  (connected/error/disabled), scopes, last-checked, owner. Managed in admin Settings (017).
- **Auth patterns:** API keys (env, 012) for server-to-server; **OAuth** for user-authorized services
  (Google/Microsoft/social) with token storage + refresh (encrypted, server-only).
- **Adapters:** one module per provider behind a common interface (`publish()`, `fetchMetrics()`,
  `send()`), so consumers (008/016/009) don't couple to a vendor SDK.
- **Webhooks in:** verified signature → server-truth → idempotent (011 §5).
- **Health checks + test buttons** in admin; graceful degradation if a provider is down (feature
  disabled, app unaffected).

---

## 4. Security & governance (012)
Secrets env-only, never client-exposed; OAuth tokens encrypted at rest; least-privilege scopes;
per-integration permission (`integration.manage`, 013); all connect/disconnect + outbound actions
audited; user consent required before publishing to social/email; rate-limit + retry/backoff.
**Never** auto-post or send without approval (008/018).

---

## 5. Reliability
Retries with backoff, circuit-breaking on repeated failure, queued outbound jobs (so a slow provider
doesn't block requests), idempotency keys, dead-letter for failed jobs, observability (021).

---

## 6. Build order
1. `integrations` registry + admin Settings UI (status/test) (017).
2. Resend expansion (auto-reply/campaigns) + notifications (WhatsApp/Slack/SMTP).
3. Google OAuth + Search Console/Analytics read (008/016).
4. Social publishing (authorized, approval-gated) + Power BI embed.
5. Queue + health/observability hardening.

---

## 7. Definition of done
All integrations in one registry with status/health · keys env-only, OAuth tokens encrypted ·
adapters behind common interfaces · inbound webhooks verified + idempotent · outbound authorized +
approval-gated + audited · retries/backoff/queue · graceful degradation.

---
_Status: ✅ complete._
