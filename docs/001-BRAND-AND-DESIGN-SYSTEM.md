# 001 — Brand & Design System
**KVJ Analytics Platform V3 · Foundation doc ⭐⭐⭐⭐⭐**
Single source of truth for the visual language. Every page, component, and screen inherits from
this. Where a value already exists in `src/app/globals.css` it is quoted verbatim and marked
**[in code]**; intended additions are marked **[to add]**; conflicts to fix are marked **[reconcile]**.

---

## 0. How to use this doc
- Colors, type, spacing, radius, shadow, and motion timings are **tokens**, defined once in
  `globals.css @theme` / `:root` and consumed via Tailwind token classes (`bg-base`, `text-ink`,
  `text-brand`, `rounded-[var(--radius-card)]`). **Never hardcode a hex or px that a token covers.**
- If a value isn't in the system, add it as a token here first, then use it. No one-off magic numbers.
- This is a **dark** design system. There is no light mode (see §2).

---

## 1. Brand personality
KVJ Analytics is a premium **analytics, AI, business-intelligence & digital-transformation** company
(the education arm is a strategic partner, not a coaching institute). The brand should feel like the
intersection of **Apple · Stripe · Linear · Vercel · Framer**: confident, precise, calm, and modern.

Voice & feel: **intelligent, trustworthy, forward-looking, understated.** Deep dark canvas, luminous
cyan/blue accents, generous space, crisp type, restrained motion. Never loud, cluttered, gimmicky,
"corporate-stock-photo," or clip-arty.

Five adjectives that gate every design decision: **Premium · Precise · Intelligent · Trustworthy · Alive.**
If an element isn't serving one of these, cut it.

---

## 2. Theme (dark only)
Deep near-black canvas + cyan/blue luminous accents. **[reconcile]** The header comment in
`globals.css` still says "premium light theme" and a few legacy light/violet/gold values remain
(see §16) — the *actual* system is dark. Treat dark as canonical; the light-theme note is stale.

Surfaces **[in code]**:

| Token | Value | Use |
|---|---|---|
| `--color-base` | `#050608` | Page background (deep obsidian) |
| `--color-base-2` | `#0A0D13` | Secondary background |
| `--color-surface` | `#0A0D13` | Alternate section background |
| `--color-card` | `#0E1117` | Solid card background |
| `--color-glass-card` | `rgba(15,18,28,0.72)` | Glass card fill |
| `--color-line` | `rgba(60,255,255,0.15)` | Hairline / glass border (cyan-tinted) |

---

## 3. Color palette
### Accents **[in code]**
| Token | Value | Meaning |
|---|---|---|
| `--color-brand` | `#43F5FF` | **Primary — cyan.** Primary CTAs, links, active states, focus glow. |
| `--color-brand-secondary` / `--color-brand-700` | `#16E6D8` | Secondary cyan (gradient stop, hover). |
| `--color-corporate` | `#3A7BFF` | **Blue** — corporate solutions accent, gradient partner. |
| `--color-education` | `#43F5FF` | Cyan — educational accent. |
| `--color-cta` / `--color-cta-600` | `#43F5FF` / `#16E6D8` | CTA fill + hover. |

Canonical accent pairing for gradients: **cyan `#43F5FF` → blue `#3A7BFF`**, optional third stop
secondary cyan `#16E6D8`. Signature gradient **[in code]**:
`--gradient-signature: linear-gradient(120deg,#43F5FF 0%,#3A7BFF 35%,#16E6D8 60%,#43F5FF 100%)`.

### Text (on dark) **[in code]**
| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#FFFFFF` | Primary text / headings |
| `--color-slate` | `#A7B1C4` | Body / secondary text |
| `--color-muted` | `#7B8797` | Captions, placeholders, disabled |

(The `--color-slate-50…600` ramp exists for compatibility but most map to the three above; prefer
`ink` / `slate` / `muted`.)

