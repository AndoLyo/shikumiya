# テクノロジー/技術力/こだわり
> ID: technology-section | カテゴリ: section | プラン: middle

## 概要
企業の技術力・品質管理体制・こだわりポイントを数値データやアイコン付きカードで訴求するセクション。業種を問わず、「なぜこの会社を選ぶべきか」の技術的・品質的裏付けを視覚的に伝える。数値データのカウントアップアニメーションで訴求力を高める。warm-craft の StrengthsSection とは別物（StrengthsSection は定性的な強み訴求、TechnologySection は定量的な技術・数値訴求）。

## この機能の核
「ここは他と何が違うのか」が具体的な数字で伝わる。

## 必須要件
- アイコンまたは写真付きのカードレイアウト
- 技術項目ごとに数値データ（数字 + 単位）を大きく表示
- 数値部分はカウントアップアニメーション（whileInView トリガー）
- 最低3項目、最大6項目
- 各項目に補足説明テキスト（2〜3行）
- prefers-reduced-motion 対応（カウントアップを即座に最終値表示）
- 2カラムレイアウト（左画像 + 右リスト）またはカードグリッドに対応

## 業種別バリエーション

| 業種 | セクション名 | 指標例 | 数値例 |
|---|---|---|---|
| **建築** | 技術力 | 耐震等級, UA値, C値, ZEH対応率 | 等級3, 0.46 W/m2K以下, 0.5以下, 87% |
| **小売** | 品質へのこだわり | 検品合格率, 産地直送率, リピート率, 取扱ブランド数 | 99.8%, 80%, 92%, 200+ |
| **飲食** | 食材へのこだわり | 契約農家数, 有機野菜使用率, 手作り率, 鮮度管理温度 | 30軒, 95%, 100%, -2℃以下 |
| **美容** | 技術力 | 施術実績数, 研修時間/年, 使用機材導入数, リピート率 | 10,000件+, 200時間, 最新5機種, 89% |
| **医療** | 診療実績 | 年間手術件数, 専門医数, 患者満足度, 設備導入年 | 500件, 8名, 97%, 2024年導入 |
| **教育** | 実績 | 合格率, 受講者数, 満足度, 講師資格保有率 | 95%, 3,000名+, 4.8/5.0, 100% |
| **ホテル** | こだわり | 客室稼働率, 口コミ評価, スタッフ研修時間, 食材地産地消率 | 92%, 4.7/5.0, 100時間+, 80% |

## 既存テンプレートとの接続

### 既存実装の状況
| テンプレート | 関数名 | セクション ID | データ定数 | ステータス |
|---|---|---|---|---|
| warm-craft | `StrengthsSection()` | `#strength` | `STRENGTHS` | 類似あり（定性的な強み。技術数値セクションは未実装） |
| trust-navy | — | — | — | 未実装（新規追加） |
| clean-arch | — | — | — | 未実装（新規追加） |

### 挿入位置

**warm-craft** — StrengthsSection の直後に追加（StrengthsSection は残す）:
```tsx
export default function WarmCraftPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <StrengthsSection />
        <TechnologySection />      {/* ← ここに追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**trust-navy** — ProjectsSection の直後に追加:
```tsx
export default function TrustNavyPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <TechnologySection />      {/* ← ここに追加 */}
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
        <TechnologySection />      {/* ← ここに追加 */}
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
| warm-craft | `{ label: "技術力", href: "#technology" }` — 「私たちの強み」の後 |
| trust-navy | `{ label: "技術力", href: "#technology" }` — 「施工実績」の後 |
| clean-arch | `["TECHNOLOGY", "#technology"]` — 「WORKS」の後 |

### カラーの合わせ方
| テンプレート | アクセント | テキスト | 背景 | 数値色 | カード背景 |
|---|---|---|---|---|---|
| warm-craft | `#7BA23F` | `#3D3226` | `white` | `#7BA23F` | `#FAF7F2` + border `#E8DFD3` |
| trust-navy | `#C8A96E` | `#1B3A5C` | `#F0F4F8` | `#C8A96E` | `white` + border `gray-200` |
| clean-arch | `gray-400` | `gray-800` | `#EDEBE5` | `gray-800` | `white` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function TechnologySection() { ... }
```

### データ定数（英語プロパティ名）
```typescript
interface TechItem {
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Item title */
  title: string;
  /** Numeric value */
  value: number | string;
  /** Unit (等級, %, W/m2K, etc.) */
  unit: string;
  /** Description (2-3 lines) */
  desc: string;
  /** Prefix before the number ("UA値", "耐震等級", etc.) */
  prefix?: string;
  /** Suffix after the number ("以下", "以上", etc.) */
  suffix?: string;
}

