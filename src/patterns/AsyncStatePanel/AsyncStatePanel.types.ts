import type { ReactNode } from 'react';

export type AsyncPanelState = 'loading' | 'empty' | 'error' | 'ready';

export interface AsyncPanelEmptyConfig {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export interface AsyncPanelErrorConfig {
  title?: string;
  detail?: string;
  onRetry?: () => void;
  retryLabel?: string;
  expandableDetail?: boolean;
}

export interface AsyncStatePanelProps {
  state: AsyncPanelState;
  loadingText?: string;
  empty?: AsyncPanelEmptyConfig;
  error?: AsyncPanelErrorConfig;
  children?: ReactNode;
  className?: string;
}
