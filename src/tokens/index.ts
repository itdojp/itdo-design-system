export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './radius';
export * from './primitives';
export * from './semantic';
export * from './density';

import { primitives } from './primitives';
import { semantic } from './semantic';
import { density } from './density';

export const tokens = {
  primitives,
  semantic,
  density,
} as const;

export type Tokens = typeof tokens;
