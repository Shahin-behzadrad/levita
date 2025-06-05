export interface LaboratoryFindings {
  Biochemistry: string[];
  Complete_Blood_Count: string[];
  Other: string[];
}

export interface DoctorReport {
  patientOverview: string;
  clinicalConsiderations: string;
  laboratoryFindings: LaboratoryFindings;
  differentialDiagnosis: string[];
  recommendations: string[];
  conclusion: string;
}

export interface PatientReport {
  summary: string;
  testResults: string;
  reassurance: string;
  nextSteps: string;
}

export interface AIAnalysisResult {
  doctorReport: DoctorReport;
  patientReport: PatientReport;
  disclaimer: string;
}

export interface AIAnalysisResponse {
  result: AIAnalysisResult;
}
