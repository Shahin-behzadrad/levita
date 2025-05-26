import { Id } from "convex/_generated/dataModel";

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Previous Analyses</h2>
        <button
          onClick={onNewAnalysis}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          New Analysis
        </button>
      </div>
      <select
        className="p-2 border rounded"
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
