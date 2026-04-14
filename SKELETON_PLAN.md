# Walking Skeleton 設計 — しくみや SaaS

> 作成日: 2026-04-13

## ゴール（1文）

**「中小企業が業種とテンプレを選んで決済するだけで、翌日には自社名入りのホームページが公開され、テキスト変更もブラウザから自分でできる」**

---

## 1. コアフロー定義

```
[開始] 顧客が /start にアクセス
  → ① 業種・テンプレ選択
  → ② 会社名入力 + プレビュー
  → ③ Stripe決済
  → ④ Webhook → サイト自動生成
  → ⑤ 顧客にURL通知（メール + /start/success）
  → ⑥ 顧客が /member にログイン
  → ⑦ 自分のサイト情報を確認
  → ⑧ テキストを1箇所変更する
  → ⑨ 変更がサイトに反映される
  → ⑩ Lyoが /admin で顧客を確認
  → [ゴール到達]
```

### 各ステップの詳細

| # | ステップ | 何が起きるか | 現状 | 30%で通すために最低限必要な実装 |
|---|---------|------------|------|-------------------------------|
| ① | 業種・テンプレ選択 | 顧客が建築業種を選び、3テンプレから1つ選ぶ | **動作する**（ただし業種ハードコード） | そのまま使う。industry-registry接続はSkeletonでは不要 |
| ② | 会社名入力+プレビュー | 名前を入れるとデモサイトに反映される | **動作する** | そのまま使う |
| ③ | Stripe決済 | 月額サブスクの決済セッションが作られる | **動作する** | そのまま使う |
| ④ | サイト自動生成 | webhook → リポ作成 → テンプレコピー → config生成 → デプロイ | **壊れている** | テンプレートリポをGitHubにpush + webhook修正をデプロイ（**済み**） |
| ⑤ | URL通知 | 決済完了メール + /start/success表示 | **部分動作** | /start/successにsession_idからorderIdを表示する（最小限） |
| ⑥ | /member ログイン | orderId + emailで認証 | **動作する** | そのまま使う |
| ⑦ | サイト情報確認 | 自分の会社名・サイトURL・プラン・編集回数が見える | **UI仮組み**（ハードコード） | /api/member/[orderId] を呼んで実データ表示に差し替え |
| ⑧ | テキスト変更 | 「キャッチコピーを変えたい」→ フォーム送信 | **UI仮組み**（API未呼出） | /api/site-content で現在値取得 → /api/site-update で変更送信 |
| ⑨ | サイト反映 | GitHub pushでVercel自動リデプロイ | **動作する**（site-update API自体は実装済み） | ⑧が繋がれば自動で動く |
| ⑩ | Lyo管理確認 | /adminで新規顧客が表示される | **部分動作** | GASにget_all_customersアクション追加。/admin/accountsを接続 |

### 最短パスの結論

**既に動くもの**: ①②③⑥⑨ = 5/10ステップ
**壊れているが修正済み（未デプロイ）**: ④ = 1ステップ
**実装が必要**: ⑤⑦⑧⑩ = 4ステップ

つまり **4ステップの接続作業** で Skeleton が通る。

---

## 2. 後回しにする機能リスト

| 機能 | 後回しの理由 | 仮の代替手段 |
|------|------------|------------|
| 画像変更（クロップUI） | コアフローはテキスト変更で証明できる | 「画像変更は準備中です」表示 |
| レイアウト/機能変更（Claude API） | 最も複雑。Skeletonの後で段階的に実装 | 「レイアウト変更は準備中です」表示 |
| プラン変更 | 初回Skeletonでは1プランで十分 | settings画面に「プラン変更はお問い合わせください」表示 |
| サブスク解約/更新処理 | 初期顧客はまだ解約しない | Stripeダッシュボードで手動対応 |
| MRR計算 | 管理上の便利機能。事業に必須ではない | Stripeダッシュボードで確認 |
| /admin/requests 依頼キュー | Claude API連携が前提。段階2で実装 | GASスプレッドシートで直接確認 |
| /member/history 依頼履歴 | 表示だけの機能。編集が動けば後でよい | 「履歴機能は準備中です」表示 |
| /member/features 機能管理 | プラン比較UI。コアフローに不要 | settingsのプラン表示で代替 |
| /member/edit サイトエディタ | ビジュアルエディタは大工事。edit-requestで代替 | edit-requestフォームで十分 |
| industry-registry動的読み込み | 建築1業種で十分Skeletonは通る | ハードコード4業種のまま |
| メール文面の作り込み | 届けば十分 | GASの現在の文面で十分 |
| /start/success の注文ID表示 | あれば安心だが必須ではない | 「メールをご確認ください」表示のまま |
| 旧コード削除（checkout, site-data等） | 動作に影響なし | 放置 |

