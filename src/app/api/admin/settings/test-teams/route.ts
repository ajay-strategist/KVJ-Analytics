import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === adminToken();
}

/**
 * POST /api/admin/settings/test-teams
 * Body: { webhookUrl: string }
 * Sends a test MessageCard to the provided Teams webhook URL.
 */
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { webhookUrl } = await req.json();

  if (!webhookUrl || !webhookUrl.startsWith("https://")) {
    return NextResponse.json(
      { error: "Invalid webhook URL. Must start with https://" },
      { status: 400 }
    );
  }

  const testPayload = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: "08A88A",
    summary: "KVJ Analytics — Teams Connection Test",
    sections: [
      {
        activityTitle: "✅ KVJ Analytics Notifications Connected!",
        activitySubtitle: "Microsoft Teams Webhook — Test Successful",
        facts: [
          { name: "Status", value: "**ACTIVE** — Your Teams channel is receiving lead notifications." },
          { name: "Sent At", value: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) },
          { name: "Triggered By", value: "Admin Settings → Test Connection" },
        ],
        markdown: true,
      },
    ],
    potentialAction: [
      {
        "@type": "OpenUri",
        name: "Open Admin Panel",
        targets: [{ os: "default", uri: "https://kvjanalytics.in/admin" }],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Teams returned ${res.status}: ${text.slice(0, 200)}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Test message sent to Teams successfully!" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to reach Teams webhook URL." },
      { status: 500 }
    );
  }
}
