# 施工実績/WORKS
> ID: works-gallery | カテゴリ: section | プラン: lite

## 概要

施工実績をカード形式のグリッドで一覧表示し、カテゴリフィルターで絞り込み可能にするセクション。建築会社にとって最も重要なコンテンツで、調査では10サイト中9サイトが実装。見込み客は「この会社がどんな建物を作ったか」を最初に確認するため、施工写真の質とフィルタリング体験が受注に直結する。

## この機能の核

**「うちと似た案件やってる」と思える事例を見つける。**

訪問者は「自分と同じ状況の人がここに頼んで、どうなったか」を知りたい。工務店なら「うちと同じくらいの広さのリフォームをやってるか」、飲食なら「こういうメニューがあるのか」、美容なら「自分がなりたい髪型を作れるか」。フィルターで絞り込み、写真で雰囲気を確認し、詳細で規模感を把握できること。事例の「数」と「自分ごと感」が決め手。

## 必須要件

- カードグリッド（大きめサムネイル + プロジェクト名 + カテゴリタグ）
- カテゴリフィルター（`rounded-full` ボタン、アクセントカラー）
- カード数6件を初期表示
- カードクリックでライトボックス（拡大表示 + プロジェクト詳細 + 前後ナビ）
- フィルター切り替え時の Framer Motion アニメーション
- 画像は next/image で最適化
- ライトボックスでEscape / 背景クリック / ×ボタンで閉じる
- ライトボックスで←→キーボードナビゲーション

## 業種別バリエーション

このセクションは業種によって「実績」「メニュー」「ギャラリー」「施術例」と呼び方も内容も全く異なる。

### 建築（工務店・建設会社）
```typescript
// セクション名: 施工実績 / WORKS
// フィルター: 「すべて」「新築」「リフォーム」「店舗」
const PROJECTS = [
  {
    id: 1, title: "世田谷の家", category: "新築", year: "2025",
    desc: "自然光をたっぷり取り入れた開放的なLDK",
    specs: "木造2階建 / 延床面積 120㎡ / 4LDK",
  },
];
// カード情報: 写真 + 物件名 + カテゴリ + 構造・面積
// ライトボックス: ギャラリー写真 + 所在地 + 構造 + 面積 + 工期
```

### 小売（アパレル・雑貨）
```typescript
// セクション名: 商品 / PRODUCTS（またはCOLLECTION）
// フィルター: 「すべて」「トップス」「ボトムス」「アクセサリー」
const PRODUCTS = [
  {
    id: 1, title: "リネンオーバーシャツ", category: "トップス", year: "2025",
    desc: "フレンチリネン100%。洗うほどに柔らかく",
    specs: "¥12,800 / S・M・L / 3色展開",
  },
];
// カード情報: 商品写真 + 名前 + 価格
// ライトボックス: 複数アングル写真 + サイズ + 素材 + 価格
```

### 飲食（レストラン・カフェ）
```typescript
// セクション名: メニュー / MENU
// フィルター: 「すべて」「ランチ」「ディナー」「ドリンク」「デザート」
const MENU_ITEMS = [
  {
    id: 1, title: "黒毛和牛のタリアータ", category: "ディナー", year: "2025",
    desc: "A5ランク黒毛和牛を低温調理で仕上げた一皿",
    specs: "¥3,800 / アレルギー: 小麦・乳",
  },
];
// カード情報: 料理写真 + 名前 + 価格
// ライトボックス: 写真 + 説明 + 価格 + アレルギー表示
```

### 美容（美容室・エステ・ネイル）
```typescript
// セクション名: スタイルギャラリー / STYLE
// フィルター: 「すべて」「カット」「カラー」「パーマ」「ヘアアレンジ」
const STYLES = [
  {
    id: 1, title: "透明感ベージュのレイヤーボブ", category: "カラー", year: "2025",
    desc: "ブリーチ1回+カラーで叶える柔らかベージュ",
    specs: "施術時間 3h / スタイリスト: 佐藤",
  },
];
// カード情報: ビフォーアフター写真 + スタイル名
// ライトボックス: 詳細写真 + 使用薬剤 + 施術時間 + 担当者
```

