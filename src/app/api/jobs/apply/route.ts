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
    const { jobId, name, email, phone, resumeUrl, message } = body;

    // 1. Basic Server-side Validation
    if (!jobId || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Required fields (jobId, name, email, phone) must be provided." },
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

    // 2. Fetch Job Details for Email/Validation
    const { data: job, error: jobError } = await supabaseAdmin
      .from("jobs")
      .select("title")
      .eq("id", jobId)
      .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json(
        { error: "Selected job position was not found." },
        { status: 404 }
      );
    }

    // 3. Insert Application into Supabase
    const { error: dbError } = await supabaseAdmin.from("job_applications").insert([
      {
        job_id: jobId,
        name,
        email,
        phone,
        resume_url: resumeUrl || "",
        message: message || "",
      },
    ]);

    if (dbError) {
      console.error("Database job application insertion error:", dbError);
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
          from: "KVJ Recruiting Alerts <onboarding@resend.dev>",
          to: "info@kvjanalytics.in",
          subject: `[Job Application] ${job.title} - ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
              <h2 style="color: #1D4ED8; margin-bottom: 5px;">New Job Application</h2>
              <p style="color: #64748B; margin-top: 0; font-size: 14px;">Applied for: <strong>${job.title}</strong></p>
              <hr style="border: 0; border-top: 1px solid #E2E8F0;" />
              <p><strong>Applicant Name:</strong> ${name}</p>
              <p><strong>Email Address:</strong> ${email}</p>
              <p><strong>Phone Number:</strong> ${phone}</p>
              <p><strong>Resume/CV Link:</strong> ${
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
          subject: `Application Received - ${job.title}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #0F172A;">
              <h2 style="color: #0D9488;">Hello ${name},</h2>
              <p>Thank you for your interest in joining the KVJ Analytics team.</p>
              <p>We have successfully received your application for the position of <strong>${job.title}</strong>. Our recruiting coordinator in Cochin will review your profile and contact you regarding the next steps if your skills match our requirements.</p>
              <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
              <p style="font-size: 12px; color: #64748B;">
                <strong>KVJ Analytics Recruiting</strong><br />
                Cochin, Kerala, India | info@kvjanalytics.in
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Resend Job Application API error:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Job Application API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
