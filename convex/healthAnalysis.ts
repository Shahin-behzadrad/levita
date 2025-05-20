"use node"; // Required for using Node.js modules like 'openai' and 'stream/web'

import { v } from "convex/values";
import { internal } from "./_generated/api"; // Correct: Use internal for calling functions in other files
import { action, ActionCtx } from "./_generated/server";
import { Id, Doc } from "./_generated/dataModel";
import OpenAI from "openai";

// Initialize OpenAI client using bundled Convex environment variables
const openai = new OpenAI({
  baseURL: "https://api.openai.com/v1",
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

async function getFileContent(
  ctx: ActionCtx,
  storageId: Id<"_storage">
): Promise<string> {
  const blob = await ctx.storage.get(storageId);
  if (!blob) {
    throw new Error(`File not found for storageId: ${storageId}`);
  }
  return await blob.text();
}

export const analyzeHealthData = action({
  args: {
    userProfileId: v.id("userProfiles"),
    labResultId: v.optional(v.id("labResults")),
  },
  handler: async (ctx: ActionCtx, args): Promise<Id<"healthAnalyses">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const userId = identity.subject.split("|")[0] as Id<"users">;

    const userProfile: Doc<"userProfiles"> | null = await ctx.runQuery(
      internal.healthQueriesAndMutations.getUserProfileInternal,
      { userProfileId: args.userProfileId }
    );

    if (!userProfile || userProfile.userId !== userId) {
      throw new Error("User profile not found or access denied.");
    }

    let labContent = "";
    if (args.labResultId) {
      // Use ctx.runQuery with internal API path
      const labResult: Doc<"labResults"> | null = await ctx.runQuery(
        internal.healthQueriesAndMutations.getLabResultInternal,
        { labResultId: args.labResultId }
      );
      if (!labResult || labResult.userId !== userId) {
        throw new Error("Lab result not found or access denied.");
      }
      try {
        labContent = await getFileContent(ctx, labResult.storageId);
      } catch (e) {
        console.error("Failed to get file content:", e);
        labContent = "Error reading lab file content.";
      }
    }

    const symptomsString =
      userProfile.symptoms?.join(", ") || "No specific symptoms reported.";

    const prompt = `
      Analyze the following health information for a user and provide a concise summary.
      User Profile:
      - Age: ${userProfile.age || "Not specified"}
      - Sex: ${userProfile.sex || "Not specified"}
      - Symptoms: ${symptomsString}
      - General Health Status: ${userProfile.generalHealthStatus || "Not specified"}

      ${args.labResultId && labContent ? `Lab Test Results (text format):\n${labContent}\n` : ""}

      Based on this information, please provide:
      1. Potential Health Issues: (List 2-3 potential issues or areas of concern. Be cautious and general, advising professional consultation.)
      2. Recommended Medical Specialty: (Suggest a type of doctor or specialist they might consider consulting, e.g., General Practitioner, Cardiologist, Endocrinologist.)
      3. Supplement Suggestions: (Suggest 1-2 relevant supplements with a brief explanation of why, e.g., Magnesium for stress, Vitamin D if deficiency is suspected. Emphasize that these are not medical advice and to consult a doctor.)

      Format your response as a JSON object with keys: "potentialIssues" (array of strings), "recommendedSpecialty" (string), "supplementSuggestions" (array of strings).
      Example:
      {
        "potentialIssues": ["Potential nutritional deficiencies", "Stress-related symptoms"],
        "recommendedSpecialty": "General Practitioner",
        "supplementSuggestions": ["Magnesium: May help with stress and sleep if symptoms are present.", "Multivitamin: To cover potential general nutritional gaps."]
      }
    `;

    let analysisResult: {
      potentialIssues?: string[];
      recommendedSpecialty?: string;
      supplementSuggestions?: string[];
      error?: string;
    };
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const rawResponse = completion.choices[0].message.content;
      if (!rawResponse) {
        throw new Error("OpenAI returned an empty response.");
      }
      analysisResult = JSON.parse(rawResponse);
    } catch (error) {
      console.error("OpenAI API call failed:", error);
      analysisResult = {
        potentialIssues: ["Error during analysis. Please try again."],
        recommendedSpecialty: "N/A",
        supplementSuggestions: [],
        error:
          error instanceof Error
            ? error.message
            : "Unknown error during AI analysis.",
      };
    }

    // Use ctx.runMutation with internal API path
    const analysisId: Id<"healthAnalyses"> = await ctx.runMutation(
      internal.healthQueriesAndMutations.saveHealthAnalysis,
      {
        userId,
        labResultId: args.labResultId,
        userProfileAtAnalysis: {
          age: userProfile.age,
          sex: userProfile.sex,
          symptoms: userProfile.symptoms,
          generalHealthStatus: userProfile.generalHealthStatus,
        },
        potentialIssues: analysisResult.potentialIssues,
        recommendedSpecialty: analysisResult.recommendedSpecialty,
        supplementSuggestions: analysisResult.supplementSuggestions,
        rawAnalysis: JSON.stringify(analysisResult),
      }
    );

    if (args.labResultId && analysisId) {
      // Use ctx.runMutation with internal API path
      await ctx.runMutation(
        internal.healthQueriesAndMutations.linkAnalysisToLabResult,
        {
          labResultId: args.labResultId,
          analysisId: analysisId,
        }
      );
    }

    return analysisId;
  },
});