### 医療（クリニック・歯科）
```typescript
// セクション名: 症例紹介 / CASES
// フィルター: 「すべて」「インプラント」「矯正」「ホワイトニング」「審美」
const CASES = [
  {
    id: 1, title: "前歯6本のセラミック治療", category: "審美", year: "2025",
    desc: "変色した前歯をオールセラミックで自然な白さに",
    specs: "治療期間 2ヶ月 / 費用目安 ¥480,000〜",
  },
];
// カード情報: ビフォーアフター写真 + 症例名 + 治療内容
// ライトボックス: 経過写真 + 治療内容 + 期間 + 費用目安 + リスク説明
```

### 教育（塾・スクール・習い事）
```typescript
// セクション名: 合格実績 / RESULTS（または生徒作品 / GALLERY）
// フィルター: 「すべて」「国公立」「早慶」「MARCH」「医学部」
const RESULTS = [
  {
    id: 1, title: "東京大学 理科一類 合格", category: "国公立", year: "2025",
    desc: "E判定から1年で逆転合格。個別カリキュラムの力",
    specs: "高3入塾 / 週4回通塾 / 偏差値42→68",
  },
];
// カード情報: 学校ロゴ or 写真 + 合格校 + エピソード
// ライトボックス: 詳細エピソード + 入塾時の状況 + 使用教材
```

**業種共通の注意点:**
- セクション名（H2）は業種に合わせる。全業種「WORKS」ではない
- フィルターカテゴリは業種固有の分類にする
- カードの詳細情報（specs）は業種ユーザーが気にする項目を選ぶ
- 医療の場合はリスク説明・免責事項の表示が必須

## 既存テンプレートとの接続

### 既存実装の状況

3テンプレート全てにWorksSection（またはProjectsSection）が**既に存在**。編集・拡張が主なユースケース。

| テンプレート | 関数名 | section id | データ定数 | フィルターカテゴリ |
|---|---|---|---|---|
| warm-craft | `WorksSection()` | `#works` | `PROJECTS` | `["すべて", "新築", "リフォーム"]` |
| trust-navy | `ProjectsSection()` | `#works` | `PROJECTS` | `["ALL", "建築", "土木", "リニューアル"]` |
| clean-arch | `WorksSection()` | `#works` | `WORKS` | なし（全件表示） |

### 既存データ構造（テンプレート別）

**warm-craft の PROJECTS:**
```typescript
const PROJECTS = [
  {
    id: 1,
    title: "世田谷の家",
    category: "新築",
    year: "2025",
    desc: "自然光をたっぷり取り入れた開放的なLDK...",
    specs: "木造2階建 / 延床面積 120㎡ / 4LDK",
    colors: { from: "#C4B5A0", to: "#A69279", accent: "#8B7355" },
  },
  // ...6件
];
```

**trust-navy の PROJECTS:**
```typescript
const PROJECTS = [
  {
    id: 1,
    title: "千代田区庁舎改修工事",
    category: "建築",
    year: "2025",
    scale: "RC造 地上5階 / 延床3,200㎡",
    grad: "from-[#1B3A5C] to-[#2A5080]",  // グラデーション文字列
  },
  // ...6件
];
```

**clean-arch の WORKS:**
```typescript
const WORKS = [
  {
    id: 1,
    title: "Setagaya Residence",  // 英語タイトル
    titleJa: "世田谷の住宅",       // 日本語タイトル
    year: "2025",
    type: "Residential",
    desc: "A minimalist approach...",
    size: "landscape" as const,    // "landscape" | "portrait" | "square"
  },
  // ...8件
];
```

### 編集時の注意

- **データ定数名が異なる**: warm-craft/trust-navy は `PROJECTS`、clean-arch は `WORKS`
- **プロパティが微妙に違う**: warm-craft に `specs`、trust-navy に `scale` + `grad`、clean-arch に `titleJa` + `size`
- **新規プロパティ追加時**: 既存プロパティを壊さず、optionalプロパティとして追加する
- **カテゴリ名が業態で異なる**: 工務店は「新築/リフォーム」、建設会社は「建築/土木」、設計事務所は英語

### navItemsへの影響

