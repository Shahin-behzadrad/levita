import { Card, CardContent } from "@/components/Shared/Card";
import { Text } from "@/components/Shared/Text/Text";
import { UserType } from "@/types/userType";
import { useLanguage } from "@/i18n/LanguageContext";
import { User, Clock, Calendar } from "lucide-react";

import styles from "./DoctorInfoCard.module.scss";
import Image from "@/components/Shared/Image/Image";
import Grid from "@/components/Shared/Grid/Grid";
import { Stethoscope } from "lucide-react";

function formatDateTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

interface DoctorInfoCardProps {
  doctor: UserType;
  consultationTime?: string;
}

export const DoctorInfoCard = ({
  doctor,
  consultationTime,
}: DoctorInfoCardProps) => {
  const formattedTime = consultationTime
    ? formatDateTime(consultationTime)
    : "Not scheduled";

  return (
    <Card>
      <CardContent>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <div className={styles.profileSection}>
              <Image
                src={doctor.profileImage}
                alt={doctor.fullName || "Doctor"}
                width={80}
                height={80}
                shape="circle"
              />

              <div className={styles.basicInfo}>
                <Text
                  value={"Dr. " + doctor.fullName || ""}
                  fontWeight="bold"
                  color="true-white"
                  className={styles.doctorName}
                  startAdornment={
                    <Stethoscope size={20} color="var(--true-white)" />
                  }
                />
                <Text
                  value={doctor.specialization || ""}
                  color="gray"
                  fontSize="sm"
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className={styles.consultationData} hasBoxShadow={false}>
              <Text value="Consultation Time" fontWeight="bold" fontSize="sm" />
              <Text value={formattedTime} color="gray" fontSize="sm" />
            </Card>
          </Grid>

          <Grid item xs={12}>
            {doctor.bio && (
              <div className={styles.bio}>
                <Text value="About" fontWeight="bold" fontSize="sm" />
                <Text value={doctor.bio} fontSize="sm" color="gray" />
              </div>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
