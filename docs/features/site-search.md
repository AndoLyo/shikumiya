# サイト内検索
> ID: site-search | カテゴリ: parts | プラン: premium

## 概要
ヘッダーの検索アイコンから展開するサイト内全文検索機能。ページ数が多いサイト（施工実績、商品カタログ、メニュー一覧、診療案内、コラム記事等）で、ナビゲーションだけでは目的の情報に到達しにくい場合に有効。検索アイコンクリックで入力フィールドが展開し、オートコンプリート候補をドロップダウン表示。検索結果ページではキーワードハイライト、最近の検索履歴表示、結果なし状態のハンドリングまでを含む。業種を問わず、premium プランの高機能オプションとして提供する。既存3テンプレートには未実装のため、新規コンポーネントとしてヘッダーに組み込む。

## この機能の核
「あのページどこだっけ」が3秒で見つかる

## 必須要件
- ヘッダー内に検索アイコン（`Search` from lucide-react）を配置
- アイコンクリックで入力フィールドが展開（`AnimatePresence` でアニメーション）
- テキスト入力中にオートコンプリート候補をドロップダウン表示
- 検索実行（Enter）で検索結果ページに遷移
- 検索結果ページ: キーワードハイライト、ヒット数表示、ページネーション
- 最近の検索履歴: `localStorage` に保存（最大10件）、検索フィールド展開時に表示
- 空状態: 「検索キーワードを入力してください」
- 結果なし: 「該当する結果が見つかりませんでした」+ 検索ヒントの表示
- Escape キーで検索フィールドを閉じる
- `prefers-reduced-motion` 対応
- デバウンス: 入力後 300ms 待ってからオートコンプリート検索を実行

## 業種別バリエーション

### 建築・建設
検索対象: 施工実績（タイトル・カテゴリ・エリア）/ 技術情報 / お知らせ / 採用情報
オートコンプリート候補: 「新築」「リフォーム」「耐震」「世田谷区」等
フィルター: カテゴリ別（新築/リフォーム/公共施設）、エリア別

### 小売・EC
検索対象: 商品名 / カテゴリ / ブランド / 価格帯
オートコンプリート候補: 商品名の部分一致、カテゴリ名
フィルター: カテゴリ別、価格帯別、在庫あり/なし

### 飲食
検索対象: メニュー名 / 食材 / アレルゲン / ニュース
オートコンプリート候補: メニュー名、食材名
フィルター: カテゴリ別（ランチ/ディナー/ドリンク）、アレルゲン除外

### 美容・サロン
検索対象: メニュー名 / スタイリスト名 / ブログ記事
オートコンプリート候補: メニュー名、スタイリスト名
フィルター: メニューカテゴリ、担当スタイリスト

### 医療・クリニック
検索対象: 診療科目 / 症状 / 医師名 / お知らせ
オートコンプリート候補: 症状名、診療科目名
フィルター: 診療科別

### 士業・コンサルティング
検索対象: サービス名 / 実績 / コラム記事
オートコンプリート候補: サービス名、記事タイトル
フィルター: カテゴリ別（法人/個人）、記事タグ別

## 既存テンプレートとの接続

### warm-craft（暖色ナチュラル系）
- **Header()**: `src/app/portfolio-templates/warm-craft/page.tsx` 行199〜297
- **検索アイコン配置場所**: `nav` の右隣、CTA電話ボタンの左に追加
  ```
  [ロゴ] ... [ナビ項目] [🔍] [📞電話ボタン] [ハンバーガー]
  ```
- **展開スタイル**: アイコンクリックで入力フィールドが右からスライドイン
- **入力フィールド**: `bg-[#FAF7F2] border-[#E8DFD3] focus:border-[#7BA23F] rounded-lg`
- **ドロップダウン**: `bg-white border border-[#E8DFD3] rounded-xl shadow-xl`
- **ハイライト色**: `bg-[#7BA23F]/20 text-[#3D3226]`

