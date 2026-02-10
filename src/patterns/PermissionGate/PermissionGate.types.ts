import type { ReactNode } from 'react';

export type PermissionGateMode = 'hide' | 'disable';

export interface PermissionGateProps {
  allowed: boolean;
  mode?: PermissionGateMode;
  reason?: string;
  showReason?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
  className?: string;
}
