import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { radius } from './radius';
import { motion } from './motion';

export const primitives = {
  colors,
  typography,
  spacing,
  shadows,
  radius,
  motion,
} as const;

export type Primitives = typeof primitives;
