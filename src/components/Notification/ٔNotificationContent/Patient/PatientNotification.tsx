import { ConsultationRequest } from "@/types/consultation";
import Text from "@/components/Shared/Text";
import classes from "./PatientNotification.module.scss";

interface PatientNotificationProps {
  getExistingNotification: ConsultationRequest | null;
}

const PatientNotification = ({
  getExistingNotification,
}: PatientNotificationProps) => {
  if (!getExistingNotification) {
    return (
      <Text
        value="No new notifications"
        variant="p"
        fontSize="sm"
        color="gray"
      />
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text
          value="Consultation Request"
          variant="h6"
          fontSize="sm"
          fontWeight="medium"
        />
        <Text
          value={getExistingNotification.status}
          variant="span"
          fontSize="xs"
          fontWeight="medium"
          color="warning"
          className={classes.status}
        />
      </div>
    </div>
  );
};

export default PatientNotification;
