# Antigravity Build Steps — KVJ Analytics (part by part)

We feed Antigravity one step at a time. Each step: the goal, the content (mapped to Sanity), and a copy-paste prompt. Verify a step works before moving to the next.

> Note: "App Development" is **excluded** from all offerings per current scope.

---

## GLOBAL DESIGN & ART DIRECTION (applies to every step)

**Reference:** prowiz.io look & feel — premium, spacious, confident. Paste this block at the top of every Antigravity step so the UI stays consistent.

**Two-Segment Architecture (core idea).** The whole site is organized around **two audiences**: **Corporate** and **Education**. The Home page presents these as two bold, equal paths (split hero / two large entry cards). Navigation, color accents, and CTAs reinforce the two segments throughout. A visitor instantly self-selects "I'm a business" or "I'm an institution."

**Copy style — bold statements, not paragraphs.**
- Lead with a 3–5 word **bold statement** headline. Support with one short line (max ~15 words).
- Each section uses a small **eyebrow label** above the headline (e.g. "CORPORATE", "Report Automation").
- Replace descriptive sentences with punchy claims. Example: ~~"KVJ Analytics provides advanced analytics and automation services…"~~ → **"Smarter Reporting. Faster Decisions."**
- Lead with **metrics** wherever possible (16+ years, 50,000+ trained).

**Visual language.**
- Generous whitespace, large display type, strong typographic hierarchy.
- Alternating image/text "offering" rows (image left/right, bold statement + short copy + "Learn More").
- A prominent **metrics band** ("Our Journey in Numbers" style) with large animated counters.
- **Numbered feature cards** (01–06 "Why Choose Us" style).
- Logo strip (clients / regions), testimonials, and case-study cards.
- Professional, premium palette; subtle motion on scroll; fully responsive; strong visuals/iconography for every service.

**Add these reusable components to the design system (Step 1):**
`Eyebrow`, `BoldStatement` (display headline), `OfferingRow` (alternating image/text), `MetricCounter` (animated), `NumberedCard`, `LogoStrip`, `SegmentCard` (Corporate/Education), `Testimonial`, `CTASection`.

**Bold-statement headlines to use (editable in Sanity):**
- Home hero: **Transforming Data Into Decisions**
- Corporate segment: **Smarter Reporting. Faster Decisions.**
- Education segment: **Industry-Ready Talent. Built Faster.**
- Training: **Real Skills. Real Data. Real Results.**
- Products: **Automate Reporting. Elevate Institutions.**
- Impact: **16 Years. 55,000+ Trained. Global Reach.**
- Contact: **Let's Build Smarter Systems Together.**

> Each bold headline lives in a Sanity field so the non-coder can edit it — never hard-code.

---

## STEP 1 — Foundation + Global Shell + Home Page

**Goal:** Stand up the project, the CMS, the global header/footer, and a fully dynamic Home page driven by this content.

### Content mapped to Sanity

**`siteSettings` (singleton)**
- Company: KVJ Analytics
- Tagline: Analytics • Automation • Training • Educational Technology
- Contact info / socials: *[provide when ready]*
- Regions served: India, UAE, Oman, USA, Europe

**`homePage` (singleton)**

Hero:
- Headline: **Transforming Data Into Decisions**
- Subhead: Analytics • Automation • Training • Educational Technology
- Intro: KVJ Analytics helps corporates and educational institutions automate operations, visualize data, improve decision-making, and build industry-ready talent.
- Supporting line: 16+ years of expertise delivering analytics, automation, dashboards, training, and educational technology solutions across India, UAE, Oman, USA, and Europe.

Key Highlights (metrics band — array):
- 16+ Years of Experience
- 50,000+ Young Professionals Trained
- 5,000+ Senior Professionals Trained
- Global Training & Consulting Exposure
- Trusted by Corporates & Institutions

Corporate Solutions (array — links to service pages):
- Report Automation
- Dashboards & Data Visualization
- Spreadsheet Consulting
- Process Automation
- Corporate Training
  *(App Development removed)*

Educational Solutions (array — links to service pages):
- Training & Certification
- Curriculum Development
- Academic Analytics Platforms
- Assessment Automation

Why KVJ Analytics:
- Strapline: Practical. Scalable. Industry-Focused.
- Body: We combine technology, analytics, and business understanding to deliver solutions that create measurable impact.

### Copy-paste prompt for Antigravity

