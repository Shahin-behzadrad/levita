import { HealthAnalysis } from "@/components/HealthAnalysis/HealthAnalysisForm/healthAnalysisClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Levita - Health Analysis",
  description:
    "Get AI-powered health analysis and insights for your well-being",
  keywords: [
    "health analysis",
    "AI health",
    "wellness check",
    "health insights",
  ],
};

export default async function HealthAnalysisServerComponent() {
  return <HealthAnalysis />;
}