### Semantic **[in code + to add]**
| Token | Value | Use |
|---|---|---|
| `--color-success` | `#28E79E` | Success / positive delta |
| `--color-error` | `#FF4B4B` | Error / destructive |
| **[to add]** `--color-warning` | `#F5B546` | Warnings / pending |
| **[to add]** `--color-info` | `#3A7BFF` | Neutral info (reuse blue) |

### Usage rules
- **60 / 30 / 10:** ~60% base/surface, ~30% text/structure, ~10% accent. Accent is a *highlight*,
  never a wash. No large flat cyan fills.
- Cyan and blue never compete at equal weight in the same element — one leads, the other supports.
- Semantic colors are for status only, never decoration.

---

## 4. Typography
**[in code]** Font tokens both map to **Plus Jakarta Sans** (`--font-display`, `--font-body` →
`var(--font-plus-jakarta)`), loaded in `app/layout.tsx`. **[reconcile]** The CSS comment and the
redesign memory reference *Space Grotesk + Inter*; the shipped font is Plus Jakarta Sans. **Decision
needed from CEO/design:** keep Plus Jakarta (recommended — already consistent) or switch display to
Space Grotesk. Until decided, Plus Jakarta is canonical.

Headings **[in code]**: `font-display`, weight **500**, `letter-spacing:-0.025em` (h1–h3) /
`-0.015em` (h4–h6), `line-height:1.12`. Body: weight 400, `16px`, `line-height:1.55`, antialiased.

### Type scale (recommended, rem @16px base)
| Role | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display / H1 | 40–64px (`clamp`) | 700 | -0.02em | Hero headline |
| H2 | 30–48px | 700 | -0.02em | Section heading |
| H3 | 20–24px | 700 | -0.015em | Card / subsection |
| H4 | 18px | 600 | -0.015em | Small heading |
| Body-lg | 18px | 300–400 | 0 | Hero sub / lead |
| Body | 16px | 400 | 0 | Default |
| Body-sm | 14px | 400 | 0 | Card copy, meta |
| Caption | 12–13px | 500 | 0 | Labels |
| Eyebrow | 11px | 700 | 0.18–0.22em, UPPERCASE | Section kicker (cyan) |
| Mono | — | 600 | — | Step numbers, code, stats (`font-mono`) |

Rules: one H1 per page. Body max line length ~70ch (`max-w-2xl/3xl`). Gradient text via
`.text-gradient-flow` / `.signature-gradient-text` for accents only — **never** on long copy
(contrast + legibility).

---

## 5. Spacing system
Base unit **4px**, Tailwind scale (`1`=4px … `24`=96px). Section rhythm: vertical padding
`py-20 md:py-28` (80/112px) — matches the V3 `SectionShell`. Container: `max-w-[1200px]`,
`px-4 sm:px-6 lg:px-8` **[in code, Container.tsx]**. Card padding `p-7 md:p-8` (28/32px). Grid gaps
`gap-6 md:gap-7`. Element spacing steps: 4, 8, 12, 16, 24, 32, 48, 64, 96. Don't invent in-betweens.

---

## 6. Border radius **[in code]**
| Token | Value | Use |
|---|---|---|
| `--radius-card` | `24px` | Cards, panels, modals, media |
| `--radius-input` | `14px` | Inputs, selects, textareas, small controls |
| `--radius-btn` | `9999px` | **Pill buttons** (brand signature) |
Icon tiles / badges: `rounded-2xl` (16px) or `rounded-full`. Consistency > variety.

---

## 7. Shadows & elevation **[in code]**
| Token | Value | Use |
|---|---|---|
| `--shadow-soft` | `0 8px 30px rgba(0,0,0,.5), 0 2px 4px rgba(0,0,0,.2)` | Resting card |
| `--shadow-hover-lift` | `0 24px 60px rgba(67,245,255,.16), 0 4px 10px rgba(58,123,255,.08)` | Hover (cyan glow) |
| `--shadow-sm/md/lg/xl` | see `:root` | General elevation ramp |

Elevation model: on dark, depth = **border-light + blur + subtle glow**, not heavy drop shadows.
Accent glow (cyan/blue) signals interactivity; pure-black shadow signals physical lift. Hover raises
`translateY(-6px)` + intensifies border/glow (see `.card-premium:hover`).

