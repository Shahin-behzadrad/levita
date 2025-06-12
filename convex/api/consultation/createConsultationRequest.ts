import { mutation } from "../../_generated/server";
import { Id } from "../../_generated/dataModel";
import { v } from "convex/values";

export const CreateConsultationRequest = mutation({
  args: {
    patientId: v.id("patientProfiles"),
    doctorReportPreview: v.optional(
      v.object({
        patientOverview: v.string(),
        clinicalConsiderations: v.string(),
        laboratoryFindings: v.object({
          Biochemistry: v.array(v.string()),
          Complete_Blood_Count: v.array(v.string()),
          Other: v.array(v.string()),
        }),
        differentialDiagnosis: v.array(v.string()),
        recommendations: v.array(v.string()),
        conclusion: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const patientProfile = await ctx.db.get(args.patientId);
    if (!patientProfile) throw new Error("Patient profile not found");

    const existing = await ctx.db
      .query("consultations")
      .withIndex("by_patientId", (q) => q.eq("patientId", args.patientId))
      .collect();

    const activeConsultation = existing.find(
      (r) => r.status === "pending" || r.status === "accepted"
    );

    if (activeConsultation) {
      console.log("Duplicate consultation attempt:", {
        patientId: args.patientId,
        existingStatus: activeConsultation.status,
        existingId: activeConsultation._id,
      });
      throw new Error("Patient already has an active consultation");
    }

    console.log("Creating new consultation request:", {
      patientId: args.patientId,
      senderUserId: patientProfile.userId,
      hasDoctorReport: !!args.doctorReportPreview,
    });

    return await ctx.db.insert("consultations", {
      patientId: args.patientId,
      senderUserId: patientProfile.userId,
      status: "pending",
      doctorReportPreview: args.doctorReportPreview,
      chatIsActive: false,
      createdAt: Date.now(),
    });
  },
});
