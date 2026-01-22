import type { ReactNode } from 'react';

export interface DataGridSurfaceProps {
  children: ReactNode;
  className?: string;
}

export interface DataGridToolbarProps {
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export interface DataGridPaginationProps {
  children?: ReactNode;
  className?: string;
}

export interface DataGridEmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export interface DataGridLoadingStateProps {
  label?: string;
  className?: string;
}
