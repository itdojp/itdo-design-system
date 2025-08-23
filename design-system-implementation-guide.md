# ITDO Design System
*Enterprise-Grade Design System Reference Guide*

## デザインシステム概要

### ビジョン・ミッション
**ビジョン**: 一貫性のある優れたユーザー体験を全てのITDOプロダクトで提供する  
**ミッション**: 開発チームの効率性を最大化しながら、アクセシブルで直感的なインターフェースを構築する

### 設計原則

#### 1. 一貫性（Consistency）
全てのプロダクトとプラットフォームで統一された体験を提供。Design Tokensを単一の真実の情報源として活用し、視覚的・機能的一貫性を保証。

#### 2. アクセシビリティ（Accessibility）
WCAG 2.1 AAレベルを最低基準とし、全てのユーザーが平等にアクセスできるインターフェースを設計。

#### 3. 効率性（Efficiency）
業務効率を最大化するために、最小限のクリック数で目標を達成できるワークフロー設計。

#### 4. 拡張性（Scalability）
新しい機能や要件に柔軟に対応できる、モジュラーで拡張可能なコンポーネント設計。

#### 5. 美しさ（Beauty）
機能性を損なうことなく、視覚的に魅力的で現代的なデザイン。

## ブランド・アイデンティティ

### カラーパレット

