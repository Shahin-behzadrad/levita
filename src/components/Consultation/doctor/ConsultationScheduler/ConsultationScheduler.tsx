import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "@/components/Shared/Modal/Modal";
import Text from "@/components/Shared/Text";
import Button from "@/components/Shared/Button";
import styles from "./ConsultationScheduler.module.scss";
import { useLanguage } from "@/i18n/LanguageContext";
import Grid from "@/components/Shared/Grid/Grid";
import { createMeet } from "@/lib/createMeetLink";
import { toast } from "sonner";
import { Id } from "../../../../../convex/_generated/dataModel";
import { formatPickedDateTimeCET } from "@/lib/functions";
import { DateTime } from "luxon";

interface ConsultationSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dateTime: string, meetLink: string) => void;
  googleToken: {
    access_token: string;
    refresh_token?: string;
  };
  userId: Id<"doctorProfiles">;
  email: string;
  patientName: string;
  doctorName: string;
}

export default function ConsultationScheduler({
  isOpen,
  onClose,
  onConfirm,
  googleToken,
  userId,
  email,
  patientName,
  doctorName,
}: ConsultationSchedulerProps) {
  const { messages } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      setIsLoading(true);

      const start = formatPickedDateTimeCET(selectedDate, selectedTime);

      const end = DateTime.fromISO(start).plus({ hours: 1 }).toISO();

      const meetLink = await createMeet(
        start,
        end!,
        googleToken,
        userId,
        email,
        patientName,
        doctorName
      );

      onConfirm(start, meetLink ?? "");
      onClose();
    } catch (error) {
      console.error("Error creating consultation:", error);
      toast.error(
        messages?.common?.errorCreatingConsultation ??
          "Error creating consultation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={messages.common.scheduleConsultation}
      subTitle={
        "The consultation will be scheduled in the Central European Time (CET) timezone."
      }
      actions={
        <div className={styles.schedulerActions}>
          <Button variant="outlined" onClick={onClose}>
            {messages.common.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime || isLoading}
          >
            {isLoading
              ? messages.common.loading || "Loading..."
              : messages.common.confirm}
          </Button>
        </div>
      }
    >
      <Grid container spacing={8}>
        <Grid item xs={12} md={6}>
          <Text value={messages.common.selectDate} className={styles.label} />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className={styles.datePicker}
            wrapperClassName={styles.timePickerWrapper}
            placeholderText={messages.common.selectDate}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Text value={messages.common.selectTime} className={styles.label} />
          <DatePicker
            selected={selectedTime}
            onChange={(time) => setSelectedTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="HH:mm"
            className={styles.timePicker}
            wrapperClassName={styles.timePickerWrapper}
            placeholderText={messages.common.selectTime}
          />
        </Grid>
      </Grid>
    </Modal>
  );
}
