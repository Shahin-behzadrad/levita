import Modal from "@/components/Shared/Modal/Modal";
import { AIAnalysisResult } from "@/types/healthAnalysis";
import styles from "./AIAnalysisModal.module.scss";

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AIAnalysisResult;
}

export const AIAnalysisModal = ({
  isOpen,
  onClose,
  analysis,
}: AIAnalysisModalProps) => {
  const { doctorReport, patientReport, disclaimer } = analysis;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Health Analysis Results">
      <div className={styles.container}>
        {/* Patient-Friendly Overview Section */}
        <section className={styles.section}>
          <h2>Patient-Friendly Overview</h2>
          <div className={styles.content}>
            <div className={styles.card}>
              <h3>Summary</h3>
              <p>{patientReport.summary}</p>
            </div>
            <div className={styles.card}>
              <h3>Test Results</h3>
              <p>{patientReport.testResults}</p>
            </div>
            <div className={styles.card}>
              <h3>Reassurance</h3>
              <p>{patientReport.reassurance}</p>
            </div>
            <div className={styles.card}>
              <h3>Next Steps</h3>
              <p>{patientReport.nextSteps}</p>
            </div>
          </div>
        </section>

        {/* Doctor's Report Section */}
        <section className={styles.section}>
          <h2>Doctor's Report</h2>
          <div className={styles.content}>
            <div className={styles.card}>
              <h3>Patient Overview</h3>
              <p>{doctorReport.patientOverview}</p>
            </div>
            <div className={styles.card}>
              <h3>Clinical Considerations</h3>
              <p>{doctorReport.clinicalConsiderations}</p>
            </div>
            <div className={styles.card}>
              <h3>Laboratory Findings</h3>
              <div className={styles.labFindings}>
                {Object.entries(doctorReport.laboratoryFindings).map(
                  ([category, findings]) => (
                    <div key={category} className={styles.labCategory}>
                      <h4>{category}</h4>
                      <ul>
                        {findings.map((finding: string, index: number) => (
                          <li key={index}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.card}>
              <h3>Differential Diagnosis</h3>
              <ul>
                {doctorReport.differentialDiagnosis.map(
                  (diagnosis: string, index: number) => (
                    <li key={index}>{diagnosis}</li>
                  )
                )}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Recommendations</h3>
              <ul>
                {doctorReport.recommendations.map(
                  (recommendation: string, index: number) => (
                    <li key={index}>{recommendation}</li>
                  )
                )}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Conclusion</h3>
              <p>{doctorReport.conclusion}</p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className={styles.disclaimer}>
          <p>{disclaimer}</p>
        </div>
      </div>
    </Modal>
  );
};
