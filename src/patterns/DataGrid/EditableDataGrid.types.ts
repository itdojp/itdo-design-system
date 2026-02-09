import type { ReactNode } from 'react';
import type {
  EditableDataGridColumnContract,
  EditableGridRowRecord,
  EditableGridSavePayload,
} from '../../types';

export interface EditableDataGridLabels {
  noRows?: string;
  editRow?: string;
  saveRow?: string;
  cancelRow?: string;
  unsavedState?: string;
  validationSummaryTitle?: (count: number) => string;
  saveErrorPrefix?: string;
}

export interface EditableDataGridProps<TRow extends EditableGridRowRecord = EditableGridRowRecord> {
  columns: EditableDataGridColumnContract<TRow>[];
  rows: TRow[];
  caption?: string;
  className?: string;
  emptyState?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  onSaveRow?: (payload: EditableGridSavePayload<TRow>) => Promise<void> | void;
  onCancelRow?: (row: TRow) => void;
  labels?: EditableDataGridLabels;
}
