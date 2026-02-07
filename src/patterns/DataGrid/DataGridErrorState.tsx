import React from 'react';
import clsx from 'clsx';
import { Alert } from '../../components/Alert';
import { DataGridErrorStateProps } from './DataGrid.types';
import './DataGrid.css';

export const DataGridErrorState: React.FC<DataGridErrorStateProps> = ({
  title = 'Failed to load',
  description = 'Please refresh or try again later.',
  action,
  className,
}) => {
  return (
    <div className={clsx('itdo-datagrid-state', className)}>
      <Alert variant="error" title={title}>
        <div className="itdo-datagrid-state__error">
          <span>{description}</span>
          {action && <div className="itdo-datagrid-state__error-action">{action}</div>}
        </div>
      </Alert>
    </div>
  );
};
