# プロジェクト棚卸し — しくみや SaaS

> 最終更新: 2026-04-13

---

## 1. 全体構造

### ディレクトリツリー

```
shikumiya-saas/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # トップページ
│   │   ├── layout.tsx                # ルートレイアウト
│   │   ├── globals.css               # グローバルCSS
│   │   ├── start/                    # 新規申込フロー
│   │   │   ├── page.tsx              # 4ステップ申込
│   │   │   └── success/page.tsx      # 決済完了
│   │   ├── member/                   # 顧客管理エリア
│   │   │   ├── page.tsx              # ログイン画面
│   │   │   └── [orderId]/
│   │   │       ├── page.tsx          # ダッシュボード
│   │   │       ├── layout.tsx        # サイドバーレイアウト
│   │   │       ├── edit-request/     # 編集依頼フォーム
│   │   │       ├── edit/             # サイトエディタ
│   │   │       ├── features/         # 機能管理
│   │   │       ├── history/          # 依頼履歴
│   │   │       └── settings/         # アカウント設定
│   │   ├── admin/                    # Lyo管理エリア
│   │   │   ├── page.tsx              # ダッシュボード
│   │   │   ├── layout.tsx
│   │   │   ├── accounts/page.tsx     # 顧客一覧
│   │   │   └── requests/page.tsx     # 依頼キュー
│   │   ├── api/                      # APIルート（13本）
│   │   │   ├── start/                # 新規申込 → Stripe
│   │   │   ├── webhook/              # Stripe webhook → サイト生成
│   │   │   ├── site-content/         # 顧客サイトconfig取得
│   │   │   ├── site-update/          # テキスト/画像即反映
│   │   │   ├── plan-change/          # プラン変更
│   │   │   ├── edit-request/         # レイアウト/機能依頼
│   │   │   ├── admin/                # 管理データ取得
│   │   │   ├── logs/                 # ログ取得
│   │   │   ├── member/auth/          # 会員認証
│   │   │   ├── member/edit/          # 編集依頼登録
│   │   │   ├── member/[orderId]/     # 会員プロフィール
│   │   │   ├── upload-images/        # 画像アップロード
│   │   │   └── checkout/             # 旧API（廃止予定）
│   │   ├── lp/
│   │   │   └── construction/         # 建築向けLP
│   │   ├── portfolio-templates/      # SaaS用テンプレ（9種）
│   │   │   ├── warm-craft/           # lite
│   │   │   ├── warm-craft-mid/       # middle
│   │   │   ├── warm-craft-pro/       # premium
│   │   │   ├── trust-navy/           # lite
│   │   │   ├── trust-navy-mid/       # middle
│   │   │   ├── trust-navy-pro/       # premium (+recruit)
│   │   │   ├── clean-arch/           # lite
│   │   │   ├── clean-arch-mid/       # middle
│   │   │   └── clean-arch-pro/       # premium
│   │   ├── templates/                # 旧アーティストテンプレ（10種・リダイレクト済）
│   │   ├── order/                    # 旧申込フロー（リダイレクト済）
│   │   ├── portfolio/                # 旧ポートフォリオ（リダイレクト済）
│   │   ├── preview/[templateId]/     # テンプレプレビュー
│   │   ├── features/                 # 機能紹介
│   │   ├── legal/                    # 利用規約
│   │   ├── privacy/                  # プライバシーポリシー
│   │   └── test/                     # テスト（リダイレクト済）
│   ├── components/
│   │   ├── *.tsx                     # トップページ用コンポーネント（18個）
│   │   ├── portfolio-templates/      # 旧アーティストテンプレ用コンポーネント
│   │   │   ├── DemoBanner.tsx        # デモ表示バナー（SaaS テンプレ共用）
│   │   │   ├── warm-craft/           # 空（全コンポーネントはpage.tsxにインライン）
│   │   │   ├── trust-navy/           # 空
│   │   │   ├── clean-arch/           # 空
│   │   │   └── (旧10種)/             # 旧アーティストテンプレ用
│   │   └── templates/                # 旧テンプレ用コンポーネント（10テンプレ分）
│   └── lib/                          # 共通ライブラリ
│       ├── site-config-schema.ts     # 全テンプレ共通型定義（22インターフェース）
│       ├── stripe.ts                 # プラン・価格ユーティリティ
│       ├── github.ts                 # GitHub API操作
│       ├── template-config-generator.ts  # フォーム→SiteConfig変換
│       ├── error-handler.ts          # 統合ログ・エラー処理
│       ├── member-context.ts         # 会員認証Context
│       ├── industry-registry.ts      # 業種レジストリ（35業種）
│       ├── site-data.ts              # 旧: アーティストポートフォリオ型
│       ├── template-forms.ts         # 旧: アーティストテンプレフォーム定義
│       └── SiteDataContext.tsx        # 旧: アーティストデータContext
├── gas/
│   └── webhook.gs                    # GAS: 注文記録・メール送信・認証
├── scripts/
│   ├── apply-order.mjs               # テキスト置換スクリプト
│   ├── order-watcher.mjs             # 注文ポーリング+Claude CLI連携
│   ├── optimize-images.mjs           # 画像最適化
│   └── generate_icon.py              # アイコン生成
├── template-site/
│   ├── shikumiya-template/           # 顧客サイト用テンプレートリポ（準備完了）
│   └── (旧テンプレ6種)/              # ai-art-portfolio等（旧）
├── docs/                             # 設計ドキュメント（8ファイル）
├── plans/                            # 設計書
│   └── full-production-design.md     # 全機能本番稼働設計書
├── work-logs/                        # 作業ログ
├── public/                           # 静的アセット
├── test/                             # テスト
├── CLAUDE.md                         # プロジェクトルール
├── HANDOFF.md                        # セッション引き継ぎ
├── SKILL.md                          # スキル/フロー定義
└── AGENTS.md                         # Next.js注意事項
```

