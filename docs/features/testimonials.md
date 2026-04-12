# お客様の声
> ID: testimonials | カテゴリ: section | プラン: middle

## 概要
お客様のインタビュー・感想・評価を表示するセクション。業種を問わず、実際にサービスを利用した顧客の声は最も強力な購買トリガーとなる。写真+テキスト、星評価、カテゴリ別タブ切り替えに対応し、信頼性の高い社会的証明（Social Proof）を提供する。口コミが少ない新規企業でも、サービス提供後のアンケートを活用して早期にコンテンツ化可能。

## この機能の核
「この会社に頼んで大丈夫」と確信する。

## 必須要件
- お客様の写真（またはイニシャルアバター）+ コメント + 概要情報を表示
- 概要情報: サービス種別、エリア/店舗、利用時期（プライバシーに配慮した粒度）
- カルーセル or カードグリッドで複数のお客様の声を閲覧可能
- 引用符（"）またはクォートアイコンで視覚的に引用であることを示す
- 星評価（5段階）の表示はオプション
- 3〜8件のお客様の声を掲載可能
- 写真がない場合はイニシャルアバター（名前の頭文字）を自動生成

## 業種別バリエーション

| 業種 | セクション名 | 概要情報 | カテゴリ分け例 |
|---|---|---|---|
| **建築** | お客様の声 / 施主の声 | 施工種別, エリア, 家族構成, 竣工年 | 注文住宅, リフォーム, 公共施設 |
| **小売** | 購入者レビュー | 購入商品, 評価, 購入日 | カテゴリ別, 評価別 |
| **飲食** | お客様の声 / 口コミ | 来店日, 注文メニュー, 利用シーン | ランチ, ディナー, コース, テイクアウト |
| **美容** | お客様の声 | 施術内容, 担当者, 来店回数 | カット, カラー, エステ, ヘッドスパ |
| **医療** | 患者様の声 | 診療内容, 通院期間, 年代 | 一般歯科, 矯正, インプラント |
| **教育** | 受講者の声 / 合格体験記 | 受講コース, 受講期間, 成果 | コース別, 目標別 |
| **ホテル** | 宿泊者の声 | 客室タイプ, 宿泊時期, 利用目的 | ビジネス, 記念日, 家族旅行 |

## 既存テンプレートとの接続

### 既存実装の状況
| テンプレート | 関数名 | セクション ID | データ定数 | ステータス |
|---|---|---|---|---|
| warm-craft | — | — | — | 未実装（新規追加） |
| trust-navy | — | — | — | 未実装（新規追加） |
| clean-arch | — | — | — | 未実装（新規追加） |

### 挿入位置

**warm-craft** — AboutSection の直前に追加:
```tsx
export default function WarmCraftPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <StrengthsSection />
        <TestimonialsSection />    {/* ← ここに追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**trust-navy** — AboutSection の直前に追加:
```tsx
export default function TrustNavyPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />    {/* ← ここに追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**clean-arch** — AboutSection の直前に追加:
```tsx
export default function CleanArchPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <TestimonialsSection />    {/* ← ここに追加 */}
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
| warm-craft | `{ label: "お客様の声", href: "#voice" }` — 「私たちの強み」の後 |
| trust-navy | `{ label: "お客様の声", href: "#voice" }` — 「施工実績」の後 |
| clean-arch | `["VOICE", "#voice"]` — 「WORKS」の後 |

### カラーの合わせ方
| テンプレート | アクセント | テキスト | 背景 | 星カラー | カードBG |
|---|---|---|---|---|---|
| warm-craft | `#7BA23F` | `#3D3226` | `white` | `#7BA23F` | `#FAF7F2` + border `#E8DFD3` |
| trust-navy | `#C8A96E` | `#1B3A5C` | `#F0F4F8` | `#C8A96E` | `white` + border `gray-200` |
| clean-arch | `gray-400` | `gray-800` | `#EDEBE5` | `gray-800` | `white` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function TestimonialsSection() { ... }
```

### データ定数（英語プロパティ名）
```typescript
interface Testimonial {
  /** Testimonial ID */
  id: number;
  /** Customer name (initial or anonymous format) */
  name: string;
  /** Customer photo path (optional, generates initial avatar if missing) */
  photo?: string;
  /** Comment body */
  comment: string;
  /** Star rating 1-5 (optional) */
  rating?: number;
  /** Service/project category */
  category: string;
  /** Area / branch name */
  area: string;
  /** Additional info (family, age group, etc.) */
  detail?: string;
  /** Completion year or service date */
  date: string;
  /** Video URL (optional) */
  videoUrl?: string;
}

