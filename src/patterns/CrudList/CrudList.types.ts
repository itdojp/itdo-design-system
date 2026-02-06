import type { ReactNode } from 'react';

export interface CrudListProps {
  title?: string;
  description?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  table?: ReactNode;
  emptyState?: ReactNode;
  pagination?: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export interface FilterBarProps {
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    ariaLabel?: string;
  };
  filters?: Array<{
    key: string;
    label: string;
    control: ReactNode;
  }>;
  chips?: Array<{
    key: string;
    label: string;
    onRemove?: () => void;
  }>;
  onClearAll?: () => void;
  savedViews?: {
    items: { id: string; name: string }[];
    selectedId?: string;
    onSelect: (id: string) => void;
    onSave?: () => void;
    ariaLabel?: string;
  };
}

export interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export interface PaginationBarProps {
  children: ReactNode;
  className?: string;
}

export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableColumn {
  key: string;
  header: ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
  cell?: (row: DataTableRow) => ReactNode;
}

export interface DataTableRow {
  id: string;
  [key: string]: ReactNode;
}

export interface DataTableRowAction {
  key: string;
  label: string;
  onSelect: (row: DataTableRow) => void;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  caption?: string;
  emptyState?: ReactNode;
  className?: string;
  loading?: boolean;
  loadingLabel?: string;
  selectable?: 'none' | 'single' | 'multiple';
  rowActions?: DataTableRowAction[];
  pageSize?: number;
  pageSizeOptions?: number[];
  initialSort?: {
    key: string;
    direction?: DataTableSortDirection;
  };
  onSelectionChange?: (selectedIds: string[]) => void;
}

export interface DataTableToolbarProps {
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  className?: string;
}
