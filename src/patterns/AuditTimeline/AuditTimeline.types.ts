import type { ReactNode } from 'react';

export type AuditTimelineEventType = 'created' | 'updated' | 'approved' | 'returned';
export type AuditTimelineFilterType = AuditTimelineEventType | 'all';

export interface AuditTimelineChange {
  field: string;
  before?: string;
  after?: string;
}

export interface AuditTimelineEntry {
  id: string;
  type: AuditTimelineEventType;
  title: string;
  actor: string;
  occurredAt: string;
  description?: string;
  changes?: AuditTimelineChange[];
  metadata?: ReactNode;
}

export type AuditTimelineTelemetryEventName =
  | 'ds.audit_timeline.filter.change'
  | 'ds.audit_timeline.entry.expand'
  | 'ds.audit_timeline.entry.collapse';

export type AuditTimelineTelemetryAction = 'filter_change' | 'entry_expand' | 'entry_collapse';

export interface AuditTimelineTelemetryEvent {
  event: AuditTimelineTelemetryEventName;
  action: AuditTimelineTelemetryAction;
  context: {
    surface: string;
    component: 'audit_timeline';
    typeFilter: AuditTimelineFilterType;
    actorFilterState: 'all' | 'filtered';
    hasQuery: boolean;
    queryLength: number;
    visibleCount: number;
    entryId?: string;
  };
  result: 'success' | 'error';
  errorCode?: string;
  errorMessage?: string;
  occurredAt: string;
}

export interface AuditTimelineLabels {
  typeFilter?: string;
  actorFilter?: string;
  search?: string;
  allTypes?: string;
  allActors?: string;
  searchPlaceholder?: string;
  noResultsTitle?: string;
  noResultsDescription?: string;
  diffLabel?: string;
  beforeLabel?: string;
  afterLabel?: string;
  showDiffLabel?: string;
  hideDiffLabel?: string;
  eventTypeLabels?: Partial<Record<AuditTimelineEventType, string>>;
}

export interface AuditTimelineProps {
  entries: AuditTimelineEntry[];
  className?: string;
  emptyState?: ReactNode;
  defaultTypeFilter?: AuditTimelineFilterType;
  defaultActorFilter?: string;
  defaultQuery?: string;
  telemetrySurface?: string;
  onTelemetry?: (event: AuditTimelineTelemetryEvent) => void;
  labels?: AuditTimelineLabels;
}
