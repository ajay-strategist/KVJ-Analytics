import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, getAuthClient } from "@/lib/supabaseAdmin";

const DEFAULT_PASSWORD = "UserTest@2026!";
const MODULE5_LESSON_ID = "ad2aba74-1f78-45a8-b83e-9613452b4dae";
const MODULE6_LESSON_ID = "790ffa07-777e-4ee0-b70e-b4710ab4ff0c";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const userParam = url.searchParams.get("user") || "1";
  const targetParam = url.searchParams.get("target") || "module5";
  const lessonParam = url.searchParams.get("lesson");

  // Extract user number, e.g. "1", "User 1", "user1", "user1@kvjanalytics.test"
  let userNum = 1;
  const numMatch = userParam.match(/\d+/);
  if (numMatch) {
    userNum = parseInt(numMatch[0], 10);
  }
  const pad3 = String(userNum).padStart(3, "0");
  const email = url.searchParams.get("email") || (process.env.SUPABASE_LOCAL_URL ? `student${pad3}@kvjanalytics.test` : `user${userNum}@kvjanalytics.test`);
  const password = url.searchParams.get("password") || (email.includes("@kvjanalytics.test") ? "LocalSyntheticStudent2026!" : DEFAULT_PASSWORD);

  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase admin not configured" }, { status: 500 });
  }

  // Attempt login with isolated auth client (protects admin singleton session)
  const authClient = getAuthClient();
  const { data: signInData, error: signInErr } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (signInErr || !signInData?.session) {
    return NextResponse.json(
      {
        error: "Failed to authenticate test user",
        details: signInErr?.message || "No session returned",
        email,
      },
      { status: 401 }
    );
  }

  // Determine redirect target
  let targetLesson = MODULE5_LESSON_ID;
  if (lessonParam) {
    targetLesson = lessonParam;
  } else if (targetParam.toLowerCase().includes("6")) {
    targetLesson = MODULE6_LESSON_ID;
  } else if (targetParam.toLowerCase().includes("5")) {
    targetLesson = MODULE5_LESSON_ID;
  }

  const redirectUrl = new URL(`/training/power-bi/learn?lesson=${targetLesson}`, req.url);
  const response = NextResponse.redirect(redirectUrl);

  // Set the standard Supabase access token cookie
  response.cookies.set("sb-access-token", signInData.session.access_token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });

  return response;
}
