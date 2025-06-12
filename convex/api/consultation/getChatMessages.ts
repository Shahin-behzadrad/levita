import { query } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getChatMessages = query({
  args: {
    consultationId: v.id("consultations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) throw new Error("Consultation not found");

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
      throw new Error("User is not authorized to view messages");
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

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_consultation", (q) =>
        q.eq("consultationId", args.consultationId)
      )
      .collect();

    return messages;
  },
});
