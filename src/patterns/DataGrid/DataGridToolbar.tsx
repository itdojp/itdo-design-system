import React from 'react';
import clsx from 'clsx';
import { DataGridToolbarProps } from './DataGrid.types';
import './DataGrid.css';

export const DataGridToolbar: React.FC<DataGridToolbarProps> = ({
  children,
  actions,
  className,
}) => {
  return (
    <div className={clsx('itdo-datagrid-toolbar', className)}>
      <div className="itdo-datagrid-toolbar__fields">{children}</div>
      {actions && <div className="itdo-datagrid-toolbar__actions">{actions}</div>}
    </div>
  );
};