#### プライマリカラー
**オレンジ (#f97316)**
- 活力、創造性、革新を表現
- メインCTA、重要なアクション、ブランド要素に使用
- 長時間の業務使用を考慮し、アクセントとして控えめに活用

```css
/* プライマリカラーの使用例 */
.primary-button {
  background-color: #f97316;
  color: #ffffff;
}
.primary-link {
  color: #f97316;
}
```

#### セカンダリカラー（ニュートラル）
業務システムのベースとなる落ち着いた色調

```css
:root {
  --neutral-50: #fafafa;   /* 背景 */
  --neutral-100: #f5f5f5;  /* カード背景 */
  --neutral-200: #e5e5e5;  /* ボーダー */
  --neutral-300: #d4d4d4;  /* 非アクティブ要素 */
  --neutral-400: #a3a3a3;  /* プレースホルダー */
  --neutral-500: #737373;  /* セカンダリテキスト */
  --neutral-600: #525252;  /* 本文テキスト */
  --neutral-700: #404040;  /* 見出しテキスト */
  --neutral-800: #262626;  /* タイトル */
  --neutral-900: #171717;  /* 強調テキスト */
}
```

#### セマンティックカラー
情報の意味を色で伝達

```css
:root {
  /* 成功 */
  --success-light: #dcfce7;
  --success-default: #22c55e;
  --success-dark: #15803d;
  
  /* 警告 */
  --warning-light: #fef3c7;
  --warning-default: #eab308;
  --warning-dark: #a16207;
  
  /* エラー */
  --error-light: #fef2f2;
  --error-default: #ef4444;
  --error-dark: #dc2626;
  
  /* 情報 */
  --info-light: #dbeafe;
  --info-default: #3b82f6;
  --info-dark: #1d4ed8;
}
```

### タイポグラフィシステム

#### フォントファミリー
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
```

#### フォントスケール
```css
:root {
  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px - キャプション */
  --font-size-sm: 0.875rem;   /* 14px - 小さなテキスト */
  --font-size-base: 1rem;     /* 16px - 基本テキスト */
  --font-size-lg: 1.125rem;   /* 18px - 大きなテキスト */
  --font-size-xl: 1.25rem;    /* 20px - 小見出し */
  --font-size-2xl: 1.5rem;    /* 24px - 中見出し */
  --font-size-3xl: 1.875rem;  /* 30px - 大見出し */
  --font-size-4xl: 2.25rem;   /* 36px - タイトル */
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

#### 見出しヒエラルキー
```css
h1, .heading-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--neutral-900);
  margin-bottom: 1.5rem;
}

h2, .heading-2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--neutral-800);
  margin-bottom: 1rem;
}

h3, .heading-3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--neutral-700);
  margin-bottom: 0.75rem;
}

.body-large {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-normal);
  color: var(--neutral-600);
}

.body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--neutral-600);
}

.body-small {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--neutral-500);
}

.caption {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
  color: var(--neutral-400);
}
```

### スペーシングシステム

#### 8pxグリッドシステム
```css
:root {
  --space-1: 0.125rem;  /* 2px */
  --space-2: 0.25rem;   /* 4px */
  --space-3: 0.375rem;  /* 6px */
  --space-4: 0.5rem;    /* 8px - ベースユニット */
  --space-6: 0.75rem;   /* 12px */
  --space-8: 1rem;      /* 16px */
  --space-10: 1.25rem;  /* 20px */
  --space-12: 1.5rem;   /* 24px */
  --space-16: 2rem;     /* 32px */
  --space-20: 2.5rem;   /* 40px */
  --space-24: 3rem;     /* 48px */
  --space-32: 4rem;     /* 64px */
  --space-40: 5rem;     /* 80px */
  --space-48: 6rem;     /* 96px */
  --space-64: 8rem;     /* 128px */
}
```

#### コンポーネント間隔ガイドライン
```css
/* コンポーネント内の要素間隔 */
.component-spacing-tight { gap: var(--space-2); }
.component-spacing-normal { gap: var(--space-4); }
.component-spacing-loose { gap: var(--space-8); }

/* セクション間隔 */
.section-spacing-small { margin-bottom: var(--space-16); }
.section-spacing-medium { margin-bottom: var(--space-24); }
.section-spacing-large { margin-bottom: var(--space-32); }

/* レイアウト間隔 */
.layout-padding-small { padding: var(--space-12); }
.layout-padding-medium { padding: var(--space-16); }
.layout-padding-large { padding: var(--space-24); }
```

### シャドウ・エレベーション

#### エレベーションシステム
```css
:root {
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Border Radius */
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;   /* 完全な円形 */
}
```

#### 使用ガイドライン
```css
/* カード・コンテナ */
.card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* モーダル・ダイアログ */
.modal {
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
}

/* ボタン */
.button {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* 入力フィールド */
.input {
  border-radius: var(--radius-md);
}
```

## レスポンシブブレークポイント

### ブレークポイント定義
```css
:root {
  /* Breakpoints */
  --breakpoint-sm: 640px;   /* スマートフォン */
  --breakpoint-md: 768px;   /* タブレット */
  --breakpoint-lg: 1024px;  /* デスクトップ */
  --breakpoint-xl: 1280px;  /* 大型デスクトップ */
  --breakpoint-2xl: 1536px; /* 超大型ディスプレイ */
}

/* Media Queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### レスポンシブガイドライン

#### モバイルファースト設計
```css
/* モバイルベース（320px-639px） */
.responsive-container {
  padding: var(--space-4);
  font-size: var(--font-size-sm);
}

/* タブレット（640px-767px） */
@media (min-width: 640px) {
  .responsive-container {
    padding: var(--space-6);
    font-size: var(--font-size-base);
  }
}

/* デスクトップ（768px以上） */
@media (min-width: 768px) {
  .responsive-container {
    padding: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## コンポーネントライブラリ

### フォーム・入力コンポーネント

#### Button
```html
<!-- Primary Button -->
<button class="btn btn-primary">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  Secondary Action
</button>

<!-- Outline Button -->
<button class="btn btn-outline">
  Outline Action
</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">
  Ghost Action
</button>

<!-- Danger Button -->
<button class="btn btn-danger">
  Delete
</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: 1.25;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 40px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #f97316;
  color: white;
  border-color: #f97316;
}

.btn-primary:hover:not(:disabled) {
  background-color: #ea580c;
  border-color: #ea580c;
}

.btn-secondary {
  background-color: var(--neutral-100);
  color: var(--neutral-700);
  border-color: var(--neutral-200);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--neutral-200);
}

.btn-outline {
  background-color: transparent;
  color: #f97316;
  border-color: #f97316;
}

.btn-outline:hover:not(:disabled) {
  background-color: #fff7ed;
}

.btn-ghost {
  background-color: transparent;
  color: var(--neutral-600);
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--neutral-100);
}

.btn-danger {
  background-color: var(--error-default);
  color: white;
  border-color: var(--error-default);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--error-dark);
  border-color: var(--error-dark);
}

/* Button Sizes */
.btn-sm {
  min-height: 32px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
}

.btn-lg {
  min-height: 48px;
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-lg);
}
```

#### Input Field
```html
<!-- Basic Input -->
<div class="input-group">
  <label for="email" class="input-label">Email Address</label>
  <input type="email" id="email" class="input" placeholder="you@example.com">
</div>

<!-- Input with Error -->
<div class="input-group">
  <label for="password" class="input-label">Password</label>
  <input type="password" id="password" class="input input-error" placeholder="Enter password">
  <div class="input-error-message">Password must be at least 8 characters</div>
</div>

<!-- Input with Icon -->
<div class="input-group">
  <label for="search" class="input-label">Search</label>
  <div class="input-wrapper">
    <input type="search" id="search" class="input input-with-icon" placeholder="Search...">
    <div class="input-icon">🔍</div>
  </div>
</div>
```

```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.input {
  width: 100%;
  height: 40px;
  padding: var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  background-color: white;
  color: var(--neutral-800);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.input:disabled {
  background-color: var(--neutral-50);
  color: var(--neutral-400);
  cursor: not-allowed;
}

.input-error {
  border-color: var(--error-default);
}

.input-error:focus {
  border-color: var(--error-default);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-error-message {
  font-size: var(--font-size-sm);
  color: var(--error-default);
}

.input-wrapper {
  position: relative;
}

.input-with-icon {
  padding-right: 40px;
}

.input-icon {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--neutral-400);
  pointer-events: none;
}
```

#### Checkbox & Radio
```html
<!-- Checkbox -->
<div class="checkbox-group">
  <label class="checkbox-label">
    <input type="checkbox" class="checkbox-input">
    <span class="checkbox-custom"></span>
    <span class="checkbox-text">I agree to the terms and conditions</span>
  </label>
</div>

<!-- Radio Group -->
<div class="radio-group">
  <div class="radio-group-label">Payment Method</div>
  <label class="radio-label">
    <input type="radio" name="payment" value="credit" class="radio-input">
    <span class="radio-custom"></span>
    <span class="radio-text">Credit Card</span>
  </label>
  <label class="radio-label">
    <input type="radio" name="payment" value="bank" class="radio-input">
    <span class="radio-custom"></span>
    <span class="radio-text">Bank Transfer</span>
  </label>
</div>
```

```css
.checkbox-group, .radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.checkbox-label, .radio-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.checkbox-input, .radio-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-custom, .radio-custom {
  width: 16px;
  height: 16px;
  border: 2px solid var(--neutral-400);
  border-radius: var(--radius-sm);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.radio-custom {
  border-radius: 50%;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #f97316;
  border-color: #f97316;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.radio-input:checked + .radio-custom {
  border-color: #f97316;
}

.radio-input:checked + .radio-custom::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f97316;
}

.checkbox-text, .radio-text {
  line-height: 1.4;
}

.radio-group-label {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
  margin-bottom: var(--space-1);
}
```

### レイアウト・構造コンポーネント

#### Card
```html
<!-- Basic Card -->
<div class="card">
  <div class="card-content">
    <h3>Card Title</h3>
    <p>Card content goes here.</p>
  </div>
</div>

<!-- Card with Header and Footer -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Employee Information</h3>
  </div>
  <div class="card-content">
    <p>Employee details and information...</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-ghost">Cancel</button>
    <button class="btn btn-primary">Save</button>
  </div>
</div>
```

```css
.card {
  background-color: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--neutral-200);
  background-color: var(--neutral-50);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
}

.card-content {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--neutral-200);
  background-color: var(--neutral-25);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

#### Grid System
```html
<!-- Responsive Grid -->
<div class="grid">
  <div class="grid-item">Content 1</div>
  <div class="grid-item">Content 2</div>
  <div class="grid-item">Content 3</div>
  <div class="grid-item">Content 4</div>
</div>

<!-- 12 Column Grid -->
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">Column 1</div>
    <div class="col-12 col-md-6 col-lg-4">Column 2</div>
    <div class="col-12 col-md-12 col-lg-4">Column 3</div>
  </div>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
}

.grid-item {
  min-height: 100px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 calc(var(--space-2) * -1);
}

[class*="col-"] {
  padding: 0 var(--space-2);
  width: 100%;
}

.col-1 { width: 8.333333%; }
.col-2 { width: 16.666667%; }
.col-3 { width: 25%; }
.col-4 { width: 33.333333%; }
.col-6 { width: 50%; }
.col-8 { width: 66.666667%; }
.col-9 { width: 75%; }
.col-12 { width: 100%; }

@media (min-width: 768px) {
  .col-md-1 { width: 8.333333%; }
  .col-md-2 { width: 16.666667%; }
  .col-md-3 { width: 25%; }
  .col-md-4 { width: 33.333333%; }
  .col-md-6 { width: 50%; }
  .col-md-8 { width: 66.666667%; }
  .col-md-9 { width: 75%; }
  .col-md-12 { width: 100%; }
}

@media (min-width: 1024px) {
  .col-lg-1 { width: 8.333333%; }
  .col-lg-2 { width: 16.666667%; }
  .col-lg-3 { width: 25%; }
  .col-lg-4 { width: 33.333333%; }
  .col-lg-6 { width: 50%; }
  .col-lg-8 { width: 66.666667%; }
  .col-lg-9 { width: 75%; }
  .col-lg-12 { width: 100%; }
}
```

### ナビゲーションコンポーネント

#### Navigation Menu
```html
<!-- Horizontal Navigation -->
<nav class="nav-horizontal">
  <div class="nav-brand">
    <a href="/" class="nav-logo">ITDO</a>
  </div>
  <ul class="nav-menu">
    <li class="nav-item">
      <a href="/dashboard" class="nav-link nav-link-active">Dashboard</a>
    </li>
    <li class="nav-item">
      <a href="/products" class="nav-link">Products</a>
    </li>
    <li class="nav-item">
      <a href="/orders" class="nav-link">Orders</a>
    </li>
  </ul>
  <div class="nav-actions">
    <button class="btn btn-ghost">Settings</button>
    <button class="btn btn-primary">Upgrade</button>
  </div>
</nav>

<!-- Vertical Sidebar -->
<aside class="nav-sidebar">
  <div class="nav-sidebar-header">
    <div class="nav-logo">ITDO ERP</div>
  </div>
  <nav class="nav-sidebar-menu">
    <ul class="nav-sidebar-list">
      <li class="nav-sidebar-item">
        <a href="/dashboard" class="nav-sidebar-link nav-sidebar-link-active">
          <span class="nav-sidebar-icon">📊</span>
          <span class="nav-sidebar-text">Dashboard</span>
        </a>
      </li>
      <li class="nav-sidebar-item">
        <details class="nav-sidebar-dropdown">
          <summary class="nav-sidebar-link">
            <span class="nav-sidebar-icon">💰</span>
            <span class="nav-sidebar-text">Sales</span>
            <span class="nav-sidebar-arrow">▼</span>
          </summary>
          <ul class="nav-sidebar-submenu">
            <li><a href="/orders" class="nav-sidebar-sublink">Orders</a></li>
            <li><a href="/customers" class="nav-sidebar-sublink">Customers</a></li>
            <li><a href="/invoices" class="nav-sidebar-sublink">Invoices</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </nav>
</aside>
```

```css
/* Horizontal Navigation */
.nav-horizontal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--space-6);
  background-color: white;
  border-bottom: 1px solid var(--neutral-200);
}

.nav-logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: #f97316;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-8);
}

