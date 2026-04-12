# 商品ラインアップ
> ID: product-lineup | カテゴリ: section | プラン: middle

## 概要
商品・サービスの一覧を横スクロールスライダーで表示するセクション。業種を問わず、企業が提供する商品・サービス・プランを視覚的に並べ、詳細ページへの導線を作る。カード形式で画像・名称・特徴タグ・価格帯を表示し、「全商品を見る」で一覧ページへ誘導する。

## この機能の核
「こういう選択肢があるんだ」と全体像が掴める。

## 必須要件
- 横スクロール可能なスライダー形式で表示すること
- 各カード: 商品画像 + 商品名 + 特徴タグ（2〜3個） + 価格帯（任意）
- 「全商品を見る」リンクを配置すること
- スライダー: デスクトップでは左右矢印ボタン、モバイルではタッチスワイプ
- カード数は5〜10枚を想定
- カードクリックで商品詳細ページへ遷移
- スクロールスナップ（scroll-snap-type: x mandatory）で1枚ずつ止まること
- デスクトップ 3〜4枚同時表示 / モバイル 1.2枚表示（次カードのチラ見せ）

## 業種別バリエーション

| 業種 | セクション名 | カテゴリ例 | カード情報 |
|---|---|---|---|
| **建築** | 商品ラインアップ | 平屋, ZEH, 二世帯, 3階建, ガレージハウス | 商品名 + 坪数 + 価格帯 + 性能タグ |
| **小売** | 商品カテゴリ | メンズ, レディース, キッズ, アウトレット | 商品名 + 価格 + NEW/SALE バッジ |
| **飲食** | メニュー | ランチ, ディナー, コース, ドリンク | メニュー名 + 価格 + アレルギー表示 |
| **美容** | メニュー/サービス | カット, カラー, パーマ, ヘッドスパ, エステ | メニュー名 + 所要時間 + 価格 |
| **医療** | 診療メニュー | 一般歯科, 矯正, インプラント, ホワイトニング | 診療名 + 保険適用/自費 + 目安費用 |
| **教育** | コース一覧 | 初級, 中級, 上級, マンツーマン | コース名 + 期間 + 受講料 |
| **ホテル** | 客室タイプ | シングル, ツイン, スイート, 和室 | 部屋名 + 定員 + 料金帯 + アメニティタグ |

## 既存テンプレートとの接続

### 既存実装の状況
| テンプレート | 関数名 | セクション ID | データ定数 | ステータス |
|---|---|---|---|---|
| warm-craft | — | — | — | 未実装（新規追加） |
| trust-navy | — | — | — | 未実装（新規追加） |
| clean-arch | — | — | — | 未実装（新規追加） |

### 挿入位置

**warm-craft** — StrengthsSection の直後に追加:
```tsx
export default function WarmCraftPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <StrengthsSection />
        <ProductLineupSection />   {/* ← ここに追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**trust-navy** — ServicesSection の直後に追加:
```tsx
export default function TrustNavyPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductLineupSection />   {/* ← ここに追加 */}
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**clean-arch** — WorksSection の直後に追加:
```tsx
export default function CleanArchPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <ProductLineupSection />   {/* ← ここに追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

### navItems への追加

| テンプレート | 追加するエントリ |
|---|---|
| warm-craft | `{ label: "商品ラインアップ", href: "#lineup" }` — 「私たちの強み」の後 |
| trust-navy | `{ label: "商品ラインアップ", href: "#lineup" }` — 「事業内容」の後 |
| clean-arch | `["LINEUP", "#lineup"]` — 「WORKS」の後 |

### カラーの合わせ方
| テンプレート | アクセント | テキスト | 背景 | ボーダー | カードBG |
|---|---|---|---|---|---|
| warm-craft | `#7BA23F` | `#3D3226` | `#FAF7F2` | `#E8DFD3` | `white` |
| trust-navy | `#C8A96E` | `#1B3A5C` | `#F0F4F8` | `gray-200` | `white` |
| clean-arch | `gray-400` | `gray-800` | `white` | `gray-100` | `#EDEBE5` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function ProductLineupSection() { ... }
```

### データ定数（英語プロパティ名）
```typescript
interface Product {
  /** Product ID */
  id: number;
  /** Product/service name */
  title: string;
  /** English name (optional) */
  titleEn?: string;
  /** Main image path */
  image: string;
  /** Feature tags (2-4 items) */
  tags: string[];
  /** Price range (optional: "2,000万円台〜", "¥3,300", etc.) */
  priceRange?: string;
  /** Short description / catchphrase */
  desc: string;
  /** Detail page link */
  href: string;
  /** Additional spec info (optional: "25〜35坪", "60分", etc.) */
  spec?: string;
}

