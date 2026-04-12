# レビュー/評価
> ID: 32 | カテゴリ: function | プラン: middle

## 概要
顧客からのレビューと星評価（1〜5）をカード形式で表示する機能。平均評価サマリー、ソート機能（新しい順/評価高い順/評価低い順）を備える。フロントエンドでは閲覧のみ（投稿機能なし、管理者がデータとして登録）。業種を問わず、顧客の信頼性を高め、検討中の訪問者の意思決定を後押しする社会的証明（ソーシャルプルーフ）として機能する。

## この機能の核
「みんなの評価が高い」と安心する

## 必須要件
- 星評価表示: 1〜5の星アイコン（塗り/空/半分塗り対応）
- レビューカード: 投稿者名、星評価、日付、コメントテキスト、カテゴリを表示
- 平均評価サマリー: 全体平均（小数点1桁）+ 星ビジュアル + レビュー総数
- 評価分布グラフ: 星5〜星1ごとの件数を横棒グラフで表示
- ソート機能: 新しい順 / 評価高い順 / 評価低い順
- 読み取り専用: ユーザーからの投稿UIは不要（管理者登録データの表示のみ）
- レビューカードのフェードインアニメーション（Framer Motion whileInView）

## 業種別バリエーション
| 業種 | カテゴリラベル | レビュー特有の情報 |
|---|---|---|
| 建築・建設 | 新築 / リフォーム / 外構 / 内装 | 施工エリア、物件タイプ |
| 飲食 | ランチ / ディナー / テイクアウト | 来店日、利用人数 |
| 美容・サロン | カット / カラー / トリートメント | 担当スタイリスト |
| 医療 | 内科 / 外科 / 歯科 / 美容 | 診療科目 |
| 小売・EC | 商品A / 商品B / 配送 | 購入商品、配送品質 |
| 教育・スクール | コースA / コースB / 講師 | 受講コース、期間 |

## 既存テンプレートとの接続
### warm-craft-pro
- **関連セクション**: `TestimonialsSection`（342行目〜）— お客様の声として星評価 + 引用テキストを表示
- **データ構造**: `TESTIMONIALS` 配列（name, project, text, rating）
- **星表示**: `rating: 5` → `Star` アイコン fill 表示
- **配色**: 星 `text-[#FBBF24]`（amber-400）、引用符 `text-[#7BA23F]/10`

### trust-navy-pro
- **関連セクション**: `TestimonialsSection` — 同様に星評価 + テキスト
- **配色**: 星 `text-[#FBBF24]`、引用符 `text-[#C8A96E]`

### clean-arch-pro
- **関連セクション**: 星評価なしの client voice 形式（引用テキストのみ）
- ReviewRatingとして拡張する場合は星評価とソートを追加

### 共通実装パターン
```
Page Component
  └── <ReviewSection />
      ├── 平均評価サマリー（平均 + 分布グラフ）
      ├── ソートボタン（newest / highest / lowest）
      └── レビューカードグリッド
          └── motion.div カード（whileInView fade-in + stagger）
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
└── ReviewSection コンポーネント

※ 分割する場合:
src/components/portfolio-templates/{template-id}/
├── ReviewSection.tsx
├── ReviewSummary.tsx
├── ReviewCard.tsx
├── StarRating.tsx
└── RatingDistribution.tsx
```

### Props / データ構造
```typescript
interface Review {
  id: string;
  authorName: string;
  rating: number;          // 1.0 - 5.0 (0.5 step)
  date: string;            // "2026-03-15"
  comment: string;
  category: string;        // industry-specific label
  subcategory?: string;
  location?: string;
  reply?: {
    text: string;
    date: string;
  };
}

interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    star5: number;
    star4: number;
    star3: number;
    star2: number;
    star1: number;
  };
}

interface ReviewSectionProps {
  reviews: Review[];
  sectionTitle: string;
  initialDisplayCount: number;  // default 6
  enableSort: boolean;
  accentColor: string;
  starColor: string;            // default "#FBBF24"
}
```

