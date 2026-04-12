# 02. システム設計書

> 最終更新: 2026-04-12
> ステータス: 確定（実装着手可）

---

## 1. システム全体構成

`[汎用]` このアーキテクチャは「申込→月額決済→テンプレートfork→自動デプロイ→編集依頼→自動反映」の基本パターン。ターゲット業種を変えても構造は同じ。

```
┌─────────────────────────────────────────────────────────┐
│                    ユーザー（ブラウザ）                      │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ LP (/)    │  │ テンプレ  │  │ 会員ページ │  │ 管理    │ │
│  │ + /start  │  │ プレビュー │  │ /member   │  │ /admin  │ │
│  └─────┬────┘  └──────────┘  └──────────┘  └─────────┘ │
│        │                                                 │
│        ▼                                                 │
│  ┌──────────────┐                                        │
│  │ /start ページ │                                        │
│  │ 業種選択      │                                        │
│  │ テンプレ選択   │                                        │
│  │ 顧客情報入力  │                                        │
│  └─────┬────────┘                                        │
└────────│────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   Stripe        │────▶│ Stripe Webhook  │
│ (月額サブスク決済) │     │ (/api/webhook)  │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   GAS           │
                        │ (Google Apps    │
                        │  Script)        │
                        │                 │
                        │ ・顧客DB記録     │
                        │ ・メール配信     │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ GitHub API      │
                        │                 │
                        │ ・テンプレートfork │
                        │ ・site.config.ts │
                        │   データ注入     │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Vercel        │
                        │ (ホスティング)    │
                        │                 │
                        │ ・自動ビルド     │
                        │ ・CDN配信       │
                        │ ・SSL           │
                        │ ・独自ドメイン   │
                        └─────────────────┘
```

---

## 2. 技術スタック

### 2.1 フロントエンド（LP + テンプレート + 管理画面）

| 技術 | バージョン | 用途 |
|---|---|---|
| Next.js | 16.2.0 | フレームワーク |
| React | 19 | UIライブラリ |
| TypeScript | strict | 型安全 |
| Tailwind CSS | 4 | スタイリング |
| Framer Motion | latest | アニメーション |
| Lucide React | latest | アイコン |
| react-easy-crop | latest | 画像クロップUI（編集依頼） |

### 2.2 バックエンド / インフラ

| 技術 | 用途 | コスト |
|---|---|---|
| Vercel Pro | ホスティング・CDN・SSL・独自ドメイン | $20/月 |
| Stripe | 月額サブスク決済 | 3.6%/取引 |
| Google Apps Script | Webhook受信・顧客管理・メール配信 | 無料 |
| Google Spreadsheet | 顧客DB | 無料 |
| GitHub API | テンプレートfork・コード更新 | 無料 |
| Claude API | 編集依頼（レイアウト/機能変更）のコード生成 | APIコスト（変動） |

### 2.3 月間固定コスト

```
Vercel Pro:        $20（約¥3,000）
Claude API:        約¥30,000（変動）
Stripe:            ¥0（固定費なし）
GAS:               ¥0
GitHub:            ¥0
────────────────────────────
合計:              約¥33,000/月
損益分岐:          ¥3,000 × 12人 = ¥36,000
```

### 2.4 価格プラン

`[固有]` 建築業ターゲット。制作費0円+月額サブスクリプション。

| プラン | 月額 | 制作費 | ポジション |
|--------|------|--------|-----------|
| ライト | ¥3,000 | 0円 | まず持つ。最低限のWeb存在 |
| ミドル | ¥8,000 | 0円 | おすすめ。集客の武器 |
| プレミアム | ¥15,000~ | 0円 | AIで差をつける |

全プラン共通: 独自ドメイン・SSL・レスポンシブ・お問い合わせフォーム・いつでも解約OK

---

## 3. データフロー

### 3.1 サイト自動生成フロー（月額サブスク開始）

`[汎用]` /start → Stripe月額決済 → Webhook → GitHub API（テンプレートfork） → Vercel（自動デプロイ） → 完了メール

