import React from 'react';
import clsx from 'clsx';
import { EmptyState } from '../../components/EmptyState';
import { DataGridEmptyStateProps } from './DataGrid.types';
import './DataGrid.css';

export const DataGridEmptyState: React.FC<DataGridEmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className,
}) => {
  const resolvedTitle = title ?? 'No data';

  return (
    <div className={clsx('itdo-datagrid-state', className)}>
      <EmptyState
        title={resolvedTitle}
        description={description}
        action={action}
        icon={icon}
      />
    </div>
  );
};
