import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("google_tokens");

    if (!cookie?.value) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const tokens = JSON.parse(cookie.value);
    const isAuthenticated = !!tokens.access_token;

    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    console.error("Error checking Google auth status:", error);
    return NextResponse.json({ isAuthenticated: false });
  }
}
