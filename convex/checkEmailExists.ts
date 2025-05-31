import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const users = await ctx.db
      .query("users") // or whatever your table is
      .filter((q) => q.eq(q.field("email"), email))
      .collect();
    return users.length > 0;
  },
});
