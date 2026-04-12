# 画像ギャラリー
> ID: 30 | カテゴリ: function | プラン: lite

## 概要
画像をグリッド/メイソンリーレイアウトで展示し、ライトボックスでフルスクリーン閲覧できる機能。カテゴリフィルタータブによる絞り込み、遅延読み込み（lazy loading）によるパフォーマンス最適化、タッチスワイプ対応のライトボックスナビゲーションを備える。業種を問わず、施工写真・商品画像・料理写真・ヘアスタイル・施設写真等、ビジュアル訴求が必要な全サイトの基盤機能。

## この機能の核
写真を大きく見て「この雰囲気が好き」と感じる

## 必須要件
- グリッドレイアウト: PC 3列、タブレット 2列、モバイル 1列
- メイソンリーレイアウト（オプション）: 高さの異なる画像を隙間なく配置
- カテゴリフィルター: タブ/ボタンで表示画像を絞り込み（AnimatePresenceで切替アニメーション）
- ライトボックス: クリックで画像をフルスクリーン表示。前後ナビゲーション（矢印ボタン）
- 遅延読み込み: `loading="lazy"` + IntersectionObserver によるパフォーマンス最適化
- 画像カードのホバーエフェクト（scale + overlay表示）
- 画像タイトル・説明テキストのオーバーレイ表示
- フェードインアニメーション（whileInView + スタガード）

## 業種別バリエーション
| 業種 | カテゴリフィルター例 | 画像の特性 |
|---|---|---|
| 建築・建設 | 新築 / リフォーム / 外構 / 内装 | 施工前後、完成写真、工程写真 |
| 飲食 | ランチ / ディナー / ドリンク / 店内 | 料理写真、盛り付け、空間 |
| 美容・サロン | カット / カラー / パーマ / ネイル | ヘアスタイル、ビフォーアフター |
| 医療 | 院内 / 設備 / スタッフ | 施設、最新設備 |
| 小売 | カテゴリA / カテゴリB / 新着 | 商品写真、着用イメージ |
| 写真家・アーティスト | ポートレート / 風景 / 商業 | 作品ポートフォリオ |

## 既存テンプレートとの接続
### warm-craft（lite）
- **セクション**: `WorksSection` 内の施工実績グリッド
- **レイアウト**: `grid sm:grid-cols-2 lg:grid-cols-3 gap-6`
- **カテゴリフィルター**: `["すべて", "新築", "リフォーム"]` ボタン切替
- **カード構造**: SVGイラスト + カテゴリバッジ + タイトル + 年 + 説明
- **ホバー**: `group-hover:scale-105 transition-transform duration-700`
- **配色**: カードbg `bg-white`, バッジ `bg-white/90`, テキスト `text-[#3D3226]`

### trust-navy（lite）
- **セクション**: `ProjectsSection` 内のプロジェクトグリッド
- **カテゴリフィルター**: `["すべて", "公共施設", "商業施設", "集合住宅", ...]`
- **配色**: フィルターactive `bg-[#1B3A5C] text-white`

### clean-arch（lite）
- **セクション**: Works 一覧（`size` プロパティで landscape/portrait/square を区別）
- **レイアウト**: 可変サイズの画像グリッド（メイソンリー的）
- **フィルター**: `["ALL", "住宅", "店舗", "オフィス"]`

### warm-craft-pro（mid/pro共通）
- クリックで詳細モーダル（Before/After + 施工概要 + お客様の声）
- `AnimatePresence` でモーダル開閉
- 前後ナビゲーション（ChevronLeft / ChevronRight）

### 共通実装パターン
```
Page Component
  └── <WorksSection /> or <GallerySection />
      ├── カテゴリフィルターボタン（state: filter）
      ├── グリッド（filtered items を map）
      │   └── motion.div カード（whileInView fade-in + stagger）
      └── AnimatePresence > 詳細モーダル or ライトボックス
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
└── GallerySection / WorksSection コンポーネント

※ 分割する場合:
src/components/portfolio-templates/{template-id}/
├── GallerySection.tsx
├── GalleryGrid.tsx
├── GalleryCard.tsx
├── CategoryFilter.tsx
└── Lightbox.tsx
```

