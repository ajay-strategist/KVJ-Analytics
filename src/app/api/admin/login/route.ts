import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const adminUsername = process.env.ADMIN_USERNAME || "mail@thestrategist.co.in";
    const adminPassword = process.env.ADMIN_PASSWORD || "AjayThomas@1";

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: "Incorrect username or password." },
        { status: 401 }
      );
    }

    // Create session cookie
    const response = NextResponse.json({ success: true });

    // Set HTTP-only secure cookie
    response.cookies.set("admin_session", "authenticated", {
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
