"use client";

import { use } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import ConsultationDetails from "@/components/Consultation/ConsultationDetails/ConsultationDetails";

export default function ConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ConsultationDetails consultationId={id as Id<"consultationRequests">} />
  );
}
