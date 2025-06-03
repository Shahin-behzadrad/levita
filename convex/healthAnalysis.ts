import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

export const getHealthAnalysis = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!patientProfile) {
      throw new ConvexError("Patient profile not found");
    }

    return patientProfile.healthAnalysis;
  },
});

export const updateHealthAnalysis = mutation({
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!patientProfile) {
      throw new ConvexError("Patient profile not found");
    }

    const now = Date.now();
    const healthAnalysis = {
      ...args,
      createdAt: patientProfile.healthAnalysis?.createdAt || now,
      updatedAt: now,
    };

    await ctx.db.patch(patientProfile._id, {
      healthAnalysis,
    });

    return healthAnalysis;
  },
});
