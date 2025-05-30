import { FC, ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';
import classes from './Grid.module.scss';

type GridProps = {
  container?: boolean;
  item?: boolean;
  spacing?: number; // Spacing in pixels
  xs?: number; // Columns on extra-small screens
  sm?: number; // Columns on small screens
  md?: number; // Columns on medium screens
  lg?: number; // Columns on large screens
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

interface CustomCSSProperties extends CSSProperties {
  '--grid-spacing'?: string;
}

const Grid: FC<GridProps> = ({
  container,
  item,
  spacing = 0,
  xs,
  sm,
  md,
  lg,
  children,
  className,
  style
}) => {
  const gridStyle: CustomCSSProperties = container
    ? { '--grid-spacing': `${spacing}px` }
    : {};

  return (
    <div
      className={clsx(
        className,
        container && classes.container,
        item && classes.item,
        xs && classes[`xs-${xs}`],
        sm && classes[`sm-${sm}`],
        md && classes[`md-${md}`],
        lg && classes[`lg-${lg}`]
      )}
      style={{ ...gridStyle, ...style }}
    >
      {children}
    </div>
  );
};

export default Grid;
