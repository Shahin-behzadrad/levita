import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { userProfileData } from "./HealthAnalysisForm";

export const useHealthAnalysis = () => {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);
  const analyses = useQuery(
    api.healthQueriesAndMutations.getHealthAnalysesForUser
  );
  const generateUploadUrl = useMutation(api.labResults.generateUploadUrl);
  const saveLabResult = useMutation(api.labResults.saveLabResult);
  const labResults = useQuery(api.labResults.getLabResults);
  const performAnalysis = useAction(api.healthAnalysis.analyzeHealthData);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [labFiles, setLabFiles] = useState<File[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] =
    useState<Id<"healthAnalyses"> | null>(null);
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);

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

  return {
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
  };
};
