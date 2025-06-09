"use client";

import { use } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import ConsultationDetails from "@/components/Consultation/doctor/ConsultationDetails/ConsultationDetails";
import { notFound } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

function isValidConvexId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{10,}$/.test(id);
}

export default function ConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  if (!isValidConvexId(id)) {
    return notFound();
  }

  return (
    <ErrorBoundary>
      <ConsultationDetails consultationId={id as Id<"consultationRequests">} />
    </ErrorBoundary>
  );
}