---

## 8. Glassmorphism **[in code]**
Core surface language. Three reusable classes:
- `.glass-panel` — `rgba(10,10,15,.65)` + `blur(24px)` + cyan border — for chrome/overlays.
- `.card-premium` — glass card with animated gradient border (`::before`), lift + glow on hover.
  Default content card.
- `.card-glass` — lighter glass for use **on hero backgrounds**.

Rules: blur **24px** standard; border `1.5px` cyan at 12–15% opacity; always add an inset top
highlight (`inset 0 1px 0 rgba(255,255,255,.05)`) for the "lit glass" edge. Don't stack many glass
layers (perf + muddiness). Keep text on glass at `ink`/`slate` for contrast.

---

## 9. Buttons **[in code — Button.tsx]**
`variant`: `primary | secondary | ghost | light | accent | corporate | education`. Pill shape
(`--radius-btn`). Guidance:
- **accent / primary** — cyan fill, dark text; the main page action. One primary per view.
- **secondary** — outline/subtle on dark; secondary actions.
- **ghost** — text + arrow, no fill; tertiary/inline (see hero secondary CTA pattern).
- Include hover (glow/lift), focus-visible ring, active, disabled, and loading (spinner + disabled)
  states. Min hit area 44×44px. Icon+label spacing `gap-2`. Optional `.btn-sweeping-border` /
  `.sheen` for premium emphasis — use sparingly.

---

## 10. Cards
Default: `.card-premium` (§8) at `p-7 md:p-8`, `rounded-[--radius-card]`. Anatomy: icon tile
(`rounded-2xl bg-brand/10 border border-brand/20`) → title (`text-ink`, hover `text-brand`) →
body (`text-slate`) → optional bullet list (cyan dot markers) → optional footer link. Variants:
solid (`bg-card`) for dense/admin UIs; glass for marketing. Every card: hover state + keyboard focus
if interactive. See `components/v3/Sections.tsx` `V3CardGrid`.

---

## 11. Inputs & forms
Inputs: `rounded-[--radius-input]`, `bg-surface`/`bg-white/[0.03]`, `border-line`, `text-ink`,
`placeholder:text-muted`, focus via `.focus-glow` (cyan `#43F5FF` ring). **[reconcile]** global
`:focus-visible` outline is violet `#7B61FF` — change to brand cyan for consistency (§16).
Form rules: label above field; helper text below; inline validation (error = `--color-error` border +
message + `aria-invalid`; success = `--color-success`); required marked; disabled dimmed. States:
default / focus / filled / error / success / disabled. Use React Hook Form + Zod (per master rules)
when built. Group with `space-y-4/5`; two-column on `md+` where sensible.

---

## 12. Tables
For admin/data views. Sticky header (`bg-surface`), row height ≥44px, `border-line` dividers, zebra
via `bg-white/[0.02]`, hover row highlight, right-align numerics (`tabular-nums`). Include: column
sort, pagination, empty state (§14), loading skeleton rows (§13), and horizontal scroll only as last
resort (prefer responsive stacking on mobile). TanStack Table when interactivity grows.

---

## 13. Loading states
Never a blank screen. Patterns: **skeletons** (shimmer blocks matching final layout — preferred for
content), **spinners** (small inline, for buttons/actions), **progress bar** (`ScrollProgress`
style, cyan→teal→blue gradient). Skeleton = `bg-white/[0.05]` rounded blocks, subtle pulse
(respect reduced-motion). Button loading = spinner + disabled + keep width. Add a `Skeleton`
primitive **[to add]**. The intro loader (counter → wipe) is the app-load treatment (once/session).

---

## 14. Empty states
Every list/table/dashboard needs one: centered icon tile + short heading + one line of guidance +
a primary action ("Create your first course"). Tone helpful, never dead-end. Muted illustration or
icon in cyan tile; no stock art. Reusable `EmptyState` primitive **[to add]** (props: icon, title,
description, action).

---

