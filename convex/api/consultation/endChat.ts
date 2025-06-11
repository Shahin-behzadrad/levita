import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const endChat = mutation({
  args: {
    consultationId: v.id("consultations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) throw new Error("Consultation not found");

    // Only the doctor can end the chat
    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (
      !doctorProfile ||
      consultation.acceptedByDoctorId !== doctorProfile._id
    ) {
      throw new Error("Only the assigned doctor can end the chat");
    }

    if (!consultation.chatStarted) {
      throw new Error("Chat has not been started");
    }

    await ctx.db.patch(args.consultationId, {
      chatEnded: true,
      status: "completed",
    });
  },
});
