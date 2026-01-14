import type { ReactNode } from 'react';

export type ActionFlowState = 'confirm' | 'processing' | 'success' | 'error';

export interface ActionFlowProps {
  title: string;
  description?: string;
  state: ActionFlowState;
  confirmAction?: ReactNode;
  cancelAction?: ReactNode;
  retryAction?: ReactNode;
  resultAction?: ReactNode;
  processingMessage?: string;
  resultTitle?: string;
  resultMessage?: string;
  className?: string;
}
