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
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export interface PaginationBarProps {
  children: ReactNode;
  className?: string;
}

export interface DataTableColumn {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableRow {
  id: string;
  [key: string]: ReactNode;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  caption?: string;
  emptyState?: ReactNode;
  className?: string;
}
