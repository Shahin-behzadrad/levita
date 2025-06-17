import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const storeGoogleTokens = mutation({
  args: {
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("googleTokens")
      .filter((q) =>
        q.or(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("email"), args.email)
        )
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        email: args.email,
      });
    } else {
      await ctx.db.insert("googleTokens", args);
    }
  },
});
