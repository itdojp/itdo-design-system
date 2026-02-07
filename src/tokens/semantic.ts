import { colors } from './colors';

const statusPalette = {
  success: {
    background: colors.success.light,
    border: colors.success.default,
    text: colors.success.dark,
  },
  warning: {
    background: colors.warning.light,
    border: colors.warning.default,
    text: colors.warning.dark,
  },
  error: {
    background: colors.error.light,
    border: colors.error.default,
    text: colors.error[700],
  },
  info: {
    background: colors.info.light,
    border: colors.info.default,
    text: colors.info.dark,
  },
} as const;

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
    subtle: colors.neutral[100],
    default: colors.neutral[200],
    strong: colors.neutral[300],
    interactive: colors.primary[600],
    focus: colors.primary[500],
    disabled: colors.neutral[200],
  },
  status: {
    success: statusPalette.success.border,
    warning: statusPalette.warning.border,
    error: statusPalette.error.border,
    info: statusPalette.info.border,
    surface: {
      success: statusPalette.success.background,
      warning: statusPalette.warning.background,
      error: statusPalette.error.background,
      info: statusPalette.info.background,
    },
    border: {
      success: statusPalette.success.border,
      warning: statusPalette.warning.border,
      error: statusPalette.error.border,
      info: statusPalette.info.border,
    },
    text: {
      success: statusPalette.success.text,
      warning: statusPalette.warning.text,
      error: statusPalette.error.text,
      info: statusPalette.info.text,
    },
  },
  statusText: {
    success: statusPalette.success.text,
    warning: statusPalette.warning.text,
    error: statusPalette.error.text,
    info: statusPalette.info.text,
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
    ringInnerColor: colors.white,
    ringWidth: '3px',
    ringOffset: '2px',
    outlineColor: colors.primary[500],
    outlineWidth: '2px',
    outlineStyle: 'solid',
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
