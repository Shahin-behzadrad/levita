import { query } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "../../_generated/api";
import { Doc, Id } from "../../_generated/dataModel";
import { Url } from "url";

interface Document {
  storageId: string;
  fileName: string;
  fileType: string;
  uploadedAt: number;
}

interface PatientDetails {
  fullName: string;
  age: number;
  sex: string;
  documents: (string | null)[];
}

interface DoctorReportPreview {
  patientOverview?: string;
  clinicalConsiderations?: string;
  differentialDiagnosis?: string[];
  recommendations?: string[];
  conclusion?: string;
  laboratoryFindings?: {
    Biochemistry?: string[];
    Complete_Blood_Count?: string[];
    Other?: string[];
  };
}

interface ConsultationWithPatient {
  _id: Id<"consultations">;
  _creationTime: number;
  patientId: Id<"patientProfiles">;
  acceptedByDoctorId?: Id<"doctorProfiles">;
  status: "pending" | "in_progress" | "completed" | "rejected" | "accepted";
  consultationDateTime?: string;
  chatIsActive?: boolean;
  doctorReportPreview?: DoctorReportPreview;
  patient: PatientDetails | null;
  meetLink?: Url;
}

export const getDoctorConsultations = query({
  handler: async (ctx): Promise<ConsultationWithPatient[]> => {
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
      .query("consultations")
      .filter((q) => q.eq(q.field("acceptedByDoctorId"), doctorProfile._id))
      .collect();

    // Get patient details for each consultation
    const consultationsWithPatientDetails: ConsultationWithPatient[] =
      await Promise.all(
        consultations.map(
          async (consultation): Promise<ConsultationWithPatient> => {
            const patientProfile = await ctx.db.get(consultation.patientId);
            const documents = (patientProfile?.healthInput?.documents ||
              []) as Document[];
            const documentUrls: (string | null)[] =
              documents?.length > 0
                ? await ctx.runQuery(
                    api.functions.internal.api.storage.fileStorage.getFileUrls,
                    {
                      storageIds: documents.map((doc) => doc.storageId),
                    }
                  )
                : [];

            return {
              ...consultation,
              patient: patientProfile
                ? {
                    fullName: patientProfile.fullName,
                    age: patientProfile.age,
                    sex: patientProfile.sex,
                    documents: documentUrls,
                  }
                : null,
            };
          }
        )
      );

    return consultationsWithPatientDetails;
  },
});
