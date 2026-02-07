import React from 'react';
import clsx from 'clsx';
import { Button } from '../Button';
import { EmptyStateProps } from './EmptyState.types';
import './EmptyState.css';

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  primaryAction,
  secondaryAction,
  ghostAction,
  icon,
  className,
}) => {
  const structuredActions = [
    primaryAction && { ...primaryAction, tone: 'primary' as const },
    secondaryAction && { ...secondaryAction, tone: 'secondary' as const },
    ghostAction && { ...ghostAction, tone: 'ghost' as const },
  ].filter((value): value is NonNullable<typeof value> => Boolean(value));

  return (
    <div className={clsx('itdo-empty-state', className)}>
      {icon && <div className="itdo-empty-state__icon">{icon}</div>}
      <div className="itdo-empty-state__content">
        <h3 className="itdo-empty-state__title">{title}</h3>
        {description && <p className="itdo-empty-state__description">{description}</p>}
        {structuredActions.length > 0 ? (
          <div className="itdo-empty-state__actions">
            {structuredActions.map((item) => (
              <Button
                key={`${item.tone}-${item.label}`}
                size="small"
                variant={item.tone}
                onClick={item.onClick}
              >
                {item.label}
              </Button>
            ))}
          </div>
        ) : (
          action && <div className="itdo-empty-state__action">{action}</div>
        )}
      </div>
    </div>
  );
};
