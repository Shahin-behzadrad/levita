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
    console.log(data, labFile);
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
