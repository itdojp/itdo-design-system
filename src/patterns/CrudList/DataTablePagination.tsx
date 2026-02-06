import clsx from 'clsx';
import { DataTablePaginationProps } from './CrudList.types';
import './CrudList.css';

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  className,
}) => {
  return (
    <nav className={clsx('itdo-data-table-pagination', className)} aria-label="Data table pagination">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Prev
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </nav>
  );
};
