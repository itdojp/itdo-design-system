import type { ReactNode } from 'react';

export type ConfirmActionDialogTone = 'default' | 'danger';

export interface ConfirmActionPayload {
  reason?: string;
}

export interface ConfirmActionDialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmActionDialogTone;
  requireReason?: boolean;
  reasonLabel?: string;
  reasonRequired?: boolean;
  reasonPlaceholder?: string;
  onConfirm: (payload?: ConfirmActionPayload) => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  className?: string;
}
