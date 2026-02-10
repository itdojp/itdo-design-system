import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import type {
  AuditTimelineEntry,
  AuditTimelineFilterType,
  AuditTimelineProps,
  AuditTimelineTelemetryAction,
  AuditTimelineTelemetryEventName,
} from './AuditTimeline.types';
import './AuditTimeline.css';

const defaultEventTypeLabels = {
  created: 'Created',
  updated: 'Updated',
  approved: 'Approved',
  returned: 'Returned',
} as const;

const defaultLabels = {
  typeFilter: 'Event type',
  actorFilter: 'Actor',
  search: 'Search',
  allTypes: 'All event types',
  allActors: 'All actors',
  searchPlaceholder: 'Search title, actor, or changes',
  noResultsTitle: 'No matching activity',
  noResultsDescription: 'Adjust filters to view audit records.',
  diffLabel: 'Changes',
  beforeLabel: 'Before',
  afterLabel: 'After',
  showDiffLabel: 'Show diff',
  hideDiffLabel: 'Hide diff',
  eventTypeLabels: defaultEventTypeLabels,
};

const normalize = (value: string) => value.trim().toLowerCase();

const hasDiff = (entry: AuditTimelineEntry) =>
  Boolean(entry.changes?.some((change) => change.before || change.after));

const includesQuery = (value: string | undefined, query: string) =>
  Boolean(value && value.toLowerCase().includes(query));

const toActorFilterState = (actorFilter: string): 'all' | 'filtered' =>
  actorFilter === 'all' ? 'all' : 'filtered';

const filterEntries = (
  entries: AuditTimelineEntry[],
  typeFilter: AuditTimelineFilterType,
  actorFilter: string,
  query: string
) =>
  entries.filter((entry) => {
    if (typeFilter !== 'all' && entry.type !== typeFilter) {
      return false;
    }

    if (actorFilter !== 'all' && entry.actor !== actorFilter) {
      return false;
    }

    if (query.length === 0) {
      return true;
    }

    const changeText = entry.changes
      ?.map((change) => `${change.field} ${change.before ?? ''} ${change.after ?? ''}`)
      .join(' ')
      .toLowerCase();

    return (
      includesQuery(entry.title, query) ||
      includesQuery(entry.description, query) ||
      includesQuery(entry.actor, query) ||
      includesQuery(changeText, query)
    );
  });

