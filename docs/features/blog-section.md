# ブログ/コラム
> ID: blog-section | カテゴリ: section | プラン: middle

## 概要

企業ブログやコラム記事をサムネイル付きリスト形式で表示するセクション。定期更新によりサイトの鮮度を維持し、検索流入を増やす。トップページにはカード形式で最新記事を表示し、一覧ページ・記事詳細ページへ遷移する構成。業種を問わず、専門知識の発信・施工事例の共有・スタッフの人柄発信等のコンテンツが集客とSEOの両面で効果を発揮する。トップページのセクション（最新3〜6件）+ 記事一覧サブページ + 記事詳細サブページの3層構成。

## この機能の核
「この会社は専門知識がある」と感じる。

## 必須要件

- 記事カードに サムネイル画像 + カテゴリタグ + 公開日 + タイトル + 抜粋テキストを表示
- カテゴリフィルター機能
- ページネーション（「前へ / 次へ」+ ページ番号）または「もっと読む」ボタン
- トップページ: 最新3〜6件のカード表示 + 「記事一覧を見る」リンク
- 記事詳細ページ: リッチテキストコンテンツ（見出し・段落・画像・リスト・引用）
- 関連記事表示（記事詳細ページ下部に2〜3件）

## 業種別バリエーション

| 業種 | カテゴリ例 | 記事コンテンツ例 |
|---|---|---|
| **建築・建設** | 施工事例 / お役立ち情報 / スタッフブログ | 現場レポート、完成事例、住まいのコラム、建築基準法解説 |
| **小売・EC** | 新商品 / スタッフブログ / お知らせ | 新商品紹介、スタッフおすすめ、セール情報 |
| **飲食** | レシピ / 食材紹介 / お知らせ | 季節のレシピ、産地レポート、メニュー改定 |
| **美容・サロン** | スタイル紹介 / ケアコラム / スタッフ紹介 | ヘアスタイルカタログ、自宅ケアのコツ |
| **医療・クリニック** | ���康コラム / 症例紹介 / お知らせ | 病気の予防法、治療の流れ解説 |
| **フォトグラファー** | 撮影日記 / テクニック / 機材レビュー | 撮影レポート、ライティングの基本 |
| **ハンドメイド作家** | 制作日記 / 素材紹介 / イベント | 制作過程、素材のこだわり |
| **士業・コンサル** | コラム / 事例紹介 / セミナー | 法改正解説、事例レポート |

### レイアウト構成
```
── トップページ表示 ──
┌─────────────────────────────────────────────┐
│  BLOG / ブログ                               │
│  英語ラベル(tracking-[0.3em]) → H2 → subtext  │
│                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ 画像    │  │ 画像    │  │ 画像    │     │
│  ├─────────┤  ├─────────┤  ├─────────┤     │
│  │カテゴリ  │  │カテゴリ  │  │カテゴリ  │     │
│  │2025.04.01│  │2025.03.28│  │2025.03.20│     │
│  │タイトル  │  │タイトル  │  │タイトル  │     │
│  │抜粋…   │  │抜粋…   │  │抜粋…   │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                              │
│                  [ 記事一覧を見る → ]          │
└────────────────────────────────────────────��┘

── 一覧ページ（サブページ） ──
┌───────────────────────┬──────────┐
│ 記事カード x 12         │ カテゴリ │
│                         │ 人気記事 │
│                         │ アーカイブ│
│ [← 前] 1 2 3 ... [次 →] │          │
└───────────────────────┴──────────┘
```

## 既存テンプレートとの接続

### 既存実装の状況

3テンプレート全てにBlogSectionは**存在しない**。トップページにセクションを新規追加し、サブページ（一覧・詳細）も新規作成する。

| テンプレート | 現在の構成 | 挿入位置（トップページ） |
|---|---|---|
| warm-craft | Hero → Works → Strengths → About → Contact | About と Contact の間 |
| trust-navy | Hero → Services → Projects → About → Contact | About と Contact の間 |
| clean-arch | Hero → Works → About → Contact | About と Contact の間 |

### 挿入手順

```tsx
// 1. トップページにセクション追加
// warm-craft の場合:
export default function WarmCraftPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <StrengthsSection />
        <AboutSection />
        <BlogSection />        {/* ← 新規追加 */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

// 2. サブページを新規作成
// src/app/portfolio-templates/warm-craft/blog/page.tsx       — 一覧
// src/app/portfolio-templates/warm-craft/blog/[slug]/page.tsx — 詳細
```

