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
): Promise<{
  content: string;
  isImage: boolean;
  isPdf: boolean;
  error?: string;
}> {
  const blob = await ctx.storage.get(storageId);
  if (!blob) {
    throw new Error(`File not found for storageId: ${storageId}`);
  }

  // Check if the file is a PDF
  if (blob.type === "application/pdf") {
    try {
      // For PDFs, we'll return an error since we can't process them directly
      return {
        content: "",
        isImage: false,
        isPdf: true,
        error:
          "PDF files are not supported in the current version. Please convert to an image format (JPEG, PNG) before uploading.",
      };
    } catch (error) {
      console.error("Error processing PDF:", error);
      return {
        content: "",
        isImage: false,
        isPdf: true,
        error: "Failed to process PDF",
      };
    }
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
          isPdf: false,
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
          isPdf: false,
          error: `Unsupported image format: ${blob.type}. Supported formats are: ${validFormats.join(", ")}`,
        };
      }

      return {
        content: `data:${blob.type};base64,${base64}`,
        isImage: true,
        isPdf: false,
      };
    } catch (error) {
      console.error("Error processing image:", error);
      return {
        content: "",
        isImage: true,
        isPdf: false,
        error: "Failed to process image",
      };
    }
  }

  return {
    content: await blob.text(),
    isImage: false,
    isPdf: false,
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

    let labContents: string[] = [];
    let isImage = false;
    let isPdf = false;
    let imageError: string | undefined;
    let pdfError: string | undefined;

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
          isPdf: isPdfFile,
          error,
        } = await getFileContent(ctx, labResult.storageId);
        labContents.push(content);
        isImage = isImageFile;
        isPdf = isPdfFile;
        if (isImageFile) {
          imageError = error;
        } else if (isPdfFile) {
          pdfError = error;
        }

        if (error) {
          console.error("File processing error:", error);
          labContents.push(`Error processing file: ${error}`);
        }
      } catch (e) {
        console.error("Failed to get file content:", e);
        labContents.push("Error reading lab file content.");
      }
    }

    const symptomsString =
      userProfile.symptoms?.join(", ") || "No specific symptoms reported.";

    const prompt = `
      Analyze the following health information and provide a structured assessment.
      
      User Profile:
      - Age: ${userProfile.age || "Not specified"}
      - Sex: ${userProfile.sex || "Not specified"}
      - Symptoms: ${symptomsString}
      - Health Status: ${userProfile.generalHealthStatus || "Not specified"}
      ${args.labResultId ? `Lab Results: ${isImage ? "[Image Analysis]" : isPdf ? "[PDF Analysis]" : labContents.join("\n\n")}\n` : ""}
      
      Provide a JSON response with this structure:
      {
        "potentialIssues": [
          {
            "issue": "health concern",
            "severity": "low/medium/high",
            "recommendation": "action",
            "dataSource": "specify which data this is based on (e.g., 'symptoms: headache', 'lab result: RBC 4.5', 'age and sex factors')"
          }
        ],
        "recommendedSpecialists": [{"specialty": "type", "reason": "why", "priority": "high/medium/low"}],
        "recommendedActivities": [{"activity": "name", "frequency": "how often", "benefits": "benefits"}],
        "medicationSuggestions": [{"name": "medication", "purpose": "what for", "dosage": "amount", "source": "info link", "disclaimer": "safety info"}],
        "lifestyleChanges": [{"change": "what to change", "impact": "expected result", "implementation": "how to"}]
      }
      
      Note: 
      - For each potential issue, clearly specify which data points it's based on (symptoms, lab results, demographic factors, etc.)
      - Include medical disclaimers and evidence-based recommendations.
      - If an issue is based on multiple data points, list all relevant sources.
    `;

    let analysisResult: {
      potentialIssues?: Array<{
        issue: string;
        severity: string;
        recommendation: string;
        dataSource: string;
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
            isImage && labContents.length > 0 && !imageError
              ? [
                  { type: "text" as const, text: prompt },
                  ...labContents.map((content) => {
                    return {
                      type: "image_url" as const,
                      image_url: {
                        url: content,
                        detail: "high" as const,
                      },
                    };
                  }),
                ]
              : prompt,
        },
      ];

      console.log("Sending to OpenAI:", {
        hasImage: isImage,
        hasPdf: isPdf,
        imageError,
        pdfError,
        contentLength: labContents.join("\n").length,
        messageStructure: JSON.stringify(messages, null, 2),
        fileContent: isImage
          ? labContents[0].substring(0, 100) + "..."
          : "No file content",
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Updated to use the current model
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
            dataSource: "",
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
