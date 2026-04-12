# ピックアップ/特集
> ID: pickup-section | カテゴリ: section | プラン: middle

## 概要
季節イベント・キャンペーン・特集コンテンツを横スクロールカルーセルで目立たせるセクション。業種を問わず、期間限定の集客コンテンツや注目コンテンツを大きなビジュアルカードで訴求する。常設コンテンツ（スタッフ紹介、コンセプトストーリー等）にも使える汎用性の高いセクション。期間終了判定ロジックにより、終了済みアイテムを自動的に非表示にする機能を含む。

## この機能の核
「今やってるキャンペーン/イベント」に気づいて興味を持つ。

## 必須要件
- 横スクロールスライダー形式で表示すること
- 各カードはビジュアル重視の大きなサイズ（最低 300x200px 相当）
- カードに画像 + タイトル + 説明テキスト + ラベル（NEW/期間限定等）
- 期間限定コンテンツには開催期間（日付範囲）を表示可能にすること
- デスクトップ: 2〜3枚同時表示 / モバイル: 1枚表示（チラ見せ）
- タッチスワイプ + 矢印ボタン操作
- ラベルバッジ: カード左上に配置（NEW / 期間限定 / 受付中 / おすすめ 等）
- ドットインジケーターでアクティブスライドを表示

## 業種別バリエーション

| 業種 | セクション名 | コンテンツ例 | ラベル例 |
|---|---|---|---|
| **建築** | イベント/特集 | 完成見学会, モデルハウスオープン, 住宅ローン相談会, リフォームフェア | 受付中, 予約制, 来場特典 |
| **小売** | キャンペーン | 季節セール, 新商品入荷, 会員限定フェア, ポイント還元祭 | NEW, SALE, 期間限定, 会員限定 |
| **飲食** | 季節メニュー/イベント | 季節限定メニュー, ディナーコース, ビアガーデン, クリスマスプラン | 期間限定, 予約受付中, 残りわずか |
| **美容** | キャンペーン | 新メニュー導入, 季節ケアキャンペーン, 紹介割引, 学割プラン | NEW, 初回限定, 今月限定 |
| **医療** | お知らせ/特集 | 健康診断キャンペーン, 新設備導入, インフルエンザ予防接種, 無料相談会 | 受付中, NEW, 予約制 |
| **教育** | 特集/イベント | 体験授業, 入塾キャンペーン, 夏期講習, 合格実績発表 | 受付中, 早期割引, 定員間近 |
| **ホテル** | プラン/特集 | 季節プラン, 記念日プラン, 早期予約特典, 地域観光特集 | おすすめ, 期間限定, 早割 |

## 既存テンプレートとの接続

### 既存実装の状況
| テンプレート | 関数名 | セクション ID | データ定数 | ステータス |
|---|---|---|---|---|
| warm-craft | — | — | — | 未実装（新規追加） |
| trust-navy | — | — | — | 未実装（新規追加） |
| clean-arch | — | — | — | 未実装（新規追加） |

### 挿入位置

**warm-craft** — HeroSection の直後に追加（ファーストビュー直下で目立たせる）:
```tsx
export default function WarmCraftPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PickupSection />          {/* ← ここに追加 */}
        <WorksSection />
        <StrengthsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**trust-navy** — HeroSection の直後に追加:
```tsx
export default function TrustNavyPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PickupSection />          {/* ← ここに追加 */}
        <ServicesSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**clean-arch** — HeroSection の直後に追加:
