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
  const [labFile, setLabFile] = useState<File | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] =
    useState<Id<"healthAnalyses"> | null>(null);

  // TODO: I just need this raw analysis to be displayed in the UI
  //  so other unused and unnecessary results that are generated in healthAnalysis.ts
  // can be removed
  const selectedAnalysisDetails = useQuery(
    api.healthQueriesAndMutations.getHealthAnalysisById,
    selectedAnalysisId ? { analysisId: selectedAnalysisId } : "skip"
  );

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
      if (labFile) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": labFile.type },
          body: labFile,
        });
        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
        const { storageId } = await response.json();
        await saveLabResult({ storageId, fileName: labFile.name });
      }
      if (userProfile?._id && latestLabResult?._id) {
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
        }
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  console.log(analyses);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen max-w-screen-md mx-auto">
      <main className="flex flex-col container py-8 mt-16 gap-6">
        <HealthAnalysisForm
          onFileUploaded={setLabFile}
          userProfile={userProfile}
          onSubmit={handleSubmit}
          isAnalyzing={isAnalyzing}
        />
        <AnalysisResults
          result={JSON.parse(selectedAnalysisDetails?.rawAnalysis || "{}")}
        />
      </main>
    </div>
  );
}
