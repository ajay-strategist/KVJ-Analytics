# 004 — Motion System
**KVJ Analytics Platform V3 · Foundation doc ⭐⭐⭐⭐⭐**
The motion language: what moves, how, how fast, and why. Motion is a first-class part of the
"premium · alive" brand (001), but it is **disciplined** — it clarifies, never decorates. Legend:
**[in code]** exists, **[to add]** planned. Grounded in `globals.css` + the FX components.

---

## 1. Principles
1. **Motion serves comprehension.** Every animation answers "where am I / what changed / what's
   next." If it doesn't, remove it.
2. **Fast in, calm out.** Entrances are quick and confident; ambient loops are slow and subtle.
3. **One easing family.** Expo-out `cubic-bezier(0.22,1,0.36,1)` is the house curve **[in code]**;
   `cubic-bezier(0.16,1,0.3,1)` for card lift. Linear only for continuous loops (marquee, spin).
4. **Accessibility is non-negotiable.** `prefers-reduced-motion` disables/curtails everything
   **[in code]** — the global block zeroes durations and forces `.reveal` visible. Never gate
   content behind motion.
5. **Performance first.** Animate only `transform` and `opacity` (GPU); `will-change` on animated
   elements; no layout-thrashing properties (top/left/width) in loops.
6. **Reference feel:** Apple (calm, physical), Stripe (crisp reveals), Linear (snappy micro-motion).
   Restraint over spectacle.

---

## 2. Timing scale **[in code, standardize]**
| Token | Duration | Use |
|---|---|---|
| micro | 0.3s | Hover, button feedback, icon nudge, focus ring |
| base | 0.45–0.5s | Card lift, small transitions |
| reveal | 0.8s | Scroll-in section/element reveal |
| page/intro | 0.9s | Page transition, intro wipe |
| ambient | 7–18s | Blob drift (18s), float (7s), gradient pan (6–8s), marquee (38s) |

Stagger children **80–90ms** apart (matches `Reveal delay` usage in `v3/Sections.tsx`). Never
stagger more than ~6 items or the section feels slow — batch the rest.

Easings **[in code]**: `--ease-out: cubic-bezier(0.22,1,0.36,1)` (default), `--ease-lift:
cubic-bezier(0.16,1,0.3,1)` (cards), `--ease-wipe: cubic-bezier(0.76,0,0.24,1)` (intro). **[to add]**
promote these to named CSS variables so they're referenced, not re-typed.

---

## 3. Scroll reveal (core pattern) **[in code]**
`Reveal` component + `.reveal` CSS. Element starts `opacity:0` + offset; `IntersectionObserver`
adds `.is-visible` → transitions to resting. Variants **[in code]**:
| Variant | From |
|---|---|
| up (default) | `translateY(28px)` |
| left / right | `translateX(∓46px)` |
| scale | `scale(0.9)` |
| blur | `translateY(20px) + blur(14px)` |