---

## 3. データ構造の最低限設計

### 現在のスキーマ → Skeletonで使う範囲

```
SiteConfig（変更なし — 現在の設計で十分）
├── templateId     ✅ 使う
├── plan           ✅ 使う
├── orderId        ✅ 使う
├── siteUrl        ✅ 使う
├── company        ✅ 使う（name, tagline, phone, email, address, ceo, bio）
├── projects       ✅ 使う（空配列で初期化。後から追加）
├── strengths      ✅ 使う（空配列で初期化）
├── services       ⏸ 後回し（trust-navy用）
├── stats          ⏸ 後回し（trust-navy用）
├── testimonials   ⏸ 後回し（middle以上）
├── news           ⏸ 後回し（middle以上）
├── awards         ⏸ 後回し（clean-arch用）
├── bookingEvents  ⏸ 後回し（premium）
├── chatFAQs       ⏸ 後回し（premium）
├── jobs           ⏸ 後回し（trust-navy-pro）
└── style          ✅ 使う（DEFAULT_STYLEで初期化）
```

**判定: スキーマ変更は不要。** 現在の SiteConfig + template-config-generator で Skeleton に十分。

### GAS スプレッドシート — 追加が必要

現在の「注文データ」シートのカラム:

```
order_id | company_name | email | phone | plan | template | site_url | 
status | domain | stripe_session_id | stripe_customer_id | 
stripe_subscription_id | amount_total | ceo | bio | tagline | 
address | industry | created_at
```

**Skeletonで追加が必要なGASアクション:**

| アクション | 用途 | 返却データ |
|-----------|------|----------|
| `get_all_customers` | /admin/accounts用 | 全行を配列で返却 |
| `get_customer` | /member/[orderId]用 | orderId一致行を返却（※verifyで代替可能） |

**判定:** `get_all_customers` の1アクション追加のみ。`get_customer` は既存の `verify` アクションで代替可能（orderId + email で認証 + データ返却を兼ねる）。

### データフロー（Skeleton版）

```
【生成フロー — 既存でほぼ動く】
/start フォーム
  → POST /api/start（Gist作成 + Stripe Session）
  → Stripe Checkout（顧客が決済）
  → POST /api/webhook（Gist取得 → リポ生成 → page.tsx + site.config.json push → Vercelデプロイ）
  → GAS通知（注文記録 + メール送信）

【編集フロー — 接続が必要】
/member/[orderId]/edit-request
  → GET /api/site-content?orderId=X&email=Y（現在のsite.config.json取得）
  → フォームに現在値をセット
  → 顧客がテキスト変更
  → POST /api/site-update（config更新 → GitHub push → Vercel自動リデプロイ）

【管理フロー — GAS追加が必要】
/admin/accounts
  → GET /api/admin?action=accounts
  → /api/admin が GAS?action=get_all_customers を呼ぶ
  → 全顧客リストを返却
```

### ⚠️ 慎重に設計すべき点

**1. GAS verify → member データ取得の統合**

現在の `verify` アクションは認証のみ（orderId + email の一致確認 + 基本データ返却）。
Skeleton では **verify のレスポンスにサイト情報を含める** ことで、追加APIなしでダッシュボードを実データ化できる。

```
// GAS verify の現在のレスポンス
{ success: true, plan: "lite", editsUsed: 0, ... }

// Skeleton で必要な追加フィールド
{ 
  success: true, 
  plan: "lite", 
  editsUsed: 0,
  companyName: "○○工務店",    // ← 追加
  siteUrl: "https://...",      // ← 追加
  template: "warm-craft",      // ← 追加
  domain: "...",               // ← 追加
  status: "公開中",            // ← 追加
  createdAt: "2026-04-13"     // ← 追加
}
```

**2. site-update の configPath 設計**

テキスト変更は `configPath` のドット記法で指定する（例: `company.tagline`）。
この設計は将来の拡張にも耐える。変更不要。

**3. 編集回数のカウント**

現在の `/api/site-update` は既に編集回数制御を実装済み（lite: 1回/月, middle: 3回, premium: 99回）。
GAS の `editsUsed` カウントに依存。この設計も変更不要。

---

## 4. 実装タスクリスト

### 前提: Phase 1（テンプレートリポ + webhook修正）は完了済み

