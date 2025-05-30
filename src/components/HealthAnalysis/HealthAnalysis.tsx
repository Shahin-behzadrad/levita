"use client";

import { useEffect } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import LoadingModal from "../LoadingModal/LoadingModal";
import { HealthAnalysisForm } from "./HealthAnalysisForm";
import AnalysisResults from "./AnalysisResults";
import AnalysisSelector from "./AnalysisSelector";
import { useHealthAnalysis } from "./useHealthAnalysis";
import styles from "./HealthAnalysis.module.scss";

export default function HealthAnalysis() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const {
    userProfile,
    analyses,
    isAnalyzing,
    labFiles,
    setLabFiles,
    selectedAnalysisId,
    setSelectedAnalysisId,
    showNewAnalysis,
    setShowNewAnalysis,
    handleSubmit,
  } = useHealthAnalysis();

  const selectedAnalysisDetails = useQuery(
    api.healthQueriesAndMutations.getHealthAnalysisById,
    selectedAnalysisId ? { analysisId: selectedAnalysisId } : "skip"
  );

  useEffect(() => {
    if (analyses?.[0]?._id) {
      setSelectedAnalysisId(analyses?.[0]?._id);
    }
  }, [analyses, setSelectedAnalysisId]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-up");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) return null;
  if (analyses === undefined)
    return <LoadingModal content="Loading your health analyses..." />;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {analyses && analyses.length > 0 && !showNewAnalysis ? (
          <AnalysisSelector
            analyses={analyses}
            selectedAnalysisId={selectedAnalysisId}
            onAnalysisSelect={setSelectedAnalysisId}
            onNewAnalysis={() => setShowNewAnalysis(!showNewAnalysis)}
          />
        ) : (
          <>
            {analyses && analyses.length > 0 && (
              <button
                onClick={() => setShowNewAnalysis(!showNewAnalysis)}
                className={styles.viewPreviousButton}
              >
                View Previous Analyses
              </button>
            )}
            <HealthAnalysisForm
              onFileUploaded={setLabFiles}
              userProfile={userProfile}
              onSubmit={handleSubmit}
              isAnalyzing={isAnalyzing}
            />
          </>
        )}

        {selectedAnalysisDetails?.rawAnalysis && !showNewAnalysis && (
          <AnalysisResults
            result={JSON.parse(selectedAnalysisDetails.rawAnalysis)}
            labFileNames={selectedAnalysisDetails.labFileNames}
          />
        )}
      </main>
    </div>
  );
}
