# ビフォーアフター
> ID: before-after | カテゴリ: section | プラン: middle

## 概要

施工前後・使用前後・施術前後を、スライダー比較UIで視覚的に表示するセクション。ドラッグハンドルを左右に動かすことで、同一アングルのBefore/After画像を重ね合わせて比較できる。業種を問わず、「変化」を訴求するビジネスにとって最も説得力のあるコンテンツ形式。マウスドラッグとタッチ操作の両方に対応し、モバイルでも直感的に操作可能。clip-path ベースのオーバーレイスライダーを基本パターンとする。

## この機能の核
「こんなに変わるんだ」と効果を実感する。

## 必須要件

- 2枚の画像（Before/After）を重ね合わせ、ドラッグハンドルで表示比率を変更できること
- ドラッグハンドル: 縦のラインとドラッグアイコン（左右矢印）
- Before/After のラベルを画像の左上・右上に常時表示
- タッチ操作（スマートフォン）に対応すること
- マウスドラッグ、タッチドラッグの両方で滑らかに動作すること
- 複数のBefore/After比較をカルーセルまたはグリッドで表示可能
- 画像アスペクト比の統一（4:3 or 16:9）
- ドラッグハンドルのタッチ領域は44px以上（アクセシビリティ）

## 業種別バリエーション

| 業種 | Before/After コンテンツ例 |
|---|---|
| **建築・建設** | リフォーム前後（キッチン、浴室、外壁）、リノベーション、外構工事 |
| **小売・EC** | 商品使用前後、クリーニング前後、組立前後 |
| **飲食** | 店舗リニューアル前後、盛り付け改善 |
| **美容・サロン** | ヘアスタイル施術前後、フェイシャル施術前後、ネイル |
| **医療・クリニック** | 治療前後（歯科矯正、皮膚科等）、施設改装 |
| **フォトグラファー** | レタッチ前後、撮影環境セットアップ |
| **ハンドメイド作家** | 素材 → 完成品、修理・リメイク前後 |
| **清掃・メンテナンス** | 清掃前後、修繕前後 |

### レイアウト構成
```
┌─────────────────────────────────────────────┐
│  BEFORE & AFTER / ビフォーアフター             │
│  英語ラベル(tracking-[0.3em]) → H2 → subtext  │
│                                              │
│  ┌──────────────┼──────────────┐             │
│  │              │              │             │
│  │   BEFORE     │   AFTER      │             │
│  │              │              │             │
│  │   (変更前)    ◀▶   (変更後)   │             │
│  │              │              │             │
│  └──────────────┼──────────────┘             │
│                                              │
│  プロジェクト名 / エリア                        │
│  説明テキスト                                  │
│                                              │
│            ● ○ ○ ← 他の事例                  │
└─────────────────────────────────────────────┘
```

## 既存テンプレートとの接続

### 既存実装の状況

3テンプレート全てにBeforeAfterSectionは**存在しない**。新規セクションとして追加する。

| テンプレート | 現在の構成 | 推奨挿入位置 |
|---|---|---|
| warm-craft | Hero → Works → Strengths → About → Contact | Works と Strengths の間（施工実績の補強） |
| trust-navy | Hero → Services → Projects → About → Contact | Projects と About の間 |
| clean-arch | Hero → Works → About → Contact | Works と About の間 |

### 挿入手順

```tsx
// warm-craft の場合:
export default function WarmCraftPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <BeforeAfterSection />  {/* ← 新規追加（Worksの補強として） */}
        <StrengthsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

// trust-navy の場合:
export default function TrustNavyPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <BeforeAfterSection />  {/* ← 新規追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

// clean-arch の場合:
export default function CleanArchPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <BeforeAfterSection />  {/* ← 新規追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

### セクションヘッダーの適用パターン

```tsx
// warm-craft style
<p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">BEFORE & AFTER</p>
<h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">ビフォーアフター</h2>
<p className="text-gray-500 text-sm">施工で生まれ変わった空間をご覧ください。</p>

// trust-navy style
<p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">BEFORE & AFTER</p>
<h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl mb-3">ビフォーアフター</h2>
<p className="text-gray-500 text-sm">プロジェクトの変化をご確認ください。</p>

