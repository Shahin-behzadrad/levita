import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getPendingConsultations = query({
  handler: async (ctx) => {
    const consultations = await ctx.db
      .query("consultationRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    // Get patient information for each consultation
    const consultationsWithPatientInfo = await Promise.all(
      consultations.map(async (consultation) => {
        const patient = await ctx.db.get(consultation.patientId);
        return {
          _id: consultation?._id,
          _creationTime: consultation?._creationTime,
          createdAt: consultation?.createdAt,
          patientId: consultation?.patientId,
          status: consultation?.status,
          patientOverview: consultation?.doctorReportPreview?.patientOverview,
          patient: patient
            ? {
                fullName: patient.fullName,
                age: patient.age,
                sex: patient.sex,
              }
            : null,
        };
      })
    );

    return consultationsWithPatientInfo;
  },
});
