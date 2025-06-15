"use server";

import { cookies } from "next/headers";
import { google } from "googleapis";

/**
 * Create a meet event
 * @param {string} start
 * @param {string} end
 * @returns {string}
 */
export async function createMeet(start: string, end: string) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("google_tokens");

    if (!cookie?.value) {
      throw new Error(
        "No Google tokens found. Please authenticate with Google first."
      );
    }

    const tokens = JSON.parse(cookie.value);

    if (!tokens.access_token) {
      throw new Error(
        "Invalid Google tokens. Please re-authenticate with Google."
      );
    }

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`
    );

    auth.setCredentials(tokens);

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

    if (!event.data.hangoutLink) {
      throw new Error("Failed to create Google Meet link");
    }

    return event.data.hangoutLink;
  } catch (error) {
    console.error("Error creating Google Meet:", error);
    throw error;
  }
}