### trust-navy（ネイビー重厚系）
- **Header()**: `src/app/portfolio-templates/trust-navy/page.tsx` 行182〜269
- **検索アイコン配置場所**: `nav` の右隣、CTAボタンの左に追加
- **展開スタイル**: アイコンクリックでヘッダー全幅に検索バーを展開（上段インフォバーを一時非表示）
- **入力フィールド**: `border border-gray-200 focus:border-[#1B3A5C]`（角丸なし）
- **ドロップダウン**: `bg-white border border-gray-200 shadow-lg`
- **ハイライト色**: `bg-[#1B3A5C]/10 text-[#1B3A5C]`

### clean-arch（ミニマルモノクロ系）
- **Header()**: `src/app/portfolio-templates/clean-arch/page.tsx` 行112〜168
- **検索アイコン配置場所**: ナビ項目の右端に追加（`WORKS` `ABOUT` `CONTACT` `SEARCH`）
- **展開スタイル**: フルスクリーンオーバーレイ（モバイルメニューと同じ `fixed inset-0 bg-white`）
  - 中央に大きな入力フィールド `text-2xl font-light`
- **入力フィールド**: `border-0 border-b border-gray-200 focus:border-gray-800 bg-transparent`
- **ドロップダウン**: 入力フィールド直下にリスト表示（ミニマル）
- **ハイライト色**: `bg-gray-100 text-gray-800`

### 全テンプレート共通
- 検索データソースは静的 JSON（`searchIndex.json`）として生成し、クライアントサイドで検索
- premium プランでのみ有効化（lite/middle では検索アイコン非表示）
- Header の `navItems` 配列の後に検索アイコンを追加する形で統合

## コンポーネント仕様

### ファイル配置
```
src/components/portfolio-templates/common/SiteSearch.tsx
  └── SearchIcon（ヘッダー内アイコン）
  └── SearchOverlay（展開時のUIフルセット）
  └── SearchResults（結果ページ）

src/app/portfolio-templates/{template-id}/search/page.tsx
  └── 検索結果ページ

public/portfolio-templates/{template-id}/searchIndex.json
  └── 検索用インデックスデータ
```

### Props / データ構造
```typescript
interface SearchItem {
  id: string;
  title: string;           // ページタイトル
  description: string;     // ページ説明（抜粋）
  category: string;        // "施工実績" | "お知らせ" | "技術情報"
  url: string;             // "/works/1"
  keywords: string[];      // ["新築", "木造", "世田谷"]
  thumbnail?: string;      // サムネイル画像パス
}

interface SearchConfig {
  indexUrl: string;         // "/searchIndex.json"
  debounceMs: number;      // 300
  maxAutocomplete: number; // 5
  maxHistory: number;      // 10
  historyStorageKey: string; // "site-search-history"
  placeholder: string;     // "キーワードで検索..."
}

interface SearchResult {
  item: SearchItem;
  highlights: { field: string; snippet: string }[];  // ハイライト付き抜粋
  score: number;           // 関連度スコア
}
```

### 状態管理
```typescript
const [isOpen, setIsOpen] = useState(false);
const [query, setQuery] = useState("");
const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
const [history, setHistory] = useState<string[]>([]);
const debounceRef = useRef<NodeJS.Timeout>();

// デバウンス検索
useEffect(() => {
  if (debounceRef.current) clearTimeout(debounceRef.current);
  if (query.length < 2) { setSuggestions([]); return; }
  debounceRef.current = setTimeout(() => {
    const results = searchIndex.filter(item =>
      item.title.includes(query) || item.keywords.some(k => k.includes(query))
    );
    setSuggestions(results.slice(0, 5));
  }, 300);
}, [query]);

// Escape で閉じる
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []);

// 検索履歴
useEffect(() => {
  const stored = localStorage.getItem("site-search-history");
  if (stored) setHistory(JSON.parse(stored));
}, []);
```

## リファレンスコード

