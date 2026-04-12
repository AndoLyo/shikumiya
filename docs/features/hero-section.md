# ヒーローセクション
> ID: hero-section | カテゴリ: section | プラン: lite

## 概要

サイト訪問者が最初に目にするフルスクリーンセクション。企業の第一印象を決定づけ、キャッチコピー+サブコピー+CTAボタンで来場予約や資料請求へ誘導する。建築業界の調査では10サイト中6サイトがフルスクリーンスライダーを採用。このセクションが弱いと直帰率が跳ね上がるため、最も投資対効果が高い機能。

## この機能の核

**3秒で「ここは自分に関係ある」と感じてスクロールする。**

訪問者は工務店を探しているお母さん、美容院を探しているOL、飲食店のメニューを見ている会社員かもしれない。彼らが最初の3秒で「ここは自分の問題を解決してくれそうだ」と感じなければ、ブラウザの戻るボタンが押される。キャッチコピーが「誰の」「何を」解決するかを明確に伝え、CTAボタンで次のアクションを示すことが全て。

## 必須要件

- フルスクリーン表示（`h-screen min-h-[600px] max-h-[900px]`）でファーストビューを占有
- キャッチコピー（H1）+ サブコピー（P）を表示
- CTAボタンを1〜2個配置（primary + secondary/outline）
- テキスト可読性確保のためオーバーレイ（グラデーション or 半透明）を適用
- 画像は next/image + priority 属性（LCP対策）
- スクロール誘導インジケーター（SCROLLテキスト + ライン）
- Framer Motion でテキスト順次フェードイン
- パララックス効果（useScroll + useTransform）

## 業種別バリエーション

ヒーローセクションは業種ごとにキャッチコピー・背景・CTAが大きく変わる。以下は各業種のデータ例:

### 建築（工務店・建設会社）
```typescript
const COMPANY = {
  tagline: "家族の暮らしに寄り添う家づくり",
  description: "創業30年、世田谷区を中心に500棟以上の施工実績",
};
// CTA: 「無料相談・お見積り」「施工実績を見る」
// 背景: 施工写真（リビング、外観）
```

### 小売（アパレル・雑貨）
```typescript
const COMPANY = {
  tagline: "毎日をちょっと特別にする暮らしの道具",
  description: "国内外から厳選した生活雑貨をお届けします",
};
// CTA: 「新着アイテムを見る」「オンラインストアへ」
// 背景: 商品のライフスタイル写真
```

### 飲食（レストラン・カフェ）
```typescript
const COMPANY = {
  tagline: "旬の食材を、最高の一皿に",
  description: "地元農家から届く有機野菜と、熟成肉のイタリアン",
};
// CTA: 「本日のメニュー」「席を予約する」
// 背景: 料理写真（シズル感重視）
```

### 美容（美容室・エステ・ネイル）
```typescript
const COMPANY = {
  tagline: "あなたらしさを引き出す、大人のプライベートサロン",
  description: "完全個室・マンツーマン施術で、贅沢なひとときを",
};
// CTA: 「空き状況を確認」「メニュー・料金」
// 背景: サロン内装（清潔感・高級感）
```

### 医療（クリニック・歯科）
```typescript
const COMPANY = {
  tagline: "痛みの少ない治療で、通いやすいクリニックへ",
  description: "平日20時まで・土曜も診療。お子様連れ歓迎",
};
// CTA: 「Web予約」「診療時間・アクセス」
// 背景: 院内写真（清潔感・安心感）
```

### 教育（塾・スクール・習い事）
```typescript
const COMPANY = {
  tagline: "「わかった！」の笑顔を、一人ひとりに",
  description: "少人数制・個別カリキュラムで志望校合格率92%",
};
// CTA: 「無料体験に申し込む」「合格実績を見る」
// 背景: 授業風景（明るい雰囲気）
```

