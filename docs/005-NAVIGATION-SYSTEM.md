# 005 — Navigation System
**KVJ Analytics Platform V3 · Foundation doc ⭐⭐⭐⭐**
Every way a user moves through the platform: public header/footer, mobile, mega menu, admin/student
sidebars, breadcrumbs, search, command palette, sticky behavior, quick actions. Nav is where "where
am I / what can I do / what's next" (001) is answered most. **[in code]** exists, **[to add]** planned.

---

## 1. Principles
Orientation always visible (active state), reachability in ≤2 taps to any primary destination,
keyboard + touch + screen-reader complete, CMS-driven labels/links (nothing hardcoded), consistent
across public + app. Nav chrome is glass over the dark canvas (001), motion is snappy micro (004).

---

## 2. Public header **[in code — `components/Header.tsx`]**
Floating **pill** header: `fixed`, centered, `max-w-1400px`, `rounded-full`, `border-line`,
`bg-glass-card`, `backdrop-blur-22px`. Behavior:
- **Scroll-shrink [in code]:** past 20px it tightens (`top-2 py-2`, stronger shadow) — the sticky
  treatment. House easing `cubic-bezier(0.22,1,0.36,1)`.
- **CMS-driven [in code]:** `navItems` + `contactInfo` come from `site-settings` (`FALLBACK_SITE_SETTINGS`).
- **Active state [in code]:** exact match or `startsWith` (non-home) → cyan label + animated
  underline (`after` scale-x) + glow.
- **Desktop:** logo · nav links · phone quick-contact · primary CTA.
- **Mobile:** logo · hamburger (`Menu`/`X`) → drawer (`mobileMenuOpen`).
- **Auth sync [in code]:** subscribes to Supabase `onAuthStateChange`, writes `sb-access-token`
  cookie for server route verification. (Keep — it's how server components see the session.)

**[to add]:** skip-to-content link (a11y, 001 §20); `aria-current="page"` on active link;
focus-trap + `Esc`-to-close + scroll-lock on the mobile drawer; auth-aware right side (Sign in vs
avatar/account menu when logged in).

---

## 3. Mega menu **[to add]**
For sections with children (Corporate Solutions, Educational Solutions, Products, Learn), a hover/
focus **mega panel** under the pill: glass card, 2–4 columns of grouped links with icon + label +
one-line description, optional featured tile (e.g. "New: Power BI course"). Requirements:
- CMS-driven groups (extend `site-settings.navItems` to allow `children[]` with description/icon).
- Keyboard: open on focus, arrow-key traverse, `Esc` closes, focus returns to trigger.
- Touch/mobile: mega content collapses into the drawer as expandable accordions.
- Delay-close (hover intent) so it doesn't flicker; never trap the pointer.

---

## 4. Mobile navigation **[in code → enhance]**
Hamburger → full-height glass drawer. Target: slide/fade in (≤0.4s, 004), scroll-locked body,
focus-trapped, `Esc` + backdrop-tap close, expandable groups for mega sections, auth actions + phone/
WhatsApp at the bottom. Bottom-sheet quick actions optional for the app.

---

## 5. Footer **[in code — `components/Footer.tsx`]**
CMS-driven (`site-settings`): brand + tagline, grouped link columns (Company / Solutions / Learn /
Legal), contact (phones/email/address), social links **[user to provide URLs]**, newsletter signup
(→ 009), copyright. Dark, `border-line` top divider. Ensure all links resolve (footer link fixes
already applied per CLAUDE.md gotchas). Newsletter = real form with validation (009), not decorative.

---

## 6. Breadcrumbs **[to add]**
On detail/nested routes (`/corporate/[slug]`, `/training/[slug]`, `/blog/[slug]`, admin subpages).
`Breadcrumb` component: Home › Section ›  Current, last item non-link + `aria-current`, truncation on
mobile, JSON-LD `BreadcrumbList` (feeds 008 SEO). Data derived from route + record title.

---

## 7. Search **[to add]**
- **Public site search:** courses + blog + pages. Input in header (expandable) or `/search`;
  debounced (004), keyboard-navigable results, empty/no-results states (001).
- **In-catalog search + filters:** on `/training/*` and `/blog` — `Search` + `FilterBar` (003)
  (category, difficulty, learning method). URL-synced query params for shareable/back-button-safe state.

---

## 8. Command palette **[to add]**
`⌘K` / `Ctrl-K` overlay — primarily for **admin** and **student dashboard** (power-user nav +
actions: jump to any page/course/lead, "Create course", "New blog post"). Fuzzy search, grouped
results, recent items, keyboard-only operable, `Esc` closes. Could later host the Growth-OS AI
assistant (008/018) as a command mode.

---

## 9. Admin & student navigation **[in code (admin) → formalize]**
- **Admin sidebar:** the `/admin/*` panel (content, courses, categories, unlock-codes, internships,
  jobs, blog, leads, inquiries, applications, enrollments, batches, clients, testimonials,
  case-studies, team). Target: grouped, collapsible sidebar matching the 24-doc module map (dashboard,
  users, courses, learning paths, modules, lessons, activities, assessments, question bank, mock,
  final exams, certificates, vouchers, corporate, internships, payments, reports, analytics,
  settings) with active state, role-gated visibility (013 RBAC), breadcrumb header, `⌘K`.
- **Student dashboard nav:** sidebar/topbar for Continue Learning · My Courses · Available · Progress ·
  Certificates · Assessments · Notifications (LMS spec). Buy-in-dashboard, never bounce to public site.

---

## 10. Sticky & scroll behaviors
Header scroll-shrink **[in code]**. `ScrollProgress` bar (004) on articles/long pages. Optional
sticky in-page section nav (About/Corporate long pages) + "back to top". Sticky elements never
cover focused inputs; respect safe-area insets on mobile.

---

## 11. Quick actions
Persistent `WhatsAppFloat` **[in code]**. Contextual primary action per surface (e.g. "Enroll",
"Contact", "Apply"). Admin: `⌘K` + per-list "New" button. Keep to one floating action per viewport.

---

## 12. Accessibility (nav-specific)
Skip link; `<nav aria-label>` per landmark (primary, footer, breadcrumb); `aria-current="page"`;
mega/drawer/palette focus-trapped with `Esc` + focus-return; all operable by keyboard; visible focus
(001 §20); active state not color-only (underline/weight too). Announce route changes to SR **[to add]**.

---

## 13. Definition of done (nav work)
CMS-driven labels/links · active + `aria-current` everywhere · mega/drawer/palette keyboard-complete
with focus management · breadcrumbs + JSON-LD on nested routes · search URL-synced with empty/error
states · role-gated admin nav (013) · sticky respects focus/safe-area · skip link present · on-system
glass + house motion.

---
_Status: ✅ complete. **Phase 1 — Foundation (001–005) complete.** Next: 006 — Website CMS Builder (after review)._
