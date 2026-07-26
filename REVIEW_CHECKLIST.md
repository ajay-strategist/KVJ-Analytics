# KVJ Analytics — Review & Verification Checklist

Use this to verify each feature after Antigravity builds it. Mark ✅ / ❌ and note issues. Organized by area; the final section is security sign-off (do not launch until all pass).

## A. Look & Feel (premium, two-segment)
- [ ] Bold-statement headlines used throughout (3–5 words) with eyebrow labels.
- [ ] Short descriptions, not paragraphs; metrics surfaced prominently.
- [ ] Two-segment structure clear (Corporate vs Education) on Home + nav.
- [ ] Animated metric counters work.
- [ ] Alternating image/text offering rows, numbered feature cards, logo strip, testimonials present.
- [ ] Consistent palette/typography; strong visuals on every section.
- [ ] Fully responsive (mobile/tablet/desktop); no layout breaks.
- [ ] Accessible: keyboard nav, focus states, alt text, color contrast (WCAG AA).

## B. Pages render & are editable in Sanity
- [ ] Home, About, Corporate (+details), Education (+details), Products (+details), Impact, Contact, Privacy, Terms all render from Sanity.
- [ ] No hard-coded copy/metrics — every visible string editable in Studio.
- [ ] Header nav + Footer (description, columns, quick links, tagline) from `siteSettings`.
- [ ] Contact info correct: info@kvjanalytics.in · 9961813730 / 0484-4059310 / 7902661012 · Lalan Towers address · GST 32BIDPK3118B1Z2.

## C. Contact & Leads
- [ ] Form fields: Name, Organization, Email, Phone, Service Interested In, Message.
- [ ] Submission stored in Supabase `leads`.
- [ ] Team notification email sent (Resend).
- [ ] Validation + success/error states work; spam protection (CAPTCHA) active.
- [ ] `/admin` leads inbox lists submissions and updates status.

## D. Blog / Insights
- [ ] List, single post, category, author pages render.
- [ ] Non-coder can create & publish a post in Studio (test it).
- [ ] Post SEO, sitemap, RSS work.

## E. Training Platform — Catalog & Content
- [ ] Course catalog + course detail pages render from Sanity.
- [ ] Non-coder can add a course, add materials, and add a mock test in Studio (test each).
- [ ] Materials of type pdf/video/link/richtext all display correctly.
- [ ] Preview materials visible publicly; gated materials hidden until enrolled.

## F. Training Platform — Enrollment Method 1 (Paid)
- [ ] Razorpay checkout launches for a paid course.
- [ ] Test-mode payment completes; enrollment + order recorded in Supabase.
- [ ] Course access granted only after successful, signature-verified payment.
- [ ] GST receipt/invoice email received.
- [ ] Failed/cancelled payment does NOT grant access.

## G. Training Platform — Enrollment Method 2 (College Code)
- [ ] Admin can create a batch and see its rotating (~30s) code.
- [ ] Student enrolls by entering the current code within the window + Name/Phone/Organization.
- [ ] Expired/incorrect code is rejected.
- [ ] Repeated wrong attempts are rate-limited / locked.
- [ ] Enrollment + student profile recorded; access granted to that course only.

## H. Training Platform — Mock Tests
- [ ] Only enrolled students can start a test.
- [ ] Timer + auto-submit work; results computed correctly.
- [ ] Answer keys are NOT present in client network/payload (inspect dev tools).
- [ ] Attempts + scores stored in Supabase; visible in student dashboard and admin.

## I. Student Dashboard & Admin
- [ ] Student sees only their enrolled courses, materials, tests, results.
- [ ] Admin can view enrollments, payments, batches/codes, student details, results; export CSV.
- [ ] Roles enforced: a student cannot reach admin routes.

## J. SEO / Analytics / Performance
- [ ] Meta titles/descriptions/OG per page; sitemap.xml + robots.txt present; JSON-LD valid.
- [ ] GA4/GTM/Clarity fire only when env IDs set (nothing fires otherwise).
- [ ] Lighthouse ≥ 90 (Performance, Accessibility, Best Practices, SEO).

## K. SECURITY SIGN-OFF (must all pass before launch)
- [ ] RBAC enforced server-side (admin vs student); no privilege escalation.
- [ ] Supabase RLS on enrollments, attempts, leads, orders, profiles verified.
- [ ] Gated files served via authenticated routes / signed expiring URLs; not publicly guessable.
- [ ] Mock-test answer keys never leave the server.
- [ ] Razorpay webhook signature verified; client cannot alter amount/access.
- [ ] Rotating enrollment code: server-verified, short validity, rate-limited, lockout on abuse.
- [ ] Student PII: consent captured, minimal data, encrypted at rest, privacy policy linked.
- [ ] Secure headers (CSP/HSTS), HTTP-only secure cookies, CSRF protection, input validation on all forms/APIs.
- [ ] Audit log of admin actions & enrollments.
- [ ] No secrets in client bundle or repo; least-privilege keys; `.env.local.example` complete.
- [ ] Dependency/security scan clean; rate limiting on auth & public forms.

## L. Design System Conformance (premium, light)
- [ ] "Azure & Teal" palette applied (brand #1D4ED8, teal #0D9488, amber CTA #F59E0B); no dark theme.
- [ ] Sora headings + Inter body; type scale and eyebrow style correct.
- [ ] Corporate sections accent blue, Education accent teal, primary CTAs amber.
- [ ] Soft layered shadows, 16px card radius, scroll fade-up, animated counters; reduced-motion respected.
- [ ] Generous whitespace, 1200px max width, premium feel consistent across pages.
- [ ] All text meets WCAG AA contrast.

## M. Marketing / CRO / Lead Generation
- [ ] One clear primary CTA per page (segment-specific) above the fold + repeated + closing band.
- [ ] Sticky header CTA, sticky mobile CTA bar, floating WhatsApp, click-to-call all work.
- [ ] Lead magnets gated by email; download delivered; lead captured.
- [ ] Exit-intent/scroll popup appears (frequency-capped) and converts to a lead.
- [ ] Forms store leads with source_page + UTM; team alert + auto-reply sent.
- [ ] Trust signals (metrics, logos, testimonials, GST, case studies) near CTAs.

## N. SEO
- [ ] Editable per-page title/meta/H1; one H1 per page.
- [ ] sitemap.xml, robots.txt, canonicals, clean slugs.
- [ ] JSON-LD valid: Organization, LocalBusiness (Cochin NAP), Course, Article, FAQ.
- [ ] Keyword + location targeting on key pages; internal linking present.
- [ ] Core Web Vitals pass; images optimized.

## O. Analytics & Tracking
- [ ] GA4 + GTM conversion events fire (form_submit, demo_request, enroll_start, brochure_download, call_click, whatsapp_click) — only when env IDs set.
- [ ] Clarity, Meta Pixel, LinkedIn Insight gated on env vars.
- [ ] UTM params persisted with leads; /admin conversion overview + CSV export.
