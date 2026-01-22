import React from 'react';
import clsx from 'clsx';
import { EmptyState } from '../../components/EmptyState';
import { DataGridEmptyStateProps } from './DataGrid.types';
import './DataGrid.css';

export const DataGridEmptyState: React.FC<DataGridEmptyStateProps> = ({
  title = 'No data',
  description,
  action,
  icon,
  className,
}) => {
  return (
    <div className={clsx('itdo-datagrid-state', className)}>
      <EmptyState title={title} description={description} action={action} icon={icon} />
    </div>
  );
};
