import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { client as sanityClient } from "@/sanity/lib/client";
import Razorpay from "razorpay";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Initialize Razorpay
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

export async function POST(req: NextRequest) {
  try {
    const { courseSlug, userId } = await req.json();

    if (!courseSlug || !userId) {
      return NextResponse.json(
        { error: "Course slug and user ID are required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase configuration is missing." },
        { status: 500 }
      );
    }

    // 1. Fetch course details from Supabase to lock the price
    const { data: course, error: courseFetchError } = await supabaseAdmin
      .from("courses")
      .select("title, fee_inr, offer_price_inr, is_paid")
      .eq("slug", courseSlug)
      .maybeSingle();

    if (courseFetchError || !course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    if (!course.is_paid) {
      return NextResponse.json(
        { error: "This course is free or code-gated, payment is not required." },
        { status: 400 }
      );
    }

    const price = course.offer_price_inr !== null && course.offer_price_inr !== undefined
      ? Number(course.offer_price_inr)
      : Number(course.fee_inr);

    // 2. Generate Razorpay Order
    if (!razorpay) {
      console.warn("Razorpay credentials missing. Generating a mock order ID.");
      // Fallback for environment verification when keys are not active yet
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 12)}`;
      
      // Save order record to Supabase
      const { error: dbError } = await supabaseAdmin.from("orders").insert([
        {
          user_id: userId,
          course_slug: courseSlug,
          amount: price,
          currency: "INR",
          razorpay_order_id: mockOrderId,
          status: "pending",
        },
      ]);

      if (dbError) {
        throw dbError;
      }

      return NextResponse.json({
        id: mockOrderId,
        amount: Math.round(price * 100),
        currency: "INR",
        key: "rzp_test_placeholder",
        mock: true,
      });
    }

    // Standard order options
    const amountInPaise = Math.round(price * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${userId.slice(0, 8)}`,
    };

    const order = await razorpay.orders.create(options);

    // 3. Save order entry to Supabase
    const { error: dbError } = await supabaseAdmin.from("orders").insert([
      {
        user_id: userId,
        course_slug: courseSlug,
        amount: price,
        currency: "INR",
        razorpay_order_id: order.id,
        status: "pending",
      },
    ]);

    if (dbError) {
      console.error("Order creation DB insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to record order details." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: razorpayKeyId,
      mock: false,
    });
  } catch (error: any) {
    console.error("Razorpay order API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
