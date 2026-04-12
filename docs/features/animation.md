# スクロールアニメーション
> ID: 36 | カテゴリ: function | プラン: lite

## 概要
スクロール連動でセクションやカードをフェードイン表示させるアニメーションシステム。スタガードリスト、パララックス背景、カウンターアニメーション、ホバーマイクロインタラクションを包括する。`useReducedMotion()` によるアクセシビリティ対応と、will-changeヒント・GPUアクセラレーション限定のパフォーマンス最適化を備える。業種を問わず、写真・実績数値・カード要素の登場演出が訪問者の印象と滞在時間に直結する。

## この機能の核
スクロールが気持ちよくて「ちゃんと作ってある」と感じる

## 必須要件
- スクロールトリガーフェードイン: opacity 0→1 + y 20px→0px。whileInView + viewport once
- スタガードリスト: 子要素にdelay（i * 0.08s）を付与し、順番にフェードイン
- パララックス背景: useScroll + useTransformで背景画像をスクロール連動で移動
- カウンターアニメーション: 数値が0から目標値までカウントアップ（実績数、受賞数等）
- ホバーマイクロインタラクション: カードホバー時のscale + shadow変化
- useReducedMotion(): ユーザーが「視覚効果を減らす」設定の場合、アニメーションを無効化
- パフォーマンス: will-change: transform, opacity のヒント。transform/opacityのみ操作
- Framer Motionベース: motion.div + whileInView + AnimatePresence

## 業種別バリエーション
| 業種 | 主な演出対象 | カウンター数値例 |
|---|---|---|
| 建築・建設 | 施工写真、強み、お客様の声 | 施工実績 500棟、創業 30年、満足度 98% |
| 飲食 | メニュー写真、店内写真 | 累計来店 10万人、メニュー数 50種、創業 15年 |
| 美容・サロン | スタイル写真、スタッフ紹介 | 年間施術 3,000件、スタイリスト 12名 |
| 医療 | 院内写真、設備紹介 | 診察実績 5万件、専門医 8名 |
| 小売 | 商品写真、ブランドストーリー | 取扱商品 1,000点、顧客満足度 95% |
| 教育 | コース紹介、実績 | 卒業生 2,000名、合格率 92% |

## 既存テンプレートとの接続
### warm-craft（全バリアント共通）
- **基本フェードイン**: 全セクションタイトルに `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}`
- **スタガード**: WorksSection のカードに `transition={{ duration: 0.5, delay: i * 0.08 }}`
- **パララックス**: HeroSection で `useScroll + useTransform(scrollYProgress, [0, 1], ["0%", "20%"])`
- **ホバー**: カードに `hover:shadow-xl hover:-translate-y-1 transition-all duration-300`
- **配色依存なし**: アニメーション自体はカラーに依存せず、全テンプレートで同一パターン

### trust-navy（全バリアント共通）
- **基本フェードイン**: 同一パターン
- **スタガード**: ProjectsSection / ServicesSection のカードに delay i * 0.08
- **カウンター**: `STATS` 配列（50年、1,200棟、98%、48名）— Pro版にカウントアップアニメーション

### clean-arch（全バリアント共通）
- **基本フェードイン**: 同一パターン（ただし duration が 0.6 でなく 0.8 等、テンプレートで微調整）
- **パララックス**: Works セクションの背景画像に適用
- **ホバー**: Works カードに `group-hover:scale-105`

### 各テンプレートの実装行（参考）
| テンプレート | フェードイン初出行 | スタガード初出行 | パララックス初出行 |
|---|---|---|---|
| warm-craft | HeroSection | WorksSection grid | HeroSection useScroll |
| trust-navy | HeroSection | ServicesSection | HeroSection useScroll |
| clean-arch | Works label | Works grid | Hero section |

### 共通実装パターン
```
全セクション共通:
  motion.div initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}

グリッド内カード:
  transition={{ duration: 0.5, delay: i * 0.08 }}

Hero パララックス:
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
└── 各セクション内で motion.div を直接使用

※ ユーティリティとして切り出す場合:
src/components/portfolio-templates/{template-id}/
├── FadeInView.tsx
├── StaggerContainer.tsx
├── ParallaxBackground.tsx
├── CounterAnimation.tsx
└── HoverCard.tsx
```

### Props / データ構造
```typescript
interface FadeInViewProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right"; // default "up"
  delay?: number;       // default 0
  duration?: number;    // default 0.6
  once?: boolean;       // default true (viewport once)
}

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;    // default 0.08
  startDelay?: number;      // default 0
}

interface ParallaxBackgroundProps {
  imageUrl: string;
  moveAmount?: string;      // default "20%"
  height?: string;          // default "400px"
  overlayColor?: string;    // default "rgba(0,0,0,0.4)"
}

interface CounterAnimationProps {
  target: number;
  suffix?: string;          // "棟" | "件" | "年" | "%"
  prefix?: string;          // "¥" | "約"
  duration?: number;        // default 2000ms
  decimals?: number;        // default 0
}

interface HoverCardProps {
  children: React.ReactNode;
  scale?: number;           // default 1.02
  shadow?: string;          // default "0 10px 30px rgba(0,0,0,0.12)"
  yOffset?: number;         // default -4
}
```

