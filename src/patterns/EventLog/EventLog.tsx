import React from 'react';
import clsx from 'clsx';
import { EventLogProps } from './EventLog.types';
import './EventLog.css';

export const EventLog: React.FC<EventLogProps> = ({ items, emptyState, className }) => {
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
              <span className="itdo-event-log__title">{item.title}</span>
              <span className="itdo-event-log__timestamp">{item.timestamp}</span>
            </div>
            {item.description && (
              <p className="itdo-event-log__description">{item.description}</p>
            )}
            {item.meta && <div className="itdo-event-log__meta">{item.meta}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
};
