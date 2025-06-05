import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Levita - Privacy Policy",
  description:
    "Learn about how we protect your privacy and handle your data at Levita",
  keywords: [
    "privacy policy",
    "data protection",
    "health data privacy",
    "user privacy",
  ],
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
