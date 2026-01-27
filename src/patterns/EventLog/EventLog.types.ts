import type { ReactNode } from 'react';

export type EventLogStatus = 'info' | 'success' | 'warning' | 'error';

export interface ChangeLogEntry {
  field: string;
  before?: string;
  after?: string;
}

export interface EventLogItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status?: EventLogStatus;
  adminOverride?: boolean;
  changes?: ChangeLogEntry[];
  meta?: ReactNode;
}

export interface EventLogProps {
  items: EventLogItem[];
  emptyState?: ReactNode;
  className?: string;
}
