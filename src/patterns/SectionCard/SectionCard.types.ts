import type { ReactNode } from 'react';

export type CardDensity = 'compact' | 'comfortable';

export interface SectionCardProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  density?: CardDensity;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export interface ListCardProps<T = unknown> {
  header: ReactNode;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  empty?: ReactNode;
  listLabel?: string;
  density?: CardDensity;
  className?: string;
  getItemKey?: (item: T, index: number) => string;
}
