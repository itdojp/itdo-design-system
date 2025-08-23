# ClaudeCode作業指示書 - ITDOデザインシステムリポジトリセットアップ

## 概要

GitHubリポジトリ `itdo-design-system` が作成されました。以下の指示に従って、リポジトリの初期セットアップから本格的なデザインシステムの実装まで段階的に進めてください。

## 前提条件

- GitHubリポジトリ: `itdo-design-system` が作成済み
- ClaudeCodeがリポジトリにアクセス可能
- Node.js環境（v18以上推奨）
- 必要な開発ツールのインストール権限

## Phase 1: リポジトリ基盤セットアップ

### 1.1 プロジェクト構造の作成

以下のディレクトリ構造を作成してください：

```bash
# ルートディレクトリ構造作成
mkdir -p packages/{tokens,components,icons,themes}
mkdir -p apps/{docs,storybook,demo}
mkdir -p docs/{components,patterns,migration}
mkdir -p tools/{build,figma-plugin,testing}
mkdir -p examples/{react-app,vue-app,vanilla-js}
mkdir -p .github/{workflows,ISSUE_TEMPLATE}
```

### 1.2 Package.json セットアップ

ルートディレクトリに以下の `package.json` を作成：

```json
{
  "name": "@itdo/design-system",
  "version": "1.0.0",
  "description": "Enterprise-grade UI component library and design guidelines for ITDO products",
  "main": "index.js",
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "tokens:build": "npm run build --workspace=packages/tokens",
    "components:build": "npm run build --workspace=packages/components",
    "demo:dev": "npm run dev --workspace=apps/demo",
    "demo:build": "npm run build --workspace=apps/demo"
  },
  "workspaces": [
    "packages/*",
    "apps/*",
    "examples/*"
  ],
  "keywords": [
    "design-system",
    "ui-components",
    "react",
    "accessibility",
    "enterprise",
    "erp"
  ],
  "author": "ITDO Corporation",
  "license": "MIT",
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react": "^7.0.0",
    "eslint-plugin-react-hooks": "^4.0.0",
    "jest": "^29.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 1.3 TypeScript設定

`tsconfig.json` を作成：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@itdo/tokens": ["./packages/tokens/src"],
      "@itdo/components": ["./packages/components/src"],
      "@itdo/icons": ["./packages/icons/src"],
      "@itdo/themes": ["./packages/themes/src"]
    }
  },
  "include": [
    "packages/*/src",
    "apps/*/src",
    "examples/*/src"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ]
}
```

### 1.4 ESLint設定

`.eslintrc.js` を作成：

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
```

## Phase 2: デザイントークンパッケージ

### 2.1 Tokensパッケージの作成

`packages/tokens/package.json` を作成：

```json
{
  "name": "@itdo/tokens",
  "version": "1.0.0",
  "description": "Design tokens for ITDO Design System",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "npm run build:js && npm run build:css",
    "build:js": "tsc",
    "build:css": "node scripts/build-css.js"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### 2.2 デザイントークン定義

`packages/tokens/src/tokens.ts` を作成し、以下の内容を実装：

```typescript
// 先ほど作成したデザインガイドの完全なトークン定義をTypeScript形式で実装
export const designTokens = {
  colors: {
    brand: {
      primary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12'
      }
    },
    // 完全なカラーパレット定義
  },
  typography: {
    // 完全なタイポグラフィ定義
  },
  spacing: {
    // 完全なスペーシング定義
  }
  // その他すべてのトークン
};
```

### 2.3 CSS変数生成スクリプト

`packages/tokens/scripts/build-css.js` を作成：

```javascript
const fs = require('fs');
const path = require('path');
const { designTokens } = require('../dist/tokens.js');

function generateCSSVariables(tokens, prefix = '') {
  let css = ':root {\n';
  
  function processTokens(obj, currentPrefix) {
    for (const [key, value] of Object.entries(obj)) {
      const cssVar = `--${currentPrefix}${key}`.replace(/([A-Z])/g, '-$1').toLowerCase();
      
      if (typeof value === 'object' && value !== null) {
        processTokens(value, `${currentPrefix}${key}-`);
      } else {
        css += `  ${cssVar}: ${value};\n`;
      }
    }
  }
  
  processTokens(tokens, prefix);
  css += '}\n';
  
  return css;
}

// CSS変数ファイル生成
const cssContent = generateCSSVariables(designTokens);
fs.writeFileSync(
  path.join(__dirname, '../dist/tokens.css'),
  cssContent
);

console.log('CSS tokens generated successfully!');
```

## Phase 3: Reactコンポーネントパッケージ

### 3.1 Componentsパッケージの作成

`packages/components/package.json` を作成：

```json
{
  "name": "@itdo/components",
  "version": "1.0.0",
  "description": "React components for ITDO Design System",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc && npm run build:css",
    "build:css": "postcss src/**/*.css --dir dist",
    "dev": "tsc --watch"
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  },
  "dependencies": {
    "@itdo/tokens": "^1.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "postcss": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 3.2 コンポーネント実装

先ほど作成したサンプルデモのコンポーネントを個別ファイルに分割して実装：

- `packages/components/src/Button/Button.tsx`
- `packages/components/src/Input/Input.tsx`
- `packages/components/src/Card/Card.tsx`
- `packages/components/src/Modal/Modal.tsx`
- `packages/components/src/Table/Table.tsx`
- その他すべてのコンポーネント

各コンポーネントは以下の構造で作成：

```typescript
// packages/components/src/Button/Button.tsx
import React from 'react';
import { designTokens } from '@itdo/tokens';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  // 実装内容
};
```

### 3.3 コンポーネントインデックス

`packages/components/src/index.ts` を作成：

```typescript
// すべてのコンポーネントをエクスポート
export { Button } from './Button/Button';
export { Input } from './Input/Input';
export { Card } from './Card/Card';
export { Modal } from './Modal/Modal';
export { Table } from './Table/Table';
// 他のコンポーネント