.nav-link {
  display: block;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-600);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--neutral-800);
  background-color: var(--neutral-100);
}

.nav-link-active {
  color: #f97316;
  background-color: #fff7ed;
}

.nav-actions {
  display: flex;
  gap: var(--space-3);
}

/* Vertical Sidebar */
.nav-sidebar {
  width: 280px;
  height: 100vh;
  background-color: white;
  border-right: 1px solid var(--neutral-200);
  display: flex;
  flex-direction: column;
}

.nav-sidebar-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--neutral-200);
}

.nav-sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4) 0;
}

.nav-sidebar-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  text-decoration: none;
  transition: all 0.2s ease;
  border-right: 3px solid transparent;
}

.nav-sidebar-link:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-800);
}

.nav-sidebar-link-active {
  background-color: #fff7ed;
  color: #f97316;
  border-right-color: #f97316;
}

.nav-sidebar-icon {
  font-size: 16px;
  width: 16px;
  text-align: center;
}

.nav-sidebar-arrow {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.2s ease;
}

.nav-sidebar-dropdown[open] .nav-sidebar-arrow {
  transform: rotate(180deg);
}

.nav-sidebar-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-left: var(--space-12);
}

.nav-sidebar-sublink {
  display: block;
  padding: var(--space-2) var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--neutral-500);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-sidebar-sublink:hover {
  color: var(--neutral-700);
  background-color: var(--neutral-50);
}
```

#### Breadcrumbs
```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item">
      <a href="/" class="breadcrumb-link">Home</a>
    </li>
    <li class="breadcrumb-item">
      <a href="/products" class="breadcrumb-link">Products</a>
    </li>
    <li class="breadcrumb-item">
      <span class="breadcrumb-current" aria-current="page">Product Details</span>
    </li>
  </ol>
</nav>
```

```css
.breadcrumb {
  padding: var(--space-4) 0;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-2);
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  margin-left: var(--space-2);
  color: var(--neutral-400);
}

.breadcrumb-link {
  font-size: var(--font-size-sm);
  color: var(--neutral-500);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #f97316;
}

.breadcrumb-current {
  font-size: var(--font-size-sm);
  color: var(--neutral-800);
  font-weight: var(--font-weight-medium);
}
```

### メッセージ・フィードバックコンポーネント

#### Alert Messages
```html
<!-- Success Alert -->
<div class="alert alert-success" role="alert">
  <div class="alert-icon">✓</div>
  <div class="alert-content">
    <div class="alert-title">Success!</div>
    <div class="alert-message">Your changes have been saved successfully.</div>
  </div>
  <button class="alert-close" aria-label="Close alert">&times;</button>
</div>

<!-- Warning Alert -->
<div class="alert alert-warning" role="alert">
  <div class="alert-icon">⚠</div>
  <div class="alert-content">
    <div class="alert-title">Warning</div>
    <div class="alert-message">Please review your input before proceeding.</div>
  </div>
</div>

<!-- Error Alert -->
<div class="alert alert-error" role="alert">
  <div class="alert-icon">✕</div>
  <div class="alert-content">
    <div class="alert-title">Error</div>
    <div class="alert-message">Something went wrong. Please try again.</div>
  </div>
</div>

<!-- Info Alert -->
<div class="alert alert-info" role="alert">
  <div class="alert-icon">ℹ</div>
  <div class="alert-content">
    <div class="alert-message">New features are now available in this section.</div>
  </div>
</div>
```

```css
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid;
}

.alert-success {
  background-color: var(--success-light);
  border-color: var(--success-default);
  color: var(--success-dark);
}

.alert-warning {
  background-color: var(--warning-light);
  border-color: var(--warning-default);
  color: var(--warning-dark);
}

.alert-error {
  background-color: var(--error-light);
  border-color: var(--error-default);
  color: var(--error-dark);
}

.alert-info {
  background-color: var(--info-light);
  border-color: var(--info-default);
  color: var(--info-dark);
}

.alert-icon {
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  margin-top: 2px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-1);
}

.alert-message {
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.alert-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.alert-close:hover {
  opacity: 1;
}
```

#### Modal Dialog
```html
<!-- Modal Overlay -->
<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal">
    <div class="modal-header">
      <h2 id="modal-title" class="modal-title">Confirm Action</h2>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete this item? This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-danger">Delete</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}

.modal {
  background-color: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  color: var(--neutral-400);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-600);
}

.modal-body {
  padding: var(--space-6);
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--neutral-200);
  background-color: var(--neutral-25);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

### ステータス・インジケーターコンポーネント

#### Badge
```html
<!-- Number Badge -->
<span class="badge badge-primary">12</span>
<span class="badge badge-secondary">New</span>

<!-- Status Badge -->
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Error</span>

<!-- Notification Badge -->
<button class="btn btn-ghost" style="position: relative;">
  Notifications
  <span class="badge badge-error badge-notification">3</span>
</button>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  border-radius: var(--radius-full);
  text-align: center;
  white-space: nowrap;
  min-width: 20px;
}

.badge-primary {
  background-color: #f97316;
  color: white;
}

.badge-secondary {
  background-color: var(--neutral-200);
  color: var(--neutral-700);
}

.badge-success {
  background-color: var(--success-default);
  color: white;
}

.badge-warning {
  background-color: var(--warning-default);
  color: white;
}

.badge-error {
  background-color: var(--error-default);
  color: white;
}

.badge-notification {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 var(--space-1);
}
```

