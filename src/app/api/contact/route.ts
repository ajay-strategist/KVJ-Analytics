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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      organization,
      email,
      phone,
      serviceInterest,
      message,
      sourcePage = "",
      utmSource = "",
      utmMedium = "",
      utmCampaign = "",
    } = body;

    // 1. Basic Server-side Validation
    if (!name || !organization || !email || !phone || !serviceInterest || !message) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    // 2. Insert Lead into Supabase
    const supabaseAdmin = getAdminClient();
    if (!supabaseAdmin) {
      console.warn("Supabase Admin client not initialized. Skipping DB insert.");
    } else {
      const { error: dbError } = await supabaseAdmin.from("leads").insert([
        {
          name,
          organization,
          email,
          phone,
          service_interest: serviceInterest,
          message,
          source_page: sourcePage,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          status: "new",
        },
      ]);

      if (dbError) {
        console.error("Database lead insertion error:", dbError);
        return NextResponse.json(
          { error: "Failed to record lead in database." },
          { status: 500 }
        );
      }
    }

    // 3. Trigger Transactional Email Notifications
    const resend = getResend();
    if (!resend) {
      console.warn("Resend API key not configured. Skipping email notifications.");
    } else {
      try {
        // Send alert to company email
        await resend.emails.send({
          from: "KVJ Analytics Alerts <onboarding@resend.dev>",
          to: "info@kvjanalytics.in",
          subject: `[New Lead] ${serviceInterest} - ${name} (${organization})`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
              <h2 style="color: #1D4ED8;">New Inquiry Received</h2>
              <hr style="border: 0; border-top: 1px solid #E2E8F0;" />
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Organization:</strong> ${organization}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Service Interest:</strong> ${serviceInterest}</p>
              <p><strong>Source Page:</strong> ${sourcePage}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background: #F8FAFC; border-left: 4px solid #1D4ED8; padding: 10px 15px; margin: 0;">
                ${message.replace(/\n/g, "<br />")}
              </blockquote>
              ${
                utmSource || utmMedium || utmCampaign
                  ? `<p style="color: #64748B; font-size: 12px; margin-top: 20px;">
                      <strong>UTM Tracking:</strong> Source: ${utmSource} | Medium: ${utmMedium} | Campaign: ${utmCampaign}
                     </p>`
                  : ""
              }
            </div>
          `,
        });

        // Send auto-reply to client
        await resend.emails.send({
          from: "KVJ Analytics <onboarding@resend.dev>",
          to: email,
          subject: `Inquiry Received - KVJ Analytics`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #0F172A;">
              <h2 style="color: #0D9488;">Hello ${name},</h2>
              <p>Thank you for reaching out to KVJ Analytics.</p>
              <p>We have successfully received your inquiry regarding <strong>${serviceInterest}</strong>. A technical consultant from our Cochin office will review your message and contact you within 24 business hours.</p>
              <p>If you need immediate assistance, please feel free to call our office directly at 9961813730 or reply to this email.</p>
              <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
              <p style="font-size: 12px; color: #64748B;">
                <strong>KVJ Analytics</strong><br />
                Analytics • Automation • Training • Educational Technology<br />
                Cochin, Kerala, India | info@kvjanalytics.in
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        // Log Resend error but do not fail the request since lead is saved in DB
        console.error("Resend API error:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("General contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
