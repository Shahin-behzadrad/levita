"use client";

import { ConsultationRequest } from "@/types/consultation";
import { Card, CardContent } from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import { CircleCheckBig, CheckCheck, LoaderCircle } from "lucide-react";
import clsx from "clsx";
import styles from "./ConsultationStatusCard.module.scss";
import { UserType } from "@/types/userType";
import { DoctorInfoCard } from "../DoctorInfoCard/DoctorInfoCard";

interface ConsultationStatusCardProps {
  consultation: ConsultationRequest;
  doctorProfile?: UserType;
}

export default function ConsultationStatusCard({
  consultation,
  doctorProfile,
}: ConsultationStatusCardProps) {
  return (
    <Card className={styles.requestSentCard}>
      <CardContent>
        <div className={styles.requestSentTextContainer}>
          <Text
            value={
              consultation.status === "accepted"
                ? "you consultation request has been accepted!"
                : "you consultation request has been sent!"
            }
            fontWeight="bold"
            startAdornment={
              <CircleCheckBig size={24} color="var(--success-darker)" />
            }
          />
          <Text
            value={consultation.status}
            color={"black"}
            className={clsx(styles.requestSentText, {
              [styles.accepted]: consultation.status === "accepted",
            })}
            fontWeight="bold"
            endAdornment={
              consultation.status === "pending" ? (
                <LoaderCircle size={20} className={styles.loader} />
              ) : (
                <CheckCheck size={20} color="var(--success-darker)" />
              )
            }
          />
        </div>
      </CardContent>
      {doctorProfile && doctorProfile._id && (
        <CardContent>
          <DoctorInfoCard
            doctor={doctorProfile as UserType}
            consultationTime={consultation.consultationDateTime}
          />
        </CardContent>
      )}
    </Card>
  );
}