## 15. Error pages & error states
- **404 / 500 pages**: dark canvas, ambient blobs, large gradient numeral, calm message, primary
  "Back home" + secondary "Contact". On-brand, no jokes that undercut trust.
- **Inline errors**: `--color-error` text/border + retry affordance; toast (Sonner) for transient.
- **Boundaries**: every module wraps a graceful error boundary (retry, offline detection) per master
  rules. Never expose stack traces to users.

---

## 16. Legacy tokens to reconcile (cleanup backlog)
These pre-date the cyan/blue system and should be migrated so the palette is coherent:
1. `globals.css` header comment says "PREMIUM LIGHT THEME" → update to dark. (comment only)
2. `:focus-visible` outline `#7B61FF` (violet) and `::selection` `#7B61FF` → change to brand `#43F5FF`.
3. `.hero-grid`, `.bg-aurora`, `.bg-grid-pattern` use violet `rgba(123,97,255,…)` grid lines →
   retint to cyan/blue.
4. `.bg-radial-glow*` use gold `#D4AF37` / navy → retire or retint (not in current palette).
5. Light scrollbar (`#F4F3F7`) on a dark theme → dark scrollbar track/thumb.
6. `--color-navy`/`navy-2` are set to `#FFFFFF` (legacy remap) — remove or repurpose.
None are urgent (site renders), but 002/003 work should fold these fixes in.

---

## 17. Responsive breakpoints (Tailwind defaults)
| Name | Min width | Target |
|---|---|---|
| (base) | 0 | Mobile |
| `sm` | 640px | Large phone |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Ultra-wide |
Content max width `1200px`. Rules: mobile-first; no horizontal scroll; grids collapse
`lg:grid-cols-3 → sm:grid-cols-2 → grid-cols-1`; tap targets ≥44px; test all five tiers.

---

## 18. Motion principles (summary — full spec in 004)
Motion **enhances usability, never distracts**; always respects `prefers-reduced-motion`
**[in code]** (global reduced-motion block zeroes durations, forces `.reveal` visible).
Standard easing **[in code]**: `cubic-bezier(0.22,1,0.36,1)` (expo-out) for reveals/hovers;
`cubic-bezier(0.16,1,0.3,1)` for card lift. Timings: micro/hover **0.3–0.5s**, reveal **0.8s**,
page/intro **0.9s**, ambient loops **7–18s**. Scroll reveals via `.reveal` + `Reveal` component
(variants up/left/right/scale/blur, `delay` stagger 80–90ms). Details, GSAP/Framer plan, and the
full inventory live in **004 — Motion System**.

---

## 19. Icon system
**[in code]** `lucide-react` is the icon library. Rules: consistent stroke (`1.5–2px`), size steps
16 / 20 / 24px, currentColor so they inherit `text-*`, cyan tile background for feature icons
(`bg-brand/10 border-brand/20`). One icon family only — no mixing sets. Decorative icons get
`aria-hidden`; meaningful icons get labels. Micro-motion via `.icon-anim` (lift+scale on group hover).

---

## 20. Accessibility (WCAG 2.2 AA — enforced)
Contrast ≥4.5:1 body / 3:1 large text (white on `#050608` passes; **check `muted #7B8797` on
`base`** for small text — bump to `slate` where it fails). Visible focus ring on every interactive
element. Full keyboard nav; logical tab order; skip-to-content link **[to add]**. `aria` labels on
icon buttons, `aria-invalid`/`aria-describedby` on fields, live regions for toasts. Reduced-motion
honored. Don't convey meaning by color alone (pair with icon/text).

---

## 21. Definition of done (this system)
A screen is "on-system" when: all colors/spacing/radius/shadow/type come from tokens; it's dark,
glass, cyan/blue; responsive across all five breakpoints with no overflow; has loading + empty +
error states; is keyboard-accessible with visible focus; honors reduced-motion; uses Lucide icons
and the pill-button + card-premium primitives; and introduces **zero** hardcoded magic values.

---
_Status: ✅ complete. Next: 002 — Website CMS Architecture (after review)._
