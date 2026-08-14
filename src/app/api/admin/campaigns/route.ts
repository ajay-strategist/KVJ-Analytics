import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Generate unique collision-safe Campaign ID e.g. CMP-AI-2026-001
async function generateCampaignId(db: any, courseSlug: string) {
  const cleanSlug = (courseSlug || "general")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4) || "CMP";
  const year = new Date().getFullYear();
  const basePrefix = `CMP-${cleanSlug}-${year}`;

  try {
    const { data: existing } = await db
      .from("campaigns")
      .select("campaign_id")
      .like("campaign_id", `${basePrefix}-%`);

    const count = (existing || []).length + 1;
    const seq = String(count).padStart(3, "0");
    return `${basePrefix}-${seq}`;
  } catch (err) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${basePrefix}-${randomSuffix}`;
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    // Fetch campaigns
    const { data: campaigns, error: campErr } = await db
      .from("campaigns")
      .select("*, course:courses(id, slug, title)")
      .order("created_at", { ascending: false });

    if (campErr) {
      console.error("Failed to fetch campaigns from DB:", campErr);
      return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
    }

    const campaignList = campaigns || [];

    // Fetch all leads to compute real lead counts efficiently per campaign
    const { data: allLeads } = await db
      .from("leads")
      .select("id, campaign_id, course_id, status, created_at");

    const leads = allLeads || [];

    // Attach real lead_count and analytics to each campaign
    const enrichedCampaigns = campaignList.map((c: any) => {
      const campLeads = leads.filter(
        (l: any) =>
          (l.campaign_id && l.campaign_id === c.campaign_id) ||
          (!l.campaign_id && l.course_id === c.course_id)
      );

      const newLeadsCount = campLeads.filter((l: any) => l.status === "new" || l.status === "draft").length;
      const contactedCount = campLeads.filter((l: any) => l.status === "contacted" || l.status === "interested" || l.status === "follow_up").length;
      const convertedCount = campLeads.filter((l: any) => l.status === "converted" || l.status === "qualified").length;

      return {
        ...c,
        lead_count: campLeads.length,
        new_leads_count: newLeadsCount,
        contacted_count: contactedCount,
        converted_count: convertedCount,
      };
    });

    return NextResponse.json({ campaigns: enrichedCampaigns });
  } catch (error: any) {
    console.error("GET /api/admin/campaigns error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await req.json();
    const {
      campaign_name,
      course_id,
      training_mode = "online",
      registration_form_id,
      registration_form_html,
      status = "active",
      telegram_enabled = true,
      teams_enabled = true,
    } = body;

    if (!campaign_name || !course_id) {
      return NextResponse.json({ error: "Campaign name and course selection are required." }, { status: 400 });
    }

    // Get course slug for Campaign ID prefix
    let courseSlug = "general";
    const { data: courseRow } = await db
      .from("courses")
      .select("slug, title")
      .eq("id", course_id)
      .maybeSingle();

    if (courseRow?.slug) {
      courseSlug = courseRow.slug;
    }

    // Generate collision-safe Campaign ID
    const campaign_id = await generateCampaignId(db, courseSlug);

    const payload = {
      campaign_id,
      campaign_name,
      course_id,
      training_mode: (training_mode || "online").toLowerCase(),
      registration_form_id: registration_form_id || null,
      registration_form_html: registration_form_html || null,
      status: status || "active",
      telegram_enabled: telegram_enabled !== false,
      teams_enabled: teams_enabled !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use clean insert and attach course metadata explicitly
    const { data: inserted, error: insertErr } = await db
      .from("campaigns")
      .insert([payload])
      .select()
      .single();

    if (insertErr || !inserted) {
      console.error("Error inserting campaign:", insertErr);
      const detailedErr = insertErr?.message || insertErr?.details || "Failed to create campaign. Ensure campaigns table exists in Supabase DB.";
      return NextResponse.json({ error: detailedErr }, { status: 500 });
    }

    // Attach course metadata for frontend list updating
    const enrichedInserted = {
      ...inserted,
      course: courseRow ? { id: course_id, slug: courseRow.slug, title: courseRow.title } : null,
    };

    return NextResponse.json({ success: true, campaign: enrichedInserted });
  } catch (error: any) {
    console.error("POST /api/admin/campaigns error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
