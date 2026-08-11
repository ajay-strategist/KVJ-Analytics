import { NextResponse, type NextRequest } from "next/server";

/**
 * Page ON/OFF gate. When a page is toggled off in the admin (Global Settings →
 * Page Visibility, stored in page_content `site-settings`), this blocks direct
 * access to that route and sends the visitor home. The nav/footer already hide
 * the link; this closes the back door of typing the URL directly.
 *
 * The visibility map is fetched from Supabase and cached in-memory for 60s so we
 * don't hit the DB on every request.
 */

const GATED = ["/about", "/corporate", "/education", "/products", "/training", "/blog", "/contact"];

let cache: { at: number; vis: Record<string, boolean> } | null = null;

async function getVisibility(): Promise<Record<string, boolean>> {
  if (cache && Date.now() - cache.at < 60_000) return cache.vis;
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
    cache = { at: Date.now(), vis };
    return vis;
  } catch {
    return {};
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
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
    "/about", "/about/:path*",
    "/corporate", "/corporate/:path*",
    "/education", "/education/:path*",
    "/products", "/products/:path*",
    "/training", "/training/:path*",
    "/blog", "/blog/:path*",
    "/contact", "/contact/:path*",
  ],
};