**業種共通の注意点:**
- キャッチコピーは「誰の何を解決するか」を明示する（抽象的な理念は不可）
- CTAラベルは業種の行動に合わせる（建築=相談、飲食=予約、小売=購入）
- 背景写真はその業種のユーザーが「自分ごと」に感じるシーンを選ぶ

## 既存テンプレートとの接続

### 既存実装の状況

3テンプレート全てにHeroSectionが既に存在する。新規追加ではなく**既存の置き換え・拡張**が主なユースケース。

| テンプレート | 現在の実装 | 背景 | CTA |
|---|---|---|---|
| warm-craft | パララックス + SVGイラスト背景 | HeroIllustration() | 「無料相談・お見積り」+「施工実績を見る」 |
| trust-navy | 統計バッジ + グラデーション背景 | SVGグラデーション | 「お問い合わせ」+「施工実績」 |
| clean-arch | ミニマル + テキスト中心 | テキストのみ | 「CONTACT」 |

### 編集時の挿入位置

```
{template-id}/page.tsx 内:
  function HeroSection() { ... }  ← この関数を編集/置換
```

- **COMPANY定数**から `tagline`, `description` を参照してキャッチコピー・サブコピーに使用
- CTAのリンク先は `#contact` と `#works`（既存のセクションIDに合わせる）
- カラーはテンプレートのアクセントカラーを使用:
  - warm-craft: `#7BA23F`（グリーン）
  - trust-navy: `#C8A96E`（ゴールド）
  - clean-arch: グレースケール

### navItemsへの影響

HeroSectionはナビゲーションリンクの対象外（ページトップ = ヒーロー）。navItemsの変更は不要。

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function HeroSection() { ... }  ← モノリシック内の内部関数
```

### データ参照パターン（既存COMPANYから取得）
```typescript
// 既存のCOMPANY定数を参照（新たなinterfaceは不要）
const COMPANY = {
  name: "山田工務店",
  tagline: "家族の暮らしに寄り添う家づくり",    // ← H1に使用
  description: "創業30年、世田谷区を中心に...",  // ← サブコピーに使用
  since: "1996",                                 // ← 実績年数計算に使用
  // ...他プロパティ
};
```

### スライダー拡張時のデータ構造（スライダーモードを追加する場合のみ）
```typescript
interface HeroSlide {
  image: string;       // 画像パス
  alt: string;         // alt属性
  catchcopy: string;   // スライドごとのキャッチコピー
  subcopy?: string;    // サブコピー（任意）
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: "/portfolio/hero_01.webp",
    alt: "世田谷の家 - リビングダイニング",
    catchcopy: "家族の暮らしに寄り添う家づくり",
    subcopy: "創業30年、世田谷区を中心に500棟以上の施工実績",
  },
  // ...3〜5枚が最適（5枚以上は最後まで見られない）
];
```

### 状態管理

**パララックス（現在の実装パターン — コード変更不要の場合）:**
```typescript
const ref = useRef<HTMLElement>(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
```

**スライダー拡張時に追加:**
```typescript
const [currentSlide, setCurrentSlide] = useState(0);
const [isAutoPlaying, setIsAutoPlaying] = useState(true);
const intervalRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (!isAutoPlaying) return;
  intervalRef.current = setInterval(() => {
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  }, 5000);
  return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
}, [isAutoPlaying]);

const handleManualChange = (index: number) => {
  setCurrentSlide(index);
  setIsAutoPlaying(false);
  setTimeout(() => setIsAutoPlaying(true), 10000);
};
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| モバイル（〜639px） | H1: `clamp(1.8rem, 5vw, 3.2rem)` / サブコピー: `text-sm` / CTA: `flex-col`（縦並び）/ スクロール誘導: 非表示 |
| タブレット（640〜1023px） | H1: `text-4xl` / CTA: `flex-row`（横並び）/ スクロール誘導: 表示 |
| デスクトップ（1024px〜） | H1: `clamp` の上限適用 / CTAホバーエフェクト / 左右矢印（スライダー時） |

