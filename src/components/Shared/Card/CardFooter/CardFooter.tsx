import { FC, ReactNode } from 'react';
import classes from './CardFooter.module.scss';

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: FC<CardFooterProps> = ({ children, className }) => (
  <div className={`${classes.cardFooter} ${className || ''}`}>{children}</div>
);
