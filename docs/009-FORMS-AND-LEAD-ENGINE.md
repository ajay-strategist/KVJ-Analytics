# 009 — Forms & Lead Engine
**KVJ Analytics Platform V3 · Phase 2 · Website Engine**
Every form and where its submission goes. Unifies contact, corporate, educational, Learn enquiry,
careers, internship, and newsletter into one validated, spam-protected, CRM-ready pipeline.
**[in code]** exists, **[to add]** planned.

---

## 1. Current forms **[in code]**
| Form | Component | API | Stored |
|---|---|---|---|
| Contact | `ContactForm` | `POST /api/contact` | `leads` |
| Internship apply | `InternshipApplyForm` | `admin/internship-applications` | `internship_applications` |
| Job apply | `JobApplyForm` | `admin/job-applications` | `job_applications` |
| Course inquiry | (inquiry flow) | `admin/inquiries` | `inquiries` |
Admin reviews via `/admin/leads`, `/admin/inquiries`, `/admin/applications`.

---

## 2. Target: one form engine
A shared, schema-driven form layer so new forms are config, not bespoke code.
- **Validation:** React Hook Form + **Zod** (target stack) — client + server (never trust client).
- **Field kit:** on-system inputs (001 §11) with label/helper/error/success/disabled states, a11y
  (`aria-invalid`, `aria-describedby`), keyboard-complete.
- **States:** idle / submitting (button spinner) / success (inline + toast) / error (retry). Never
  lose entered data on error.
- **CMS-configurable** where sensible: field labels, required flags, routing, success message (002).

---

## 3. The four Learn enrollment forms (field specs — LMS spec)
- **Individual Training enquiry:** Name · Email · Phone · Interested Course · Preferred Schedule →
  `leads`/`inquiries` (source=individual) → team contacts → manual course assignment.
- **Corporate/Institution enquiry:** org details → agreement → **voucher generation** (LMS/013) —
  routed to corporate pipeline.
- **Internship application:** Name · Email · Phone · **Resume upload** · Preferred Domain · Education →
  `internship_applications` → review → onboarding.
- **Self-paced:** no form — account + Razorpay (LMS). Newsletter/coupon future.

Plus: **Contact** (general), **Corporate solution enquiry**, **Careers apply**, **Newsletter** (footer).

---

## 4. Spam, validation & integrity **[to add]**
- Honeypot + time-trap + **rate limiting** (per IP/session) on every public POST.
- Optional CAPTCHA/Turnstile on high-abuse forms.
- **OTP** (email/phone) verification where the LMS spec calls for it (account/enquiry trust).
- Server-side Zod validation, size limits, file-type allowlist for resume uploads (PDF/doc, via 007
  secure upload). Sanitize all stored input.
- CSRF protection; submissions tied to `admin_session`-independent public endpoints, hardened.

---

## 5. Lead lifecycle → CRM (ties to 014)
Submission → normalized **lead** record (source, campaign/UTM, payload, timestamp, status=new) →
- **Auto-reply** email to submitter (Resend) + **internal notification** (email/Slack/WhatsApp via 019).
- Appears in admin list with status workflow (new → contacted → qualified → won/lost).
- **De-dupe** by email/phone; merge into existing lead/contact.
- Feeds **014 CRM** (pipeline, tasks, org mapping). Until CRM lands, `leads`/`inquiries` tables are
  the store; CRM is additive over them.
- **Analytics:** track submissions, conversion, source (016/008).

---

## 6. Workflow & automation **[to add]**
Per-form rules: route by interest/source, assign owner, tag, trigger sequence (welcome/nurture via
email engine 008). Human-in-the-loop for anything outbound. Configurable in admin.

---

## 7. Accessibility & UX
Labels above fields, inline validation, clear errors, required marked, logical tab order, visible
focus, success confirmation, no dead-ends (001 §11/§20). Mobile-friendly inputs (correct
`type`/`inputmode`), autofill-friendly names.

---

## 8. Build order
1. Shared RHF+Zod field kit + form wrapper with states (001).
2. Migrate existing forms onto it; add server Zod + rate-limit + honeypot.
3. Resume upload via 007; auto-reply + internal notify (019).
4. Lead normalization + de-dupe + status workflow; wire to CRM (014).
5. OTP + CAPTCHA where required; UTM capture; analytics.

---

## 9. Definition of done
Every form: client+server Zod validated · spam-protected + rate-limited · idle/submitting/success/
error states with no data loss · a11y-complete · normalized to a lead with source/UTM · auto-reply +
internal notify · de-duped · CRM/analytics wired · uploads secure.

---
_Status: ✅ complete._