### 状態管理
```typescript
const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
const [displayCount, setDisplayCount] = useState(6);

const sorted = [...reviews].sort((a, b) => {
  if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
  if (sortBy === "highest") return b.rating - a.rating;
  return a.rating - b.rating;
});

const displayed = sorted.slice(0, displayCount);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | サマリー横並び（平均+分布グラフ）。レビューカード3列グリッド |
| タブレット（768px〜1023px） | サマリー横並び。レビューカード2列グリッド |
| モバイル（〜767px） | サマリー縦積み。レビューカード1列。ソートはセレクトボックス |

## リファレンスコード
```tsx
// 星評価表示コンポーネント
function StarRating({ rating, size = 16, color = "#FBBF24" }: { rating: number; size?: number; color?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-${size / 4} h-${size / 4}`}
          fill={star <= rating ? color : "none"}
          stroke={star <= rating ? color : "#D1D5DB"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// ReviewSection 簡略版
function ReviewSection() {
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
  const [displayCount, setDisplayCount] = useState(6);

  return (
    <section className="py-20 sm:py-28">
      {/* Summary: average + distribution */}
      <div className="flex items-center gap-8 mb-12">
        <div>
          <p className="text-5xl font-bold">{summary.averageRating.toFixed(1)}</p>
          <StarRating rating={summary.averageRating} />
          <p className="text-xs text-gray-500">{summary.totalReviews}件のレビュー</p>
        </div>
        <div className="flex-1">
          {/* Distribution bars: star5 -> star1 */}
        </div>
      </div>

      {/* Sort buttons */}
      <div className="flex gap-2 mb-8">
        {(["newest", "highest", "lowest"] as const).map((s) => (
          <button key={s} onClick={() => setSortBy(s)}
            className={sortBy === s ? "bg-[accent] text-white" : "border text-gray-500"}
          >{s === "newest" ? "新しい順" : s === "highest" ? "高評価順" : "低評価順"}</button>
        ))}
      </div>

      {/* Review cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((review, i) => (
          <motion.div key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <StarRating rating={review.rating} />
            <p className="text-sm">{review.comment}</p>
            <p className="text-xs">{review.authorName} / {review.category}</p>
          </motion.div>
        ))}
      </div>

      {displayCount < reviews.length && (
        <button onClick={() => setDisplayCount((prev) => prev + 6)}>もっと見る</button>
      )}
    </section>
  );
}
```

## 3層チェック

> この機能の核: **「みんなの評価が高い」と安心する**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 星評価表示（1〜5） | 塗り/空/半分塗りが正しくレンダリングされる | 星が表示されない/全て同じ色 |
| F-2 | 平均評価計算・表示 | 小数点1桁で正確に計算され大きく表示される | 平均値が間違っている/表示されない |
| F-3 | 評価分布グラフ | 星5〜星1の件数が横棒グラフで正しく反映 | 分布が実データと一致しない |
| F-4 | レビューカード表示 | 投稿者名・評価・日付・コメント・カテゴリが表示 | 必須フィールドが欠落 |
| F-5 | ソート機能 | 新しい順/評価高い順/評価低い順が正しく動作 | ソートしても順番が変わらない |
| F-6 | 「もっと見る」ボタン | クリックで追加レビューが表示される | ボタンなし/クリックしても反応なし |
| F-7 | フェードインアニメーション | whileInView+staggerでカードが順に表示 | アニメーションなし/全カード同時出現 |
| F-8 | カテゴリバッジ | カテゴリラベルが視覚的に区別できる | バッジなし/全カテゴリ同じ見た目 |
| F-9 | 0件時の空状態 | レビュー0件時にメッセージが表示される | 空白セクション/エラー表示 |
| F-10 | レスポンシブ対応 | モバイルで1列、タブレットで2列、PCで3列 | モバイルで3列のまま潰れる |
| F-11 | 管理者返信表示 | 返信がある場合にレビュー下に返信テキスト表示 | 返信データがあるのに表示されない |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 平均評価の即時把握 | セクション到達1秒以内に平均点と件数がわかる | 数字+星+件数が一目で見える | 10点 |
| U-2 | レビューの読みやすさ | コメントが適切な長さで表示され、読みやすい | 行間1.5以上、フォント14px以上 | 10点 |
| U-3 | ソート操作の容易さ | ボタン1タップで並び替え完了 | アクティブ状態が明確にわかる | 8点 |
| U-4 | 分布グラフの直感性 | 棒グラフの長さだけで評価の偏りがわかる | ラベル+件数+バー表示 | 6点 |
| U-5 | 追加読み込みのスムーズさ | 「もっと見る」の読み込みが0.5秒以内 | ローディング表示あり | 4点 |
| U-6 | カテゴリの識別性 | バッジの色分けでカテゴリが瞬時に判別 | 3色以上の差別化 | 2点 |

### Layer 3: 価値チェック（安心して依頼できるか）— 30点

この機能の核「みんなの評価が高いと安心する」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「高評価だから安心」と感じる | 平均点+件数+分布が信頼感を醸成 | 4.8(127件)+分布グラフ+顔写真 | 4.8の表示のみ | 平均点なし/件数なし |
| V-2 | レビューが本物っぽい | 具体的な体験が書かれている | 「リフォーム後、冬の光熱費が2万円下がった」 | 「良かったです」 | 全レビューが星5で同じ文面 |
| V-3 | 低評価への誠実な対応 | 低評価にも管理者返信がある | 「ご指摘ありがとうございます。改善しました」 | 低評価を隠さず表示 | 星5のみ表示/低評価を非表示 |
| V-4 | 自分と同じ状況の人がいる | カテゴリ・利用シーンで共感できる | 「新築/世田谷区/30代夫婦」の詳細情報 | カテゴリバッジのみ | 属性情報なし |
| V-5 | 次のアクションにつながる | レビューを読んだ後に問い合わせに進める | レビュー下にCTA「無料相談はこちら」 | セクション下にCTAリンク | レビュー後の導線なし |
| V-6 | 汎用性 | カテゴリラベルの差し替えで全業種対応 | Props1つでカテゴリ・表示項目を変更可能 | コード修正で対応可能 | ハードコードで変更不可 |

## スコアリング

### 合計100点の内訳
| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 11項目全PASSで30点。1つでもFAILなら0点 |
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
- **件数の表示**: 平均点だけでは信頼性が低い。「127件の平均」のように母数を必ず出す
- **低評価の扱い**: 星5だけのレビューは逆に不信感を生む。低評価+誠実な返信が信頼の鍵
- **具体性**: 「良かったです」だけのレビューは価値が低い。施工内容・地域・利用シーンの詳細が重要
