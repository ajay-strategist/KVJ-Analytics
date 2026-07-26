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
    const { internshipId, name, email, phone, resumeUrl, message } = body;

    // 1. Basic Server-side Validation
    if (!internshipId || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Required fields (internshipId, name, email, phone) must be provided." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database configuration is missing." },
        { status: 500 }
      );
    }

    // 2. Fetch Internship Details for Email/Validation
    const { data: internship, error: internshipError } = await supabaseAdmin
      .from("internships")
      .select("title")
      .eq("id", internshipId)
      .maybeSingle();

    if (internshipError || !internship) {
      return NextResponse.json(
        { error: "Selected internship program was not found." },
        { status: 404 }
      );
    }

    // 3. Insert Application into Supabase
    const { error: dbError } = await supabaseAdmin.from("internship_applications").insert([
      {
        internship_id: internshipId,
        name,
        email,
        phone,
        resume_url: resumeUrl || "",
        message: message || "",
      },
    ]);

    if (dbError) {
      console.error("Database internship application insertion error:", dbError);
      return NextResponse.json(
        { error: "Failed to submit application to database." },
        { status: 500 }
      );
    }

    // 4. Trigger Transactional Email Notifications via Resend
    const resend = getResend();
    if (!resend) {
      console.warn("Resend API key not configured. Skipping email notifications.");
    } else {
      try {
        // Send alert to company email
        await resend.emails.send({
          from: "KVJ Internship Alerts <onboarding@resend.dev>",
          to: "info@kvjanalytics.in",
          subject: `[Internship Application] ${internship.title} - ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
              <h2 style="color: #1D4ED8; margin-bottom: 5px;">New Internship Application</h2>
              <p style="color: #64748B; margin-top: 0; font-size: 14px;">Applied for: <strong>${internship.title}</strong></p>
              <hr style="border: 0; border-top: 1px solid #E2E8F0;" />
              <p><strong>Applicant Name:</strong> ${name}</p>
              <p><strong>Email Address:</strong> ${email}</p>
              <p><strong>Phone Number:</strong> ${phone}</p>
              <p><strong>Resume/Portfolio Link:</strong> ${
                resumeUrl
                  ? `<a href="${resumeUrl}" target="_blank" style="color: #1D4ED8; font-weight: bold;">View Resume ↗</a>`
                  : `<span style="color: #94A3B8; font-style: italic;">Not provided</span>`
              }</p>
              <p><strong>Cover Message:</strong></p>
              <blockquote style="background: #F8FAFC; border-left: 4px solid #1D4ED8; padding: 10px 15px; margin: 0;">
                ${message ? message.replace(/\n/g, "<br />") : '<span style="color: #94A3B8; font-style: italic;">No message provided</span>'}
              </blockquote>
            </div>
          `,
        });

        // Send auto-reply to applicant
        await resend.emails.send({
          from: "KVJ Analytics Careers <onboarding@resend.dev>",
          to: email,
          subject: `Internship Application Received - ${internship.title}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #0F172A;">
              <h2 style="color: #0D9488;">Hello ${name},</h2>
              <p>Thank you for applying to the <strong>${internship.title}</strong> program at KVJ Analytics.</p>
              <p>We have successfully received your internship application. A technical coordinator will review your profile and academic details and reach out to schedule an introductory call if your profile is shortlisted.</p>
              <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
              <p style="font-size: 12px; color: #64748B;">
                <strong>KVJ Analytics Learning</strong><br />
                Cochin, Kerala, India | info@kvjanalytics.in
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Resend Internship Application API error:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Internship Application API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
