"use client";

import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import Button from "@/components/Shared/Button";
import styles from "./ConsultationDetails.module.scss";
import {
  Clock,
  User,
  FileText,
  Microscope,
  ListChecks,
  CalendarDays,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import LoadingModal from "@/components/LoadingModal/LoadingModal";
import { useState } from "react";
import { toast } from "sonner";
import ConsultationScheduler from "../ConsultationScheduler/ConsultationScheduler";

interface LaboratoryFindings {
  [category: string]: string[];
}

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

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          title={messages.healthAnalysis.formTitle}
          titleFontSize={28}
          titleColor="primary"
          subheader={`${messages.common.submit} ${new Date(
            consultation?._creationTime ?? new Date()
          ).toLocaleDateString()}`}
          titleStartAdornment={
            <Clock size={20} className={styles.headerIcon} />
          }
          action={
            consultation?.status === "pending" ? (
              <div className={styles.statusBadge}>
                <Text value={messages.common.pending} />
              </div>
            ) : undefined
          }
          className={styles.header}
        />

        <CardContent className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <User size={20} />
              <Text
                value={messages.healthAnalysis.patientOverview}
                variant="h6"
                fontWeight="medium"
              />
            </div>
            <div className={styles.sectionContent}>
              <Text
                value={consultation?.doctorReportPreview?.patientOverview}
                variant="p"
                fontSize="sm"
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText size={20} />
              <Text
                value={messages.healthAnalysis.clinicalConsiderations}
                variant="h6"
                fontWeight="medium"
              />
            </div>
            <div className={styles.sectionContent}>
              <Text
                value={
                  consultation?.doctorReportPreview?.clinicalConsiderations
                }
                variant="p"
                fontSize="sm"
              />
            </div>
          </div>

          {consultation?.doctorReportPreview?.laboratoryFindings && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Microscope size={20} />
                <Text
                  value={messages.healthAnalysis.laboratoryFindings}
                  variant="h6"
                  fontWeight="medium"
                />
              </div>
              <div className={styles.labFindings}>
                {Object.entries(
                  consultation?.doctorReportPreview
                    .laboratoryFindings as LaboratoryFindings
                ).map(([category, findings]) => (
                  <div key={category} className={styles.labCategory}>
                    <Text
                      value={messages.healthAnalysis[category]}
                      fontSize="lg"
                      fontWeight="medium"
                    />
                    <ul className={styles.findingsList}>
                      {findings.map((finding: string, index: number) => (
                        <li key={index}>
                          <Text value={finding} variant="p" fontSize="sm" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <ListChecks size={20} />
              <Text
                value={messages.healthAnalysis.recommendations}
                variant="h6"
                fontWeight="medium"
              />
            </div>
            <ul className={styles.recommendationsList}>
              {consultation?.doctorReportPreview?.recommendations.map(
                (rec: string, index: number) => (
                  <li key={index}>
                    <Text value={rec} variant="p" fontSize="sm" />
                  </li>
                )
              )}
            </ul>
          </div>

          {consultation?.status === "pending" && (
            <div className={styles.actions}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowScheduler(true)}
                className={styles.acceptButton}
                endIcon={<CalendarDays size={20} />}
              >
                {messages.common.acceptAndSchedule}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
