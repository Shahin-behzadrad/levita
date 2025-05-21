import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const getUserProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    return userProfile;
  },
});

export const updateUserProfile = mutation({
  args: {
    name: v.string(),
    age: v.optional(v.number()),
    sex: v.optional(v.string()),
    symptoms: v.optional(v.array(v.string())),
    generalHealthStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .unique();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, args);
    } else {
      await ctx.db.insert("userProfiles", {
        userId: userId as Id<"users">,
        ...args,
      });
    }
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .unique();
  },
});