export const AuditTimeline = ({
  entries,
  className,
  emptyState,
  defaultTypeFilter = 'all',
  defaultActorFilter = 'all',
  defaultQuery = '',
  telemetrySurface = 'unknown-surface',
  onTelemetry,
  labels,
}: AuditTimelineProps) => {
  const resolvedLabels = useMemo(
    () => ({
      ...defaultLabels,
      ...labels,
      eventTypeLabels: {
        ...defaultEventTypeLabels,
        ...(labels?.eventTypeLabels ?? {}),
      },
    }),
    [labels]
  );

  const [typeFilter, setTypeFilter] = useState<AuditTimelineFilterType>(defaultTypeFilter);
  const [actorFilter, setActorFilter] = useState(defaultActorFilter);
  const [query, setQuery] = useState(defaultQuery);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const expandedIdsRef = useRef<string[]>([]);

  useEffect(() => {
    expandedIdsRef.current = expandedIds;
  }, [expandedIds]);

  const actorOptions = useMemo(() => {
    const uniqueActors = Array.from(new Set(entries.map((entry) => entry.actor)));
    uniqueActors.sort((left, right) => left.localeCompare(right));
    return uniqueActors;
  }, [entries]);

  const normalizedQuery = normalize(query);
  const filteredEntries = useMemo(
    () => filterEntries(entries, typeFilter, actorFilter, normalizedQuery),
    [entries, typeFilter, actorFilter, normalizedQuery]
  );

  const emitTelemetry = (
    event: AuditTimelineTelemetryEventName,
    action: AuditTimelineTelemetryAction,
    nextTypeFilter: AuditTimelineFilterType,
    nextActorFilter: string,
    nextQuery: string,
    visibleCount: number,
    entryId?: string
  ) => {
    if (!onTelemetry) {
      return;
    }

    onTelemetry({
      event,
      action,
      context: {
        surface: telemetrySurface,
        component: 'audit_timeline',
        typeFilter: nextTypeFilter,
        actorFilterState: toActorFilterState(nextActorFilter),
        hasQuery: nextQuery.length > 0,
        queryLength: nextQuery.length,
        visibleCount,
        entryId,
      },
      result: 'success',
      occurredAt: new Date().toISOString(),
    });
  };

  const emitFilterTelemetry = (
    nextTypeFilter: AuditTimelineFilterType,
    nextActorFilter: string,
    nextQuery: string
  ) => {
    const visibleCount = filterEntries(entries, nextTypeFilter, nextActorFilter, nextQuery).length;
    emitTelemetry(
      'ds.audit_timeline.filter.change',
      'filter_change',
      nextTypeFilter,
      nextActorFilter,
      nextQuery,
      visibleCount
    );
  };

  const onTypeFilterChange = (nextTypeFilter: AuditTimelineFilterType) => {
    setTypeFilter(nextTypeFilter);
    emitFilterTelemetry(nextTypeFilter, actorFilter, normalizedQuery);
  };

  const onActorFilterChange = (nextActorFilter: string) => {
    setActorFilter(nextActorFilter);
    emitFilterTelemetry(typeFilter, nextActorFilter, normalizedQuery);
  };

  const onQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    const nextNormalizedQuery = normalize(nextQuery);
    emitFilterTelemetry(typeFilter, actorFilter, nextNormalizedQuery);
  };

  const onToggleDiff = (entryId: string) => {
    const previousExpandedIds = expandedIdsRef.current;
    const wasExpanded = previousExpandedIds.includes(entryId);
    const nextExpandedIds = wasExpanded
      ? previousExpandedIds.filter((id) => id !== entryId)
      : [...previousExpandedIds, entryId];

    expandedIdsRef.current = nextExpandedIds;
    setExpandedIds(nextExpandedIds);

    emitTelemetry(
      wasExpanded ? 'ds.audit_timeline.entry.collapse' : 'ds.audit_timeline.entry.expand',
      wasExpanded ? 'entry_collapse' : 'entry_expand',
      typeFilter,
      actorFilter,
      normalizedQuery,
      filteredEntries.length,
      entryId
    );
  };

  if (entries.length === 0 && emptyState) {
    return <div className="itdo-audit-timeline__empty">{emptyState}</div>;
  }

  return (
    <section className={clsx('itdo-audit-timeline', className)}>
      <div className="itdo-audit-timeline__filters">
        <label className="itdo-audit-timeline__filter">
          <span>{resolvedLabels.typeFilter}</span>
          <select
            aria-label={resolvedLabels.typeFilter}
            value={typeFilter}
            onChange={(event) => onTypeFilterChange(event.target.value as AuditTimelineFilterType)}
          >
            <option value="all">{resolvedLabels.allTypes}</option>
            <option value="created">{resolvedLabels.eventTypeLabels.created}</option>
            <option value="updated">{resolvedLabels.eventTypeLabels.updated}</option>
            <option value="approved">{resolvedLabels.eventTypeLabels.approved}</option>
            <option value="returned">{resolvedLabels.eventTypeLabels.returned}</option>
          </select>
        </label>

        <label className="itdo-audit-timeline__filter">
          <span>{resolvedLabels.actorFilter}</span>
          <select
            aria-label={resolvedLabels.actorFilter}
            value={actorFilter}
            onChange={(event) => onActorFilterChange(event.target.value)}
          >
            <option value="all">{resolvedLabels.allActors}</option>
            {actorOptions.map((actor) => (
              <option key={actor} value={actor}>
                {actor}
              </option>
            ))}
          </select>
        </label>

        <label className="itdo-audit-timeline__filter itdo-audit-timeline__filter--search">
          <span>{resolvedLabels.search}</span>
          <input
            aria-label={resolvedLabels.search}
            type="search"
            value={query}
            placeholder={resolvedLabels.searchPlaceholder}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
      </div>

      {filteredEntries.length === 0 ? (
        <EmptyState
          title={resolvedLabels.noResultsTitle}
          description={resolvedLabels.noResultsDescription}
        />
      ) : (
        <ol className="itdo-audit-timeline__list">
          {filteredEntries.map((entry) => {
            const entryHasDiff = hasDiff(entry);
            const isExpanded = expandedIds.includes(entry.id);

            return (
              <li key={entry.id} className="itdo-audit-timeline__item" data-event-type={entry.type}>
                <span className={clsx('itdo-audit-timeline__dot', `itdo-audit-timeline__dot--${entry.type}`)} aria-hidden="true" />
                <div className="itdo-audit-timeline__content">
                  <header className="itdo-audit-timeline__header">
                    <div className="itdo-audit-timeline__heading">
                      <span className="itdo-audit-timeline__title">{entry.title}</span>
                      <span className={clsx('itdo-audit-timeline__badge', `itdo-audit-timeline__badge--${entry.type}`)}>
                        {resolvedLabels.eventTypeLabels[entry.type]}
                      </span>
                    </div>
                    <span className="itdo-audit-timeline__time">{entry.occurredAt}</span>
                  </header>

                  <p className="itdo-audit-timeline__meta">
                    <span>{entry.actor}</span>
                  </p>

                  {entry.description && <p className="itdo-audit-timeline__description">{entry.description}</p>}

                  {entryHasDiff && (
                    <div className="itdo-audit-timeline__diff">
                      <Button
                        type="button"
                        size="small"
                        variant="ghost"
                        onClick={() => onToggleDiff(entry.id)}
                      >
                        {isExpanded ? resolvedLabels.hideDiffLabel : resolvedLabels.showDiffLabel}
                      </Button>

                      {isExpanded && (
                        <div className="itdo-audit-timeline__diff-panel" data-testid={`audit-diff-${entry.id}`}>
                          <div className="itdo-audit-timeline__diff-title">{resolvedLabels.diffLabel}</div>
                          <ul className="itdo-audit-timeline__changes">
                            {entry.changes?.map((change, index) => (
                              <li
                                key={`${entry.id}-${change.field}-${index}`}
                                className="itdo-audit-timeline__change-item"
                              >
                                <span className="itdo-audit-timeline__field">{change.field}</span>
                                <span className="itdo-audit-timeline__value itdo-audit-timeline__value--before">
                                  <strong>{resolvedLabels.beforeLabel}:</strong> {change.before ?? '-'}
                                </span>
                                <span className="itdo-audit-timeline__value itdo-audit-timeline__value--after">
                                  <strong>{resolvedLabels.afterLabel}:</strong> {change.after ?? '-'}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {entry.metadata && <div className="itdo-audit-timeline__metadata">{entry.metadata}</div>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};
