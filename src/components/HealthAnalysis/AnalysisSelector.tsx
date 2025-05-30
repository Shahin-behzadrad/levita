import { Id } from "convex/_generated/dataModel";
import styles from "./AnalysisSelector.module.scss";
import Button from "../Shared/Button";
import Select, { SelectOption } from "../Shared/Select/Select";

interface AnalysisSelectorProps {
  analyses: any[];
  selectedAnalysisId: Id<"healthAnalyses"> | null;
  onAnalysisSelect: (id: Id<"healthAnalyses">) => void;
  onNewAnalysis: () => void;
}

const AnalysisSelector = ({
  analyses,
  selectedAnalysisId,
  onAnalysisSelect,
  onNewAnalysis,
}: AnalysisSelectorProps) => {
  if (!analyses || analyses.length === 0) return null;

  const options: SelectOption[] = [
    { label: "Select an analysis", value: "", disabled: true },
    ...analyses.map((analysis) => ({
      label: `Analysis from ${new Date(analysis._creationTime).toLocaleString(
        undefined,
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`,
      value: analysis._id,
    })),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Previous Analyses</h2>
        <Button variant="contained" onClick={onNewAnalysis}>
          New Analysis
        </Button>
      </div>
      <Select
        options={options}
        value={selectedAnalysisId || ""}
        onChange={(value) => onAnalysisSelect(value as Id<"healthAnalyses">)}
        label="Select Analysis"
        fullwidth
      />
    </div>
  );
};

export default AnalysisSelector;
