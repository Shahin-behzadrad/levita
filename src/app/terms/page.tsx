import type { Metadata } from "next";
import TermsOfServiceClient from "./TermsOfServiceClient";

export const metadata: Metadata = {
  title: "Levita - Terms of Service",
  description:
    "Read our terms of service and understand your rights and responsibilities when using Levita",
  keywords: [
    "terms of service",
    "user agreement",
    "legal terms",
    "service terms",
  ],
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}
