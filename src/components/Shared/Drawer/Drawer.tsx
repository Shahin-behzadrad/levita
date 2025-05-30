import clsx from 'clsx';
import classes from './Drawer.module.scss';
import { ReactNode } from 'react';

type Props = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
};

const Drawer = ({ isOpen, children, onClose }: Props) => {
  return (
    <>
      <div
        className={clsx(classes.backdrop, {
          [classes.openBackdrop]: isOpen
        })}
        onClick={onClose}
      />
      <div
        className={clsx(classes.customDrawer, {
          [classes.open]: isOpen
        })}
      >
        <div className={classes.drawerContent}>{children}</div>
      </div>
    </>
  );
};

export default Drawer;
