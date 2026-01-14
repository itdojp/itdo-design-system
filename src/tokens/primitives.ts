import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { radius } from './radius';

export const primitives = {
  colors,
  typography,
  spacing,
  shadows,
  radius,
} as const;

export type Primitives = typeof primitives;