### 状態管理
```typescript
// カウンターアニメーション
const [count, setCount] = useState(0);
const ref = useRef<HTMLDivElement>(null);
const isInView = useInView(ref, { once: true });

useEffect(() => {
  if (!isInView) return;
  const duration = 2000;
  const start = performance.now();
  const animate = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOut cubic
    setCount(Math.floor(eased * target));
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}, [isInView, target]);

// パララックス
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

// reduced-motion
const prefersReducedMotion = useReducedMotion();
const fadeInProps = prefersReducedMotion
  ? { initial: { opacity: 1, y: 0 } }
  : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } };
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | 全アニメーション有効。パララックス移動量20%。ホバーエフェクト有効 |
| タブレット（768px〜1023px） | 全アニメーション有効。パララックス移動量15% |
| モバイル（〜767px） | フェードイン有効。パララックス移動量10%またはオフ。ホバー非表示 |

## リファレンスコード
```tsx
// 全テンプレートで使用されている基本パターン

// 1. セクションタイトル フェードイン
<motion.div
  className="text-center mb-12"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <p className="text-xs tracking-[0.3em] mb-2">WORKS</p>
  <h2 className="font-bold text-2xl sm:text-3xl">施工実績</h2>
</motion.div>

// 2. グリッドカード スタガード
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: i * 0.08 }}
    className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  />
))}

// 3. Hero パララックス
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        {/* Background content */}
      </motion.div>
      <motion.div style={{ opacity }}>
        {/* Foreground content */}
      </motion.div>
    </section>
  );
}

// 4. reduced-motion 対応
const prefersReducedMotion = useReducedMotion();
const animation = prefersReducedMotion
  ? { opacity: 1, y: 0 }
  : { opacity: 0, y: 20 };
```

## 3層チェック

> この機能の核: **スクロールが気持ちよくて「ちゃんと作ってある」と感じる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | スクロールフェードイン | 画面内に入った時にopacity 0→1 + y 20→0で表示 | アニメーションなし/全要素が一瞬で表示 |
| F-2 | スタガードリスト | 子要素がdelay i*0.08sで順番にフェードイン | 全要素が同時に出現 |
| F-3 | パララックス背景 | useScroll+useTransformでスクロール連動移動 | 背景が静止/ガタつく |
| F-4 | カウンターアニメーション | 画面内到達で0→目標値までカウントアップ | 最初から最終値/カウントしない |
| F-5 | ホバーマイクロインタラクション | カードホバーでscale+shadow変化 | ホバーで何も変化しない |
| F-6 | reduced-motion対応 | `useReducedMotion()`有効時にアニメーション無効化 | 設定を無視して強制再生 |
| F-7 | viewport once: true | 同一要素のアニメーションが再トリガーされない | 行き来するたびに再生 |
| F-8 | transform/opacityのみ | layout shiftが発生しない（GPUアクセラレーション） | width/heightをアニメーション |
| F-9 | モバイル60fps | モバイルでスクロールがカクつかない | フレームドロップでカクカク |
| F-10 | パララックスモバイル軽減 | 移動量が10%以下またはオフ | PC同様の20%移動で重い |
| F-11 | カウンターeaseOut | 減速が自然に見える（easeOut cubic） | 線形カウント/急停止 |
| F-12 | アニメーション量の節度 | 過剰な演出がない（バウンス・回転等の乱用なし） | 全要素がバウンスして安っぽい |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 「心地よい」と感じる | アニメーションが邪魔でなく自然な演出 | フェードインが0.5〜0.8秒で上品 | 10点 |
| U-2 | 初回表示速度への影響なし | アニメーションがLCP/FIDに悪影響を与えない | Lighthouse Performance 90点以上 | 10点 |
| U-3 | スクロール操作の妨げなし | アニメーション中もスクロールが自由 | スクロールロック・ジャンクなし | 8点 |
| U-4 | カウンターの視認性 | 数値が大きく読みやすく表示される | 数字+単位が明確 | 6点 |
| U-5 | ホバーのクリッカブル示唆 | ホバー変化でクリック可能だとわかる | scale+shadow+cursor変化 | 4点 |
| U-6 | 2回目以降の快適さ | 再訪問時にアニメーション再生されない | once: trueで初回のみ | 2点 |

### Layer 3: 価値チェック（「プロが作った」と感じるか）— 30点

この機能の核「スクロールが気持ちよくて『ちゃんと作ってある』と感じる」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「プロが作った」印象 | アニメーションが洗練された印象を与える | セクションごとに適切な演出+統一感 | フェードインはあるが変化が少ない | アニメーションなし/安っぽい |
| V-2 | 安っぽさの排除 | バウンス・過剰な回転・虹色変化がない | 上品なフェードイン+パララックスのみ | フェードイン+一部過剰なスケール | バウンス連発/全要素が踊る |
| V-3 | 数値のインパクト | カウントアップが実績の説得力を高める | 「500棟」がゼロからカウント+大きな数字 | カウントアップはあるが小さく地味 | 最初から最終値/カウンターなし |
| V-4 | パララックスの奥行き | ヒーローに視差効果で空間の深みがある | 背景と前景の差で映画のような奥行き | パララックスあるが控えめ | 静止画像で動きなし |
| V-5 | アクセシビリティ配慮 | reduced-motion対応が完璧 | 設定ONで全アニメーション即座に無効化 | 一部アニメーションのみ無効化 | reduced-motion完全無視 |
| V-6 | 汎用性 | カウンター数値・カテゴリの差し替えで全業種対応 | Props差し替えで演出パターン変更可能 | コード修正で対応可能 | ハードコードで変更不可 |

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

### この機能固有の重要判定ポイント
- **節度が命**: アニメーションは「少なすぎて味気ない」と「多すぎて安っぽい」の間が正解
- **パフォーマンス**: transform/opacityのみ。widthやheightをアニメーションした瞬間60fpsが崩壊する
- **reduced-motion**: アクセシビリティ対応は機能要件。対応なしは即FAIL