### Props / データ構造
```typescript
interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatio?: "landscape" | "portrait" | "square";
  year?: string;
  tags?: string[];
}

interface GallerySectionProps {
  items: GalleryItem[];
  categories: string[];
  layout: "grid" | "masonry";
  columns: { sm: number; md: number; lg: number }; // default { sm: 1, md: 2, lg: 3 }
  enableLightbox: boolean;
  enableFilter: boolean;
  accentColor: string;
  allLabel: string; // "ALL" | "すべて"
}

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}
```

### 状態管理
```typescript
const [filter, setFilter] = useState("すべて");
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

const filtered = filter === "すべて"
  ? items
  : items.filter((item) => item.category === filter);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | 3列グリッド。ホバーエフェクト有効。フィルターボタン横並び |
| タブレット（768px〜1023px） | 2列グリッド。ホバーエフェクト有効 |
| モバイル（〜767px） | 1列。フィルターボタン横スクロールまたはセレクトボックス |

## リファレンスコード
```tsx
// warm-craft の WorksSection 簡略版
function GallerySection() {
  const [filter, setFilter] = useState("すべて");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const categories = ["すべて", "カテゴリA", "カテゴリB"];
  const filtered = filter === "すべて" ? ITEMS : ITEMS.filter((p) => p.category === filter);

  return (
    <section id="works" className="py-20 sm:py-28">
      {/* Category filter */}
      <div className="flex justify-center gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-5 py-2 rounded-full text-sm transition-all ${
              filter === c ? "bg-[accent] text-white" : "bg-white text-gray-500 border"
            }`}
          >{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            className="group cursor-pointer rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onClick={() => setSelectedIndex(i)}
          >
            <div className="relative h-56 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-xs">{item.category}</div>
            </div>
            <div className="p-5">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

## 3層チェック

> この機能の核: **写真を大きく見て「この雰囲気が好き」と感じる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | グリッド表示 | 画像がPC3列/タブレット2列/モバイル1列のグリッドで正しく並ぶ | 画像が表示されない。レイアウトが崩れて重なる |
| F-2 | ライトボックス | 画像クリックでフルスクリーン表示される | クリックしても何も起きない。新タブで画像だけ開く |
| F-3 | prev/next | ライトボックス内で矢印ボタンによる前後ナビゲーションが動作する | ナビなし。閉じて次のサムネをクリックし直す必要 |
| F-4 | lazy loading | `loading="lazy"` + IntersectionObserverで初期表示外の画像を遅延読み込み | 全画像が一度にロードされてページが重い |
| F-5 | カテゴリフィルター | タブ/ボタンで表示画像が正しく絞り込まれる | フィルターが効かない。全部表示のまま |
| F-6 | フィルターアニメーション | フィルター切替時にAnimatePresenceで切替アニメーションが適用される | アニメーションなし。パッと切り替わる |
| F-7 | ホバーエフェクト | 画像カードにscale + overlayのホバーエフェクトがある | ホバーしても何も変化しない |
| F-8 | フェードイン | whileInView + スタガードでカードがフェードインする | アニメーションなし。全カードが即表示 |
| F-9 | 空状態 | 画像0件の場合に「該当する画像がありません」のメッセージが表示される | 空白のまま。壊れているように見える |
| F-10 | カテゴリバッジ | 各画像上にカテゴリバッジ（ラベル）が適切に表示される | バッジなし。どのカテゴリの画像かわからない |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | ライトボックス表示速度 | 画像クリック→ライトボックス表示まで**0.3秒以内** | AnimatePresenceのenter/exit transitionが0.3秒。体感で即座 | 10点 |
| U-2 | スワイプ操作の滑らかさ | モバイルでスワイプによる前後ナビゲーションが**滑らかに動く** | タッチスワイプで画像がスムーズにスライド。ちらつきなし | 8点 |
| U-3 | 閉じ方の明確さ | ライトボックスの**閉じ方が直感的にわかる** | 外クリック/Xボタン/ESCキーの3通りで閉じられる | 8点 |
| U-4 | フィルターの即応性 | カテゴリ切替で**ちらつきなく滑らかに**画像が切り替わる | AnimatePresenceで0.3秒のフェード切替。レイアウトシフトなし | 7点 |
| U-5 | モバイルのレイアウト | スマホで**1列レイアウトで画像が大きく見える** | 画像が画面幅いっぱいに表示。サムネが潰れない | 7点 |

### Layer 3: 価値チェック（雰囲気が好きと感じるか）— 30点

この機能の核「写真を大きく見て『この雰囲気が好き』と感じる」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 雰囲気の伝達 | 写真を見て**「この雰囲気いいな」**と感じる | 高品質写真+統一感あるグリッド+ホバーで詳細が見える | 写真は見られる。グリッドは整っている | 低解像度でぼやけた写真。雰囲気が伝わらない |
| V-2 | 写真の品質/サイズ | 写真が**十分な解像度とサイズ**で表示される | ライトボックスで2000px以上の高解像度。ディテールまで見える | ライトボックスで1000px程度。概要は見える | サムネと同サイズ。拡大してもぼやける |
| V-3 | カテゴリの探しやすさ | 見たいカテゴリの写真が**3秒以内に見つかる** | フィルタータブが一行に収まり、ワンタップで絞り込める | フィルターはあるが8カテゴリ以上で横スクロール必要 | フィルターなし。全写真を順に見る必要がある |
| V-4 | 比較のしやすさ | 複数の写真を**見比べて好みを判断**できる | 統一サイズのグリッドで雰囲気の比較がしやすい。カード間のgap均一 | グリッドだがサイズにばらつきがある | サイズがバラバラ。比較が困難 |
| V-5 | 連続閲覧体験 | ライトボックスで**次々と写真を見進められる** | スワイプ/矢印で快適に連続閲覧。読み込み待ちなし | 矢印で次へ進めるが少し遅い | ライトボックスを閉じて次のサムネをクリック。面倒 |
| V-6 | 汎用性 | 画像配列+カテゴリ配列の差し替えだけで**任意の業種に対応**できる | GalleryItem配列とcategories配列を変えるだけ。コンポーネント改修不要 | 構造は汎用的。一部のスタイルが業種固有 | 業種ごとにコンポーネントを書き直す必要がある |

## スコアリング

### 合計100点の内訳

| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 10項目全PASSで30点。1つでもFAILなら0点（作り直し） |
| Layer 2: UX | 40点 | 5項目、各項目の配点通り。部分点あり |
| Layer 3: 価値 | 30点 | 6項目、各5点。部分点あり |

### 判定ルール

| スコア | 判定 | アクション |
|---|---|---|
| 90〜100 | **PASS** | そのまま次の機能へ。核が実現されている |
| 80〜89 | **CONDITIONAL** | Layer 2 or 3 の減点箇所を特定し修正。修正後に再チェック |
| 70〜79 | **FAIL** | Layer 1 は通るがUXか価値が不足。原因を記録し、該当層を作り直し |
| 0〜69 | **CRITICAL FAIL** | Layer 1 がFAIL。機能として動いていない。全体を作り直し |

### 採点の具体例

**90点の実装:**
- グリッド+ライトボックス+prev/next+lazy loading+フィルター+アニメーションが全て動作（L1: 30/30）
- ライトボックス0.2秒表示。スワイプ滑らか。外クリック+ESC+Xで閉じる（L2: 35/40）
- 高品質写真で「いいな」と感じる。カテゴリ3秒で絞り込み。連続閲覧が快適（L3: 25/30）

**80点の実装:**
- 基本機能は全て動作する（L1: 30/30）
- ライトボックスあり。矢印ナビゲーション。モバイル1列（L2: 28/40）
- 写真は見られるが解像度が中程度。フィルターはあるがカテゴリが多い（L3: 22/30）

**70点の実装:**
- グリッドは表示。ライトボックスなし（L1: 30/30）
- 画像クリックで拡大できない。フィルターアニメーションなし（L2: 22/40）
- 低解像度写真。サムネのまま拡大。雰囲気が伝わらない（L3: 18/30）

### この機能固有の重要判定ポイント

1. **ライトボックスの必須性**: 写真を大きく見られなければこの機能の核が未達成。**ライトボックス未実装はF-2自動FAILかつ全体70点未満**
2. **lazy loadingの効果**: ギャラリーは画像枚数が多くなるため、lazy loadingなしはページパフォーマンスを破壊する。**lazy loading未実装はF-4自動FAIL**
3. **写真品質**: ギャラリーの価値は写真の品質に直結。**ライトボックスで800px以下の写真はV-2自動FAIL**。サムネをそのまま拡大表示しない
