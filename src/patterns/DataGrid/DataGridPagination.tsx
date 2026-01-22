import React from 'react';
import clsx from 'clsx';
import { DataGridPaginationProps } from './DataGrid.types';
import './DataGrid.css';

export const DataGridPagination: React.FC<DataGridPaginationProps> = ({
  children,
  className,
}) => {
  return (
    <nav className={clsx('itdo-datagrid-pagination', className)} aria-label="Pagination">
      {children}
    </nav>
  );
};
