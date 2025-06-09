"use client";

import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import styles from "./ConsultationDetails.module.scss";
import { useLanguage } from "@/i18n/LanguageContext";
import LoadingModal from "@/components/LoadingModal/LoadingModal";
import { useState } from "react";
import { toast } from "sonner";
import ConsultationScheduler from "../ConsultationScheduler/ConsultationScheduler";
import ConsultationCard from "../ConsultationCard/ConsultationCard";

export default function ConsultationDetails({
  consultationId,
}: {
  consultationId: Id<"consultationRequests">;
}) {
  const { messages } = useLanguage();
  const userProfile = useQuery(api.api.profiles.userProfiles.getUserProfile);
  const [showScheduler, setShowScheduler] = useState(false);

  const consultation = useQuery(
    api.api.consultation.getConsultationDetails.getConsultationDetails,
    {
      consultationId,
    }
  );

  const acceptConsultation = useMutation(
    api.api.consultation.acceptConsultation.acceptConsultation
  );

  console.log(consultation);

  const handleAcceptConsultation = async (consultationDateTime: string) => {
    if (userProfile && consultation) {
      await acceptConsultation({
        doctorId: userProfile._id as Id<"doctorProfiles">,
        requestId: consultationId,
        consultationDateTime,
      });

      console.log(consultationDateTime);

      setShowScheduler(false);
      toast.success(messages.common.consultationAccepted);
    }
  };

  if (consultation === undefined) {
    return <LoadingModal />;
  }

  if (consultation === null) {
    throw new Error("Consultation not found");
  }

  //TODO: preview consultation after accepting and then render the date of consultatioin for patient too

  return (
    <div className={styles.container}>
      <ConsultationCard
        consultation={consultation}
        messages={messages}
        onScheduleClick={() => setShowScheduler(true)}
      />

      {showScheduler && (
        <ConsultationScheduler
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
          onConfirm={handleAcceptConsultation}
        />
      )}
    </div>
  );
}
