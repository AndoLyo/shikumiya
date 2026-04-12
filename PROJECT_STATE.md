# 現在のプロジェクト状態（最終更新: 2026-04-12）

## 事業内容
**しくみや** — **全業種対応**のホームページ制作SaaS
- 建築は最初の業種パック。建築に全振りしない
- 今後: 無形商材、飲食、士業など他業種にも展開
- システム（API、管理ページ、決済、デプロイ）は業種に依存しない汎用設計
- 新業種追加 = テンプレ追加 + /startの選択肢追加。API・管理ページは変更不要

## ビジネスモデル
- 制作費: **0円**（初期費用ゼロ）
- 月額利用料: おまかせ¥3,000 / まるっとおまかせ¥8,000 / ぜんぶおまかせ¥15,000~
- 独自ドメイン: **全プラン対応**
- 差別化: 「写真を送るだけ。あとは全部おまかせ」

## プラン名（2026-04-12確定）
| 表示名 | 内部ID | 月額 | Stripe Price ID |
|--------|--------|------|-----------------|
| おまかせ | lite | ¥3,000 | price_1TLR8wAHGiGiMXDLR4dj9XUl |
| まるっとおまかせ | middle | ¥8,000 | price_1TLR9QAHGiGiMXDLrPmSoOm1 |
| ぜんぶおまかせ | premium | ¥15,000 | price_1TLR9vAHGiGiMXDLmsScxJ33 |

## ターゲット
- 全業種の中小零細企業（建築が最初のターゲット）
- ホームページがない or 10年前のまま放置
- パソコン苦手。自分では何もしたくない

## テンプレート構成
- **建築パック（完成済み）**: warm-craft / trust-navy / clean-arch × lite/mid/pro = 9テンプレ
- **無形商材パック（計画中）**: 未定
- 全テンプレートはsite.config.jsonでデータ分離済み
- パス: `src/app/portfolio-templates/`

## 各プランの違い
### おまかせ（¥3,000/月）
- テンプレート選択、写真10枚、会社概要、お問い合わせフォーム
- 電話タップ発信、SSL、レスポンシブ、独自ドメイン、月1回更新

### まるっとおまかせ（¥8,000/月）★おすすめ
- おまかせの全機能 +
- 施工実績詳細ページ（Before/After）
- お客様の声、ブログ/お知らせ、Google Maps
- SEO強化（JSON-LD/OGP）、月3回更新

### ぜんぶおまかせ（¥15,000~/月）
- まるっとおまかせの全機能 +
- AIチャットボット、予約システム、採用ページ
- 多言語対応、360°ビューア、PDF資料DL、動画セクション、LINE通知

## 新規顧客の申込フロー
- **入口: `/start`** → `/api/start` → Stripe Checkout（月額サブスク）
- STEP 0: 業種を選ぶ
- STEP 1: テンプレートを選ぶ
- STEP 2: 会社名を入力 → リアルタイムでデモサイト表示
- STEP 3: ドメイン決定 + メアド → 「このサイトを作る」→ Stripe決済
- 無料相談は不要。即申込

## ページ構成（あるべき姿）
| パス | 役割 | 主なCTA |
|------|------|---------|
| `/` | トップページ（全業種対応） | → `/start` |
| `/start` | 新規申込フロー | → Stripe決済 |
| `/lp/construction` | 建築向けLP（SEO用） | → `/start` |
| `/portfolio-templates/*` | テンプレートデモ | → `/start` |
| `/member/[orderId]` | 顧客管理ページ | — |
| `/admin` | Lyo運営管理ページ | — |

## 全CTAの向き先
- **すべて `/start` に統一**
- 「無料で相談する」→ ❌ 廃止。「今すぐサイトを作る」に統一
- 問い合わせフォーム → ❌ トップページからは廃止

## 完了済み
- ✅ 9テンプレート作成（3業種×3プラン）
- ✅ site.config.json分離（全9テンプレ）
- ✅ 顧客管理ページ（/member/）
- ✅ Lyo管理ページ（/admin/）
- ✅ 編集依頼フォーム（選択式UI+クロップ）
- ✅ /start申込フロー（/api/start接続済み）
- ✅ Stripe 3プラン設定（Price ID設定済み）
- ✅ プラン名変更（おまかせ/まるっと/ぜんぶ）
- ✅ CTA全て/start統一
- ✅ github.ts / stripe.ts / template-config-generator.ts / error-handler.ts
- ✅ site-config-schema.ts（22型定義）

## 未着手の重要タスク
1. **Webhook書き換え**（旧ポートフォリオ→新SiteConfig形式）← 今ここ
2. GAS更新（フィールド名・プラン名の汎用化）
3. テキスト/画像の即反映API
4. プラン変更API
5. Claude API連携
6. Admin実データ接続

## ✅ 2026-04-12 矛盾修正（第2回）
- ✅ settings「テンプレート10種」→「業種に合ったテンプレートを選択」
- ✅ OG画像「テンプレート10種」→「制作費0円のHP制作SaaS」
- ✅ /startテンプレ名「＋/Pro」→「おまかせ/まるっと/ぜんぶ」
- ✅ メタデータ「建築業のHP制作」→「全業種対応のHP制作SaaS」

## ✅ 2026-04-12 全Phase完了
- ✅ Phase 0: Stripe 3プラン設定
- ✅ Phase 1: /api/start + /start接続
- ✅ Phase 2: Webhook書き換え（684→403行、新SiteConfig JSON形式）
- ✅ Phase 3: GAS更新（フィールド名・プラン名・メール文面）
- ✅ Phase 4: /api/site-update + /api/site-content（即反映API）
- ✅ Phase 5: /api/plan-change（Stripeサブスク変更）
- ✅ Phase 6: /api/edit-request（Claude API連携エンドポイント）
- ✅ Phase 7: /admin実データ接続（GAS API経由）
- ✅ industry-registry.ts（35業種登録、テンプレあり=表示の自動制御）

## ⚠️ 残存する古い箇所
- /api/checkoutが旧APIとして残存（削除推奨）
- 旧テンプレ10種のファイル実体（リダイレクト済み、将来削除）
- studio-white/page型エラー（旧コンポーネント参照、機能に影響なし）
