import React from 'react';
import clsx from 'clsx';
import { DataGridSurfaceProps } from './DataGrid.types';
import './DataGrid.css';

export const DataGridSurface: React.FC<DataGridSurfaceProps> = ({ children, className }) => {
  return <div className={clsx('itdo-datagrid', className)}>{children}</div>;
};
