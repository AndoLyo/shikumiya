# 機能カタログ（Feature Catalog）

> しくみや SaaS — 顧客サイトに追加可能な全機能の一覧

## 定義ファイルの構造（共通フォーマット）

各機能の定義ファイルは以下の構造を持つ:

```markdown
# {機能名}
> ID: {id} | カテゴリ: {section/parts/function/validation} | プラン: {lite/middle/premium/all}

## 概要
何をする機能か、なぜ必要か

## 必須要件
実装時に必ず満たすべき仕様

## 推奨パターン
建築テンプレガイド調査に基づく実装パターン

## コンポーネント仕様
ファイル配置、props、状態管理、データ構造

## チェック項目
バリデーション時に確認する項目リスト

## スコアリング補足
この機能特有の評価ポイント
```

## プラン別機能マッピング

### ライトプラン（¥3,000/月）— 14機能
| # | ID | 機能名 |
|---|---|---|
| 01 | hero-section | ヒーローセクション |
| 03 | works-gallery | 施工実績/WORKS |
| 04 | service-section | 事業内容/サービス |
| 10 | company-info | 会社情報 |
| 11 | cta-section | CTAバー/セクション |
| 15 | faq-section | FAQ |
| 17 | header-nav | ヘッダー+ナビゲーション |
| 18 | footer | フッター |
| 19 | contact-form | お問い合わせフォーム |
| 22 | sns-integration | SNSリンク+埋め込み |
| 30 | image-gallery | 画像ギャラリー |
| 36 | animation | スクロールアニメーション |
| 37 | seo-check | SEO対策チェック |
| 38 | responsive-check | レスポンシブ対応チェック |

### ミドルプラン（¥8,000/月）— ライト全部 + 12機能 = 26機能
| # | ID | 機能名 |
|---|---|---|
| 02 | news-section | ニュース/お知らせ |
| 05 | product-lineup | 商品ラインアップ |
| 06 | technology-section | テクノロジー/技術力 |
| 07 | pickup-section | ピックアップ/特集 |
| 08 | testimonials | お客様の声 |
| 14 | blog-section | ブログ/コラム |
| 16 | before-after | ビフォーアフター |
| 20 | breadcrumbs | パンくずリスト |
| 21 | google-maps | Google Maps埋め込み |
| 23 | cookie-consent | Cookie同意バナー |
| 32 | review-rating | レビュー/評価 |
| 33 | notification | 通知システム |
| 35 | dark-mode | ダークモード切替 |

### プレミアムプラン（¥15,000〜/月）— 全40機能
| # | ID | 機能名 |
|---|---|---|
| 09 | location-search | 展示場・拠点検索 |
| 12 | video-section | 動画セクション |
| 13 | recruit-page | 採用ページ |
| 24 | site-search | サイト内検索 |
| 25 | ai-chatbot | AIチャットボット |
| 26 | booking-system | 予約システム |
| 27 | multilingual | 多言語切替 |
| 28 | panorama-viewer | 360度パノラマビューア |
| 29 | pdf-download | PDF資料ダウンロード |
| 31 | file-upload | ファイルアップロード |
| 34 | analytics-dashboard | アクセス解析ダッシュボード |
| 39 | accessibility-check | アクセシビリティチェック |
| 40 | performance-check | パフォーマンスチェック |

## 技術スタック（全機能共通）

- **Framework**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS（ハードコードHEX + テンプレ別CSS変数）
- **Animation**: Framer Motion（whileInView + stagger パターン）
- **Icons**: Lucide React
- **Images**: next/image + WebP
- **Form**: uncontrolled + useState
- **Modal**: AnimatePresence

## コンポーネント配置ルール

```
src/app/portfolio-templates/{template-id}/
└── page.tsx  ← 全セクションを1ファイルに含む（モノリシック）

※ コンポーネント分割する場合:
src/components/portfolio-templates/{template-id}/
├── HeroSection.tsx
├── WorksSection.tsx
└── ...
```

## アニメーション共通パターン

```tsx
// フェードイン
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}

// スタガー（リスト項目）
transition={{ duration: 0.6, delay: i * 0.08 }}

// パララックス
const { scrollYProgress } = useScroll({ target: ref });
const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

// reduced-motion対応
const prefersReducedMotion = useReducedMotion();
```
