import { CSSProperties, ReactNode } from 'react';
import classes from './Container.module.scss';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  style?: CSSProperties;
}

const Container = ({
  children,
  className,
  maxWidth,
  style
}: ContainerProps) => {
  const containerClasses = clsx(classes.container, className, {
    [classes[`maxWidth-${maxWidth}`]]: maxWidth
  });

  return (
    <div className={containerClasses} style={style}>
      {children}
    </div>
  );
};

export default Container;