interface TestimonialsConfig {
  /** Section title (Japanese) */
  sectionTitle: string;
  /** Subtitle */
  subtitle: string;
  /** Display mode */
  displayMode: "carousel" | "tab" | "grid";
  /** Tab definitions (for tab mode) */
  tabs?: Array<{ label: string; filterValue: string }>;
  /** Show star ratings */
  showRating: boolean;
  /** Auto-rotate enabled */
  autoRotate: boolean;
  /** Rotation interval (ms) */
  interval?: number;
}

// Demo data (industry-agnostic)
const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "S様ご家族",
    comment: "最初は不安でしたが、担当者の方が丁寧に説明してくださり、安心して家づくりを進められました。特に断熱性能には大満足。冬でもエアコン1台で家全体が暖かいです。",
    rating: 5,
    category: "注文住宅",
    area: "東京都世田谷区",
    detail: "4人家族（夫婦+子供2人）",
    date: "2024",
  },
  {
    id: 2,
    name: "T様",
    comment: "築25年の自宅を全面リフォームしました。耐震補強も同時にお願いできたのが決め手です。想像以上の仕上がりに感動しています。",
    rating: 5,
    category: "リフォーム",
    area: "神奈川県横浜市",
    detail: "2人家族（夫婦）",
    date: "2024",
  },
  {
    id: 3,
    name: "千代田区 施設管理課",
    comment: "工期通りに完了し、入札時の提案内容を忠実に実現していただきました。技術力に感謝しています。",
    rating: 5,
    category: "公共施設改修",
    area: "東京都千代田区",
    date: "2025",
  },
];
```

### 状態管理
```typescript
const [activeIndex, setActiveIndex] = useState(0);
const [activeTab, setActiveTab] = useState<string | null>(null);

// Carousel auto-rotate
useEffect(() => {
  if (!config.autoRotate) return;
  const timer = setInterval(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, config.interval || 6000);
  return () => clearInterval(timer);
}, [config.autoRotate, testimonials.length]);

// Tab filter
const filteredTestimonials = useMemo(() => {
  if (!activeTab) return testimonials;
  return testimonials.filter((t) => t.category === activeTab);
}, [activeTab, testimonials]);

// Initial avatar generator
const getInitialAvatar = (name: string): string => {
  // Return first character of the name
  return name.charAt(0);
};
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | 1件ずつカード表示 / スワイプ切り替え / 写真: 60px丸型 / コメント: text-sm |
| **タブレット**（640〜1023px） | 1件大きく表示 / 写真+コメント横並び / 矢印ナビゲーション |
| **デスクトップ**（1024px〜） | 1〜2件表示 / 写真: 80px丸型 / コメント: text-base / ホバーで影 |

## リファレンスコード

