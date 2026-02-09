import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import type {
  EditableDataGridColumnContract,
  EditableGridEditorType,
  EditableGridRowRecord,
  EditableGridSavePayload,
} from '../../types';
import type { EditableDataGridProps } from './EditableDataGrid.types';
import './DataGrid.css';

type RowValidationErrors = Record<string, string>;

const getEditorType = <TRow extends EditableGridRowRecord>(
  column: EditableDataGridColumnContract<TRow>
): EditableGridEditorType =>
  column.editor?.type ?? 'text';

const toInputValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

const toEditorValue = (editorType: EditableGridEditorType, rawValue: string): unknown => {
  if (editorType !== 'number') {
    return rawValue;
  }

  if (rawValue.trim().length === 0) {
    return null;
  }

  const parsed = Number(rawValue);
  return Number.isNaN(parsed) ? rawValue : parsed;
};

const getHeaderText = <TRow extends EditableGridRowRecord>(
  column: EditableDataGridColumnContract<TRow>
): string =>
  typeof column.header === 'string' ? column.header : column.key;

const resolveCellContent = <TRow extends EditableGridRowRecord>(
  column: EditableDataGridColumnContract<TRow>,
  row: TRow
) => {
  const value = row[column.key];
  if (column.formatter) {
    return column.formatter(value, row);
  }
  return toInputValue(value);
};

const validateDraftRow = <TRow extends EditableGridRowRecord>(
  columns: EditableDataGridColumnContract<TRow>[],
  row: TRow
): RowValidationErrors => {
  const errors: RowValidationErrors = {};

  for (const column of columns) {
    if (column.editable === false || !column.validator) {
      continue;
    }

    const message = column.validator(row[column.key], { row, columnKey: column.key });
    if (message) {
      errors[column.key] = message;
    }
  }

  return errors;
};

const removeMapEntry = <T extends Record<string, unknown>>(source: T, key: string): T => {
  if (!(key in source)) {
    return source;
  }
  const next = { ...source };
  delete next[key];
  return next;
};

