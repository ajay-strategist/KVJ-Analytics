# 018 — AI Platform
**KVJ Analytics Platform V3 · Phase 5 · Intelligence**
Shared AI infrastructure the whole ecosystem draws on — the layer beneath Growth OS (008), CRM
insights (014), and LMS AI. **[to add]** — net-new. Governing principle: **human-in-the-loop by
default**; AI proposes, humans approve.

---

## 1. Scope
One AI layer, many consumers: **AI Assistant** (conversational admin), **SEO AI** + **Content AI**
(008), **CRM AI** (014), **Analytics AI** (016), **Learning AI** (015: activity/question generation,
AI evaluation, recommendations), **Support AI**, **Workflow AI** (automations). 018 owns the shared
plumbing; each consumer owns its application-specific prompts/UX.

---

## 2. Core infrastructure
- **Model gateway:** a single server-side service wrapping the LLM provider(s) — API key in env
  (012, never client-exposed), timeouts, retries, streaming, cost/usage logging, model selection per
  task (cheap for classification, stronger for generation).
- **Prompt/task registry:** versioned prompt templates per capability (audit + iterate).
- **Context builders:** safe assembly of page/course/CRM/analytics context into prompts (respect
  permissions 013 — AI only sees what the acting user may see).
- **Structured output:** Zod-validated JSON for actions/diffs (so proposals are machine-appliable).
- **Vector/RAG (optional, later):** embeddings over KB/courses/docs for grounded answers + search.

---

## 3. AI Assistant (conversational admin) — 008 §AI Assistant
Natural-language ops in admin (and later a `⌘K` mode, 005 §8): "Improve my Home SEO" → analyze →
show diff → **Apply**; "Draft a LinkedIn post for the Power BI course" → draft; "Why is traffic
dropping?" → explain + recommend. Always returns a **proposal + preview**, applied only on click
(low-risk tasks may use opt-in auto-apply rules).

---

## 4. Guardrails (non-negotiable)
- **Human-in-the-loop:** analyze → propose → approve. Never auto-publish content/social/email or
  auto-mutate live data without an approval gate.
- **Permission-aware:** AI actions run as the user, gated by 013; can't exceed the user's rights.
- **Grounded + honest:** cite/attach the data behind a recommendation; competitor intelligence
  produces **summaries only, never copied content** (008).
- **Safe outputs:** validate/sanitize AI-generated HTML before render (012); sandbox generated HTML
  activities (007). No secrets/PII in prompts beyond need; log usage for audit (012).
- **Reversible:** AI edits are versioned (006) and rollback-able.

---

## 5. Learning AI (015)
Generate activities/questions (admin reviews before publish), auto-evaluate open responses (SQL/
Excel/Power BI/essay) with rubrics + human override, recommend next courses/lessons, summarize
progress. Evaluation results are advisory-then-confirmed for high-stakes grading.

---

## 6. Cost, performance, reliability
Cache deterministic results; batch where possible; stream long generations; rate-limit per user;
graceful degradation if the provider is down (feature disabled, not broken app). Track token cost
per feature (016) for ROI.

---

## 7. Build order
1. Server model gateway + usage logging + Zod-structured outputs.
2. AI Assistant (analyze→propose→apply) over CMS/SEO (008) — highest value, self-contained.
3. Content/SEO generation; CRM lead-scoring/draft-emails (approval-gated).
4. Learning AI (generation + evaluation) with human override.
5. RAG/embeddings + support AI; workflow automations (opt-in).

---

## 8. Definition of done
Single server gateway (key server-only, usage-logged) · every capability returns approve-gated,
permission-aware, reversible proposals · AI HTML sanitized/sandboxed · outputs grounded, competitor
content never copied · high-stakes grading human-overridable · graceful degradation.

---
_Status: ✅ complete. (Overlaps 008 Growth OS — 018 owns shared infra, 008 owns marketing application.)_
