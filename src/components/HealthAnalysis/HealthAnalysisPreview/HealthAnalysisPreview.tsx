import HealthAnalysisDocuments from "./HealthAnalysisDocuments";
import styles from "./HealthAnalysisPreview.module.scss";
import OcrResultModal from "./OcrResultModal";

export const HealthAnalysisPreview = ({
  patientProfile,
  analysisData,
  fileUrls,
  processingOCR,
  handleExtractText,
  showOcrModal,
  ocrResult,
  setShowOcrModal,
}: {
  patientProfile: any;
  analysisData: any;
  fileUrls?: (string | null)[] | undefined;
  processingOCR: boolean;
  handleExtractText: (doc: any) => void;
  showOcrModal: boolean;
  ocrResult: any;
  setShowOcrModal: (show: boolean) => void;
}) => {
  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>Your Health Analysis</h2>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
            background: "#fafbfc",
          }}
        >
          <h3>Patient Information</h3>
          <h4>{patientProfile.fullName}</h4>
          <div>
            <strong>Symptoms and Concerns:</strong> {analysisData.symptoms}
          </div>
          <div>
            <strong>Current Conditions, Illness, and Medication:</strong>{" "}
            {analysisData.currentConditions}
          </div>
          <div>
            <strong>Age:</strong> {patientProfile.age}
          </div>
          <div>
            <strong>Gender:</strong> {patientProfile.sex}
          </div>
          <div>
            <strong>General Health Status:</strong> {analysisData.healthStatus}
          </div>
          <div>
            <strong>Additional Information:</strong>{" "}
            {analysisData.additionalInfo}
          </div>
        </div>
        <HealthAnalysisDocuments
          documents={analysisData.documents || []}
          fileUrls={(fileUrls || []).filter(
            (url): url is string => typeof url === "string"
          )}
          processingOCR={processingOCR}
          onExtractText={handleExtractText}
        />
      </div>
      <OcrResultModal
        open={showOcrModal && !!ocrResult}
        text={ocrResult?.text || ""}
        onClose={() => setShowOcrModal(false)}
      />
    </>
  );
};
