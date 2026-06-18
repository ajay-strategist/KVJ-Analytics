import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "kvjadmin";

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Incorrect administrator password." },
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
