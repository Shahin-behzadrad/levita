import { Card, CardContent } from "@/components/Shared/Card";
import { Text } from "@/components/Shared/Text/Text";
import { UserType } from "@/types/userType";

import styles from "./DoctorInfoCard.module.scss";
import Image from "@/components/Shared/Image/Image";
import Grid from "@/components/Shared/Grid/Grid";
import { Stethoscope } from "lucide-react";

interface DoctorInfoCardProps {
  doctor: UserType;
}

export const DoctorInfoCard = ({ doctor }: DoctorInfoCardProps) => {
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
              <Text
                value="TODO: here should be consultation data"
                color="gray"
                fontSize="sm"
              />
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
