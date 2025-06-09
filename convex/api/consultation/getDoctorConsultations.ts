import { query } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDoctorConsultations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get doctor profile
    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!doctorProfile) {
      throw new Error("Doctor profile not found");
    }

    // Get all consultations for this doctor
    const consultations = await ctx.db
      .query("consultationRequests")
      .filter((q) => q.eq(q.field("acceptedByDoctorId"), doctorProfile._id))
      .collect();

    // Get patient details for each consultation
    const consultationsWithPatientDetails = await Promise.all(
      consultations.map(async (consultation) => {
        const patientProfile = await ctx.db.get(consultation.patientId);
        return {
          ...consultation,
          patient: patientProfile
            ? {
                fullName: patientProfile.fullName,
                age: patientProfile.age,
                sex: patientProfile.sex,
              }
            : null,
        };
      })
    );

    return consultationsWithPatientDetails;
  },
});
