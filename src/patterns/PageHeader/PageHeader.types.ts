import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  status?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}
