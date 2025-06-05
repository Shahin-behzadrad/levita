export interface LaboratoryFindings {
  Biochemistry: string[];
  "Complete Blood Count": string[];
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

export interface patientReport {
  summary: string;
  testResults: string;
  reassurance: string;
  nextSteps: string;
}

export interface AIAnalysisResult {
  doctorReport: DoctorReport;
  patientReport: patientReport;
  disclaimer: string;
}

export interface AIAnalysisResponse {
  result: AIAnalysisResult;
}
