import React from 'react';
import clsx from 'clsx';
import { DataTableProps } from './CrudList.types';
import './CrudList.css';

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  caption,
  emptyState,
  className,
}) => {
  if (rows.length === 0 && emptyState) {
    return <div className="itdo-data-table__empty">{emptyState}</div>;
  }

  return (
    <div className={clsx('itdo-data-table', className)}>
      <table>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ textAlign: column.align ?? 'left', width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`} style={{ textAlign: column.align ?? 'left' }}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
