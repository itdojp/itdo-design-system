import React from 'react';
import clsx from 'clsx';
import { ToastProps } from './Toast.types';
import './Toast.css';

export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  title,
  description,
  action,
  dismissible = false,
  onClose,
  className,
}) => {
  const toastClasses = clsx('itdo-toast', `itdo-toast--${variant}`, className);

  return (
    <div className={toastClasses} role="status" aria-live="polite">
      <span className="itdo-toast__indicator" aria-hidden="true" />
      <div className="itdo-toast__content">
        {title && <p className="itdo-toast__title">{title}</p>}
        {description && <div className="itdo-toast__description">{description}</div>}
      </div>
      {action && <div className="itdo-toast__action">{action}</div>}
      {dismissible && (
        <button
          type="button"
          className="itdo-toast__close"
          onClick={onClose}
          aria-label="Close"
        >
          x
        </button>
      )}
    </div>
  );
};
