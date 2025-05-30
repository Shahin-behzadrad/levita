import { FC, ReactNode } from 'react';
import classes from './CardContent.module.scss';

interface CardContentProps {
  children: ReactNode;
  className?: string;
  maxHeight?: number;
}

export const CardContent: FC<CardContentProps> = ({
  children,
  className,
  maxHeight
}) => (
  <div
    style={{ maxHeight: maxHeight }}
    className={`${classes.cardContent} ${className || ''}`}
  >
    {children}
  </div>
);
