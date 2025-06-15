import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
};

export const getTokens = async (code: string) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Ensure we have both access_token and refresh_token
    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    // If we don't have a refresh token, we need to force consent
    if (!tokens.refresh_token) {
      const newAuthUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES,
      });
      throw new Error("No refresh token. Please re-authenticate.");
    }

    return tokens;
  } catch (error) {
    console.error("Error getting tokens:", error);
    throw error;
  }
};

export const getOAuthClientWithTokens = (tokens: any) => {
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
};
