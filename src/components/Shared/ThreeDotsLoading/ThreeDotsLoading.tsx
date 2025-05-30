import clsx from 'clsx';
import classes from './ThreeDotsLoading.module.scss';

type props = {
  className?: string;
  loadingInButton?: boolean;
};

export const ThreeDotsLoading = ({
  className,
  loadingInButton = false
}: props) => {
  return (
    <div className={clsx(classes.container, className)}>
      <div
        className={clsx(classes.sides, {
          [classes.ButtonLoading]: loadingInButton
        })}
      />
      <div
        className={clsx(classes.middle, {
          [classes.ButtonLoading]: loadingInButton
        })}
      />
      <div
        className={clsx(classes.sides, {
          [classes.ButtonLoading]: loadingInButton
        })}
      />
    </div>
  );
};
