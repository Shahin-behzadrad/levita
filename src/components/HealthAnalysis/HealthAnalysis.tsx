"use client";

import { useEffect, useState } from "react";
import {
  HealthAnalysisForm,
  userProfileData,
} from "@/components/HealthAnalysis/HealthAnalysisForm";
import { AnalysisResults } from "@/components/HealthAnalysis/AnalysisResults";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";

export default function HealthAnalysis() {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);

  const generateUploadUrl = useMutation(api.labResults.generateUploadUrl);
  const saveLabResult = useMutation(api.labResults.saveLabResult);
  const labResults = useQuery(api.labResults.getLabResults);

  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [labFile, setLabFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-up");
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async (data: userProfileData) => {
    setIsAnalyzing(true);
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
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col max-w-screen-md mx-auto">
      <main className="flex-1 container py-8 mt-16">
        <HealthAnalysisForm
          onFileUploaded={setLabFile}
          userProfile={userProfile}
          onSubmit={handleSubmit}
          isAnalyzing={isAnalyzing}
        />
        {result && <AnalysisResults result={result} />}
      </main>
    </div>
  );
}
