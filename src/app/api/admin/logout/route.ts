import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Clear cookie session
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Set expiry to past to delete
  });

  return response;
}