// clean-arch style
<p className="text-gray-300 text-[10px] tracking-[0.4em] mb-6">BEFORE & AFTER</p>
<h2 className="text-black text-3xl sm:text-4xl font-extralight tracking-wide">Before & After</h2>
```

### navItemsへの影響

BeforeAfterSection は通常 navItems に追加しない（Works/Projects の補強セクションとして機能するため）。

### カラー適用

| テンプレート | ハンドル色 | ラベル背景 | セクション背景 |
|---|---|---|---|
| warm-craft | `bg-[#7BA23F]` | `bg-[#3D3226]/70` | `bg-[#FAF7F2]` |
| trust-navy | `bg-[#C8A96E]` | `bg-[#0D2440]/70` | `bg-[#F0F4F8]` |
| clean-arch | `bg-black` | `bg-black/60` | `bg-white border-t border-gray-100` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function BeforeAfterSection() { ... }
```

### Props / データ構造
```typescript
interface BeforeAfterItem {
  /** Unique ID */
  id: number;
  /** Project name */
  projectName: string;
  /** Before image URL */
  beforeImage: string;
  /** After image URL */
  afterImage: string;
  /** Description text */
  description: string;
  /** Category */
  category: string;
  /** Area / location (optional) */
  area?: string;
  /** Detail items (optional) */
  details?: string[];
  /** Price range (optional) */
  priceRange?: string;
  /** Duration (optional) */
  duration?: string;
}

interface BeforeAfterConfig {
  /** Section title */
  sectionTitle: string;
  /** Section subtitle */
  subtitle?: string;
  /** Display mode */
  displayMode: 'slider' | 'side-by-side' | 'fade';
  /** Multiple items display */
  multipleDisplay: 'carousel' | 'grid';
  /** Initial handle position (0 to 1) */
  initialPosition: number;
  /** Image aspect ratio */
  aspectRatio: '4:3' | '16:9' | '3:2';
}

// Demo data — industry-agnostic
const DEMO_BEFORE_AFTER: BeforeAfterItem[] = [
  {
    id: 1,
    projectName: "リフォーム事例 — A様",
    beforeImage: "/before-after/case1-before.webp",
    afterImage: "/before-after/case1-after.webp",
    description: "老朽化した空間を全面改修。機能性とデザイン性を両立した仕上がりに。",
    category: "リフォーム",
    area: "東京都",
    details: ["設備交換", "内装リニューアル", "照明改善"],
    priceRange: "150〜200万円",
    duration: "約2週間",
  },
  {
    id: 2,
    projectName: "外装リニューアル — B様",
    beforeImage: "/before-after/case2-before.webp",
    afterImage: "/before-after/case2-after.webp",
    description: "経年劣化した外装を一新。見た目の刷新と機能向上を同時に実現。",
    category: "外装",
    area: "神奈川県",
    details: ["外装張替え", "断熱強化"],
    priceRange: "180〜220万円",
    duration: "約2週間",
  },
];
```

### 状態管理
```typescript
const containerRef = useRef<HTMLDivElement>(null);
const [sliderPosition, setSliderPosition] = useState(config.initialPosition); // 0〜1
const [isDragging, setIsDragging] = useState(false);
const [activeIndex, setActiveIndex] = useState(0);

// Drag handling (mouse + touch unified)
const handleMove = (clientX: number) => {
  if (!isDragging || !containerRef.current) return;
  const rect = containerRef.current.getBoundingClientRect();
  const x = clientX - rect.left;
  const position = Math.max(0, Math.min(1, x / rect.width));
  setSliderPosition(position);
};

// Mouse events
const handleMouseDown = () => setIsDragging(true);
const handleMouseUp = () => setIsDragging(false);
const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);

// Touch events
const handleTouchStart = () => setIsDragging(true);
const handleTouchEnd = () => setIsDragging(false);
const handleTouchMove = (e: React.TouchEvent) => {
  e.preventDefault(); // Prevent scroll during drag
  handleMove(e.touches[0].clientX);
};

