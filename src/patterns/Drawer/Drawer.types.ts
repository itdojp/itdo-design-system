import type { ReactNode, RefObject } from 'react';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';
export type DrawerPlacement = 'right' | 'left';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  footer?: ReactNode;
  children?: ReactNode;
  size?: DrawerSize;
  placement?: DrawerPlacement;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  portal?: boolean;
  className?: string;
  overlayClassName?: string;
  initialFocusRef?: RefObject<HTMLElement>;
}

export interface DrawerHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export interface DrawerFooterProps {
  align?: 'start' | 'end' | 'between';
  className?: string;
  children?: ReactNode;
}