Rules: reveal **once** (don't re-hide on scroll-up); thresholds so it fires slightly before fully in
view; group a section's heading + cards with staggered `delay`; text-heavy blocks use `up`/`blur`,
side content uses `left`/`right`. `RevealText` for word/line heading reveals.

---

## 4. Global FX (public layout) **[in code]**
| FX | Component | Behavior |
|---|---|---|
| Smooth scroll | `SmoothScroll` (Lenis) | Eased momentum scrolling; required CSS in globals. |
| Scroll progress | `ScrollProgress` | Top 3px bar, `scaleX` origin-left, cyan→teal→blue gradient + glow. |
| Custom cursor | `CursorGlow` | Dot (lerp 0.3) + lagging ring (lerp 0.12); ring expands + glows on interactive hover; desktop + fine-pointer only; disabled for reduced-motion/coarse. Re-binds on DOM mutation. |
| Intro loader | `IntroLoader` | Counter 00→100% + progress bar → `intro-wipe` up reveal. Once per session. |
| WhatsApp float | `WhatsAppFloat` | Persistent floating action. |
| Magnetic | `Magnetic` | Cursor-follow magnet on wrapped interactive elements. |

Rules: global FX must be cheap (rAF loops throttled, passive listeners) and fully bypassed under
reduced-motion / touch where noted.

---

## 5. Micro-interactions **[in code]**
- **Buttons:** hover glow/lift, active press, focus-visible ring (001 §9). Optional
  `.btn-sweeping-border` (conic sweep) + `.sheen` (metallic pass) for emphasis — sparingly.
- **Cards:** `.card-premium` hover = `translateY(-6px)` + border/glow intensify + gradient-border
  brighten (`::before`). `.card-glass` lighter variant for heroes.
- **Icons:** `.icon-anim` lift+scale on group hover.
- **Images:** `.img-zoom` scale 1.05 on hover.
- **Links:** arrow `translateX` on hover (hero secondary CTA pattern).

---

## 6. Ambient & signature motion **[in code]**
| Effect | Class / keyframe | Use |
|---|---|---|
| Blob drift | `.animate-blob` / `blob-drift` (18s) | Hero/section ambient glows. |
| Float | `.animate-float` / `float-slow` (7s) | Floating accents/visuals. |
| Gradient pan | `.text-gradient-flow`, `.signature-gradient-text` / `gradient-pan` | Accent headings/words only (never long copy). |
| Marquee | `.animate-marquee(-reverse)` | Logo/testimonial strips; pause on hover. |
| Glow pulse | `.animate-glow-pulse`, `.holo-card`/`holo-pulse` | Subtle attention on key surfaces. |
| Scroll hint | `.animate-scroll-hint` | Hero "scroll down" cue. |
| Spin | `.animate-spin-slow` (20s) | Decorative orbits. |
| Liquid glow / sweep / data-waves | `.animate-liquid-glow`, `.btn-sweeping-border`, `.data-waves-bg` | Futuristic dark accents — use rarely. **[reconcile]** these use legacy `#00F0FF/#0072FF`; retint to brand cyan/blue (001 §16). |

Rule: at most **one** ambient/signature effect competing for attention per viewport.

---

## 7. Loading & transitions
- **Skeletons** (preferred) for content loads — shimmer blocks matching layout (001 §13). **[to add]**
  `Skeleton` primitive + shimmer keyframe.
- **Button loading:** spinner + disabled + fixed width.
- **Page transitions [to add]:** subtle fade/slide on route change (App Router `template.tsx` or
  Framer `AnimatePresence`); ≤0.4s; never block interaction.
- **Intro wipe [in code]** is the app-load treatment; don't repeat per navigation.

---

## 8. Library strategy — CSS-first, Framer/GSAP where they earn it
Default (**option A, in code**): CSS transitions/keyframes + `IntersectionObserver` (`Reveal`) +
Lenis + rAF (cursor). Zero-dependency, fast, SSR-safe, already shipping. **This stays the baseline.**

Introduce libraries **only** where the primitive can't express the interaction, behind the same
component APIs (so pages don't change):
- **Framer Motion [to add]** — orchestrated sequences, shared-layout transitions, `AnimatePresence`
  (route/modal enter-exit), gesture springs. Swap inside `Reveal`/`V3Hero`/modals without touching
  callers.
- **GSAP + ScrollTrigger [to add]** — scroll-storytelling / pinned timelines / complex scrubbed
  sequences (e.g. a hero data-viz that animates as you scroll). Only for bespoke narrative sections.
- **Lottie [to add]** — vector micro-animations (empty states, success ticks, feature loops); keep
  files small, pause off-screen, respect reduced-motion.

Decision gate before adding a lib: can CSS + Reveal do it acceptably? If yes, don't add the dep.
All three require `npm install` on the dev machine (sandbox can't verify a Next build — CLAUDE.md).

---

## 9. Reduced motion **[in code]**
Global block: `prefers-reduced-motion: reduce` → `scroll-behavior:auto`, all animation/transition
durations `~0`, `.reveal` forced visible. Additionally: `CursorGlow` early-returns; disable Lenis
smooth-scroll; swap ambient loops for static; page transitions become instant. **Content parity:**
nothing is only reachable via motion.

---

## 10. Performance budget
- Animate `transform`/`opacity` only; `will-change` on active elements, removed after.
- rAF loops passive + throttled; disconnect observers on unmount (cursor already does).
- Ambient loops GPU-composited; cap simultaneous animated blobs (~2/viewport).
- Lazy-mount heavy canvases (`HeroCanvas`, `HeroDashboardCanvas`) below the fold; pause off-screen.
- Target 60fps; no jank on mid-range mobile; no CLS from entrance animations (reserve space).

---

## 11. Definition of done (motion work)
Uses the house easing + timing scale · `transform`/`opacity` only · reveals once, staggered ≤6 ·
reduced-motion fully honored with content parity · no CLS/jank, 60fps · at most one signature effect
per viewport · any new lib passes the §8 decision gate and hides behind an existing component API ·
legacy neon colors retinted to brand (001 §16).

---
_Status: ✅ complete. Next: 005 — Navigation System (after review)._
