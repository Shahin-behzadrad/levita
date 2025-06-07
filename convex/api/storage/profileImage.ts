import { v } from "convex/values";
import { mutation, query } from "../../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../../_generated/dataModel";

export const getProfileImageUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.storage.getUrl(args.storageId as Id<"_storage">);
  },
});

export const generateProfileImageUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateProfileImage = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is a doctor
    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (doctorProfile) {
      // Update doctor profile
      await ctx.db.patch(doctorProfile._id, {
        profileImage: args.storageId,
      });
      return await ctx.db.get(doctorProfile._id);
    }

    // Check if user is a patient
    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (patientProfile) {
      // Update patient profile
      await ctx.db.patch(patientProfile._id, {
        profileImage: args.storageId,
      });
      return await ctx.db.get(patientProfile._id);
    }

    throw new Error("No profile found");
  },
});

export const deleteProfileImage = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is a doctor
    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (doctorProfile) {
      // Delete doctor profile image
      await ctx.db.patch(doctorProfile._id, {
        profileImage: undefined,
      });
      return await ctx.db.get(doctorProfile._id);
    }

    // Check if user is a patient
    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (patientProfile) {
      // Delete patient profile image
      await ctx.db.patch(patientProfile._id, {
        profileImage: undefined,
      });
      return await ctx.db.get(patientProfile._id);
    }

    throw new Error("No profile found");
  },
});
