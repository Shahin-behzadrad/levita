"use client";

import { useEffect, useState } from "react";
import {
  HealthAnalysisForm,
  userProfileData,
} from "@/components/HealthAnalysis/HealthAnalysisForm";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import AnalysisResults from "./AnalysisResults";
import LoadingModal from "../LoadingModal/LoadingModal";

export default function HealthAnalysis() {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);

  const analyses = useQuery(
    api.healthQueriesAndMutations.getHealthAnalysesForUser
  );
  const generateUploadUrl = useMutation(api.labResults.generateUploadUrl);
  const saveLabResult = useMutation(api.labResults.saveLabResult);
  const labResults = useQuery(api.labResults.getLabResults);
  const performAnalysis = useAction(api.healthAnalysis.analyzeHealthData);

  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [labFiles, setLabFiles] = useState<File[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] =
    useState<Id<"healthAnalyses"> | null>(null);
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);

  // TODO: I just need this raw analysis to be displayed in the UI
  //  so other unused and unnecessary results that are generated in healthAnalysis.ts
  // can be removed
  const selectedAnalysisDetails = useQuery(
    api.healthQueriesAndMutations.getHealthAnalysisById,
    selectedAnalysisId ? { analysisId: selectedAnalysisId } : "skip"
  );

  useEffect(() => {
    if (analyses?.[0]?._id) {
      setSelectedAnalysisId(analyses?.[0]?._id);
    }
  }, [analyses]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-up");
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async (data: userProfileData) => {
    setIsAnalyzing(true);
    const latestLabResult =
      labResults && labResults.length > 0 ? labResults[0] : null;
    try {
      await updateUserProfile({
        age: Number(data?.age),
        generalHealthStatus: data?.generalHealthStatus,
        sex: data?.sex,
        symptoms:
          typeof data?.symptoms === "string"
            ? (data.symptoms as string).split(",").map((s: string) => s.trim())
            : data?.symptoms || [],
      });

      let uploadedLabResultIds: Id<"labResults">[] = [];

      if (labFiles.length > 0) {
        const storageIds: string[] = [];
        const fileNames: string[] = [];

        // Upload all files
        for (const file of labFiles) {
          const uploadUrl = await generateUploadUrl();
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!response.ok) {
            throw new Error(`Failed to upload file: ${file.name}`);
          }
          const { storageId } = await response.json();
          storageIds.push(storageId);
          fileNames.push(file.name);
        }

        // Save all lab results
        for (let i = 0; i < storageIds.length; i++) {
          const result = await saveLabResult({
            storageId: storageIds[i] as Id<"_storage">,
            fileName: fileNames[i],
          });
          if (result) {
            uploadedLabResultIds.push(result);
          }
        }
      }

      if (userProfile?._id) {
        try {
          // Use the first uploaded lab result for the analysis
          const analysisId = await performAnalysis({
            userProfileId: userProfile._id,
            labResultId: uploadedLabResultIds[0] || latestLabResult?._id,
          });
          toast.success("Health analysis complete!");
          if (analysisId) {
            setSelectedAnalysisId(analysisId);
            setShowNewAnalysis(false);
          }
        } catch (error) {
          console.error("Analysis failed:", error);
          toast.error(
            `Analysis failed. ${error instanceof Error ? error.message : ""}`
          );
        }
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to process lab results. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isAuthenticated) return null;
  if (analyses === undefined)
    return <LoadingModal content="Loading your health analyses..." />;

  if (selectedAnalysisDetails?.rawAnalysis) {
    console.log(JSON.parse(selectedAnalysisDetails?.rawAnalysis));
  }

  return (
    <div className="min-h-screen max-w-screen-lg mx-auto">
      <main className="flex flex-col container py-28 gap-6">
        {analyses && analyses.length > 0 && !showNewAnalysis ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Previous Analyses</h2>
              <button
                onClick={() => setShowNewAnalysis(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                New Analysis
              </button>
            </div>
            <select
              className="p-2 border rounded"
              value={selectedAnalysisId || ""}
              onChange={(e) =>
                setSelectedAnalysisId(e.target.value as Id<"healthAnalyses">)
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
        ) : (
          <div className="flex flex-col gap-4">
            {analyses && analyses.length > 0 && (
              <button
                onClick={() => setShowNewAnalysis(false)}
                className="self-start px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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
          </div>
        )}
        {selectedAnalysisDetails && !showNewAnalysis && (
          <AnalysisResults
            result={JSON.parse(selectedAnalysisDetails?.rawAnalysis || "{}")}
          />
        )}
      </main>
    </div>
  );
}
