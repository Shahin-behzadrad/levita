import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const acceptConsultation = mutation({
  args: {
    requestId: v.id("consultations"),
    doctorId: v.id("doctorProfiles"),
    consultationDateTime: v.string(),
    meetLink: v.string(),
  },
  handler: async (
    ctx,
    { requestId, doctorId, consultationDateTime, meetLink }
  ) => {
    const request = await ctx.db.get(requestId);
    if (!request) throw new Error("Request not found");

    if (request.status !== "pending") {
      throw new Error("Request already handled");
    }

    await ctx.db.patch(requestId, {
      status: "accepted",
      acceptedByDoctorId: doctorId,
      consultationDateTime,
      chatIsActive: true,
      meetLink,
    });
  },
});
