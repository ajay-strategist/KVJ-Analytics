# KVJ Analytics — Marketing, CRO, SEO & Lead-Gen Plan

Goal: turn the site into a **lead-generating machine** with no marketing team — high conversion, strong SEO, and automated capture/follow-up baked into the build.

## 1. Conversion Strategy (CRO)

**One clear job per page → one primary action.** Segment-specific:
- Corporate pages → **"Book a Free Consultation"** / "Request a Demo"
- Education pages → **"Partner With Us"** / "Request a Campus Program"
- Training/courses → **"Enroll Now"** / "Try a Free Mock Test"

**Conversion mechanics to build in:**
- Above-the-fold value prop + primary CTA on every page; CTA repeated mid-page and in a closing CTA band.
- **Sticky header** with a persistent CTA button; sticky mobile CTA bar.
- **Floating WhatsApp** button (they use WhatsApp) + click-to-call on the phone numbers.
- **Lead magnets** (email capture): downloadable brochure/PDF, free mock test, "Analytics Readiness Checklist", course syllabus PDF.
- **Exit-intent / scroll-depth** lead popup (offer the magnet) — frequency-capped.
- **Short, low-friction forms** (Name, Email/Phone, Interest); progressive disclosure; instant success state + auto-reply email; optional WhatsApp confirmation.
- **Trust & social proof near every CTA:** 16+ years, 50,000+ trained, client logos, testimonials, certifications, registered business + GST, case studies.
- **Urgency/relevance** where honest: upcoming batch dates, limited seats, "trusted by X institutions".

## 2. Lead Capture & Nurture (automation, no team)
- All leads → Supabase `leads` + instant Resend notification to team + auto-responder to the lead.
- Tag lead by source page + interest for routing.
- **Newsletter / drip:** capture emails → simple Resend sequences (welcome → value → offer).
- `/admin` dashboard: leads inbox with status, source, and basic conversion metrics; CSV export.
- Optional CRM/connector handoff later (e.g. Google Sheets/HubSpot).

## 3. SEO

**Technical**
- SSR/SSG + fast Core Web Vitals (speed = conversions). Image optimization, lazy-load, code-split.
- `sitemap.xml`, `robots.txt`, canonical tags, clean slugs, breadcrumb + Organization + Course + Article + FAQ JSON-LD schema.
- Mobile-first, HTTPS, accessible markup.

**On-page**
- Unique keyword-targeted `<title>`, meta description, single H1 per page (all editable in Sanity).
- Target intent + location keywords, e.g. *"data analytics training in Kochi/Kerala", "Power BI corporate training India", "report automation services", "academic analytics platform for colleges"*.
- Internal linking between solutions ↔ courses ↔ blog ↔ case studies.

**Content engine**
- Blog targets buyer + learner keywords (how-tos, comparisons, industry use-cases). Each post ends with a relevant CTA/lead magnet.
- Course/service pages double as SEO landing pages.

**Local SEO**
- Consistent NAP (Lalan Towers, Cochin) sitewide + LocalBusiness schema; Google Business Profile recommended; embed map on Contact.

## 4. Analytics & Measurement
- **GA4** with conversion events (form_submit, demo_request, enroll_start, brochure_download, call_click, whatsapp_click).
- **GTM** container, **Microsoft Clarity** (heatmaps/recordings), **Meta Pixel** + **LinkedIn Insight Tag** for retargeting (gated on env vars).
- Define goals/funnels; surface top conversion metrics in `/admin`.
- UTM support on inbound links; store UTM with each lead.

## 5. Paid & Retargeting readiness (for when budget allows)
- Pixels installed + conversion events ready so Google/Meta/LinkedIn ads can optimize from day one.
- Dedicated landing pages per campaign (reuse the page builder).

## 6. Antigravity prompt (paste as Step 14 / Marketing phase)

```
Optimize the KVJ Analytics site for high conversion, lead generation, and SEO. No marketing team — automate everything.

CONVERSION:
- Every page has a single primary CTA above the fold, repeated mid-page and in a closing CTA band. Segment CTAs: Corporate="Book a Free Consultation", Education="Partner With Us", Courses="Enroll Now"/"Try a Free Mock Test".
- Sticky header CTA + sticky mobile CTA bar; floating WhatsApp button; click-to-call phone numbers.
- Lead magnets with email-gated download (brochure PDF, free mock test, checklist, syllabus). Exit-intent/scroll popup offering a magnet, frequency-capped.
- Short forms (Name, Email/Phone, Interest) with inline validation, instant success state, auto-reply email. Store every lead in Supabase `leads` with source_page + UTM; notify team via Resend.
- Trust signals near CTAs: metrics counters, client logos, testimonials, certifications, GST/registered business, case studies.

SEO:
- Editable per-page title/meta/H1 in Sanity. sitemap.xml, robots.txt, canonicals, clean slugs.
- JSON-LD: Organization, LocalBusiness (Cochin NAP), Course, Article, FAQ.
- Target intent+location keywords on service/course/blog pages; strong internal linking. Fast Core Web Vitals; image optimization.

ANALYTICS (all gated on env vars, render nothing if unset):
- GA4 + GTM with conversion events: form_submit, demo_request, enroll_start, brochure_download, call_click, whatsapp_click.
- Microsoft Clarity, Meta Pixel, LinkedIn Insight Tag. Capture & persist UTM params with leads.
- Simple conversion overview in /admin (leads by source, counts, statuses, CSV export).

Build a short MARKETING.md documenting events, lead magnets, and how the non-coder edits CTAs/SEO in Sanity.
```

## 7. Quick wins post-launch (owner checklist)
- Set up Google Business Profile + get reviews.
- Add real client logos, testimonials, case studies.
- Publish 1–2 SEO blog posts/month from Studio.
- Connect a domain email + verify Resend domain for deliverability.
- Submit sitemap to Google Search Console; monitor queries.
