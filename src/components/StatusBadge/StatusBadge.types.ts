import type { ReactNode } from 'react';

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type StatusVariant = 'solid' | 'soft' | 'outline';
export type StatusSize = 'sm' | 'md';

export interface StatusDictionaryEntry {
  label: string;
  tone: StatusTone;
  icon?: ReactNode;
}

export type StatusDictionary = Record<string, StatusDictionaryEntry>;

export interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  size?: StatusSize;
  dictionary?: StatusDictionary;
  fallbackLabelFormatter?: (status: string) => string;
  className?: string;
  hideIcon?: boolean;
  ariaLabel?: string;
}

export interface StatusDotProps {
  status: string;
  size?: StatusSize;
  dictionary?: StatusDictionary;
  fallbackLabelFormatter?: (status: string) => string;
  className?: string;
  showLabel?: boolean;
  ariaLabel?: string;
}
