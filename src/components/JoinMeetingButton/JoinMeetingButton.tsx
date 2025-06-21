import { useEffect, useState } from "react";
import { Button } from "@/components/Shared/Button/Button";
import { DateTime } from "luxon";
import { Video } from "lucide-react";

import { Text } from "../Shared/Text/Text";
import styles from "./JoinMeetingButton.module.scss";
import Tooltip from "../Shared/Tooltip/Tooltip";

interface JoinMeetingButtonProps {
  consultationDateTime: string;
  meetLink: string;
}

export const JoinMeetingButton = ({
  consultationDateTime,
  meetLink,
}: JoinMeetingButtonProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const checkJoinAvailability = () => {
      const now = DateTime.now().setZone("Europe/Berlin");
      const meetingTime = DateTime.fromISO(consultationDateTime, {
        zone: "Europe/Berlin",
      });

      setEnabled(now >= meetingTime.minus({ minutes: 5 }));
    };

    checkJoinAvailability(); // Initial check

    const interval = setInterval(checkJoinAvailability, 10 * 1000); // Check every 10s
    return () => clearInterval(interval); // Cleanup
  }, [consultationDateTime]);

  const handleClick = () => {
    if (!enabled) return;
    window.open(meetLink, "_blank");
  };

  return (
    <Tooltip
      tooltipContent={
        !enabled ? (
          <Text
            className={styles.tooltipText}
            value="You can join the meeting 5 minutes before the scheduled time."
          />
        ) : null
      }
      open={!enabled ? undefined : false}
    >
      <span>
        <Button
          size="sm"
          fullWidth
          variant="outlined"
          startIcon={<Video size={20} />}
          disabled={!enabled}
          className={styles.joinMeetingButton}
          onClick={handleClick}
        >
          Join Meeting
        </Button>
      </span>
    </Tooltip>
  );
};
