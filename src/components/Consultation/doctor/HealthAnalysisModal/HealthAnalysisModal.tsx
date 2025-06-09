import Modal from "@/components/Shared/Modal/Modal";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import styles from "./HealthAnalysisModal.module.scss";
import { User, FileText, Microscope, ListChecks } from "lucide-react";

interface LaboratoryFindings {
  [category: string]: string[];
}

interface HealthAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: {
    doctorReportPreview?: {
      patientOverview: string;
      clinicalConsiderations: string;
      laboratoryFindings?: LaboratoryFindings;
      recommendations: string[];
    };
  };
  messages: any;
}

export default function HealthAnalysisModal({
  isOpen,
  onClose,
  consultation,
  messages,
}: HealthAnalysisModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className={styles.card}>
        <CardHeader
          title={messages.healthAnalysis.formTitle}
          titleFontSize={28}
          titleColor="primary"
          className={styles.header}
        />

        <CardContent className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <User size={20} />
              <Text
                value={messages.healthAnalysis.patientOverview}
                variant="h6"
                fontWeight="medium"
              />
            </div>
            <div className={styles.sectionContent}>
              <Text
                value={consultation?.doctorReportPreview?.patientOverview}
                variant="p"
                fontSize="sm"
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText size={20} />
              <Text
                value={messages.healthAnalysis.clinicalConsiderations}
                variant="h6"
                fontWeight="medium"
              />
            </div>
            <div className={styles.sectionContent}>
              <Text
                value={
                  consultation?.doctorReportPreview?.clinicalConsiderations
                }
                variant="p"
                fontSize="sm"
              />
            </div>
          </div>

          {consultation?.doctorReportPreview?.laboratoryFindings && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Microscope size={20} />
                <Text
                  value={messages.healthAnalysis.laboratoryFindings}
                  variant="h6"
                  fontWeight="medium"
                />
              </div>
              <div className={styles.labFindings}>
                {Object.entries(
                  consultation?.doctorReportPreview
                    .laboratoryFindings as LaboratoryFindings
                ).map(([category, findings]) => (
                  <div key={category} className={styles.labCategory}>
                    <Text
                      value={messages.healthAnalysis[category]}
                      fontSize="lg"
                      fontWeight="medium"
                    />
                    <ul className={styles.findingsList}>
                      {findings.map((finding: string, index: number) => (
                        <li key={index}>
                          <Text value={finding} variant="p" fontSize="sm" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <ListChecks size={20} />
              <Text
                value={messages.healthAnalysis.recommendations}
                variant="h6"
                fontWeight="medium"
              />
            </div>
            <ul className={styles.recommendationsList}>
              {consultation?.doctorReportPreview?.recommendations.map(
                (rec: string, index: number) => (
                  <li key={index}>
                    <Text value={rec} variant="p" fontSize="sm" />
                  </li>
                )
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
}