全テンプレートに既存のリンクあり。変更不要。

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function WorksSection() { ... }  ← 既存関数を編集
```

### 拡張時のデータ構造（既存に追加するフィールド）
```typescript
// 既存プロパティはそのまま。拡張時にoptionalで追加
interface ProjectExtended {
  id: number;
  title: string;
  category: string;
  year: string;
  desc: string;
  specs?: string;          // warm-craft
  scale?: string;          // trust-navy
  grad?: string;           // trust-navy
  colors?: { from: string; to: string; accent: string };  // warm-craft
  titleJa?: string;        // clean-arch
  size?: "landscape" | "portrait" | "square";  // clean-arch
  // ↓ 拡張時に追加するフィールド
  location?: string;       // 所在地
  client?: string;         // 発注者
  images?: string[];       // サブ画像（ライトボックスギャラリー用）
}
```

### 状態管理（既存パターン — warm-craftから）
```typescript
const [lightbox, setLightbox] = useState<number | null>(null);
const [filter, setFilter] = useState("すべて");
const categories = ["すべて", "新築", "リフォーム"];
const filtered = filter === "すべて"
  ? PROJECTS
  : PROJECTS.filter((p) => p.category === filter);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| モバイル（〜639px） | `grid-cols-1` / フィルター: 横並び `gap-2` / ライトボックス: フルスクリーン |
| タブレット（640〜1023px） | `sm:grid-cols-2` / フィルター: タブバー / ライトボックス: 90vw |
| デスクトップ（1024px〜） | `lg:grid-cols-3` / カードホバー（`hover:shadow-xl hover:-translate-y-1`）/ ライトボックス: 80vw + 矢印 |

## リファレンスコード（warm-craft の実装）

```tsx
// セクションヘッダー — 英語ラベル + H2 + サブコピー
<motion.div className="text-center mb-12"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">WORKS</p>
  <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">施工実績</h2>
  <p className="text-[#8B7D6B] text-sm">心を込めてつくりあげた、家族の住まい。</p>
</motion.div>

// フィルターボタン — rounded-full, アクセントカラー
<div className="flex justify-center gap-2 mb-10">
  {categories.map((c) => (
    <button key={c} onClick={() => setFilter(c)}
      className={`px-5 py-2 rounded-full text-sm transition-all ${
        filter === c
          ? "bg-[#7BA23F] text-white shadow-sm"
          : "bg-white text-[#8B7D6B] border border-[#E8DFD3] hover:border-[#7BA23F]/30"
      }`}
    >{c}</button>
  ))}
</div>

// カードグリッド — stagger animation
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filtered.map((p, i) => (
    <motion.div key={p.id}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E8DFD3] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      onClick={() => setLightbox(p.id)}
    >
      {/* SVGプレースホルダ + タイトル + カテゴリ + 年 */}
    </motion.div>
  ))}
</div>

// ライトボックス — AnimatePresence + 背景クリック閉じ + キーボード対応
<AnimatePresence>
  {lightbox !== null && (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80" onClick={() => setLightbox(null)} />
      {/* コンテンツ */}
    </motion.div>
  )}
</AnimatePresence>
```

**注目すべき品質ポイント:**
- カードの `rounded-2xl` + `border border-[#E8DFD3]` — 柔らかい角丸 + 薄いボーダー
- ホバー: `hover:shadow-xl hover:-translate-y-1 transition-all duration-300` — 浮き上がり効果
- stagger: `transition={{ delay: i * 0.08 }}` — カードが順番に出現
- ライトボックスの背景: `bg-black/80` — 80%透過の黒

## 3層チェック

