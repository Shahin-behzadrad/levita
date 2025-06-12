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
  _id: Id<"consultations">;
  _creationTime: number;
  patientId: Id<"patientProfiles">;
  senderUserId: Id<"users">;
  status: "pending" | "accepted" | "rejected";
  acceptedByDoctorId?: Id<"doctorProfiles">;
  doctorReportPreview?: DoctorReportPreview;
  createdAt: number;
  consultationDateTime?: string;
};

export type PendingConsultation = {
  _id: Id<"consultations">;
  _creationTime: number;
  createdAt: number;
  patientId: Id<"patientProfiles">;
  status: "pending" | "accepted" | "rejected";
  patientOverview: string;
  patient: {
    fullName: string;
    age: number;
    sex: string;
  } | null;
};
