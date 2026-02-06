import type { ReactNode, RefObject } from 'react';

export type DialogSize = 'small' | 'medium' | 'large';
export type DialogScrollBehavior = 'body' | 'dialog';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  confirmAction?: ReactNode;
  cancelAction?: ReactNode;
  size?: DialogSize;
  scrollBehavior?: DialogScrollBehavior;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  portal?: boolean;
  className?: string;
  overlayClassName?: string;
  initialFocusRef?: RefObject<HTMLElement>;
}
