import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function POST(req: Request) {
  try {
    const { userId, accessToken, refreshToken, email } = await req.json();
    if (!userId || !accessToken || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    await fetchMutation(api.api.google.storeGoogleTokens.storeGoogleTokens, {
      userId,
      accessToken,
      refreshToken,
      email,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating Google tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
