/**
 * POST /api/admin/upload
 * Accepts a multipart/form-data with a "file" field.
 * Uploads to the public `site-images` Supabase Storage bucket.
 * Returns { url: string } — the public CDN URL.
 * Protected by admin_session cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function isAuthorized(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === adminToken();
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const client = getAdminClient();
  if (!client)
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file || typeof file === "string")
    return NextResponse.json({ error: "No file provided." }, { status: 400 });

  // Sanitise filename: strip spaces, prefix with timestamp to avoid collisions
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `uploads/${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await client.storage
    .from("site-images")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = client.storage
    .from("site-images")
    .getPublicUrl(path);

  return NextResponse.json({ url: urlData.publicUrl });
}
