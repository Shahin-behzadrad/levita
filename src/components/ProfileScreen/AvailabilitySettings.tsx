import { useState, ChangeEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import { Button } from "@/components/Shared/Button/Button";
import Text from "@/components/Shared/Text";
import TextField from "@/components/Shared/TextField";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import styles from "./AvailabilitySettings.module.scss";
import { Id } from "../../../convex/_generated/dataModel";
import { useLanguage } from "@/i18n/LanguageContext";
import clsx from "clsx";

interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface AvailabilitySettingsProps {
  doctorId: Id<"doctorProfiles">;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const AvailabilitySettings = ({
  doctorId,
}: AvailabilitySettingsProps) => {
  const { messages } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState(30);
  const [bufferTime, setBufferTime] = useState(15);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(
    DAYS_OF_WEEK.map((_, index) => ({
      dayOfWeek: index,
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: index !== 0 && index !== 6, // Default available Monday-Friday
    }))
  );

  const availability = useQuery(
    api.api.profiles.timeSlots.getDoctorAvailability,
    {
      doctorId,
    }
  );

  const updateAvailability = useMutation(
    api.api.profiles.timeSlots.updateDoctorAvailability
  );

  const handleSave = async () => {
    try {
      await updateAvailability({
        defaultDuration,
        bufferTime,
        workingHours,
      });

      toast.success(messages.profile.availability.updateSuccess);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update availability:", error);
      toast.error(messages.profile.availability.updateError);
    }
  };

  const handleWorkingHoursChange = (
    index: number,
    field: keyof WorkingHours,
    value: string | boolean
  ) => {
    const newWorkingHours = [...workingHours];
    newWorkingHours[index] = {
      ...newWorkingHours[index],
      [field]: value,
    };
    setWorkingHours(newWorkingHours);
  };

  if (!availability && !isEditing) {
    return (
      <Card>
        <CardContent>
          <Text value={messages.profile.availability.noSettings} />
          <Button onClick={() => setIsEditing(true)}>
            {messages.profile.availability.configure}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={messages.profile.availability.title}
        action={
          !isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              {messages.profile.availability.edit}
            </Button>
          ) : (
            <div className={styles.headerActions}>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>
                {messages.profile.availability.cancel}
              </Button>
              <Button onClick={handleSave}>
                {messages.profile.availability.save}
              </Button>
            </div>
          )
        }
      />
      <CardContent>
        {isEditing ? (
          <div className={styles.settingsForm}>
            <div className={styles.generalSettings}>
              <TextField
                label={messages.profile.availability.defaultDuration}
                type="number"
                value={defaultDuration}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => setDefaultDuration(Number(e.target.value))}
              />
              <TextField
                label={messages.profile.availability.bufferTime}
                type="number"
                value={bufferTime}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => setBufferTime(Number(e.target.value))}
              />
            </div>

            <div className={styles.workingHours}>
              <Text
                value={messages.profile.availability.workingHours}
                variant="h6"
              />
              {workingHours.map((day, index) => (
                <div key={index} className={styles.daySettings}>
                  <div className={styles.dayHeader}>
                    <Text value={DAYS_OF_WEEK[index]} />
                    <label className={styles.availabilityToggle}>
                      <input
                        type="checkbox"
                        checked={day.isAvailable}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleWorkingHoursChange(
                            index,
                            "isAvailable",
                            e.target.checked
                          )
                        }
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                  {day.isAvailable && (
                    <div className={styles.timeInputs}>
                      <TextField
                        type="time"
                        value={day.startTime}
                        onChange={(
                          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                        ) =>
                          handleWorkingHoursChange(
                            index,
                            "startTime",
                            e.target.value
                          )
                        }
                      />
                      <Text value="to" />
                      <TextField
                        type="time"
                        value={day.endTime}
                        onChange={(
                          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                        ) =>
                          handleWorkingHoursChange(
                            index,
                            "endTime",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.settingsDisplay}>
            <div className={styles.generalInfo}>
              <div className={styles.infoItem}>
                <Clock className={styles.icon} />
                <div>
                  <Text
                    value={messages.profile.availability.defaultDuration}
                    color="gray"
                    fontSize="sm"
                  />
                  <Text value={`${defaultDuration} minutes`} />
                </div>
              </div>
              <div className={styles.infoItem}>
                <Clock className={styles.icon} />
                <div>
                  <Text
                    value={messages.profile.availability.bufferTime}
                    color="gray"
                    fontSize="sm"
                  />
                  <Text value={`${bufferTime} minutes`} />
                </div>
              </div>
            </div>

            <div className={styles.workingHoursDisplay}>
              {workingHours.map((day, index) => (
                <div
                  key={index}
                  className={clsx(styles.dayDisplay, {
                    [styles.available]: day.isAvailable,
                  })}
                >
                  <Text
                    value={DAYS_OF_WEEK[index]}
                    color={day.isAvailable ? "true-white" : "gray"}
                  />
                  {day.isAvailable ? (
                    <Text
                      value={`${day.startTime} - ${day.endTime}`}
                      color="true-white"
                      fontSize="xs"
                      textAlign="center"
                    />
                  ) : (
                    <Text
                      value={messages.profile.availability.notAvailable}
                      color="gray"
                      fontSize="xs"
                      textAlign="center"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
