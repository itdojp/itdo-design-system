import React from 'react';
import clsx from 'clsx';
import { CrudListProps } from './CrudList.types';
import './CrudList.css';

export const CrudList: React.FC<CrudListProps> = ({
  title,
  description,
  filters,
  actions,
  table,
  emptyState,
  pagination,
  isEmpty = false,
  className,
}) => {
  return (
    <section className={clsx('itdo-crud-list', className)}>
      {(title || description || actions) && (
        <div className="itdo-crud-list__header">
          <div>
            {title && <h2 className="itdo-crud-list__title">{title}</h2>}
            {description && <p className="itdo-crud-list__description">{description}</p>}
          </div>
          {actions && <div className="itdo-crud-list__actions">{actions}</div>}
        </div>
      )}
      {filters && <div className="itdo-crud-list__filters">{filters}</div>}
      <div className="itdo-crud-list__body">{isEmpty ? emptyState : table}</div>
      {pagination && <div className="itdo-crud-list__pagination">{pagination}</div>}
    </section>
  );
};
