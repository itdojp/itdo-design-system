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
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  autoFocus?: boolean;
  trapFocus?: boolean;
  initialFocusRef?: RefObject<HTMLElement>;
  className?: string;
}
