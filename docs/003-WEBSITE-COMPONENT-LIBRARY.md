# 003 — Website Component Library
**KVJ Analytics Platform V3 · Foundation doc ⭐⭐⭐⭐⭐**
The canonical inventory of reusable UI. Every page/section composes from these; the 002 block
registry maps `section.type` → a component here. Legend: **[in code]** exists, **[V3]** the
canonical V3 section, **[legacy]** exists but superseded/consolidate, **[to add]** not built yet.

---

## 1. Rules (every component obeys)
Prop-driven, **no hardcoded content** · dark-mode native (001 tokens only) · responsive across all
five breakpoints · accessible (keyboard, ARIA, visible focus) · honors reduced-motion · exposes
**loading / empty / error** states where it fetches or lists · default export or named, typed props,
no `any`. Presentational components take data via props; data-fetching lives in the page/server
component, not the leaf. Prefer **composition over variants-explosion**.

Location convention:
- `src/components/ui/` — design-system primitives (buttons, cards, containers, motion helpers).
- `src/components/v3/` — **canonical V3 section components** (full-width page bands). Compose these.
- `src/components/` (root) — feature/stateful components (Header, Footer, forms, page clients).

---

## 2. Primitives **[in code — `src/components/ui/`]**
| Component | Purpose | Notes |
|---|---|---|
| `Container` | Max-width `1200px` + responsive padding | Wrap all section content. |
| `Section` | Section band wrapper (bg variants) | Legacy sibling of V3 `SectionShell`. |
| `Button` | Pill button, `variant` primary/secondary/ghost/light/accent/corporate/education | Canonical (see 001 §9). |
| `Card` | Base card surface | Prefer `.card-premium` styling (001 §10). |
| `Reveal` | Scroll-in wrapper, variants up/left/right/scale/blur, `delay` | Core motion primitive (004). |
| `RevealText` | Word/line reveal for headings | Hero/heading emphasis. |
| `Eyebrow` | Uppercase cyan kicker label | Section kicker. |
| `CountUp` / `MetricCounter` | Animated number | Stats. Consolidate the two **[legacy]**. |
| `BoldStatement` | Large statement band | Editorial breaks. |
| `CTASection` | Final call-to-action band | Used site-wide (e.g. About). Fold into V3 `V3FinalCTA` **[to add]**. |
| `Magnetic` | Magnetic hover wrapper | Buttons/interactive accents. |
| `ParallaxBlob` | Parallax ambient blob | Hero/section ambiance. |

### Cards (multiple — consolidate) **[legacy]**
`ServiceCard` (accentColor "cyan"|"blue"), `SegmentCard`, `ProductCard`, `NumberedCard`,
`OfferingRow`. These overlap heavily. **Target:** the `V3CardGrid` card + a small set of typed
variants (feature, service, product, step) — migrate pages off the one-off cards during build.

### Heroes / visuals (many — consolidate) **[legacy]**
`HeroCanvas`, `HeroDashboardCanvas`, `HeroCarousel`, `HeroVisual`, `AboutHeroVisual`,
`CorporateHeroGraphic`, `EducationHeroGraphic`. Rich animated hero visuals. **Target:** `V3Hero`
takes an optional `visual` slot (already supported) — pass the appropriate canvas/graphic in, rather
than each page owning a bespoke hero shell.

### Social proof **[in code]**
`Testimonial`, `HomeTestimonials`, `LogoStrip`, `ClientLogoCarousel`, `ProcessSteps`.

---

## 3. V3 section components **[V3 — `src/components/v3/Sections.tsx`]**
The canonical, block-registry-mapped set. Shared types exported: `CtaLink`, `CategoryCard`,
`TimelineStep`, `FaqItem`.

| Export | `section.type` | Key props | Renders |
|---|---|---|---|
| `V3Hero` | `hero` | badge, headline, supporting, description, primaryCta, secondaryCta, visual? | Full-bleed hero, ambient blobs, staggered reveals. |
| `V3CardGrid` | `cardGrid` | eyebrow, heading, description, cards[], columns 2/3/4, cta? | Glass card grid (solutions/why/values). |
| `V3Industries` | `industries` | eyebrow, heading, items[] | Centered pill row. |
| `V3Timeline` | `timeline` | eyebrow, heading, steps[] | Numbered process/approach cards. |
| `V3SuccessStories` | `successStories` | eyebrow, heading, items[], cta? | Outcome-statement grid. |
| `V3Faq` | `faq` | eyebrow, heading, items[] | Accordion (`<details>`). |

