import React from 'react';
import clsx from 'clsx';
import { SpinnerProps } from './Spinner.types';
import './Spinner.css';

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  label = 'Loading',
  className,
}) => {
  return (
    <span
      className={clsx('itdo-spinner', `itdo-spinner--${size}`, className)}
      role="status"
      aria-label={label}
    >
      <span className="itdo-spinner__circle" />
    </span>
  );
};