```
Build the foundation and Home page for a fully-dynamic company website for "KVJ Analytics".

STACK (use exactly):
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with a small reusable design system (Container, Section, Button, Card, MetricBadge components)
- Sanity v3 headless CMS, Studio embedded at /studio
- Deploy target: Vercel. All secrets/analytics IDs via environment variables (.env.local.example provided).

PRINCIPLE: A non-programmer edits all content in Sanity Studio. Nothing on the Home page may be hard-coded — every string, metric, and list item comes from Sanity.

CREATE THESE SANITY SCHEMAS NOW:
1) siteSettings (singleton): companyName, tagline, logo(image), navItems[], footerColumns[], socialLinks[], contactInfo (email, phone, address), regionsServed[], global SEO defaults (metaTitle, metaDescription, ogImage), analytics IDs (gtm, ga4, clarity).
2) homePage (singleton):
   - hero: headline, subhead, intro (text), supportingLine (text), primaryCta {label, href}
   - keyHighlights: array of {label}
   - corporateSolutions: array of {title, href}
   - educationalSolutions: array of {title, href}
   - whyUs: { strapline, body }
   - seo object

BUILD THE GLOBAL SHELL:
- Header with logo + nav from siteSettings; Footer from siteSettings (columns, socials, contact). Both responsive with mobile menu.

BUILD THE HOME PAGE from homePage:
- Hero section (headline, subhead, intro, supporting line, CTA)
- Key Highlights metrics band (render keyHighlights as styled badges/cards)
- Two solutions blocks: "Corporate Solutions" and "Educational Solutions" as linked cards
- "Why KVJ Analytics" section (strapline + body)

SEED CONTENT (insert these exact values):
- companyName: KVJ Analytics
- tagline: Analytics • Automation • Training • Educational Technology
- regionsServed: India, UAE, Oman, USA, Europe
- hero.headline: Transforming Data Into Decisions
- hero.subhead: Analytics • Automation • Training • Educational Technology
- hero.intro: KVJ Analytics helps corporates and educational institutions automate operations, visualize data, improve decision-making, and build industry-ready talent.
- hero.supportingLine: 16+ years of expertise delivering analytics, automation, dashboards, training, and educational technology solutions across India, UAE, Oman, USA, and Europe.
- keyHighlights: ["16+ Years of Experience", "50,000+ Young Professionals Trained", "5,000+ Senior Professionals Trained", "Global Training & Consulting Exposure", "Trusted by Corporates & Institutions"]
- corporateSolutions: [Report Automation, Dashboards & Data Visualization, Spreadsheet Consulting, Process Automation, Corporate Training]
- educationalSolutions: [Training & Certification, Curriculum Development, Academic Analytics Platforms, Assessment Automation]
- whyUs.strapline: Practical. Scalable. Industry-Focused.
- whyUs.body: We combine technology, analytics, and business understanding to deliver solutions that create measurable impact.

QUALITY:
- TypeScript strict. Fully responsive. Accessible (semantic HTML, alt text from CMS, keyboard nav).
- Use ISR/on-demand revalidation so Sanity edits appear quickly.
- Provide .env.local.example with every variable documented.
- When done, summarize what was built and exactly how to run Studio + the site locally.
```

---

## STEP 2 — About Us Page

**Goal:** A fully dynamic About page driven by an `aboutPage` Sanity singleton.

### Content mapped to Sanity

**`aboutPage` (singleton)**

- Title: **About KVJ Analytics**
- Intro: KVJ Analytics is an analytics, automation, and training company with 16+ years of experience supporting corporates and educational institutions.
- Specializations (array — "We specialize in:"):
  - Report Automation
  - Dashboard Development
  - Data Visualization
  - Spreadsheet Consulting
  - Process Automation
  - Corporate Training
  - Educational Technology Solutions
- Reach line: Our services and training programs have reached clients across Kerala, India, UAE, Oman, USA, and Europe.
- Our Impact (array):
  - 50,000+ Young Professionals Trained
  - 5,000+ Senior Professionals Trained
  - Industry-Oriented Learning Ecosystem
  - Trusted Corporate & Academic Partnerships
- Vision:
  - Heading: Our Vision
  - Body: To build smarter organizations and industry-ready professionals through analytics, automation, and practical learning.

### Copy-paste prompt for Antigravity