#### Progress Bar
```html
<!-- Basic Progress -->
<div class="progress">
  <div class="progress-bar" style="width: 75%;" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
</div>

<!-- Progress with Label -->
<div class="progress-group">
  <div class="progress-labels">
    <span>Upload Progress</span>
    <span>75%</span>
  </div>
  <div class="progress">
    <div class="progress-bar progress-bar-success" style="width: 75%;"></div>
  </div>
</div>

<!-- Small Progress -->
<div class="progress progress-sm">
  <div class="progress-bar" style="width: 45%;"></div>
</div>
```

```css
.progress-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.progress {
  width: 100%;
  height: 8px;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-sm {
  height: 4px;
}

.progress-bar {
  height: 100%;
  background-color: #f97316;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-bar-success {
  background-color: var(--success-default);
}

.progress-bar-warning {
  background-color: var(--warning-default);
}

.progress-bar-error {
  background-color: var(--error-default);
}
```

#### Tag
```html
<!-- Basic Tags -->
<span class="tag">Design</span>
<span class="tag">Development</span>
<span class="tag">Research</span>

<!-- Colored Tags -->
<span class="tag tag-primary">Priority</span>
<span class="tag tag-success">Completed</span>
<span class="tag tag-warning">In Review</span>

<!-- Removable Tags -->
<span class="tag tag-removable">
  Frontend
  <button class="tag-remove" aria-label="Remove tag">&times;</button>
</span>
```

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background-color: var(--neutral-100);
  color: var(--neutral-700);
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-200);
}

.tag-primary {
  background-color: #fff7ed;
  color: #f97316;
  border-color: #fed7aa;
}

.tag-success {
  background-color: var(--success-light);
  color: var(--success-dark);
  border-color: var(--success-default);
}

.tag-warning {
  background-color: var(--warning-light);
  color: var(--warning-dark);
  border-color: var(--warning-default);
}

.tag-remove {
  background: none;
  border: none;
  padding: 0;
  margin-left: var(--space-1);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.tag-remove:hover {
  opacity: 1;
}
```

## アクセシビリティガイドライン

### キーボードナビゲーション
```css
/* Focus Ring */
*:focus {
  outline: 2px solid #f97316;
  outline-offset: 2px;
}

/* Skip to Content Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #f97316;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 100;
}

.skip-link:focus {
  top: 6px;
}
```

### スクリーンリーダー対応
```html
<!-- Hidden Text for Screen Readers -->
<span class="sr-only">Screen reader only text</span>

<!-- Proper Labeling -->
<button aria-label="Close dialog" class="modal-close">&times;</button>

<!-- Descriptive Links -->
<a href="/products" aria-describedby="products-desc">
  Products
  <span id="products-desc" class="sr-only">View all products in our catalog</span>
</a>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### カラーコントラスト
```css
/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .btn {
    border-width: 2px;
  }
  
  .card {
    border-width: 2px;
  }
  
  .input {
    border-width: 2px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## アニメーション・モーション

### 基本アニメーション
```css
:root {
  /* Animation Durations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  
  /* Easing Functions */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* Hover Animations */
.btn, .card, .input {
  transition: all var(--duration-fast) var(--ease-out);
}

/* Loading Animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

/* Slide In Animation */
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.slide-in-right {
  animation: slideInRight var(--duration-normal) var(--ease-out);
}
```

## ダークモード対応

### カラートークン（ダークモード）
```css
:root {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
  
  /* Dark Mode Colors */
  --neutral-50: #1a1a1a;
  --neutral-100: #262626;
  --neutral-200: #404040;
  --neutral-300: #525252;
  --neutral-400: #737373;
  --neutral-500: #a3a3a3;
  --neutral-600: #d4d4d4;
  --neutral-700: #e5e5e5;
  --neutral-800: #f5f5f5;
  --neutral-900: #fafafa;
  
  /* Primary Colors remain the same for brand consistency */
  /* Semantic colors may need adjustment for better contrast */
  --success-light: #065f46;
  --warning-light: #92400e;
  --error-light: #991b1b;
  --info-light: #1e40af;
}

/* Dark Mode Specific Styles */
[data-theme="dark"] .card {
  background-color: var(--neutral-100);
  border-color: var(--neutral-200);
}

[data-theme="dark"] .input {
  background-color: var(--neutral-100);
  border-color: var(--neutral-200);
  color: var(--neutral-800);
}

[data-theme="dark"] .input::placeholder {
  color: var(--neutral-400);
}
```

### テーマ切り替え
```javascript
// Theme Toggle Function
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize Theme
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', theme);
}

// Listen for System Theme Changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

// Initialize on load
initializeTheme();
```

## 国際化対応

### 多言語テキスト
```css
/* Language-specific Font Stacks */
:lang(ja) {
  font-family: 'Noto Sans JP', var(--font-sans);
}

:lang(ko) {
  font-family: 'Noto Sans KR', var(--font-sans);
}

:lang(zh) {
  font-family: 'Noto Sans SC', var(--font-sans);
}

/* RTL Language Support */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .nav-sidebar {
  border-right: none;
  border-left: 1px solid var(--neutral-200);
}

[dir="rtl"] .breadcrumb-item:not(:last-child)::after {
  content: '\\';
  transform: scaleX(-1);
}
```

### 日付・数値フォーマット
```javascript
// Internationalization Utilities
const formatters = {
  // Date Formatting
  date: new Intl.DateTimeFormat(navigator.language),
  dateTime: new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  
  // Number Formatting
  number: new Intl.NumberFormat(navigator.language),
  currency: new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'JPY'
  }),
  percent: new Intl.NumberFormat(navigator.language, {
    style: 'percent',
    minimumFractionDigits: 1
  })
};

// Usage Examples
console.log(formatters.date.format(new Date())); // 2025/7/16
console.log(formatters.currency.format(123456)); // ¥123,456
console.log(formatters.percent.format(0.125)); // 12.5%
```

## パフォーマンス最適化

### CSS最適化
```css
/* Performance Optimizations */
* {
  box-sizing: border-box;
}

/* GPU Acceleration for Animations */
.btn, .modal, .nav-sidebar {
  transform: translateZ(0);
  will-change: transform;
}

/* Efficient Selectors */
.btn { /* Direct class selector - efficient */ }
.card .btn { /* Specific context - acceptable */ }

/* Avoid */
div.btn { /* Type + class - less efficient */ }
.card > div > .btn { /* Deep nesting - avoid */ }

