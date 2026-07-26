# 007 — Media Management System
**KVJ Analytics Platform V3 · Phase 2 · Website Engine**
How images, video, PDFs, HTML packages, and animations are uploaded, stored, optimized, organized,
and referenced across the CMS/LMS. **[in code]** exists, **[to add]** planned.

---

## 1. Current state **[in code]**
`POST /api/admin/upload` → Supabase Storage; returns a public URL that admins paste into fields.
No library, folders, reuse, optimization, or metadata. Works, but doesn't scale.

---

## 2. Target: a real media library
A first-class **Media Library** (`/admin/media`) that every editor (CMS builder 006, course/lesson
builder, blog) picks from — assets are **referenced by id**, never re-uploaded or inlined.

### Data model **[to add]**
`media_assets` (id, type, filename, storage_path, public_url, width, height, size_bytes, mime,
alt_text, title, folder_id, uploaded_by, created_at, checksum). `media_folders` (id, name, parent_id).
CMS blocks store `mediaRef` (asset id) → resolved at render (002 §4).

### Supported types
Image (png/jpg/webp/avif/svg) · Video (mp4/webm) · Audio · PDF · PowerPoint · **HTML packages**
(interactive lessons, LMS spec) · Lottie (json) · downloads (zip/xlsx). Each type has a preview.

---

## 3. Library UI **[to add]**
Grid/list of assets with thumbnails, search, filter by type/folder, sort (recent/name/size),
folders (create/move/rename), bulk select/delete, and an **asset detail** panel (alt text, title,
dimensions, size, usage — "used on 3 pages"). A reusable **MediaPicker** modal is the single insert
point used by every field of type `media` (006 §4).

---

## 4. Upload pipeline **[to add]**
Drag-drop / file-picker → validate (type allowlist, max size, dimensions) → **optimize** →
store → create `media_assets` row → return ref. Optimization:
- **Images:** compress + generate responsive sizes (thumb/sm/md/lg) + prefer **AVIF/WebP**; store
  original + derivatives; capture width/height (prevents CLS, 004). Use `next/image` on render.
- **Crop/resize** in-browser before upload (focal point for hero crops).
- **SVG:** sanitize (strip scripts) before store.
- **Video:** poster-frame extraction; recommend external host (YouTube/Vimeo) for large video.
- **Checksum dedupe:** identical uploads reuse the existing asset.

---

## 5. HTML packages (interactive lessons) — security-critical (LMS spec)
Admin uploads an HTML/CSS/JS bundle → stored as a package → rendered in a **sandboxed iframe** in the
lesson/activity player, **never downloaded**. The LMS↔lesson bridge (`LMS.completeActivity({score,
timeSpent,completed})`) posts messages across a controlled channel (`postMessage` with origin +
schema checks). Sandbox attributes restrict capabilities; no access to parent DOM/cookies/storage.
Full engine detail in 015 / LMS-PLATFORM-SPEC.

---

## 6. Delivery & performance (ties to 020)
Serve via Supabase Storage/CDN with long cache headers + content hashing; `next/image` for responsive
images + lazy-loading; lazy-load below-the-fold media; preconnect to storage origin; poster + lazy
for video. Never ship an unoptimized original to the client.

---

## 7. Governance & a11y
`alt_text` required for images (enforced in picker; a11y 001 §20 + SEO 008). Uploads auth-gated
(admin), type-allowlisted, size-limited, SVG-sanitized (012 secure uploads). Track `uploaded_by` +
usage for audit. Right-to-use: only assets KVJ owns/licenses (no scraped/stock-clipart, per brand 001).

---

## 8. Build order
1. `media_assets`/`media_folders` tables + migrate existing uploads to rows.
2. Upload pipeline with image optimization + responsive derivatives.
3. Library UI + MediaPicker modal; wire into CMS builder + blog + course editors.
4. HTML-package sandbox rendering + bridge (with 015).
5. Folders, usage tracking, dedupe, video posters.

---

## 9. Definition of done
Assets uploaded once, referenced by id everywhere · images auto-optimized + responsive + alt-required ·
HTML packages sandboxed with secure bridge · picker is the single insert point · uploads
auth+validated+sanitized · CDN-cached, lazy, no CLS.

---
_Status: ✅ complete._
