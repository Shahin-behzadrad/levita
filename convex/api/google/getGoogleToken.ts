import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getGoogleToken = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const token = await ctx.db
      .query("googleTokens")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return token;
  },
});
