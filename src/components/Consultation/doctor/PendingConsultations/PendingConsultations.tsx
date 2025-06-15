import { api } from "../../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import styles from "./PendingConsultations.module.scss";
import ConsultationScheduler from "../ConsultationScheduler/ConsultationScheduler";

import { useState } from "react";
import Text from "@/components/Shared/Text";
import { Card, CardContent } from "@/components/Shared/Card";
import Divider from "@/components/Shared/Divider/Divider";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/Shared/Button";
import { Id } from "convex/_generated/dataModel";

const PendingConsultations = ({
  userId,
}: {
  userId: Id<"doctorProfiles"> | null;
}) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<
    string | null
  >(null);

  const pendingConsultation = useQuery(
    api.api.consultation.getPendingConsultations.getPendingConsultations
  );

  const acceptConsultation = useMutation(
    api.api.consultation.acceptConsultation.acceptConsultation
  );

  const handleAcceptConsultation = (consultationId: string) => {
    setSelectedConsultation(consultationId);
    setShowScheduler(true);
  };

  const acceptConsultationHandler = async (
    consultationDateTime: string,
    meetLink: string
  ) => {
    console.log("meetLink", meetLink);

    if (!selectedConsultation) return;
    if (!userId) return;
    await acceptConsultation({
      doctorId: userId,
      requestId: selectedConsultation as Id<"consultations">,
      consultationDateTime,
    });
    setShowScheduler(false);
  };

  const handleRejectConsultation = (consultationId: string) => {
    console.log("reject consultation", consultationId);
  };

  return (
    <>
      <div className={styles.pendingConsultations}>
        <Text
          value="Pending Appointments"
          textAlign="left"
          fontSize="xl"
          fontWeight="bold"
          className={styles.title}
          startAdornment={<div className={styles.icon} />}
        />
        <Card className={styles.pendingConsultationsList}>
          <CardContent>
            {pendingConsultation && pendingConsultation.length > 0 ? (
              pendingConsultation.map((consultation, index) => (
                <div key={consultation._id}>
                  <div
                    id={`consultation-${consultation._id}`}
                    className={styles.appointmentCard}
                  >
                    <div className={styles.appointmentHeader}>
                      <div className={styles.patientInfo}>
                        <div className={styles.patientLabel}>
                          <Text
                            value="Patient: "
                            className={styles.patientLabel}
                            fontSize="lg"
                            fontWeight="bold"
                          />
                          <Text
                            fontSize="lg"
                            color="primary"
                            fontWeight="bold"
                            value={
                              consultation.patient?.fullName ||
                              "Unknown Patient"
                            }
                          />
                        </div>
                        <div className={styles.patientDetails}>
                          <Text
                            value={`${consultation.patient?.age || "N/A"} years old`}
                          />
                          <Text value={consultation.patient?.sex || "N/A"} />
                        </div>
                      </div>
                      <Text
                        value={formatDistanceToNow(consultation.createdAt, {
                          addSuffix: true,
                        })}
                        className={styles.timestamp}
                      />
                    </div>
                    <Text
                      value={consultation.patientOverview}
                      color="gray"
                      fontSize="sm"
                    />
                    <div className={styles.appointmentActions}>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleAcceptConsultation(consultation._id)
                        }
                      >
                        Accept & Schedule
                      </Button>
                    </div>
                  </div>
                  {index !== pendingConsultation.length - 1 && (
                    <Divider color="gray" />
                  )}
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <Text value="📋" className={styles.emoji} />
                <Text
                  value="No pending Appointments"
                  className={styles.title}
                />
                <Text
                  value="All caught up! No pending appointment requests at the moment."
                  className={styles.description}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {showScheduler && (
        <ConsultationScheduler
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
          onConfirm={acceptConsultationHandler}
        />
      )}
    </>
  );
};

export default PendingConsultations;