```
Add a fully-dynamic "About Us" page to the KVJ Analytics site (same stack and principles as Step 1 — nothing hard-coded; all content from Sanity).

CREATE SANITY SCHEMA:
aboutPage (singleton):
  - title (string)
  - intro (text)
  - specializations: array of {label}
  - reachLine (text)
  - impact: array of {label}
  - vision: { heading, body }
  - seo object

BUILD /about FROM aboutPage:
  - Title + intro
  - "We specialize in:" specializations as a styled list/grid
  - Reach line
  - "Our Impact" as a metrics/badge band (reuse the Home highlights component)
  - "Our Vision" section (heading + body)
  Responsive + accessible. Wire /about into the header nav from siteSettings.

SEED CONTENT (exact values):
  - title: About KVJ Analytics
  - intro: KVJ Analytics is an analytics, automation, and training company with 16+ years of experience supporting corporates and educational institutions.
  - specializations: [Report Automation, Dashboard Development, Data Visualization, Spreadsheet Consulting, Process Automation, Corporate Training, Educational Technology Solutions]
  - reachLine: Our services and training programs have reached clients across Kerala, India, UAE, Oman, USA, and Europe.
  - impact: ["50,000+ Young Professionals Trained", "5,000+ Senior Professionals Trained", "Industry-Oriented Learning Ecosystem", "Trusted Corporate & Academic Partnerships"]
  - vision.heading: Our Vision
  - vision.body: To build smarter organizations and industry-ready professionals through analytics, automation, and practical learning.

When done, summarize and show how to verify /about and edit it in Studio.
```

---

## STEP 3 — Corporate Solutions (Services)

**Goal:** A Corporate Solutions landing page + reusable `service` documents (category = corporate) so the non-coder can add/edit/reorder services without code.

### Content mapped to Sanity

**`solutionsPage` (one per category — here: corporate)**
- Heading: Corporate Solutions
- Strapline: Smart Solutions for Modern Businesses
- Intro: We help organizations automate reporting, improve visibility, optimize workflows, and make faster business decisions.

**`service` documents (category: corporate)** — `{ title, slug, category, shortDescription, order }`
1. Report Automation — Automate MIS, financial, operational, and management reports with speed and accuracy.
2. Data Visualization — Convert complex data into meaningful visual insights and interactive reports.
3. Spreadsheet Consulting — Advanced Excel systems, automation, validation, and optimization solutions.
4. Dashboard Development — Real-time dashboards for KPI tracking, performance monitoring, and business intelligence.
5. Process Automation — Reduce manual work through intelligent workflow and process automation.
6. Corporate Training — Hands-on training in Excel, Power BI, analytics, dashboards, and automation tools.

> App Development **excluded** (per scope). It appears in source content — confirm if it should be kept.

### Copy-paste prompt for Antigravity

```
Add the "Corporate Solutions" section to the KVJ Analytics site (same stack/principles — all content from Sanity).

CREATE SANITY SCHEMAS:
1) service (document, reusable across categories):
   - title, slug, category (string enum: "corporate" | "educational" | "training"),
   - shortDescription (text), icon (image optional), body (Portable Text, optional for detail page),
   - order (number), seo object
2) solutionsPage (document, one per category):
   - category (enum as above), heading, strapline, intro (text), seo

BUILD:
  - /corporate landing page from solutionsPage(category=corporate): heading, strapline, intro,
    then a grid of service cards where category=="corporate" (sorted by order), each card = title + shortDescription.
  - Cards link to /corporate/[slug] detail pages rendered from the service document.
  - Wire /corporate into header nav.

SEED solutionsPage(corporate):
  - heading: Corporate Solutions
  - strapline: Smart Solutions for Modern Businesses
  - intro: We help organizations automate reporting, improve visibility, optimize workflows, and make faster business decisions.
SEED service docs (category=corporate):
  - Report Automation | Automate MIS, financial, operational, and management reports with speed and accuracy.
  - Data Visualization | Convert complex data into meaningful visual insights and interactive reports.
  - Spreadsheet Consulting | Advanced Excel systems, automation, validation, and optimization solutions.
  - Dashboard Development | Real-time dashboards for KPI tracking, performance monitoring, and business intelligence.
  - Process Automation | Reduce manual work through intelligent workflow and process automation.
  - Corporate Training | Hands-on training in Excel, Power BI, analytics, dashboards, and automation tools.

When done, summarize and show how to add a new service in Studio.
```

