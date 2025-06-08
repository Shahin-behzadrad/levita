import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Tooltip from "@/components/Shared/Tooltip/Tooltip";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import classes from "./Notification.module.scss";
import Text from "@/components/Shared/Text";
import DoctorNotification from "./ٔNotificationContent/Doctor/DoctorNotification";
import PatientNotification from "./ٔNotificationContent/Patient/PatientNotification";
import { ConsultationRequest } from "@/types/consultation";

const Notification = ({ isDoctor }: { isDoctor: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const patientProfile = useQuery(
    api.api.profiles.patientProfiles.getPatientProfile
  );

  const getExistingNotification = useQuery(
    api.api.consultation.getExistingConsultationRequest
      .getExistingConsultationRequest,
    patientProfile?._id ? { patientId: patientProfile?._id } : "skip"
  ) as ConsultationRequest | null;

  const pendingConsultations = useQuery(
    api.api.consultation.getPendingConsultations.getPendingConsultations
  ) as ConsultationRequest[];

  const hasNotifications =
    getExistingNotification || pendingConsultations?.length > 0;

  return (
    <Tooltip
      open={isOpen}
      onClose={() => setIsOpen(false)}
      tooltipContent={
        <div className={classes.tooltipContent}>
          {isDoctor ? (
            <DoctorNotification
              pendingConsultations={pendingConsultations}
              onConsultationClick={() => setIsOpen(false)}
            />
          ) : (
            <PatientNotification
              getExistingNotification={getExistingNotification}
            />
          )}
        </div>
      }
    >
      <div
        className={classes.notificationWrapper}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className={classes.bellIcon} />
        {hasNotifications && <div className={classes.notificationDot} />}
      </div>
    </Tooltip>
  );
};

export default Notification;
