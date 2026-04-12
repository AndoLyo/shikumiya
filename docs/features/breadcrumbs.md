# パンくずリスト
> ID: breadcrumbs | カテゴリ: parts | プラン: middle

## 概要
サイト内の階層構造を視覚的に示し、ユーザーの現在位置を明確にするナビゲーション補助パーツ。全下層ページに配置し、「ホーム > カテゴリ > 現在のページ」の形式でリンクを表示する。SEO 観点では Schema.org `BreadcrumbList` の構造化データを出力し、Google 検索結果にパンくずが表示されることで CTR 向上に寄与する。業種を問わず、ページ数が多いサイト（施工実績、商品一覧、メニュー、施術内容等）で特に効果が高い。既存3テンプレートには未実装のため、本機能は新規コンポーネントとして追加する。

## この機能の核
「今どこにいるか」「トップに戻るには」がわかる

## 必須要件
- 全下層ページに表示（トップページ単独では非表示）
- 階層構造: ホーム > カテゴリ > サブカテゴリ > 現在のページ
- 最終項目（現在のページ）はリンクなしのテキスト表示
- 中間項目は `next/link` でクリック遷移
- Schema.org `BreadcrumbList` 構造化データを `<script type="application/ld+json">` で出力
- 区切り文字: `>` または `/`（テンプレート設定で切り替え可能）
- セマンティック構造: `<nav aria-label="パンくずリスト">` + `<ol>` + `<li>`
- レスポンシブ: モバイルでは中間項目を省略表示（ホーム > ... > 現在ページ）
- `prefers-reduced-motion` 対応

## 業種別バリエーション

### 建築・建設
```
ホーム > 施工実績 > 新築 > ○○邸
ホーム > 技術 > 耐震工法 > ○○構法
ホーム > 会社概要 > 代表挨拶
ホーム > お知らせ > 2026 > 受賞のお知らせ
```

### 小売・EC
```
ホーム > 商品一覧 > カテゴリ名 > 商品名
ホーム > 店舗案内 > エリア > ○○店
ホーム > お知らせ > セール情報
ホーム > ご利用ガイド > 返品・交換について
```

### 飲食
```
ホーム > メニュー > ランチ > ○○セット
ホーム > 店舗案内 > ○○店
ホーム > こだわり > 素材について
ホーム > ニュース > 季節限定メニューのお知らせ
```

### 美容・サロン
```
ホーム > メニュー > カット > デザインカット
ホーム > スタッフ > ○○（スタイリスト名）
ホーム > サロン案内 > アクセス
ホーム > ブログ > 2026 > ヘアケアのコツ
```

### 医療・クリニック
```
ホーム > 診療案内 > 一般内科
ホーム > 医師紹介 > ○○医師
ホーム > 施設案内 > 検査機器
ホーム > お知らせ > 休診のお知らせ
```

### 士業・コンサルティング
```
ホーム > サービス > 法人向け > 顧問契約
ホーム > 実績 > ○○プロジェクト
ホーム > コラム > カテゴリ名 > 記事タイトル
```

## 既存テンプレートとの接続

### warm-craft（暖色ナチュラル系）
- **現状**: パンくずリスト未実装
- **配置場所**: ヘッダー直下、セクション内の先頭（`<section>` の最初の `<div>` 内）
- **スタイル指針**: `text-[#8B7D6B]`（テキスト色）/ `hover:text-[#7BA23F]`（リンクホバー）/ `bg-[#FAF7F2]`（背景）
- **区切り文字**: `>` （テキスト `text-[#C4B5A0]`）
- **接続方法**: 各ページ（施工実績詳細、会社案内サブページ等）の先頭に `<Breadcrumbs items={[...]} />` を配置

### trust-navy（ネイビー重厚系）
- **現状**: パンくずリスト未実装
- **配置場所**: ヘッダー直下
- **スタイル指針**: `text-gray-400`（テキスト色）/ `hover:text-[#1B3A5C]`（リンクホバー）/ `bg-[#F0F4F8]`（背景）
- **区切り文字**: `/` （テキスト `text-gray-300`）
- **接続方法**: サブページに `<Breadcrumbs items={[...]} />` を配置

### clean-arch（ミニマルモノクロ系）
- **現状**: パンくずリスト未実装
- **配置場所**: ヘッダー直下
- **スタイル指針**: `text-gray-300`（テキスト色）/ `hover:text-gray-800`（リンクホバー）/ `bg-white`
- **区切り文字**: `/` （テキスト `text-gray-200`）
- **フォント**: `text-[10px] tracking-[0.15em]`（ミニマル志向に合わせ極小）