> この機能の核: **「うちと似た案件やってる」と思える事例を見つける**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | セクションに `id="works"` が設定 | ナビゲーションから遷移できる | idなしでナビリンクが機能しない |
| F-2 | フィルターボタンで正しいカテゴリのみ表示 | 選択カテゴリの事例だけがフィルタリングされる | フィルターが効かず全件表示のまま |
| F-3 | フィルターのアクティブ状態がアクセントカラー | テンプレートのブランドカラーで表示 | デフォルトカラーのまま/視覚的に区別不可 |
| F-4 | カードに title, category, year 表示 | 3つの情報が全て視認できる | 情報が欠落/表示されない |
| F-5 | カードクリックでライトボックス開閉 | クリックで詳細がオーバーレイ表示される | クリックしても何も起きない/ページ遷移してしまう |
| F-6 | ライトボックス閉じ操作（×/Escape/背景クリック） | 3つの方法全てで閉じられる | 閉じ方が1つしかない/閉じられない |
| F-7 | ライトボックスで←→キーボードナビゲーション | キーボードで前後の事例に切替可能 | キーボード非対応 |
| F-8 | フィルター切替時のFramer Motionアニメーション | フェードまたはレイアウトアニメーションが動作 | 即座に切り替わりアニメーションなし |
| F-9 | stagger animation（delay: i * 0.08） | カードが順次出現する | 全カードが同時に出現 |
| F-10 | レスポンシブグリッド | モバイル1列/タブレット2列/PC3列 | モバイルで3列のまま縮小 |
| F-11 | ライトボックス表示中のスクロールロック | body のスクロールが無効化される | ライトボックス裏で画面がスクロールする |
| F-12 | カードホバーエフェクト | shadow-xl + -translate-y-1 が動作 | ホバーしても変化なし |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | フィルターで目的の事例を見つける時間 | カテゴリ選択で即座に絞り込み | 10秒以内に目的の事例に到達 | 10点 |
| U-2 | ライトボックスの操作性 | 開閉・前後ナビが直感的 | 操作方法の説明不要で使える | 8点 |
| U-3 | モバイルグリッドの視認性 | 1列で写真が十分な大きさ | カード幅100%+写真が鮮明 | 8点 |
| U-4 | ライトボックス内の情報量 | 写真+詳細スペックが表示される | specs/scale等の判断材料あり | 6点 |
| U-5 | 「もっと見る」導線 | 6件以上ある場合の追加読み込み | ボタンまたはリンクで追加表示 | 4点 |
| U-6 | ×ボタンのタップ領域 | モバイルで押しやすいサイズ | 最低44x44pxのタップ領域 | 4点 |

### Layer 3: 価値チェック（自分ごとか）— 30点

この機能の核「『うちと似た案件やってる』と思える事例を見つける」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 事例に「自分ごと感」がある | 訪問者が自分の状況と重ねられる | 「世田谷の家 / 木造2階建 / 4LDK / 120㎡」 | 「世田谷の家 / 新築」（情報不足だが伝わる） | 「Project A」（何の事例かわからない） |
| V-2 | 規模・スペック情報が判断材料になる | 面積/価格/時間等の具体情報あり | 「延床120㎡ / 木造2階 / 4LDK」 | 「新築住宅」（カテゴリのみ） | スペック情報なし |
| V-3 | 写真品質が信頼を生む | 高品質な写真（またはリアルなプレースホルダ） | 施工写真で雰囲気が伝わる | グラデーションプレースホルダ（悪くない） | グレーの四角/壊れた画像 |
| V-4 | カテゴリが業種に合っている | 業種固有のフィルターカテゴリ | 工務店→「新築/リフォーム」 | 汎用→「カテゴリA/B」 | フィルターなし |
| V-5 | ライトボックスで「もっと知りたい」に応える | 詳細情報が十分に表示される | 複数写真+所在地+構造+面積+工期 | タイトル+写真1枚のみ | カードと同じ情報だけ |
| V-6 | 事例の件数が十分 | 信頼できる実績数がある | 6件以上+カテゴリ横断 | 3件（最低ライン） | 1件しかない |

## スコアリング

### 合計100点の内訳
| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 12項目全PASSで30点。1つでもFAILなら0点 |
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
**90点の実装:** 業種別フィルターで事例を絞り込み、カードに写真+タイトル+スペック。ライトボックスで複数写真+詳細情報。キーボード対応+スクロールロック完備。事例に「自分ごと感」がある。
**80点の実装:** フィルター・ライトボックス全て動作するが、事例の詳細情報が薄い（タイトルと写真のみ）。プレースホルダだが雰囲気は伝わる。
**70点の実装:** カードグリッド表示は動くが、フィルターが効かない。ライトボックスでEscapeが効かない。モバイルで3列のまま縮小。

### この機能固有の重要判定ポイント
- **写真品質**: 施工実績は写真がすべて。SVGプレースホルダでもグラデーションでリアルな印象を出すこと
- **ライトボックスUX**: 開閉のスムーズさ、キーボード対応、スクロールロックが全て揃って初めて合格
- **データ構造の互換性**: 既存のPROJECTS定数のプロパティを壊さずに拡張しているか。リネームしたら即FAIL
- **カテゴリ設計**: 業種に合ったカテゴリにすること。工務店は「新築/リフォーム」、飲食は「ランチ/ディナー」