## リファレンスコード（warm-craft の実装）

以下が現在の品質基準。新規実装・編集時はこのレベル以上を求める:

```tsx
// 背景 + オーバーレイ
<section ref={ref} className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
  <motion.div className="absolute inset-0" style={{ y }}>
    <HeroIllustration />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
  </motion.div>

  // テキスト — justify-end で下部配置
  <motion.div
    className="relative z-10 h-full flex flex-col justify-end max-w-[1200px] mx-auto px-5 pb-20 sm:pb-24"
    style={{ opacity }}
  >
    // バッジ → H1 → サブコピー → CTA の順でdelay付きフェードイン
    <motion.h1
      className="text-white font-bold leading-[1.25] mb-4"
      style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15 }}
    >
      {COMPANY.tagline}
    </motion.h1>

    // CTA — primary（背景色付き）+ secondary（backdrop-blur）
    <a href="#contact" className="px-8 py-3.5 rounded-lg bg-[#7BA23F] text-white font-medium text-sm hover:bg-[#5C7A2E] transition-colors text-center shadow-lg shadow-[#7BA23F]/20">
      無料相談・お見積り
    </a>
  </motion.div>

  // スクロール誘導 — 無限y振動
  <motion.div
    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <span className="text-white/40 text-[10px] tracking-[0.3em]">SCROLL</span>
    <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
  </motion.div>
</section>
```

**注目すべき品質ポイント:**
- `clamp()` による流体タイポグラフィ（固定pxではない）
- `bg-gradient-to-t from-black/60 via-black/20 to-black/10` — 3段階グラデーションでテキスト下部だけ暗くする
- CTA の `shadow-lg shadow-[#7BA23F]/20` — ブランドカラーの影
- `backdrop-blur-sm` + `border border-white/25` — ガラスモーフィズムの secondary CTA
- delay の段階的設定（0 → 0.15 → 0.4 → 0.6）で視線誘導

## 3層チェック

> この機能の核: **3秒で「ここは自分に関係ある」と感じてスクロールする**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | ヒーローが `h-screen min-h-[600px] max-h-[900px]` を占有 | ファーストビュー全体を覆い、min/maxが効いている | 高さ固定で端末によって余白 or はみ出し |
| F-2 | H1に `COMPANY.tagline` が表示され `clamp()` で可変 | モバイル〜デスクトップで文字サイズが流体的に変化 | 固定pxでモバイルではみ出す/PCで小さすぎる |
| F-3 | オーバーレイグラデーション適用 | テキストのコントラスト比 4.5:1 以上を確保 | 写真の上に白文字が溶けて読めない |
| F-4 | CTAボタンが `#contact` or `#works` にリンク | クリックで該当セクションに遷移する | リンク先なし or 404 |
| F-5 | CTA primaryにテンプレートのアクセントカラー使用 | warm-craft=#7BA23F、trust-navy=#C8A96E等 | デフォルトの青ボタンのまま |
| F-6 | Framer Motion で順次フェードイン | delay段階的（0→0.15→0.4→0.6）で視線誘導 | アニメーションなし or 全要素同時に出現 |
| F-7 | パララックス（`useScroll` + `useTransform`）動作 | スクロールに追従して背景がゆっくり移動 | スクロールしても背景が静止/ガタつく |
| F-8 | スクロール誘導が `hidden sm:flex` でモバイル非表示 | モバイルで非表示、PC/タブレットで表示 | モバイルに不要な要素が表示されている |
| F-9 | スライダー時: 自動再生5秒+手動後10秒停止 | 手動操作でタイマーリセット、10秒後に自動再開 | 手動操作中も自動で切り替わり操作を妨害 |
| F-10 | スライダー時: ドットインジケーター連動 | アクティブスライドに対応するドットがハイライト | ドットが常に同じ色/表示されない |
| F-11 | next/image に `priority` 属性付き | LCP最適化のためpriority=trueが設定されている | priority未設定でLCPが2.5秒超え |
| F-12 | `prefers-reduced-motion` 対応 | パララックスとスクロール誘導アニメーションが停止 | アクセシビリティ設定を無視してアニメーション再生 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | キャッチコピーの読解時間 | 「誰の何を解決するか」が瞬時に伝わる | 3秒以内に理解可能 | 10点 |
| U-2 | CTA到達距離 | スクロールせずにCTAが見える | ファーストビュー内（画面下1/3以内） | 10点 |
| U-3 | モバイル片手操作 | CTAが親指の届く範囲にある | 画面下半分に配置 | 8点 |
| U-4 | テキストのコントラスト比 | 背景写真の上でもテキストが明確に読める | WCAG AA基準 4.5:1 以上 | 5点 |
| U-5 | 初期表示速度 | 通信が遅い環境でもキャッチコピーとCTAが先に表示 | 2秒以内にテキスト表示 | 4点 |
| U-6 | スライダー操作性 | スライドの切り替えが直感的 | タッチ/クリック/キーボード全対応 | 3点 |