### navItemsへの影響

ブログセクションを追加する場合、navItemsに項目を追加する:

```tsx
// warm-craft:
const navItems = [
  { label: "施工実績", href: "#works" },
  { label: "私たちの強み", href: "#strength" },
  { label: "会社案内", href: "#about" },
  { label: "ブログ", href: "#blog" },     // ← 追加
  { label: "お問い合わせ", href: "#contact" },
];

// trust-navy:
const navItems = [
  { label: "事業内容", href: "#service" },
  { label: "施工実績", href: "#works" },
  { label: "会社概要", href: "#about" },
  { label: "ブログ", href: "#blog" },     // ← 追加
  { label: "お問い合わせ", href: "#contact" },
];

// clean-arch (inline array):
{[["WORKS","#works"],["ABOUT","#about"],["BLOG","#blog"],["CONTACT","#contact"]].map(...)}
```

### セクションヘッダーの適用パターン

```tsx
// warm-craft style
<p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">BLOG</p>
<h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">ブログ</h2>
<p className="text-gray-500 text-sm">お役立ち情報をお届けします。</p>

// trust-navy style
<p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">BLOG</p>
<h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl mb-3">ブログ</h2>
<p className="text-gray-500 text-sm">最新の情報をお届けします。</p>

// clean-arch style
<p className="text-gray-300 text-[10px] tracking-[0.4em] mb-6">BLOG</p>
<h2 className="text-black text-3xl sm:text-4xl font-extralight tracking-wide">Blog</h2>
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function BlogSection() { ... }  // トップページ用

src/app/portfolio-templates/{template-id}/blog/page.tsx        // 一覧ページ
src/app/portfolio-templates/{template-id}/blog/[slug]/page.tsx // 記事詳細ページ
```

### Props / データ構造
```typescript
interface BlogPost {
  /** Unique ID */
  id: number;
  /** URL slug */
  slug: string;
  /** Article title */
  title: string;
  /** Excerpt text (~120 chars) */
  excerpt: string;
  /** Thumbnail image URL */
  thumbnail: string;
  /** Category name */
  category: string;
  /** Publish date (YYYY-MM-DD) */
  publishDate: string;
  /** Author name (optional) */
  author?: string;
  /** Body HTML (article detail page) */
  body?: string;
  /** Tags (optional) */
  tags?: string[];
}

interface BlogSectionConfig {
  /** Section title */
  sectionTitle: string;
  /** Section subtitle */
  subtitle: string;
  /** Number of posts on top page */
  topPageCount: number;
  /** Number of posts per page (list) */
  postsPerPage: number;
  /** Category list */
  categories: string[];
  /** Blog list page URL */
  listUrl: string;
  /** Show sidebar on list page */
  showSidebar: boolean;
  /** Number of related posts */
  relatedPostCount: number;
}

// Demo data — industry-agnostic
const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "useful-guide-2025",
    title: "お役立ちガイド 2025年最新版",
    excerpt: "2025年の最新情報をまとめた包括的なガイドです。初めての方にもわかりやすく解説します。",
    thumbnail: "/blog/guide.webp",
    category: "お役立ち情報",
    publishDate: "2025-04-01",
    author: "編集部",
    tags: ["ガイド", "2025年"],
  },
  {
    id: 2,
    slug: "case-study-report",
    title: "事例レポート — プロジェクト紹介",
    excerpt: "最近完了したプロジェクトの詳細レポートです。過程から完成までをご紹介します。",
    thumbnail: "/blog/case-study.webp",
    category: "事例紹介",
    publishDate: "2025-03-28",
  },
  {
    id: 3,
    slug: "staff-blog-spring",
    title: "スタッフブログ — 春の近況報告",
    excerpt: "スタッフの日常やちょっとした豆知識をお届けします。",
    thumbnail: "/blog/staff.webp",
    category: "スタッフブログ",
    publishDate: "2025-03-20",
  },
];
```