interface ProductLineupConfig {
  /** Section title (Japanese) */
  sectionTitle: string;
  /** Subtitle */
  subtitle: string;
  /** Link to full listing page */
  allItemsHref: string;
  /** All items link text */
  allItemsLabel: string;
  /** Slider settings */
  slider: {
    /** Number of visible cards on desktop */
    desktopCount: number;
    /** Auto-scroll enabled */
    autoScroll: boolean;
    /** Auto-scroll interval (ms) */
    interval?: number;
  };
}

// Demo data (industry-agnostic example)
const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "HIRAYA",
    image: "/products/hiraya.webp",
    tags: ["平屋", "バリアフリー", "庭付き"],
    priceRange: "2,200万円台〜",
    desc: "ワンフロアで叶える、ゆとりの暮らし",
    href: "/products/hiraya",
    spec: "25〜35坪",
  },
  {
    id: 2,
    title: "ZEH SMART",
    image: "/products/zeh-smart.webp",
    tags: ["ZEH", "太陽光", "省エネ"],
    priceRange: "2,800万円台〜",
    desc: "光熱費ゼロを目指す、次世代の住まい",
    href: "/products/zeh-smart",
    spec: "30〜40坪",
  },
  {
    id: 3,
    title: "NISETAI PLUS",
    image: "/products/nisetai.webp",
    tags: ["二世帯", "完全分離", "共用玄関"],
    priceRange: "3,200万円台〜",
    desc: "程よい距離感で、家族がつながる",
    href: "/products/nisetai-plus",
    spec: "40〜55坪",
  },
  {
    id: 4,
    title: "URBAN THREE",
    image: "/products/urban-three.webp",
    tags: ["3階建", "狭小地", "ガレージ"],
    priceRange: "2,600万円台〜",
    desc: "都市の限られた敷地を最大限活用",
    href: "/products/urban-three",
    spec: "20〜30坪",
  },
  {
    id: 5,
    title: "GARAGE LIFE",
    image: "/products/garage.webp",
    tags: ["ガレージ", "趣味空間", "土間"],
    priceRange: "2,500万円台〜",
    desc: "愛車と暮らす、ガレージハウス",
    href: "/products/garage-life",
    spec: "30〜40坪",
  },
];
```

### 状態管理
```typescript
const scrollContainerRef = useRef<HTMLDivElement>(null);
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [canScrollRight, setCanScrollRight] = useState(true);

const updateScrollButtons = () => {
  const el = scrollContainerRef.current;
  if (!el) return;
  setCanScrollLeft(el.scrollLeft > 0);
  setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
};

useEffect(() => {
  const el = scrollContainerRef.current;
  if (!el) return;
  el.addEventListener("scroll", updateScrollButtons);
  updateScrollButtons();
  return () => el.removeEventListener("scroll", updateScrollButtons);
}, []);

const scrollTo = (direction: "left" | "right") => {
  const el = scrollContainerRef.current;
  if (!el) return;
  const cardWidth = el.querySelector(":first-child")?.clientWidth || 300;
  el.scrollBy({
    left: direction === "left" ? -cardWidth : cardWidth,
    behavior: "smooth",
  });
};
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | 1.2枚表示（次カードチラ見せ） / タッチスワイプ / 矢印非表示 / カード幅 80vw |
| **タブレット**（640〜1023px） | 2.3枚表示 / タッチ+矢印 / カード幅 45vw |
| **デスクトップ**（1024px〜） | 3〜4枚表示 / 矢印ボタン / ホバーエフェクト / カード幅 calc(25% - gap) |

## リファレンスコード

warm-craft の WorksSection フィルター + カードパターンを参照:
```tsx
{/* Section header pattern — all templates follow this */}
<motion.div
  className="text-center mb-14"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">LINEUP</p>
  <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">商品ラインアップ</h2>
  <p className="text-[#8B7D6B] text-sm">暮らしに合わせた、多彩なプランをご用意</p>
</motion.div>

{/* Card with stagger animation pattern */}
<motion.div
  className="flex-shrink-0 w-[80vw] sm:w-[45vw] lg:w-[calc(25%-12px)] snap-start
             rounded-2xl bg-white border border-[#E8DFD3]
             hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-30px" }}
  transition={{ duration: 0.5, delay: i * 0.08 }}
>
  {/* Image area */}
  <div className="aspect-[4/3] bg-gradient-to-b from-[#D4CFC5] to-[#C4B5A0] overflow-hidden">
    {/* product image or SVG placeholder */}
  </div>
  {/* Text area */}
  <div className="p-5">
    <h3 className="font-bold text-[#3D3226] text-base mb-2">{product.title}</h3>
    <p className="text-[#8B7D6B] text-sm mb-3">{product.desc}</p>
    <div className="flex flex-wrap gap-1.5">
      {product.tags.map(tag => (
        <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#7BA23F]/10 text-[#7BA23F] text-xs">
          {tag}
        </span>
      ))}
    </div>
    {product.priceRange && (
      <p className="text-[#3D3226] font-bold text-sm mt-3">{product.priceRange}</p>
    )}
  </div>
</motion.div>
```

## 3層チェック

