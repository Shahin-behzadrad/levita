import { PendingConsultation } from "@/types/consultation";
import Text from "@/components/Shared/Text";
import styles from "./DoctorNotification.module.scss";
import Button from "@/components/Shared/Button";
import { ArrowRight } from "lucide-react";

interface DoctorNotificationProps {
  pendingConsultations: PendingConsultation[];
  onConsultationClick: () => void;
}

const DoctorNotification = ({
  pendingConsultations,
  onConsultationClick,
}: DoctorNotificationProps) => {
  const handleViewConsultation = (consultationId: string) => {
    const element = document.getElementById(`consultation-${consultationId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a highlight effect
      element.classList.add("highlight");
      setTimeout(() => {
        element.classList.remove("highlight");
      }, 2000);
    }
    onConsultationClick();
  };

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
            onClick={() => handleViewConsultation(consultation._id)}
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