### SearchIcon（ヘッダー内、warm-craft トーン）
```tsx
// Header() 内のナビ項目の後に追加
<button
  onClick={() => setSearchOpen(true)}
  className={`p-2 transition-colors ${
    scrolled ? "text-[#8B7D6B] hover:text-[#7BA23F]" : "text-white/80 hover:text-white"
  }`}
  aria-label="検索"
>
  <Search className="w-4 h-4" />
</button>
```

### SearchOverlay（展開 UI — clean-arch フルスクリーン方式）
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={() => setIsOpen(false)}
        className="absolute top-5 right-5 text-xs tracking-[0.2em] text-gray-400 hover:text-black">
        CLOSE
      </button>

      <div className="w-full max-w-[600px]">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="キーワードで検索..."
          autoFocus
          className="w-full text-2xl font-light text-gray-800 border-0 border-b border-gray-200
            focus:border-gray-800 focus:outline-none bg-transparent pb-3 placeholder:text-gray-300"
        />

        {/* オートコンプリート */}
        {suggestions.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-100">
            {suggestions.map((item) => (
              <li key={item.id}>
                <a href={item.url} className="block py-3 text-gray-600 hover:text-gray-800 transition-colors">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* 検索履歴 */}
        {query.length === 0 && history.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] text-gray-300 tracking-[0.2em] mb-3">最近の検索</p>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <button key={i} onClick={() => setQuery(h)}
                  className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 hover:border-gray-400 transition-colors">
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### 検索インデックス JSON の構造
```json
[
  {
    "id": "work-1",
    "title": "世田谷の家",
    "description": "自然光をたっぷり取り入れた開放的なLDK...",
    "category": "施工実績",
    "url": "/works/1",
    "keywords": ["新築", "木造", "世田谷", "オーク材", "漆喰"]
  },
  {
    "id": "about",
    "title": "会社案内",
    "description": "創業30年、世田谷区を中心に...",
    "category": "会社情報",
    "url": "/#about",
    "keywords": ["会社概要", "代表挨拶", "アクセス"]
  }
]
```

## 3層チェック

> この機能の核: **「あのページどこだっけ」が3秒で見つかる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 入力フィールド | ヘッダー内の検索アイコンクリックで入力フィールドがAnimatePresenceで展開する | アイコンが反応しない。展開アニメーションなし |
| F-2 | オートコンプリート | テキスト入力後300msのデバウンスで候補がドロップダウン表示される | デバウンスなしで毎キーストローク検索。候補が出ない |
| F-3 | 結果ページ遷移 | Enterキーで検索結果ページに遷移する | Enterが効かない。遷移先がない |
| F-4 | debounce | 入力後300msの間隔でオートコンプリート検索が実行される | デバウンスなし。入力ごとに即時検索でパフォーマンス低下 |
| F-5 | Escapeキー | Escapeキーで検索フィールド/オーバーレイが閉じる | Escapeが効かない。閉じる手段がアイコンのみ |
| F-6 | 検索履歴 | `localStorage` に最近の検索キーワード（最大10件）が保存・表示される | 保存されない。フィールド展開時に履歴が出ない |
| F-7 | 結果なし状態 | 「該当する結果が見つかりませんでした」+検索ヒントが表示される | 何も表示されない。空白のまま |
| F-8 | ハイライト | 検索結果のキーワードがハイライト表示される | ハイライトなし。マッチ箇所がわからない |
| F-9 | カラースキーム | 入力フィールド・ドロップダウンの色がテンプレートのパレットに合致 | 色がハードコードでテンプレートと合わない |
| F-10 | 検索インデックス | searchIndex.jsonが正しい構造（id/title/category/url/keywords）で生成されている | JSONが壊れている。必須フィールド欠落 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 入力→結果表示の速度 | キーワード入力から候補表示まで**500ms以内** | デバウンス300ms + 検索処理200ms以内。体感で「すぐ出る」 | 10点 |
| U-2 | 結果の関連性 | オートコンプリート候補が**入力キーワードに関連する上位5件**を表示 | タイトル一致 > キーワード一致の優先度。カテゴリ表示で区別可能 | 10点 |
| U-3 | 0件時のメッセージ | 結果なしの場合に**具体的な検索ヒント**が表示される | 「別のキーワードをお試しください」+人気の検索キーワード提示 | 7点 |
| U-4 | モバイルでの検索体験 | スマホで**フルスクリーン展開+キーボードと干渉しない** | 入力欄が画面上部。キーボードが出ても入力欄と候補が見える | 6点 |
| U-5 | 検索履歴のUX | 検索欄を開いた時に**最近の検索がワンタップで再検索可能** | 履歴チップが表示され、タップで即再検索。削除も可能 | 7点 |

### Layer 3: 価値チェック（3秒で見つかるか）— 30点

この機能の核「あのページどこだっけ」が3秒で見つかるかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 3秒で見つかる | 目的のページが**検索開始から3秒以内**に見つかる | 2文字入力で候補に目的ページが出現。タップで即遷移 | Enter→結果ページで5秒以内に見つかる | 何度キーワードを変えても目的ページが出ない |
| V-2 | 検索結果の的確さ | 入力キーワードに対して**最も関連性の高いページが上位**に出る | 「新築」で施工実績の新築カテゴリが1位。カテゴリ別表示 | 関連ページが結果に含まれるが順位が低い | 無関係なページが上位。目的ページが埋もれる |
| V-3 | カテゴリの区別 | 検索結果で**ページのカテゴリが明示**されている | 「施工実績 > 新築」のようにカテゴリパスが表示される | カテゴリラベルがある | カテゴリなし。全結果が同列で区別不能 |
| V-4 | 初見での発見 | 検索機能の存在を**初めてのユーザーが発見**できる | ヘッダーに虫眼鏡アイコンがあり、ホバーで「検索」ツールチップ | 虫眼鏡アイコンはあるがラベルなし | 検索機能がメニュー深部に隠れている |
| V-5 | 再検索の効率 | 過去に検索したキーワードを**ワンタップで再利用**できる | 検索欄を開くと履歴チップが並び、タップで即再検索 | 履歴は表示されるがテキスト入力欄に反映されるだけ | 履歴機能なし。毎回再入力が必要 |
| V-6 | 検索→行動の接続 | 検索結果から**目的のページに直接遷移**できる | 候補クリックで該当セクションにスクロール。ページ遷移が即座 | 結果ページ→リンククリックで遷移 | 検索結果にリンクがない。ページ名だけ表示 |

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
- デバウンス300ms+オートコンプリート+Escapeキー+検索履歴が全て動作（L1: 30/30）
- 入力→候補表示400ms。カテゴリ別表示。0件時に検索ヒント。モバイルフルスクリーン（L2: 35/40）
- 2文字入力で目的ページが候補トップに出現。カテゴリパス表示で即判別。履歴ワンタップ再検索（L3: 25/30）

**80点の実装:**
- オートコンプリート動作。デバウンスあり（L1: 30/30）
- 候補は出るがカテゴリ表示なし。モバイル対応OK（L2: 28/40）
- 検索は機能するが結果の関連性が低い。5秒かかる場合がある（L3: 22/30）

**70点の実装:**
- 検索は動く。Escapeキー未対応（L1: 30/30）
- デバウンスなしで遅い。0件時にメッセージなし（L2: 22/40）
- 候補が多すぎて目的ページが埋もれる。カテゴリ区別なし（L3: 18/30）

### この機能固有の重要判定ポイント

1. **デバウンスの実装**: デバウンスなしの即時検索はパフォーマンスを著しく低下させる。**300ms以上のデバウンスがなければF-4自動FAIL**
2. **検索インデックスの品質**: インデックスに全ページが含まれていなければ検索の意味がない。**ページの50%以上がインデックス未登録ならF-10自動FAIL**
3. **3秒ルール**: 目的のページが3秒で見つからなければこの機能の核が未達成。**テスト時に代表的なキーワード5つで3秒テストを実施し、3つ以上失敗ならV-1自動FAIL**
