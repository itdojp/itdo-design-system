import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
}

export type PageHeaderBreadcrumbs = ReactNode | BreadcrumbItem[];

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: PageHeaderBreadcrumbs;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  meta?: ReactNode;
  sticky?: boolean;
  className?: string;
  /**
   * @deprecated Use `meta` instead.
   */
  status?: ReactNode;
  /**
   * @deprecated Use `primaryAction` and `secondaryActions` instead.
   */
  actions?: ReactNode;
}
