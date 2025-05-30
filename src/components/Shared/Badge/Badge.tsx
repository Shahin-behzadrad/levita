import { ReactNode } from "react";
import styles from "./Badge.module.scss";

interface BadgeProps {
  children: ReactNode;
  variant?: "outline" | "filled";
  className?: string;
}

export const Badge = ({
  children,
  variant = "outline",
  className,
}: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className || ""}`}>
      {children}
    </span>
  );
};