> この機能の核: **「こういう選択肢があるんだ」と全体像が掴める**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 横スクロールスライダーが動作 | scroll-snap-type: x mandatory で滑らかにスクロール | スクロールできない/カクつく |
| F-2 | スクロールスナップで左端にスナップ | 各カードがsnap-startで止まる | カードの途中で止まる |
| F-3 | デスクトップで左右矢印ボタン表示 | クリックでカード1枚分スクロール | 矢印が表示されない/動かない |
| F-4 | スクロール端で矢印が非活性/非表示 | canScrollLeft/canScrollRight で制御 | 端でも矢印が活性のまま |
| F-5 | モバイルでタッチスワイプ動作 | 指でスムーズに横スクロール | タッチ操作が効かない |
| F-6 | 各カードに商品画像・商品名・特徴タグ表示 | 3要素全てが視認できる | 情報が欠落している |
| F-7 | 特徴タグがアクセントカラーのバッジ | テンプレートのブランドカラー使用 | デフォルトカラー/バッジなし |
| F-8 | 「全商品を見る」リンク配置 | クリックで一覧ページに遷移 | リンクなし/404 |
| F-9 | カードクリックで詳細ページ遷移 | href先に正しく遷移する | クリックしても何も起きない |
| F-10 | セクションヘッダー3段構成 | 英字ラベル+H2+サブテキスト | パターン不一致/ヘッダーなし |
| F-11 | Framer Motion whileInView + stagger | カードが順次フェードイン | アニメーションなし |
| F-12 | レスポンシブカード幅 | モバイル80vw/タブレット45vw/PC25% | 全端末で同じ幅 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | スクロール操作の発見しやすさ | 次のカードがチラ見えしてスクロール可能と気づく | モバイルで1.2枚表示（次カード20%見える） | 10点 |
| U-2 | 全商品を一覧できる速度 | スワイプで全商品を素早く確認できる | 5枚を15秒以内にスキャン可能 | 8点 |
| U-3 | 価格/仕様の視認性 | 価格帯やスペックがカード内で一目でわかる | priceRange表示+太字 | 8点 |
| U-4 | タグの理解しやすさ | 特徴タグが非専門家にも伝わる | 業種固有+一般理解可能な用語 | 6点 |
| U-5 | 全商品一覧への導線 | 「全商品を見る」が発見しやすい | セクション下部に明確なリンク | 4点 |
| U-6 | 矢印ボタンの操作性 | デスクトップで直感的に操作できる | ホバーで表示+十分なクリック領域 | 4点 |

### Layer 3: 価値チェック（全体像が掴めるか）— 30点

この機能の核「『こういう選択肢があるんだ』と全体像が掴める」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 選択肢の違いが明確 | 各商品の特徴が一目で区別できる | 「HIRAYA/ZEH/NISETAI」+異なるタグ+価格帯 | 商品名は違うが見た目が同じ | 全カード同じ見た目で違い不明 |
| V-2 | 自分に合う商品がわかる | タグ+スペック+価格で判断できる | 「平屋/バリアフリー/25〜35坪/2,200万円台〜」 | 商品名+価格のみ | 商品名のみで判断材料なし |
| V-3 | 次のアクションがある | 詳細/問合せへの導線が明確 | カードクリック→詳細ページ+「全商品を見る」 | 「全商品を見る」リンクのみ | 導線なし（見て終わり） |
| V-4 | 価格帯が参考になる | 予算との照合が可能 | 「2,200万円台〜」で予算感がわかる | 「お問い合わせください」 | 価格情報なし |
| V-5 | 写真/ビジュアルで雰囲気が伝わる | 商品の世界観が視覚的に伝わる | 商品写真+ライフスタイルイメージ | グラデーションプレースホルダ | グレーの四角のみ |
| V-6 | 業種に合った商品構成 | ターゲット業種に自然な商品ラインアップ | 工務店→平屋/ZEH/二世帯/3階建 | 汎用的だが違和感なし | 業種と不一致な商品 |

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
**90点の実装:** 横スクロールで5商品を快適にスキャン。各カードに写真+商品名+タグ+価格帯。チラ見せで操作発見。カードタップで詳細遷移。選択肢の違いが一目瞭然。
**80点の実装:** スライダー動作・スナップ・矢印全て機能するが、商品の違いがタイトルだけで伝わりにくい。価格帯は表示されている。
**70点の実装:** 横スクロールは動くが、チラ見せなしでスクロール可能と気づかない。タグなし。詳細ページリンクが404。

### この機能固有の重要判定ポイント
- **チラ見せ効果**: モバイルで次カードが20%見えること。完全に隠れるとスクロールされない
- **価格表示ルール**: 飲食は税込義務、医療は自費/保険区別、不動産は坪単価+総額
- **タグ設計**: 業種固有タグ（建築→ZEH/耐震等級3、飲食→アレルギー対応、美容→所要時間）
- **業種適合性**: オーダーメイド型業種では works-gallery の方が適切な場合がある
