import { ReactNode } from 'react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  variant?: ToastVariant;
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
}
