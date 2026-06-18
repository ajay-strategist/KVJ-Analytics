# Antigravity Prompt — Full Design Overhaul (KVJ Analytics)

Paste everything below the line. It overhauls ONLY the UI/visual layer — content, routes, Sanity/Supabase wiring, and all functionality stay intact.

---

The current build works but the design looks **generic, cheap, flat, and unpolished** — the premium theme was not really applied. Do a **full design overhaul of the UI layer**. Do NOT change content, copy, page structure, routes, Sanity schemas, Supabase logic, forms, payments, or any functionality. Only upgrade styling, layout, components, visuals, and motion.

## What is wrong now (fix all of these)
- Looks like default/unstyled Tailwind: weak hierarchy, dull typography, inconsistent and cramped spacing.
- The "Azure & Teal" theme isn't visible — colors, fonts, gradient, and accents aren't applied consistently.
- Layout is flat and one-dimensional: no visual rhythm, sections blur together, poor responsive behavior.
- No richness: missing imagery, icons, cards, depth, and motion. Feels static and boring.

## Apply this design system rigorously (single source of truth)
**Colors** (define as CSS variables + Tailwind theme, use everywhere): brand `#1D4ED8`, brand-700 `#1E40AF`, navy `#0B1F3A`, corporate `#2563EB`, education `#0D9488`, cta `#F59E0B`, cta-600 `#D97706`, ink `#0F172A`, slate `#475569`, muted `#94A3B8`, line `#E2E8F0`, surface `#F8FAFC`, card `#FFFFFF`, success `#16A34A`, error `#DC2626`. **Signature gradient** `linear-gradient(135deg,#1D4ED8,#0D9488)`. Light theme only — no dark mode.
**Type:** headings **Sora** (600/700), body **Inter** (400/500) via next/font. Scale: hero 56/desktop→36/mobile, H1 40/30, H2 32/24, H3 24/20, body 17 (line-height 1.6), eyebrow 12 uppercase letter-spacing 0.12em. Tight tracking on big headings.
**Spacing & layout:** 8px base; section vertical padding 96–120px desktop / 56–64px mobile; max content width 1200px; 12-col responsive grid; generous whitespace — premium means breathing room, not density.
**Shape & depth:** card radius 16px, buttons/inputs 10px, pills full. Soft layered shadows: rest `0 1px 2px rgba(15,23,42,.06)`, hover `0 12px 32px rgba(29,78,216,.12)`. No harsh borders everywhere — prefer subtle hairlines `#E2E8F0`.
**Motion:** 200–300ms ease; fade/slide-up on scroll (IntersectionObserver); animated count-up for metrics; hover lift on cards/buttons; honor `prefers-reduced-motion`.

## Premium layout patterns to introduce (rebuild sections to use these)
- **Hero:** large bold-statement headline (Sora, 56px), short supporting line, ONE amber primary CTA + one outline secondary, and a strong visual (product/dashboard mockup or abstract blue→teal gradient shape). Use the signature gradient as a band or accent, not flat white.
- **Eyebrow labels** above every section headline (uppercase, brand/segment color).
- **Two-segment treatment:** Corporate sections accented blue, Education sections accented teal. Use large `SegmentCard`s on Home so the two audiences are visually distinct.
- **OfferingRow:** alternating image-left / image-right rows for services (eyebrow + bold statement + short copy + "Learn More →").
- **Metrics band:** full-width section (white or gradient) with big animated counters (Sora 700).
- **NumberedCards (01–06)** for "why us"/features with hairline borders and hover lift.
- **Cards everywhere** for services/products/courses/blog: white surface, 16px radius, soft shadow, icon, title, short copy, arrow; hover lift.
- **Icons:** add a consistent line-icon set (e.g. lucide-react) — every service/feature/metric gets a relevant icon.
- **Logo strip, testimonials, and a closing gradient CTA band** before the footer.
- **Footer:** navy `#0B1F3A` background, multi-column, with the tagline, contact info, GST, and quick links — clearly premium, not a plain text list.

## Buttons & forms
Primary button = amber `#F59E0B` fill with ink `#0F172A` text, 10px radius, generous padding, hover lift/darken. Secondary = brand-blue outline. Ghost = text + arrow. Inputs: large, clear labels, focus ring in brand blue, inline validation, polished success states.

## Visual quality
Add real imagery/placeholders (clean dashboards, data viz, training photos) and abstract gradient shapes. Use whitespace, alignment, and consistent vertical rhythm. Ensure strong contrast and visual hierarchy on every page. Everything must look intentional and premium — comparable to a top SaaS/agency site.

## Constraints
- Keep all content, routes, CMS-driven data, forms, auth, payments, and admin intact.
- Make colors/fonts configurable in ONE theme file.
- Fully responsive (mobile/tablet/desktop), no layout breaks.
- Accessible: WCAG AA contrast, focus states, semantic HTML, alt text.

## Deliver
Refactor shared components (Button, Card, Section, Container, Eyebrow, BoldStatement, SegmentCard, OfferingRow, MetricCounter, NumberedCard, LogoStrip, Testimonial, CTASection, Header, Footer) first, then apply them across all pages. After finishing, give me a before/after summary per page and a list of any pages still needing imagery.
