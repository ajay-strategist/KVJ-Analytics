import { NextRequest, NextResponse } from "next/server";
import { googleDriveId } from "@/lib/mediaUrl";

export const runtime = "nodejs";

// Short-lived memory cache for failed image IDs to prevent retry storms against Google Drive
const failedIdCache = new Map<string, number>();
const FAILED_CACHE_TTL_MS = 60 * 1000; // 60s

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");
  const urlParam = searchParams.get("url");

  const fileId = idParam || (urlParam ? googleDriveId(urlParam) : null);

  if (!fileId || !/^[A-Za-z0-9_-]{10,}$/.test(fileId)) {
    return NextResponse.json(
      { error: "Invalid or missing Google Drive file ID." },
      { status: 400 }
    );
  }

  // Fast-reject known failed IDs to protect against concurrent retry storms
  const failedAt = failedIdCache.get(fileId);
  if (failedAt && Date.now() - failedAt < FAILED_CACHE_TTL_MS) {
    return NextResponse.json(
      { error: "Image unavailable." },
      {
        status: 502,
        headers: { "Cache-Control": "private, no-cache, no-store, max-age=0" },
      }
    );
  }

  // Endpoints to attempt in order
  const candidateUrls = [
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
  ];

  for (const targetUrl of candidateUrls) {
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        redirect: "follow",
        cache: "force-cache",
      });

      if (response.ok && response.body) {
        const contentType = response.headers.get("content-type") || "image/png";
        // Ensure it is actually an image and not an HTML error or interstitial
        if (contentType.startsWith("image/") || contentType.includes("octet-stream")) {
          // Cleanly remove from failed cache if it succeeded
          failedIdCache.delete(fileId);

          return new NextResponse(response.body as unknown as BodyInit, {
            status: 200,
            headers: {
              "Content-Type": contentType.includes("octet-stream") ? "image/png" : contentType,
              "Cache-Control": "private, no-transform, max-age=3600",
            },
          });
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // Record failure to shield against retry storm
  failedIdCache.set(fileId, Date.now());

  return NextResponse.json(
    { error: "Failed to fetch image from Google Drive. Please verify the file sharing permissions." },
    {
      status: 502,
      headers: { "Cache-Control": "private, no-cache, no-store, max-age=0" },
    }
  );
}
