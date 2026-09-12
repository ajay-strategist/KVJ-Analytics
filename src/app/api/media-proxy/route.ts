import { NextRequest, NextResponse } from "next/server";
import { googleDriveId } from "@/lib/mediaUrl";

export const runtime = "nodejs";

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

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "image/png";
        // Ensure it is actually an image and not an HTML error or interstitial
        if (contentType.startsWith("image/") || contentType.includes("octet-stream")) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": contentType.includes("octet-stream") ? "image/png" : contentType,
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      }
    } catch (err) {
      // Continue to next candidate
    }
  }

  return NextResponse.json(
    { error: "Failed to fetch image from Google Drive. Please verify the file sharing permissions." },
    { status: 502 }
  );
}