---

## STEP 4 — Educational Solutions (Services)

**Goal:** Reuse the `service` + `solutionsPage` schemas from Step 3 with category = educational.

### Content mapped to Sanity

**`solutionsPage` (category: educational)**
- Heading: Educational Solutions
- Strapline: Building Industry-Ready Learning Systems
- Intro: KVJ Analytics helps institutions bridge the gap between academics and industry through practical training, automation, and analytics platforms.

**`service` documents (category: educational)**
1. Training Programs — Practical programs in Excel, Power BI, Data Analytics, Financial Analytics, and Business Intelligence.
2. Certification Programs — Industry-oriented certifications focused on employability and practical skills.
3. Curriculum Development — Modern, analytics-driven curriculum aligned with industry expectations.
4. Academic Analytics Solutions — Technology platforms for reporting, evaluation, analytics, and performance tracking.

### Copy-paste prompt for Antigravity

```
Add the "Educational Solutions" section (reuse the service + solutionsPage schemas from the Corporate step).

BUILD:
  - /education landing page from solutionsPage(category=educational): heading, strapline, intro,
    then a grid of service cards where category=="educational" (sorted by order).
  - Cards link to /education/[slug] detail pages from the service document.
  - Wire /education into header nav.

SEED solutionsPage(educational):
  - heading: Educational Solutions
  - strapline: Building Industry-Ready Learning Systems
  - intro: KVJ Analytics helps institutions bridge the gap between academics and industry through practical training, automation, and analytics platforms.
SEED service docs (category=educational):
  - Training Programs | Practical programs in Excel, Power BI, Data Analytics, Financial Analytics, and Business Intelligence.
  - Certification Programs | Industry-oriented certifications focused on employability and practical skills.
  - Curriculum Development | Modern, analytics-driven curriculum aligned with industry expectations.
  - Academic Analytics Solutions | Technology platforms for reporting, evaluation, analytics, and performance tracking.

When done, summarize and show how to verify /education.
```

---

## STEP 5 — Products (Grade Scope, Protrix)

**`productsPage` (singleton):** heading "Our Products".
**`product` documents** — `{ name, slug, tagline, description, keyFeatures[], media, order, seo }`

1. **Grade Scope** — *Educational Reporting & Analytics Platform.* Grade Scope automates student progress reports, placement reports, training reports, and institutional analytics.
   Features: Automated Reporting · Student Progress Tracking · Placement Analytics · Performance Monitoring · Centralized Data Management
2. **Protrix** — *Assignment & Assessment Automation Platform.* Protrix helps teachers generate, manage, and evaluate practical assignments while helping students practice and improve skills.
   Features: Assignment Automation · Automated Evaluation · Excel-Based Learning · Practical Skill Assessment · Time-Saving Evaluation System

```
Add the "Our Products" section to the KVJ Analytics site (same stack/principles).

CREATE SCHEMAS:
- productsPage (singleton): heading, intro(optional), seo
- product (document): name, slug, tagline, description(text), keyFeatures: array of {label}, media(image), order, seo

BUILD:
- /products landing from productsPage + grid of product cards (name, tagline, description, feature list).
- /products/[slug] detail pages from product docs. Wire /products into nav.

SEED:
- product Grade Scope: tagline "Educational Reporting & Analytics Platform";
  description "Grade Scope automates student progress reports, placement reports, training reports, and institutional analytics.";
  keyFeatures: [Automated Reporting, Student Progress Tracking, Placement Analytics, Performance Monitoring, Centralized Data Management]
- product Protrix: tagline "Assignment & Assessment Automation Platform";
  description "Protrix helps teachers generate, manage, and evaluate practical assignments while helping students practice and improve skills.";
  keyFeatures: [Assignment Automation, Automated Evaluation, Excel-Based Learning, Practical Skill Assessment, Time-Saving Evaluation System]
```

---

## STEP 6 — Training & Skill Development

**`trainingPage` (singleton):** heading, strapline, intro, trainingAreas[], approach[].
Detail pages per area reuse the `service` type (category = training).

- Heading: Training & Skill Development
- Strapline: Practical Learning With Industry Relevance
- Intro: Our programs are designed to build real-world skills through hands-on learning, live datasets, and practical assignments.
- Training Areas: Advanced Excel · Power BI · Data Analytics · Dashboard Development · Financial Analytics · Automation Tools · Business Intelligence
- Our Approach: Hands-On Learning · Real Business Scenarios · Industry-Oriented Curriculum · Assignment-Based Practice · Placement-Focused Skill Development *(confirm placement wording)*

