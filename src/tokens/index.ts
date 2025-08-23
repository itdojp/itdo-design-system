export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './radius';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { radius } from './radius';

export const tokens = {
  colors,
  typography,
  spacing,
  shadows,
  radius,
} as const;

export type Tokens = typeof tokens;