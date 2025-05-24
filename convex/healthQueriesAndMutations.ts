// This file does NOT have "use node";
// It contains queries and mutations that run in the default Convex V8 environment.

import { v } from "convex/values";
import {
  internalQuery,
  internalMutation,
  query,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id, Doc } from "./_generated/dataModel";

// Internal query to fetch user profile securely
export const getUserProfileInternal = internalQuery({
  args: { userProfileId: v.id("userProfiles") },
  handler: async (ctx: QueryCtx, args): Promise<Doc<"userProfiles"> | null> => {
    return await ctx.db.get(args.userProfileId);
  },
});

// Internal query to fetch lab result securely
export const getLabResultInternal = internalQuery({
  args: { labResultId: v.id("labResults") },
  handler: async (ctx: QueryCtx, args): Promise<Doc<"labResults"> | null> => {
    return await ctx.db.get(args.labResultId);
  },
});

export const saveHealthAnalysis = internalMutation({
  args: {
    userId: v.id("users"),
    labResultId: v.optional(v.id("labResults")),
    userProfileAtAnalysis: v.object({
      age: v.optional(v.number()),
      sex: v.optional(v.string()),
      symptoms: v.optional(v.array(v.string())),
      generalHealthStatus: v.optional(v.string()),
    }),
    potentialIssues: v.optional(v.array(v.string())),
    recommendedSpecialty: v.optional(v.string()),
    supplementSuggestions: v.optional(v.array(v.string())),
    rawAnalysis: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, args): Promise<Id<"healthAnalyses">> => {
    return await ctx.db.insert("healthAnalyses", args);
  },
});

export const linkAnalysisToLabResult = internalMutation({
  args: {
    labResultId: v.id("labResults"),
    analysisId: v.id("healthAnalyses"),
  },
  handler: async (ctx: MutationCtx, args): Promise<void> => {
    const labResult = await ctx.db.get(args.labResultId);
    if (!labResult) {
      throw new Error("Lab result not found for linking.");
    }
    await ctx.db.patch(args.labResultId, { analysisId: args.analysisId });
  },
});

// Define the type for the items returned by getHealthAnalysesForUser
type HealthAnalysisWithLabFile = Doc<"healthAnalyses"> & {
  labFileName: string | null | undefined;
};

export const getHealthAnalysesForUser = query({
  handler: async (ctx: QueryCtx): Promise<HealthAnalysisWithLabFile[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const analyses = await ctx.db
      .query("healthAnalyses")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .order("desc")
      .collect();

    return Promise.all(
      analyses.map(
        async (
          analysis: Doc<"healthAnalyses">
        ): Promise<HealthAnalysisWithLabFile> => {
          let labFileName = null;
          if (analysis.labResultId) {
            const labResult = await ctx.db.get(analysis.labResultId);
            labFileName = labResult?.fileName;
          }
          return {
            ...analysis,
            labFileName,
          };
        }
      )
    );
  },
});

export const getHealthAnalysisById = query({
  args: { analysisId: v.id("healthAnalyses") },
  handler: async (
    ctx: QueryCtx,
    args: { analysisId: Id<"healthAnalyses"> }
  ): Promise<HealthAnalysisWithLabFile | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis || analysis.userId !== userId) {
      return null;
    }
    let labFileName = null;
    if (analysis.labResultId) {
      const labResult = await ctx.db.get(analysis.labResultId);
      labFileName = labResult?.fileName;
    }
    return {
      ...analysis,
      rawAnalysis: analysis?.rawAnalysis,
      labFileName,
    };
  },
});
