import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getExistingConsultationRequest = query({
  args: {
    patientId: v.id("patientProfiles"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("consultationRequests")
      .withIndex("by_patientId", (q) => q.eq("patientId", args.patientId))
      .collect();

    return (
      existing.find((r) => r.status === "pending" || r.status === "accepted") ??
      null
    );
  },
});