```
Add the "Training & Skill Development" section (same stack/principles).

CREATE SCHEMA:
- trainingPage (singleton): heading, strapline, intro(text), trainingAreas: array of {title, slug}, approach: array of {label}, seo
(Reuse the `service` type with category="training" if/when each area needs a detail page.)

BUILD:
- /training landing from trainingPage: heading, strapline, intro, a grid of training-area cards, and an "Our Approach" list. Wire into nav.
- Each training-area card links to /training/[slug] (detail content can be filled later).

SEED trainingPage:
- heading: Training & Skill Development
- strapline: Practical Learning With Industry Relevance
- intro: Our programs are designed to build real-world skills through hands-on learning, live datasets, and practical assignments.
- trainingAreas: [Advanced Excel, Power BI, Data Analytics, Dashboard Development, Financial Analytics, Automation Tools, Business Intelligence]
- approach: [Hands-On Learning, Real Business Scenarios, Industry-Oriented Curriculum, Assignment-Based Practice, Placement-Focused Skill Development]
```

---

## STEP 7 — Clients & Impact

**`impactPage` (singleton):** heading, intro, highlights[], industriesServed[].

- Heading: Our Impact
- Intro: For over 16 years, KVJ Analytics has delivered analytics, automation, and training solutions to corporates and educational institutions.
- Highlights: 50,000+ Young Professionals Trained · 5,000+ Senior Professionals Trained · Clients Across India & International Markets · Services Delivered in UAE, Oman, USA & Europe
- Industries Served: Education · Finance · Retail · HR · Logistics · Operations · Consulting

```
Add the "Our Impact" page (same stack/principles).

CREATE SCHEMA:
- impactPage (singleton): heading, intro(text), highlights: array of {label}, industriesServed: array of {label}, seo

BUILD /impact from impactPage: heading + intro, highlights as a metrics band (reuse Home highlights component), industries as a tag/card grid. Wire into nav.

SEED:
- heading: Our Impact
- intro: For over 16 years, KVJ Analytics has delivered analytics, automation, and training solutions to corporates and educational institutions.
- highlights: ["50,000+ Young Professionals Trained", "5,000+ Senior Professionals Trained", "Clients Across India & International Markets", "Services Delivered in UAE, Oman, USA & Europe"]
- industriesServed: [Education, Finance, Retail, HR, Logistics, Operations, Consulting]
```

---

## STEP 8 — Contact (page + working form → leads)

**`contactPage` (singleton):** heading, strapline, intro, contactInfo, inquiryAreas[], ctas[].
**Form** posts to an API route → inserts into Supabase `leads` + sends Resend notification. (This is where the Supabase + Resend setup from the master plan kicks in.)

- Heading: Contact KVJ Analytics
- Strapline: Let's Build Smarter Systems Together
- Intro: Whether you are a corporate organization looking for automation and analytics solutions or an educational institution seeking industry-oriented learning platforms, KVJ Analytics is ready to support your transformation journey.
- Inquiry Areas: Corporate Consulting · Dashboard Development · Process Automation · Corporate Training · Educational Partnerships · Curriculum Development · Product Demonstrations · Institutional Collaborations
- Form Fields: Name · Organization · Email · Phone Number · Service Interested In (dropdown = inquiry areas) · Message
- CTAs: Request a Demo · Schedule a Meeting · Contact Our Team

