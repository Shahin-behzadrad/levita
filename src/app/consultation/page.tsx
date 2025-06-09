"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { notFound, useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import Button from "@/components/Shared/Button";
import styles from "./page.module.scss";
import { User, Clock, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { Id } from "../../../convex/_generated/dataModel";
import LoadingModal from "@/components/LoadingModal/LoadingModal";
import Grid from "@/components/Shared/Grid/Grid";

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
      <Grid container spacing={8}>
        {consultations.map((consultation: Consultation) => (
          <Grid
            item
            xs={12}
            className={styles.cardContainer}
            key={consultation._id}
          >
            <Card className={styles.card}>
              <CardHeader
                title={consultation.patient?.fullName || "Unknown Patient"}
                titleStartAdornment={<User size={24} />}
                titleFontSize={16}
                action={
                  <div className={styles.statusBadge}>
                    <Text
                      value={messages.common[consultation.status]}
                      color="black"
                      fontSize="sm"
                    />
                  </div>
                }
              />

              <CardContent>
                <div>
                  <div>
                    <Text
                      className={styles.text}
                      startAdornment={<Clock size={20} />}
                      value={`${messages.common.submitted}: ${new Date(
                        consultation._creationTime
                      ).toLocaleString()}`}
                      fontSize="sm"
                    />
                  </div>

                  {consultation.consultationDateTime && (
                    <div>
                      <Text
                        className={styles.text}
                        startAdornment={<Calendar size={20} />}
                        value={`${messages.common.consultationTime}: ${new Date(
                          consultation.consultationDateTime
                        ).toLocaleString()}`}
                        fontSize="sm"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className={styles.cardFooter}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    router.push(`/consultation/${consultation._id}`)
                  }
                >
                  {messages.common.viewDetails}
                </Button>
              </CardFooter>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
