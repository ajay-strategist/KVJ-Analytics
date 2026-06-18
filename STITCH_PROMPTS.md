# Google Stitch Prompts — KVJ Analytics Website

Stitch generates **one screen per prompt**, guided by a global style. Use it like this:
1. Set the **Style Block** below as your project/theme (or paste it at the top of each prompt).
2. Generate each page using its prompt (web / desktop).
3. Refine with short follow-ups ("make the hero taller", "add icons to the cards", "tighten spacing").
4. Export designs (Figma / code) and hand to your developer or Antigravity.

> Keep theme = LIGHT. Device = Desktop web (also generate mobile variants for Home + Contact).

---

## ⭐ STYLE BLOCK (paste into every prompt or set as the global theme)

```
Design a premium, modern, professional website for "KVJ Analytics", an analytics, automation, training and educational-technology company (16+ years). Enterprise-SaaS quality.
Theme: LIGHT only (white #FFFFFF and very light gray #F8FAFC backgrounds — never dark).
Colors: primary royal blue #1D4ED8; teal #0D9488 (education accent); warm amber #F59E0B for call-to-action buttons (with dark text); deep navy #0B1F3A for the footer; text ink #0F172A, secondary slate #475569; hairline borders #E2E8F0. Signature blue→teal gradient (135°, #1D4ED8 to #0D9488) for hero/accent bands.
Typography: headings in a bold geometric sans-serif like "Sora" (heavy, tight); body in "Inter". Large bold headlines, short punchy copy, small uppercase eyebrow labels above section titles.
Style: generous whitespace, strong visual hierarchy, soft rounded cards (16px) with subtle shadows, line-style icons on every feature, animated-looking metric counters, gradient accent shapes, hover lift. Two audience segments visually distinct: Corporate = blue, Education = teal. Clean, trustworthy, premium.
```

---

## 1. Home Page
```
[STYLE BLOCK]
Generate the HOME page (desktop).
- Sticky top navbar: logo left; links Home, About, Corporate Solutions, Educational Solutions, Products, Training, Contact; an amber "Book a Free Consultation" button right.
- Hero on a subtle blue→teal gradient band: small eyebrow "ANALYTICS • AUTOMATION • TRAINING", a huge bold headline "Transforming Data Into Decisions", one short supporting sentence, an amber primary CTA "Book a Free Consultation" and a blue outline "Explore Solutions"; on the right a clean analytics dashboard / data-visualization illustration.
- Metrics band with 5 large animated counters: 16+ Years of Experience, 50,000+ Young Professionals Trained, 5,000+ Senior Professionals Trained, Global Training & Consulting, Trusted by Corporates & Institutions.
- Two large side-by-side SEGMENT cards: "Corporate Solutions" (blue accent, icon) and "Educational Solutions" (teal accent, icon), each with a short line and arrow.
- A grid of corporate service cards (Report Automation, Dashboards & Data Visualization, Spreadsheet Consulting, Process Automation, Corporate Training) with line icons.
- "Why KVJ Analytics" section: bold statement "Practical. Scalable. Industry-Focused." with a short paragraph and 3 supporting points.
- Logo strip / regions served (India, UAE, Oman, USA, Europe), then a closing gradient CTA band.
- Footer on navy #0B1F3A: company description, columns (Corporate, Education, Quick Links), contact info, GST number, social icons.
```

## 2. About Page
```
[STYLE BLOCK]
Generate the ABOUT page (desktop).
- Hero: eyebrow "ABOUT US", bold headline "About KVJ Analytics", short intro paragraph.
- "We specialize in" section: a clean grid of pill/cards — Report Automation, Dashboard Development, Data Visualization, Spreadsheet Consulting, Process Automation, Corporate Training, Educational Technology Solutions (each with an icon).
- A line about global reach (Kerala, India, UAE, Oman, USA, Europe) shown with a subtle world-map or region chips.
- "Our Impact" metrics band: 50,000+ Young Professionals Trained, 5,000+ Senior Professionals Trained, Industry-Oriented Learning Ecosystem, Trusted Corporate & Academic Partnerships.
- "Our Vision" feature section on a gradient accent: bold statement + short vision paragraph.
- Closing CTA band + navy footer.
```

