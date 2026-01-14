import React from 'react';
import clsx from 'clsx';
import { EmptyStateProps } from './EmptyState.types';
import './EmptyState.css';

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className,
}) => {
  return (
    <div className={clsx('itdo-empty-state', className)}>
      {icon && <div className="itdo-empty-state__icon">{icon}</div>}
      <div className="itdo-empty-state__content">
        <h3 className="itdo-empty-state__title">{title}</h3>
        {description && <p className="itdo-empty-state__description">{description}</p>}
        {action && <div className="itdo-empty-state__action">{action}</div>}
      </div>
    </div>
  );
};