/* Critical CSS Inlining Candidates */
.btn, .input, .card, .nav-horizontal {
  /* Above-the-fold components */
}
```

### 画像最適化
```css
/* Responsive Images */
.responsive-image {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

/* Lazy Loading */
.lazy-image {
  opacity: 0;
  transition: opacity var(--duration-normal);
}

.lazy-image.loaded {
  opacity: 1;
}

/* WebP Support */
.webp .hero-image {
  background-image: url('hero.webp');
}

.no-webp .hero-image {
  background-image: url('hero.jpg');
}
```

## 実装チェックリスト

### 品質保証チェックリスト

#### アクセシビリティ
- [ ] WCAG 2.1 AA準拠（コントラスト比4.5:1以上）
- [ ] キーボードナビゲーション対応
- [ ] スクリーンリーダー対応（適切なARIA属性）
- [ ] フォーカス管理
- [ ] セマンティックHTML使用

#### レスポンシブデザイン
- [ ] モバイルファースト設計
- [ ] 全ブレークポイントでのテスト
- [ ] タッチターゲットサイズ（最小44px）
- [ ] 横向き表示対応

#### パフォーマンス
- [ ] CSSファイルサイズ最適化
- [ ] 不要なアニメーション削除
- [ ] 効率的なセレクター使用
- [ ] 画像最適化

#### ブラウザサポート
- [ ] Chrome（最新2バージョン）
- [ ] Firefox（最新2バージョン）
- [ ] Safari（最新2バージョン）
- [ ] Edge（最新2バージョン）

### 導入手順

#### 1. 基本設定
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ITDO Application</title>
  <link rel="stylesheet" href="itdo-design-system.css">
</head>
<body>
  <!-- アプリケーションコンテンツ -->
</body>
</html>
```

#### 2. テーマ初期化
```javascript
// テーマとアクセシビリティ設定
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeAccessibility();
});

function initializeAccessibility() {
  // Skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Focus trap for modals
  setupFocusTraps();
}
```

#### 3. コンポーネント統合
```html
<!-- 段階的な導入例 -->
<!-- Phase 1: 基本コンポーネント -->
<button class="btn btn-primary">Get Started</button>

<!-- Phase 2: フォームコンポーネント -->
<div class="input-group">
  <label for="email" class="input-label">Email</label>
  <input type="email" id="email" class="input">
</div>

<!-- Phase 3: レイアウトコンポーネント -->
<div class="card">
  <div class="card-content">
    <!-- カードコンテンツ -->
  </div>
</div>
```

## ガバナンス・メンテナンス

### バージョン管理
```
ITDO Design System v1.0.0
├── Breaking Changes (Major)
├── New Features (Minor)  
└── Bug Fixes (Patch)
```

### コントリビューション規則
1. **新コンポーネント追加**: Design Tokensに基づく実装
2. **既存コンポーネント変更**: 後方互換性の確保
3. **アクセシビリティ**: 全ての変更でWCAG 2.1 AA準拠
4. **テスト**: 視覚回帰テストとアクセシビリティテスト必須

### 更新プロセス
1. **提案**: GitHubイシューでの議論
2. **設計**: デザイントークンとコンポーネント仕様
3. **実装**: プロトタイプとテスト
4. **レビュー**: アクセシビリティと品質チェック
5. **リリース**: ドキュメント更新とアナウンス

---

## 結論

このITDOデザインシステムは、一貫性、アクセシビリティ、効率性を重視したエンタープライズグレードのUIフレームワークです。Atlassianの設計原則を参考に、日本の業務システムに特化した要件を満たすよう設計されています。

このガイドに従うことで、全てのITDOプロダクトで統一された高品質なユーザーインターフェースを構築できます。継続的な改善とコミュニティからのフィードバックにより、このシステムは進化し続けます。

**最終更新**: 2025年7月

## 付録

### A. デザイントークン完全リファレンス

#### A.1 JSON設定ファイル
```json
{
  "color": {
    "brand": {
      "primary": {
        "50": "#fff7ed",
        "100": "#ffedd5", 
        "200": "#fed7aa",
        "300": "#fdba74",
        "400": "#fb923c",
        "500": "#f97316",
        "600": "#ea580c",
        "700": "#c2410c",
        "800": "#9a3412",
        "900": "#7c2d12"
      }
    },
    "neutral": {
      "0": "#ffffff",
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#e5e5e5", 
      "300": "#d4d4d4",
      "400": "#a3a3a3",
      "500": "#737373",
      "600": "#525252",
      "700": "#404040",
      "800": "#262626",
      "900": "#171717",
      "1000": "#000000"
    },
    "semantic": {
      "success": {
        "50": "#f0fdf4",
        "100": "#dcfce7",
        "500": "#22c55e",
        "700": "#15803d",
        "900": "#14532d"
      },
      "warning": {
        "50": "#fffbeb",
        "100": "#fef3c7", 
        "500": "#eab308",
        "700": "#a16207",
        "900": "#713f12"
      },
      "error": {
        "50": "#fef2f2",
        "100": "#fee2e2",
        "500": "#ef4444", 
        "700": "#dc2626",
        "900": "#7f1d1d"
      },
      "info": {
        "50": "#eff6ff",
        "100": "#dbeafe",
        "500": "#3b82f6",
        "700": "#1d4ed8", 
        "900": "#1e3a8a"
      }
    }
  },
  "typography": {
    "fontFamily": {
      "sans": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      "mono": ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      "serif": ["Georgia", "Times New Roman", "serif"]
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem", 
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "thin": "100",
      "light": "300", 
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "extrabold": "800",
      "black": "900"
    },
    "lineHeight": {
      "none": "1",
      "tight": "1.25",
      "snug": "1.375", 
      "normal": "1.5",
      "relaxed": "1.625",
      "loose": "2"
    },
    "letterSpacing": {
      "tighter": "-0.05em",
      "tight": "-0.025em",
      "normal": "0em", 
      "wide": "0.025em",
      "wider": "0.05em",
      "widest": "0.1em"
    }
  },
  "spacing": {
    "0": "0px",
    "px": "1px",
    "0.5": "0.125rem",
    "1": "0.25rem",
    "1.5": "0.375rem", 
    "2": "0.5rem",
    "2.5": "0.625rem",
    "3": "0.75rem", 
    "3.5": "0.875rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
    "11": "2.75rem",
    "12": "3rem",
    "14": "3.5rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "28": "7rem",
    "32": "8rem",
    "36": "9rem",
    "40": "10rem",
    "44": "11rem",
    "48": "12rem",
    "52": "13rem",
    "56": "14rem",
    "60": "15rem",
    "64": "16rem",
    "72": "18rem",
    "80": "20rem",
    "96": "24rem"
  },
  "borderRadius": {
    "none": "0px",
    "sm": "0.125rem",
    "base": "0.25rem",
    "md": "0.375rem", 
    "lg": "0.5rem",
    "xl": "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "full": "9999px"
  },
  "boxShadow": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "base": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    "none": "none"
  },
  "transition": {
    "duration": {
      "75": "75ms",
      "100": "100ms", 
      "150": "150ms",
      "200": "200ms",
      "300": "300ms",
      "500": "500ms",
      "700": "700ms",
      "1000": "1000ms"
    },
    "timing": {
      "linear": "linear",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)", 
      "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  },
  "breakpoint": {
    "sm": "640px",
    "md": "768px", 
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  },
  "zIndex": {
    "0": "0",
    "10": "10",
    "20": "20",
    "30": "30", 
    "40": "40",
    "50": "50",
    "auto": "auto",
    "dropdown": "1000",
    "sticky": "1020", 
    "fixed": "1030",
    "modal": "1040",
    "popover": "1050",
    "tooltip": "1060"
  }
}
```

#### A.2 CSS変数定義
```css
:root {
  /* Colors */
  --color-brand-primary-50: #fff7ed;
  --color-brand-primary-100: #ffedd5;
  --color-brand-primary-200: #fed7aa;
  --color-brand-primary-300: #fdba74;
  --color-brand-primary-400: #fb923c;
  --color-brand-primary-500: #f97316;
  --color-brand-primary-600: #ea580c;
  --color-brand-primary-700: #c2410c;
  --color-brand-primary-800: #9a3412;
  --color-brand-primary-900: #7c2d12;
  
  --color-neutral-0: #ffffff;
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
  --color-neutral-1000: #000000;
  
  /* Semantic Colors */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-500: #22c55e;
  --color-success-700: #15803d;
  --color-success-900: #14532d;
  
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-500: #eab308;
  --color-warning-700: #a16207;
  --color-warning-900: #713f12;
  
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-700: #dc2626;
  --color-error-900: #7f1d1d;
  
  --color-info-50: #eff6ff;
  --color-info-100: #dbeafe;
  --color-info-500: #3b82f6;
  --color-info-700: #1d4ed8;
  --color-info-900: #1e3a8a;
  
  /* Typography */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  --font-family-serif: Georgia, 'Times New Roman', serif;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
  
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
  
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
  
  /* Spacing */
  --spacing-0: 0px;
  --spacing-px: 1px;
  --spacing-0_5: 0.125rem;
  --spacing-1: 0.25rem;
  --spacing-1_5: 0.375rem;
  --spacing-2: 0.5rem;
  --spacing-2_5: 0.625rem;
  --spacing-3: 0.75rem;
  --spacing-3_5: 0.875rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-7: 1.75rem;
  --spacing-8: 2rem;
  --spacing-9: 2.25rem;
  --spacing-10: 2.5rem;
  --spacing-11: 2.75rem;
  --spacing-12: 3rem;
  --spacing-14: 3.5rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-28: 7rem;
  --spacing-32: 8rem;
  --spacing-36: 9rem;
  --spacing-40: 10rem;
  --spacing-44: 11rem;
  --spacing-48: 12rem;
  --spacing-52: 13rem;
  --spacing-56: 14rem;
  --spacing-60: 15rem;
  --spacing-64: 16rem;
  --spacing-72: 18rem;
  --spacing-80: 20rem;
  --spacing-96: 24rem;
  
  /* Border Radius */
  --border-radius-none: 0px;
  --border-radius-sm: 0.125rem;
  --border-radius-base: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  --border-radius-2xl: 1rem;
  --border-radius-3xl: 1.5rem;
  --border-radius-full: 9999px;
  
  /* Box Shadow */
  --box-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --box-shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --box-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --box-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --box-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --box-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --box-shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --box-shadow-none: none;
  
  /* Transitions */
  --transition-duration-75: 75ms;
  --transition-duration-100: 100ms;
  --transition-duration-150: 150ms;
  --transition-duration-200: 200ms;
  --transition-duration-300: 300ms;
  --transition-duration-500: 500ms;
  --transition-duration-700: 700ms;
  --transition-duration-1000: 1000ms;
  
  --transition-timing-linear: linear;
  --transition-timing-in: cubic-bezier(0.4, 0, 1, 1);
  --transition-timing-out: cubic-bezier(0, 0, 0.2, 1);
  --transition-timing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  
  /* Z-Index */
  --z-index-0: 0;
  --z-index-10: 10;
  --z-index-20: 20;
  --z-index-30: 30;
  --z-index-40: 40;
  --z-index-50: 50;
  --z-index-auto: auto;
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal: 1040;
  --z-index-popover: 1050;
  --z-index-tooltip: 1060;
}
```

### B. アクセシビリティテストガイド

#### B.1 自動テストツール
```javascript
// axe-core を使用したアクセシビリティテスト
import axe from 'axe-core';

async function runAccessibilityTest(element = document) {
  try {
    const results = await axe.run(element, {
      rules: {
        // WCAG 2.1 AA レベル
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true }
      }
    });
    
    if (results.violations.length > 0) {
      console.error('Accessibility violations found:', results.violations);
      return false;
    }
    
    console.log('All accessibility tests passed');
    return true;
  } catch (error) {
    console.error('Accessibility test failed:', error);
    return false;
  }
}

// 使用例
runAccessibilityTest();
```

#### B.2 手動テストチェックリスト
```markdown
### キーボードナビゲーション
- [ ] Tab キーで全てのインタラクティブ要素にアクセス可能
- [ ] Shift+Tab で逆順ナビゲーション可能
- [ ] Enter/Space キーでボタン・リンクを起動可能
- [ ] Arrow キーでメニュー・タブ間移動可能
- [ ] Escape キーでモーダル・ドロップダウンを閉じる可能

### スクリーンリーダー
- [ ] 全ての画像に適切な alt 属性
- [ ] フォーム要素に関連するラベル
- [ ] 見出しの論理的な階層構造
- [ ] ページの主要部分に landmark ロール
- [ ] 動的コンテンツの変更通知

### カラーコントラスト
- [ ] 通常テキスト: 4.5:1 以上
- [ ] 大きなテキスト: 3:1 以上
- [ ] 非テキスト要素: 3:1 以上
- [ ] 色以外の手段での情報伝達

### モーションと音声
- [ ] prefers-reduced-motion 対応
- [ ] 自動再生される音声なし
- [ ] 点滅・フラッシュ効果なし（3Hz以下）
```

#### B.3 スクリーンリーダーテスト手順
```markdown
### NVDA (Windows) テスト手順
1. NVDA を起動
2. ページを読み上げモードで確認
3. Tab キーでナビゲーション確認
4. フォーム操作の音声確認
5. テーブル・リストの構造確認

### VoiceOver (macOS) テスト手順  
1. VoiceOver を起動 (Cmd+F5)
2. ローター機能で要素タイプ別確認
3. Control+Option+Arrow でナビゲーション
4. 見出し・ランドマーク・フォーム要素の確認
5. 表の行・列ヘッダー読み上げ確認

### 音声コマンド (Windows Speech Recognition)
1. 音声認識を起動
2. "Click [要素名]" でクリック操作確認  
3. "Select [テキスト]" でテキスト選択確認
4. 複雑な操作の音声実行確認
```

### C. パフォーマンス最適化ガイド

#### C.1 Critical CSS
```css
/* Above-the-fold styles - inline in <head> */
.btn,
.input, 
.card,
.nav-horizontal,
.container,
.heading-1,
.heading-2,
.body {
  /* Critical styles only */
}

/* Non-critical styles - load asynchronously */
.modal,
.dropdown,
.tooltip,
.animation-* {
  /* Defer loading */
}
```

#### C.2 CSS最適化技術
```css
/* GPU加速が有効な要素 */
.will-change-transform {
  will-change: transform;
  transform: translateZ(0);
}

/* Containment for performance */
.component-boundary {
  contain: layout style paint;
}

/* Efficient selectors */
/* Good */
.btn { }
.btn--primary { }
.card__header { }

/* Avoid */
div.btn { }
.card > div > .btn { }
#content .sidebar .nav .item { }

/* Font loading optimization */
@font-face {
  font-family: 'Inter';
  src: url('inter.woff2') format('woff2');
  font-display: swap; /* FOIT → FOUT */
  unicode-range: U+0020-007F; /* Basic Latin */
}
```

#### C.3 画像最適化
```html
<!-- Responsive Images -->
<picture>
  <source media="(min-width: 768px)" srcset="hero-large.webp" type="image/webp">
  <source media="(min-width: 768px)" srcset="hero-large.jpg">
  <source srcset="hero-small.webp" type="image/webp">
  <img src="hero-small.jpg" alt="Hero image" loading="lazy">
</picture>

<!-- SVG Icons -->
<svg class="icon" aria-hidden="true" focusable="false">
  <use href="#icon-search"></use>
</svg>
```

### D. 国際化実装詳細

#### D.1 多言語フォント設定
```css
/* 日本語 */
:lang(ja) {
  font-family: 
    'Noto Sans JP',
    'Hiragino Kaku Gothic ProN',
    'Yu Gothic',
    'Meiryo',
    var(--font-family-sans);
}

/* 韓国語 */
:lang(ko) {
  font-family: 
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple SD Gothic Neo',
    var(--font-family-sans);
}

/* 中国語（簡体字） */
:lang(zh-CN) {
  font-family: 
    'Noto Sans SC',
    'PingFang SC',
    'Microsoft YaHei',
    var(--font-family-sans);
}

/* 中国語（繁体字） */
:lang(zh-TW) {
  font-family: 
    'Noto Sans TC',
    'PingFang TC',
    'Microsoft JhengHei',
    var(--font-family-sans);
}

/* アラビア語 */
:lang(ar) {
  font-family: 
    'Noto Sans Arabic',
    'Arial',
    var(--font-family-sans);
  direction: rtl;
}

/* ヘブライ語 */
:lang(he) {
  font-family: 
    'Noto Sans Hebrew',
    'Arial Hebrew',
    var(--font-family-sans);
  direction: rtl;
}
```

#### D.2 RTLレイアウト対応
```css
/* Logical Properties for RTL Support */
.component {
  margin-inline-start: var(--spacing-4);
  margin-inline-end: var(--spacing-2);
  padding-inline: var(--spacing-4);
  border-inline-start: 1px solid var(--color-neutral-200);
}

/* RTL-specific adjustments */
[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);
}

[dir="rtl"] .nav-sidebar {
  border-inline-start: none;
  border-inline-end: 1px solid var(--color-neutral-200);
}

[dir="rtl"] .breadcrumb-item:not(:last-child)::after {
  content: '\\';
}

/* Float adjustments */
[dir="ltr"] .float-start { float: left; }
[dir="ltr"] .float-end { float: right; }
[dir="rtl"] .float-start { float: right; }
[dir="rtl"] .float-end { float: left; }
```

#### D.3 文字数・文字幅への対応
```css
/* 長い言語（ドイツ語など）への対応 */
.btn {
  min-width: auto;
  white-space: normal;
  word-wrap: break-word;
}

/* 短い言語（中国語など）への対応 */
.text-content {
  line-height: var(--line-height-relaxed);
  word-spacing: 0.1em;
}

/* 縦書き対応（日本語） */
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

/* 数字の表示形式 */
.numeric {
  font-feature-settings: 'tnum' 1; /* Tabular numbers */
  font-variant-numeric: tabular-nums;
}
```

### E. ブラウザサポートマトリックス

#### E.1 対応ブラウザ一覧
| ブラウザ | バージョン | サポート状況 | 注意事項 |
|---------|------------|-------------|----------|
| Chrome | 88+ | ✅ Full | - |
| Firefox | 85+ | ✅ Full | - |
| Safari | 14+ | ✅ Full | -webkit-前置詞必要な場合あり |
| Edge | 88+ | ✅ Full | - |
| Opera | 74+ | ✅ Full | - |
| Samsung Internet | 13+ | ⚠️ Partial | 一部CSS機能制限 |
| IE 11 | - | ❌ Not Supported | サポート終了 |

#### E.2 フィーチャーサポート
```css
/* CSS Grid Fallback */
.grid-container {
  display: block; /* Fallback */
  display: grid;
}

/* CSS Custom Properties Fallback */
.btn-primary {
  background-color: #f97316; /* Fallback */
  background-color: var(--color-brand-primary-500);
}

/* Flexbox Gap Fallback */
.flex-container {
  display: flex;
}

.flex-container > * + * {
  margin-left: 1rem; /* Fallback for gap */
}

@supports (gap: 1rem) {
  .flex-container {
    gap: 1rem;
  }
  
  .flex-container > * + * {
    margin-left: 0;
  }
}

/* Backdrop Filter Fallback */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5); /* Fallback */
}

@supports (backdrop-filter: blur(4px)) {
  .modal-backdrop {
    backdrop-filter: blur(4px);
    background-color: rgba(0, 0, 0, 0.3);
  }
}
```

#### E.3 Progressive Enhancement
```css
/* Base styles - work everywhere */
.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
}

/* Enhanced styles - modern browsers */
@supports (display: flex) {
  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

@supports (border-radius: 0.5rem) {
  .btn {
    border-radius: 0.5rem;
  }
}

@supports (box-shadow: 0 2px 4px rgba(0,0,0,0.1)) {
  .btn {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .btn:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
}
```

### F. セキュリティ考慮事項

#### F.1 Content Security Policy
```html
<!-- CSP Headers for Design System -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  font-src 'self' data: fonts.googleapis.com fonts.gstatic.com;
  img-src 'self' data: blob:;
  script-src 'self';
  connect-src 'self';
">
```

#### F.2 XSS対策
```javascript
// HTMLエスケープ関数
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, m => map[m]);
}

// 安全なDOM操作
function setTextContent(element, text) {
  element.textContent = text; // innerHTML ではなく textContent 使用
}

// 信頼できないCSSの無効化
function sanitizeCSSValue(value) {
  // expression(), javascript:, data: の除去
  return value.replace(/(expression|javascript|data):/gi, '');
}
```

#### F.3 プライバシー保護
```css
/* プリントスタイルでの情報保護 */
@media print {
  .sensitive-info,
  .personal-data,
  .financial-data {
    display: none !important;
  }
  
  .redact {
    background: #000 !important;
    color: #000 !important;
  }
}

/* スクリーンショット対策（実験的） */
@media (display-mode: standalone) {
  .sensitive-content {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
}
```

### G. 開発環境セットアップ

#### G.1 必要なツール
```json
{
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0", 
    "postcss-preset-env": "^7.0.0",
    "stylelint": "^14.0.0",
    "stylelint-config-standard": "^24.0.0",
    "stylelint-order": "^5.0.0",
    "sass": "^1.45.0",
    "cssnano": "^5.0.0",
    "purgecss": "^4.1.0"
  }
}
```

#### G.2 ビルド設定
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'custom-properties': false,
        'logical-properties-and-values': true
      }
    }),
    process.env.NODE_ENV === 'production' && require('cssnano')({
      preset: 'default'
    })
  ].filter(Boolean)
};

