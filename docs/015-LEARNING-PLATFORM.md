# 015 — Learning Platform (LMS)
**KVJ Analytics Platform V3 · Phase 4 · Business Modules**
The engineering home for the LMS. Full functional spec lives in **`LMS-PLATFORM-SPEC.md`** (Learn
page, enrollment methods, dashboard, engines) — this doc is the architecture + build map, reconciled
with code. **[in code]** exists, **[to add]** planned.

---

## 1. Domain model **[in code]**
`courses → modules → lessons` (`kind: theory|activity`, `content_html`, `video_url`) +
`mock_tests` (`module_id` per-module; `NULL` = course-wide) `→ questions` (single, multiple,
truefalse, fillblank, dragdrop, sequence, matrix, code). Built in `/admin/courses/[id]` (visual
type-picker). Enrollment: `enrollments` (UNIQUE `user_id, course_slug` — required for upsert).

---

## 2. What exists vs new (from LMS-PLATFORM-SPEC)
- ✅ Course/module/lesson authoring · mock tests + all question types · course detail
  `/training/[slug]` → learn player `/training/[slug]/learn` → tests · **paid enrollment** (Razorpay
  order → verified webhook → enroll + receipt, idempotent) · **6-digit unlock** (colleges/corporate)
  · student `/account` · activity results + test submit APIs.
- ⚠️ Extend: student dashboard → Netflix/Duolingo/Coursera V3 (continue-learning, streak, progress,
  recommended, notifications) · activity engine types · assessment types (SQL/Excel/Power BI upload,
  AI eval) · module-assessment **gating** (must pass to unlock next) · content types (007).
- ❌ New: **Final Examination eligibility** (LMS decides; exam runs on an **external portal**) ·
  **Certificates** (issue + verify, only after external final) · **Voucher management** (formalize
  over `unlock_codes`: expiry, usage limits, org/course mapping) · **Learning paths** ·
  **HTML-activity secure JS bridge** (`LMS.completeActivity({score,timeSpent,completed})`, 007 §5) ·
  **unified analytics** (016) · AI evaluation (018).

---

## 3. Four enrollment methods (LMS-PLATFORM-SPEC §Enrollment; forms 009)
1. **Self-Paced** — account → Razorpay → auto-enroll. ✅
2. **Individual Training** — enquiry (Name/Email/Phone/Course/Schedule) → team → manual assign. ⚠️
3. **Corporate/Institution** — enquiry → agreement → **voucher batch** (org/course/expiry/usage) →
   learner redeems → access. ⚠️→ formalize vouchers (013/010).
4. **Internship** — application (Name/Email/Phone/Resume/Domain/Education) → review → onboarding. ⚠️

---

## 4. Learning journey & gating
`Course → Modules → Lessons → Module Assessment (must pass) → next Module → Activities → Mock Tests →
Final-Exam eligibility → External Exam Portal → Certificate`. LMS enforces sequential unlock via
progress + assessment pass; **mock tests never certify**; certificate issues only on external-exam
result. Resume-last-lesson (“Continue Learning”).

---

## 5. Engines (detail in LMS-PLATFORM-SPEC)
- **Lesson/content:** rich text, image, gallery, video, audio, PDF, PPT, HTML lesson, interactive
  HTML, animation, Lottie, infographic, timeline, accordion, tabs, code, embed, callout, download,
  quiz, activity (007 for media + HTML sandbox).
- **Activity engine:** HTML, drag-drop, matching, sorting, scenario, coding, Excel/Power BI, case
  study, simulations, games, AI-generated. Each: marks, passing, attempts, time, completion,
  feedback, hints, analytics.
- **Assessment engine:** all question types + SQL/Excel/Power BI upload + file upload + HTML activity
  + AI evaluation. Per-question: marks, negative, difficulty, hints, explanation, randomization, tags.
- **Mock engine:** random/category, unlimited/limited, timer, review, explanations, leaderboard,
  analytics. No certificate.
- **HTML-activity bridge:** sandboxed iframe + `postMessage` schema → auto-update marks/progress/time
  (007 §5, security 012).

---

## 6. Student dashboard (V3) ⚠️
Welcome · Continue Learning · Today's Goal · Streak · Progress · Certificates · Upcoming Assessments ·
Recommended · Recently Viewed · Available (buy in-dashboard, never bounce to public) · Achievements ·
Notifications. On-system (001) + motion (004).

---

## 7. Payments & access (existing, harden)
Razorpay order stored in `orders` → webhook verifies HMAC + **looks up order** for trusted
user/course/amount → enroll + Resend receipt (idempotent). Unlock codes validate active/expiry/
max_uses → enroll + redemption. **Harden:** derive `userId` from session, not client body (012).

---

## 8. Build order
1. Voucher management + learning paths + module-gating.
2. V3 student dashboard.
3. HTML-activity secure bridge + extended activity/content types (007).
4. Extended assessment types + AI evaluation (018).
5. Final-exam eligibility + external-portal handoff + certificates (issue/verify).
6. Unified LMS analytics (016).

---

## 9. Definition of done
Enrollment (4 methods) reliable + idempotent + session-derived userId · sequential gating enforced ·
engines support required types with marks/attempts/feedback/analytics · HTML activities sandboxed +
bridged securely · certificates only post external final · dashboard V3 + buy-in-dashboard · all
CMS/admin-manageable · permission-gated (013) · analytics tracked (016).

---
_Status: ✅ complete. (Companion: `LMS-PLATFORM-SPEC.md`.)_
