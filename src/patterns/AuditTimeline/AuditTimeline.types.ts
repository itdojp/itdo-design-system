import type { ReactNode } from 'react';

export type AuditEventTone = 'default' | 'info' | 'success' | 'warning' | 'error' | 'critical';

export interface AuditEvent {
  id: string;
  time: string;
  actor: string;
  action: string;
  target?: string;
  summary?: string;
  tone?: AuditEventTone;
  meta?: ReactNode;
}

export interface AuditTimelineProps {
  events: AuditEvent[];
  onSelectEvent?: (event: AuditEvent) => void;
  selectedEventId?: string;
  compact?: boolean;
  groupByDate?: boolean;
  className?: string;
  emptyState?: ReactNode;
}

export type DiffViewerFormat = 'text' | 'json';

export interface DiffViewerProps {
  before?: unknown;
  after?: unknown;
  format?: DiffViewerFormat;
  compact?: boolean;
  maxVisibleLines?: number;
  className?: string;
}
