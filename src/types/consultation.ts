import { Id } from "../../convex/_generated/dataModel";

export type LaboratoryFindings = {
  Biochemistry: string[];
  Complete_Blood_Count: string[];
  Other: string[];
};

export type DoctorReportPreview = {
  patientOverview: string;
  clinicalConsiderations: string;
  laboratoryFindings: LaboratoryFindings;
  differentialDiagnosis: string[];
  recommendations: string[];
  conclusion: string;
};

export type ConsultationRequest = {
  _id: Id<"consultationRequests">;
  _creationTime: number;
  patientId: Id<"patientProfiles">;
  senderUserId: Id<"users">;
  status: "pending" | "accepted" | "rejected";
  acceptedByDoctorId?: Id<"doctorProfiles">;
  doctorReportPreview?: DoctorReportPreview;
  createdAt: number;
};
