import styles from "./GoogleButton.module.scss";
import Button from "../Button";
import Image from "../Image/Image";
import Text from "../Text";

export const ConnectGoogleButton = () => {
  const connect = () => {
    window.location.href = "/api/google/auth";
  };

  return (
    <div className={styles.googleButtonContainer}>
      <Text value="you need to connect your google calendar to schedule appointments" />
      <Button
        variant="contained"
        color="primary"
        onClick={connect}
        endIcon={
          <Image
            src="/images/Google_Calendar_icon.svg"
            width={30}
            height={30}
            shape="default"
          />
        }
      >
        Connect Google Calendar
      </Button>
    </div>
  );
};
