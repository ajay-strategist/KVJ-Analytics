import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateTOTPAtCounter, generateBase32Secret } from "@/lib/totp";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 500 }
    );
  }

  try {
    const { data: batches, error } = await supabaseAdmin
      .from("batches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const timeStepSeconds = 30;
    const nowMs = Date.now();
    const currentCounter = Math.floor(nowMs / 1000 / timeStepSeconds);
    const secondsRemaining = timeStepSeconds - (Math.floor(nowMs / 1000) % timeStepSeconds);

    const batchesWithCodes = (batches || []).map((b) => {
      let code = "000000";
      try {
        code = generateTOTPAtCounter(b.totp_secret, currentCounter);
      } catch (e) {
        console.error("Error generating TOTP inside admin batch API:", e);
      }
      return {
        ...b,
        currentCode: code,
        secondsRemaining,
      };
    });

    return NextResponse.json({ batches: batchesWithCodes });
  } catch (error: any) {
    console.error("Failed to fetch admin batches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 500 }
    );
  }

  try {
    const { college_name, course_slug, valid_from, valid_to } = await req.json();

    if (!college_name || !course_slug || !valid_from || !valid_to) {
      return NextResponse.json(
        { error: "All batch fields are required." },
        { status: 400 }
      );
    }

    // Generate random secret key (Base32, 16 characters)
    const secret = generateBase32Secret(16);

    const { data, error } = await supabaseAdmin
      .from("batches")
      .insert([
        {
          college_name,
          course_slug,
          totp_secret: secret,
          valid_from,
          valid_to,
          active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, batch: data });
  } catch (error: any) {
    console.error("Failed to create batch:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 500 }
    );
  }

  try {
    const { id, active } = await req.json();

    if (!id || active === undefined) {
      return NextResponse.json(
        { error: "Missing batch ID or status." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("batches")
      .update({ active })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update batch:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
