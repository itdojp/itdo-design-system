import React from 'react';
import clsx from 'clsx';
import { Spinner } from '../../components/Spinner';
import { DataGridLoadingStateProps } from './DataGrid.types';
import './DataGrid.css';

export const DataGridLoadingState: React.FC<DataGridLoadingStateProps> = ({
  label = 'Loading...',
  className,
}) => {
  return (
    <div className={clsx('itdo-datagrid-state', className)}>
      <div className="itdo-datagrid-state__loading">
        <Spinner size="small" label={label} />
        <span className="itdo-datagrid-state__text">{label}</span>
      </div>
    </div>
  );
};
