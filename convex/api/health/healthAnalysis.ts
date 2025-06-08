import { v } from "convex/values";
import { mutation, query, action } from "../../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { generateAIAnalysis } from "../ai/openai";
import { api } from "../../_generated/api";

export const getHealthAnalysisInfo = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!patientProfile) throw new ConvexError("Patient profile not found");

    return {
      healthAnalysis: patientProfile.healthInput ?? null,
      ocr: patientProfile.ocr?.ocrText ?? null,
    };
  },
});

export const updateHealthAnalysisInfo = mutation({
  args: {
    symptoms: v.string(),
    currentConditions: v.string(),
    healthStatus: v.string(),
    additionalInfo: v.string(),
    documents: v.array(
      v.object({
        storageId: v.string(),
        fileName: v.string(),
        fileType: v.string(),
        uploadedAt: v.number(),
      })
    ),
    ocrText: v.optional(v.array(v.string())), // merged OCR input
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!patientProfile) throw new ConvexError("Patient profile not found");

    const now = Date.now();
    const healthInput = {
      symptoms: args.symptoms,
      currentConditions: args.currentConditions,
      healthStatus: args.healthStatus,
      additionalInfo: args.additionalInfo,
      documents: args.documents,
      createdAt: patientProfile.healthInput?.createdAt || now,
      updatedAt: now,
    };

    await ctx.db.patch(patientProfile._id, {
      healthInput,
      ...(args.ocrText && { ocr: { ocrText: args.ocrText } }), // conditional update
    });

    return { healthInput, ocr: args.ocrText ?? null };
  },
});

export const getAIAnalysis = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!patientProfile) throw new ConvexError("Patient profile not found");

    return patientProfile.aiAnalysis ?? null;
  },
});

export const updateAIAnalysis = mutation({
  args: {
    patientId: v.id("patientProfiles"),
    aiAnalysis: v.object({
      doctorReport: v.object({
        patientOverview: v.string(),
        clinicalConsiderations: v.string(),
        laboratoryFindings: v.object({
          Biochemistry: v.array(v.string()),
          Complete_Blood_Count: v.array(v.string()),
          Other: v.array(v.string()),
        }),
        differentialDiagnosis: v.array(v.string()),
        recommendations: v.array(v.string()),
        conclusion: v.string(),
      }),
      patientReport: v.object({
        summary: v.string(),
        testResults: v.string(),
        reassurance: v.string(),
        nextSteps: v.string(),
      }),
      disclaimer: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!patientProfile) throw new ConvexError("Patient profile not found");
    if (patientProfile._id !== args.patientId) {
      throw new ConvexError("Not authorized to update this profile");
    }

    await ctx.db.patch(args.patientId, { aiAnalysis: args.aiAnalysis });
  },
});

export const openAIAnalyzeHealth = action({
  args: { language: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const patientProfile = await ctx.runQuery(
      api.api.profiles.patientProfiles.getPatientProfile
    );

    if (!patientProfile?.healthInput) {
      throw new Error("Health analysis data missing");
    }

    const aiResponse = await generateAIAnalysis({
      language: args.language,
      fullName: patientProfile.fullName,
      age: patientProfile.age,
      sex: patientProfile.sex,
      healthInput: {
        symptoms: patientProfile.healthInput.symptoms,
        currentConditions: patientProfile.healthInput.currentConditions,
        healthStatus: patientProfile.healthInput.healthStatus,
        additionalInfo: patientProfile.healthInput.additionalInfo,
      },
      ocr: { ocrText: patientProfile.ocr?.ocrText ?? [] },
    });

    // Store the AI analysis in the patient profile
    await ctx.runMutation(api.api.health.healthAnalysis.updateAIAnalysis, {
      patientId: patientProfile._id,
      aiAnalysis: aiResponse,
    });

    return { result: aiResponse };
  },
});
