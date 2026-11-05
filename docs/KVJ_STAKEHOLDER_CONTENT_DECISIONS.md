# KVJ Analytics — Stakeholder Content & Brand Decision Register

**Document:** `docs/KVJ_STAKEHOLDER_CONTENT_DECISIONS.md`  
**Milestone:** Phase 12.2 — Authority, Trust & Content Polish  
**Date:** November 5, 2026  
**Author:** Antigravity Principal Systems Architect & Engineering Lead  
**Target Audience:** KVJ Analytics Executive Management, Product Owners, Marketing & Legal Stakeholders  
**Status:** Open for Stakeholder Review & Sign-Off  

---

## 1. Executive Summary

During the Phase 12 Quality, Authority, and Trust Audit of the KVJ Analytics corporate website and LMS platform, several strategic product branding, content authenticity, and catalog classification decisions were identified that require formal executive stakeholder guidance.

To maintain uncompromising ethical standards and adhere to repository engineering rules, **no client testimonials, quantitative metrics, unverified URLs, or unconfirmed product architectures have been fabricated.**

This Decision Register provides executive stakeholders with clear background analysis, technical impacts, and actionable decision frameworks for each open item.

---

## 2. Decision Matrix Overview

| Ref # | Domain | Open Item | Current Repository Implementation | Stakeholder Action Required | Priority |
|:---:|:---|:---|:---|:---|:---:|
| **DEC-01** | Product Branding | **Protrix vs. Proctrix** | Display: "Protrix" / Route: `/products/protrix` | Confirm official product spelling and trademark. | **P1 (High)** |
| **DEC-02** | Product Catalog | **BeInTrack Inclusion** | Not present in codebase or database (0 references). | Clarify whether BeInTrack is active; provide brief if yes. | **P2 (Medium)** |
| **DEC-03** | Product Catalog | **The Mentor Classification** | Present as One-to-One Training (`/training/one-to-one`). | Confirm whether this is a service or standalone SaaS platform. | **P2 (Medium)** |
| **DEC-04** | Trust & Authority | **Authentic Case Studies** | Success Stories section hidden (`items: []`). | Provide 2–4 verified, non-confidential client outcomes. | **P1 (High)** |
| **DEC-05** | External Links | **Official Social Profiles** | Generic homepages removed; `socialLinks: []`. | Provide verified company profile URLs for social channels. | **P3 (Low)** |
| **DEC-06** | Commercial Copy | **Quantitative ROI Claims** | Qualitative ROI copy applied across services. | Approve metrics or supply verifiable audit figures. | **P2 (Medium)** |

---

## 3. Detailed Decision Briefs

### DEC-01: Product Branding — Protrix vs. Proctrix

#### Background & Analysis
- **Current State:** The codebase, routing table, CMS schema, and navigation define the product as **Protrix** (`slug: "protrix"`, title: "Protrix", tagline: "Assignment & Assessment Automation Platform").
- **Identified Discrepancy:** Certain historical project specifications and stakeholder briefs reference **Proctrix**, suggesting an automated proctoring or online exam surveillance capability. However, the existing implementation focuses strictly on automated assignment distribution, Excel/Google Sheets workflow evaluation, and grading assistance.
- **Brand Identity Consideration:**
  - If **Protrix** is the intended brand name, it represents *Practice + Matrix / Assessment Protocol*.
  - If **Proctrix** is the intended brand name, it implies *Proctoring + Examination Monitoring*.

#### Technical & SEO Impact
- Changing the slug from `/products/protrix` to `/products/proctrix` requires:
  1. Setting up an HTTP 301 permanent redirect in `next.config.js` or Next.js middleware.
  2. Updating database references in `cms_products` table and static fallback constants.
  3. Re-indexing Google Search Console canonical paths.
  4. Updating internal navigation anchors in `Header.tsx`, `Footer.tsx`, and `FALLBACK_PRODUCTS`.

#### Stakeholder Options
- **Option A (Recommended):** Retain **Protrix** for the assignment evaluation platform. If proctoring is developed in the future, introduce **Proctrix** as a distinct, specialized product module.
- **Option B:** Rebrand entirely to **Proctrix**. Execute 301 redirects from `/products/protrix` to `/products/proctrix`, update metadata, and reposition copy around assessment monitoring and evaluation.

---

### DEC-02: Digital Product Catalog — BeInTrack Status

#### Background & Analysis
- **Current State:** A thorough audit across all git commit trees, legacy migration files, and documentation revealed **zero occurrences of "BeInTrack"** in the repository.
- **Current Product Lineup:** The live website actively features:
  1. **GradeScope** (`/products/grade-scope`) — Institutional academic grading, performance analytics, and placement report automation.
  2. **Protrix** (`/products/protrix`) — Assignment automation, automated evaluation, and practical Excel skill assessment.

#### Technical Impact
- If BeInTrack is an existing internal tool or an upcoming SaaS product, adding it to the public website requires:
  1. A dedicated slug `/products/bein-track`.
  2. Feature bullets, target audience definitions (e.g., student internship tracking, attendance, project milestone tracking).
  3. Structured metadata, JSON-LD Product schema, and Open Graph card.
  4. Product screenshot or interactive preview component.

#### Stakeholder Options
- **Option A (Recommended):** Keep the public product catalog focused on **GradeScope** and **Protrix** until BeInTrack has completed commercial discovery, UX design, and functional staging validation.
- **Option B:** Provide a 1-page commercial product brief and authorize the creation of a "Coming Soon" or pre-release product page for BeInTrack.

