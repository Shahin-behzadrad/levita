import { ConsultationRequest } from "@/types/consultation";
import Text from "@/components/Shared/Text";
import styles from "./DoctorNotification.module.scss";
import Button from "@/components/Shared/Button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface DoctorNotificationProps {
  pendingConsultations: ConsultationRequest[];
  onConsultationClick: () => void;
}

const DoctorNotification = ({
  pendingConsultations,
  onConsultationClick,
}: DoctorNotificationProps) => {
  const router = useRouter();

  if (!pendingConsultations?.length) {
    return (
      <Text
        value="No new notifications"
        variant="span"
        noWrap
        fontSize="sm"
        color="gray"
      />
    );
  }

  return (
    <div className={styles.container}>
      <Text
        value={`${pendingConsultations.length} Consultation Request${
          pendingConsultations.length > 1 ? "s" : ""
        }`}
        fontSize="sm"
        fontWeight="medium"
        noWrap
      />
      {pendingConsultations.map((consultation) => (
        <div key={consultation._id}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              router.push(`/consultation/${consultation._id}`);
              onConsultationClick();
            }}
            endIcon={<ArrowRight size={16} />}
          >
            View consultation request
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DoctorNotification;
