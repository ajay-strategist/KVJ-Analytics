# KVJ Analytics — Website Modification Task List

This task list tracks ongoing modifications and fixes for the website.

---

## 🚀 Active / Pending Fixes

### 1. About Page Card Styling & Icons
- [x] Change specialization cards on About page to dark green theme (`bg-[#0B2A22]`).
- [x] Map specialization icons and render them inside the cards.

### 2. Admin Panel Specialization Icons
- [x] Support normalization of specialization strings to objects with icons.
- [x] Implement specialization item icon picker inside the About page editor.

### 3. Admin Panel Animation Removal
- [x] Set up global CSS rules to disable transitions and animations in `.admin-light`.
- [x] Add `admin-light` class to `AdminLoginPage` to remove login screen animations.

### 4. CTA Section Readability Fixes
- [x] Make CTA card background solid `bg-[#0B2A22]` (100% opacity) across shared CTA, Corporate, and Education pages.
- [x] Change description text style from `font-light text-[#E2EFE9]` to `font-normal text-emerald-50/90` for accessible contrast.

### 5. Products Page Card Text Readability
- [x] Fix white-on-white text inside product cards by preventing `.hero-emerald` dark-mode overrides from applying to nested cards (`card-tone-*`, `bg-white`, `bg-card`).

### 6. Verification & Diagnostics
- [x] Run `npx tsc --noEmit` to ensure TypeScript compilation passes.
- [x] Verify that card text and icons display correctly with high contrast.
- [x] Verify that admin actions are snappy with no animation delay.