Internal shared bits (not exported): `SectionShell` (py-20/28 + Container), `Eyebrow`,
`SectionHeading` (eyebrow + heading + description, optional centered).

---

## 4. Target component checklist (your 003 list → status)
| Requested | Status | Maps to / plan |
|---|---|---|
| Hero | ✅ [V3] | `V3Hero` (+ optional visual slot for legacy canvases). |
| Cards | ✅ [V3] | `V3CardGrid`; consolidate legacy card set. |
| Timeline | ✅ [V3] | `V3Timeline` (also `ProcessSteps` legacy). |
| FAQ | ✅ [V3] | `V3Faq`. |
| Gallery | ⬜ [to add] | `V3Gallery` (grid/lightbox, media-lib backed — 007). |
| Logo Slider | 🟡 | `ClientLogoCarousel` / `LogoStrip` → wrap as `V3LogoSlider`. |
| Forms | 🟡 | `ContactForm`, `InternshipApplyForm`, `JobApplyForm` exist → generalize with RHF+Zod (009). |
| Stats | 🟡 | `CountUp`/`MetricCounter` → `V3Stats` band. |
| Testimonials | 🟡 | `HomeTestimonials`/`Testimonial` → `V3Testimonials` (CMS-driven). |
| CTA | 🟡 | `CTASection` → `V3FinalCTA`. |
| Pricing | ⬜ [to add] | `V3Pricing` (only if/where needed — Products is NOT a store). |
| Tables | ⬜ [to add] | `DataTable` primitive (001 §12, TanStack Table) — admin-first. |
| Breadcrumb | ⬜ [to add] | `Breadcrumb` (nav — see 005). |
| Accordions | ✅ | `V3Faq` pattern generalized to `Accordion`. |
| Tabs | ⬜ [to add] | `Tabs` primitive (accessible, keyboard). |
| Buttons | ✅ [in code] | `Button` (001 §9). |
| Pagination | ⬜ [to add] | `Pagination` (blog/catalog lists). |
| Search | ⬜ [to add] | `Search` input + results (blog/courses; command palette in 005). |
| Filters | ⬜ [to add] | `FilterBar` (catalog/blog category + difficulty filters). |

---

## 5. States every listing/interactive component must ship
- **Loading** — skeleton matching final layout (001 §13); never blank.
- **Empty** — icon + heading + guidance + action (001 §14).
- **Error** — message + retry; toast for transient (001 §15).
- **Interactive** — hover, focus-visible, active, disabled, and (buttons) loading.
Add shared `Skeleton`, `EmptyState`, `ErrorState` primitives **[to add]** so these are one import.

---

## 6. Consolidation backlog (tech debt to retire during build)
1. **Cards:** collapse `ServiceCard`/`SegmentCard`/`ProductCard`/`NumberedCard`/`OfferingRow` into
   `V3CardGrid` + typed variants.
2. **Heroes:** route all bespoke hero shells through `V3Hero` + `visual` slot.
3. **Counters:** merge `CountUp` and `MetricCounter`.
4. **CTA/Section:** `CTASection`→`V3FinalCTA`; `Section`→V3 `SectionShell` conventions.
Do these opportunistically as each page migrates to block mode (002 §5) — not a big-bang refactor.

---

## 7. Adding a new component (checklist)
Typed props (no `any`) · tokens only (001) · responsive · a11y + focus + reduced-motion · loading/
empty/error if it lists/fetches · export from the right folder (§1) · if it's a page section, add a
`section.type` + register in the 002 `SECTION_REGISTRY` + add an editor block · document its row here.

---

## 8. Definition of done (component work)
On-system per 001 §21 · prop-driven, zero hardcoded content · has required states · reused (not
duplicated — check §2/§6 before creating) · registered in the section registry if it's a band ·
listed in this doc.

---
_Status: ✅ complete. Next: 004 — Motion System (after review)._
