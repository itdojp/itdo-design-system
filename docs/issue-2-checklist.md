# Issue 2 Checklist

## A. 配布・運用の土台（最優先）
- [x] パッケージとして利用可能にする（例：npm / GitHub Packages など。公開・非公開は運用に合わせる）
- [x] SemVer 運用（例：changesets導入等）＋ CHANGELOG 生成
- [x] CI で最低限の品質ゲート（PRで回ること）
  - [x] lint
  - [x] typecheck
  - [x] build:lib
  - [x] build-storybook
  - [x] （可能なら）最小のテスト実行

## B. Foundations（トークン・テーマ・密度）
- [x] tokens を「Primitive / Semantic」の2層で整理（命名規則をREADME/Docsに明記）
- [x] CSS Variables ベースでテーマ適用できる形にする（将来のテーマ差し替えに備える）
- [x] 業務UI向けの “密度” を提供（compact / comfortable など）
- [x] フォーカスリング、コントラスト、タイポ、余白の基準をトークンとして固定

## C. Components（汎用コンポーネントの強化：ERPで頻出）
- [x] FormField（label / help / required / error / success の枠組み）
- [x] Button（primary/secondary/danger + loading/disabled の表現統一）
- [x] Input/Select/Textarea（validation含む）
- [x] Toast / Alert（成功・警告・失敗）
- [x] Loading（Spinner / Skeleton）と EmptyState（0件時の案内）

## D. Patterns（“ERPにフィットするが汎用”なテンプレ）
- [x] PageHeader パターン（タイトル / パンくず / 主要CTA / ステータス領域 / 右メタ）
- [x] CRUD一覧テンプレ（FilterBar + DataTable + EmptyState + Pagination）
- [x] 送信/実行フロー（Confirm → Execute → Result/Retry）を汎用化
- [x] EventLog（監査ログ/送信ログの“表示UI”のみ。データ取得は利用側）

## E. Storybook を仕様書化
- [x] 主要コンポーネントは states を網羅
- [x] a11y 観点の最低限チェックを導入（CIに組み込める形が望ましい）
- [x] 「業務フォーム例」「CRUD一覧例」など、実利用に近い story を追加

## 受け入れ条件（Definition of Done）
- [x] `npm install` → `npm run storybook` が動作し、主要コンポーネントの states が確認できる
- [x] `npm run build:lib` が成功し、利用側が import できる成果物が出る
- [x] `npm run build-storybook` が成功する
- [ ] CI（PR）で lint/typecheck/build が落ちない
- [x] “ドメイン語彙を含まない” API/命名になっている（ERP4固有名が混入していない）
