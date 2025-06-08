import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getConsultationDetails = query({
  args: {
    consultationId: v.id("consultationRequests"),
  },
  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(args.consultationId);

    if (!consultation) {
      return null;
    }

    // Get patient profile details
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
  },
});