```
Add the "Contact" page with a WORKING form (same stack/principles). Introduce Supabase + Resend now.

SETUP:
- Supabase: create `leads` table (name, organization, email, phone, service_interest, message, source_page, status default 'new', created_at). Enable RLS; service-role insert from server only.
- Resend for notification email to the team on each submission. All keys via env vars.

CREATE SANITY SCHEMA:
- contactPage (singleton): heading, strapline, intro(text), inquiryAreas: array of {label}, ctas: array of {label, href}, seo
(Phone/email/address come from siteSettings.contactInfo.)

BUILD /contact:
- Heading, strapline, intro, contact info from siteSettings.
- Form fields: Name, Organization, Email, Phone Number, Service Interested In (select populated from inquiryAreas), Message. Client + server validation.
- POST to /api/contact: insert into Supabase `leads`, send Resend notification, return success/error states.
- Render CTA buttons (Request a Demo, Schedule a Meeting, Contact Our Team).
- Build a simple protected /admin/leads page (auth via env password or Supabase admin) to list submissions and update status.

SEED contactPage:
- heading: Contact KVJ Analytics
- strapline: Let's Build Smarter Systems Together
- intro: Whether you are a corporate organization looking for automation and analytics solutions or an educational institution seeking industry-oriented learning platforms, KVJ Analytics is ready to support your transformation journey.
- inquiryAreas: [Corporate Consulting, Dashboard Development, Process Automation, Corporate Training, Educational Partnerships, Curriculum Development, Product Demonstrations, Institutional Collaborations]
- ctas: [Request a Demo, Schedule a Meeting, Contact Our Team]
```

---

## CONTACT INFO / siteSettings content (feeds Step 1, footer & /contact)

Add a `contactInfo` object to `siteSettings`:
- **Email:** info@kvjanalytics.in
- **Phone:** 9961813730 · 0484-4059310 · 7902661012
- **Address:** 3rd Floor, Lalan Towers, Banerji Road, High Court Jn., Cochin-682 031, Ernakulam, Kerala, India
- **GST No.:** 32BIDPK3118B1Z2

```
Extend siteSettings.contactInfo:
  - email: info@kvjanalytics.in
  - phones: ["9961813730", "0484-4059310", "7902661012"]
  - address: "3rd Floor, Lalan Towers, Banerji Road, High Court Jn., Cochin-682 031, Ernakulam, Kerala, India"
  - gstNumber: "32BIDPK3118B1Z2"
Render email/phones/address in the Footer and on /contact (icon + label style, like the brand reference). Show GST No. in the footer bottom bar.
```

---

## FOOTER / siteSettings content (feeds Step 1)

Add these to the `siteSettings` singleton and render in the global Footer:

- **Company description:** KVJ Analytics is a leading analytics, automation, and training organization with 16+ years of experience in delivering business-focused technology solutions and industry-oriented learning systems.
- **Footer tagline:** Empowering Businesses and Institutions Through Analytics, Automation & Practical Learning.
- **Footer column — Corporate:** Report Automation · Dashboard Development · Data Visualization · Process Automation · Corporate Training
- **Footer column — Education:** Certification Programs · Curriculum Development · Grade Scope · Protrix · Skill Development Programs
- **Quick Links:** Home · About Us · Corporate Solutions · Educational Solutions · Products · Training · Contact

```
Extend siteSettings (Step 1) with footer fields and render them in the Footer:
- footerDescription (text)
- footerTagline (text)
- footerColumns: array of { heading, links: array of {label, href} }
- quickLinks: array of {label, href}

SEED:
- footerDescription: KVJ Analytics is a leading analytics, automation, and training organization with 16+ years of experience in delivering business-focused technology solutions and industry-oriented learning systems.
- footerTagline: Empowering Businesses and Institutions Through Analytics, Automation & Practical Learning.
- footerColumns:
   Corporate: [Report Automation, Dashboard Development, Data Visualization, Process Automation, Corporate Training]
   Education: [Certification Programs, Curriculum Development, Grade Scope, Protrix, Skill Development Programs]
- quickLinks: [Home, About Us, Corporate Solutions, Educational Solutions, Products, Training, Contact]
```

---

## STEP 9 — Blog / Insights

```
Add a dynamic Blog. Schemas: post (title, slug, author ref, category ref, coverImage, body Portable Text, seo, publishedAt, featured), author, category.
Build /blog (list, featured), /blog/[slug], /blog/category/[slug], /blog/author/[slug]. Add RSS + sitemap entries + per-post SEO.
Ensure a non-programmer can write and publish a post entirely in Sanity Studio. Seed 1 example post.
```

---

## STEP 10 — Training Platform: Courses, Materials, Mock Tests

**Principle:** Course content (materials + test questions) is edited by a non-programmer in **Sanity Studio**. Enrollments, attempts, and scores live in **Supabase**. Gated content is served only to enrolled users via authenticated server routes; **answer keys never reach the client**.

