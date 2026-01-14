import type { ReactNode } from 'react';

export type EventLogStatus = 'info' | 'success' | 'warning' | 'error';

export interface EventLogItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status?: EventLogStatus;
  meta?: ReactNode;
}

export interface EventLogProps {
  items: EventLogItem[];
  emptyState?: ReactNode;
  className?: string;
}