## 3. Corporate Solutions Page
```
[STYLE BLOCK]
Generate the CORPORATE SOLUTIONS page (desktop), blue-accented.
- Hero: eyebrow "CORPORATE", bold statement "Smarter Reporting. Faster Decisions.", short line "We help organizations automate reporting, improve visibility, optimize workflows, and make faster decisions.", amber CTA "Book a Free Consultation".
- Alternating image/text rows for each service (icon + eyebrow + bold title + 1-line description + "Learn More"): Report Automation, Data Visualization, Spreadsheet Consulting, Dashboard Development, Process Automation, Corporate Training.
- A trust band (client logos + a testimonial), then a closing gradient CTA "Ready to automate your reporting?" + navy footer.
```

## 4. Educational Solutions Page
```
[STYLE BLOCK]
Generate the EDUCATIONAL SOLUTIONS page (desktop), teal-accented.
- Hero: eyebrow "EDUCATION", bold statement "Industry-Ready Talent. Built Faster.", short line "We help institutions bridge academics and industry through practical training, automation, and analytics platforms.", teal/amber CTA "Partner With Us".
- Service cards/rows (icons): Training Programs, Certification Programs, Curriculum Development, Academic Analytics Solutions — each with a one-line description.
- A "for institutions" highlight strip, testimonial, closing CTA band + navy footer.
```

## 5. Products Page (Grade Scope & Protrix)
```
[STYLE BLOCK]
Generate the PRODUCTS page (desktop).
- Hero: eyebrow "OUR PRODUCTS", bold headline, short line.
- Two large product feature blocks (alternating image/text, screenshot mockups):
  GRADE SCOPE — "Educational Reporting & Analytics Platform", short description, feature chips: Automated Reporting, Student Progress Tracking, Placement Analytics, Performance Monitoring, Centralized Data Management; "Request a Demo" CTA.
  PROTRIX — "Assignment & Assessment Automation Platform", short description, feature chips: Assignment Automation, Automated Evaluation, Excel-Based Learning, Practical Skill Assessment, Time-Saving Evaluation; "Request a Demo" CTA.
- Closing CTA band + navy footer.
```

## 6. Training Catalog Page
```
[STYLE BLOCK]
Generate the TRAINING page (desktop).
- Hero: eyebrow "TRAINING & SKILL DEVELOPMENT", bold statement "Real Skills. Real Data. Real Results.", short line "Hands-on learning with live datasets and practical assignments.", amber CTA "Enroll Now" + ghost "Try a Free Mock Test".
- A responsive grid of course cards (icon, title, short line, "Enroll" + price or "College Program" tag): Advanced Excel, Power BI, Data Analytics, Dashboard Development, Financial Analytics, Automation Tools, Business Intelligence.
- "Our Approach" numbered cards (01–05): Hands-On Learning, Real Business Scenarios, Industry-Oriented Curriculum, Assignment-Based Practice, Placement-Focused Skill Development.
- Closing CTA band + navy footer.
```

## 7. Course Detail + Enrollment Page
```
[STYLE BLOCK]
Generate a COURSE DETAIL page (desktop), e.g. "Power BI Mastery".
- Header with course title, short tagline, key facts (duration, level, mode), and a prominent enrollment card on the right showing price and an amber "Enroll & Pay" button, plus a secondary "Join with College Code" link.
- Tabs/sections: Overview, Syllabus (module list), What you'll learn (checklist), Materials preview (locked items show a lock icon), Mock test preview.
- A modal/section for "Join with College Code": a single short code input (with a 30-second timer hint) and fields Name, Phone, Organization, plus a consent checkbox and "Join Course" button.
- Trust strip + footer.
```