```
[ユーザー]
  │
  ├─ 1. /start ページで申込情報を入力
  │     ・業種、会社名、テンプレ選択、画像、自己紹介、連絡先
  │
  ├─ 2. Stripe Checkoutで月額サブスク決済開始
  │
  ▼
[Stripe]
  │
  ├─ 3. 決済完了 → Webhook発火
  │
  ▼
[Webhook (/api/webhook)]
  │
  ├─ 4. Webhookを受信
  ├─ 5. 顧客情報をGASスプレッドシートに記録
  ├─ 6. GitHub APIでテンプレートリポジトリをfork
  ├─ 7. site.config.ts にユーザーデータを注入
  │     ・会社名、画像URL、テキスト、連絡先等
  │
  ▼
[GitHub]
  │
  ├─ 8. 新リポジトリ作成（テンプレートfork）
  ├─ 9. site.config.ts をコミット
  │
  ▼
[Vercel]
  │
  ├─ 10. 自動ビルド・デプロイ
  ├─ 11. URL発行（独自ドメイン or *.vercel.app）
  │
  ▼
[GAS]
  │
  ├─ 12. 完了メールをユーザーに送信（サイトURL + 会員ページURL）
  │
  ▼
[完了]
```

### 3.2 編集依頼フロー

#### 3.2.1 テキスト/画像変更（システム即反映）

`[汎用]` 編集フォーム → /api/site-update → GitHub API → Vercel自動デプロイ

```
[ユーザー]
  │
  ├─ 1. /member/[orderId]/edit-request で変更内容を入力
  │     ・テキスト: セクション別の一覧から変更箇所を選択+新テキスト入力
  │     ・画像: 現在の画像カードから差替画像アップロード → react-easy-cropでクロップ
  │
  ▼
[/api/site-update]
  │
  ├─ 2. site.config.ts の該当フィールドを書換
  ├─ 3. 画像の場合はpublic/に差替ファイルを配置
  │
  ▼
[GitHub API]
  │
  ├─ 4. 変更をコミット・push
  │
  ▼
[Vercel]
  │
  ├─ 5. 自動ビルド・デプロイ → 即反映
```

#### 3.2.2 レイアウト/機能変更（Claude API経由）

`[汎用]` 編集フォーム → GAS記録 → Claude API → コード変更 → GitHub → Vercel

```
[ユーザー]
  │
  ├─ 1. /member/[orderId]/edit-request で変更内容を入力
  │     ・レイアウト: セクション選択 + やりたいこと（移動/色変更/追加/削除）をチェック
  │     ・機能追加: 機能カードをタップ選択
  │     ・その他: 自由テキスト
  │
  ▼
[GAS]
  │
  ├─ 2. 依頼をスプレッドシートに記録
  │
  ▼
[Claude API]
  │
  ├─ 3. 現在のサイトコード + 依頼内容を解析
  ├─ 4. コード変更を生成
  │
  ▼
[GitHub API]
  │
  ├─ 5. 変更をコミット・push
  │
  ▼
[Vercel]
  │
  ├─ 6. 自動ビルド・デプロイ
  │
  ▼
[Lyo確認]
  │
  ├─ 7. /admin でデプロイ結果を確認 → OK/NG
  ├─ 8. スコア80点超で将来的に自動承認
```

---

## 4. ページ構成

### 4.1 ページ一覧

`[固有]` しくみやSaaSのページ構成。

```
/ .......................... LP（トップページ）
/start ..................... 申込フロー（業種選択→テンプレ選択→情報入力→決済）
/portfolio-templates/* ..... テンプレートプレビュー（9種: 3業態×3プラン）
/features .................. サイト機能一覧（14機能・プラン別比較）
/lp/construction ........... 建築業向けLP（SEO集客用）
/member/[orderId] .......... 顧客ダッシュボード
/member/[orderId]/edit-request .. 編集依頼フォーム
/member/[orderId]/history ...... 依頼履歴
/member/[orderId]/features ..... サイト機能管理（プラン別🔒）
/member/[orderId]/settings ..... 設定
/admin ..................... Lyo管理ダッシュボード（MRR/顧客/依頼キュー）
/legal ..................... 特定商取引法表示
/privacy ................... プライバシーポリシー
```

### 4.2 メインリポジトリ構成

