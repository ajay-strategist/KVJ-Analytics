# Claude Code Prompt — KVJ Analytics UI/UX Polish (Emerald Light Theme)

> Paste everything below into Claude Code, from the repo root.

---

You are a senior UI/UX + front-end engineer. The KVJ Analytics site (Next.js 16, React 19,
TypeScript, Tailwind v4 with `@theme` tokens in `src/app/globals.css`, Supabase-backed CMS)
was just converted to a **bright "Emerald Fresh" light theme with dark-emerald hero bands**.
Your job is to raise the whole site to a polished, cohesive, premium look — with special focus
on **giving cards tasteful color** instead of flat white. Read `CLAUDE.md` and
`docs/MASTER_IMPLEMENTATION_RULES.md` first.

## Non-negotiable guardrails
1. **Content is CEO-locked.** Do NOT change any approved copy (in `src/lib/constants.ts`
   `FALLBACK_*`). Never fabricate stats, testimonials, logos, or history. Design/layout/color only.
2. **Use design tokens, not raw hex.** Style with token classes (`bg-card`, `bg-surface`,
   `text-ink`, `text-slate`, `text-muted`, `text-brand`, `border-line`, `bg-brand`, etc.) and the
   new tinted-card classes you add. Avoid hardcoding hex in components. If you need a new shade,
   add it to `globals.css`.
3. **Keep the fallback-merge pattern.** Public pages read CMS content merged over `FALLBACK_*`.
   Don't break it.
4. **Do NOT break** the admin panel, LMS, auth, or payments. The admin uses `.admin-light`
   token overrides — leave those alone. Additive changes preferred.
5. **Verify after every change set with `npx tsc --noEmit`.** The build ignores TS errors, so
   also sanity-check logic. Duplicate routes / missing default exports DO fail the build.
6. Next 16: server-component `params`/`searchParams` are Promises → `await` them.

## Theme facts you must respect
- Palette (in `@theme`): base `#FFFFFF`, alt/surface mint `#F5FCF8`/`#EDFBF4`, ink deep-green
  `#0B2A22`, slate `#3F5A50`, muted `#8AA69A`, brand emerald `#059669`, corporate teal `#0D9488`,
  education `#059669`, cta amber `#F59E0B`. Font: Plus Jakarta Sans.
- Dark hero/showcase bands use the `.hero-emerald` class (deep-green gradient) with white text.
  Keep those as intentional dark bands.
- These files are still **dark-built end-to-end** and currently render fully dark-emerald:
  `src/components/AboutClient.tsx`, `src/components/TrainingHubClient.tsx`,
  `src/components/OnlineCoursesClient.tsx`, `src/components/CategoryPageClient.tsx`,
  `src/app/(website)/contact/page.tsx`. See Task 5.

## Task 1 — Add a tinted "Card tone" system (the main ask)
Cards are currently flat white (`bg-card` + `border-line`). Introduce a small, reusable set of
**soft color tones** so cards read by category and feel lively but still professional. Add these
utility classes to `globals.css` (light-mode values; all text on them must pass WCAG AA):

| Tone | Background | Border | Accent text/icon |
|------|-----------|--------|------------------|
| emerald | `#ECFDF5` | `#A7F3D0` | `#047857` |
| teal | `#F0FDFA` | `#99F6E4` | `#0F766E` |
| amber | `#FFFBEB` | `#FDE68A` | `#B45309` |
| violet | `#F5F3FF` | `#DDD6FE` | `#6D28D9` |
| blue | `#EFF6FF` | `#BFDBFE` | `#1D4ED8` |
| neutral | `#FFFFFF` | `var(--color-line)` | `var(--color-ink)` |

Implement as `.card-tone-emerald { background:…; border-color:…; }` etc., plus a matching
`.card-accent-emerald { color:… }` for the icon/eyebrow. Then extend the shared `Card`
(`src/components/ui/Card.tsx`) with an optional `tone` prop (default `neutral`) that applies the
classes, keeps the existing radius/shadow/hover, and on hover deepens the border + lifts slightly.
Icon chips inside a toned card should use the tone's accent on a 10–12% tint background.

**Map tones to content** (so color encodes meaning, not decoration):
- Corporate cards/sections → `teal`
- Educational cards/sections → `emerald`
- Products → `violet`
- Training → `amber`
- Industries grid → rotate emerald/teal/blue by group, not rainbow per-item
- Testimonials/Case studies → `neutral` with an emerald accent bar

Apply the tones to: `ServiceCard`, `SegmentCard`, `NumberedCard`, `CaseStudiesSection`,
`TestimonialsSection`, the Industries grid, and the Training "Integrated Learning Tools" cards.
Keep it restrained — one tone per section, generous whitespace.

## Task 2 — Visual consistency pass
- Unify card radius, padding, border weight, and shadow across all card components (match the
  `Card` primitive). Remove one-off inline styles that fight the tokens.
- Standardize the type scale (hero, h2, h3, body, caption) and spacing rhythm between sections
  (consistent `py` on `Section`).
- Consistent buttons: primary = emerald fill + white text; secondary = outline; make sure filled
  buttons never end up with dark text on a dark fill.
- Hover/focus states everywhere (cards lift, links underline, visible keyboard focus rings).

## Task 3 — Contrast & accessibility
- Audit text on every tinted background and on `.hero-emerald` for WCAG AA. Fix any low-contrast
  labels (e.g. `text-slate/70` on tint).
- Ensure the amber CTA color has dark-enough text where used as text, and white text when used as
  a button fill.
- Respect `prefers-reduced-motion` (already partly wired) and keyboard navigation.

## Task 4 — Performance / motion cleanup
- Keep motion tasteful: entrance reveals + light hover transforms only. Do not re-introduce the
  disabled looping effects (`.holo-pulse`, `.beam`, `.particle-field`, `.aura` are intentionally
  off). Reduce any remaining giant animated `blur-[120px]+` glows that pulse continuously.
- Wire Lenis → GSAP ScrollTrigger in `src/components/SmoothScroll.tsx`
  (`lenis.on('scroll', ScrollTrigger.update)` + one shared rAF + `ScrollTrigger.refresh()` on load)
  so inner-page scroll animations fire at the correct position.

## Task 5 — Lighten the dark-built pages (do one at a time, verify each)
For each of `AboutClient`, `TrainingHubClient`, `OnlineCoursesClient`, `CategoryPageClient`,
`contact/page.tsx`: convert the page body from dark to the bright theme while keeping the top
hero as a `.hero-emerald` dark band. Concretely: change the page wrapper from
`hero-emerald text-zinc-200` to a light wrapper (`bg-base text-slate`), then within the body swap
`text-white`→`text-ink`, `text-zinc-300/400`→`text-slate`, `text-zinc-500`→`text-muted`,
translucent-white fills (`bg-white/[0.0x]`)→`bg-surface` or a card tone, and `border-white/10`→
`border-line`. **Do NOT** blind-swap `text-white` on buttons/emerald fills — keep white text on
colored fills. Take a screenshot mentally section by section; headings and body must be dark on light.

## Acceptance criteria
- `npx tsc --noEmit` passes.
- No white-on-white or dark-on-dark text anywhere; every card/section is legible.
- Cards are tastefully colored by category; the site feels cohesive, premium, and bright.
- Heroes remain elegant dark-emerald bands.
- Admin panel, LMS, auth, payments untouched and working.
- No fabricated content; approved copy unchanged.

Work in small, verifiable commits (e.g. "card tone system", "corporate + education tones",
"lighten About page"). After each, run `npx tsc --noEmit` and summarize what changed.
