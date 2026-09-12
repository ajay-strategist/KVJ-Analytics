/**
 * mediaUrl.ts — turn "share" links into direct, embeddable image URLs.
 *
 * People naturally copy the *share* link from Google Drive / OneDrive, but those
 * links point at a viewer PAGE, not the raw image — so pasting them into an <img>
 * gives a broken image. `toDirectImageUrl` rewrites the common share-link shapes
 * into a URL that a browser can render directly.
 *
 * Anything it doesn't recognise (a normal https image URL, a Supabase CDN URL,
 * an already-direct link) is returned unchanged, so it is always safe to call.
 *
 * Works in the browser and on the server (no DOM / Node-only APIs beyond a
 * base64 shim that picks btoa or Buffer automatically).
 */

/** base64-encode a UTF-8 string in either the browser or Node. */
function base64(input: string): string {
  if (typeof btoa === "function") {
    // encodeURIComponent + unescape handles non-ASCII characters safely.
    return btoa(unescape(encodeURIComponent(input)));
  }
  // Node / server component fallback.
  return Buffer.from(input, "utf-8").toString("base64");
}

/** Extract a Google Drive file id from any of its link shapes. */
export function googleDriveId(inputUrl: string): string | null {
  if (!inputUrl) return null;
  // Decode HTML entities like &amp; to &
  const url = inputUrl.replace(/&amp;/g, "&");

  // 1. /file/d/<id> or /file/u/0/d/<id> or /u/1/d/<id>
  const fileMatch = url.match(/\/(?:file|u\/\d+)\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{10,})/i) ||
                    url.match(/\/file\/d\/([A-Za-z0-9_-]{10,})/i);
  if (fileMatch) return fileMatch[1];

  // 2. Query param: id=<id>
  const queryMatch = url.match(/[?&]id=([A-Za-z0-9_-]{10,})/i);
  if (queryMatch) return queryMatch[1];

  // 3. lh3.googleusercontent.com/d/<id>
  const lh3Match = url.match(/googleusercontent\.com\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{10,})/i);
  if (lh3Match) return lh3Match[1];

  return null;
}

/** Get fallback URLs in order of preference for a Google Drive file id */
export function getGoogleDriveFallbackUrls(id: string): string[] {
  return [
    `https://lh3.googleusercontent.com/d/${id}`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    `/api/media-proxy?id=${id}`,
  ];
}

/**
 * Convert a pasted link into a direct-image URL.
 * Returns the input untouched if it's already direct or unrecognised.
 */
export function toDirectImageUrl(input: string): string {
  const url = (input || "").trim();
  if (!url) return "";

  // Only touch http(s) links; leave data: URIs, relative paths, etc. alone.
  if (!/^https?:\/\//i.test(url)) return url;

  // ---- Google Drive ---------------------------------------------------------
  if (/(?:drive|docs)\.google\.com|googleusercontent\.com/i.test(url)) {
    const id = googleDriveId(url);
    if (id) {
      // lh3.googleusercontent.com/d/<id> is the most reliable hotlink target —
      // it serves the raw bytes with no "virus scan" interstitial.
      return `https://lh3.googleusercontent.com/d/${id}`;
    }
    return url;
  }

  // ---- OneDrive (personal) & 1drv.ms short links ----------------------------
  // The OneDrive "shares" API renders any sharing URL as its raw content when
  // the URL is base64url-encoded and prefixed with "u!".
  if (/1drv\.ms/i.test(url) || /onedrive\.live\.com/i.test(url)) {
    const token =
      "u!" +
      base64(url).replace(/=+$/, "").replace(/\//g, "_").replace(/\+/g, "-");
    return `https://api.onedrive.com/v1.0/shares/${token}/root/content`;
  }

  // ---- OneDrive / SharePoint for Business -----------------------------------
  // Personal-vs-business is hard to tell apart from the URL alone; for business
  // sharing links the reliable trick is forcing a raw download.
  if (/sharepoint\.com/i.test(url) || /-my\.sharepoint\.com/i.test(url)) {
    if (/[?&]download=1/i.test(url)) return url;
    return url + (url.includes("?") ? "&" : "?") + "download=1";
  }

  // ---- Dropbox --------------------------------------------------------------
  if (/dropbox\.com/i.test(url)) {
    return url.replace("?dl=0", "?raw=1").replace("&dl=0", "&raw=1");
  }

  // Anything else (Supabase CDN, Unsplash, a normal .jpg URL, …) — unchanged.
  return url;
}

/** True when the converter would change this input (used to show a hint in UI). */
export function isShareLink(input: string): boolean {
  const url = (input || "").trim();
  if (!url) return false;
  return toDirectImageUrl(url) !== url;
}
