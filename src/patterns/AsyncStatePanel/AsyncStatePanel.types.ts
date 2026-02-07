import type { ReactNode } from 'react';
import type { EmptyStateActionConfig } from '../../components/EmptyState/EmptyState.types';

export type AsyncPanelState = 'loading' | 'empty' | 'error' | 'ready';
export type AsyncPanelActionTone = 'primary' | 'secondary' | 'ghost';

export interface AsyncPanelAction {
  label: string;
  onClick: () => void;
  tone?: AsyncPanelActionTone;
}

export interface AsyncPanelEmptyConfig {
  title?: string;
  description?: string;
  action?: ReactNode;
  primaryAction?: EmptyStateActionConfig;
  secondaryAction?: EmptyStateActionConfig;
  ghostAction?: EmptyStateActionConfig;
}

export interface AsyncPanelErrorConfig {
  title?: string;
  detail?: string;
  onRetry?: () => void;
  retryLabel?: string;
  expandableDetail?: boolean;
  retryAction?: AsyncPanelAction;
  secondaryAction?: AsyncPanelAction;
  contactAction?: AsyncPanelAction;
  backAction?: AsyncPanelAction;
}

export interface AsyncStatePanelProps {
  state: AsyncPanelState;
  loadingText?: string;
  empty?: AsyncPanelEmptyConfig;
  error?: AsyncPanelErrorConfig;
  children?: ReactNode;
  className?: string;
}
