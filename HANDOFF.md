# しくみや — セッション引き継ぎメモ

> 最終更新: 2026-04-02

## 次のセッションで最初に読むファイル（この順番で）

```
1. このファイル（HANDOFF.md）— 全体の状況把握
2. docs/01_REQUIREMENTS.md — 要件定義（何を作るか）
3. docs/02_ARCHITECTURE.md — 技術設計（どう作るか）
4. docs/03_BUSINESS_MODEL.md — 価格・解約・収益（いくらで売るか）
5. docs/04_FUNNEL_DESIGN.md — ファネル設計（どう売るか）
6. docs/05_DIFFERENTIATION.md — 差別化戦略（なぜ勝てるか）
7. docs/06_CURRICULUM.md — カリキュラム（作った後どうするか）
```

メモリも確認：`C:\Users\ryoya\.claude\projects\c--Users-ryoya-OneDrive-AI-Claude-lyo-vision-site\memory\MEMORY.md`

## プロジェクト概要

- **事業**: AIアーティスト向けオリジナルギャラリーサイト制作
- **サイト**: https://lyo-vision-site.vercel.app
- **リポジトリ**: c:\Users\ryoya\OneDrive\AI\Claude\lyo-vision-site
- **運営者**: Lyo（個人事業「Lyo Vision」）
- **Claudeの呼び名**: クロコ（Lyoの相棒）

## 現在の状態

### 完了済み
- [x] 事業戦略の全設計（ターゲット・価格・ファネル・差別化・インフラ）
- [x] 設計ドキュメント6本作成（docs/配下、汎用フレームワーク付き）
- [x] テンプレート10種にAIアート作品画像を差し替え（全デプロイ済み）
- [x] Lyoがモバイルレスポンシブ調整済み（split-showcase, stack-cards, horizontal-scroll, neo-brutalist, globals.css）

### 次にやること（優先度順）
1. **LP書き換え** — 新戦略に合わせてトップページを全面リニューアル
   - Hero: 「あなたのAIアート、流れていくだけでいいの？」+ テンプレプレビュー
   - 価格セクション新規作成（¥980買い切り / ¥2,980月額 / 要相談）
   - 「作った後」ロードマップセクション新規作成
   - Formspreeフォーム設置（問い合わせ + 申込み）
   - JSON-LD構造化データ（Service, FAQ, Person）
   - 日本語メイン、かっこいい部分だけ英語
2. **フォーム自動生成MVP** — 1テンプレートで「フォーム入力→サイト自動生成」が動くか検証
3. **特定商取引法ページ** — /legal に新規作成
4. **note記事1本** — AIアートポートフォリオサイトの紹介

## 価格設計（確定）

```
¥980（買い切り）  = フォーム入力→自動生成。vercel.appドメイン。保守なし
¥2,980/月        = 編集フォーム→AI確認→承認→AI自動実装。独自ドメイン。会員コンテンツ
要相談           = Lyoが直接対応。フルカスタム
アップグレード割引 = ¥980購入から1ヶ月以内に¥2,980申込み→初月¥980引き
```

## インフラ（確定）

- ホスティング: Vercel Pro（$20/月、Lyoアカウント一元管理、プロジェクト数無制限）
- 決済: Stripe（3.6%）
- メール配信: Stripe Webhook + GAS
- 顧客DB: Google Spreadsheet
- サイト生成: Claude Code CLI

## 重要な判断事項

- noteはメンバーシップ不使用。記事の単品売りのみ（手数料15%が痛い+招待枠制限）
- コンテンツ配信は自社サイト内の会員専用ページ（かわいさん方式）
- LINEは使わない
- AI構築の事実は対外的に伏せる
- 解約: いつでもOK、サイトは残る、更新停止、再開いつでも可
- Xアカウント: @ando_lyo（Lyo@しくみや）で運用
- 「ポートフォリオ」はSEO用、「ギャラリー」はコピー用。両方使う

## テンプレート一覧（10種・全てAIアート画像入り）

| テンプレート | パス | 特徴 |
|---|---|---|
| cinematic-dark | /templates/cinematic-dark | フルスクリーン・スクロールスナップ |
| minimal-grid | /templates/minimal-grid | グリッド・カテゴリフィルター |
| warm-natural | /templates/warm-natural | ベージュ基調・カード型 |
| horizontal-scroll | /templates/horizontal-scroll | 横スクロール |
| elegant-mono | /templates/elegant-mono | モノクロ・パララックス |
| ai-art-portfolio | /templates/ai-art-portfolio | AIアート特化 |
| split-showcase | /templates/split-showcase | 左右分割 |
| stack-cards | /templates/stack-cards | カードスタッキング |
| neo-brutalist | /templates/neo-brutalist | 太字・原色 |
| glass-morphism | /templates/glass-morphism | ガラス透過 |

## ファイル構成

```
lyo-vision-site/
├── HANDOFF.md              ← このファイル
├── docs/                   ← 設計ドキュメント6本
├── public/portfolio/       ← AIアート画像22枚
├── src/
│   ├── app/
│   │   ├── page.tsx        ← LP（要書き換え）
│   │   ├── templates/      ← テンプレ一覧・詳細ページ
│   │   ├── not-found.tsx   ← 404
│   │   └── privacy/        ← プライバシーポリシー
│   ├── components/
│   │   ├── HeroSection.tsx      ← LP Hero（要書き換え）
│   │   ├── ShowcaseSection.tsx  ← テンプレギャラリー
│   │   ├── AboutSection.tsx     ← 運営者
│   │   ├── ServiceSection.tsx   ← 制作の流れ
│   │   ├── ResourcesSection.tsx ← note記事導線
│   │   ├── FAQSection.tsx       ← FAQ
│   │   ├── ContactSection.tsx   ← 問い合わせ
│   │   └── templates/           ← テンプレコンポーネント10種
│   └── site.config.ts
└── template-site/          ← テンプレの元ファイル（tsconfig excludeで除外済み）
```

## Lyoについて

- 辛口フィードバック歓迎。忖度不要
- 「まだやれることがあるならやってから作ろう」というスタンス
- Claudeを「クロコ」と呼ぶ。相棒
- 「顧客を迷わせちゃいけない」が信条
