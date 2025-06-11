import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: {
    consultationId: v.id("consultations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) throw new Error("Consultation not found");

    if (!consultation.chatStarted || consultation.chatEnded) {
      throw new Error("Chat is not active");
    }

    // Verify the user is either the doctor or the patient
    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!doctorProfile && !patientProfile) {
      throw new Error("User is not authorized to send messages");
    }

    if (
      doctorProfile &&
      consultation.acceptedByDoctorId !== doctorProfile._id
    ) {
      throw new Error("Doctor is not assigned to this consultation");
    }

    if (patientProfile && consultation.patientId !== patientProfile._id) {
      throw new Error("Patient is not part of this consultation");
    }

    await ctx.db.insert("chatMessages", {
      consultationId: args.consultationId,
      senderId: userId,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});
