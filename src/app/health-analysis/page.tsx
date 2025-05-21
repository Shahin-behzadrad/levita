"use client";

import { useState } from "react";
import { HealthAnalysisForm } from "@/components/HealthAnalysis/HealthAnalysisForm";
import { AnalysisResults } from "@/components/HealthAnalysis/AnalysisResults";

export default function HealthAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async (formData: FormData) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      setTimeout(() => {
        setIsAnalyzing(false);
        setResult(
          "Based on the symptoms and lab results provided, this could indicate a mild upper respiratory infection. " +
            "Your lab results show normal white blood cell count, which is reassuring. " +
            "Recommended actions: Rest, stay hydrated, and monitor symptoms. If fever persists for more than 3 days or " +
            "breathing difficulties occur, please consult with a healthcare professional immediately."
        );
      }, 3000);
    } catch (error) {
      console.error("Error analyzing health data:", error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col max-w-screen-md mx-auto">
      <main className="flex-1 container py-8 mt-16">
        <HealthAnalysisForm
          onSubmit={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
        {result && <AnalysisResults result={result} />}
      </main>
    </div>
  );
}
