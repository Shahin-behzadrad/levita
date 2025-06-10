import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import styles from "./PendingConsultations.module.scss";
import ConsultationScheduler from "../ConsultationScheduler/ConsultationScheduler";

import { useState } from "react";
import { PendingConsultation } from "@/types/consultation";
import Text from "@/components/Shared/Text";
import { Card, CardContent } from "@/components/Shared/Card";
import Divider from "@/components/Shared/Divider/Divider";

const PendingConsultations = () => {
  const [showScheduler, setShowScheduler] = useState(false);

  const pendingConsultation = useQuery(
    api.api.consultation.getPendingConsultations.getPendingConsultations
  );

  const handleAcceptConsultation = () => {
    console.log("accept consultation");
  };

  console.log(pendingConsultation);

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
                <>
                  <div key={consultation._id}>
                    <Text value={consultation.patientId} />
                  </div>
                  {index !== pendingConsultation.length - 1 && (
                    <Divider color="gray" />
                  )}
                </>
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
          onConfirm={handleAcceptConsultation}
        />
      )}
    </>
  );
};

export default PendingConsultations;