### 状態管理
```typescript
// Top page: stateless (just render latest N posts)

// List page:
const [activeCategory, setActiveCategory] = useState<string>('すべて');
const [currentPage, setCurrentPage] = useState(1);
const [searchQuery, setSearchQuery] = useState('');

const filteredPosts = useMemo(() => {
  let result = posts;
  if (activeCategory !== 'すべて') {
    result = result.filter(p => p.category === activeCategory);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }
  return result;
}, [activeCategory, searchQuery, posts]);

const totalPages = Math.ceil(filteredPosts.length / config.postsPerPage);
const paginatedPosts = filteredPosts.slice(
  (currentPage - 1) * config.postsPerPage,
  currentPage * config.postsPerPage
);
```

## リファレンスコード（warm-craft スタイルのトップページセクション）

```tsx
function BlogSection() {
  const posts = DEMO_BLOG_POSTS.slice(0, 3); // Latest 3

  return (
    <section id="blog" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1000px] mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">BLOG</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">ブログ</h2>
          <p className="text-gray-500 text-sm">お役立ち情報をお届けします。</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={`/portfolio-templates/warm-craft/blog/${post.slug}`}
              className="group block bg-[#FAF7F2] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] bg-[#E8DFD3] overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-[#E8DFD3] to-[#D4CFC5] group-hover:scale-105 transition-transform duration-500" />
              </div>
              {/* Text */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-[#7BA23F]/10 text-[#7BA23F] px-2 py-0.5 rounded font-medium">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-gray-400">{post.publishDate.replace(/-/g, '.')}</span>
                </div>
                <h3 className="text-[#3D3226] font-medium text-sm leading-relaxed mb-1 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2">{post.excerpt}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/portfolio-templates/warm-craft/blog"
            className="inline-flex items-center gap-2 text-[#7BA23F] text-sm font-medium hover:underline"
          >
            記事一覧を見る →
          </a>
        </div>
      </div>
    </section>
  );
}
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | トップ: 1列カード / 一覧: 1列 + サイドバー非表示 / 詳細: フル幅本文 / ページネーション: 簡略（前/次のみ） |
| **タブレット**（640〜1023px） | トップ: 2列カード / 一覧: 2列 + サイドバー非表示 / 詳細: 80%幅中央 |
| **デスクトップ**（1024px〜） | トップ: 3列カード / 一覧: 3列 + サイドバー右 / 詳細: 70%本文 + 30%サイドバー |

## 3層チェック

> この機能の核: **「この会社は専門知識がある」と感じる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | トップページカード表示 | 最新3〜6件のカードが正しく表示されている | カードが0件。レイアウトが崩れている |
| F-2 | カード要素 | 各カードにサムネイル・カテゴリタグ・公開日・タイトル・抜粋が含まれている | タイトルしかない。サムネイルが表示されない |
| F-3 | カテゴリフィルター | カテゴリ選択で正しく記事が絞り込まれる | フィルターが効かない。空の結果でエラーになる |
| F-4 | 一覧ページ遷移 | 「記事一覧を見る」リンクが一覧ページへ正しく遷移する | リンク切れ。404エラー |
| F-5 | ページネーション | ページ切り替えが正しく動作し表示件数が適切 | ページ番号をクリックしても変わらない。件数が不正確 |
| F-6 | 記事詳細ページ | リッチテキストコンテンツ（見出し・段落・画像・リスト・引用）が正しくレンダリングされる | HTML未エスケープ。画像が表示されない。レイアウト崩壊 |
| F-7 | 関連記事表示 | 記事詳細ページ下部に2〜3件の関連記事が表示される | 関連記事セクションがない。表示される記事が0件 |
| F-8 | カードリンク | カードクリックで正しい記事詳細ページへ遷移する | リンク切れ。別の記事が開く |
| F-9 | レスポンシブ | モバイルでサイドバー非表示+メインコンテンツ全幅。デスクトップで3列グリッド | モバイルでサイドバーが残りコンテンツが圧迫される |
| F-10 | セクションヘッダー | English label(tracking-[0.3em]) + H2 + subtextの3段構成 | H2だけ。英語ラベルなし |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、目的の記事を発見・閲覧できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 記事の発見しやすさ | カテゴリフィルターで**目的のジャンルの記事に5秒以内**に辿り着ける | カテゴリ3〜5個。フィルター結果が即座に反映。記事0件時に「記事がありません」表示 | 10点 |
| U-2 | サムネイルの品質 | サムネイルだけで**記事の内容がイメージ**できる | アスペクト比統一（16:10）。placeholder画像でもテンプレートのトーンに合致 | 8点 |
| U-3 | 読み込み速度 | 一覧ページが**3秒以内**にコンテンツ表示される | 画像のlazy loading。ページネーションで1ページあたり12件以下 | 7点 |
| U-4 | 公開日の視認性 | **情報の鮮度が一目**でわかる | `YYYY.MM.DD`形式で統一。カード上で日付が即座に確認可能 | 7点 |
| U-5 | 回遊性 | 記事を読み終わった後に**次の記事を自然に読み始める** | 関連記事2〜3件+一覧へ戻るリンク+カテゴリナビが記事下部に配置 | 8点 |

### Layer 3: 価値チェック（専門知識を感じるか）— 30点

この機能の核「この会社は専門知識がある、と感じる」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 記事タイトルが専門性を感じさせるか | タイトルだけで**「この会社は詳しいんだな」**と思える | 「木造住宅の耐震基準2025年改正まとめ」「外壁塗装の寿命を2倍にする3つの方法」 | 「施工事例レポート」「お役立ち情報」 | 「ブログ更新しました」「こんにちは」 |
| V-2 | 更新頻度が適切か | サイトが**放置されていない印象**を与える | 最新記事が1ヶ月以内。月2〜4記事ペースで更新 | 最新記事が3ヶ月以内 | 最新記事が半年以上前。「2023年」の記事しかない |
| V-3 | 読後に「この会社に頼もう」と思えるか | 記事の内容が**信頼感と専門性**を同時に伝える | 具体的な数字+写真+専門解説で「ここに頼めば安心」と感じる | 情報は正確だが印象に残らない | 内容が薄く「ネットで調べた方が早い」と思われる |
| V-4 | カテゴリが業種に合っているか | カテゴリ分類が**対象業種のユーザーニーズ**に合致 | 建築:「施工事例」「お役立ち情報」「スタッフブログ」の3カテゴリ | カテゴリはあるが粒度が粗い（「ブログ」1カテゴリのみ） | カテゴリなし。または業種と無関係なカテゴリ |
| V-5 | 構造化データでSEO効果があるか | Article schemaが正しく実装され**Google検索のリッチスニペット対象**になる | 記事詳細ページにArticle schema出力。Rich Results Testでエラーなし | JSON-LDは出力されるがテスト未確認 | 構造化データなし |
| V-6 | ホバーエフェクトが「読みたい」を促すか | カードのインタラクションが**クリック意欲**を高める | shadow-lg + サムネイルscale-105で「クリックしたい」感が出る | ホバー時にカーソル変化のみ | ホバーエフェクトなし。クリッカブルに見えない |

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
- カード表示・フィルター・ページネーション・詳細ページ全て動作（L1: 30/30）
- カテゴリ3つで5秒以内に発見。サムネイル高品質。関連記事+一覧リンクで回遊性高い（L2: 35/40）
- 「木造住宅の耐震基準2025年改正まとめ」等の専門タイトル。月3記事更新。Article schema完備（L3: 25/30）

**80点の実装:**
- 基本機能は動作。関連記事の表示ロジックがやや不正確（L1: 30/30）
- カテゴリフィルターあり。サムネイルはplaceholder。ページネーション動作OK（L2: 28/40）
- 記事内容はあるがタイトルが「施工事例レポート」止まり。更新頻度は月1回（L3: 22/30）

**70点の実装:**
- カード表示は動くがページネーションが不安定（L1: 30/30 ギリギリ）
- カテゴリなし。全記事が一列。サムネイルの品質にバラつき（L2: 22/40）
- 最新記事が3ヶ月前。タイトルが「ブログ更新」。Article schemaなし（L3: 18/30）

### この機能固有の重要判定ポイント

1. **更新頻度の印象**: 最新記事が3ヶ月以上前のブログは「放置サイト」の印象を与え、信頼感を損なう。V-2で厳しく評価。デモデータでも日付を直近に設定すること
2. **SEO効果**: ブログは検索流入の主要チャネル。検索キーワードを含む記事タイトルがオーガニックトラフィック獲得の鍵。V-1のタイトル品質は価値に直結
3. **カテゴリ設計**: 業種に応じて3カテゴリ程度が最適。多すぎるとユーザーが迷う。1カテゴリのみは分類の意味がない
4. **3層構成の一貫性**: トップページセクション→一覧ページ→記事詳細ページの3層が全てテンプレートのデザイントーンに統一されていること
