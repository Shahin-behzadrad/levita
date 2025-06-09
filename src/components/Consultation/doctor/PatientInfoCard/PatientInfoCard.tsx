import { User, Clock, Calendar, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import Button from "@/components/Shared/Button";
import styles from "./PatientInfoCard.module.scss";
import { useIsMobile } from "@/hooks/use-mobile";

interface PatientInfoCardProps {
  consultation: {
    consultationDateTime?: string;
    patient?: {
      fullName: string;
      age: number;
      sex: string;
    } | null;
    status: string;
  };
  messages: any;
  canJoin: boolean;
  onJoinClick: () => void;
  previewUsersHealthAnalysis: () => void;
}

export default function PatientInfoCard({
  consultation,
  messages,
  canJoin,
  onJoinClick,
  previewUsersHealthAnalysis,
}: PatientInfoCardProps) {
  const isMobile = useIsMobile();
  return (
    <Card className={styles.patientInfoCard}>
      <CardHeader
        title={messages.common.patientInfo}
        titleStartAdornment={<User size={24} />}
      />

      <CardContent className={styles.patientInfoContent}>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <Text
              startAdornment={<Clock size={20} className={styles.infoIcon} />}
              value={`${messages.common.consultationTime}: ${new Date(
                consultation.consultationDateTime as string
              ).toLocaleString()}`}
              variant="p"
            />
          </div>

          <div className={styles.infoRow}>
            <Text
              startAdornment={<User size={20} className={styles.infoIcon} />}
              value={`${messages.common.patientName}: ${
                consultation.patient?.fullName || "N/A"
              }`}
              variant="p"
            />
          </div>

          <div className={styles.infoRow}>
            <Text
              startAdornment={
                <p className={styles.sexIcon}>
                  {consultation.patient?.sex === "male" ? "♂️" : "♀️"}
                </p>
              }
              value={`${messages.profile.sex}: ${
                consultation.patient?.sex || "N/A"
              }`}
              variant="p"
            />
          </div>

          <div className={styles.infoRow}>
            <Text
              startAdornment={
                <Calendar size={20} className={styles.infoIcon} />
              }
              value={`${messages.profile.age}: ${
                consultation.patient?.age || "N/A"
              }`}
              variant="p"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            fullWidth
            variant="outlined"
            onClick={previewUsersHealthAnalysis}
          >
            {isMobile
              ? messages.common.userAnalysis
              : messages.common.previewUsersHealthAnalysis}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onJoinClick}
            disabled={!canJoin}
            startIcon={<MessageCircle size={20} />}
          >
            {canJoin
              ? messages.common.joinConsultation
              : messages.common.waitingForConsultation}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
