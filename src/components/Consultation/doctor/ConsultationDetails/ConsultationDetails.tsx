"use client";

import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import styles from "./ConsultationDetails.module.scss";
import { useLanguage } from "@/i18n/LanguageContext";
import LoadingModal from "@/components/LoadingModal/LoadingModal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ConsultationScheduler from "../ConsultationScheduler/ConsultationScheduler";
import ConsultationCard from "../ConsultationCard/ConsultationCard";
import PatientInfoCard from "../PatientInfoCard/PatientInfoCard";
import HealthAnalysisModal from "../HealthAnalysisModal/HealthAnalysisModal";
import Grid from "@/components/Shared/Grid/Grid";

export default function ConsultationDetails({
  consultationId,
}: {
  consultationId: Id<"consultationRequests">;
}) {
  const { messages } = useLanguage();
  const userProfile = useQuery(api.api.profiles.userProfiles.getUserProfile);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showHealthAnalysis, setShowHealthAnalysis] = useState(false);
  const [canJoin, setCanJoin] = useState(false);

  const consultation = useQuery(
    api.api.consultation.getConsultationDetails.getConsultationDetails,
    {
      consultationId,
    }
  );

  const acceptConsultation = useMutation(
    api.api.consultation.acceptConsultation.acceptConsultation
  );

  useEffect(() => {
    if (consultation?.consultationDateTime) {
      const checkTime = () => {
        const now = new Date();
        const consultationTime = new Date(
          consultation.consultationDateTime as string
        );
        const timeDiff = consultationTime.getTime() - now.getTime();
        setCanJoin(timeDiff <= 0 && timeDiff > -3600000); // Enable join button if within 1 hour of consultation time
      };

      checkTime();
      const interval = setInterval(checkTime, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [consultation?.consultationDateTime]);

  const handleAcceptConsultation = async (consultationDateTime: string) => {
    if (userProfile && consultation) {
      await acceptConsultation({
        doctorId: userProfile._id as Id<"doctorProfiles">,
        requestId: consultationId,
        consultationDateTime,
      });

      setShowScheduler(false);
      toast.success(messages.common.consultationAccepted);
    }
  };

  const handleJoinConsultation = () => {
    // TODO: Implement video consultation join logic
    toast.info("Joining consultation...");
  };

  if (consultation === undefined) {
    return <LoadingModal />;
  }

  if (consultation === null) {
    throw new Error("Consultation not found");
  }

  return (
    <div className={styles.container}>
      {consultation.status === "accepted" && (
        <PatientInfoCard
          consultation={consultation}
          messages={messages}
          canJoin={canJoin}
          onJoinClick={handleJoinConsultation}
          previewUsersHealthAnalysis={() => setShowHealthAnalysis(true)}
        />
      )}

      {consultation.status === "pending" && (
        <ConsultationCard
          consultation={consultation}
          messages={messages}
          onScheduleClick={() => setShowScheduler(true)}
        />
      )}

      {showScheduler && (
        <ConsultationScheduler
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
          onConfirm={handleAcceptConsultation}
        />
      )}

      <HealthAnalysisModal
        isOpen={showHealthAnalysis}
        onClose={() => setShowHealthAnalysis(false)}
        consultation={consultation}
        messages={messages}
      />
    </div>
  );
}
