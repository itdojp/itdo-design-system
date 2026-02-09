import type { DataTableBulkAction, DataTableRow } from '../CrudList/CrudList.types';
import { BulkActionBarProps } from './BulkActionBar.types';

export interface DataTableBulkActionBarAdapterOptions {
  selectedRows: DataTableRow[];
  bulkActions?: DataTableBulkAction[];
  selectedRowsLabel: (count: number) => string;
  clearSelectionLabel: string;
  onClearSelection: () => void;
}

export interface DataGridBulkAction<TItem> {
  key: string;
  label: string;
  disabled?: boolean;
  tone?: 'default' | 'danger';
  onSelect: (items: TItem[]) => void;
}

export interface DataGridBulkActionBarAdapterOptions<TItem> {
  selectedItems: TItem[];
  actions: DataGridBulkAction<TItem>[];
  selectedRowsLabel: (count: number) => string;
  clearSelectionLabel: string;
  onClearSelection: () => void;
}

export const createDataTableBulkActionBarProps = ({
  selectedRows,
  bulkActions = [],
  selectedRowsLabel,
  clearSelectionLabel,
  onClearSelection,
}: DataTableBulkActionBarAdapterOptions): BulkActionBarProps => ({
  selectedCount: selectedRows.length,
  selectedRowsLabel,
  clearSelectionLabel,
  onClearSelection,
  actions: bulkActions.map((action) => ({
    key: action.key,
    label: action.label,
    disabled: action.disabled,
    onSelect: () => action.onSelect(selectedRows),
  })),
});

export const createDataGridBulkActionBarProps = <TItem,>({
  selectedItems,
  actions,
  selectedRowsLabel,
  clearSelectionLabel,
  onClearSelection,
}: DataGridBulkActionBarAdapterOptions<TItem>): BulkActionBarProps => ({
  selectedCount: selectedItems.length,
  selectedRowsLabel,
  clearSelectionLabel,
  onClearSelection,
  actions: actions.map((action) => ({
    key: action.key,
    label: action.label,
    disabled: action.disabled,
    tone: action.tone,
    onSelect: () => action.onSelect(selectedItems),
  })),
});
