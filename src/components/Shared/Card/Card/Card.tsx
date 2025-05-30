import { CSSProperties, FC, ReactNode } from "react";
import classes from "./Card.module.scss";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hasBoxShadow?: boolean;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  hasBoxShadow = true,
}) => (
  <div
    className={clsx(classes.card, className, {
      [classes.noBoxShadow]: !hasBoxShadow,
    })}
  >
    {children}
  </div>
);
