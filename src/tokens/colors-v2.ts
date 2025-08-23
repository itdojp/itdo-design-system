/**
 * 改良版カラーパレット
 * オレンジを差し色として活用し、メインUIは視認性の高い配色を採用
 */

export const colorsV2 = {
  // ブランドカラー（アクセント用）
  brand: {
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // メインのオレンジ
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
  },

  // プライマリカラー（メインUI用）
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af', // メインのブルー
    900: '#1e3a8a',
    950: '#172554',
  },

  // ニュートラルカラー（テキスト・背景用）
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // セマンティックカラー
  semantic: {
    success: {
      light: '#dcfce7',
      default: '#22c55e',
      dark: '#15803d',
    },
    warning: {
      light: '#fef3c7',
      default: '#eab308',
      dark: '#a16207',
    },
    error: {
      light: '#fef2f2',
      default: '#ef4444',
      dark: '#dc2626',
    },
    info: {
      light: '#dbeafe',
      default: '#3b82f6',
      dark: '#1d4ed8',
    },
  },

  // 基本色
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// UI要素への適用マッピング
export const colorMappingV2 = {
  // ボタン
  button: {
    primary: {
      background: colorsV2.primary[800],
      text: colorsV2.white,
      hover: colorsV2.primary[900],
      accent: colorsV2.brand.orange[500], // ホバー時のグロー効果用
    },
    secondary: {
      background: colorsV2.neutral[700],
      text: colorsV2.white,
      hover: colorsV2.neutral[800],
    },
    outline: {
      background: colorsV2.transparent,
      text: colorsV2.primary[800],
      border: colorsV2.primary[800],
      hover: colorsV2.primary[50],
    },
    ghost: {
      background: colorsV2.transparent,
      text: colorsV2.neutral[600],
      hover: colorsV2.neutral[100],
    },
  },

  // テキスト
  text: {
    primary: colorsV2.neutral[900],
    secondary: colorsV2.neutral[600],
    tertiary: colorsV2.neutral[500],
    disabled: colorsV2.neutral[400],
    link: colorsV2.primary[700],
    accent: colorsV2.brand.orange[500], // 強調テキスト
  },

  // 背景
  background: {
    primary: colorsV2.white,
    secondary: colorsV2.neutral[50],
    tertiary: colorsV2.neutral[100],
    accent: colorsV2.brand.orange[50], // アクセント背景
    hover: colorsV2.neutral[50],
    selected: colorsV2.brand.orange[50], // 選択状態
  },

  // ボーダー
  border: {
    default: colorsV2.neutral[200],
    hover: colorsV2.neutral[300],
    focus: colorsV2.primary[500],
    accent: colorsV2.brand.orange[500], // アクセントライン
    selected: colorsV2.brand.orange[500], // 選択状態の枠線
  },

  // インタラクティブ要素
  interactive: {
    focus: {
      ring: colorsV2.primary[500],
      ringAccent: colorsV2.brand.orange[500], // 重要な要素のフォーカス
    },
    selection: {
      background: colorsV2.brand.orange[100],
      border: colorsV2.brand.orange[500],
    },
    indicator: {
      active: colorsV2.brand.orange[500], // アクティブインジケーター
      inactive: colorsV2.neutral[300],
    },
  },
} as const;

export type ColorsV2 = typeof colorsV2;
export type ColorMappingV2 = typeof colorMappingV2;