---

### DEC-03: Digital Product Catalog — The Mentor Classification

#### Background & Analysis
- **Current State:** The repository contains a specialized service page at `/training/one-to-one` entitled **"One-to-One Mentorship"** (Personalized guidance with dedicated senior analytics mentors).
- **Identified Discrepancy:** Stakeholder requests have occasionally referenced "The Mentor" alongside GradeScope and Proctrix as a digital software product.
- **Assessment:**
  - Currently, "The Mentor" operates as a high-touch pedagogical *service* (live mentor sessions, custom portfolio reviews, interview preparation) rather than a self-service multi-tenant *software product*.

#### Stakeholder Options
- **Option A (Recommended):** Maintain "One-to-One Mentorship" under the **Training** vertical (`/training/one-to-one`), positioning it as an executive career and corporate upskilling service.
- **Option B:** Brand the service as **"The Mentor by KVJ Analytics"** while keeping it under the Training vertical.
- **Option C:** If a software portal (e.g., an automated student-mentor matching platform or LMS portal) is planned under this brand, authorize a distinct product specification.

---

### DEC-04: Authentic Success Stories & Case Studies

#### Background & Analysis
- **Current State:** The homepage `FALLBACK_HOME_PAGE.successStories` contains `items: []`. The UI component `src/components/v3/home/SuccessStories.tsx` cleanly self-hides when items are empty (`{successStories?.items?.length ? <SuccessStories ... /> : null}`).
- **Ethical & Regulatory Mandate:** Per strict engineering standards and advertising standards, the engineering team has **refused to invent fictional client names, fabricated ROI percentages, or unverified testimonials**.
- **Database Status:** Legacy database seeds contained a placeholder entry for "Apex Solutions" with generic text, which is inappropriate for a credible production corporate website.

#### Stakeholder Action Required
To enable the high-conversion Success Stories / Case Studies section on the Homepage, please provide **2 to 4 genuine, non-confidential project summaries** adhering to this template:

```markdown
### Case Study Template for Stakeholder Submission:
1. Client Industry / Vertical: (e.g., Leading Autonomous Engineering College, Ernakulam / Regional Retail Chain, UAE)
   *(Note: Client name can be anonymized if protected by Non-Disclosure Agreement)*
2. Initial Operational Challenge: (e.g., Manual generation of NAAC accreditation reports taking 120+ faculty hours per semester across 8 departments)
3. KVJ Analytics Solution Delivered: (e.g., End-to-end automated Power Query and Excel data consolidation model with standardized department templates)
4. Verifiable Business Outcome: (e.g., Report generation time reduced from 3 weeks to under 2 hours; eliminated cross-department formula calculation discrepancies)
5. Authorized Client Testimonial / Quote: (Optional, including Name, Designation, Institution)
```

---

### DEC-05: Official Social Media Profile Links

#### Background & Analysis
- **Current State:** The legacy footer previously rendered unverified generic root domain links:
  - `https://linkedin.com`
  - `https://twitter.com`
  - `https://facebook.com`
- **Audit Action Taken:** Pointing prospective B2B clients to the generic root homepage of LinkedIn or Twitter damages commercial credibility. Per Phase 12.2 Task 3, `FALLBACK_SITE_SETTINGS.socialLinks` was cleared to an empty array (`[]`), preventing the footer from rendering broken or generic social icons.

#### Stakeholder Action Required
Please confirm the active, official corporate profile URLs for the following channels so they can be re-enabled:
1. **LinkedIn Corporate Page:** (e.g., `https://www.linkedin.com/company/kvj-analytics/`)
2. **YouTube Channel:** (e.g., `https://www.youtube.com/@kvjanalytics`)
3. **Facebook Page:** (e.g., `https://www.facebook.com/kvjanalytics/`)
4. **X / Twitter Handle:** (e.g., `https://twitter.com/kvjanalytics`)
5. **Instagram Profile:** (e.g., `https://www.instagram.com/kvjanalytics/`)

---

### DEC-06: Commercial Copy & Quantitative ROI Claims

#### Background & Analysis
- **Current State:** In Phase 12.2 Task 2, corporate copy across Report Automation, Spreadsheet Consulting, Dashboard Development, Process Automation, and Corporate Training was upgraded to emphasize:
  - Substantial reduction in repetitive manual data entry.
  - Replacement of fragile, undocumented spreadsheet formulas with auditable workflows.
  - Cost-conscious analytics modernizations without mandatory recurring enterprise SaaS licensing overhead.
  - Predictable project pricing with direct access to senior practitioners.
- **Copy Discipline:** Qualitative assertions were used instead of unsupported absolute claims (e.g., avoided "100% error-free", "Guaranteed 80% ROI", "Zero manual labor").

#### Stakeholder Action Required
- If specific quantitative marketing metrics (e.g., "Cuts reporting time by 75%", "Over 10,000 hours saved for clients") are desired on landing pages, executive leadership must formally supply verified project data or audit logs supporting those figures prior to deployment.

---

## 4. Next Steps & Approval Workflow

1. **Review & Annotate:** Executive management to review the options in Section 3 and select preferred options for DEC-01 through DEC-06.
2. **Sign-Off:** Provide written confirmation or updated marketing briefs.
3. **Implementation:** Engineering will apply the approved product branding, social links, and authenticated case studies in Phase 12.3 or subsequent content polish sprints.

