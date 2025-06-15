import { google } from "googleapis";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return new Response("Missing code", { status: 400 });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
  const userInfo = await oauth2.userinfo.get();
  const email = userInfo.data.email;

  // For now, redirect with token data to frontend route
  const query = new URLSearchParams({
    accessToken: tokens.access_token || "",
    refreshToken: tokens.refresh_token || "",
    email: email || "",
  });

  return Response.redirect(`http://localhost:3000?${query}`);
}
