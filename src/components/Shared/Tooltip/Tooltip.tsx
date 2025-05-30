import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import classes from './Tooltip.module.scss';
import clsx from 'clsx';

type Props = {
  children?: ReactNode;
  tooltipContent?: ReactNode;
  style?: CSSProperties;
  onClose?: () => void;
  open?: boolean;
};

const Tooltip = ({ children, tooltipContent, style, onClose, open }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isRightAligned, setIsRightAligned] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        // Check if the child goes beyond the viewport's right edge
        setIsRightAligned(rect.right + 200 > window.innerWidth);
      }
    };

    checkPosition(); // Check initially
    window.addEventListener('resize', checkPosition); // And on resize

    return () => {
      window.removeEventListener('resize', checkPosition); // Clean up
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <div style={style} className={classes.tooltipWrapper} ref={parentRef}>
      <div>{children}</div>

      <div
        className={clsx(classes.tooltipContent, {
          [classes.openTooltip]: open,
          [classes.hoverDisabled]: open !== undefined
        })}
        style={{
          left: isRightAligned ? 'auto' : '0',
          right: isRightAligned ? '0' : 'auto'
        }}
      >
        {tooltipContent}
      </div>
      <div
        className={clsx(classes.tooltipArrow, {
          [classes.openTooltip]: open,
          [classes.hoverDisabled]: open !== undefined
        })}
      />
    </div>
  );
};

export default Tooltip;
