# Form Validation Migration Guide

## Scope
- `FormField`
- `Input`
- `Textarea`
- `Select`
- `Combobox`

## Prop Inventory (Before)
- `helpText` / `helperText` が混在（`Input`）
- `error` / `success` はあるが `warning` が未定義
- 非同期検証状態（loading/error）の表示契約が `Combobox` 専用で分断
- `Textarea` の `maxLength` は存在するが、文字数カウンタの標準表示ルールが未定義

## Unified Contract (After)
- `validationState`: `'none' | 'error' | 'warning' | 'success' | 'validating'`
- `validationMessage`: 状態に対応する補助メッセージ
- `hint` / `description`: 補助説明（`helpText` の別名）
- `footer`: 補助情報の末尾表示（文字数カウンタなど）

## Display Priority Rule
1. `validationMessage`（入力可否に直結する情報）
2. `hint` / `description` / `helpText`（補助説明）
3. `footer`（文字数などの補足情報）

`aria-describedby` は上記の優先順に連結し、スクリーンリーダー読み上げ順も一致させます。

## Backward Compatibility
- 既存の `error` / `warning` / `success` は引き続き利用可能です。
- `validationState` 未指定時は `error > warning > success > none` の順で推論します。
- `validationMessage` 未指定時は各 legacy prop の文言を引き継ぎます。
- `Input.helperText` は引き続き有効ですが、新規実装では `hint` または `helpText` を推奨します。

## Textarea Character Counter
- `maxLength` 指定時は `showCharacterCount` 既定 `true` として `current/max` を表示します。
- `showCharacterCount={false}` で非表示化できます。

## Combobox Async Validation
- 明示的な `validationState` が未指定の場合:
- 開いた状態で `loading` 中は `validating` を表示
- `loadOptions` 失敗時は `error` を表示
- 明示指定がある場合は明示指定を優先
