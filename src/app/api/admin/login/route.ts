import { NextRequest, NextResponse } from "next/server";
import { adminToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // No hardcoded fallback — refuse if not configured server-side.
    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials are not configured on the server." },
        { status: 500 }
      );
    }

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: "Incorrect username or password." },
        { status: 401 }
      );
    }

    // Create session cookie with a non-forgeable secret token.
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_session", adminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day session
    });

    return response;
  } catch (error) {
    console.error("Admin login API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
