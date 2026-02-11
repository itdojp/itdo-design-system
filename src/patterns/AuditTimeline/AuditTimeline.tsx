import clsx from 'clsx';
import type { AuditEvent, AuditTimelineProps } from './AuditTimeline.types';
import './AuditTimeline.css';

const toDateKey = (time: string) => {
  const parsed = new Date(time);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return time.slice(0, 10);
};

const toDisplayTime = (time: string) => {
  const parsed = new Date(time);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString();
  }
  return time;
};

const groupEvents = (events: AuditEvent[]) => {
  const map = new Map<string, AuditEvent[]>();
  events.forEach((event) => {
    const key = toDateKey(event.time);
    const current = map.get(key) ?? [];
    current.push(event);
    map.set(key, current);
  });
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
};

export const AuditTimeline = ({
  events,
  onSelectEvent,
  selectedEventId,
  compact = false,
  groupByDate = true,
  className,
  emptyState,
}: AuditTimelineProps) => {
  if (events.length === 0) {
    return (
      <section className={clsx('itdo-audit-timeline', className)}>
        {emptyState ?? <p className="itdo-audit-timeline__empty">No audit events.</p>}
      </section>
    );
  }

  const groups = groupByDate ? groupEvents(events) : [{ date: 'All events', items: events }];

  return (
    <section className={clsx('itdo-audit-timeline', { 'is-compact': compact }, className)}>
      {groups.map((group) => (
        <div key={group.date} className="itdo-audit-timeline__group">
          {groupByDate && <h3 className="itdo-audit-timeline__date">{group.date}</h3>}
          <ul className="itdo-audit-timeline__list">
            {group.items.map((event) => {
              const isSelected = selectedEventId === event.id;
              const content = (
                <>
                  <span className="itdo-audit-timeline__dot" aria-hidden="true" />
                  <div className="itdo-audit-timeline__content">
                    <header className="itdo-audit-timeline__header">
                      <span className="itdo-audit-timeline__action">
                        {event.action}
                        {event.target ? ` · ${event.target}` : ''}
                      </span>
                      <time className="itdo-audit-timeline__time">{toDisplayTime(event.time)}</time>
                    </header>
                    <p className="itdo-audit-timeline__actor">{event.actor}</p>
                    {event.summary && <p className="itdo-audit-timeline__summary">{event.summary}</p>}
                    {event.meta && <div className="itdo-audit-timeline__meta">{event.meta}</div>}
                  </div>
                </>
              );

              return (
                <li
                  key={event.id}
                  className={clsx(
                    'itdo-audit-timeline__item',
                    `itdo-audit-timeline__item--${event.tone ?? 'default'}`,
                    { 'is-selected': isSelected }
                  )}
                >
                  {onSelectEvent ? (
                    <button
                      type="button"
                      className="itdo-audit-timeline__item-button"
                      aria-pressed={isSelected}
                      onClick={() => onSelectEvent(event)}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className="itdo-audit-timeline__item-static">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
};
