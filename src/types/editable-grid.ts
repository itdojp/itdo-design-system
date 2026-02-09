import type { ReactNode } from 'react';

export interface EditableGridRowRecord {
  id: string;
  [key: string]: unknown;
}

export type EditableGridEditorType = 'text' | 'number' | 'date' | 'select';

export interface EditableGridSelectOption {
  label: string;
  value: string;
}

export interface EditableGridEditorContract {
  type?: EditableGridEditorType;
  placeholder?: string;
  options?: EditableGridSelectOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface EditableGridValidationContext<TRow extends EditableGridRowRecord> {
  row: TRow;
  columnKey: string;
}

export type EditableGridValidator<TRow extends EditableGridRowRecord> = (
  value: unknown,
  context: EditableGridValidationContext<TRow>
) => string | null;

export interface EditableDataGridColumnContract<TRow extends EditableGridRowRecord = EditableGridRowRecord> {
  key: string;
  header: string | ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  editable?: boolean;
  editor?: EditableGridEditorContract;
  validator?: EditableGridValidator<TRow>;
  formatter?: (value: unknown, row: TRow) => ReactNode;
}

export interface EditableGridValidationErrorRecord {
  columnKey: string;
  message: string;
}

export interface EditableGridSavePayload<TRow extends EditableGridRowRecord = EditableGridRowRecord> {
  rowId: string;
  nextRow: TRow;
  previousRow: TRow;
  changedKeys: string[];
}
