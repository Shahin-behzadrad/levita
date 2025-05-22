import type { Metadata } from "next";
import LearnMoreClient from "./LearnMoreClient";

export const metadata: Metadata = {
  title: "SAL - Learn More",
  description:
    "Learn about our AI-powered health analysis technology and how it works",
  keywords: [
    "health AI",
    "medical technology",
    "health analysis",
    "AI healthcare",
  ],
};

export default function LearnMorePage() {
  return <LearnMoreClient />;
}
