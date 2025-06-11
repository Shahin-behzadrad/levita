import { v } from "convex/values";
import { mutation, query } from "../../../../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { Id } from "../../../../_generated/dataModel";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.storage.getUrl(args.storageId as Id<"_storage">);
  },
});

export const getFileUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const urls = await Promise.all(
      args.storageIds.map((id) => ctx.storage.getUrl(id as Id<"_storage">))
    );
    return urls;
  },
});
