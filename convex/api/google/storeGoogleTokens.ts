// convex/mutations/storeGoogleTokens.ts
import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const storeGoogleTokens = mutation({
  args: {
    userId: v.id("users"), // Or however your schema is set
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("googleTokens", {
      userId: args.userId,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      email: args.email,
    });
  },
});