interface TechnologyConfig {
  /** Section title (Japanese) */
  sectionTitle: string;
  /** Subtitle */
  subtitle: string;
  /** Layout mode */
  layout: "image-list" | "card-grid" | "timeline";
  /** Main image path (for image-list mode) */
  mainImage?: string;
  /** Tech items array */
  items: TechItem[];
  /** Enable count-up animation */
  countUp: boolean;
  /** Count-up duration (ms) */
  countUpDuration: number;
}

// Demo data (construction example)
const TECH_ITEMS: TechItem[] = [
  {
    icon: Shield,
    title: "耐震性能",
    value: 3,
    unit: "",
    desc: "全棟で耐震等級3（最高等級）を標準仕様。許容応力度計算による構造計算を実施。",
    prefix: "耐震等級",
  },
  {
    icon: Thermometer,
    title: "断熱性能",
    value: 0.46,
    unit: "W/m2K",
    desc: "HEAT20 G1グレードの断熱性能。高性能断熱材+樹脂サッシで快適な室温を維持。",
    prefix: "UA値",
    suffix: "以下",
  },
  {
    icon: Wind,
    title: "気密性能",
    value: 0.5,
    unit: "cm2/m2",
    desc: "全棟で気密測定を実施。隙間のない高気密住宅で計画換気が正しく機能。",
    prefix: "C値",
    suffix: "以下",
  },
  {
    icon: Zap,
    title: "ZEH対応率",
    value: 87,
    unit: "%",
    desc: "2024年度のZEH達成率。太陽光発電+高効率設備で光熱費を大幅削減。",
  },
];
```

### 状態管理
```typescript
const sectionRef = useRef<HTMLDivElement>(null);
const [isInView, setIsInView] = useState(false);
const [counts, setCounts] = useState<number[]>(items.map(() => 0));

// Count-up animation
useEffect(() => {
  if (!isInView || !config.countUp) return;

  items.forEach((item, i) => {
    if (typeof item.value !== "number") return;
    const target = item.value;
    const duration = config.countUpDuration;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      setCounts((prev) => {
        const next = [...prev];
        next[i] = target * eased;
        return next;
      });

      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });
}, [isInView]);

// Intersection Observer for triggering count-up
useEffect(() => {
  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    setCounts(items.map((item) => (typeof item.value === "number" ? item.value : 0)));
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) setIsInView(true);
    },
    { threshold: 0.3 }
  );
  if (sectionRef.current) observer.observe(sectionRef.current);
  return () => observer.disconnect();
}, []);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | 1列縦積み / 画像は上部フル幅 / 数値: text-3xl |
| **タブレット**（640〜1023px） | 2列グリッド（card-grid時） / image-list時は上画像+下リスト |
| **デスクトップ**（1024px〜） | 左画像50%+右リスト50%（image-list時） / 3列グリッド（card-grid時） / 数値: text-5xl |

## リファレンスコード

warm-craft の StrengthsSection のカード構造を参考に、数値表示を追加:
```tsx
{/* Section header — follows existing pattern */}
<motion.div
  className="text-center mb-14"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">TECHNOLOGY</p>
  <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">技術力</h2>
  <p className="text-[#8B7D6B] text-sm">数字が証明する、確かな品質。</p>
</motion.div>

{/* Card grid with count-up numbers */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={sectionRef}>
  {items.map((item, i) => {
    const Icon = item.icon;
    return (
      <motion.div
        key={i}
        className="p-7 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3]
                   hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
      >
        <div className="w-12 h-12 rounded-xl bg-[#7BA23F]/10 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-[#7BA23F]" strokeWidth={1.5} />
        </div>
        <p className="text-[#8B7D6B] text-xs mb-1">{item.title}</p>
        <div className="flex items-baseline gap-1 mb-3">
          {item.prefix && <span className="text-[#3D3226] text-sm">{item.prefix}</span>}
          <span className="text-[#7BA23F] font-bold text-4xl lg:text-5xl tabular-nums">
            {typeof item.value === "number"
              ? Number.isInteger(item.value)
                ? Math.round(counts[i])
                : counts[i].toFixed(2)
              : item.value}
          </span>
          <span className="text-[#8B7D6B] text-sm">{item.unit}</span>
          {item.suffix && <span className="text-[#3D3226] text-sm">{item.suffix}</span>}
        </div>
        <p className="text-[#8B7D6B] text-sm leading-[1.9]">{item.desc}</p>
      </motion.div>
    );
  })}
</div>
```

## 3層チェック

