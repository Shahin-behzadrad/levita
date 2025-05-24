"use node"; // Required for using Node.js modules like 'openai' and 'stream/web'

import { v } from "convex/values";
import { internal } from "./_generated/api"; // Correct: Use internal for calling functions in other files
import { action, ActionCtx } from "./_generated/server";
import { Id, Doc } from "./_generated/dataModel";
import OpenAI from "openai";

// Initialize OpenAI client using bundled Convex environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getFileContent(
  ctx: ActionCtx,
  storageId: Id<"_storage">
): Promise<{ content: string; isImage: boolean; error?: string }> {
  const blob = await ctx.storage.get(storageId);
  if (!blob) {
    throw new Error(`File not found for storageId: ${storageId}`);
  }

  // Check if the file is an image
  if (blob.type.startsWith("image/")) {
    try {
      // Convert blob to base64 for image analysis
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      // Validate image size (OpenAI has a 20MB limit)
      const sizeInMB = arrayBuffer.byteLength / (1024 * 1024);
      if (sizeInMB > 20) {
        return {
          content: "",
          isImage: true,
          error: "Image size exceeds 20MB limit",
        };
      }

      // Validate image format
      const validFormats = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validFormats.includes(blob.type)) {
        return {
          content: "",
          isImage: true,
          error: `Unsupported image format: ${blob.type}. Supported formats are: ${validFormats.join(", ")}`,
        };
      }

      return {
        content: `data:${blob.type};base64,${base64}`,
        isImage: true,
      };
    } catch (error) {
      console.error("Error processing image:", error);
      return {
        content: "",
        isImage: true,
        error: "Failed to process image",
      };
    }
  }

  return {
    content: await blob.text(),
    isImage: false,
  };
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
    let isImage = false;
    let imageError: string | undefined;

    if (args.labResultId) {
      const labResult: Doc<"labResults"> | null = await ctx.runQuery(
        internal.healthQueriesAndMutations.getLabResultInternal,
        { labResultId: args.labResultId }
      );
      if (!labResult || labResult.userId !== userId) {
        throw new Error("Lab result not found or access denied.");
      }
      try {
        const {
          content,
          isImage: isImageFile,
          error,
        } = await getFileContent(ctx, labResult.storageId);
        labContent = content;
        isImage = isImageFile;
        imageError = error;

        if (error) {
          console.error("Image processing error:", error);
          labContent = `Error processing image: ${error}`;
        }
      } catch (e) {
        console.error("Failed to get file content:", e);
        labContent = "Error reading lab file content.";
      }
    }

    const symptomsString =
      userProfile.symptoms?.join(", ") || "No specific symptoms reported.";

    const prompt = `
      Analyze this user's health information and provide a comprehensive health assessment.
      
      User Profile:
      - Age: ${userProfile.age || "Not specified"}
      - Sex: ${userProfile.sex || "Not specified"}
      - Symptoms: ${symptomsString}
      - Health Status: ${userProfile.generalHealthStatus || "Not specified"}
      ${args.labResultId ? `Lab Results: ${isImage ? "[Image Analysis]" : labContent}\n` : ""}
      
      Provide a detailed JSON response with the following structure:
      {
        "potentialIssues": [
          {
            "issue": "Description of the health concern",
            "severity": "low/medium/high",
            "recommendation": "Specific action to take"
          }
        ],
        "recommendedSpecialists": [
          {
            "specialty": "Type of specialist",
            "reason": "Why this specialist is recommended",
            "priority": "high/medium/low"
          }
        ],
        "recommendedActivities": [
          {
            "activity": "Name of activity",
            "frequency": "How often to perform",
            "benefits": "Expected health benefits"
          }
        ],
        "medicationSuggestions": [
          {
            "name": "Medication name",
            "purpose": "What it's for",
            "dosage": "Recommended dosage",
            "source": "Link to reliable medical information",
            "disclaimer": "Important safety information"
          }
        ],
        "lifestyleChanges": [
          {
            "change": "Specific lifestyle change",
            "impact": "Expected health impact",
            "implementation": "How to implement"
          }
        ]
      }
      
      Important:
      1. For medication suggestions, always include reliable medical information sources
      2. Include appropriate medical disclaimers
      3. Prioritize evidence-based recommendations
      4. Consider the user's age and sex in recommendations
      5. If analyzing an image, focus on visible symptoms or conditions
      `;

    let analysisResult: {
      potentialIssues?: Array<{
        issue: string;
        severity: string;
        recommendation: string;
      }>;
      recommendedSpecialists?: Array<{
        specialty: string;
        reason: string;
        priority: string;
      }>;
      recommendedActivities?: Array<{
        activity: string;
        frequency: string;
        benefits: string;
      }>;
      medicationSuggestions?: Array<{
        name: string;
        purpose: string;
        dosage: string;
        source: string;
        disclaimer: string;
      }>;
      lifestyleChanges?: Array<{
        change: string;
        impact: string;
        implementation: string;
      }>;
      error?: string;
    };

    try {
      const messages = [
        {
          role: "user" as const,
          content:
            isImage && labContent && !imageError
              ? [
                  { type: "text" as const, text: prompt },
                  {
                    type: "image_url" as const,
                    image_url: { url: labContent },
                  },
                ]
              : prompt,
        },
      ];

      console.log("Sending to OpenAI:", {
        hasImage: isImage,
        imageError,
        contentLength: labContent.length,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });

      const rawResponse = completion.choices[0].message.content;
      if (!rawResponse) {
        throw new Error("OpenAI returned an empty response.");
      }
      analysisResult = JSON.parse(rawResponse);
    } catch (error) {
      console.error("OpenAI API call failed:", error);
      analysisResult = {
        potentialIssues: [
          {
            issue: "Error during analysis",
            severity: "low",
            recommendation: "Please try again or consult a healthcare provider",
          },
        ],
        error:
          error instanceof Error
            ? error.message
            : "Unknown error during AI analysis",
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
        potentialIssues:
          analysisResult.potentialIssues?.map((issue) => issue.issue) || [],
        recommendedSpecialty:
          analysisResult.recommendedSpecialists?.[0]?.specialty,
        supplementSuggestions:
          analysisResult.medicationSuggestions?.map(
            (med) => `${med.name}: ${med.purpose}`
          ) || [],
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
