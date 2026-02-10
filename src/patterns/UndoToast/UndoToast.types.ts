import type { ReactNode } from 'react';
import type { ToastSeverity } from '../../components/Toast/Toast.types';

export interface UndoToastLabels {
  undo?: string;
  undoAriaLabel?: (remainingSeconds: number) => string;
  countdownSuffix?: (remainingSeconds: number) => string;
  committedState?: string;
  undoneState?: string;
}

export interface UndoToastProps {
  title: string;
  description?: ReactNode;
  severity?: ToastSeverity;
  durationMs?: number;
  showCountdown?: boolean;
  autoDismissOnCommit?: boolean;
  autoDismissOnUndo?: boolean;
  labels?: UndoToastLabels;
  onUndo?: () => void;
  onCommit?: () => void;
  onDismiss?: () => void;
  className?: string;
}
