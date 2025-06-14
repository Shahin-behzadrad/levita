import { Microscope, ChevronDown } from "lucide-react";
import { Text } from "../../../../Shared/Text/Text";
import styles from "../DoctorsConsultations.module.scss";

interface LaboratoryFindingsProps {
  findings:
    | {
        Biochemistry: string[];
        Complete_Blood_Count: string[];
        Other: string[];
      }
    | undefined;
  consultationId: string;
  isExpanded: boolean;
  onToggle: (consultationId: string) => void;
}

const LabSection = ({
  title,
  results,
}: {
  title: string;
  results: string[];
}) => (
  <div className={styles.labSection}>
    <Text
      value={title}
      fontSize="sm"
      fontWeight="bold"
      className={styles.labSectionTitle}
    />
    <div className={styles.labResults}>
      {results.map((result: string, idx: number) => (
        <div key={idx} className={styles.labResult}>
          <Text value={result} fontSize="sm" color="gray" />
        </div>
      ))}
    </div>
  </div>
);

export const LaboratoryFindings = ({
  findings,
  consultationId,
  isExpanded,
  onToggle,
}: LaboratoryFindingsProps) => {
  if (
    !findings ||
    (!findings.Biochemistry?.length &&
      !findings.Complete_Blood_Count?.length &&
      !findings.Other?.length)
  ) {
    return (
      <Text
        value="No laboratory findings available"
        fontSize="sm"
        color="gray"
      />
    );
  }

  return (
    <div className={styles.laboratoryFindings}>
      <div
        className={styles.sectionHeader}
        onClick={() => onToggle(consultationId)}
      >
        <Microscope size={20} />
        <Text value="Laboratory Findings" fontSize="sm" fontWeight="medium" />
        <ChevronDown
          className={`${styles.chevron} ${isExpanded ? styles.expanded : ""}`}
          size={20}
        />
      </div>
      {isExpanded && (
        <div className={styles.labFindings}>
          {findings.Biochemistry && findings.Biochemistry.length > 0 && (
            <LabSection title="Biochemistry" results={findings.Biochemistry} />
          )}

          {findings.Complete_Blood_Count &&
            findings.Complete_Blood_Count.length > 0 && (
              <LabSection
                title="Complete Blood Count"
                results={findings.Complete_Blood_Count}
              />
            )}

          {findings.Other && findings.Other.length > 0 && (
            <LabSection title="Other Tests" results={findings.Other} />
          )}
        </div>
      )}
    </div>
  );
};
