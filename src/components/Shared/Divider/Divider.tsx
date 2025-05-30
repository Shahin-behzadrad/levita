import clsx from 'clsx';
import classes from './Divider.module.scss';

type Props = {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  color?: 'gray' | 'lightGray';
};

const Divider = ({
  orientation = 'horizontal',
  className,
  color = 'lightGray'
}: Props) => {
  return (
    <div
      className={clsx(classes.divider, className, {
        [classes.vertical]: orientation === 'vertical'
      })}
    >
      <div
        className={clsx(classes.line, {
          [classes.lightGray]: color === 'lightGray'
        })}
      />
    </div>
  );
};

export default Divider;
