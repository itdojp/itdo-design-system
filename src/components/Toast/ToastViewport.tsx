import clsx from 'clsx';
import { Toast } from './Toast';
import type { ToastViewportProps } from './Toast.types';

export const ToastViewport = ({
  toasts,
  onDismiss,
  className,
}: ToastViewportProps) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={clsx('itdo-toast-viewport', className)} role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          severity={toast.severity}
          dismissible={toast.dismissible ?? true}
          ttl={toast.ttl}
          onClose={() => onDismiss(toast.id)}
          dedupeKey={toast.dedupeKey}
        />
      ))}
    </div>
  );
};
