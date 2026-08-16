import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

// Format date for Telegram alerts
function formatDate(date: Date): string {
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id, // Existing draft ID if updating
      name,
      email,
      phone,
      whatsapp_number,
      course_id,
      training_mode,
      location,
      current_profession,
      organization,
      college_name,
      current_education,
      preferred_start_date,
      message,
      username, // Honeypot
      turnstileToken,
      status = "new",
      utmSource = "",
      utmMedium = "",
      utmCampaign = "",
      utmTerm = "",
      utmContent = "",
      landing_page = "",
      referrer = "",
    } = body;

    // Extract arbitrary custom form fields
    const standardKeys = new Set([
      "id", "name", "email", "phone", "whatsapp_number", "course_id", "training_mode",
      "location", "current_profession", "organization", "college_name", "current_education",
      "preferred_start_date", "message", "username", "turnstileToken", "status",
      "utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent", "landing_page", "referrer",
      "kvj_course_id", "kvj_training_mode", "kvj_campaign_id", "kvj_honeypot", "campaign_id"
    ]);

    const customFields: Record<string, any> = {};
    for (const [key, val] of Object.entries(body)) {
      if (
        !standardKeys.has(key) &&
        val !== undefined &&
        val !== null &&
        val !== "" &&
        typeof val !== "object"
      ) {
        customFields[key] = val;
      }
    }

    let finalMessage = message || "";
    if (Object.keys(customFields).length > 0) {
      const customSummary = Object.entries(customFields)
        .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
        .join("\n");
      finalMessage = finalMessage
        ? `${finalMessage}\n\n[Additional Form Fields]:\n${customSummary}`
        : customSummary;
    }

    // 1. Support both standard names and kvj_ prefixed names
    const resolved_course_id = course_id || body.kvj_course_id;
    const resolved_training_mode = training_mode || body.kvj_training_mode || "online";
    const resolved_campaign_id = body.campaign_id || body.kvj_campaign_id;
    const resolved_username = username || body.kvj_honeypot;

    // Honeypot Spam Protection Check
    if (resolved_username && resolved_username.trim().length > 0) {
      console.warn("Spam honeypot triggered by submission name:", name);
      return NextResponse.json({ success: true, message: "Spam discarded." });
    }

    // 2. Cloudflare Turnstile Verification
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (status === "new" && turnstileSecret && turnstileToken) {
      try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}`,
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return NextResponse.json({ error: "Turnstile captcha verification failed." }, { status: 400 });
        }
      } catch (err) {
        console.error("Turnstile API verification issue:", err);
      }
    }

    // 3. Server-side Validations
    if (!name || !email || !phone || !resolved_course_id || !resolved_training_mode) {
      return NextResponse.json({ error: "Missing required registration parameters." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: "Invalid phone number. Must be at least 10 digits." }, { status: 400 });
    }

    // 4. Resolve Course & Campaign Details from Database
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database connection could not be established." }, { status: 500 });
    }

    let courseTitle = "Dynamic Learning Program";
    let resolvedCourseIdForDB: string | null = null;
    let campaignName = "General Registration";
    let activeCampaignId: string | null = resolved_campaign_id || null;
    let telegramEnabled = true;
    let teamsEnabled = true;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    try {
      if (uuidRegex.test(resolved_course_id)) {
        const { data: courseRow } = await db
          .from("courses")
          .select("id, title")
          .eq("id", resolved_course_id)
          .maybeSingle();
        if (courseRow) {
          courseTitle = courseRow.title;
          resolvedCourseIdForDB = courseRow.id;
        }
      } else {
        const { data: courseRow } = await db
          .from("courses")
          .select("id, title")
          .eq("slug", resolved_course_id)
          .maybeSingle();
        if (courseRow) {
          courseTitle = courseRow.title;
          resolvedCourseIdForDB = courseRow.id;
        }
      }

      // Resolve Campaign
      if (activeCampaignId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeCampaignId);
        let query = db.from("campaigns").select("*");
        
        if (isUuid) {
          query = query.or(`campaign_id.eq.${activeCampaignId},id.eq.${activeCampaignId}`);
        } else {
          query = query.eq("campaign_id", activeCampaignId);
        }

        const { data: campRow } = await query.maybeSingle();
        if (campRow) {
          campaignName = campRow.campaign_name;
          activeCampaignId = campRow.campaign_id;
          telegramEnabled = campRow.telegram_enabled !== false;
          teamsEnabled = campRow.teams_enabled !== false;
        }
      } else if (resolvedCourseIdForDB) {
        // Fallback: look up latest active campaign for this course
        const { data: campRow } = await db
          .from("campaigns")
          .select("*")
          .eq("course_id", resolvedCourseIdForDB)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .maybeSingle();
        if (campRow) {
          campaignName = campRow.campaign_name;
          activeCampaignId = campRow.campaign_id;
          telegramEnabled = campRow.telegram_enabled !== false;
          teamsEnabled = campRow.teams_enabled !== false;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch course/campaign details:", err);
    }

    // 5. Database Upsert / Insert
    let recordId = id;

    const payload: Record<string, unknown> = {
      name,
      email,
      phone,
      whatsapp_number: whatsapp_number || null,
      training_mode: resolved_training_mode,
      location: location || null,
      current_profession: current_profession || null,
      organization: organization || college_name || "",
      college_name: college_name || null,
      current_education: current_education || null,
      preferred_start_date: preferred_start_date || null,
      message: finalMessage || "",
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_term: utmTerm || null,
      utm_content: utmContent || null,
      landing_page: landing_page || null,
      referrer: referrer || null,
      service_interest: `Course Registration: ${courseTitle}`,
      status,
      campaign_id: activeCampaignId || null,
    };

    if (resolvedCourseIdForDB) {
      payload.course_id = resolvedCourseIdForDB;
    }

    if (recordId) {
      const { error: updateErr } = await db
        .from("leads")
        .update(payload)
        .eq("id", recordId);

      if (updateErr) {
        console.error("Database update error:", updateErr);
        return NextResponse.json({ error: "Failed to update lead record." }, { status: 500 });
      }
    } else {
      const { data: existingDraft } = await db
        .from("leads")
        .select("id")
        .eq("email", email)
        .eq("course_id", resolved_course_id)
        .eq("status", "draft")
        .maybeSingle();

      if (existingDraft?.id) {
        recordId = existingDraft.id;
        const { error: updateErr } = await db
          .from("leads")
          .update(payload)
          .eq("id", recordId);

        if (updateErr) {
          console.error("Database update error on draft find:", updateErr);
          return NextResponse.json({ error: "Failed to update lead record." }, { status: 500 });
        }
      } else {
        const { data: newRow, error: insertErr } = await db
          .from("leads")
          .insert([payload])
          .select("id")
          .single();

        if (insertErr || !newRow) {
          console.error("Database insert error:", insertErr);
          return NextResponse.json({ error: "Failed to create lead record." }, { status: 500 });
        }
        recordId = newRow.id;
      }
    }

    // 6. Action-Triggered Notifications (status = 'new')
    if (status === "new") {
      // A. Transactional Emails (Resend)
      const resend = getResend();
      if (resend) {
        try {
          await resend.emails.send({
            from: "KVJ Alerts <onboarding@resend.dev>",
            to: "info@kvjanalytics.in",
            subject: `[New Lead] ${courseTitle} - ${name}`,
            html: `
              <div style="font-family: sans-serif; padding: 25px; line-height: 1.6; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px;">
                <h2 style="color: #08A88A; border-bottom: 2px solid #F0FBF7; padding-bottom: 10px; margin-top: 0;">New Training Lead Received</h2>
                <p>A new student has registered interest for a training course.</p>
                <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; font-weight: bold; width: 35%;">Name:</td><td style="padding: 6px 0;">${name}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td style="padding: 6px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Course Program:</td><td style="padding: 6px 0; color: #0E7490; font-weight: bold;">${courseTitle}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Training Mode:</td><td style="padding: 6px 0; font-weight: bold; text-transform: uppercase;">${resolved_training_mode}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Campaign:</td><td style="padding: 6px 0; font-weight: bold;">${campaignName} (${activeCampaignId || "N/A"})</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Location:</td><td style="padding: 6px 0;">${location || "Not specified"}</td></tr>
                  ${finalMessage ? `<tr><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Message / Details:</td><td style="padding: 6px 0; white-space: pre-wrap;">${finalMessage}</td></tr>` : ""}
                </table>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error("Resend notification error:", emailErr);
        }
      }

      // Load notification credentials from DB with env variables as fallbacks
      let telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      let telegramChatId = process.env.TELEGRAM_GROUP_CHAT_ID;
      let teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;

      try {
        const { data: adminSettings } = await db
          .from("page_content")
          .select("data")
          .eq("slug", "admin-settings")
          .maybeSingle();
        if (adminSettings?.data) {
          if (adminSettings.data.telegramBotToken?.trim()) {
            telegramToken = adminSettings.data.telegramBotToken.trim();
          }
          if (adminSettings.data.telegramChatId?.trim()) {
            telegramChatId = adminSettings.data.telegramChatId.trim();
          }
          if (adminSettings.data.teamsWebhookUrl?.trim()) {
            teamsWebhookUrl = adminSettings.data.teamsWebhookUrl.trim();
          }
        }
      } catch (dbErr) {
        console.error("Failed to load notification settings from DB, using env fallback:", dbErr);
      }

      // B. Telegram Bot Alert
      if (telegramEnabled && telegramToken && telegramChatId) {
        try {
          const telegramMessageLines = [
            `🔔 *NEW TRAINING LEAD*`,
            ``,
            `*${courseTitle}*`,
            ``,
            `👤 *Name:*`,
            `${name}`,
            ``,
            `📱 *Phone:*`,
            `${phone}`,
            ``,
            `📧 *Email:*`,
            `${email}`,
            ``,
            `🎓 *Course:*`,
            `${courseTitle}`,
            ``,
            `💻 *Training Mode:*`,
            `${resolved_training_mode.toUpperCase()}`,
            ``,
            `📍 *District / Location:*`,
            `${location || "Not specified"}`,
            ``,
            `📢 *Campaign:*`,
            `${campaignName}`,
            ``,
            `🆔 *Campaign ID:*`,
            `${activeCampaignId || "N/A"}`,
            ``,
            `🕐 *Registered:*`,
            `${formatDate(new Date())}`,
          ];

          if (finalMessage) {
            telegramMessageLines.push(``, `📝 *Message / Additional Details:*`, finalMessage);
          }

          const telegramMessage = telegramMessageLines.join("\n");

          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramMessage,
              parse_mode: "Markdown",
            }),
          });
        } catch (teleErr) {
          console.error("Telegram webhook request failure (lead preserved):", teleErr);
        }
      }

      // C. Microsoft Teams Webhook Alert

      if (teamsEnabled && teamsWebhookUrl) {
        try {
          const teamsPayload = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": "08A88A",
            "summary": `New Lead: ${name} (${courseTitle})`,
            "sections": [
              {
                "activityTitle": "🔔 NEW TRAINING LEAD",
                "activitySubtitle": `${courseTitle} — ${campaignName}`,
                "facts": [
                  { "name": "Name", "value": name },
                  { "name": "Email", "value": email },
                  { "name": "Phone", "value": phone },
                  { "name": "Course", "value": courseTitle },
                  { "name": "Training Mode", "value": resolved_training_mode.toUpperCase() },
                  { "name": "District / Location", "value": location || "Not specified" },
                  { "name": "Campaign", "value": campaignName },
                  { "name": "Campaign ID", "value": activeCampaignId || "N/A" },
                  { "name": "Registered At", "value": formatDate(new Date()) },
                  ...(finalMessage ? [{ "name": "Message / Details", "value": finalMessage.replace(/\n/g, "<br>") }] : [])
                ],
                "markdown": true
              }
            ]
          };

          await fetch(teamsWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(teamsPayload),
          });
        } catch (teamsErr) {
          console.error("Teams webhook request failure (lead preserved):", teamsErr);
        }
      }
    }

    return NextResponse.json({ success: true, id: recordId });
  } catch (error: any) {
    console.error("General registration API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