export const EditableDataGrid = <TRow extends EditableGridRowRecord = EditableGridRowRecord>({
  columns,
  rows,
  caption,
  className,
  emptyState,
  loading = false,
  loadingLabel = 'Loading rows...',
  onSaveRow,
  onCancelRow,
  labels,
}: EditableDataGridProps<TRow>) => {
  const [localRows, setLocalRows] = useState(rows);
  const [draftRows, setDraftRows] = useState<Record<string, TRow>>({});
  const [rowErrors, setRowErrors] = useState<Record<string, RowValidationErrors>>({});
  const [savingRowIds, setSavingRowIds] = useState<string[]>([]);
  const [saveFailures, setSaveFailures] = useState<Record<string, string>>({});

  const resolvedLabels = {
    noRows: labels?.noRows ?? 'No records found.',
    editRow: labels?.editRow ?? 'Edit',
    saveRow: labels?.saveRow ?? 'Save',
    cancelRow: labels?.cancelRow ?? 'Cancel',
    actionsHeader: labels?.actionsHeader ?? 'Actions',
    selectPlaceholder: labels?.selectPlaceholder ?? 'Select...',
    unsavedState: labels?.unsavedState ?? 'Unsaved changes',
    validationSummaryTitle:
      labels?.validationSummaryTitle ?? ((count: number) => `${count} validation error(s)`),
    saveErrorPrefix: labels?.saveErrorPrefix ?? 'Save failed',
  };

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const editableColumns = useMemo(
    () => columns.filter((column) => column.editable !== false),
    [columns]
  );

  const canEditRows = editableColumns.length > 0 && typeof onSaveRow === 'function';

  const updateDraftCell = (rowId: string, column: EditableDataGridColumnContract<TRow>, rawValue: string) => {
    const editorType = getEditorType(column);
    const nextValue = toEditorValue(editorType, rawValue);

    setDraftRows((previous) => {
      const currentDraft = previous[rowId];
      if (!currentDraft) {
        return previous;
      }
      return {
        ...previous,
        [rowId]: {
          ...currentDraft,
          [column.key]: nextValue,
        },
      };
    });

    setRowErrors((previous) => {
      const rowLevel = previous[rowId];
      if (!rowLevel || !(column.key in rowLevel)) {
        return previous;
      }
      const nextRowLevel = { ...rowLevel };
      delete nextRowLevel[column.key];
      return {
        ...previous,
        [rowId]: nextRowLevel,
      };
    });
  };

  const beginRowEdit = (row: TRow) => {
    setDraftRows((previous) => ({
      ...previous,
      [row.id]: { ...row },
    }));
    setRowErrors((previous) => removeMapEntry(previous, row.id));
    setSaveFailures((previous) => removeMapEntry(previous, row.id));
  };

  const cancelRowEdit = (row: TRow) => {
    setDraftRows((previous) => removeMapEntry(previous, row.id));
    setRowErrors((previous) => removeMapEntry(previous, row.id));
    setSaveFailures((previous) => removeMapEntry(previous, row.id));
    onCancelRow?.(row);
  };

  const getChangedKeys = (row: TRow, draftRow: TRow): string[] =>
    editableColumns
      .map((column) => column.key)
      .filter((columnKey) => !Object.is(row[columnKey], draftRow[columnKey]));

  const saveRow = async (row: TRow) => {
    const draftRow = draftRows[row.id];
    if (!draftRow) {
      return;
    }

    const nextErrors = validateDraftRow(columns, draftRow);
    if (Object.keys(nextErrors).length > 0) {
      setRowErrors((previous) => ({
        ...previous,
        [row.id]: nextErrors,
      }));
      return;
    }

    const changedKeys = getChangedKeys(row, draftRow);
    if (changedKeys.length === 0) {
      cancelRowEdit(row);
      return;
    }

    if (!onSaveRow) {
      return;
    }

    setSavingRowIds((previous) => [...previous, row.id]);
    setSaveFailures((previous) => removeMapEntry(previous, row.id));

    try {
      const payload: EditableGridSavePayload<TRow> = {
        rowId: row.id,
        previousRow: row,
        nextRow: draftRow,
        changedKeys,
      };
      await onSaveRow(payload);

      setLocalRows((previous) =>
        previous.map((currentRow) => (currentRow.id === row.id ? draftRow : currentRow))
      );

      setDraftRows((previous) => removeMapEntry(previous, row.id));
      setRowErrors((previous) => removeMapEntry(previous, row.id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown save error';
      setSaveFailures((previous) => ({
        ...previous,
        [row.id]: message,
      }));
    } finally {
      setSavingRowIds((previous) => previous.filter((targetId) => targetId !== row.id));
    }
  };

  if (loading) {
    return (
      <div className={clsx('itdo-datagrid', 'itdo-editable-grid', className)}>
        <div className="itdo-datagrid-state">
          <span className="itdo-datagrid-state__loading">
            <Spinner size="small" label={loadingLabel} />
            <span className="itdo-datagrid-state__text">{loadingLabel}</span>
          </span>
        </div>
      </div>
    );
  }

  if (localRows.length === 0) {
    return (
      <div className={clsx('itdo-datagrid', 'itdo-editable-grid', className)}>
        {emptyState ?? (
          <div className="itdo-datagrid-state">
            <p className="itdo-datagrid-state__text">{resolvedLabels.noRows}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={clsx('itdo-datagrid', 'itdo-editable-grid', className)}>
      <table className="itdo-datagrid__table" role="grid">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr className="itdo-datagrid__header-row">
            {columns.map((column) => (
              <th
                key={column.key}
                className="itdo-datagrid__header-cell"
                style={{ width: column.width, textAlign: column.align ?? 'left' }}
                scope="col"
              >
                {column.header}
              </th>
            ))}
            <th className="itdo-datagrid__header-cell itdo-editable-grid__actions-header" scope="col">
              {resolvedLabels.actionsHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {localRows.map((row) => {
            const draftRow = draftRows[row.id];
            const rowModel = draftRow ?? row;
            const isEditing = !!draftRow;
            const changedKeys = draftRow ? getChangedKeys(row, draftRow) : [];
            const isDirty = changedKeys.length > 0;
            const errors = rowErrors[row.id] ?? {};
            const errorMessages = Object.values(errors);
            const saveFailure = saveFailures[row.id];
            const isSaving = savingRowIds.includes(row.id);

            return (
              <tr
                key={row.id}
                className={clsx('itdo-datagrid__row', {
                  'itdo-editable-grid__row--dirty': isDirty,
                })}
                data-state={isDirty ? 'dirty' : undefined}
                aria-busy={isSaving ? true : undefined}
              >
                {columns.map((column) => {
                  const cellValue = rowModel[column.key];
                  const cellError = errors[column.key];
                  const fieldId = `itdo-editable-grid-${row.id}-${column.key}`;
                  const errorId = `${fieldId}-error`;
                  const isColumnEditable = column.editable !== false;

                  return (
                    <td
                      key={`${row.id}-${column.key}`}
                      className="itdo-datagrid__cell itdo-editable-grid__cell"
                      style={{ textAlign: column.align ?? 'left' }}
                    >
                      {isEditing && isColumnEditable ? (
                        <div className="itdo-editable-grid__editor-wrap">
                          {getEditorType(column) === 'select' ? (
                            <select
                              id={fieldId}
                              className="itdo-editable-grid__editor"
                              aria-label={`${getHeaderText(column)} for row ${row.id}`}
                              aria-invalid={cellError ? true : undefined}
                              aria-describedby={cellError ? errorId : undefined}
                              value={toInputValue(cellValue)}
                              disabled={isSaving}
                              onChange={(event) => updateDraftCell(row.id, column, event.target.value)}
                            >
                              <option value="">{column.editor?.placeholder ?? resolvedLabels.selectPlaceholder}</option>
                              {(column.editor?.options ?? []).map((option) => (
                                <option key={`${column.key}-${option.value}`} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              id={fieldId}
                              className="itdo-editable-grid__editor"
                              aria-label={`${getHeaderText(column)} for row ${row.id}`}
                              aria-invalid={cellError ? true : undefined}
                              aria-describedby={cellError ? errorId : undefined}
                              type={getEditorType(column)}
                              min={column.editor?.min}
                              max={column.editor?.max}
                              step={column.editor?.step}
                              placeholder={column.editor?.placeholder}
                              value={toInputValue(cellValue)}
                              disabled={isSaving}
                              onChange={(event) => updateDraftCell(row.id, column, event.target.value)}
                            />
                          )}
                          {cellError && (
                            <p id={errorId} className="itdo-editable-grid__cell-error">
                              {cellError}
                            </p>
                          )}
                        </div>
                      ) : (
                        resolveCellContent(column, rowModel)
                      )}
                    </td>
                  );
                })}
                <td className="itdo-datagrid__cell itdo-editable-grid__actions-cell">
                  <div className="itdo-editable-grid__actions">
                    {isEditing ? (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            void saveRow(row);
                          }}
                          disabled={isSaving}
                        >
                          {resolvedLabels.saveRow}
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => cancelRowEdit(row)}
                          disabled={isSaving}
                        >
                          {resolvedLabels.cancelRow}
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => beginRowEdit(row)}
                        disabled={!canEditRows}
                      >
                        {resolvedLabels.editRow}
                      </Button>
                    )}
                  </div>
                  {isDirty && <p className="itdo-editable-grid__row-state">{resolvedLabels.unsavedState}</p>}
                  {errorMessages.length > 0 && (
                    <div className="itdo-editable-grid__error-summary" aria-live="polite" aria-atomic="true">
                      <p className="itdo-editable-grid__error-summary-title">
                        {resolvedLabels.validationSummaryTitle(errorMessages.length)}
                      </p>
                      <ul className="itdo-editable-grid__error-summary-list">
                        {errorMessages.map((message, index) => (
                          <li key={`${row.id}-summary-${index}`}>{message}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {saveFailure && (
                    <p className="itdo-editable-grid__save-error" role="alert">
                      {resolvedLabels.saveErrorPrefix}: {saveFailure}
                    </p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