// 型定義もエクスポート
export type { ButtonProps } from './Button/Button';
export type { InputProps } from './Input/Input';
// 他の型定義
```

## Phase 4: Storybook設定

### 4.1 Storybookインストールと設定

`apps/storybook` ディレクトリで以下を実行：

```bash
cd apps/storybook
npx storybook@latest init --type react
```

### 4.2 Storybook設定ファイル

`.storybook/main.ts` を設定：

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../../packages/components/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
```

### 4.3 各コンポーネントのStoryファイル作成

例：`packages/components/src/Button/Button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for user interaction',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
```

## Phase 5: デモアプリケーション

### 5.1 デモアプリの作成

`apps/demo` でVite + React アプリケーションを作成：

```bash
cd apps/demo
npm create vite@latest . -- --template react-ts
```

### 5.2 デモアプリの実装

先ほど作成したサンプルデモをベースに、パッケージ化されたコンポーネントを使用するよう修正して実装してください。

`apps/demo/src/App.tsx` にITDODesignSystemDemoコンポーネントを実装。

## Phase 6: ドキュメントサイト

### 6.1 VitePress設定

`apps/docs` でVitePressドキュメントサイトを作成：

```bash
cd apps/docs
npm init
npm install vitepress
```

### 6.2 ドキュメント構造

以下のマークダウンファイルを作成：

- `apps/docs/index.md` - トップページ
- `apps/docs/guide/getting-started.md` - はじめに
- `apps/docs/guide/installation.md` - インストール方法
- `apps/docs/components/` - 各コンポーネントのドキュメント
- `apps/docs/design-tokens.md` - デザイントークン説明
- `apps/docs/patterns/` - デザインパターン

### 6.3 デザインガイドの移植

先ほど作成したデザインガイドを `apps/docs/design-guide.md` として配置し、VitePressの機能を活用して見やすく整形してください。

## Phase 7: CI/CD設定

### 7.1 GitHub Actionsワークフロー

`.github/workflows/ci.yml` を作成：

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Test
        run: npm test
      
      - name: Build packages
        run: npm run build

  build-storybook:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Storybook
        run: npm run build-storybook
      
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
          destination_dir: storybook

  build-docs:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build docs
        run: npm run docs:build
      
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./apps/docs/.vitepress/dist
          destination_dir: docs

  build-demo:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build demo
        run: npm run demo:build
      
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./apps/demo/dist
```

### 7.2 その他のワークフロー

- `.github/workflows/release.yml` - NPM パッケージのリリース自動化
- `.github/workflows/visual-regression.yml` - Chromatic連携の視覚回帰テスト

## Phase 8: README とドキュメント

### 8.1 ルートREADME.md

先ほど提案したREADME構成を実装してください。

### 8.2 その他のドキュメント

- `CONTRIBUTING.md` - コントリビューションガイドライン
- `CHANGELOG.md` - 変更履歴
- `LICENSE` - MITライセンス
- `.github/ISSUE_TEMPLATE/` - イシューテンプレート
- `.github/pull_request_template.md` - プルリクエストテンプレート

## Phase 9: テスト実装

### 9.1 Jest設定

`jest.config.js` を作成：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@itdo/(.*)$': '<rootDir>/packages/$1/src',
  },
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.stories.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
  ],
};
```

### 9.2 コンポーネントテスト

各コンポーネントにテストファイルを作成：

```typescript
// packages/components/src/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 他のテストケース
});
```

## Phase 10: 最終確認と公開準備

### 10.1 品質チェックリスト

以下の項目を確認してください：

- [ ] すべてのコンポーネントが正常にビルドされる
- [ ] TypeScript型定義が正しく生成される
- [ ] Storybookですべてのコンポーネントが表示される
- [ ] デモアプリケーションが正常に動作する
- [ ] ドキュメントサイトが適切に生成される
- [ ] CI/CDが正常に動作する
- [ ] アクセシビリティテストに合格する
- [ ] すべてのテストが通る

### 10.2 NPMパッケージ準備

各パッケージが適切にビルドされ、NPMに公開可能な状態になっているか確認してください。

### 10.3 GitHub Pages デプロイ

以下のURLでサイトが正しく表示されることを確認：

- Storybook: `https://[username].github.io/itdo-design-system/storybook`
- Documentation: `https://[username].github.io/itdo-design-system/docs`
- Demo: `https://[username].github.io/itdo-design-system`

## 注意事項

1. **段階的実装**: 一度にすべてを実装せず、Phase単位で確認しながら進めてください
2. **エラーハンドリング**: 各段階でエラーが発生した場合は、ログを確認して原因を特定してください
3. **依存関係**: パッケージ間の依存関係に注意し、循環参照を避けてください
4. **バージョン管理**: 各パッケージのバージョンを適切に管理してください
5. **アクセシビリティ**: 各コンポーネントでWCAG 2.1 AA準拠を確認してください

## 完了後の確認

すべてのPhaseが完了した後、以下を確認してください：

1. GitHubリポジトリに完全なコードベースが配置されている
2. GitHub Pagesでデモサイトが公開されている
3. NPMパッケージとして公開可能な状態になっている
4. ドキュメントが完整している
5. CI/CDパイプラインが正常に動作している

この指示書に従って作業を進めることで、プロダクション レディなデザインシステムが完成します。各段階で疑問点があれば、詳細な技術的サポートを提供しますので、お知らせください。