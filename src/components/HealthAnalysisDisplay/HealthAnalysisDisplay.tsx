import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api"; // This will now correctly point to the new file structure for queries
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface HealthAnalysisDisplayProps {
  userProfile: Doc<"userProfiles"> | null;
  latestLabResult: (Doc<"labResults"> & { url: string | null }) | null;
}

export function HealthAnalysisDisplay({
  userProfile,
  latestLabResult,
}: HealthAnalysisDisplayProps) {
  // References to queries should now correctly point to healthQueriesAndMutations via the api object
  const analyses =
    useQuery(api.healthQueriesAndMutations.getHealthAnalysesForUser) || [];
  const performAnalysis = useAction(api.healthAnalysis.analyzeHealthData); // Action remains in healthAnalysis
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] =
    useState<Id<"healthAnalyses"> | null>(null);

  const handleAnalyze = async () => {
    if (!userProfile) {
      toast.error("Please complete your user profile first.");
      return;
    }
    setIsLoading(true);
    try {
      const analysisId = await performAnalysis({
        userProfileId: userProfile._id,
        labResultId: latestLabResult?._id,
      });
      toast.success("Health analysis complete!");
      if (analysisId) {
        setSelectedAnalysisId(analysisId);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error(
        `Analysis failed. ${error instanceof Error ? error.message : ""}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAnalysisDetails = useQuery(
    api.healthQueriesAndMutations.getHealthAnalysisById, // Corrected API path
    selectedAnalysisId ? { analysisId: selectedAnalysisId } : "skip"
  );

  const displayAnalysis =
    selectedAnalysisDetails ||
    (analyses.length > 0 && !selectedAnalysisId ? analyses[0] : null);

  return (
    <div className="space-y-6 bg-white p-8 shadow-lg rounded-lg mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Health Analysis
        </h2>
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !userProfile}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading
            ? "Analyzing..."
            : latestLabResult
              ? "Analyze with Latest Lab"
              : "Analyze Profile"}
        </button>
      </div>

      {analyses.length > 0 && (
        <div className="mb-4">
          <label
            htmlFor="analysisSelector"
            className="block text-sm font-medium text-gray-700"
          >
            View Previous Analysis:
          </label>
          <select
            id="analysisSelector"
            value={selectedAnalysisId ?? ""}
            onChange={(e) =>
              setSelectedAnalysisId(e.target.value as Id<"healthAnalyses">)
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {analyses.map((a) => (
              <option key={a._id} value={a._id}>
                {new Date(a._creationTime).toLocaleString()} -{" "}
                {a.labFileName ? `Lab: ${a.labFileName}` : "Profile Only"}
              </option>
            ))}
          </select>
        </div>
      )}

      {displayAnalysis === undefined &&
        analyses.length > 0 &&
        !isLoading && ( // Added !isLoading to prevent flicker
          <div className="flex justify-center items-center pt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        )}

      {displayAnalysis && (
        <div className="space-y-4 mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold text-indigo-700">
            Analysis from:{" "}
            {new Date(displayAnalysis._creationTime).toLocaleString()}
            {displayAnalysis.labFileName &&
              ` (Lab: ${displayAnalysis.labFileName})`}
          </h3>
          <div>
            <h4 className="font-medium text-gray-800">
              Potential Health Issues:
            </h4>
            {displayAnalysis.potentialIssues &&
            displayAnalysis.potentialIssues.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600 ml-4">
                {displayAnalysis.potentialIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">
                No specific issues highlighted by AI.
              </p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">
              Recommended Medical Specialty:
            </h4>
            <p className="text-gray-600">
              {displayAnalysis.recommendedSpecialty || "N/A"}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">
              Supplement Suggestions:
            </h4>
            {displayAnalysis.supplementSuggestions &&
            displayAnalysis.supplementSuggestions.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600 ml-4">
                {displayAnalysis.supplementSuggestions.map(
                  (suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-600 italic">
                No specific supplements suggested by AI.
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Disclaimer: This analysis is AI-generated and not medical advice.
            Always consult with a qualified healthcare professional for any
            health concerns or before making any decisions related to your
            health or treatment.
          </p>
        </div>
      )}
      {!displayAnalysis && !isLoading && analyses.length === 0 && (
        <p className="text-gray-500 italic">
          No analysis performed yet. Click the button above to generate one.
        </p>
      )}
      {isLoading &&
        !displayAnalysis && ( // Show spinner when loading and no analysis is selected to display
          <div className="flex justify-center items-center pt-4">
            <p className="text-gray-500 mr-2">Generating analysis...</p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        )}
    </div>
  );
}