```tsx
export default function CleanArchPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PickupSection />          {/* ← ここに追加 */}
        <WorksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

### navItems への追加
PickupSection はイベント・キャンペーン性が高いため、ナビゲーションへの追加は任意。追加する場合:

| テンプレート | 追加するエントリ |
|---|---|
| warm-craft | `{ label: "お知らせ", href: "#pickup" }` — 先頭に追加 |
| trust-navy | `{ label: "お知らせ", href: "#pickup" }` — 先頭に追加 |
| clean-arch | `["NEWS", "#pickup"]` — 先頭に追加 |

### カラーの合わせ方
| テンプレート | アクセント | テキスト | 背景 | ラベルBG | カードBG |
|---|---|---|---|---|---|
| warm-craft | `#7BA23F` | `#3D3226` | `#FAF7F2` | `#7BA23F` (text-white) | `white` + border `#E8DFD3` |
| trust-navy | `#C8A96E` | `#1B3A5C` | `white` | `#C8A96E` (text-white) | `#F0F4F8` + border `gray-200` |
| clean-arch | `gray-800` | `gray-800` | `white` | `gray-800` (text-white) | `#EDEBE5` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function PickupSection() { ... }
```

### データ定数（英語プロパティ名）
```typescript
type PickupLabel = "NEW" | "LIMITED" | "OPEN" | "ALMOST_FULL" | "RECOMMENDED";

interface PickupItem {
  /** Item ID */
  id: number;
  /** Title */
  title: string;
  /** Description (1-2 lines) */
  desc: string;
  /** Main image path */
  image: string;
  /** Label badge (optional) */
  label?: PickupLabel;
  /** Date range for events (optional) */
  dateRange?: {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
  };
  /** Location (for event-type items) */
  location?: string;
  /** Link URL */
  href: string;
  /** Category (optional) */
  category?: string;
}

interface PickupConfig {
  /** Section title (Japanese) */
  sectionTitle: string;
  /** Subtitle */
  subtitle?: string;
  /** Number of visible cards on desktop */
  desktopCount: number;
  /** Auto-scroll enabled */
  autoScroll: boolean;
  /** Auto-scroll interval (ms) */
  interval?: number;
}

// Label display mapping
const LABEL_MAP: Record<PickupLabel, string> = {
  NEW: "NEW",
  LIMITED: "期間限定",
  OPEN: "受付中",
  ALMOST_FULL: "残りわずか",
  RECOMMENDED: "おすすめ",
};

// Demo data (industry-agnostic)
const PICKUPS: PickupItem[] = [
  {
    id: 1,
    title: "完成見学会 — 世田谷の平屋住宅",
    desc: "自然素材にこだわった平屋住宅が完成。実際の暮らしをイメージできる家具付き見学会です。",
    image: "/pickup/openhouse.webp",
    label: "OPEN",
    dateRange: { start: "2025-04-20", end: "2025-04-21" },
    location: "東京都世田谷区",
    href: "/events/openhouse-setagaya",
    category: "見学会",
  },
  {
    id: 2,
    title: "春のリフォームフェア 2025",
    desc: "キッチン・浴室・外壁のリフォーム相談会。先着20組に特典プレゼント。",
    image: "/pickup/reform-fair.webp",
    label: "LIMITED",
    dateRange: { start: "2025-04-12", end: "2025-04-30" },
    location: "自社ショールーム",
    href: "/events/reform-fair",
    category: "フェア",
  },
  {
    id: 3,
    title: "ZEH住宅のすべて — 光熱費ゼロの暮らし",
    desc: "ZEH住宅の仕組みと、実際に住んでいるお客様の声をご紹介。",
    image: "/pickup/zeh-special.webp",
    label: "RECOMMENDED",
    href: "/special/zeh",
    category: "特集",
  },
];
```

### 状態管理
```typescript
const scrollRef = useRef<HTMLDivElement>(null);
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [canScrollRight, setCanScrollRight] = useState(true);
const [activeIndex, setActiveIndex] = useState(0);

const handleScroll = () => {
  const el = scrollRef.current;
  if (!el) return;
  setCanScrollLeft(el.scrollLeft > 0);
  setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  const cardWidth = el.querySelector(":first-child")?.clientWidth || 0;
  if (cardWidth > 0) {
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
  }
};

// Auto-scroll
useEffect(() => {
  if (!config.autoScroll) return;
  const timer = setInterval(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      scrollTo("right");
    }
  }, config.interval || 5000);
  return () => clearInterval(timer);
}, [config.autoScroll]);

