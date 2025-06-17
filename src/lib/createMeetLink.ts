"use server";

import { google } from "googleapis";

/**
 * Create a meet event
 * @param {string} start
 * @param {string} end
 * @param {object} tokens
 * @param {string} userId
 * @param {string} email
 * @returns {string}
 */
export async function createMeet(
  start: string,
  end: string,
  tokens: {
    access_token: string;
    refresh_token?: string;
  },
  userId: string,
  email: string
) {
  try {
    if (!tokens.access_token) {
      throw new Error("Missing access token.");
    }

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`
    );

    auth.setCredentials(tokens);

    // Automatically refresh token if expired
    auth.on("tokens", async (newTokens) => {
      // Call API route to update tokens in DB
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/google/update-tokens`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token,
            email,
          }),
        }
      );
    });

    const calendar = google.calendar({ version: "v3", auth });

    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: "Medical Consultation",
        description: "Online medical consultation appointment",
        start: { dateTime: start },
        end: { dateTime: end },
        conferenceData: {
          createRequest: {
            requestId: Math.random().toString(36).substring(2),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
      conferenceDataVersion: 1,
    });

    const meetLink = event.data.hangoutLink;

    if (!meetLink) {
      throw new Error("Google Meet link not created.");
    }

    return meetLink;
  } catch (error) {
    console.error("Error creating Google Meet:", error);
    throw error;
  }
}
