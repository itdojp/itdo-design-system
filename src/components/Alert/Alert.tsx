import React from 'react';
import clsx from 'clsx';
import { AlertProps } from './Alert.types';
import './Alert.css';

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onClose,
  className,
}) => {
  const alertClasses = clsx('itdo-alert', `itdo-alert--${variant}`, className);

  return (
    <div className={alertClasses} role="alert">
      <span className="itdo-alert__indicator" aria-hidden="true" />
      <div className="itdo-alert__content">
        {title && <p className="itdo-alert__title">{title}</p>}
        {children && <div className="itdo-alert__description">{children}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          className="itdo-alert__close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};
