import React from 'react';
import clsx from 'clsx';
import { EventLogProps } from './EventLog.types';
import './EventLog.css';

const defaultLabels = {
  adminOverride: 'Admin override',
  changes: 'Changes',
};

export const EventLog: React.FC<EventLogProps> = ({
  items,
  emptyState,
  className,
  labels,
}) => {
  const resolvedLabels = { ...defaultLabels, ...labels };
  if (items.length === 0 && emptyState) {
    return <div className="itdo-event-log__empty">{emptyState}</div>;
  }

  return (
    <ul className={clsx('itdo-event-log', className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className={clsx('itdo-event-log__item',
            item.status ? `itdo-event-log__item--${item.status}` : undefined
          )}
        >
          <span className="itdo-event-log__indicator" aria-hidden="true" />
          <div className="itdo-event-log__content">
            <div className="itdo-event-log__header">
              <div className="itdo-event-log__title">
                <span>{item.title}</span>
                {item.adminOverride && (
                  <span className="itdo-event-log__badge">{resolvedLabels.adminOverride}</span>
                )}
              </div>
              <span className="itdo-event-log__timestamp">{item.timestamp}</span>
            </div>
            {item.description && (
              <p className="itdo-event-log__description">{item.description}</p>
            )}
            {item.changes && item.changes.length > 0 && (
              <div className="itdo-event-log__changes">
                <div className="itdo-event-log__changes-title">{resolvedLabels.changes}</div>
                <ul className="itdo-event-log__changes-list">
                  {item.changes.map((change) => {
                    const hasBefore = Boolean(change.before);
                    const hasAfter = Boolean(change.after);
                    if (!hasBefore && !hasAfter) return null;

                    return (
                      <li key={change.field} className="itdo-event-log__change-item">
                        <span className="itdo-event-log__change-field">{change.field}</span>
                        <span className="itdo-event-log__change-values">
                          {hasBefore && (
                            <span className="itdo-event-log__change-before">{change.before}</span>
                          )}
                          {hasBefore && hasAfter && (
                            <span className="itdo-event-log__change-separator">→</span>
                          )}
                          {hasAfter && (
                            <span className="itdo-event-log__change-after">{change.after}</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {item.meta && <div className="itdo-event-log__meta">{item.meta}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
};
