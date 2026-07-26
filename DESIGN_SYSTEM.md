# KVJ Analytics — Premium Design System (Light Theme)

A bright, premium, professional system. **No dark theme.** Built around the two-segment identity (Corporate = blue, Education = teal) with a single high-contrast conversion accent.

## 1. Color Theme — "Azure & Teal"

**Brand & segment**
| Token | Hex | Use |
|---|---|---|
| `--brand` (Royal Blue) | `#1D4ED8` | Primary brand, links, corporate segment |
| `--brand-700` | `#1E40AF` | Hover/pressed |
| `--navy` (Ink sections) | `#0B1F3A` | Footer & occasional deep feature bands (not full dark mode) |
| `--corporate` | `#2563EB` | Corporate segment accent |
| `--education` | `#0D9488` | Education segment accent (teal) |

**Conversion accent (use sparingly — primary CTAs only)**
| `--cta` (Amber Gold) | `#F59E0B` | Primary CTA buttons, key highlights |
| `--cta-600` | `#D97706` | CTA hover |

**Neutrals (light base)**
| `--ink` | `#0F172A` | Headings/body text |
| `--slate` | `#475569` | Secondary text |
| `--muted` | `#94A3B8` | Captions, placeholders |
| `--line` | `#E2E8F0` | Borders/hairlines |
| `--surface` | `#F8FAFC` | Page background / alt sections |
| `--card` | `#FFFFFF` | Cards/surfaces |

**Status:** Success `#16A34A` · Warning `#F59E0B` · Error `#DC2626`.

**Signature gradient:** `linear-gradient(135deg, #1D4ED8 0%, #0D9488 100%)` (blue→teal) for heroes, segment cards, metric bands — echoes the brand's blue identity while uniting both segments.

**Contrast:** all text meets WCAG AA. CTA amber uses `--ink` text on it for max legibility.

## 2. Typography
- **Display / Headings:** `Sora` (600/700) — modern, premium, confident.
- **Body:** `Inter` (400/500).
- **Metrics/numbers:** `Sora` 700 for big animated counters.

**Scale (desktop → mobile):**
- Display (hero): 56 / 36px, weight 700, line-height 1.05, tight tracking
- H1: 40 / 30 · H2: 32 / 24 · H3: 24 / 20
- Body: 17px / 1.6 · Small: 14px · Eyebrow: 12px uppercase, letter-spacing 0.12em, color `--brand`/segment

## 3. Layout & Spacing
- 8px spacing base; section padding 96–120px desktop / 56–64px mobile.
- Max content width 1200px; generous whitespace (premium = breathing room).
- 12-col responsive grid.

## 4. Shape, Elevation, Motion
- Radius: cards 16px, buttons 10px, inputs 10px, pills full.
- Shadows: soft & layered — `0 1px 2px rgba(15,23,42,.06)`, hover `0 12px 32px rgba(29,78,216,.12)`.
- Motion: 200–300ms ease; fade-up on scroll; count-up on metrics; subtle hover lift on cards. Respect `prefers-reduced-motion`.

## 5. Core Components (premium styling)
- **Buttons:** Primary = amber CTA (ink text); Secondary = brand-blue outline; Ghost = text+arrow. Generous padding, 10px radius, hover lift.
- **SegmentCard:** large split cards (Corporate blue / Education teal) with icon, bold statement, short line, arrow.
- **OfferingRow:** alternating image/text, eyebrow + bold statement + short copy + Learn More.
- **MetricCounter:** big Sora numerals, animated, on gradient or white band.
- **NumberedCard:** 01–06 "why us" cards with hairline borders.
- **LogoStrip / Testimonial / CTASection:** rounded, soft shadow, gradient CTA band.
- **Forms:** large inputs, clear labels, inline validation, amber submit, success state.

## 6. Imagery & Icons
- Clean dashboard/data-viz visuals, abstract blue→teal gradients, authentic training photos.
- Line-style icons (consistent stroke). Every service/feature gets an icon.

## 7. Antigravity prompt (paste with Step 1 / Phase 0)

```
Implement this LIGHT premium design system (no dark theme) as Tailwind theme tokens + components.

COLORS (CSS variables + tailwind.config):
  brand #1D4ED8, brand-700 #1E40AF, navy #0B1F3A, corporate #2563EB, education #0D9488,
  cta #F59E0B, cta-600 #D97706, ink #0F172A, slate #475569, muted #94A3B8,
  line #E2E8F0, surface #F8FAFC, card #FFFFFF, success #16A34A, error #DC2626.
  Signature gradient: linear-gradient(135deg,#1D4ED8,#0D9488).

TYPOGRAPHY: headings "Sora" (600/700), body "Inter" (400/500) via next/font. Scale: hero 56/36, H1 40/30, H2 32/24, H3 24/20, body 17/1.6, eyebrow 12 uppercase tracked.

SHAPE/MOTION: card radius 16, button radius 10; soft layered shadows; 200–300ms ease; fade-up on scroll; animated count-up metrics; hover lift; honor prefers-reduced-motion.

COMPONENTS: Button (primary=amber CTA with ink text, secondary=brand outline, ghost), SegmentCard (corporate=blue, education=teal), OfferingRow (alternating image/text), MetricCounter, NumberedCard, LogoStrip, Testimonial, CTASection, Form controls. 

Corporate sections accent in blue, Education sections accent in teal, primary CTAs in amber. Generous whitespace, max width 1200px, fully responsive, WCAG AA contrast. Make brand/accent colors and fonts configurable in one theme file so they can be tuned later.
```