**Sanity schemas**
- `course`: title, slug, segment ("corporate" | "college"), summary, syllabus (Portable Text), priceINR, isPaid (bool), thumbnail, order, seo
- `material`: course (ref), title, type ("pdf"|"video"|"link"|"richtext"), file/url/body, order, isPreview (bool)
- `mockTest`: course (ref), title, durationMins, passMark, questions[] of { stem, options[], correctIndex, marks }

**Supabase tables**
- `profiles` (role: admin|student), `enrollments` (user, course, method, status, created_at), `test_attempts` (user, test, answers jsonb, score, started_at, submitted_at)

```
Build the Training learning platform.

SANITY: create course, material, mockTest schemas (fields as specified). Seed 1 course with 2 materials (1 preview, 1 gated) and 1 mock test with 3 questions.

SUPABASE: create profiles (with role), enrollments, test_attempts tables; enable RLS (students read only their own rows; admins read all).

PUBLIC: /training catalog + /training/[course] detail (bold-statement style, syllabus, price or "College Program", enroll CTA). Preview materials visible; gated materials locked.

GATED DELIVERY: serve gated materials and mock tests ONLY through authenticated server routes that check enrollment. For files, use signed/expiring URLs. For mock tests, send questions WITHOUT correctIndex; score on the server; store result in test_attempts. Timed UI with auto-submit; show results + attempt history.

STUDENT DASHBOARD (/account): my courses, materials, tests, results.
ADMIN (/admin): manage enrollments, view attempts/results, export CSV. (Course content itself is edited in Sanity Studio.)
Confirm a non-coder can add a course, material, and test question in Studio.
```

---

## STEP 11 — Enrollment & Payments (two methods)

**Method 1 — Paid (Razorpay).** Method 2 — College rotating code (no payment).

```
Implement two enrollment methods.

METHOD 1 — PAID (Razorpay, INR/GST):
- For isPaid courses, launch Razorpay Checkout. Create order server-side; on payment, VERIFY the webhook signature server-side before granting access.
- Record order + enrollment in Supabase only after verified payment. Send a GST receipt email via Resend. Failed/cancelled payment grants nothing.

METHOD 2 — COLLEGE CODE (no payment):
- Add Supabase `batches` (college, course ref, totp_secret, valid_from, valid_to, active).
- Generate a rotating ~30-second code per batch (TOTP-style). Admin sees the current code for a batch in /admin.
- Student join flow at /training/[course]/join: enter the CURRENT code (verified server-side, within the time window) THEN submit Name, Phone, Organization (with consent checkbox) → create enrollment + lightweight student profile → grant access to that course only.
- Rate-limit and lock repeated wrong code attempts; add CAPTCHA.

Both methods converge on a Supabase `enrollment` that unlocks the course's gated materials and tests.
```

---

## STEP 12 — Security Hardening & Compliance

```
Apply and verify security across the platform:
- Role-based access control (admin vs student) enforced on every server route; no client-trust.
- Supabase RLS on profiles, enrollments, test_attempts, leads, orders, batches.
- Gated files via signed expiring URLs; mock-test answer keys never sent to client; scoring server-side only.
- Razorpay webhook signature verification; never trust client-sent amount or success flags.
- Rotating enrollment code: server-side verification, short validity, rate limiting, lockout, CAPTCHA on public forms.
- Student PII (name/phone/org): consent capture, minimal data, encrypted at rest, linked privacy policy.
- Security headers (CSP, HSTS), HTTP-only secure cookies, CSRF protection, server-side input validation on all forms/APIs.
- Audit logging for admin actions and enrollments. Secrets only in env vars with least-privilege keys.
Produce a short SECURITY.md describing the controls and how to verify them.
```

---

## STEP 13 — Premium Design System (light) → see `DESIGN_SYSTEM.md`
Apply the "Azure & Teal" light theme + components in Phase 0 (paste the prompt from DESIGN_SYSTEM.md §7).

## STEP 14 — Marketing / CRO / SEO / Lead-gen → see `MARKETING_GROWTH_PLAN.md`
High-conversion CTAs, lead magnets, capture+nurture, SEO schema, analytics events (paste the prompt from MARKETING_GROWTH_PLAN.md §6).

---

## STILL OPEN (send when ready)
- **Logo file** (provide your logo). Colors/fonts are set in `DESIGN_SYSTEM.md` but tunable.
- **Legal**: Privacy Policy, Terms content (or use placeholders).
- **Confirm:** Payment gateway = Razorpay (India/GST). Placement wording on Training page (keep/drop). App Development stays excluded.
```
