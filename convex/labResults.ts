import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return await ctx.storage.generateUploadUrl();
});

export const saveLabResult = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    await ctx.db.insert("labResults", {
      userId: userId as Id<"users">,
      storageId: args.storageId,
      fileName: args.fileName,
    });
  },
});

export const getLabResults = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const results = await ctx.db
      .query("labResults")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .order("desc")
      .collect();

    return Promise.all(
      results.map(async (result) => {
        const url = await ctx.storage.getUrl(result.storageId);
        return {
          ...result,
          url,
        };
      })
    );
  },
});
