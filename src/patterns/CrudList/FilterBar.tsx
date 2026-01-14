import React from 'react';
import clsx from 'clsx';
import { FilterBarProps } from './CrudList.types';
import './CrudList.css';

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  actions,
  className,
}) => {
  return (
    <div className={clsx('itdo-filter-bar', className)}>
      <div className="itdo-filter-bar__fields">{children}</div>
      {actions && <div className="itdo-filter-bar__actions">{actions}</div>}
    </div>
  );
};
