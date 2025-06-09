"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { notFound, useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import Button from "@/components/Shared/Button";
import styles from "./page.module.scss";
import { User, Clock, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import LoadingModal from "@/components/LoadingModal/LoadingModal";

interface Consultation {
  _id: Id<"consultationRequests">;
  _creationTime: number;
  status: "pending" | "accepted" | "rejected";
  consultationDateTime?: string;
  patient: {
    fullName: string;
    age: number;
    sex: string;
  } | null;
}

export default function ConsultationsPage() {
  const router = useRouter();
  const { messages } = useLanguage();
  const isMobile = useIsMobile();

  const consultations = useQuery(
    api.api.consultation.getDoctorConsultations.getDoctorConsultations
  );

  if (!consultations) {
    return <LoadingModal />;
  }

  console.log(consultations);

  if (consultations.length === 0) {
    return notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.consultationsList}>
        {consultations.map((consultation: Consultation) => (
          <div key={consultation._id} className={styles.consultationCard}>
            <Card>
              <CardHeader
                title={consultation.patient?.fullName || "Unknown Patient"}
                titleStartAdornment={<User size={24} />}
                action={
                  <div className={styles.statusBadge}>
                    <Text
                      value={messages.common[consultation.status]}
                      variant="p"
                      fontSize="sm"
                    />
                  </div>
                }
              />

              <CardContent className={styles.content}>
                <div className={styles.infoRow}>
                  <Clock size={20} className={styles.icon} />
                  <Text
                    value={`${messages.common.submitted}: ${new Date(
                      consultation._creationTime
                    ).toLocaleString()}`}
                    variant="p"
                    fontSize="sm"
                  />
                </div>

                {consultation.consultationDateTime && (
                  <div className={styles.infoRow}>
                    <Calendar size={20} className={styles.icon} />
                    <Text
                      value={`${messages.common.consultationTime}: ${new Date(
                        consultation.consultationDateTime
                      ).toLocaleString()}`}
                      variant="p"
                      fontSize="sm"
                    />
                  </div>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={styles.viewButton}
                >
                  {messages.common.viewDetails}
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
