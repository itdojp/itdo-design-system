import { colors } from './colors';

export const semantic = {
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    muted: colors.neutral[500],
    inverse: colors.white,
    link: colors.primary[600],
  },
  background: {
    base: colors.white,
    surface: colors.neutral[50],
    subtle: colors.neutral[100],
    accent: colors.primary[50],
    disabled: colors.neutral[100],
  },
  border: {
    default: colors.neutral[200],
    strong: colors.neutral[300],
    focus: colors.primary[500],
    disabled: colors.neutral[200],
  },
  status: {
    success: colors.success.default,
    warning: colors.warning.default,
    error: colors.error.default,
    info: colors.info.default,
  },
  statusText: {
    success: colors.success.dark,
    warning: colors.warning.dark,
    error: colors.error[700],
    info: colors.info.dark,
  },
  action: {
    primary: colors.primary[700],
    primaryHover: colors.primary[800],
    primaryActive: colors.primary[900],
    secondary: colors.neutral[700],
    secondaryHover: colors.neutral[800],
    secondaryActive: colors.neutral[900],
    danger: colors.error[600],
    dangerHover: colors.error[700],
    dangerActive: colors.error[800],
    outline: colors.primary[700],
    outlineHover: colors.primary[50],
    ghostHover: colors.neutral[100],
  },
  focus: {
    ringColor: 'rgba(249, 115, 22, 0.35)',
    ringWidth: '3px',
    ringOffset: '2px',
  },
  datagrid: {
    headerBackground: colors.neutral[50],
    headerBorder: colors.neutral[300],
    rowBorder: colors.neutral[200],
    rowHover: colors.neutral[100],
    rowSelected: colors.primary[50],
    rowZebra: colors.neutral[50],
    focusRing: 'rgba(249, 115, 22, 0.35)',
  },
} as const;

export type SemanticTokens = typeof semantic;