// Date range check — filter out expired items
const isActive = (item: PickupItem): boolean => {
  if (!item.dateRange) return true;
  const now = Date.now();
  return (
    now >= new Date(item.dateRange.start).getTime() &&
    now <= new Date(item.dateRange.end).getTime() + 86400000
  );
};

const activePickups = useMemo(
  () => pickups.filter(isActive),
  [pickups]
);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | 1枚表示 + チラ見せ / カード幅 85vw / タッチスワイプ / ラベルバッジ: text-xs |
| **タブレット**（640〜1023px） | 2枚表示 / タッチ+矢印 / カード幅 calc(50% - gap) |
| **デスクトップ**（1024px〜） | 3枚表示 / 矢印ボタン + ホバーエフェクト / カード幅 calc(33.3% - gap) |

## リファレンスコード

warm-craft のセクションヘッダー + カードパターンを応用:
```tsx
<section id="pickup" className="py-20 sm:py-28 bg-[#FAF7F2]">
  <div className="max-w-[1200px] mx-auto px-5">
    {/* Section header */}
    <motion.div
      className="text-center mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">PICKUP</p>
      <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">ピックアップ</h2>
      <p className="text-[#8B7D6B] text-sm">最新のお知らせ・イベント情報</p>
    </motion.div>

    {/* Slider container */}
    <div className="relative">
      {/* Scroll buttons (desktop) */}
      {canScrollLeft && (
        <button
          onClick={() => scrollTo("left")}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                     w-10 h-10 rounded-full bg-white shadow-md items-center justify-center
                     text-[#8B7D6B] hover:text-[#7BA23F] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
      >
        {activePickups.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.href}
            className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-10px)] lg:w-[calc(33.3%-14px)] snap-start
                       rounded-2xl bg-white border border-[#E8DFD3] overflow-hidden group
                       hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            {/* Image area with label badge */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {/* image or SVG placeholder */}
              <div className="w-full h-full bg-gradient-to-b from-[#D4CFC5] to-[#C4B5A0]
                              group-hover:scale-105 transition-transform duration-500" />
              {item.label && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full
                                 bg-[#7BA23F] text-white text-xs font-medium">
                  {LABEL_MAP[item.label]}
                </span>
              )}
            </div>
            {/* Text area */}
            <div className="p-5">
              {item.category && (
                <p className="text-[#7BA23F] text-xs mb-1.5">{item.category}</p>
              )}
              <h3 className="font-bold text-[#3D3226] text-base mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[#8B7D6B] text-sm line-clamp-2 mb-3">{item.desc}</p>
              {item.dateRange && (
                <p className="text-[#8B7D6B] text-xs">
                  {item.dateRange.start} 〜 {item.dateRange.end}
                </p>
              )}
              {item.location && (
                <p className="text-[#8B7D6B] text-xs mt-1">
                  <MapPin className="w-3 h-3 inline mr-1" />{item.location}
                </p>
              )}
            </div>
          </motion.a>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {activePickups.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === activeIndex ? "bg-[#7BA23F]" : "bg-[#E8DFD3]"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</section>
```

## 3層チェック

