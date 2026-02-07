# Wave3 Token System Specification

## 目的
- Primitive/Semantic の2層を維持したまま、`density` `status` `focus` `border` `motion` の命名を統一する。
- 既存CSS変数との互換性を維持しながら、利用側が新命名へ段階移行できるようにする。

## 棚卸し結果（2026-02-07）
- Primitive: `colors` `typography` `spacing` `shadows` `radius` `motion`
- Semantic: `text` `background` `border` `status` `action` `focus` `datagrid`
- Density: `comfortable` `compact`（control/table/section/filter/touch-target）

## 命名規約
- Border:
  - `--color-border-subtle`
  - `--color-border-default`
  - `--color-border-strong`
  - `--color-border-interactive`
  - `--color-border-focus`
- Status:
  - `--color-status-{kind}-bg`
  - `--color-status-{kind}-border`
  - `--color-status-{kind}-fg`
  - `{kind}` は `success | warning | error | info`
- Focus:
  - `--color-focus-ring`
  - `--color-focus-ring-inner`
  - `--color-focus-outline`
  - `--focus-ring-width` `--focus-ring-offset`
  - `--focus-outline-width` `--focus-outline-style`
- Motion:
  - `--motion-duration-fast|standard|slow`
  - `--motion-easing-standard|emphasized|entrance|exit`

## 互換性ポリシー
- 既存の `--color-status-success` 系は alias として継続する。
- 新規実装は `bg/border/fg` 命名を優先する。
- 既存コンポーネントは段階移行する（PR単位で置換）。

## Density 仕様
- `:root[data-density='comfortable']` を標準とする。
- `:root[data-density='compact']` は一覧・管理画面向け高密度モードとする。
- `SectionCard` は `density` prop で明示指定可能（`comfortable|compact`）。

## Storybook 参照
- `Examples/Token Architecture` に構造と値マッピングを表示する。
