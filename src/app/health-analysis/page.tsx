import type { Metadata } from "next";
import { HealthAnalysis } from "./healthAnalysisClient";

export const metadata: Metadata = {
  title: "SAL - Health Analysis",
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
