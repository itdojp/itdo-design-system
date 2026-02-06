import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Spinner } from '../../components/Spinner';
import { DataTableColumn, DataTableProps, DataTableRow, DataTableSortDirection } from './CrudList.types';
import './CrudList.css';

const toSortValue = (value: React.ReactNode) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return String(value ?? '');
};

const sortRows = (
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

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  caption,
  emptyState,
  className,
  loading = false,
  loadingLabel = 'Loading rows...',
  selectable = 'none',
  rowActions,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  initialSort,
  onSelectionChange,
  radioGroupName,
  labels,
}) => {
  const tableId = useId();
  const [sortKey, setSortKey] = useState<string | null>(initialSort?.key ?? null);
  const [sortDirection, setSortDirection] = useState<DataTableSortDirection>(initialSort?.direction ?? 'asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);
  const selectionGroupName = radioGroupName ?? `itdo-data-table-selection-${tableId}`;

  const resolvedLabels = {
    noRecords: labels?.noRecords ?? 'No records found.',
    rowsPerPage: labels?.rowsPerPage ?? 'Rows',
    prevPage: labels?.prevPage ?? 'Prev',
    nextPage: labels?.nextPage ?? 'Next',
    page: labels?.page ?? ((page: number, total: number) => `Page ${page} / ${total}`),
  };

  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);

  const sortedRows = useMemo(() => sortRows(rows, sortKey, sortDirection), [rows, sortKey, sortDirection]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedRows.length / currentPageSize)),
    [sortedRows.length, currentPageSize]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const nextSelected = selectedIds.filter((selectedId) =>
      rows.some((row) => row.id === selectedId)
    );
    if (nextSelected.length !== selectedIds.length) {
      setSelectedIds(nextSelected);
      onSelectionChange?.(nextSelected);
    }
  }, [onSelectionChange, rows, selectedIds]);

  const pagedRows = useMemo(() => {
    const offset = (currentPage - 1) * currentPageSize;
    return sortedRows.slice(offset, offset + currentPageSize);
  }, [sortedRows, currentPage, currentPageSize]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, pagedRows.length);
  }, [pagedRows.length]);

  const updateSelection = (nextSelection: string[]) => {
    setSelectedIds(nextSelection);
    onSelectionChange?.(nextSelection);
  };

  const toggleSelection = (rowId: string) => {
    if (selectable === 'none') {
      return;
    }

    if (selectable === 'single') {
      updateSelection(selectedIds[0] === rowId ? [] : [rowId]);
      return;
    }

    const alreadySelected = selectedIds.includes(rowId);
    if (alreadySelected) {
      updateSelection(selectedIds.filter((selectedId) => selectedId !== rowId));
      return;
    }
    updateSelection([...selectedIds, rowId]);
  };

  const handleSort = (column: DataTableColumn) => {
    if (!column.sortable) {
      return;
    }

    if (sortKey === column.key) {
      setSortDirection((previous) => (previous === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(column.key);
    setSortDirection('asc');
  };

  if (loading) {
    return (
      <div className={clsx('itdo-data-table__state', className)} role="status" aria-live="polite">
        <Spinner size="small" label={loadingLabel} />
        <span>{loadingLabel}</span>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className={clsx('itdo-data-table__state', className)}>
        {emptyState ?? <span>{resolvedLabels.noRecords}</span>}
      </div>
    );
  }

  return (
    <div className={clsx('itdo-data-table', className)}>
      <table role="grid" aria-rowcount={sortedRows.length + 1}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {selectable !== 'none' && (
              <th className="itdo-data-table__selection-header">
                <span className="itdo-data-table__sr-only">Select rows</span>
              </th>
            )}
            {columns.map((column) => {
              const isActiveSort = sortKey === column.key;
              const ariaSort = isActiveSort
                ? sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none';

              return (
                <th
                  key={column.key}
                  style={{ textAlign: column.align ?? 'left', width: column.width }}
                  aria-sort={ariaSort}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="itdo-data-table__sort-trigger"
                      onClick={() => handleSort(column)}
                      aria-label={
                        typeof column.header === 'string'
                          ? `Sort by ${column.header}, current: ${ariaSort}`
                          : `Sort column, current: ${ariaSort}`
                      }
                    >
                      <span>{column.header}</span>
                      <span aria-hidden="true">
                        {isActiveSort ? (sortDirection === 'asc' ? 'ASC' : 'DESC') : 'SORT'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
            {rowActions && rowActions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((row, rowIndex) => {
            const selected = selectedIds.includes(row.id);
            return (
              <tr
                key={row.id}
                className={clsx({ 'is-selected': selected })}
                tabIndex={rowIndex === 0 ? 0 : -1}
                ref={(node) => {
                  rowRefs.current[rowIndex] = node;
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    rowRefs.current[Math.min(rowIndex + 1, pagedRows.length - 1)]?.focus();
                    return;
                  }

                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    rowRefs.current[Math.max(rowIndex - 1, 0)]?.focus();
                    return;
                  }

                  if (event.key === ' ' && selectable !== 'none') {
                    event.preventDefault();
                    toggleSelection(row.id);
                    return;
                  }

                  if (event.key === 'Enter' && rowActions && rowActions.length > 0) {
                    event.preventDefault();
                    rowActions[0].onSelect(row);
                    return;
                  }

                  if (event.key === 'Enter' && selectable !== 'none') {
                    event.preventDefault();
                    toggleSelection(row.id);
                  }
                }}
              >
                {selectable !== 'none' && (
                  <td className="itdo-data-table__selection-cell">
                    {selectable === 'single' ? (
                      <input
                        type="radio"
                        name={selectionGroupName}
                        checked={selected}
                        onChange={() => toggleSelection(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelection(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    )}
                  </td>
                )}
                {columns.map((column) => (
                  <td key={`${row.id}-${column.key}`} style={{ textAlign: column.align ?? 'left' }}>
                    {column.cell ? column.cell(row) : row[column.key]}
                  </td>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <td>
                    <div className="itdo-data-table__row-actions">
                      {rowActions.map((action) => (
                        <button
                          type="button"
                          key={action.key}
                          className="itdo-data-table__row-action"
                          onClick={() => action.onSelect(row)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {(totalPages > 1 || pageSizeOptions.length > 1) && (
        <div className="itdo-data-table__pagination" aria-label="Table pagination">
          <div className="itdo-data-table__page-size">
            <label>
              {resolvedLabels.rowsPerPage}
              <select
                value={currentPageSize}
                onChange={(event) => {
                  const nextPageSize = Number(event.target.value);
                  setCurrentPageSize(nextPageSize);
                  setCurrentPage(1);
                }}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="itdo-data-table__page-controls">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage <= 1}
            >
              {resolvedLabels.prevPage}
            </button>
            <span>{resolvedLabels.page(currentPage, totalPages)}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage >= totalPages}
            >
              {resolvedLabels.nextPage}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
