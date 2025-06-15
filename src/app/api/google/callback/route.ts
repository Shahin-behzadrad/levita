import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "@/lib/googleAuth";
import { serialize } from "cookie";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return new NextResponse("No authorization code provided", {
        status: 400,
      });
    }

    const tokens = await getTokens(code);
    console.log("Tokens received successfully");

    // Set cookie header on the response
    const response = NextResponse.redirect(new URL("/?view=home", req.url));
    response.headers.set(
      "Set-Cookie",
      serialize("google_tokens", JSON.stringify(tokens), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    return response;
  } catch (error: any) {
    console.error("Google callback error:", error);

    // Handle specific error cases
    if (error.message.includes("No refresh token")) {
      return NextResponse.redirect(
        new URL("/api/google/redirect?prompt=consent", req.url)
      );
    }

    // For other errors, redirect to home with error parameter
    return NextResponse.redirect(
      new URL("/?view=home&error=google_auth_failed", req.url)
    );
  }
}
