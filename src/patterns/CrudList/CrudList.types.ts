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
  labels?: {
    search?: string;
    savedView?: string;
    savedViewPlaceholder?: string;
    saveView?: string;
    clearAll?: string;
    logicLabel?: string;
    logicAriaLabel?: string;
    logicAnd?: string;
    logicOr?: string;
  };
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
  logic?: {
    value: ListLogicalOperator;
    onChange: (value: ListLogicalOperator) => void;
    ariaLabel?: string;
  };
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

export type ListLogicalOperator = 'and' | 'or';

export type ListFilterOperator =
  | 'eq'
  | 'ne'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'isNull'
  | 'isNotNull';

export type ListFilterValuePrimitive = string | number | boolean;

export type ListFilterValue = ListFilterValuePrimitive | ListFilterValuePrimitive[];

export interface ListFilterCondition {
  id?: string;
  field: string;
  operator: ListFilterOperator;
  value?: ListFilterValue;
  valueTo?: ListFilterValuePrimitive;
}

export interface ListFilterGroup {
  logicalOperator: ListLogicalOperator;
  conditions: ListFilterCondition[];
}

export interface ListQuerySort {
  key: string;
  direction: DataTableSortDirection;
}

export interface ListQueryPagination {
  page: number;
  pageSize: number;
  totalItems?: number;
}

export interface ListQueryContract {
  search?: string;
  filters?: ListFilterGroup;
  sort?: ListQuerySort;
  pagination: ListQueryPagination;
}

export interface DataTableColumn {
  key: string;
  header: string | ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
  pinned?: 'left' | 'right';
  hideable?: boolean;
  cell?: (row: DataTableRow) => ReactNode;
}

export interface DataTableRow {
  id: string;
  [key: string]: ReactNode;
}

export interface DataTableRowAction {
  key: string;
  label: string;
  disabled?: boolean;
  onSelect: (row: DataTableRow) => void;
}

export interface DataTableBulkAction {
  key: string;
  label: string;
  disabled?: boolean;
  onSelect: (rows: DataTableRow[]) => void;
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
  rowActionSlot?: (row: DataTableRow) => ReactNode;
  bulkActions?: DataTableBulkAction[];
  visibleColumnKeys?: string[];
  onVisibleColumnKeysChange?: (keys: string[]) => void;
  enableColumnVisibilityControl?: boolean;
  query?: Partial<ListQueryContract>;
  onQueryChange?: (query: ListQueryContract) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  initialSort?: {
    key: string;
    direction?: DataTableSortDirection;
  };
  onSelectionChange?: (selectedIds: string[]) => void;
  radioGroupName?: string;
  labels?: {
    noRecords?: string;
    rowsPerPage?: string;
    prevPage?: string;
    nextPage?: string;
    page?: (currentPage: number, totalPages: number) => string;
    columnSettings?: string;
    selectedRows?: (selectedRows: number) => string;
    clearSelection?: string;
    selectAllRows?: string;
    deselectAllRows?: string;
  };
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
