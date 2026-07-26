# 006 — Website CMS Builder
**KVJ Analytics Platform V3 · Phase 2 · Website Engine**
How a non-programmer creates and edits pages visually. Builds directly on **002** (block model) and
**003** (component registry). **[in code]** exists, **[to add]** planned.

---

## 1. Goal
Let the CEO/marketing build and edit any marketing page — add/remove/reorder sections, edit copy and
media, set SEO, preview, publish, and roll back — **without touching code**, and **without ever
white-screening the live site** (fallback-merge stays sacred, 002 §1).

---

## 2. From bespoke forms → block builder
Today's editor (`/admin/content`) is a **bespoke form per page** (002 §2). The builder generalizes
this into an ordered list of **sections**, each backed by a 003 component. Migration is per-page and
non-breaking: a page renders block mode when `data.sections` exists, else the legacy layout (002 §5).

---

## 3. Builder UI **[to add]**
Three-pane editor at `/admin/builder/[slug]`:
- **Left — Section list:** ordered, drag-to-reorder (dnd-kit), add (`+` → section-type picker),
  duplicate, delete, hide/show, collapse.
- **Center — Live preview:** the real `SectionRenderer` (002 §4) rendering current draft; device
  toggles (mobile/tablet/desktop) to verify responsive (001 §17); click a section to select it.
- **Right — Inspector:** form for the selected section's `props` + its `blocks[]` (repeatable
  items), plus per-section settings (background variant, spacing, visibility). Fields are generated
  from the section's schema (see §4).

Global bar: page title, **SEO panel** (title/description/canonical/OG image/noindex → 008), status
badge (draft/published), **Preview**, **Save draft**, **Publish**, version menu.

---

## 4. Section schema registry (drives the inspector) **[to add]**
Each section type declares a schema so the inspector renders the right fields automatically — no
bespoke form per page:
```ts
registerSection("cardGrid", {
  component: V3CardGrid,
  label: "Card Grid",
  fields: [
    { key: "eyebrow", type: "text" },
    { key: "heading", type: "text", required: true },
    { key: "description", type: "textarea" },
    { key: "columns", type: "select", options: [2,3,4] },
    { key: "cta", type: "link" },
  ],
  blocks: { type: "card", fields: [
    { key: "title", type: "text", required: true },
    { key: "body", type: "textarea" },
    { key: "points", type: "list" },
  ]},
});
```
Adding a new section = add component (003) + `registerSection` entry. The builder, renderer, and
inspector all read this one registry. Field types: text, textarea, richtext (TipTap), number,
select, toggle, link, media (→ 007 picker), list, color(token), icon(Lucide picker).

---

## 5. Templates & presets **[to add]**
- **Page templates:** starting section-sets ("Solution page", "Landing page", "Simple content
  page") from the V3 content specs — CEO picks one, then edits.
- **Section presets:** saved configured sections reusable across pages.
- **Global/shared sections:** e.g. a promo band edited once, referenced on many pages (by ref, 002).

---

## 6. Draft / preview / publish / versions **[to add]** (data model in 002 §5–6)
- **Autosave** draft to `page_versions` (debounced); "unsaved changes" guard on navigate-away.
- **Preview** `/admin/preview/[slug]?v=draft` — real renderer, exact production output.
- **Publish** — atomic: draft → `page_content.data` published projection + `revalidatePath` (002 §2).
- **Version history** — list, diff (section add/remove/edit), one-click rollback (re-publish a prior
  version). created_by/at feed audit logs (012).
- **Scheduled publish** (optional, later).

---

## 7. Validation & safety
- **Zod schema per section** validates props/blocks on save (002 §8) — reject unknown/oversized.
- Content still governed by 001/CLAUDE.md: CMS overrides design-safe fields; no fabricated stats.
- Admin HTML blocks sanitized + sandboxed (001 §15).
- All writes behind `admin_session` HMAC (`isAdminAuthed`, 012); service role server-only.

---

## 8. Accessibility & UX
Keyboard-operable reordering (dnd-kit keyboard sensor), inspector is a proper form (labels, errors,
001 §11), preview announces selected section, undo/redo, `⌘S` to save. Never lose work on error —
autosave + retry (Sonner toasts).

---

## 9. Build order (when implementation starts)
1. `SectionRenderer` + `SECTION_REGISTRY` (002 §4) — read-only block rendering for one page.
2. Section schema registry + auto-generated inspector (§4).
3. Section list with add/reorder/delete (dnd-kit) + live preview.
4. Draft/version storage (`pages` + `page_versions`, 002 §5) + preview route.
5. Publish + revalidate + rollback.
6. Templates/presets + shared sections.
Ship incrementally; each step is usable before the next.

---

## 10. Definition of done
CEO can create/edit/reorder/preview/publish/rollback a page with zero code · fallback-merge intact ·
new section types are registry-only · drafts never touch live until publish · writes auth+Zod+audited
· builder fully keyboard-accessible · responsive preview matches production.

---
_Status: ✅ complete._
