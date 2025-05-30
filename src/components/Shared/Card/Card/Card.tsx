import { CSSProperties, FC, ReactNode } from 'react';
import classes from './Card.module.scss';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Card: FC<CardProps> = ({ children, className }) => (
  <div className={clsx(classes.card, className)}>{children}</div>
);