| # | タスク | 対象ファイル | 規模 | 依存 |
|---|--------|------------|:----:|:----:|
| **A. テンプレートリポ push（ブロッカー）** | | | | |
| 1 | shikumiya-template リポを GitHub に push | GitHub (AndoLyo/shikumiya-template) | 小 | なし |
| 2 | メインリポの webhook 修正を commit + push + Vercel デプロイ | src/app/api/webhook/route.ts | 小 | なし |
| 3 | テスト決済 → 生成サイトが正しいテンプレで表示されるか確認 | — | 小 | #1, #2 |
| **B. GAS API 拡充** | | | | |
| 4 | GAS に `get_all_customers` アクション追加 | gas/webhook.gs | 小 | なし |
| 5 | GAS の `verify` レスポンスに companyName, siteUrl, template, domain, status, createdAt を追加 | gas/webhook.gs | 小 | なし |
| **C. /member ダッシュボード実データ化** | | | | |
| 6 | /member/[orderId] のハードコードを /api/member/[orderId] 呼び出しに差し替え | src/app/member/[orderId]/page.tsx | 中 | #5 |
| 7 | MemberCtx に実データを注入（plan, companyName, siteUrl を GAS から取得） | src/app/member/[orderId]/layout.tsx + src/lib/member-context.ts | 中 | #5 |
| **D. テキスト編集の接続** | | | | |
| 8 | edit-request ページで /api/site-content を呼び、現在値をフォームにセット | src/app/member/[orderId]/edit-request/page.tsx | 中 | #6 |
| 9 | テキスト変更の送信ボタンで /api/site-update を呼ぶ | src/app/member/[orderId]/edit-request/page.tsx | 中 | #8 |
| 10 | 成功/失敗のフィードバックUI（トースト通知 + 残り回数表示） | src/app/member/[orderId]/edit-request/page.tsx | 小 | #9 |
| **E. /admin 実データ化** | | | | |
| 11 | /api/admin の accounts アクションで GAS get_all_customers を呼ぶ | src/app/api/admin/route.ts | 小 | #4 |
| 12 | /admin/accounts のハードコードを API 呼び出しに差し替え | src/app/admin/accounts/page.tsx | 中 | #11 |
| **F. 後回し機能の「準備中」表示** | | | | |
| 13 | 画像変更・レイアウト変更・プラン変更に「準備中」バッジ追加 | edit-request, settings の各page.tsx | 小 | なし |
| **G. E2E 確認** | | | | |
| 14 | テスト決済 → /member ログイン → テキスト変更 → サイト反映 → /admin 確認 | — | 中 | 全タスク |

### 依存関係図

```
#1 テンプレリポpush ─┐
                      ├─ #3 E2Eテスト（生成）
#2 webhook デプロイ ──┘

#4 GAS get_all_customers ─── #11 admin API ─── #12 admin画面

#5 GAS verify拡張 ─── #6 member画面 ─── #8 site-content取得 ─── #9 site-update送信 ─── #10 フィードバック
                  └── #7 MemberCtx

#13 準備中表示 （独立）

全タスク ─── #14 E2E確認
```

### クリティカルパス

```
#1 → #2 → #3 → #5 → #6 → #8 → #9 → #14
```

**8タスクが直列。** ただし #4, #5 は GAS の同時編集、#6, #7 は /member の同時編集、#11, #12 は /admin の同時編集でそれぞれバッチ化可能。

### 実質的な作業グループ

| グループ | タスク | 並行可能 | 推定 |
|---------|--------|:-------:|------|
| G1: デプロイ | #1, #2, #3 | #13と並行 | 小 |
| G2: GAS拡張 | #4, #5 | G1と並行 | 小 |
| G3: /member実データ化 | #6, #7 | — | 中 |
| G4: テキスト編集接続 | #8, #9, #10 | — | 中 |
| G5: /admin実データ化 | #11, #12 | G4と並行 | 中 |
| G6: 準備中表示 | #13 | G1と並行 | 小 |
| G7: E2E確認 | #14 | — | 中 |

**G1+G2 → G3 → G4（+G5並行）→ G7**

---

## 5. Skeleton 完了の判定基準

Skeleton が「通った」と言える条件:

- [ ] テスト決済後、正しいテンプレートのサイトが生成される
- [ ] 生成サイトに顧客の会社名が表示される
- [ ] /member にログインすると、自分の会社名・サイトURLが見える（「山田工務店」がゼロ）
- [ ] テキスト変更を送信すると、サイトのキャッチコピーが変わる
- [ ] /admin/accounts に実際の顧客が表示される

この5つが全てPassなら、Skeleton 完了。
