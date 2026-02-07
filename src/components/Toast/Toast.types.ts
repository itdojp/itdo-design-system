import { ReactNode } from 'react';

export type ToastSeverity = 'success' | 'warning' | 'error' | 'info';
export type ToastVariant = ToastSeverity;

export const TOAST_DEFAULT_TTL_MS = {
  info: 5000,
  success: 4000,
  warning: 7000,
  error: 0,
} as const;

export interface ToastQueueItem {
  id: string;
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  severity: ToastSeverity;
  dismissible?: boolean;
  ttl?: number | null;
  dedupeKey?: string;
  createdAt?: number;
}

export interface ToastProps {
  severity?: ToastSeverity;
  variant?: ToastVariant;
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  ttl?: number | null;
  dedupeKey?: string;
  onClose?: () => void;
  className?: string;
}

export interface ToastViewportProps {
  toasts: ToastQueueItem[];
  onDismiss: (id: string) => void;
  className?: string;
}
