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
function googleDriveId(url: string): string | null {
  // https://drive.google.com/file/d/<id>/view?usp=sharing
  // https://drive.google.com/open?id=<id>
  // https://drive.google.com/uc?export=view&id=<id>
  // https://docs.google.com/uc?id=<id>
  const m =
    url.match(/\/file\/d\/([A-Za-z0-9_-]{10,})/) ||
    url.match(/[?&]id=([A-Za-z0-9_-]{10,})/);
  return m ? m[1] : null;
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
  if (/(?:drive|docs)\.google\.com/i.test(url)) {
    const id = googleDriveId(url);
    if (id) {
      // lh3.googleusercontent.com/d/<id> is the most reliable hotlink target —
      // it serves the raw bytes with no "virus scan" interstitial and supports
      // on-the-fly sizing (append =w1600 etc. if ever needed).
      return `https://lh3.googleusercontent.com/d/${id}`;
    }
    return url;
  }

  // Already a Google user-content link — leave as-is.
  if (/googleusercontent\.com/i.test(url)) return url;

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

  // Anything else (Supabase CDN, Unsplash, a normal .jpg URL, …) — unchanged.
  return url;
}

/** True when the converter would change this input (used to show a hint in UI). */
export function isShareLink(input: string): boolean {
  const url = (input || "").trim();
  if (!url) return false;
  return toDirectImageUrl(url) !== url;
}
