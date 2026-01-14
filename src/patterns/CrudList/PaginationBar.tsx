import React from 'react';
import clsx from 'clsx';
import { PaginationBarProps } from './CrudList.types';
import './CrudList.css';

export const PaginationBar: React.FC<PaginationBarProps> = ({ children, className }) => {
  return (
    <nav className={clsx('itdo-pagination-bar', className)} aria-label="Pagination">
      {children}
    </nav>
  );
};
