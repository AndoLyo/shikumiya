# ニュース/お知らせ
> ID: news-section | カテゴリ: section | プラン: middle

## 概要

企業の最新情報（ニュース・プレスリリース・竣工報告・受賞歴・採用情報等）をタブ切り替え式リストで表示するセクション。建築業界の調査で10サイト中10サイトが実装しており最も普及率が高い。サイトが「生きている」印象を与え、SEOの更新頻度シグナルにもなる。

## この機能の核

**日付を見て「この会社はちゃんと動いてる」と安心する。**

訪問者がニュースセクションで最初に見るのは「日付」。最新の日付が半年以上前なら「この会社大丈夫か？」と不安になる。逆に、先週・先月の日付があれば「ちゃんと活動してる会社だ」と信用が上がる。内容の立派さより、更新頻度と新鮮さが信頼を生む。

## 必須要件

- 日付 + カテゴリタグ + タイトルのリスト形式
- タブ切り替え: 最低「すべて」+業種に合った2〜3カテゴリ
- 最新5件表示 + 「一覧を見る →」リンク
- カテゴリタグの色分け（Tailwindのbg-{color}-100 + text-{color}-700 パターン）
- 日付フォーマット `YYYY.MM.DD` 統一
- 公開14日以内の記事に「NEW」マーク
- AnimatePresence でタブ切り替え時のフェード

## 業種別バリエーション

ニュースのカテゴリと記事タイトルは業種で全く異なる。以下は各業種のデータ例:

### 建築（工務店・建設会社）
```typescript
type NewsCategory = "お知らせ" | "プレスリリース" | "竣工" | "受賞" | "採用";

const NEWS_ITEMS: NewsItem[] = [
  { id: 1, date: "2025-04-08", category: "受賞", title: "千代田区庁舎改修プロジェクトが建築技術賞を受賞しました" },
  { id: 2, date: "2025-03-25", category: "竣工", title: "渋谷メディカルモールが竣工しました" },
  { id: 3, date: "2025-03-15", category: "お知らせ", title: "GW期間の営業日のご案内" },
];

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  "お知らせ": "bg-blue-100 text-blue-700",
  "プレスリリース": "bg-violet-100 text-violet-700",
  "竣工": "bg-emerald-100 text-emerald-700",
  "受賞": "bg-amber-100 text-amber-700",
  "採用": "bg-pink-100 text-pink-700",
};
```

### 小売（アパレル・雑貨）
```typescript
type NewsCategory = "新着" | "セール" | "入荷" | "メディア" | "店舗";

const NEWS_ITEMS: NewsItem[] = [
  { id: 1, date: "2025-04-08", category: "新着", title: "2025 Summer Collection 公開しました" },
  { id: 2, date: "2025-03-25", category: "セール", title: "春のクリアランスセール 最大50%OFF" },
  { id: 3, date: "2025-03-15", category: "店舗", title: "渋谷店リニューアルオープンのお知らせ" },
];
```

### 飲食（レストラン・カフェ）
```typescript
type NewsCategory = "お知らせ" | "メニュー" | "イベント" | "メディア" | "臨時休業";

const NEWS_ITEMS: NewsItem[] = [
  { id: 1, date: "2025-04-08", category: "メニュー", title: "春の季節限定メニューが始まりました" },
  { id: 2, date: "2025-03-25", category: "イベント", title: "4/20 ワインペアリングディナー開催" },
  { id: 3, date: "2025-03-15", category: "メディア", title: "「食べログ百名店 2025」に選出されました" },
];
```

### 美容（美容室・エステ・ネイル）
```typescript
type NewsCategory = "お知らせ" | "キャンペーン" | "スタッフ" | "メディア" | "新メニュー";

const NEWS_ITEMS: NewsItem[] = [
  { id: 1, date: "2025-04-08", category: "キャンペーン", title: "新規ご来店限定 カット+カラー 30%OFFキャンペーン" },
  { id: 2, date: "2025-03-25", category: "スタッフ", title: "新スタイリスト佐藤が入社しました" },
  { id: 3, date: "2025-03-15", category: "新メニュー", title: "髪質改善トリートメント「Aujua」導入のお知らせ" },
];
```

