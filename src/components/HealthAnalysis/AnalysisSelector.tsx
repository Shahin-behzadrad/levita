import { Id } from "convex/_generated/dataModel";
import styles from "./AnalysisSelector.module.scss";

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Previous Analyses</h2>
        <button
          onClick={onNewAnalysis}
          className={styles.newButton}
        >
          New Analysis
        </button>
      </div>
      <select
        className={styles.select}
        value={selectedAnalysisId || ""}
        onChange={(e) =>
          onAnalysisSelect(e.target.value as Id<"healthAnalyses">)
        }
      >
        <option value="">Select an analysis</option>
        {analyses.map((analysis) => (
          <option key={analysis._id} value={analysis._id}>
            Analysis from{" "}
            {new Date(analysis._creationTime).toLocaleString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AnalysisSelector;
