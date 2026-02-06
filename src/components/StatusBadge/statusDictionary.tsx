import type { ReactNode } from 'react';
import {
  StatusDictionary,
  StatusDictionaryEntry,
  StatusTone,
} from './StatusBadge.types';

// Text placeholders are used as default icons so the component works without an icon dependency.
const DEFAULT_TONE_ICON: Record<StatusTone, ReactNode> = {
  neutral: 'N',
  info: 'I',
  success: 'S',
  warning: 'W',
  danger: 'D',
};

export const defaultStatusDictionary: StatusDictionary = {
  draft: { label: 'Draft', tone: 'neutral', icon: DEFAULT_TONE_ICON.neutral },
  pending: { label: 'Pending', tone: 'info', icon: DEFAULT_TONE_ICON.info },
  approved: { label: 'Approved', tone: 'success', icon: DEFAULT_TONE_ICON.success },
  rejected: { label: 'Rejected', tone: 'danger', icon: DEFAULT_TONE_ICON.danger },
  paid: { label: 'Paid', tone: 'success', icon: DEFAULT_TONE_ICON.success },
  canceled: { label: 'Canceled', tone: 'warning', icon: DEFAULT_TONE_ICON.warning },
};

const formatFallbackLabel = (status: string) => {
  return status
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

export const defaultStatusFallbackLabelFormatter = (status: string) => formatFallbackLabel(status);

export const resolveStatusDictionaryEntry = (
  status: string,
  dictionary?: StatusDictionary,
  fallbackLabelFormatter: (status: string) => string = defaultStatusFallbackLabelFormatter
): StatusDictionaryEntry => {
  const key = status.trim().toLowerCase();
  const merged = { ...defaultStatusDictionary, ...dictionary };

  if (merged[key]) {
    const entry = merged[key];
    return {
      label: entry.label,
      tone: entry.tone,
      icon: entry.icon ?? DEFAULT_TONE_ICON[entry.tone],
    };
  }

  return {
    label: fallbackLabelFormatter(status) || 'Unknown',
    tone: 'neutral',
    icon: DEFAULT_TONE_ICON.neutral,
  };
};
