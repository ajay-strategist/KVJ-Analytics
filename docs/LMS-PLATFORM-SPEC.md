# KVJ Analytics — LMS & Learning Platform Spec

> Companion to `MASTER_IMPLEMENTATION_RULES.md` + `CLAUDE.md`. Legend: ✅ exists · ⚠️ partial · ❌ new.

## Public "Learn" page (discovery + enroll — NOT delivery) — Phase 1 marketing page
**Positioning:** premium public *gateway* into the KVJ Learning Ecosystem — NOT an LMS, course
catalog, or traditional training page. Feel = Coursera/Udemy/Microsoft Learn × Apple/Stripe/Linear.
It showcases opportunities, explains the 4 learning methods, lets visitors discover courses, and
converts them to account creation. **Delivers no learning content** — learning begins only after auth.
Audience: students · working professionals · career switchers · fresh grads · business pros ·
individual learners · orgs upskilling employees.
Learning philosophy (every course): Learning → Activities → Assessments → Mock Tests → External
Final Exam → Certification. Practical · industry-focused · interactive · flexible · tech-driven.

Sections: Hero/Banner · Why Learn · Featured/Popular/New Courses · Learning Paths · Course
Categories · Ways to Learn (4 methods) · Certifications · Student Success Stories · FAQ · CTA.
Course card fields: thumbnail · title · difficulty · duration · short description · learning
method · rating (future) · Enroll button.
Design: glassmorphism · large type · floating cards · smooth/premium motion · micro-interactions ·
progress indicators. Avoid: traditional-LMS look · old edu sites · classroom stock photos · clipart · heavy text.
**CMS-managed (nothing hardcoded):** hero/banner · learning paths · categories · featured courses
+ ordering · testimonials · FAQs · CTA · enrollment methods · promotional sections.
Design so future modules (Marketplace → Dashboard → Player → Lesson/Activity/Assessment/Mock/
Certificate engines → Analytics → Admin) slot in **without structural changes**.

### Enrollment method field specs
- **Individual Training** enquiry fields: Name · Email · Phone · Interested Course · Preferred Schedule → team contacts → manual course assignment → payment handled separately.
- **Internship** application fields: Name · Email · Phone · Resume · Preferred Domain · Education → review → onboarding for selected.
- **Corporate/Institution** voucher system must support: expiration · usage limits · tracking · organization mapping · course mapping (each voucher = one learner).
- **Self-Paced** future: email voucher code · online payment · coupon codes · discount campaigns.
- **Module assessment gating:** learner cannot unlock next module until current module assessment is passed (admin sets passing marks · attempts · random questions · time limit · question pool).

## Four enrollment methods
1. **Self-Paced** — CTA "Enroll Now": Create Account → Purchase → Payment → Auto-enroll → Start. ✅ (Razorpay)
2. **Individual Training** — CTA "Request Individual Training": Form → Team contact → Schedule → Payment → Course assignment. ⚠️ (form→lead exists; scheduling/assignment new)
3. **Corporate / Institution** — CTA "Request Corporate Program": Enquiry → Discussion → **Voucher generation** → Student registration → Voucher validation → Access. ⚠️ (unlock_codes ≈ vouchers; formalize voucher mgmt ❌)
4. **Internship** — CTA "Apply for Internship": Application → Review → Interview → Selection → Enrollment. ⚠️ (`internships` + applications exist)

## Student dashboard (Netflix + Duolingo + Coursera feel) — ⚠️ upgrade `/account`
Welcome {name} · Continue Learning · Today's Goal · Learning Streak · Progress · Certificates ·
Upcoming Assessments · Recommended Courses · Recently Viewed · Available Courses · Achievements ·
Notifications. Buy courses in-dashboard.

## Course structure
Course → Overview → (Module → Assessment)×N → Mock Tests → **Final Examination** → **Certificate**.
✅ course/modules/assessments/mock. ❌ Final Exam portal + Certificates.

## Module content types — ⚠️ extend lesson kinds
Video · HTML Lesson · Infographic · Image · Animation · PDF · Interactive Activity · Quiz ·
Download · Discussion · Notes. (Admin content types also: Rich Text, Gallery, Audio, PPT,
Interactive HTML, SCORM(future), Lottie, Iframe, External Link, YouTube, Vimeo, Code Block.)

## Activity engine — ⚠️ extend
Types: HTML Simulation · Game · Drag-Drop · Matching · Scenario · Coding · Excel Exercise ·
Power BI Exercise · Dashboard Activity · Case Study · AI-Generated Activity.
Each: Max Marks · Passing Marks · Attempts · Time Limit · Completion · Rubrics · Feedback.

## HTML Activity (signature feature) — ❌ new secure JS bridge
Admin uploads `activity.html` (AI can generate HTML/CSS/JS). LMS renders in a **sandboxed iframe**.
Lesson↔LMS bridge, e.g. `LMS.completeActivity({ score:95, timeSpent:420, completed:true })`
→ LMS auto-updates marks/progress/completion/time. Never execute unsafe JS.

## Assessment engine — ✅ core exists, ⚠️ extend
Single · Multiple · True/False · Match · Drag-Drop · Order · Fill-Blank · Numeric · Short ·
Long · Coding · SQL · Excel Upload · Power BI Upload · File Upload · HTML Activity · AI Evaluation.
Per question: Marks · Negative Marks · Difficulty · Explanation · Hints · Time · Tags.

## Mock test — ✅ exists
Anytime · unlimited/limited attempts · random · category-based · adaptive difficulty ·
leaderboard · analytics. **Does NOT certify.**

## Admin panel modules — ✅ many exist, ❌ some new
Dashboard · Users · Courses · **Learning Paths** · Modules · Lessons · Activities · Assessments ·
Question Bank · Mock Tests · **Final Exams** · **Certificates** · **Voucher Management** ·
Corporate Training · Internships · Payments · Reports · Analytics · Settings.

## Analytics — ❌ new (unified)
Track everything: Student → Course → Lesson → Module → Activity → Assessment → Mock → Final →
Certificate.

## New build items (not yet in codebase)
Final Examination portal · Certificates (generation + verification) · Voucher management ·
Learning paths · HTML-activity secure JS bridge · adaptive mock difficulty · unified analytics ·
Netflix/Duolingo-style dashboard · extended content/activity types · AI evaluation.
