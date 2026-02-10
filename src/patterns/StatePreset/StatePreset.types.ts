import type { ReactNode } from 'react';

export type StatePresetMode = 'loading' | 'empty' | 'error' | 'success';

export type StatePresetActionTone = 'primary' | 'secondary' | 'ghost';

export interface StatePresetAction {
  label: string;
  onClick: () => void;
  tone?: StatePresetActionTone;
  disabled?: boolean;
}

export interface StatePresetLoadingConfig {
  label?: string;
}

export interface StatePresetEmptyConfig {
  title?: string;
  description?: string;
  action?: ReactNode;
  primaryAction?: StatePresetAction;
  secondaryAction?: StatePresetAction;
  ghostAction?: StatePresetAction;
}

export interface StatePresetErrorConfig {
  title?: string;
  detail?: string;
  expandableDetail?: boolean;
  retry?: StatePresetAction;
  contact?: StatePresetAction;
  fallback?: StatePresetAction;
}

export interface StatePresetSuccessConfig {
  title?: string;
  description?: string;
  primaryAction?: StatePresetAction;
  secondaryAction?: StatePresetAction;
}

export interface StatePresetProps {
  mode: StatePresetMode;
  loading?: StatePresetLoadingConfig;
  empty?: StatePresetEmptyConfig;
  error?: StatePresetErrorConfig;
  success?: StatePresetSuccessConfig;
  className?: string;
}