> この機能の核: **「ここは他と何が違うのか」が具体的な数字で伝わる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 技術項目が3〜6つ正しく表示 | 各項目がカード/リスト形式で表示される | 項目が0件/7件以上で多すぎ |
| F-2 | 各項目にアイコン・タイトル・数値・単位・説明 | 5要素全てが視認できる | 数値なし/説明なし |
| F-3 | カウントアップがスクロールで発火 | IntersectionObserver でビューポート内進入時に開始 | ページ読み込み直後に発火/発火しない |
| F-4 | カウントアップが1回のみ | isInView を一度だけtrueにして再発火しない | スクロールのたびに再実行 |
| F-5 | 数値の小数点・桁区切りが正確 | toFixed(2) や Math.round で適切にフォーマット | 0.4600000001 のような浮動小数点誤差 |
| F-6 | prefers-reduced-motion 対応 | カウントアップなしで即座に最終値表示 | アクセシビリティ設定を無視 |
| F-7 | prefix/suffix が正しく表示 | 「耐震等級3」「UA値0.46W/m2K以下」 | prefix/suffix が欠落 |
| F-8 | モバイルで縦積みレイアウト | 1列で視認性確保 | PC用グリッドのまま縮小 |
| F-9 | Framer Motion whileInView + stagger | カードが順次フェードイン | アニメーションなし |
| F-10 | セクションヘッダー3段構成 | 英字ラベル+H2+サブテキスト | パターン不一致 |
| F-11 | テンプレートのカラーパレット準拠 | アクセント・テキスト・背景色が統一 | カラーが既存テンプレートと不一致 |
| F-12 | 数値部分に tabular-nums 適用 | 桁が揃って表示される | 数字の幅がバラバラ |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 数字が目に入る速度 | セクション到達時に数値が即座に視認できる | スキャン5秒以内で全数値把握 | 10点 |
| U-2 | 説明文の読みやすさ | 数値の意味と具体的取り組みが伝わる | 2〜3行以内+具体的な内容 | 8点 |
| U-3 | データ可視化の質 | 数値の大きさが視覚的に伝わる | text-4xl〜5xl+アクセントカラー | 8点 |
| U-4 | カウントアップの視認性 | アニメーション速度が適切で数字が読み取れる | 1〜2秒のduration | 6点 |
| U-5 | 数値の基準説明 | その数字が良い/悪いの判断材料がある | 「HEAT20 G1グレード」等の基準記載 | 4点 |
| U-6 | レスポンシブでの数値サイズ | モバイルでも数字が十分大きい | text-3xl以上 | 4点 |

### Layer 3: 価値チェック（数字で差がわかるか）— 30点

この機能の核「『ここは他と何が違うのか』が具体的な数字で伝わる」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 数字が具体的 | 抽象表現ではなく定量的 | 「耐震等級3」「UA値0.46以下」 | 「高い耐震性能」 | 「多数の実績」 |
| V-2 | 他社との差がわかる | 業界平均や基準との比較が可能 | 「HEAT20 G1グレード」「ZEH達成率87%」 | 数字はあるが基準不明 | 比較不可能な独自指標 |
| V-3 | 信頼できる数字 | 時期・出典が明記されている | 「2024年度のZEH達成率」 | 数字はあるが時期不明 | いつの数字かわからない |
| V-4 | 業種に適した指標 | 業種固有の重要KPIを選定 | 建築→UA値/C値/耐震等級 | 汎用的だが違和感なし | 業種と無関係な指標 |
| V-5 | 説明文が数字の意味を補完 | 数字だけでなく取り組みが伝わる | 「全棟で気密測定を実施」 | 「こだわりの施工」 | 説明なし |
| V-6 | カウントアップが注意を引く | アニメーションで数字への注目度UP | 適切な速度で視線を集める | 動くが印象に残らない | 速すぎて読めない/動かない |

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
**90点の実装:** 4項目の技術指標（耐震等級3/UA値0.46/C値0.5/ZEH率87%）がカウントアップで表示。各項目に業界基準との比較+具体的取り組みの説明。数字の信頼性が高い。
**80点の実装:** カウントアップ動作+数値表示は正しいが、数字の意味（良いのか悪いのか）がわからない。説明文が「高品質な施工」のような抽象表現。
**70点の実装:** 数字は表示されるが、カウントアップが効かない。モバイルで数字が小さすぎ。prefers-reduced-motion非対応。

### この機能固有の重要判定ポイント
- **業種指標の選定**: 建築→性能値（UA値等）、飲食→食材品質、医療→実績数が信頼に直結
- **カウントアップ効果**: 4項目が最適。多すぎると効果が薄れる
- **StrengthsSectionとの棲み分け**: Strengthsは定性的強み、Technologyは定量的指標。両方併用可能
- **数値の信頼性**: 「約」より具体的数値。ただし虚偽は禁止