### 全テンプレート共通
- 現在のテンプレートはすべてシングルページ構成（`page.tsx` 1ファイルにセクションが並ぶ）
- パンくずリストが有効になるのは、サブページ（施工実績詳細、ニュース記事等）を追加する middle/premium プラン以降
- lite プランのシングルページ構成では非表示

## コンポーネント仕様

### ファイル配置
```
src/components/portfolio-templates/{template-id}/Breadcrumbs.tsx
  ※ 複数テンプレートで使い回す場合:
src/components/portfolio-templates/common/Breadcrumbs.tsx
```

### Props / データ構造
```typescript
interface BreadcrumbItem {
  label: string;           // "施工実績"
  href?: string;           // "/works"（最終項目は undefined）
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ">" | "/";   // デフォルト: ">"
  baseUrl?: string;        // サイトのベースURL（Schema.org 用）
  className?: string;      // 追加スタイル
}
```

### Schema.org 構造化データ
```typescript
interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;         // URL（最終項目は省略）
  }[];
}
```

## リファレンスコード

### Breadcrumbs コンポーネント実装例
```tsx
// src/components/portfolio-templates/common/Breadcrumbs.tsx
"use client";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ">" | "/";
  baseUrl?: string;
}

export function Breadcrumbs({ items, separator = ">", baseUrl = "" }: BreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="パンくずリスト" className="py-3 px-5">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-gray-300 text-xs">{separator}</span>
              )}
              {item.href ? (
                <a href={item.href}
                  className="text-gray-400 hover:text-gray-800 transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-gray-600 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
```

### warm-craft テンプレートでの使用例
```tsx
// src/app/portfolio-templates/warm-craft/works/[id]/page.tsx
<Breadcrumbs
  items={[
    { label: "ホーム", href: "/" },
    { label: "施工実績", href: "/#works" },
    { label: project.title },
  ]}
  separator=">"
  baseUrl="https://example.com"
/>
```