### 使用技術・主要ライブラリ

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 16.2.0 (App Router, Turbopack) |
| 言語 | TypeScript 5 |
| ランタイム | React 19.2.4 |
| CSS | Tailwind CSS 4 + PostCSS |
| アニメーション | Framer Motion 12 |
| アイコン | lucide-react |
| 決済 | Stripe (サブスクリプション) |
| ホスティング | Vercel |
| リポ管理 | GitHub API |
| データストア | Google Apps Script (Spreadsheet) |
| 画像処理 | react-easy-crop, browser-image-compression, sharp |
| ドラッグ&ドロップ | @dnd-kit |

### ページ/ルート一覧と完成度

| パス | 役割 | 完成度 | 備考 |
|------|------|:------:|------|
| `/` | トップページ | 90% | CTA全て/start統一。コピー微調整の余地あり |
| `/start` | 新規申込フロー | 85% | Stripe接続済み。業種がハードコード（registry未接続） |
| `/start/success` | 決済完了 | 70% | 静的。注文IDの動的表示がない |
| `/lp/construction` | 建築LP | 90% | SEO用。完成度高い |
| `/member` | ログイン | 80% | GAS認証接続済み |
| `/member/[orderId]` | 顧客ダッシュボード | 30% | 全データがハードコード（「山田工務店」） |
| `/member/[orderId]/edit-request` | 編集依頼 | 25% | UIあり。API未接続。データハードコード |
| `/member/[orderId]/features` | 機能管理 | 40% | プラン別ロック表示あり。データ静的 |
| `/member/[orderId]/settings` | アカウント設定 | 20% | UIあり。API未接続。保存が動かない |
| `/member/[orderId]/history` | 依頼履歴 | 20% | UIあり。データ静的 |
| `/member/[orderId]/edit` | サイトエディタ | 10% | レイアウトのみ |
| `/admin` | Lyo管理ダッシュボード | 50% | GAS経由で一部実データ。MRR未計算 |
| `/admin/accounts` | 顧客一覧 | 45% | GAS経由で一部実データ |
| `/admin/requests` | 依頼キュー | 15% | 完全デモデータ（INITIAL_REQUESTS） |
| `/portfolio-templates/*` | テンプレデモ（9種） | 95% | site.config.json駆動。完成度高い |
| `/templates/*` | 旧テンプレ（10種） | — | /startにリダイレクト済み |
| `/order/*` | 旧申込フロー | — | /startにリダイレクト済み |

---

## 2. 機能マッピング

### コア機能（事業の根幹）

| 機能名 | 完成度 | 状態 | 依存する他機能 |
|--------|:------:|------|--------------|
| Stripe決済（サブスク3プラン） | 90% | 動作する | なし |
| /start 申込フォーム（4ステップ） | 85% | 動作する | Stripe決済 |
| Webhook → サイト自動生成 | 60% | 動作する（※1） | Stripe決済, テンプレートリポ |
| テンプレートリポ（shikumiya-template） | 20% | UI仮組み（※2） | なし |
| 顧客サイト config 駆動表示 | 95% | 動作する | テンプレートリポ |
| GAS 注文記録 + メール送信 | 80% | 動作する | Webhook |
| 業種レジストリ（35業種定義） | 90% | 動作する | なし |
| site-config-schema（22型定義） | 95% | 動作する | なし |

