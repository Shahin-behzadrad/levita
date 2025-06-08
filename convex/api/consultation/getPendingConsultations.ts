import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getPendingConsultations = query({
  handler: async (ctx) => {
    const consultations = await ctx.db
      .query("consultationRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    // Return a simplified version with only essential fields
    return consultations.map((consultation) => ({
      _id: consultation._id,
      _creationTime: consultation._creationTime,
      createdAt: consultation.createdAt,
      patientId: consultation.patientId,
      status: consultation.status,
    }));
  },
});