// stylelint.config.js  
module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?,
    'custom-property-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*,
    'declaration-block-no-redundant-longhand-properties': true,
    'shorthand-property-no-redundant-values': true
  }
};
```

#### G.3 自動化ワークフロー
```yaml
# .github/workflows/design-system.yml
name: Design System CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint CSS
      run: npm run lint:css
    
    - name: Build CSS
      run: npm run build:css
    
    - name: Run accessibility tests
      run: npm run test:a11y
    
    - name: Visual regression tests
      run: npm run test:visual
      
    - name: Performance audit
      run: npm run audit:performance
```

### H. 変更管理・ガバナンス

#### H.1 変更要求プロセス
```markdown
### 変更要求フロー
1. **Issue作成**: GitHub Issueで変更内容を詳述
2. **影響度評価**: 破壊的変更か否かの判定
3. **設計レビュー**: デザインチームによる設計確認
4. **実装**: プロトタイプ作成と動作確認
5. **アクセシビリティチェック**: WCAG準拠確認
6. **パフォーマンステスト**: レンダリング性能確認
7. **ドキュメント更新**: 使用方法とマイグレーション手順
8. **リリース**: セマンティックバージョニングでリリース

### 承認権限
- **Minor変更**: 開発チームリード承認
- **Major変更**: プロダクトオーナー + デザインリード承認
- **Breaking Change**: 全ステークホルダー承認必須
```

#### H.2 バージョニング戦略
```
Design System Version: MAJOR.MINOR.PATCH

