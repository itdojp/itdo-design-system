import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { TOAST_DEFAULT_TTL_MS, ToastProps } from './Toast.types';
import './Toast.css';

export const Toast: React.FC<ToastProps> = ({
  severity,
  variant = 'info',
  title,
  description,
  action,
  dismissible = false,
  ttl,
  onClose,
  className,
}) => {
  const resolvedSeverity = severity ?? variant;
  const resolvedTtl = ttl ?? TOAST_DEFAULT_TTL_MS[resolvedSeverity];
  const ariaLive = resolvedSeverity === 'error' || resolvedSeverity === 'warning'
    ? 'assertive'
    : 'polite';
  const role = resolvedSeverity === 'error' || resolvedSeverity === 'warning'
    ? 'alert'
    : 'status';
  const toastClasses = clsx('itdo-toast', `itdo-toast--${resolvedSeverity}`, className);

  useEffect(() => {
    if (!onClose) {
      return;
    }

    if (resolvedTtl === null || resolvedTtl <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onClose();
    }, resolvedTtl);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onClose, resolvedTtl]);

  const hasContent = useMemo(() => Boolean(title || description), [description, title]);

  return (
    <div
      className={toastClasses}
      role={role}
      aria-live={ariaLive}
      data-severity={resolvedSeverity}
      data-ttl={resolvedTtl ?? 'none'}
    >
      <span className="itdo-toast__indicator" aria-hidden="true" />
      <div className="itdo-toast__content">
        {title && <p className="itdo-toast__title">{title}</p>}
        {description && <div className="itdo-toast__description">{description}</div>}
        {!hasContent && <p className="itdo-toast__title">Notification</p>}
      </div>
      {action && <div className="itdo-toast__action">{action}</div>}
      {dismissible && onClose && (
        <button
          type="button"
          className="itdo-toast__close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};