### 医療（クリニック・歯科）
```typescript
type NewsCategory = "お知らせ" | "診療" | "休診" | "設備" | "メディア";

const NEWS_ITEMS: NewsItem[] = [
  { id: 1, date: "2025-04-08", category: "設備", title: "最新CT装置を導入しました" },
  { id: 2, date: "2025-03-25", category: "診療", title: "土曜午後の診療を開始します（4月より）" },
  { id: 3, date: "2025-03-15", category: "休診", title: "GW期間中の休診日のお知らせ" },
];
```

### 教育（塾・スクール・習い事）
```typescript
type NewsCategory = "お知らせ" | "合格実績" | "イベント" | "開講" | "メディア";

const NEWS_ITEMS: NewsItem[] = [
  { id: 1, date: "2025-04-08", category: "合格実績", title: "2025年度 難関大学合格実績を更新しました" },
  { id: 2, date: "2025-03-25", category: "開講", title: "プログラミング教室 4月開講クラス受付開始" },
  { id: 3, date: "2025-03-15", category: "イベント", title: "春の無料体験授業 3/25〜4/5 開催" },
];
```

**業種共通の注意点:**
- カテゴリは3〜5種。多すぎるとタブが溢れる
- カテゴリ名は業種の「あるある」を反映する（建築=竣工、飲食=メニュー、医療=休診）
- デモデータの日付は必ず「最近」に設定する。古い日付だけだとサイトの信用が下がる

## 既存テンプレートとの接続

### 既存実装の状況

3テンプレート全てに**未実装**。新規追加が必要。

### 挿入位置

```
// warm-craft: HeroSection の直後、WorksSection の前
<main>
  <HeroSection />
  <NewsSection />     ← ここに追加
  <WorksSection />
  ...
</main>

// trust-navy: HeroSection の直後、ServicesSection の前
<main>
  <HeroSection />
  <NewsSection />     ← ここに追加
  <ServicesSection />
  ...
</main>

// clean-arch: HeroSection の直後、WorksSection の前
<main>
  <HeroSection />
  <NewsSection />     ← ここに追加
  <WorksSection />
  ...
</main>
```

### navItemsへの追加

```typescript
// warm-craft / trust-navy: navItems配列に追加
{ label: "お知らせ", href: "#news" },  // 先頭に追加

// clean-arch: Header内のインライン配列に追加
["NEWS", "#news"],  // 先頭に追加
```

### カラーの合わせ方

| テンプレート | セクション背景 | アクティブタブ | テキスト |
|---|---|---|---|
| warm-craft | `bg-white`（WorksのFAF7F2と交互） | `border-b-2 border-[#7BA23F]` | `text-[#3D3226]` |
| trust-navy | `bg-white`（ServicesのF0F4F8と交互） | `border-b-2 border-[#C8A96E]` | `text-[#1B3A5C]` |
| clean-arch | `bg-white`（WorksのEDEBE5と交互） | `border-b-2 border-black` | `text-black` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function NewsSection() { ... }  ← モノリシック内の新規関数
```

### データ定数（page.tsx冒頭のDEMO DATAエリアに追加）
```typescript
type NewsCategory = "お知らせ" | "プレスリリース" | "竣工" | "受賞" | "採用";

interface NewsItem {
  id: number;
  date: string;         // "2025-04-08" 形式（表示時にYYYY.MM.DDに変換）
  category: NewsCategory;
  title: string;
  href?: string;        // 詳細ページURL（任意）
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1, date: "2025-04-08", category: "受賞",
    title: "千代田区庁舎改修プロジェクトが建築技術賞を受賞しました",
  },
  {
    id: 2, date: "2025-03-25", category: "お知らせ",
    title: "2025年度安全大会を開催いたしました",
  },
  {
    id: 3, date: "2025-03-15", category: "竣工",
    title: "渋谷メディカルモールが竣工しました",
  },
  {
    id: 4, date: "2025-02-28", category: "プレスリリース",
    title: "2024年度第3四半期決算のご報告",
  },
  {
    id: 5, date: "2025-02-10", category: "採用",
    title: "2026年度新卒採用情報を公開しました",
  },
];

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  "お知らせ": "bg-blue-100 text-blue-700",
  "プレスリリース": "bg-violet-100 text-violet-700",
  "竣工": "bg-emerald-100 text-emerald-700",
  "受賞": "bg-amber-100 text-amber-700",
  "採用": "bg-pink-100 text-pink-700",
};
```

### 状態管理
```typescript
const [activeTab, setActiveTab] = useState<NewsCategory | null>(null);