> ※1: サイトは生成されるが、テンプレートリポが旧ポートフォリオのため実質壊れている
> ※2: テンプレートリポは準備完了（ローカル）だがGitHub未push

### 顧客向け機能

| 機能名 | 完成度 | 状態 | 依存する他機能 |
|--------|:------:|------|--------------|
| 会員ログイン（orderId + email） | 80% | 動作する | GAS認証 |
| 顧客ダッシュボード | 30% | UI仮組み | 会員ログイン, GAS API拡充 |
| テキスト編集依頼 | 25% | UI仮組み | site-content API, site-update API |
| 画像変更（クロップUI付き） | 30% | UI仮組み | upload-images API, site-update API |
| レイアウト/機能変更依頼 | 10% | UI仮組み | edit-request API, Claude API |
| プラン変更 | 20% | UI仮組み | plan-change API, Stripe |
| 依頼履歴表示 | 20% | UI仮組み | GAS API拡充 |
| 機能管理（プラン別ロック） | 40% | UI仮組み | 会員データ |

### 管理者（Lyo）向け機能

| 機能名 | 完成度 | 状態 | 依存する他機能 |
|--------|:------:|------|--------------|
| 管理ダッシュボード（KPI） | 50% | UI仮組み | GAS全顧客取得 |
| 顧客一覧 | 45% | UI仮組み | GAS全顧客取得 |
| 依頼キュー | 15% | UI仮組み | GAS依頼取得, Claude API |
| MRR計算 | 0% | 未着手 | Stripe API or GAS |
| サブスク解約処理 | 5% | 未着手 | Webhook拡張 |
| サブスク更新処理 | 5% | 未着手 | Webhook拡張 |

### API（13本）

| エンドポイント | 完成度 | 状態 | 備考 |
|---------------|:------:|------|------|
| POST /api/start | 90% | 動作する | Stripe Checkout セッション作成 |
| POST /api/webhook | 60% | 動作する | config パス不一致（修正済み・未デプロイ） |
| GET /api/site-content | 80% | 動作する | フロントエンドから未呼出 |
| POST /api/site-update | 80% | 動作する | フロントエンドから未呼出 |
| POST /api/plan-change | 70% | 動作する | フロントエンドから未呼出 |
| POST /api/edit-request | 20% | UI仮組み | ログ記録のみ。Claude API未実装 |
| GET /api/admin | 40% | UI仮組み | pending のみ取得。全顧客/依頼なし |
| GET /api/logs | 90% | 動作する | インメモリバッファ |
| POST /api/member/auth | 80% | 動作する | GAS verify 接続済み |
| POST /api/member/edit | 70% | 動作する | 編集回数制御あり |
| GET /api/member/[orderId] | 70% | 動作する | GAS verify 経由 |
| POST /api/upload-images | 80% | 動作する | GitHub Gist 経由 |
| POST /api/checkout | — | 廃止予定 | 旧API。/api/start に置換済み |

---

## 3. データ構造

### 型定義（src/lib/site-config-schema.ts）

```
SiteConfig（顧客サイトの全データ）
├── templateId: string        # "warm-craft" | "warm-craft-mid" | ...
├── plan: "lite" | "middle" | "premium"
├── orderId: string
├── siteUrl: string
├── company: CompanyInfo      # 会社名, 電話, メール, 住所, CEO, 経歴...
├── projects: Project[]       # 施工実績（全プラン）
├── strengths: Strength[]     # 強み（全プラン）
├── services?: Service[]      # サービス（trust-navy用）
├── stats?: Stat[]            # 数字実績（trust-navy用）
├── testimonials?: Testimonial[]  # お客様の声（middle以上）
├── news?: NewsItem[]         # ニュース（middle以上）
├── awards?: Award[]          # 受賞歴（clean-arch用）
├── bookingEvents?: BookingEvent[]  # 予約（premium）
├── chatFAQs?: ChatFAQ[]     # AIチャット（premium）
├── jobs?: JobPosting[]       # 採用（trust-navy-pro用）
└── style: StyleConfig        # 色, フォント, サイズ, ウェイト
```

### データの流れ

