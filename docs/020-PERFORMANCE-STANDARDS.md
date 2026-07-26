# 020 — Performance Standards
**KVJ Analytics Platform V3 · Phase 6 · Infrastructure**
Speed is part of "premium" (001). Targets + techniques for a fast platform on Next.js 16 + Vercel +
Supabase. **[in code]** partly, **[to add]** planned.

---

## 1. Targets
- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1 (mobile, mid-range device, 4G).
- **Lighthouse** ≥ 90 (Performance/Best-Practices/SEO/Accessibility) on key pages.
- 60fps interactions/animations (004); no jank on scroll; TTFB low via edge/caching.

---

## 2. Rendering & data
- Prefer **Server Components** + streaming; keep client bundles small; `use client` only where needed
  (the FX/forms/dashboards).
- **Caching:** page `revalidate` (in code, 3600s) + tag-based revalidation on CMS publish (002/006);
  cache-friendly GET APIs (011); Supabase query results cached where safe.
- **Queries:** select only needed columns, avoid N+1, index FKs + filter/sort columns (010),
  paginate lists, debounce search (004/005).

---

## 3. Assets
- **Images:** `next/image`, AVIF/WebP, responsive sizes + explicit dimensions (no CLS), lazy below
  the fold (007). Never ship unoptimized originals.
- **Fonts:** self-hosted via `next/font` (Plus Jakarta), `font-display: swap`, preloaded, subset.
- **JS/CSS:** code-split, **dynamic import** heavy/below-fold components (hero canvases, charts,
  editors, TipTap, Recharts), tree-shake, drop unused CSS; defer non-critical scripts (GA/Pixel).
- **Media/CDN:** long-cache + content-hash via Supabase Storage/CDN (007); preconnect to origins.

---

## 4. Motion & runtime (004)
Animate `transform`/`opacity` only; `will-change` sparingly; throttle rAF; pause off-screen
animations/canvases; cap simultaneous ambient effects; virtualize long lists/tables (001 §12).

---

## 5. Lazy & progressive
Lazy-load below-fold sections/media; skeletons for perceived speed (001 §13); prefetch likely-next
routes (Next `<Link>`); optimistic UI on mutations (forms/admin); background-revalidate stale data.

---

## 6. Backend/perf hygiene
Efficient webhook/handlers (return fast, defer heavy work to queues 019); avoid blocking the request
on third-party latency; batch analytics events (016); connection reuse; rate-limit to protect
capacity (011).

---

## 7. Budgets & monitoring
Set per-route JS budget; fail CI on regressions (022); monitor real-user CWV (Vercel Analytics/GA,
016) + synthetic Lighthouse in CI (021). Track bundle size over time.

---

## 8. Definition of done
CWV targets met on mobile · Lighthouse ≥90 key pages · images optimized + sized + lazy · heavy
components dynamically imported · queries indexed + paginated + cache-tagged · 60fps motion, off-screen
paused · budgets enforced in CI · real-user + synthetic monitoring live.

---
_Status: ✅ complete._
