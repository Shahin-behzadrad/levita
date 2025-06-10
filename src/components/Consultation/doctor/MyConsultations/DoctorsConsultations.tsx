import styles from "./DoctorsConsultations.module.scss";

import Text from "@/components/Shared/Text";
import { Card, CardContent } from "@/components/Shared/Card";
import Divider from "@/components/Shared/Divider/Divider";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";

const DoctorsConsultations = () => {
  const consultations = useQuery(
    api.api.consultation.getDoctorConsultations.getDoctorConsultations
  );

  return (
    <>
      <div className={styles.pendingConsultations}>
        <Text
          value="My Appointments"
          textAlign="left"
          fontSize="xl"
          fontWeight="bold"
          className={styles.title}
          startAdornment={<div className={styles.icon} />}
        />
        <Card className={styles.pendingConsultationsList}>
          <CardContent>
            {consultations && consultations.length > 0 ? (
              consultations.map((consultation, index) => (
                <>
                  <div key={consultation._id}>
                    <Text
                      value={consultation?.doctorReportPreview?.patientOverview}
                    />
                  </div>
                  {index !== consultations.length - 1 && (
                    <Divider color="gray" />
                  )}
                </>
              ))
            ) : (
              <div className={styles.emptyState}>
                <Text value="📋" className={styles.emoji} />
                <Text
                  value="No accepted Appointments"
                  className={styles.title}
                />
                <Text
                  value="All caught up! No accepted appointment at the moment."
                  className={styles.description}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DoctorsConsultations;
