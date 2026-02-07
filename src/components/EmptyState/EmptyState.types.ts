import { ReactNode } from 'react';

export type EmptyStateActionTone = 'primary' | 'secondary' | 'ghost';

export interface EmptyStateActionConfig {
  label: string;
  onClick: () => void;
  tone?: EmptyStateActionTone;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  primaryAction?: EmptyStateActionConfig;
  secondaryAction?: EmptyStateActionConfig;
  ghostAction?: EmptyStateActionConfig;
  icon?: ReactNode;
  className?: string;
}