### Layer 3: 価値チェック（3秒で伝わるか）— 30点

この機能の核「3秒で『ここは自分に関係ある』と感じてスクロールする」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「何の会社か」が瞬時に伝わる | キャッチコピーが業種+提供価値を明示 | 「家族の暮らしに寄り添う家づくり」 | 「確かな技術と信頼」（業種は伝わるが差別化弱い） | 「挑戦と創造」（何の会社か不明） |
| V-2 | CTAが行動を促す | ボタンラベルが具体的アクション | 「無料相談・お見積り」 | 「お問い合わせ」 | 「詳しくはこちら」 |
| V-3 | 他社との差別化が一目でわかる | ビジュアル+コピーで独自性がある | 自社施工写真+「自然素材×耐震等級3」 | ストックフォト+「安心の家づくり」 | 他社と同じテンプレ写真+「お客様第一」 |
| V-4 | ビジュアルインパクト | 業界トップクラスのファーストビュー品質 | 竹中工務店・積水ハウスレベルの格 | きれいだが印象に残らない | 画像が粗い/プレースホルダのまま |
| V-5 | 背景写真と業種の一致 | 訪問者が「自分ごと」に感じるシーン | 工務店→完成したリビングで家族が寛ぐ写真 | 工務店→外観写真（悪くはない） | 工務店→無関係なオフィスビル写真 |
| V-6 | スクロール誘導 | ファーストビュー下部にスクロール促進の仕掛け | SCROLL+ライン+振動アニメーション | 下矢印アイコンのみ | 誘導なし（ユーザーが下を見ない） |

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
**90点の実装:** パララックス背景に自社施工写真、clampタイポグラフィでキャッチコピーが3秒で伝わり、CTAがファーストビュー下部に配置。スクロール誘導でユーザーが自然に下を見る。他社と差別化された世界観。
**80点の実装:** 技術的に全て動作しCTAも見えるが、キャッチコピーが「確かな技術」のような汎用文言。写真もきれいだが独自性に欠ける。
**70点の実装:** フルスクリーン表示でCTAも動くが、キャッチコピーが抽象的で何の会社かわからない。モバイルでCTAが画面外にあり片手で届かない。

### この機能固有の重要判定ポイント
- **LCP速度**: ヒーロー画像はLCPに直結。WebP/AVIF + sizes属性 + priority で2.5秒以内が必須
- **CTA到達率**: ファーストビュー内にCTAがないのは致命的。画面下1/3以内に必ず配置
- **スライド枚数**: 3枚が最適。5枚以上は最後まで見られない傾向があるので減点対象
- **ビジュアルの格**: SVGイラストでも写真でも、「この会社に頼みたい」と思わせる品質が必要
