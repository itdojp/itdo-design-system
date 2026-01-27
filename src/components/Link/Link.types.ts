import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type LinkSize = 'small' | 'medium' | 'large';
export type LinkVariant = 'primary' | 'secondary' | 'muted';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string;
  children: ReactNode;
  external?: boolean;
  showExternalIcon?: boolean;
  size?: LinkSize;
  variant?: LinkVariant;
}
