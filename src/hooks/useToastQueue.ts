import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TOAST_DEFAULT_TTL_MS,
  type ToastQueueItem,
  type ToastSeverity,
} from '../components/Toast/Toast.types';

export interface EnqueueToastInput {
  id?: string;
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  severity?: ToastSeverity;
  variant?: ToastSeverity;
  dismissible?: boolean;
  ttl?: number | null;
  dedupeKey?: string;
}

export interface UseToastQueueOptions {
  maxVisible?: number;
  dedupeWindowMs?: number;
}

export interface ToastQueueController {
  toasts: ToastQueueItem[];
  enqueue: (toast: EnqueueToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const TOAST_SEVERITY_PRIORITY: Record<ToastSeverity, number> = {
  error: 400,
  warning: 300,
  success: 200,
  info: 100,
};

const createToastId = () => `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toText = (value: ReactNode): string | undefined => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return undefined;
};

const sortToasts = (items: ToastQueueItem[]) =>
  [...items].sort((left, right) => {
    const priorityDiff =
      TOAST_SEVERITY_PRIORITY[right.severity] - TOAST_SEVERITY_PRIORITY[left.severity];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const leftTimestamp = left.createdAt ?? 0;
    const rightTimestamp = right.createdAt ?? 0;
    return rightTimestamp - leftTimestamp;
  });

export const useToastQueue = ({
  maxVisible = 3,
  dedupeWindowMs = 120_000,
}: UseToastQueueOptions = {}): ToastQueueController => {
  const [toasts, setToasts] = useState<ToastQueueItem[]>([]);
  const timersRef = useRef<number[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  const enqueue = useCallback(
    (toast: EnqueueToastInput) => {
      const severity = toast.severity ?? toast.variant ?? 'info';
      const now = Date.now();
      const descriptionText = toText(toast.description);
      const dedupeKey =
        toast.dedupeKey ?? `${severity}:${toast.title ?? ''}:${descriptionText ?? ''}`;
      const id = toast.id ?? createToastId();
      const ttl = toast.ttl ?? TOAST_DEFAULT_TTL_MS[severity];
      const nextToast: ToastQueueItem = {
        id,
        title: toast.title,
        description: toast.description,
        action: toast.action,
        severity,
        dismissible: toast.dismissible ?? true,
        ttl,
        dedupeKey,
        createdAt: now,
      };

      setToasts((prev) => {
        const duplicate = prev.find((item) => {
          if (!item.dedupeKey || !dedupeKey || item.dedupeKey !== dedupeKey) {
            return false;
          }

          const itemTimestamp = item.createdAt ?? 0;
          return now - itemTimestamp <= dedupeWindowMs;
        });

        const merged = duplicate
          ? prev.map((item) =>
              item.id === duplicate.id
                ? { ...nextToast, id: duplicate.id, createdAt: now }
                : item
            )
          : [...prev, nextToast];

        return sortToasts(merged).slice(0, maxVisible);
      });

      return id;
    },
    [dedupeWindowMs, maxVisible]
  );

  useEffect(() => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];

    toasts.forEach((toast) => {
      const ttl = toast.ttl ?? 0;
      if (ttl <= 0) {
        return;
      }

      const timeoutId = window.setTimeout(() => {
        dismiss(toast.id);
      }, ttl);
      timersRef.current.push(timeoutId);
    });

    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current = [];
    };
  }, [dismiss, toasts]);

  return useMemo(
    () => ({
      toasts,
      enqueue,
      dismiss,
      clear,
    }),
    [clear, dismiss, enqueue, toasts]
  );
};
