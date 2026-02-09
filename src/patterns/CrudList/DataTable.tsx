import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Spinner } from '../../components/Spinner';
import { BulkActionBar, createDataTableBulkActionBarProps } from '../BulkActionBar';
import { DataTableColumn, DataTableProps, DataTableSortDirection } from './CrudList.types';
import { sortRows } from './DataTable.utils';
import './CrudList.css';

const resolveNextVisibleKeys = (
  columns: DataTableColumn[],
  currentVisibleKeys: string[],
  key: string
) => {
  const isVisible = currentVisibleKeys.includes(key);
  if (isVisible && currentVisibleKeys.length === 1) {
    return currentVisibleKeys;
  }

  const nextSet = new Set(currentVisibleKeys);
  if (isVisible) {
    nextSet.delete(key);
  } else {
    nextSet.add(key);
  }

  const next = columns
    .map((column) => column.key)
    .filter((columnKey) => nextSet.has(columnKey));
  return next.length > 0 ? next : currentVisibleKeys;
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
  rowActionSlot,
  bulkActions,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
  enableColumnVisibilityControl = false,
  query,
  onQueryChange,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  initialSort,
  onSelectionChange,
  radioGroupName,
  labels,
}) => {
  const tableId = useId();
  const [sortKey, setSortKey] = useState<string | null>(query?.sort?.key ?? initialSort?.key ?? null);
  const [sortDirection, setSortDirection] = useState<DataTableSortDirection>(
    query?.sort?.direction ?? initialSort?.direction ?? 'asc'
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(query?.pagination?.page ?? 1);
  const [currentPageSize, setCurrentPageSize] = useState(query?.pagination?.pageSize ?? pageSize);
  const [internalVisibleColumnKeys, setInternalVisibleColumnKeys] = useState<string[]>(
    columns.map((column) => column.key)
  );
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const columnSettingsRef = useRef<HTMLDivElement | null>(null);
  const selectionGroupName = radioGroupName ?? `itdo-data-table-selection-${tableId}`;
  const columnSettingsMenuId = `itdo-data-table-column-settings-${tableId}`;

  const resolvedLabels = {
    noRecords: labels?.noRecords ?? 'No records found.',
    rowsPerPage: labels?.rowsPerPage ?? 'Rows',
    prevPage: labels?.prevPage ?? 'Prev',
    nextPage: labels?.nextPage ?? 'Next',
    page: labels?.page ?? ((page: number, total: number) => `Page ${page} / ${total}`),
    columnSettings: labels?.columnSettings ?? 'Columns',
    selectedRows: labels?.selectedRows ?? ((selectedRows: number) => `${selectedRows} rows selected`),
    clearSelection: labels?.clearSelection ?? 'Clear',
    selectAllRows: labels?.selectAllRows ?? 'Select all rows in page',
    deselectAllRows: labels?.deselectAllRows ?? 'Deselect all rows in page',
  };

  useEffect(() => {
    setCurrentPageSize(query?.pagination?.pageSize ?? pageSize);
  }, [pageSize, query?.pagination?.pageSize]);

  useEffect(() => {
    if (query?.pagination?.page !== undefined) {
      setCurrentPage(query.pagination.page);
    }
  }, [query?.pagination?.page]);

  useEffect(() => {
    if (query?.sort?.key !== undefined) {
      setSortKey(query.sort.key);
      if (query.sort.direction !== undefined) {
        setSortDirection(query.sort.direction);
      }
    }
  }, [query?.sort?.direction, query?.sort?.key]);

  useEffect(() => {
    setInternalVisibleColumnKeys((previous) => {
      const available = columns.map((column) => column.key);
      const next = previous.filter((columnKey) => available.includes(columnKey));
      for (const columnKey of available) {
        if (!next.includes(columnKey)) {
          next.push(columnKey);
        }
      }
      return next;
    });
  }, [columns]);

  useEffect(() => {
    if (!isColumnMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!columnSettingsRef.current) return;
      if (columnSettingsRef.current.contains(event.target as Node)) return;
      setIsColumnMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isColumnMenuOpen]);

  const alwaysVisibleColumnKeys = useMemo(
    () => columns.filter((column) => column.hideable === false).map((column) => column.key),
    [columns]
  );

  const resolvedVisibleColumnKeys = useMemo(() => {
    const requestedKeys = visibleColumnKeys ?? internalVisibleColumnKeys;
    const requestedSet = new Set(requestedKeys);
    for (const columnKey of alwaysVisibleColumnKeys) {
      requestedSet.add(columnKey);
    }
    return columns.map((column) => column.key).filter((columnKey) => requestedSet.has(columnKey));
  }, [alwaysVisibleColumnKeys, columns, internalVisibleColumnKeys, visibleColumnKeys]);

  const visibleColumns = useMemo(
    () => columns.filter((column) => resolvedVisibleColumnKeys.includes(column.key)),
    [columns, resolvedVisibleColumnKeys]
  );

  const hideableColumns = useMemo(
    () => columns.filter((column) => column.hideable !== false),
    [columns]
  );

  const canControlColumns = enableColumnVisibilityControl && hideableColumns.length > 1;

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

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

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

  const pagedRowIds = useMemo(() => pagedRows.map((row) => row.id), [pagedRows]);

  const allCurrentPageSelected =
    pagedRowIds.length > 0 && pagedRowIds.every((rowId) => selectedIdSet.has(rowId));
  const someCurrentPageSelected = pagedRowIds.some((rowId) => selectedIdSet.has(rowId));

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = !allCurrentPageSelected && someCurrentPageSelected;
  }, [allCurrentPageSelected, someCurrentPageSelected]);

  const selectedRows = useMemo(
    () => rows.filter((row) => selectedIdSet.has(row.id)),
    [rows, selectedIdSet]
  );

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, pagedRows.length);
  }, [pagedRows.length]);

  useEffect(() => {
    onQueryChange?.({
      search: query?.search,
      filters: query?.filters,
      sort: sortKey ? { key: sortKey, direction: sortDirection } : undefined,
      pagination: {
        page: currentPage,
        pageSize: currentPageSize,
        totalItems: sortedRows.length,
      },
    });
  }, [
    currentPage,
    currentPageSize,
    onQueryChange,
    query?.filters,
    query?.search,
    sortDirection,
    sortKey,
    sortedRows.length,
  ]);

  const updateSelection = useCallback(
    (nextSelection: string[]) => {
      setSelectedIds(nextSelection);
      onSelectionChange?.(nextSelection);
    },
    [onSelectionChange]
  );

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

  const togglePageSelection = () => {
    if (selectable !== 'multiple') {
      return;
    }

    if (allCurrentPageSelected) {
      const removed = selectedIds.filter((selectedId) => !pagedRowIds.includes(selectedId));
      updateSelection(removed);
      return;
    }

    const nextSet = new Set(selectedIds);
    for (const rowId of pagedRowIds) {
      nextSet.add(rowId);
    }
    updateSelection(Array.from(nextSet));
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

  const handleColumnVisibilityToggle = (columnKey: string) => {
    const next = resolveNextVisibleKeys(columns, resolvedVisibleColumnKeys, columnKey);

    if (!visibleColumnKeys) {
      setInternalVisibleColumnKeys(next);
    }
    onVisibleColumnKeysChange?.(next);
  };

  const hasRowActions = (rowActions?.length ?? 0) > 0 || !!rowActionSlot;
  const hasBulkActions = selectable === 'multiple' && (bulkActions?.length ?? 0) > 0;
  const bulkActionBarProps = useMemo(
    () =>
      createDataTableBulkActionBarProps({
        selectedRows,
        bulkActions,
        selectedRowsLabel: resolvedLabels.selectedRows,
        clearSelectionLabel: resolvedLabels.clearSelection,
        onClearSelection: () => updateSelection([]),
      }),
    [bulkActions, resolvedLabels.clearSelection, resolvedLabels.selectedRows, selectedRows, updateSelection]
  );
  const leftPinnedColumnKey = useMemo(
    () => visibleColumns.find((column) => column.pinned === 'left')?.key,
    [visibleColumns]
  );
  const rightPinnedColumnKey = useMemo(
    () => visibleColumns.find((column) => column.pinned === 'right')?.key,
    [visibleColumns]
  );
  const shouldPinActionsColumn = hasRowActions && rightPinnedColumnKey === undefined;

  const getPinnedCellClassName = (column: DataTableColumn) => {
    if (column.pinned === 'left' && column.key === leftPinnedColumnKey) {
      return 'itdo-data-table__cell--pinned-left';
    }
    if (column.pinned === 'right' && column.key === rightPinnedColumnKey) {
      return 'itdo-data-table__cell--pinned-right';
    }
    return undefined;
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
      {canControlColumns && (
        <div className="itdo-data-table__header">
          <div className="itdo-data-table__column-settings" ref={columnSettingsRef}>
            <button
              type="button"
              className="itdo-data-table__column-settings-trigger"
              onClick={() => setIsColumnMenuOpen((previous) => !previous)}
              aria-expanded={isColumnMenuOpen}
              aria-controls={isColumnMenuOpen ? columnSettingsMenuId : undefined}
            >
              {resolvedLabels.columnSettings}
            </button>
            {isColumnMenuOpen && (
              <div className="itdo-data-table__column-settings-menu" id={columnSettingsMenuId}>
                {hideableColumns.map((column) => (
                  <label key={column.key} className="itdo-data-table__column-settings-item">
                    <input
                      type="checkbox"
                      checked={resolvedVisibleColumnKeys.includes(column.key)}
                      onChange={() => handleColumnVisibilityToggle(column.key)}
                    />
                    <span>{column.header}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hasBulkActions && selectedRows.length > 0 && (
        <BulkActionBar
          {...bulkActionBarProps}
          className="itdo-data-table__bulk-bar"
        />
      )}

      <table role="grid" aria-rowcount={sortedRows.length + 1}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {selectable !== 'none' && (
              <th className="itdo-data-table__selection-header">
                {selectable === 'multiple' ? (
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={togglePageSelection}
                    aria-label={allCurrentPageSelected ? resolvedLabels.deselectAllRows : resolvedLabels.selectAllRows}
                  />
                ) : (
                  <span className="itdo-data-table__sr-only">Select rows</span>
                )}
              </th>
            )}
            {visibleColumns.map((column) => {
              const isActiveSort = sortKey === column.key;
              const ariaSort = isActiveSort
                ? sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none';
              const pinnedClassName = getPinnedCellClassName(column);

              return (
                <th
                  key={column.key}
                  className={pinnedClassName}
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
            {hasRowActions && (
              <th className={clsx({ 'itdo-data-table__cell--pinned-right': shouldPinActionsColumn })}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((row, rowIndex) => {
            const selected = selectedIdSet.has(row.id);
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
                {visibleColumns.map((column) => (
                  <td
                    key={`${row.id}-${column.key}`}
                    className={getPinnedCellClassName(column)}
                    style={{ textAlign: column.align ?? 'left' }}
                  >
                    {column.cell ? column.cell(row) : row[column.key]}
                  </td>
                ))}
                {hasRowActions && (
                  <td className={clsx({ 'itdo-data-table__cell--pinned-right': shouldPinActionsColumn })}>
                    {rowActionSlot ? (
                      rowActionSlot(row)
                    ) : (
                      <div className="itdo-data-table__row-actions">
                        {rowActions?.map((action) => (
                          <button
                            type="button"
                            key={action.key}
                            className="itdo-data-table__row-action"
                            onClick={() => action.onSelect(row)}
                            disabled={action.disabled}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
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
