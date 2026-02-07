import type { ReactNode } from 'react';
import type { DataTableRow, DataTableSortDirection } from './CrudList.types';

const toSortValue = (value: ReactNode) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return String(value ?? '');
};

export const sortRows = (
  rows: DataTableRow[],
  key: string | null,
  direction: DataTableSortDirection
) => {
  if (!key) {
    return rows;
  }

  const cloned = [...rows];
  cloned.sort((a, b) => {
    const aValue = toSortValue(a[key]);
    const bValue = toSortValue(b[key]);

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue, undefined, {
        sensitivity: 'base',
        numeric: true,
      });
      return direction === 'asc' ? result : result * -1;
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  return cloned;
};
