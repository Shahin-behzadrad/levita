import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const acceptConsultation = mutation({
  args: {
    requestId: v.id("consultationRequests"),
    doctorId: v.id("doctorProfiles"),
  },
  handler: async (ctx, { requestId, doctorId }) => {
    const request = await ctx.db.get(requestId);
    if (!request) throw new Error("Request not found");

    if (request.status !== "pending") {
      throw new Error("Request already handled");
    }

    await ctx.db.patch(requestId, {
      status: "accepted",
      acceptedByDoctorId: doctorId,
    });
  },
});
