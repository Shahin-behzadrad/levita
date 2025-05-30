import { FC, ReactNode } from 'react';
import classes from './CardHeader.module.scss';
import Text from '../../Text';
import clsx from 'clsx';

interface CardHeaderProps {
  titleStartAdornment?: ReactNode;
  titleEndAdornment?: ReactNode;
  title?: string;
  titleClassName?: string;
  titleFontSize?: number;
  subheader?: string;
  className?: string;
  action?: ReactNode;
}

export const CardHeader: FC<CardHeaderProps> = ({
  title,
  subheader,
  className,
  titleEndAdornment,
  titleStartAdornment,
  action,
  titleFontSize,
  titleClassName
}) => (
  <div className={`${classes.cardHeader} ${className || ''}`}>
    <div>
      <Text
        value={title}
        variant="h3"
        className={clsx(classes.title, titleClassName)}
        startAdornment={titleStartAdornment}
        endAdornment={titleEndAdornment}
        style={{ fontSize: titleFontSize }}
      />
      {subheader && <Text value={subheader} className={classes.subheader} />}
    </div>
    {action && action}
  </div>
);
