import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../../_generated/dataModel";

export const sendMessage = mutation({
  args: {
    consultationId: v.id("consultations"),
    content: v.string(),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { consultationId, content, fileUrl, fileName, fileType } = args;
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const consultation = await ctx.db.get(consultationId);
    if (!consultation) throw new Error("Consultation not found");

    if (!consultation.chatIsActive) {
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

    // Create the message
    const messageId = await ctx.db.insert("chatMessages", {
      consultationId,
      senderId: userId,
      content,
      createdAt: Date.now(),
      fileUrl,
      fileName,
      fileType,
    });

    return messageId;
  },
});
