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

    // 1. Support both standard names and kvj_ prefixed names
    const resolved_course_id = course_id || body.kvj_course_id;
    const resolved_training_mode = training_mode || body.kvj_training_mode || "online";
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

    // 4. Resolve Course Title from Database
    const db = getAdminClient();
    if (!db) {
      return NextResponse.json({ error: "Database connection could not be established." }, { status: 500 });
    }

    let courseTitle = "Dynamic Learning Program";
    try {
      const { data: courseRow } = await db
        .from("courses")
        .select("title")
        .eq("id", resolved_course_id)
        .maybeSingle();
      if (courseRow?.title) {
        courseTitle = courseRow.title;
      }
    } catch (err) {
      console.warn("Failed to fetch course details, using default title:", err);
    }

    // 5. Database Upsert / Insert
    let recordId = id;

    // Determine course_id: try UUID parse first, fall back to text slug stored in service_interest
    // The leads.course_id column is UUID — if a text slug is provided, we skip it
    let resolvedCourseIdForDB: string | null = null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(resolved_course_id)) {
      resolvedCourseIdForDB = resolved_course_id;
    }
    // else: text slug — omit from payload to avoid FK error

    const payload: Record<string, unknown> = {
      name,
      email,
      phone,
      whatsapp_number: whatsapp_number || null,
      training_mode: resolved_training_mode,
      location: location || null,
      current_profession: current_profession || null,
      organization: organization || college_name || "",  // NOT NULL in DB — default to empty string
      college_name: college_name || null,
      current_education: current_education || null,
      preferred_start_date: preferred_start_date || null,
      message: message || "",
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_term: utmTerm || null,
      utm_content: utmContent || null,
      landing_page: landing_page || null,
      referrer: referrer || null,
      service_interest: `Course Registration: ${courseTitle}`,
      status,
    };

    // Only include course_id if it's a valid UUID (avoids FK constraint error on text slugs)
    if (resolvedCourseIdForDB) {
      payload.course_id = resolvedCourseIdForDB;
    }

    if (recordId) {
      // Update existing record (draft or previous update)
      const { error: updateErr } = await db
        .from("leads")
        .update(payload)
        .eq("id", recordId);

      if (updateErr) {
        console.error("Database update error:", updateErr);
        return NextResponse.json({ error: "Failed to update lead record." }, { status: 500 });
      }
    } else {
      // Check if a draft with the same email and course exists to prevent duplicate entries
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
        // Insert new record
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

    // 6. Action-Triggered Operations on Final Submission (status = 'new')
    if (status === "new") {
      // A. Transactional Emails (Resend)
      const resend = getResend();
      if (!resend) {
        console.warn("Resend API key not configured. Skipping email alerts.");
      } else {
        try {
          // Send registration notification to admin
          await resend.emails.send({
            from: "KVJ Alerts <onboarding@resend.dev>",
            to: "info@kvjanalytics.in",
            subject: `[New Registration] ${courseTitle} - ${name}`,
            html: `
              <div style="font-family: sans-serif; padding: 25px; line-height: 1.6; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px;">
                <h2 style="color: #08A88A; border-bottom: 2px solid #F0FBF7; padding-bottom: 10px; margin-top: 0;">New Program Registration</h2>
                <p>A new student has registered interest for a training course.</p>
                <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; font-weight: bold; width: 35%;">Name:</td><td style="padding: 6px 0;">${name}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td style="padding: 6px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">WhatsApp:</td><td style="padding: 6px 0;">${whatsapp_number || "Same / None"}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Course Program:</td><td style="padding: 6px 0; color: #0E7490; font-weight: bold;">${courseTitle}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Training Mode:</td><td style="padding: 6px 0; font-weight: bold; text-transform: uppercase;">${training_mode}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Location:</td><td style="padding: 6px 0;">${location}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Profession:</td><td style="padding: 6px 0;">${current_profession || "Not specified"}</td></tr>
                  ${organization ? `<tr><td style="padding: 6px 0; font-weight: bold;">Company Name:</td><td style="padding: 6px 0;">${organization}</td></tr>` : ""}
                  ${college_name ? `<tr><td style="padding: 6px 0; font-weight: bold;">College Name:</td><td style="padding: 6px 0;">${college_name}</td></tr>` : ""}
                  ${current_education ? `<tr><td style="padding: 6px 0; font-weight: bold;">Education Details:</td><td style="padding: 6px 0;">${current_education}</td></tr>` : ""}
                  ${preferred_start_date ? `<tr><td style="padding: 6px 0; font-weight: bold;">Start Date:</td><td style="padding: 6px 0;">${preferred_start_date}</td></tr>` : ""}
                </table>
                <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                <p><strong>Additional Message:</strong></p>
                <blockquote style="background: #F4F9FD; border-left: 4px solid #0E7490; padding: 10px 15px; margin: 0; font-style: italic;">
                  ${message ? message.replace(/\n/g, "<br />") : "No custom message added."}
                </blockquote>
                ${
                  utmSource || utmMedium || utmCampaign
                    ? `<div style="background: #F0FBF7; border: 1px solid #DDF8F0; padding: 12px; border-radius: 8px; margin-top: 20px; font-size: 11px; color: #526477;">
                        <strong>Marketing Attribution:</strong><br />
                        Source: ${utmSource} | Medium: ${utmMedium} | Campaign: ${utmCampaign}<br />
                        Landing Page: ${landing_page} | Referrer: ${referrer}
                       </div>`
                    : ""
                }
              </div>
            `,
          });

          // Send confirmation email auto-reply to student
          await resend.emails.send({
            from: "KVJ Analytics <onboarding@resend.dev>",
            to: email,
            subject: `Registration Received - ${courseTitle}`,
            html: `
              <div style="font-family: sans-serif; padding: 25px; line-height: 1.6; color: #132238; max-width: 600px; margin: 0 auto; border: 1px solid #DCE5E8; border-radius: 12px;">
                <h2 style="color: #08A88A; margin-top: 0;">Hello ${name},</h2>
                <p>We have successfully received your training registration request for the <strong>${courseTitle}</strong> program.</p>
                <p>An academic program counselor from our office is reviewing your application details. We will reach back to you shortly regarding the details and schedules for your preferred <strong>${training_mode}</strong> learning format.</p>
                <p>Should you need immediate assistance, please call our support team directly at +91 9961813730.</p>
                <hr style="border: 0; border-top: 1px solid #DCE5E8; margin: 30px 0;" />
                <p style="font-size: 11px; color: #7B8A99;">
                  <strong>KVJ Analytics</strong><br />
                  Analytics • Automation • Training • Educational Technology<br />
                  Cochin, Kerala, India | info@kvjanalytics.in
                </p>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error("Resend notification dispatch failure:", emailErr);
        }
      }

      // B. Telegram Bot Alert
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_GROUP_CHAT_ID;

      if (telegramToken && telegramChatId) {
        // Enforce try-catch to keep db transaction successful even if Telegram API fails
        try {
          const telegramMessage = [
            `🎓 *NEW TRAINING REGISTRATION*`,
            `----------------------------------`,
            `*Course:* ${courseTitle}`,
            `*Mode:* ${training_mode.toUpperCase()}`,
            `*Date:* ${formatDate(new Date())}`,
            ``,
            `👤 *STUDENT PROFILE*`,
            `• *Name:* ${name}`,
            `• *Email:* ${email}`,
            `• *Phone:* ${phone}`,
            whatsapp_number ? `• *WhatsApp:* ${whatsapp_number}` : null,
            location ? `• *Location:* ${location}` : null,
            current_profession ? `• *Profession:* ${current_profession}` : null,
            organization ? `• *Company:* ${organization}` : null,
            college_name ? `• *College:* ${college_name}` : null,
            current_education ? `• *Education:* ${current_education}` : null,
            preferred_start_date ? `• *Start Date:* ${preferred_start_date}` : null,
            ``,
            message ? `💬 *MESSAGE:* \n_"${message}"_\n` : null,
            utmSource || utmCampaign
              ? `📢 *ATTRIBUTION*\n• *Source:* ${utmSource || "N/A"}\n• *Medium:* ${utmMedium || "N/A"}\n• *Campaign:* ${utmCampaign || "N/A"}\n• *Content:* ${utmContent || "N/A"}`
              : null,
            landing_page ? `🔗 *Page:* ${landing_page}` : null,
          ]
            .filter((line) => line !== null)
            .join("\n");

          const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramMessage,
              parse_mode: "Markdown",
            }),
          });

          if (!response.ok) {
            const errBody = await response.text();
            console.error("Telegram bot API returned error status:", response.status, errBody);
          }
        } catch (teleErr) {
          console.error("Telegram webhook request failure:", teleErr);
        }
      } else {
        console.warn("Telegram environment variables not set. Skipping Telegram notification.");
      }
    }

    return NextResponse.json({ success: true, id: recordId });
  } catch (error: any) {
    console.error("General registration API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