```
lyo-vision-site/
├── docs/                              # 設計ドキュメント（本ファイル群）
├── public/
│   └── portfolio/                     # デモ用画像
├── src/
│   ├── app/
│   │   ├── page.tsx                   # LP（トップページ）
│   │   ├── start/                     # 申込フロー
│   │   ├── portfolio-templates/       # テンプレートプレビュー（9種）
│   │   │   ├── warm-craft/            # 工務店系ライト
│   │   │   ├── warm-craft-mid/        # 工務店系ミドル
│   │   │   ├── warm-craft-pro/        # 工務店系プレミアム
│   │   │   ├── trust-navy/            # 建設会社系ライト
│   │   │   ├── trust-navy-mid/        # 建設会社系ミドル
│   │   │   ├── trust-navy-pro/        # 建設会社系プレミアム
│   │   │   ├── clean-arch/            # 設計事務所系ライト
│   │   │   ├── clean-arch-mid/        # 設計事務所系ミドル
│   │   │   └── clean-arch-pro/        # 設計事務所系プレミアム
│   │   ├── features/                  # サイト機能一覧
│   │   ├── lp/construction/           # 建築業向けLP
│   │   ├── member/[orderId]/          # 顧客管理ページ
│   │   │   ├── page.tsx               # ダッシュボード
│   │   │   ├── layout.tsx             # サイドバー付きレイアウト
│   │   │   ├── edit-request/          # 編集依頼フォーム
│   │   │   ├── history/               # 依頼履歴
│   │   │   ├── features/              # サイト機能管理
│   │   │   └── settings/              # 設定
│   │   ├── admin/                     # Lyo管理ダッシュボード
│   │   ├── api/
│   │   │   ├── webhook/               # Stripe Webhook
│   │   │   └── site-update/           # 編集依頼API
│   │   ├── legal/                     # 特定商取引法表示
│   │   ├── privacy/                   # プライバシーポリシー
│   │   └── not-found.tsx              # 404ページ
│   ├── components/
│   │   ├── HeroSection.tsx            # LP: ヒーロー
│   │   ├── ShowcaseSection.tsx        # LP: テンプレギャラリー
│   │   ├── AboutSection.tsx           # LP: 運営者
│   │   ├── ServiceSection.tsx         # LP: 制作の流れ
│   │   ├── PricingSection.tsx         # LP: 価格
│   │   ├── FAQSection.tsx             # LP: FAQ
│   │   ├── ContactSection.tsx         # LP: 問い合わせフォーム
│   │   └── portfolio-templates/       # テンプレートコンポーネント（9種）
│   └── lib/
│       ├── structured-data.ts         # JSON-LD生成
│       ├── error-handler.ts           # エラーハンドリング
│       └── member-context.ts          # 会員コンテキスト
└── template-site/                     # テンプレートの元ファイル（fork元）
```

### 4.3 顧客サイトリポジトリ（自動生成）

```
[company-name]-site/
├── public/
│   └── images/                    # 顧客の画像（施工事例等）
├── src/
│   ├── app/
│   │   ├── page.tsx               # トップページ
│   │   └── layout.tsx             # レイアウト
│   ├── components/                # テンプレートのコンポーネント
│   └── site.config.ts             # 顧客固有の設定
│       {
│         companyName: "会社名",
│         title: "サイトタイトル",
│         description: "会社紹介",
│         contact: { phone, email, address },
│         works: [{ title, image, category }],
│         plan: "lite" | "middle" | "premium"
│       }
├── next.config.ts
├── package.json
└── tailwind.config.ts
```

---

## 5. メール配信設計

### 5.1 自動配信スケジュール（サブスク開始後）

| # | タイミング | 件名 | 目的 |
|---|---|---|---|
| 1 | 申込直後 | サイトが完成しました！ | URL通知・初期感動 |
| 2 | 3日後 | サイトの編集方法をご案内します | 編集依頼の使い方案内 |
| 3 | 1週間後 | お客様の声を追加しませんか？ | 機能活用促進 |
| 4 | 2週間後 | サイトをもっと良くする3つのヒント | アップグレード種まき |
| 5 | 1ヶ月後 | 上位プランでできること | アップグレード提案 |

### 5.2 実装

- GAS の時限トリガー（ScriptApp.newTrigger）
- テンプレートメールをスプレッドシートで管理
- 送信ログもスプレッドシートに記録

---

## 6. セキュリティ設計

### 6.1 データの分類

| データ | 保存場所 | アクセス権 |
|---|---|---|
| メールアドレス・会社情報 | GAS Spreadsheet | Lyoのみ |
| 施工事例画像 | Vercel（各サイトのpublic/） | 公開 |
| 決済情報 | Stripe（保持しない） | Stripe管理 |
| サイトソースコード | GitHub（private repo） | Lyoのみ |
| 編集依頼履歴 | GAS Spreadsheet | Lyo + 該当顧客 |

### 6.2 認証

- 会員ページ: orderId ベースのURL限定アクセス（MVP段階）
- 管理ページ: Lyo専用（将来: Vercel Edge Middleware + 認証）
