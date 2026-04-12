# しくみや — セッション引き継ぎメモ

> 最終更新: 2026-04-13

## ★ 次のセッションで最初にやること

1. このファイルを読む
2. PROJECT_STATE.md を読む
3. plans/humming-singing-hinton.md を読む（全機能本番稼働の設計書）
4. memory/ のMEMORY.mdを読む

**次のタスク:** SaaSプロダクトのプロとして全機能本番稼働の詳細設計。全タスクを細かく分解し、チェック項目+スコアリングを「機能の核」と「ユーザー視点」で再設計。

## 本番稼働中

- **URL:** https://shikumiya.vercel.app
- **GitHub:** AndoLyo/lyo-vision-site
- **Vercelプロジェクト名:** shikumiya
- **Stripe:** テストモード、3プラン設定済み

## 動作確認済みフロー

- /start → Stripe決済 → webhook → GAS記録 + メール送信 → サイト生成 ✅
- 決済後に /start/success ページ表示 ✅
- Stripeテスト決済（カード 4242...）✅

## 根本問題（最優先で解決すべき）

1. **`shikumiya-template` リポが旧ポートフォリオのまま**
   - 生成されたサイトが `ai-art-portfolio` ベース
   - Next.js 16のクリーンなシェルに更新が必要
   - webhookの `copyTemplateFiles` は正しいテンプレをコピーする仕組みだが、ベースリポが古い

2. **生成サイトに顧客入力値が反映されない**
   - site.config.jsonは生成されるが、テンプレのpage.tsxがまだconfigを読んでない可能性
   - テンプレリポ更新で解決する

## 事業概要

**しくみや** — 全業種対応のHP制作SaaS（建築特化ではない）
- 制作費0円、月額3,000円〜
- プラン名: おまかせ(lite) / まるっとおまかせ(middle) / ぜんぶおまかせ(premium)
- 「写真を送るだけ。あとは全部おまかせ」

## テンプレート

- 建築パック完成済み: warm-craft / trust-navy / clean-arch × lite/mid/pro = 9テンプレ
- 全テンプレsite.config.json分離済み
- industry-registry.ts: 15カテゴリ35業種登録。テンプレあり=表示、なし=非表示

## 完成済みのシステム

### API（8本）
| エンドポイント | 用途 | 状態 |
|-------------|------|:---:|
| /api/start | 新規申込→Stripe | ✅動作確認済 |
| /api/webhook | 決済→サイト生成 | ✅動作確認済 |
| /api/site-content | 顧客リポのconfig取得 | ✅実装済 |
| /api/site-update | テキスト/画像即反映 | ✅実装済（未接続） |
| /api/plan-change | プラン変更 | ✅実装済（未接続） |
| /api/edit-request | レイアウト/機能依頼 | ✅実装済（Claude API未実装） |
| /api/admin | 管理データ取得 | ✅実装済（GAS依存） |
| /api/logs | ログ取得 | ✅実装済 |

### フロントエンド
- トップページ: 全業種対応、全CTA→/start
- /start: 4ステップ申込フロー（Stripe接続済み）
- /start/success: 決済完了ページ
- /lp/construction: 建築向けLP
- /portfolio-templates/*: 9テンプレデモ（DemoBanner付き）
- /member/[orderId]/: 顧客管理（サイドバー+プラン別🔒+編集依頼+クロップUI）
- /admin/: Lyo管理（ダッシュボード+依頼キュー+顧客一覧）

### 共通ライブラリ
- site-config-schema.ts: 22型定義
- industry-registry.ts: 35業種レジストリ
- stripe.ts: Price IDマッピング、プラン名
- github.ts: GitHub API共通ユーティリティ
- template-config-generator.ts: フォームデータ→SiteConfig変換
- error-handler.ts: 一元ログ+エラーパーサー+リトライ
- member-context.ts: 会員認証Context

## 未接続・未実装（全機能本番稼働に必要）

### A. テンプレートリポ更新（最優先）
- shikumiya-templateをNext.js 16クリーンシェルに

### B. 管理ページ実データ接続
- GASに全顧客取得・全依頼取得アクション追加
- /member/をデモデータ→API取得に
- /adminを実データに

### C. 編集依頼API接続
- edit-requestフォーム → /api/site-update呼出
- 画像差替 → /api/site-update呼出
- レイアウト/機能 → /api/edit-request呼出

### D. プラン変更接続
- settings → /api/plan-change呼出

### E. /startをレジストリから読む
- ハードコード → industry-registry.ts

### F. Claude API連携
- /api/edit-requestにClaude API実装
- スコアリング+自動承認

### G. Admin MRR計算
- Stripe APIから実MRR

## 環境変数（Vercel）
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_LITE=price_1TLR8wAHGiGiMXDLR4dj9XUl
STRIPE_PRICE_MIDDLE=price_1TLR9QAHGiGiMXDLrPmSoOm1
STRIPE_PRICE_PREMIUM=price_1TLR9vAHGiGiMXDLmsScxJ33
STRIPE_WEBHOOK_SECRET=whsec_...
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=AndoLyo
GITHUB_TEMPLATE_REPO=shikumiya-template
VERCEL_TOKEN=vcp_...
GAS_WEBHOOK_URL=https://script.google.com/...
NEXT_PUBLIC_BASE_URL=https://shikumiya.vercel.app
```

## デザイン・UXルール
- 明るい白ベース + ピンク(#e84393)・紫(#6c5ce7)・オレンジ(#f39c12)
- 入力より選択。選ぶだけで依頼が完成するUI
- 手抜き禁止。ボタン押した先まで作り切る
- タスクごとに自己評価（1-100点）+ 振り返り必須

## 重要な参考資料
- PROJECT_STATE.md — 現状のスナップショット
- plans/humming-singing-hinton.md — 全機能本番稼働の設計書
- docs/claude-api-system-prompt.md — Claude APIシステムプロンプト
- docs/site-data-management.md — サイトデータ管理設計
- memory/ — フィードバック・プロジェクト記録
