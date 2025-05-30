import React from 'react';
import styles from './CircularProgress.module.scss';
import clsx from 'clsx';

type CircularProgressProps = {
  size?: 'sm' | 'md' | 'lg'; // Optional size prop: small, medium, or large
};

const CircularProgress = ({ size = 'md' }: CircularProgressProps) => {
  const dimensions = {
    sm: 24,
    md: 40,
    lg: 64
  };

  const diameter = dimensions[size];

  return (
    <div className={clsx(styles.circularProgressWrapper, styles[size])}>
      <svg
        className={styles.circularProgress}
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
      >
        <circle
          className={styles.circularProgressTrack}
          cx={diameter / 2}
          cy={diameter / 2}
          r={(diameter - 4) / 2} // Adjust radius to account for stroke width
          fill="none"
          strokeWidth={4}
        />
        <circle
          className={styles.circularProgressSpinner}
          cx={diameter / 2}
          cy={diameter / 2}
          r={(diameter - 4) / 2}
          fill="none"
          strokeWidth={4}
        />
      </svg>
    </div>
  );
};

export default CircularProgress;
