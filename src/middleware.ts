import { NextResponse, type NextRequest } from "next/server";

/**
 * 1. 301 / 302 Dynamic SEO Redirect Engine
 * 2. Page ON/OFF Visibility Gate
 *
 * Redirects and page visibility maps are cached in-memory for 60s
 * to eliminate DB overhead on public page requests.
 */

const GATED = ["/about", "/corporate", "/education", "/products", "/training", "/blog", "/contact"];

let visCache: { at: number; vis: Record<string, boolean> } | null = null;
let redirectCache: { at: number; map: Record<string, { target: string; type: 301 | 302 }> } | null = null;

async function getVisibility(): Promise<Record<string, boolean>> {
  if (visCache && Date.now() - visCache.at < 60_000) return visCache.vis;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("placeholder")) return {};
  try {
    const res = await fetch(
      `${url}/rest/v1/page_content?slug=eq.site-settings&select=data`,
      { headers: { apikey: key, authorization: `Bearer ${key}` } }
    );
    const rows = (await res.json()) as { data?: { pageVisibility?: Record<string, boolean> } }[];
    const vis = rows?.[0]?.data?.pageVisibility ?? {};
    visCache = { at: Date.now(), vis };
    return vis;
  } catch {
    return {};
  }
}

async function getRedirects(): Promise<Record<string, { target: string; type: 301 | 302 }>> {
  if (redirectCache && Date.now() - redirectCache.at < 60_000) return redirectCache.map;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("placeholder")) {
    try {
      const mockRedirects = require("@/lib/mockSupabase").mockDb.seo_redirects || [];
      const map: Record<string, { target: string; type: 301 | 302 }> = {};
      mockRedirects.forEach((r: any) => {
        if (r.is_active && r.source_path && r.target_path) {
          const src = r.source_path.replace(/\/$/, "") || "/";
          map[src] = { target: r.target_path, type: r.redirect_type === 302 ? 302 : 301 };
        }
      });
      redirectCache = { at: Date.now(), map };
      return map;
    } catch {
      return {};
    }
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/seo_redirects?is_active=eq.true&select=source_path,target_path,redirect_type`,
      { headers: { apikey: key, authorization: `Bearer ${key}` } }
    );
    const rows = (await res.json()) as { source_path: string; target_path: string; redirect_type: number }[];
    const map: Record<string, { target: string; type: 301 | 302 }> = {};
    (rows || []).forEach((r) => {
      if (r.source_path && r.target_path && r.source_path !== r.target_path) {
        const src = r.source_path.replace(/\/$/, "") || "/";
        map[src] = { target: r.target_path, type: r.redirect_type === 302 ? 302 : 301 };
      }
    });
    redirectCache = { at: Date.now(), map };
    return map;
  } catch {
    return {};
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cleanPath = path.replace(/\/$/, "") || "/";

  // 1. Check Dynamic SEO Redirects
  const redirects = await getRedirects();
  if (redirects[cleanPath]) {
    const targetRule = redirects[cleanPath];
    // Safety check against loop
    if (targetRule.target !== cleanPath && targetRule.target !== path) {
      const redirectUrl = new URL(targetRule.target, req.url);
      return NextResponse.redirect(redirectUrl, targetRule.type);
    }
  }

  // 2. Check Page Visibility Gate
  const base = "/" + (path.split("/")[1] || "");
  if (!GATED.includes(base)) return NextResponse.next();

  const vis = await getVisibility();
  if (vis[base] === false) {
    const home = req.nextUrl.clone();
    home.pathname = "/";
    home.search = "";
    return NextResponse.redirect(home);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, files, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};
