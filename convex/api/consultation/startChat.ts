import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const startChat = mutation({
  args: {
    consultationId: v.id("consultations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) throw new Error("Consultation not found");

    // Only the doctor can start the chat
    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (
      !doctorProfile ||
      consultation.acceptedByDoctorId !== doctorProfile._id
    ) {
      throw new Error("Only the assigned doctor can start the chat");
    }

    // Check if it's time for the consultation
    const now = new Date();
    const consultationTime = new Date(consultation.consultationDateTime!);
    // if (now < consultationTime) {
    //   throw new Error("Cannot start chat before consultation time");
    // }

    await ctx.db.patch(args.consultationId, {
      chatIsActive: true,
    });
  },
});