warm-craft のカードスタイルを基にした testimonial カード:
```tsx
<section id="voice" className="py-20 sm:py-28 bg-white">
  <div className="max-w-[1000px] mx-auto px-5">
    {/* Section header */}
    <motion.div
      className="text-center mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">VOICE</p>
      <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">お客様の声</h2>
      <p className="text-[#8B7D6B] text-sm">実際にご利用いただいたお客様からの声です</p>
    </motion.div>

    {/* Testimonial card */}
    <motion.div
      className="bg-[#FAF7F2] rounded-2xl border border-[#E8DFD3] p-8 sm:p-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Quote icon */}
      <div className="text-[#7BA23F]/20 text-6xl font-serif leading-none mb-4">"</div>

      <div className="flex items-start gap-6">
        {/* Photo or initial avatar */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 overflow-hidden">
          {testimonial.photo ? (
            <img src={testimonial.photo} alt={testimonial.name}
                 className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#7BA23F]/10 flex items-center justify-center">
              <span className="text-[#7BA23F] text-xl font-bold">
                {getInitialAvatar(testimonial.name)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* Comment */}
          <p className="text-[#3D3226] text-sm sm:text-base leading-[2] mb-4">
            {testimonial.comment}
          </p>

          {/* Star rating */}
          {config.showRating && testimonial.rating && (
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${
                  i < testimonial.rating! ? "text-[#7BA23F]" : "text-gray-200"
                }`}>★</span>
              ))}
            </div>
          )}

          {/* Customer info */}
          <div className="flex flex-wrap gap-2 text-[#8B7D6B] text-xs">
            <span>{testimonial.name}</span>
            <span>/</span>
            <span>{testimonial.area}</span>
            <span>/</span>
            <span>{testimonial.category}</span>
            {testimonial.date && (
              <>
                <span>/</span>
                <span>{testimonial.date}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>

    {/* Dot indicators */}
    <div className="flex justify-center gap-2 mt-6">
      {testimonials.map((_, i) => (
        <button
          key={i}
          onClick={() => setActiveIndex(i)}
          className={`w-2 h-2 rounded-full transition-colors ${
            i === activeIndex ? "bg-[#7BA23F]" : "bg-[#E8DFD3]"
          }`}
        />
      ))}
    </div>
  </div>
</section>
```

## 3層チェック

> この機能の核: **「この会社に頼んで大丈夫」と確信する**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | コメントが引用符/クォートアイコン付きで表示 | 視覚的に「引用」であることが示される | 通常テキストと区別不可 |
| F-2 | 名前・カテゴリ・エリア・利用日が表示 | 概要情報4点セットが視認できる | 情報が欠落している |
| F-3 | 写真なし時のイニシャルアバター生成 | 名前の頭文字で丸型アバター表示 | 壊れた画像アイコン/空白 |
| F-4 | 星評価が正しく表示（有効時） | rating値に応じた星の塗りつぶし | 全部5つ星/星が0個 |
| F-5 | カルーセル前後切替（スワイプ+矢印） | 2つの操作方法で切替可能 | 切替不可/1方法のみ |
| F-6 | ドットインジケーター連動 | アクティブインデックスを正しく示す | ドットが常に同じ色 |
| F-7 | タブモードのフィルタリング | カテゴリ別に正しく絞り込み | タブ切替が効かない |
| F-8 | 自動切替（有効時） | 設定間隔でコメントが自動切替 | 自動切替が動かない/速すぎ |
| F-9 | 長文コメントでレイアウト維持 | テキスト量に関わらずカード崩れなし | コメントが枠からはみ出す |
| F-10 | モバイルタッチスワイプ | 指で滑らかに切替 | タッチ操作非対応 |
| F-11 | prefers-reduced-motion 対応 | スライドアニメーション無効化 | アクセシビリティ設定を無視 |
| F-12 | セクションヘッダー3段構成 | 英字ラベル+H2+サブテキスト | パターン不一致 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 実在感の演出 | 写真+具体的な名前+エリアで信頼感 | 写真(orアバター)+名前+エリアの3点セット | 10点 |
| U-2 | 複数の声の閲覧しやすさ | スワイプ/矢印で快適に切替 | 操作説明不要で次の声に到達 | 8点 |
| U-3 | コメント全文の可読性 | 長いコメントも読み切れる | line-clamp不使用or「続きを読む」あり | 8点 |
| U-4 | カテゴリ別の絞り込み | 自分に関係ある声を探しやすい | タブで2クリック以内に到達 | 6点 |
| U-5 | 問い合わせ導線 | 声を読んだ後のCTAが近くにある | セクション内or直下にCTA | 4点 |
| U-6 | 星評価の視認性 | 満足度が瞬時にわかる | 星5段階+アクセントカラー | 4点 |

### Layer 3: 価値チェック（信頼できるか）— 30点

この機能の核「『この会社に頼んで大丈夫』と確信する」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「自分と似た人が満足してる」 | 訪問者が自分の状況と重ねられる | 「S様ご家族/世田谷区/注文住宅/4人家族」 | 「S様/東京都/注文住宅」 | 「お客様A」 |
| V-2 | コメントが具体的 | 何に満足したかが明確 | 「断熱性能に大満足。冬でもエアコン1台」 | 「良い家ができました」 | 「満足です」 |
| V-3 | 件数が十分 | 複数の声で信頼性を担保 | 5〜6件+多様なカテゴリ | 3件（最低ライン） | 1件のみ |
| V-4 | 星評価の信頼感 | 全5つ星でなく現実的な評価 | 5,5,4,5,5（4が混ざるとリアル） | 全5つ星（許容だが作り物感） | 星評価なし |
| V-5 | 写真の説得力 | 人物写真orリアルなアバター | 実際の写真+笑顔 | イニシャルアバター（最低限OK） | 壊れた画像/空白 |
| V-6 | 業種固有の信頼ポイント | 業種が重視する情報が含まれる | 建築→竣工年+家族構成、医療→通院期間 | カテゴリとエリアのみ | 業種関連情報なし |

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
**90点の実装:** 5件の声がカルーセルで表示。各声に写真+名前+エリア+カテゴリ+具体的コメント。星評価4〜5でリアル感。タブで注文住宅/リフォーム切替。セクション下部にCTA。
**80点の実装:** カルーセル動作・星評価・イニシャルアバター全て機能するが、コメントが「良かった」レベルで具体性に欠ける。件数は3件。
**70点の実装:** コメントは表示されるが、スワイプが効かない。名前が「お客様A」で信用できない。写真なし+アバターも壊れている。

### この機能固有の重要判定ポイント
- **信頼性**: 「S様ご家族」+具体エリア+カテゴリの組み合わせ。「お客様A」は逆効果
- **コメントの質**: 具体的なポイント（「断熱性能」「工期通り」）がある方が説得力が高い
- **件数**: 最低3件。10件以上はカルーセルで回しきれないためベスト5〜6件を厳選
- **業種別信頼ポイント**: 医療→通院期間+改善具体性、美容→ビフォーアフター、教育→成果数値