MAJOR: 破壊的変更
- コンポーネントAPI変更
- CSS クラス名変更
- トークン値の大幅変更

MINOR: 新機能追加
- 新コンポーネント追加
- 既存コンポーネントの新プロパティ
- 新しいトークン追加

PATCH: バグ修正
- アクセシビリティ修正
- ブラウザ互換性修正
- パフォーマンス改善
```

#### H.3 廃止予定（Deprecation）管理
```css
/* 廃止予定のコンポーネント */
.btn-old {
  /* @deprecated Use .btn-primary instead. Will be removed in v2.0.0 */
  background: #007bff;
}

/* 移行期間中のサポート */
.btn-old {
  @extend .btn-primary; /* 新しいスタイルを適用 */
}

/* コンソール警告 */
@if $show-deprecation-warnings {
  @warn "btn-old is deprecated. Use btn-primary instead.";
}
```

### I. 利用事例・パターン

#### I.1 よくあるレイアウトパターン
```html
<!-- ダッシュボードレイアウト -->
<div class="dashboard-layout">
  <aside class="nav-sidebar">
    <!-- サイドバーナビゲーション -->
  </aside>
  
  <div class="main-content">
    <header class="nav-horizontal">
      <!-- トップナビゲーション -->
    </header>
    
    <main class="content-area">
      <div class="container">
        <!-- メインコンテンツ -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="card"><!-- KPIカード --></div>
          <div class="card"><!-- チャート --></div>
          <div class="card"><!-- 通知リスト --></div>
        </div>
      </div>
    </main>
  </div>
