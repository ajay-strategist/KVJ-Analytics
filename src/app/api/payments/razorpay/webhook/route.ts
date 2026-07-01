import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { client as sanityClient } from "@/sanity/lib/client";
import { Resend } from "resend";
import crypto from "crypto";

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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      course_slug,
      amount,
    } = body;

    const supabaseAdmin = getAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase client not configured." },
        { status: 500 }
      );
    }

    // 1. Signature Verification
    const isMock = razorpay_order_id?.startsWith("order_mock_");
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || "";
    let signatureVerified = false;

    if (isMock && !razorpaySecret) {
      signatureVerified = true;
    } else if (razorpaySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const text = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(text)
        .digest("hex");
      
      signatureVerified = expectedSignature === razorpay_signature;
    }

    if (!signatureVerified) {
      return NextResponse.json(
        { error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    // 2. Fetch Course Details from Supabase
    const { data: course } = await supabaseAdmin
      .from("courses")
      .select("title")
      .eq("slug", course_slug)
      .maybeSingle();
    const courseTitle = course?.title || "Professional Skill Course";

    // 3. Fetch Student User Details
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("name")
      .eq("id", user_id)
      .maybeSingle();

    const { data: authUserData, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(user_id);
    if (authUserError || !authUserData?.user) {
      console.error("Auth user search error:", authUserError);
      return NextResponse.json(
        { error: "Student user account not found." },
        { status: 404 }
      );
    }

    const studentName = profile?.name || authUserData.user.user_metadata?.name || "Student";
    const studentEmail = authUserData.user.email || "";

    // 4. Update order status to paid
    const { error: orderError } = await supabaseAdmin
      .from("orders")
      .update({
        razorpay_payment_id: razorpay_payment_id || "mock_payment_id",
        razorpay_signature: razorpay_signature || "mock_signature",
        status: "paid",
      })
      .eq("razorpay_order_id", razorpay_order_id);

    if (orderError) {
      console.error("Failed to update order status:", orderError);
      // Proceed anyway to ensure enrollment gets written
    }

    // 5. Create course enrollment
    const { error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .upsert(
        {
          user_id,
          course_slug,
          enrollment_method: "paid",
          status: "active",
        },
        { onConflict: "user_id,course_slug" }
      );

    if (enrollError) {
      console.error("Failed to create enrollment record:", enrollError);
      return NextResponse.json(
        { error: "Payment verified, but course enrollment failed." },
        { status: 500 }
      );
    }

    // 6. GST Invoice calculation (18% GST tax-inclusive breakdown)
    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
    const totalAmount = Number(amount || 0);
    const taxableValue = Number((totalAmount / 1.18).toFixed(2));
    const cgst = Number((taxableValue * 0.09).toFixed(2));
    const sgst = Number((taxableValue * 0.09).toFixed(2));
    const roundDifference = Number((totalAmount - (taxableValue + cgst + sgst)).toFixed(2));
    const finalCGST = (cgst + roundDifference).toFixed(2); // adjust minor fractions on CGST
    const finalSGST = sgst.toFixed(2);

    // 7. Send GST Invoice Receipt Email via Resend
    const resend = getResend();
    if (resend && studentEmail) {
      try {
        await resend.emails.send({
          from: "KVJ Analytics <onboarding@resend.dev>",
          to: studentEmail,
          subject: `Tax Invoice & Enrollment Confirmation — ${courseTitle}`,
          html: `
            <div style="font-family: sans-serif; padding: 25px; max-width: 600px; margin: 0 auto; color: #0F172A; border: 1px solid #E2E8F0; rounded-card: 16px;">
              <h2 style="color: #1D4ED8; margin-bottom: 5px;">KVJ Analytics</h2>
              <p style="font-size: 12px; color: #64748B; margin-top: 0; margin-bottom: 20px;">
                Analytics • Automation • Training • Educational Technology
              </p>
              
              <div style="background: #F8FAFC; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px;">
                <h4 style="margin: 0 0 10px 0; color: #0F172A; text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; font-weight: bold;">
                  Tax Invoice / Receipt
                </h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #64748B; padding: 3px 0;">Invoice Number:</td>
                    <td style="font-weight: bold; text-align: right; color: #0F172A;">${invoiceNum}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B; padding: 3px 0;">Date:</td>
                    <td style="font-weight: bold; text-align: right; color: #0F172A;">${new Date().toLocaleDateString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B; padding: 3px 0;">Order ID:</td>
                    <td style="font-weight: bold; text-align: right; color: #0F172A;">${razorpay_order_id}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B; padding: 3px 0;">Payment ID:</td>
                    <td style="font-weight: bold; text-align: right; color: #0F172A;">${razorpay_payment_id || "Mock Paid"}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 14px;">Dear <strong>${studentName}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.5;">
                Thank you for your payment. Your enrollment in <strong>${courseTitle}</strong> is now active. You have full access to study workbooks, code databases, and mock tests.
              </p>

              <h3 style="border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-top: 30px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em;">
                Tax & Pricing Details (INR)
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 25px;">
                <tr style="border-bottom: 1px solid #E2E8F0;">
                  <td style="padding: 10px 0; font-weight: 600;">Description</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 600;">Amount</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #475569;">Course Enrollment: ${courseTitle}</td>
                  <td style="padding: 10px 0; text-align: right; color: #475569;">₹${taxableValue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B; font-size: 12px; padding-left: 10px;">CGST (9%)</td>
                  <td style="padding: 6px 0; text-align: right; color: #64748B; font-size: 12px;">₹${finalCGST}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B; font-size: 12px; padding-left: 10px;">SGST (9%)</td>
                  <td style="padding: 6px 0; text-align: right; color: #64748B; font-size: 12px;">₹${finalSGST}</td>
                </tr>
                <tr style="border-top: 1.5px solid #0F172A; font-size: 15px; font-weight: bold;">
                  <td style="padding: 15px 0;">Total Amount Paid (Tax Incl.):</td>
                  <td style="padding: 15px 0; text-align: right; color: #1D4ED8;">₹${totalAmount.toFixed(2)}</td>
                </tr>
              </table>

              <div style="background: #F0FDFA; border-left: 4px solid #0D9488; padding: 12px 15px; border-radius: 4px; font-size: 13px; margin-bottom: 30px;">
                <strong style="color: #0F766E;">Syllabus Unlocked!</strong><br />
                Go to your student account to open resources: 
                <a href="${req.nextUrl.origin}/account" style="color: #0D9488; font-weight: bold; text-decoration: underline;">
                  Access Account Dashboard
                </a>
              </div>

              <hr style="border: 0; border-top: 1px solid #E2E8F0; margin-bottom: 20px;" />

              <table style="width: 100%; font-size: 10px; color: #64748B; border-collapse: collapse;">
                <tr>
                  <td style="width: 50%; vertical-align: top;">
                    <strong>KVJ Analytics</strong><br />
                    3rd Floor, Lalan Towers, Banerji Road<br />
                    High Court Jn., Cochin-682 031, Kerala, India<br />
                    GSTIN: 32BIDPK3118B1Z2
                  </td>
                  <td style="width: 50%; vertical-align: top; text-align: right;">
                    <strong>Support Helpline</strong><br />
                    Email: info@kvjanalytics.in<br />
                    Phone: 9961813730 / 0484-4059310
                  </td>
                </tr>
              </table>
            </div>
          `,
        });
      } catch (mailError) {
        console.error("Failed to send Resend receipt email:", mailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Razorpay webhook API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
