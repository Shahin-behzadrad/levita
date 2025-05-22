import type { Metadata } from "next";
import TermsOfServiceClient from "./TermsOfServiceClient";

export const metadata: Metadata = {
  title: "SAL - Terms of Service",
  description:
    "Read our terms of service and understand your rights and responsibilities when using SAL",
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
