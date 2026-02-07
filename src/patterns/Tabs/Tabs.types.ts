import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  panel?: ReactNode;
  disabled?: boolean;
}

export type TabsVariant = 'line' | 'pill';

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (nextValue: string) => void;
  ariaLabel?: string;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
  variant?: TabsVariant;
  fullWidth?: boolean;
  renderPanel?: (activeItem: TabItem) => ReactNode;
}