> この機能の核: **「今やってるキャンペーン/イベント」に気づいて興味を持つ**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 横スクロールスライダー動作 | snap-x mandatory でスムーズにスクロール | スクロールできない/カクつく |
| F-2 | 各カードに画像・タイトル・説明テキスト表示 | 3要素全てが視認できる | 情報が欠落している |
| F-3 | ラベルバッジがカード左上に表示 | NEW/期間限定等のバッジが配置 | ラベル設定があるのに非表示 |
| F-4 | 開催期間の日付範囲フォーマット | dateRange が正しく表示される | 日付が生のISO形式のまま |
| F-5 | 期間終了後イベントの非表示 | isActive() で期限切れをフィルタリング | 終了済みイベントが表示されたまま |
| F-6 | モバイルでタッチスワイプ動作 | 指で滑らかに横スクロール | タッチ操作非対応 |
| F-7 | デスクトップで左右矢印ボタン | クリックでカード単位スクロール | 矢印なし/動作しない |
| F-8 | カードクリックでリンク先遷移 | href先に正しく遷移する | クリックしても何も起きない |
| F-9 | ドットインジケーター連動 | アクティブスライドを示す | ドットが常に同じ色 |
| F-10 | 自動スクロールのループ | 最後まで行ったら先頭に戻る | 最後で止まる/ループしない |
| F-11 | セクションヘッダー3段構成 | 英字ラベル+H2+サブテキスト | パターン不一致 |
| F-12 | Framer Motion whileInView + stagger | カードが順次フェードイン | アニメーションなし |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 最新情報が最初に見える | 最も旬のイベント/キャンペーンが先頭カード | 1枚目が最新or最重要 | 10点 |
| U-2 | 期限の視認性 | 開催期間が一目でわかる | 日付範囲がカード内に明記 | 8点 |
| U-3 | タップでアクションに遷移できる | カードタップ→詳細/予約ページ | 1タップで目的地到達 | 8点 |
| U-4 | ラベルの情報伝達力 | 「受付中」「残りわずか」等で状況把握 | ラベルで行動判断可能 | 6点 |
| U-5 | 場所情報の有無 | イベント会場がカード内に記載 | 場所+アイコンで表示 | 4点 |
| U-6 | スワイプ操作の発見性 | チラ見せで横スクロール可能と気づく | モバイル1枚+チラ見せ | 4点 |

### Layer 3: 価値チェック（興味を持つか）— 30点

この機能の核「『今やってるキャンペーン/イベント』に気づいて興味を持つ」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「今だけ」「限定」の緊急性が伝わる | 期間限定感が視覚的に伝わる | 「期間限定」バッジ+日付+「先着20組」 | 日付はあるがバッジなし | 期限情報なし |
| V-2 | 参加/購入したくなる | コンテンツが行動を促す | 「来場特典プレゼント」+予約導線 | イベント内容はわかるが特典なし | タイトルだけで魅力不明 |
| V-3 | 鮮度が保たれている | 現在開催中or近日のイベントのみ | 今週末のイベントが表示 | 来月のイベント（許容範囲） | 半年前の終了イベント |
| V-4 | ビジュアルが目を引く | 写真/画像でイベントの雰囲気が伝わる | 高品質な写真+魅力的な構図 | グラデーションプレースホルダ | グレーの四角のみ |
| V-5 | 業種に合ったラベル戦略 | 業種固有のラベルで効果的に訴求 | 建築→「受付中」/飲食→「季節限定」 | 汎用ラベル「NEW」のみ | ラベルなし |
| V-6 | 複数イベントのバリエーション | 見学会・フェア・特集等の多様なコンテンツ | 3種類以上の異なるイベント | 1種類のイベントのみ | 内容が同じカードの重複 |

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
**90点の実装:** カルーセルに今週末の完成見学会+来月のフェア+特集記事。各カードにバッジ+日付+場所+写真。期限切れは自動非表示。タップで詳細/予約に直結。
**80点の実装:** カルーセル動作・自動スクロール・ラベル全て機能するが、ビジュアルがプレースホルダで印象が弱い。イベント内容は伝わる。
**70点の実装:** スライダーは動くが、期限切れイベントが残っている。ラベルなし。タップしても詳細ページがない。

### この機能固有の重要判定ポイント
- **鮮度管理**: 期限切れイベントが残るとサイト全体の印象悪化。isActive() 必須
- **ビジュアル品質**: ピックアップは「目を引く」が最重要。写真の質とカードサイズのバランス
- **更新頻度**: 月1〜2回の更新が理想。3ヶ月以上同じ内容はマイナス評価
- **業種別ラベル**: 飲食→「季節限定」、美容→「初回限定」、教育→「定員間近」
