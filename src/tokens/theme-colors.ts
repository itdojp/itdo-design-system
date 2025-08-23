/**
 * ITDO Design System - テーマカラー定義
 * ブラウン（第1案）とブルー（第2案）の2色展開
 * それぞれライト/ダークモード対応
 */

export const themeColors = {
  // =====================================
  // ブラウンテーマ（第1案 - メイン）
  // =====================================
  brown: {
    // ライトモード
    light: {
      name: 'ブラウン ライト',
      primary: {
        main: '#6b4423',      // メインブラウン
        hover: '#5a3a1f',     // ホバー時
        light: '#8b5a3c',     // 薄め
        lighter: '#a67449',   // より薄め
        dark: '#4a301c',      // 濃いめ
      },
      accent: {
        main: '#f97316',      // オレンジ（差し色）
        light: '#fb923c',     
        lighter: '#fed7aa',
        dark: '#ea580c',
      },
      text: {
        primary: '#2e1e11',   // メインテキスト
        secondary: '#5a3a1f', // サブテキスト
        tertiary: '#8b5a3c',  // 補助テキスト
        disabled: '#a67449',  // 無効テキスト
      },
      background: {
        default: '#faf5f0',   // デフォルト背景
        paper: '#ffffff',     // カード背景
        subtle: '#f4e8dd',    // 薄い背景
        hover: '#e6d0bb',     // ホバー背景
      },
      border: {
        default: '#d4b192',   // デフォルトボーダー
        light: '#e6d0bb',     // 薄いボーダー
        dark: '#c0906b',      // 濃いボーダー
      },
      status: {
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
    // ダークモード
    dark: {
      name: 'ブラウン ダーク',
      primary: {
        main: '#a67449',      // 明るめのブラウン（ダークモード用）
        hover: '#c0906b',     
        light: '#d4b192',
        lighter: '#e6d0bb',
        dark: '#8b5a3c',
      },
      accent: {
        main: '#fb923c',      // 明るめのオレンジ
        light: '#fed7aa',
        lighter: '#fff7ed',
        dark: '#f97316',
      },
      text: {
        primary: '#f4e8dd',   // 明るいテキスト
        secondary: '#d4b192',
        tertiary: '#c0906b',
        disabled: '#8b5a3c',
      },
      background: {
        default: '#1a0f08',   // ダーク背景
        paper: '#2e1e11',     // カード背景
        subtle: '#3e2a1a',    // 薄い背景
        hover: '#4a301c',     // ホバー背景
      },
      border: {
        default: '#5a3a1f',
        light: '#4a301c',
        dark: '#6b4423',
      },
      status: {
        success: '#86efac',
        warning: '#fde047',
        error: '#fca5a5',
        info: '#93c5fd',
      },
    },
  },

  // =====================================
  // ブルーテーマ（第2案）
  // =====================================
  blue: {
    // ライトモード
    light: {
      name: 'ブルー ライト',
      primary: {
        main: '#1e40af',      // メインブルー
        hover: '#1e3a8a',
        light: '#2563eb',
        lighter: '#3b82f6',
        dark: '#172554',
      },
      accent: {
        main: '#f97316',      // オレンジ（差し色）
        light: '#fb923c',
        lighter: '#fed7aa',
        dark: '#ea580c',
      },
      text: {
        primary: '#111827',   // メインテキスト
        secondary: '#4b5563',
        tertiary: '#6b7280',
        disabled: '#9ca3af',
      },
      background: {
        default: '#ffffff',   // デフォルト背景
        paper: '#ffffff',
        subtle: '#f9fafb',
        hover: '#f3f4f6',
      },
      border: {
        default: '#e5e7eb',
        light: '#f3f4f6',
        dark: '#d1d5db',
      },
      status: {
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
    // ダークモード
    dark: {
      name: 'ブルー ダーク',
      primary: {
        main: '#3b82f6',      // 明るめのブルー（ダークモード用）
        hover: '#60a5fa',
        light: '#93c5fd',
        lighter: '#bfdbfe',
        dark: '#2563eb',
      },
      accent: {
        main: '#fb923c',      // 明るめのオレンジ
        light: '#fed7aa',
        lighter: '#fff7ed',
        dark: '#f97316',
      },
      text: {
        primary: '#f9fafb',   // 明るいテキスト
        secondary: '#d1d5db',
        tertiary: '#9ca3af',
        disabled: '#6b7280',
      },
      background: {
        default: '#0f172a',   // ダーク背景
        paper: '#1e293b',
        subtle: '#334155',
        hover: '#475569',
      },
      border: {
        default: '#334155',
        light: '#1e293b',
        dark: '#475569',
      },
      status: {
        success: '#86efac',
        warning: '#fde047',
        error: '#fca5a5',
        info: '#93c5fd',
      },
    },
  },
};

// =====================================
// テーマ選択用のヘルパー関数
// =====================================
export type ThemeColor = 'brown' | 'blue';
export type ThemeMode = 'light' | 'dark';

export const getTheme = (color: ThemeColor, mode: ThemeMode) => {
  return themeColors[color][mode];
};

// デフォルトテーマ
export const defaultTheme = themeColors.brown.light;

// CSS変数として出力するヘルパー関数
export const generateCSSVariables = (color: ThemeColor, mode: ThemeMode) => {
  const theme = getTheme(color, mode);
  
  return `
    :root {
      /* Primary Colors */
      --color-primary: ${theme.primary.main};
      --color-primary-hover: ${theme.primary.hover};
      --color-primary-light: ${theme.primary.light};
      --color-primary-lighter: ${theme.primary.lighter};
      --color-primary-dark: ${theme.primary.dark};
      
      /* Accent Colors */
      --color-accent: ${theme.accent.main};
      --color-accent-light: ${theme.accent.light};
      --color-accent-lighter: ${theme.accent.lighter};
      --color-accent-dark: ${theme.accent.dark};
      
      /* Text Colors */
      --color-text-primary: ${theme.text.primary};
      --color-text-secondary: ${theme.text.secondary};
      --color-text-tertiary: ${theme.text.tertiary};
      --color-text-disabled: ${theme.text.disabled};
      
      /* Background Colors */
      --color-bg-default: ${theme.background.default};
      --color-bg-paper: ${theme.background.paper};
      --color-bg-subtle: ${theme.background.subtle};
      --color-bg-hover: ${theme.background.hover};
      
      /* Border Colors */
      --color-border-default: ${theme.border.default};
      --color-border-light: ${theme.border.light};
      --color-border-dark: ${theme.border.dark};
      
      /* Status Colors */
      --color-success: ${theme.status.success};
      --color-warning: ${theme.status.warning};
      --color-error: ${theme.status.error};
      --color-info: ${theme.status.info};
    }
  `;
};