const filtered = useMemo(() => {
  const items = activeTab === null
    ? NEWS_ITEMS
    : NEWS_ITEMS.filter(item => item.category === activeTab);
  return items.slice(0, 5);
}, [activeTab]);

// NEW判定（14日以内）
const isNew = (dateStr: string) => {
  return Date.now() - new Date(dateStr).getTime() < 14 * 86400000;
};

// 日付フォーマット
const formatDate = (dateStr: string) => dateStr.replace(/-/g, ".");
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| モバイル（〜639px） | タブ: `overflow-x-auto` 横スクロール / 各行: 日付+カテゴリ上段、タイトル下段（2行構成） / タイトル1行省略 `truncate` |
| タブレット（640〜1023px） | タブ: 横並び折り返しなし / 各行: 日付(w-28) + カテゴリ(w-28) + タイトル(flex-1) の1行構成 |
| デスクトップ（1024px〜） | 同上 + タイトルホバーでアンダーライン + 行ホバーで背景色変化 |

### レイアウト構成
```
┌──────────────────────────────────────────┐
│  NEWS / お知らせ                           │
│                                           │
│  [すべて] [お知らせ] [プレスリリース] [竣工]  │
│  ────────────────────────────────          │
│  2025.04.08  受賞   千代田区庁舎が建築…  NEW │
│  2025.03.25  お知らせ 2025年度安全大会を…      │
│  2025.03.15  竣工   渋谷メディカルモール…      │
│  2025.02.28  PR    2024年度第3四半期…         │
│  2025.02.10  採用   2026年度新卒採用情報…     │
│                                           │
│                      [ 一覧を見る → ]       │
└──────────────────────────────────────────┘
```

## リファレンスコード

ニュースセクションは既存テンプレートに未実装のため、WorksSectionのパターンを基準にする。以下のパターンを踏襲すること:

```tsx
// warm-craft WorksSection のヘッダーパターン（これに合わせる）
<motion.div className="text-center mb-12"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">NEWS</p>
  <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">お知らせ</h2>
  <p className="text-[#8B7D6B] text-sm">最新の情報をお届けします。</p>
</motion.div>

// タブバー — WorksSectionのfilterボタンパターンを踏襲
<div className="flex justify-center gap-2 mb-10">
  {tabs.map(tab => (
    <button
      key={tab.label}
      onClick={() => setActiveTab(tab.value)}
      className={`px-5 py-2 rounded-full text-sm transition-all ${
        activeTab === tab.value
          ? "bg-[#7BA23F] text-white shadow-sm"       // ← アクセントカラー
          : "bg-white text-[#8B7D6B] border border-[#E8DFD3] hover:border-[#7BA23F]/30"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

**注目すべきパターン:**
- セクションヘッダーは `英語ラベル(tracking-[0.3em]) → 日本語H2 → サブコピー` の3段構成
- フィルターボタンは `rounded-full` + アクセントカラー背景 + 白テキスト
- 非アクティブは `bg-white` + `border border-[#E8DFD3]`

## 3層チェック

> この機能の核: **日付を見て「この会社はちゃんと動いてる」と安心する**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | セクションに `id="news"` が設定 | ナビゲーションから遷移できる | idなしでナビリンクが機能しない |
| F-2 | navItemsに「お知らせ」リンク追加 | 各テンプレートのnavに表示される | リンクが未追加でナビから辿れない |
| F-3 | タブ切り替えで正しいカテゴリのみ表示 | 選択カテゴリの記事だけがフィルタリングされる | 全カテゴリが常に混在表示 |
| F-4 | 「すべて」タブで全カテゴリ混在表示 | null/allフィルターで全件が表示される | 「すべて」タブが存在しない |
| F-5 | 日付が `YYYY.MM.DD` 形式で統一 | replace(/-/g, ".") で変換済み | ISO形式のまま表示/形式が不統一 |
| F-6 | カテゴリタグの色分け | bg-{color}-100 + text-{color}-700 パターン | 全タグが同じ色/色定義なし |
| F-7 | 14日以内の記事に「NEW」マーク | isNew() ロジックが正しく動作 | 全件にNEW/古い記事にもNEW |
| F-8 | 最新5件表示+「一覧を見る →」リンク | slice(0, 5) + リンクボタン配置 | 全件表示/一覧導線なし |
| F-9 | AnimatePresence でタブ切替フェード | タブ変更時にフェードトランジション | アニメーションなし/ちらつき |
| F-10 | モバイルでタブ横スクロール | overflow-x-auto で全カテゴリ到達可能 | タブが折り返して2行になる |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 最新日付の視認性 | ニュースセクションに到達して即座に最新日付が目に入る | 1秒以内に認識 | 10点 |
| U-2 | タブ操作のしやすさ | モバイルで横スクロール、PCでクリック | モバイルでスワイプ可能+スクロールバー非表示 | 8点 |
| U-3 | 空状態メッセージ | 0件カテゴリで適切なメッセージ表示 | 「該当するお知らせはありません」等 | 6点 |
| U-4 | タイトルの可読性 | 長いタイトルが省略表示される | truncate適用+ホバーで全文表示 | 6点 |
| U-5 | 一覧ページへの導線 | 「一覧を見る」が発見しやすい | セクション下部に明確なリンク | 5点 |
| U-6 | 既存セクションとのスタイル統一 | ヘッダー・ボタンが他セクションと同じパターン | 英語ラベル+H2+サブコピーの3段構成 | 5点 |

### Layer 3: 価値チェック（安心できるか）— 30点

この機能の核「日付を見て『この会社はちゃんと動いてる』と安心する」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 最新記事が1ヶ月以内 | デモデータの最新日付が現実的に新しい | 先週の日付+業界ニュース | 1ヶ月前の日付（ギリギリ許容） | 半年以上前で「放置サイト」感 |
| V-2 | カテゴリが業種に合っている | 業種固有のカテゴリ名を使用 | 建築→「竣工」「受賞」/ 飲食→「メニュー」 | 「お知らせ」「その他」のみ | 業種と無関係なカテゴリ |
| V-3 | 「活動してる」安心感 | 日付+カテゴリ+タイトルの組み合わせで活発さが伝わる | 複数カテゴリで最近の活動が多角的に見える | 1カテゴリのみだが日付は新しい | 1年前の記事が1件だけ |
| V-4 | 記事タイトルが具体的 | タイトルだけで内容の概要がわかる | 「千代田区庁舎改修が建築技術賞を受賞」 | 「受賞のお知らせ」 | 「お知らせ」（何の？） |
| V-5 | NEWマークが適切に機能 | 新着記事だけが目立ち、古い記事と区別できる | 最新2件にのみNEW+目立つバッジ | NEWあるが目立たない | 全件NEWで意味なし |
| V-6 | タップ後の期待に応える | タイトルクリックで詳細に遷移 or タイトルで完結 | 詳細ページに遷移して全文が読める | タイトルで内容が十分伝わる | タップしても何も起きない |

## スコアリング

### 合計100点の内訳
| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 10項目全PASSで30点。1つでもFAILなら0点 |
| Layer 2: UX | 40点 | 6項目、各項目の配点通り |
| Layer 3: 価値 | 30点 | 6項目、各5点 |

### 判定ルール
| スコア | 判定 | アクション |
|---|---|---|
| 90〜100 | **PASS** | そのまま次の機能へ。核が実現されている |
| 80〜89 | **CONDITIONAL** | Layer 2 or 3 の減点箇所を特定し修正 |
| 70〜79 | **FAIL** | UXか価値が不足。原因を記録し作り直し |
| 0〜69 | **CRITICAL FAIL** | 機能として動いていない。全体を作り直し |

### 採点の具体例
**90点の実装:** 業種に合ったカテゴリ（竣工・受賞等）でタブ切替が動作し、最新日付が1週間以内。NEWマークが新着のみに付き、AnimatePresenceでスムーズに切り替わる。空状態も適切に処理。
**80点の実装:** タブ切替・日付フォーマット・NEWマーク全て動作するが、カテゴリが「お知らせ」「その他」のみで業種感がない。スタイルは既存テンプレートと統一されている。
**70点の実装:** リスト表示は動くが、タブ切替がなく全件表示。日付フォーマットが不統一。空状態で空白になり壊れたように見える。

### この機能固有の重要判定ポイント
- **鮮度**: デモデータでも現実的な日付を設定すること。半年以上前の日付だけだとサイトの信頼性が下がる
- **業界感**: カテゴリが業種に合っていること。一般的な「お知らせ」だけでは減点
- **既存セクションとの統一**: セクションヘッダーのパターン、フィルターボタンのスタイルが既存と一致しているか