```
【申込フロー】
顧客フォーム → /api/start → GitHub Gist（一時保存）→ Stripe Checkout
  ↓ 決済完了
Stripe webhook → /api/webhook
  → Gist から注文データ取得
  → GitHub: テンプレートリポからリポ作成
  → GitHub: page.tsx + site.config.json を push
  → Vercel: プロジェクト作成 + デプロイ
  → GAS: 注文データ記録 + メール送信
  → Gist 削除（クリーンアップ）

【データストア】
Google Spreadsheet（GAS経由）
  ├── 注文データシート: order_id, company_name, email, plan, template, site_url, status...
  └── 編集リクエストシート: order_id, type, content, score, status...

GitHub（顧客サイト用リポ）
  ├── src/app/page.tsx         # テンプレートのページ
  ├── src/app/site.config.json # 顧客データ（テキスト変更はこれを更新）
  ├── src/lib/site-config-schema.ts  # 型定義
  └── public/images/           # 顧客の画像

Stripe
  └── サブスクリプション: customer_id, subscription_id, plan, status

【編集フロー（設計済み・未接続）】
顧客 /member → 編集依頼送信
  テキスト/画像 → /api/site-update → GitHub push → Vercel 自動リデプロイ
  レイアウト/機能 → /api/edit-request → Claude API → feature branch → スコアリング → マージ
```

---

## 4. 未接続の箇所

### 画面 → API の未接続

| 画面 | 呼ぶべきAPI | 現状 |
|------|-----------|------|
| `/member/[orderId]` ダッシュボード | /api/member/[orderId] | ハードコード「山田工務店」。APIは存在するが未呼出 |
| `/member/[orderId]/edit-request` テキスト変更 | /api/site-update | UIあり。送信ボタンがAPIを呼ばない |
| `/member/[orderId]/edit-request` 画像変更 | /api/upload-images → /api/site-update | クロップUIあり。APIを呼ばない |
| `/member/[orderId]/edit-request` レイアウト変更 | /api/edit-request | UIあり。APIはログ記録のみ |
| `/member/[orderId]/settings` プラン変更 | /api/plan-change | UIあり。ボタンがAPIを呼ばない |
| `/member/[orderId]/settings` 会社情報保存 | /api/site-update | フォームあり。保存が動かない |
| `/admin/requests` 依頼一覧 | /api/admin?action=requests | ハードコードINITIAL_REQUESTS |
| `/start` 業種選択 | industry-registry.ts | ハードコード4業種。registryの35業種未使用 |

### API → 外部サービスの未接続

| API | 外部サービス | 現状 |
|-----|-----------|------|
| /api/edit-request | Claude API (Anthropic) | エンドポイントは存在。Claude APIコール未実装 |
| /api/admin?action=accounts | GAS (get_all_customers) | GASに全顧客取得アクションなし |
| /api/admin?action=requests | GAS (get_edit_requests) | GASに依頼取得アクションなし |
| /api/admin (MRR) | Stripe API | MRR計算未実装 |
| /api/webhook (subscription.updated) | GAS | イベントログのみ。GAS更新なし |
| /api/webhook (subscription.deleted) | GAS | イベントログのみ。GAS更新なし |

### テンプレートリポの断絶

| 問題 | 影響 |
|------|------|
| GitHub上の `shikumiya-template` が旧 ai-art-portfolio のまま | 生成サイトが旧テンプレートベースになる |
| webhook の config push パスが `src/site.config.json`（修正済み・未デプロイ） | page.tsx が `./site.config.json`（= `src/app/site.config.json`）を import するためデータ不一致 |
| 新テンプレートリポのファイル群はローカルに準備完了 | GitHub への push が未完了 |

### 旧コードの残存

| ファイル/ディレクトリ | 状態 | 対応 |
|---------------------|------|------|
| `/api/checkout` | 旧API | 削除推奨 |
| `src/lib/site-data.ts` | 旧アーティスト型定義 | 削除推奨 |
| `src/lib/template-forms.ts` | 旧アーティストフォーム | 削除推奨 |
| `src/lib/SiteDataContext.tsx` | 旧アーティストContext | 削除推奨 |
| `src/app/templates/*` (10種) | リダイレクト済み | 将来削除 |
| `src/components/templates/*` | 旧テンプレコンポーネント | 将来削除 |
| `src/components/portfolio-templates/` (旧10種) | 旧アーティストテンプレ | 将来削除 |
| `template-site/` (旧6種) | 旧テンプレ | 将来削除（shikumiya-template以外） |
