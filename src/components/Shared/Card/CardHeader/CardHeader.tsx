import { FC, ReactNode } from "react";
import styles from "./CardHeader.module.scss";
import Text from "../../Text";
import clsx from "clsx";

interface CardHeaderProps {
  titleStartAdornment?: ReactNode;
  titleEndAdornment?: ReactNode;
  title?: string;
  titleClassName?: string;
  titleFontSize?: number;
  subheader?: string;
  className?: string;
  action?: ReactNode;
  titleColor?: "primary" | "secondary" | "white" | "true-white" | "black";
  onClick?: () => void;
}

export const CardHeader: FC<CardHeaderProps> = ({
  title,
  subheader,
  className,
  titleEndAdornment,
  titleStartAdornment,
  action,
  titleFontSize = 23,
  titleClassName,
  titleColor,
  onClick,
}) => (
  <div className={`${styles.cardHeader} ${className || ""}`} onClick={onClick}>
    <Text
      value={title}
      variant="h4"
      className={clsx(styles.title, titleClassName)}
      startAdornment={titleStartAdornment}
      endAdornment={titleEndAdornment}
      fontWeight="bold"
      style={{ fontSize: titleFontSize }}
      color={titleColor}
    />
    {subheader && <Text value={subheader} className={styles.subheader} />}

    {action && action}
  </div>
);
