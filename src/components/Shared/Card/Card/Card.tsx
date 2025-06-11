import { CSSProperties, FC, ReactNode } from "react";
import classes from "./Card.module.scss";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hasBoxShadow?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  hasBoxShadow = true,
  fullWidth = false,
  onClick,
}) => (
  <div
    className={clsx(classes.card, className, {
      [classes.noBoxShadow]: !hasBoxShadow,
      [classes.fullWidth]: fullWidth,
    })}
    onClick={onClick}
  >
    {children}
  </div>
);