// Global mouseup (when mouse is released outside element)
useEffect(() => {
  const handleGlobalUp = () => setIsDragging(false);
  const handleGlobalMove = (e: MouseEvent) => handleMove(e.clientX);

  if (isDragging) {
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('mousemove', handleGlobalMove);
  }
  return () => {
    window.removeEventListener('mouseup', handleGlobalUp);
    window.removeEventListener('mousemove', handleGlobalMove);
  };
}, [isDragging]);
```

## リファレンスコード（warm-craft スタイルに準拠）

```tsx
function BeforeAfterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0.5);
  const [dragging, setDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition(Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width)));
  };

  useEffect(() => {
    if (!dragging) return;
    const up = () => setDragging(false);
    const move = (e: MouseEvent) => handleMove(e.clientX);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", move); };
  }, [dragging]);

  return (
    <section id="before-after" className="py-20 sm:py-28 bg-[#FAF7F2]">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">BEFORE & AFTER</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">ビフォーアフター</h2>
          <p className="text-gray-500 text-sm">施工で生まれ変わった空間をご覧ください。</p>
        </motion.div>

        {/* Slider container */}
        <motion.div
          ref={containerRef}
          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-col-resize select-none"
          onMouseDown={() => setDragging(true)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onTouchStart={() => setDragging(true)}
          onTouchEnd={() => setDragging(false)}
          onTouchMove={(e) => { e.preventDefault(); handleMove(e.touches[0].clientX); }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* After image (full) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7BA23F]/30 to-[#E8DFD3]">
            {/* Replace with: <img src={item.afterImage} className="w-full h-full object-cover" /> */}
          </div>

          {/* Before image (clipped) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3D3226]/30 to-[#A69279]"
            style={{ clipPath: `inset(0 ${(1 - position) * 100}% 0 0)` }}
          >
            {/* Replace with: <img src={item.beforeImage} className="w-full h-full object-cover" /> */}
          </div>

          {/* Labels */}
          <span className="absolute top-3 left-3 bg-[#3D3226]/70 text-white text-xs px-2 py-1 rounded">BEFORE</span>
          <span className="absolute top-3 right-3 bg-[#3D3226]/70 text-white text-xs px-2 py-1 rounded">AFTER</span>

          {/* Handle */}
          <div className="absolute top-0 bottom-0" style={{ left: `${position * 100}%`, transform: "translateX(-50%)" }}>
            <div className="w-0.5 h-full bg-white shadow-lg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <span className="text-[#3D3226] text-xs font-bold">◀▶</span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <div className="mt-4 text-center">
          <p className="text-[#3D3226] font-medium">リフォーム事例 — 東京都 A様</p>
          <p className="text-gray-500 text-sm mt-1">老朽化した空間を全面改修。機能性とデザイン性を両立。</p>
        </div>
      </div>
    </section>
  );
}
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | フル幅 / アスペクト比維持 / ドラッグハンドル: 太め（44px幅のタッチ領域）/ ラベル: text-xs / 事例情報: スライダー下に表示 |
| **タブレット**（640〜1023px） | 80%幅中央揃え / ドラッグハンドル: 40px / ラベル: text-xs |
| **デスクトップ**（1024px〜） | max-width: 900px / ドラッグハンドル: 40px + ホバーカーソル変更（col-resize）/ ラベル: text-xs |

## 3層チェック

> この機能の核: **「こんなに変わるんだ」と効果を実感する**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | スライダー動作 | ドラッグハンドルの左右移動でBefore/After画像の表示比率がclip-pathで変わる | ハンドルが動かない。clip-pathが適用されない |
| F-2 | Before/Afterラベル | 画像の左上に「BEFORE」、右上に「AFTER」が常時表示されている | ラベルなし。ラベルが画像外にはみ出す |
| F-3 | マウスドラッグ | デスクトップでマウスドラッグが滑らかに動作する | カクつく。ドラッグ中にテキスト選択が発生する |
| F-4 | タッチドラッグ | モバイル/タブレットでタッチドラッグが滑らかに動作する | タッチしてもハンドルが動かない |
| F-5 | スクロール抑制 | ドラッグ中にページスクロールが抑制されている（`e.preventDefault()`） | タッチするとページがスクロールしてしまう |
| F-6 | 初期位置 | 初期表示位置が中央（50%）で両画像が半分ずつ見える | 初期位置が0%や100%で片方しか見えない |
| F-7 | アスペクト比 | 画像のアスペクト比が統一（4:3 or 16:9）で維持されている | アスペクト比不統一で画像が歪む |
| F-8 | 複数事例切替 | 複数事例がある場合、カルーセルまたはグリッドで切り替え可能 | 切り替えUIがない。カルーセルが動かない |
| F-9 | グローバルmouseup | マウスを要素外に移動してもドラッグが正しく終了する | ハンドルが追従し続けて画面がおかしくなる |
| F-10 | reduced-motion | `prefers-reduced-motion`時にスライダーの初期アニメーションが無効化される | 設定無視でアニメーション再生 |
| F-11 | セクションヘッダー | English label(tracking-[0.3em]) + H2 + subtextの3段構成 | H2だけ。英語ラベルなし |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、直感的にスライダーを操作できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 操作方法の直感性 | 初見で**「ハンドルを動かせばいい」**と直感的にわかる | ドラッグハンドル（縦ライン+円形アイコン+左右矢印◀▶）が視覚的に明確 | 10点 |
| U-2 | Before/Afterラベルの視認性 | **どちらがBefore/Afterか一目**でわかる | ラベルが半透明背景付きで画像上に常時表示。コントラスト確保 | 8点 |
| U-3 | タッチ領域の十分さ | スマホで**ハンドルを正確にタップ・ドラッグ**できる | ドラッグハンドルのタッチ領域44px以上。cursor: col-resize設定 | 8点 |
| U-4 | 事例情報の充実 | スライダーだけでなく**事例の詳細情報**がわかる | スライダー下にプロジェクト名・説明・エリア・費用・期間が表示 | 7点 |
| U-5 | 他事例への誘導 | **他にも事例がある**ことがわかり、簡単に見られる | ドットインジケーター+スワイプ/矢印で切り替え。事例数が明示 | 7点 |

### Layer 3: 価値チェック（効果を実感するか）— 30点

この機能の核「こんなに変わるんだ、と効果を実感する」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 変化量が「すごい」と感じるか | Before/Afterの差が**一目で「すごい」**と思える | 老朽化キッチン→モダン設備。劇的な変化が一瞬でわかる | 変化はわかるが「劇的」とまではいかない | BeforeとAfterの違いが微妙で変化がわからない |
| V-2 | Before/Afterの差が明確か | 同一アングル・同一画角で**比較の公平性**が保たれている | 同じ立ち位置、同じ照明条件で撮影。違いは施工内容のみ | アングルは近いが照明や季節が異なる | アングルが全く違い比較にならない |
| V-3 | 「自分にも同じ結果が得られる」と思えるか | 事例情報から**自分のケースに当てはめ**られる | 「東京都A様/築30年/2週間/150〜200万円」で自分と比較可能 | エリアと期間は記載あるが費用がない | 写真だけで情報ゼロ。自分に当てはまるかわからない |
| V-4 | スライダー操作が「楽しい」か | **動かしたくなる**インタラクション | ハンドルの動きが滑らか+ホバーで色変化+カーソルがcol-resize | 動作はスムーズだが演出がない | カクつく。操作にストレスがある |
| V-5 | 「この会社に頼みたい」に繋がるか | Before/Afterを見て**問い合わせしたくなる** | スライダー直下にCTAリンク「こんな変化をお求めの方はこちら」がある | CTAはないが「良い仕事だな」とは思う | 変化が伝わらず行動意欲が湧かない |

## スコアリング

### 合計100点の内訳

| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 11項目全PASSで30点。1つでもFAILなら0点（作り直し） |
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
- スライダー・タッチ・グローバルmouseup・カルーセル全て動作。reduced-motion対応済み（L1: 30/30）
- ハンドル+◀▶が直感的。ラベル明確。タッチ領域44px。事例詳細+ドットインジケーター完備（L2: 35/40）
- 劇的なBefore/After。同一アングル。「築30年/150〜200万円」の具体情報。CTA導線あり（L3: 25/30）

**80点の実装:**
- スライダーは動作。カルーセル切替がやや不安定（L1: 30/30）
- ハンドルは明確。タッチ領域OK。ただし事例詳細が名前のみ（L2: 28/40）
- 変化はわかるが照明条件が異なる。費用記載なし（L3: 22/30）

**70点の実装:**
- マウスドラッグは動くがタッチドラッグがカクつく（L1: 30/30 ギリギリ）
- ハンドルが小さく操作しにくい。ラベルが目立たない（L2: 22/40）
- BeforeとAfterの差が小さい。情報なし。CTA導線なし（L3: 18/30）

### この機能固有の重要判定ポイント

1. **タッチ操作の品質**: スマートフォンでの操作感が良くないと即離脱。F-4(タッチドラッグ)+F-5(スクロール抑制)が連動してFAILするケースが多い。必ず実機テスト
2. **同一アングル必須**: Before/Afterは同じアングル・画角で撮影すること。異なるアングルだと比較の公平性が損なわれ、V-2で大幅減点
3. **clip-path方式推奨**: After画像を全面に、Before画像をclip-pathで左側から重ねる方式が最もスムーズ。left/width方式よりちらつきが少ない
4. **変化量の選定**: Before/Afterの差が小さい事例は採用しない。「劇的な変化」が見える事例こそがこの機能の価値。V-1で厳しく評価
