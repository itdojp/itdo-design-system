import type { ReactNode, RefObject } from 'react';

export type PopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'left';

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  children: ReactNode;
  placement?: PopoverPlacement;
  offset?: number;
  portal?: boolean;
  role?: string;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  autoFocus?: boolean;
  initialFocusRef?: RefObject<HTMLElement>;
  className?: string;
}
