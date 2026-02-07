import type { ReactNode } from 'react';

export interface BreadcrumbProps {
  items: NavigationBreadcrumbItem[];
  separator?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export interface NavigationBreadcrumbItem {
  id?: string;
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}
