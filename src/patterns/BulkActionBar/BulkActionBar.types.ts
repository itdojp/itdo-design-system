export type BulkActionTone = 'default' | 'danger';

export interface BulkActionBarAction {
  key: string;
  label: string;
  disabled?: boolean;
  tone?: BulkActionTone;
  onSelect: () => void;
}

export interface BulkActionBarProps {
  selectedCount: number;
  selectedRowsLabel?: (count: number) => string;
  actions: BulkActionBarAction[];
  clearSelectionLabel?: string;
  onClearSelection?: () => void;
  className?: string;
}