## 8. Student Dashboard
```
[STYLE BLOCK]
Generate a STUDENT DASHBOARD (desktop), clean app UI (still light/premium).
- Left sidebar: My Courses, Materials, Mock Tests, Results, Profile.
- Main area: welcome header, "Continue learning" course cards with progress bars, a list of available materials (pdf/video icons), upcoming mock tests with a "Start Test" button, and a results summary with scores.
- Keep the Azure & Teal theme, cards with soft shadows, amber primary actions.
```

## 9. Mock Test Screen
```
[STYLE BLOCK]
Generate a TIMED MOCK TEST screen (desktop).
- Top bar: test title, a countdown timer (prominent), question progress "Q 4 of 20".
- Main: one multiple-choice question with 4 selectable option cards.
- Right/side: a question navigator grid (answered/unanswered states).
- Bottom: Previous / Next buttons and an amber "Submit Test" button. Clean, focused, low-distraction, light theme.
- Also generate the RESULTS screen: big score, pass/fail badge, per-section breakdown, "Review Answers" button.
```

## 10. Clients & Impact Page
```
[STYLE BLOCK]
Generate the CLIENTS & IMPACT page (desktop).
- Hero: eyebrow "OUR IMPACT", bold statement "16 Years. 50,000+ Trained. Global Reach.", short intro.
- Big animated metrics band: 50,000+ Young Professionals Trained, 5,000+ Senior Professionals Trained, Clients Across India & International Markets, Services in UAE, Oman, USA & Europe.
- "Industries Served" icon grid: Education, Finance, Retail, HR, Logistics, Operations, Consulting.
- Client logo wall + testimonials carousel, closing CTA band + navy footer.
```

## 11. Contact Page
```
[STYLE BLOCK]
Generate the CONTACT page (desktop AND mobile).
- Hero: eyebrow "CONTACT", bold statement "Let's Build Smarter Systems Together.", short intro.
- Two-column layout: LEFT a contact form (Name, Organization, Email, Phone, Service Interested In dropdown, Message) with an amber "Send Message" button; RIGHT a contact info card on a blue→teal gradient with email info@kvjanalytics.in, phones 9961813730 / 0484-4059310 / 7902661012, address "3rd Floor, Lalan Towers, Banerji Road, High Court Jn., Cochin-682 031, Kerala, India", and a map embed.
- Three CTA chips: Request a Demo, Schedule a Meeting, Contact Our Team.
- Footer on navy with GST No. 32BIDPK3118B1Z2.
```

## 12. Blog / Insights Page
```
[STYLE BLOCK]
Generate the BLOG (Insights) page (desktop): a featured post hero, a responsive grid of article cards (cover image, category tag, title, excerpt, author, date), category filter chips, and pagination. Plus generate a single ARTICLE page: large title, meta row, cover image, readable article body with a sticky table of contents and a related-posts + newsletter signup at the end. Light, premium, Azure & Teal.
```

## 13. Admin Dashboard (staff)
```
[STYLE BLOCK]
Generate an ADMIN DASHBOARD (desktop), clean light app UI.
- Sidebar: Leads, Enrollments, Payments, Batches & Codes, Students, Test Results, Content.
- Overview cards: total leads, new this week, enrollments, revenue.
- A leads table (name, source, interest, status, date) with status pills and export button.
- A "Batches" view showing a course, a college, and a large rotating access code with a 30-second countdown + "Generate New Batch" button.
- Keep it professional and on-theme.
```

---

### Tips for better Stitch output
- Generate the Home page first, lock the style you like, then reuse it for consistency.
- If colors drift, restate the hex values in a follow-up ("use amber #F59E0B for all primary buttons").
- Ask for both desktop and mobile for key pages.
- Export to Figma/code and pass to your developer (or feed the exported markup back to Antigravity to implement).