### Schema.org 出力例
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "施工実績", "item": "https://example.com/#works" },
    { "@type": "ListItem", "position": 3, "name": "世田谷の家" }
  ]
}
```

## 3層チェック

> この機能の核: **「今どこにいるか」がわかる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | セマンティック構造 | `<nav aria-label="パンくずリスト">` + `<ol>` + `<li>`で構成 | `<div>`+`<span>`で代用。aria-labelなし |
| F-2 | 最終項目 | 最終項目（現在のページ）がリンクなしのテキスト表示 | 最終項目がリンクになっている。現在ページがわからない |
| F-3 | 中間項目リンク | 中間項目がクリックで正しいページに遷移する | リンク切れ。遷移先が不正 |
| F-4 | Schema.org出力 | `<script type="application/ld+json">`にBreadcrumbListスキーマが出力される | JSON-LDなし。スキーマタイプが不正。構文エラー |
| F-5 | position連番 | `position`が1から正しい連番になっている | positionが0始まり。連番が飛ぶ |
| F-6 | トップページ非表示 | トップページ単独表示時にパンくずが非表示 | トップページで「ホーム」だけのパンくずが表示される |
| F-7 | モバイル省略 | モバイルで中間項目が省略（`...`）されている | 全階層が表示されて画面を圧迫する |
| F-8 | レスポンシブ | テンプレートのフォントサイズ・余白と整合した表示 | フォントが大きすぎる。余白がテンプレートと不一致 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、現在位置を把握できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 現在位置の即座把握 | パンくずを見て**1秒以内に現在位置**がわかる | 最終項目が太字またはアクティブスタイルで明確に区別。階層が3〜4段以内 | 10点 |
| U-2 | トップへの戻りやすさ | 「ホーム」をクリックして**即座にトップページ**に戻れる | 先頭項目が「ホーム」で常にリンク有効。アイコン（Home）の併用も可 | 8点 |
| U-3 | モバイルでの見切れ防止 | スマホで**パンくずが画面を圧迫しない** | 中間項目省略（`...`）+横スクロール or truncateで1行に収まる | 8点 |
| U-4 | 区切り文字の視認性 | **階層構造が視覚的に明確** | 区切り文字（`>`または`/`）がテンプレートのトーンに合致。コントラスト確保 | 7点 |
| U-5 | ホバーエフェクト | リンク項目にホバー時の**視覚的フィードバック**がある | ホバー色がテンプレートのカラーパレットに準拠。cursor: pointer | 7点 |

### Layer 3: 価値チェック（サイト構造がわかるか）— 30点

この機能の核「今どこにいるか、がわかる」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「サイトの構造がわかる」安心感 | パンくずから**サイト全体の階層構造**が把握できる | 「ホーム > 施工実績 > 新築 > ○○邸」で4層構造が明確 | 「ホーム > ○○邸」で2層のみ。中間カテゴリが省略 | パンくずなし。現在位置が全く不明 |
| V-2 | 迷子にならない信頼感 | どの下層ページにいても**「戻れる」安心感**がある | 全下層ページにパンくず配置。ホーム+カテゴリ+現在ページの3段階以上 | 一部のページにのみパンくず配置 | パンくずがないページがあり、迷子になる |
| V-3 | Google検索でのCTR向上 | Schema.orgが**正しくリッチスニペット対象**になる | Google Rich Results Testでエラーなし。position/name/item全件正確 | JSON-LDは出力されるがテスト未確認 | JSON-LDなし。またはスキーマエラー |
| V-4 | 階層構造が業種に適切か | パンくずの階層が**業種のコンテンツ構造**と合致 | 建築:ホーム>施工実績>新築>物件名。EC:ホーム>商品>カテゴリ>商品名 | 階層はあるが業種の慣習と異なる | 階層が深すぎ（6段以上）または浅すぎ（1段） |
| V-5 | テンプレートとの統一感 | パンくずが**テンプレートのデザイントーンに溶け込んでいる** | clean-arch:`text-[10px] tracking-[0.15em]`でミニマルトーンに完全一致 | テンプレートのカラーは使っているがフォントサイズが不統一 | デフォルトスタイルのまま。テンプレートから浮いている |

## スコアリング

### 合計100点の内訳

| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 8項目全PASSで30点。1つでもFAILなら0点（作り直し） |
| Layer 2: UX | 40点 | 5項目、各項目の配点通り。部分点あり |
| Layer 3: 価値 | 30点 | 5項目、各6点。部分点あり |

### 判定ルール

| スコア | 判定 | アクション |
|---|---|---|
| 90〜100 | **PASS** | そのまま次の機能へ。核が実現されている |
| 80〜89 | **CONDITIONAL** | Layer 2 or 3 の減点箇所を特定し修正。修正後に再チェック |
| 70〜79 | **FAIL** | Layer 1 は通るがUXか価値が不足。原因を記録し、該当層を作り直し |
| 0〜69 | **CRITICAL FAIL** | Layer 1 がFAIL。機能として動いていない。全体を作り直し |

### 採点の具体例

**90点の実装:**
- セマンティック構造・JSON-LD・モバイル省略・トップページ非表示全て動作（L1: 30/30）
- 1秒で現在位置把握。ホームに即戻れる。モバイルで1行。区切り文字がテンプレートトーン（L2: 36/40）
- 4層構造で全体像把握可能。Rich Results Testエラーなし。clean-archのミニマルトーンに完全一致（L3: 24/30）

**80点の実装:**
- 基本機能は動作。モバイル省略がやや不完全（L1: 30/30）
- 現在位置は把握可能。ホバーエフェクトがやや弱い（L2: 28/40）
- 2層パンくず（ホーム>現在ページ）で中間カテゴリなし。JSON-LDは出力されるがテスト未確認（L3: 22/30）

**70点の実装:**
- パンくずは表示されるがJSON-LDにpositionエラー（L1: 30/30 ギリギリ）
- モバイルで全階層表示。区切り文字がテンプレートと不一致（L2: 22/40）
- 一部ページにしかパンくずがない。テンプレートから浮いたデフォルトスタイル（L3: 18/30）

### この機能固有の重要判定ポイント

1. **Schema.org精度**: JSON-LD内のposition連番・name・item URLが正確であること。不正確な構造化データはGoogleペナルティの可能性。V-3で厳しく評価
2. **liteプラン非表示**: liteプランのシングルページ構成ではパンくず非表示であること。シングルページで「ホーム」だけのパンくずは無意味
3. **clean-archのミニマル統一**: clean-archは`text-[10px] tracking-[0.15em]`の極小フォント。パンくずもこのトーンに合わせないとデザインが崩れる。V-5で評価
4. **階層の深さ制限**: 4段以下が理想。6段以上はモバイルで表示しきれず、ユーザーも混乱する。業種のコンテンツ構造に合った深さをV-4で評価
