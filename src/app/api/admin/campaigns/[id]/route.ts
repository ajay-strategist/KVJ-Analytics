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

function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

async function findCampaign(db: any, id: string) {
  if (isUuid(id)) {
    const { data: byId } = await db
      .from("campaigns")
      .select("*, course:courses(id, slug, title)")
      .eq("id", id)
      .maybeSingle();
    if (byId) return byId;
  }

  // Query by string campaign_id e.g. CMP-DATA-2026-001
  const { data: byCampId } = await db
    .from("campaigns")
    .select("*, course:courses(id, slug, title)")
    .eq("campaign_id", id)
    .maybeSingle();

  if (byCampId) return byCampId;

  // Fallback query by id string for mock data
  const { data: fallback } = await db
    .from("campaigns")
    .select("*, course:courses(id, slug, title)")
    .eq("id", id)
    .maybeSingle();

  return fallback;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    // Fetch campaign details safely without Postgres 22P02 UUID error
    const campaign = await findCampaign(db, id);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Fetch scoped leads for this campaign
    const { data: campaignLeads } = await db
      .from("leads")
      .select("*")
      .or(`campaign_id.eq.${campaign.campaign_id},course_id.eq.${campaign.course_id}`)
      .order("created_at", { ascending: false });

    const leads = campaignLeads || [];

    // Real Analytics calculations
    const totalLeads = leads.length;
    const newLeads = leads.filter((l: any) => l.status === "new" || l.status === "draft").length;
    const contactedLeads = leads.filter((l: any) => l.status === "contacted" || l.status === "interested" || l.status === "follow_up").length;
    const convertedLeads = leads.filter((l: any) => l.status === "converted" || l.status === "qualified").length;
    const conversionRate = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;

    // Source breakdown
    const sourcesMap: Record<string, number> = {};
    leads.forEach((l: any) => {
      const src = (l.utm_source || "Direct / Organic").trim();
      sourcesMap[src] = (sourcesMap[src] || 0) + 1;
    });

    const sources = Object.entries(sourcesMap).map(([name, count]) => ({
      name,
      count,
      percentage: totalLeads > 0 ? Number(((count / totalLeads) * 100).toFixed(1)) : 0,
    }));

    return NextResponse.json({
      campaign: {
        ...campaign,
        analytics: {
          total_leads: totalLeads,
          new_leads: newLeads,
          contacted_leads: contactedLeads,
          converted_leads: convertedLeads,
          conversion_rate: conversionRate,
          sources,
        },
        leads,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/campaigns/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await req.json();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.campaign_name !== undefined) updatePayload.campaign_name = body.campaign_name;
    if (body.training_mode !== undefined) updatePayload.training_mode = body.training_mode;
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.registration_form_id !== undefined) updatePayload.registration_form_id = body.registration_form_id;
    if (body.registration_form_html !== undefined) updatePayload.registration_form_html = body.registration_form_html;
    if (body.telegram_enabled !== undefined) updatePayload.telegram_enabled = body.telegram_enabled;
    if (body.teams_enabled !== undefined) updatePayload.teams_enabled = body.teams_enabled;

    let updated: any = null;
    let updateErr: any = null;

    if (isUuid(id)) {
      const res = await db.from("campaigns").update(updatePayload).eq("id", id).select("*, course:courses(id, slug, title)").maybeSingle();
      updated = res.data;
      updateErr = res.error;
    }

    if (!updated) {
      const res = await db.from("campaigns").update(updatePayload).eq("campaign_id", id).select("*, course:courses(id, slug, title)").maybeSingle();
      updated = res.data;
      updateErr = res.error;
    }

    if (updateErr || !updated) {
      console.error("Failed to update campaign:", updateErr);
      return NextResponse.json({ error: "Failed to update campaign." }, { status: 500 });
    }

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: any) {
    console.error("PATCH /api/admin/campaigns/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    if (isUuid(id)) {
      await db.from("campaigns").delete().eq("id", id);
    } else {
      await db.from("campaigns").delete().eq("campaign_id", id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/admin/campaigns/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
