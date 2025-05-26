// This file does NOT have "use node";
// It contains queries and mutations that run in the default Convex V8 environment.

import { v } from "convex/values";
import {
  internalQuery,
  internalMutation,
  query,
  QueryCtx,
  MutationCtx,
  mutation,
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
    labResultIds: v.optional(v.array(v.id("labResults"))),
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
  rawAnalysis: string | undefined;
  labFileNames: string[] | null;
};

export const getHealthAnalysesForUser = query({
  handler: async (ctx: QueryCtx): Promise<HealthAnalysisWithLabFile[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const analyses = await ctx.db
      .query("healthAnalyses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get lab file names for each analysis
    const analysesWithLabFiles = await Promise.all(
      analyses.map(async (analysis) => {
        let labFileNames: string[] | null = null;
        if (analysis.labResultIds && analysis.labResultIds.length > 0) {
          const labResults = await Promise.all(
            analysis.labResultIds.map((id) => ctx.db.get(id))
          );
          labFileNames = labResults
            .filter((result): result is Doc<"labResults"> => result !== null)
            .map((result) => result.fileName);
        }
        return {
          ...analysis,
          rawAnalysis: analysis.rawAnalysis,
          labFileNames,
        };
      })
    );

    return analysesWithLabFiles;
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
    let labFileNames: string[] | null = null;
    if (analysis.labResultIds && analysis.labResultIds.length > 0) {
      const labResults = await Promise.all(
        analysis.labResultIds.map((id) => ctx.db.get(id))
      );
      labFileNames = labResults
        .filter((result): result is Doc<"labResults"> => result !== null)
        .map((result) => result.fileName);
    }
    return {
      ...analysis,
      rawAnalysis: analysis.rawAnalysis,
      labFileNames,
    };
  },
});
