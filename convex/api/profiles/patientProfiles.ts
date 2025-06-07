import { query } from "../../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

export const getPatientProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const profile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return profile;
  },
});