</div>

<!-- フォームレイアウト -->
<div class="form-layout">
  <div class="container max-w-2xl">
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">Employee Registration</h1>
      </div>
      <div class="card-content">
        <form class="form-grid">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input class="form-input" type="text" required>
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input class="form-input" type="text" required>
            </div>
          </div>
          <!-- More form fields -->
        </form>
      </div>
      <div class="card-footer">
        <button class="btn btn-ghost">Cancel</button>
        <button class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>

<!-- データテーブルレイアウト -->
<div class="table-layout">
  <div class="container">
    <div class="table-header">
      <h1 class="heading-2">Employee List</h1>
      <div class="table-actions">
        <div class="search-box">
          <input class="input" type="search" placeholder="Search employees...">
        </div>
        <button class="btn btn-primary">Add Employee</button>
      </div>
    </div>
    
    <div class="card">
      <div class="table-filters">
        <!-- フィルターUI -->
      </div>
      
      <div class="table-container">
        <!-- データテーブル -->
      </div>
      
      <div class="table-pagination">
        <!-- ページネーション -->
      </div>
    </div>
  </div>
</div>
```

#### I.2 よくあるパターンのCSS
```css
/* レイアウトパターン */
.dashboard-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
}

.main-content {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.content-area {
  overflow-y: auto;
  padding: var(--spacing-6);
}

/* フォームパターン */
.form-layout {
  padding: var(--spacing-8);
  background-color: var(--color-neutral-50);
}

.form-grid {
  display: grid;
  gap: var(--spacing-4);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* テーブルパターン */
.table-layout {
  padding: var(--spacing-6);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.table-actions {
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
}

.search-box {
  min-width: 300px;
}

.table-filters {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-neutral-200);
  background-color: var(--color-neutral-50);
}

.table-pagination {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-neutral-200);
}
```

## 最終結語

このITDOデザインシステムガイドは、複数のプロダクトチームが参照できる包括的なリファレンスとして設計されています。Atlassianデザインシステムの成熟したアプローチを参考に、日本の企業環境に特化した要件を満たすよう構築されました。

### 利用開始の手順
1. **評価フェーズ**: 現在のプロダクトとの整合性確認
2. **計画フェーズ**: 段階的導入スケジュールの策定
3. **実装フェーズ**: コンポーネント単位での順次適用
4. **検証フェーズ**: アクセシビリティ・パフォーマンステスト
5. **展開フェーズ**: チーム全体への普及とトレーニング

### 継続的改善
このデザインシステムは、利用チームからのフィードバックと実際の使用データに基づいて継続的に改善されます。新しい要件や技術の進歩に応じて、定期的にアップデートを行い、常に最新のベストプラクティスを反映していきます。

### サポート・コミュニティ
- **技術サポート**: design-system@itdo.jp
- **GitHub Repository**: https://github.com/itdojp/itdo-design-system
- **Slack Channel**: #design-system
- **月次レビュー会**: 毎月第3金曜日 14:00-15:00

このガイドが、一貫性のある優れたユーザー体験の構築と、開発チームの生産性向上に貢献することを願っています。

---

**Document Version**: 1.0.0  
**Last Updated**: 2025年7月  
**Next Review**: 2025年10月  
**Maintained by**: ITDO Design System Team