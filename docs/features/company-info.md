# 会社情報/企業概要
> ID: company-info | カテゴリ: section | プラン: lite

## 概要
企業の基本情報を「代表挨拶」「会社概要テーブル」「沿革（タイムライン）」の3ブロックで構成するセクション。業種を問わず、ほぼ全てのコーポレートサイトに存在する必須コンテンツ。代表者のメッセージで企業理念を伝え、会社概要テーブルで法定・信頼情報を正確に掲載し、沿革で企業の歴史と成長を示す。3テンプレート全てに既存の AboutSection があるため、新規追加ではなく既存セクションの拡張・改善として実装する。

## この機能の核
「ちゃんとした会社だ」と信用する。

## 必須要件
- 代表挨拶ブロック: 代表者写真（またはプレースホルダ）+ 肩書 + 挨拶文
- 会社概要テーブル: 会社名、設立年、所在地、事業内容を最低限含むこと
- 沿革ブロック: 年表形式（年月 + 出来事）のタイムライン表示
- テーブルは偶数行・奇数行で背景色を交互にすること（ゼブラストライプ）
- 各ブロックはアンカーリンクでジャンプ可能にすること
- 挨拶文が長い場合の「もっと読む」展開機能

## 業種別バリエーション

| 業種 | テーブル必須項目 | 業種固有の項目 |
|---|---|---|
| **建築** | 会社名, 設立, 資本金, 従業員数, 所在地, 事業内容 | 建設業許可番号, 一級建築士事務所登録, ISO認証, 有資格者数 |
| **小売** | 会社名, 設立, 資本金, 従業員数, 所在地, 事業内容 | 店舗数, 取扱ブランド数, 主要取引先 |
| **飲食** | 店名/会社名, 設立, 所在地, 事業内容, 営業時間 | 食品衛生管理者, HACCP認証, 席数, 収容人数 |
| **美容** | 店名/会社名, 設立, 所在地, 事業内容 | 美容師免許, 管理美容師, サロン登録番号, 在籍スタイリスト数 |
| **医療** | 医療法人名, 設立, 所在地, 診療科目 | 院長経歴, 医師免許, 専門医資格, 施設基準, 指定医療機関 |
| **教育** | 会社名/学校名, 設立, 所在地, 事業内容 | 認可番号, 講師数, 在籍生徒数, 合格実績 |
| **ホテル** | 施設名, 設立, 所在地, 事業内容 | 客室数, 旅館業許可番号, 収容人数, 付帯施設 |

## 既存テンプレートとの接続

### 既存実装の状況
| テンプレート | 関数名 | セクション ID | データ定数 | ステータス |
|---|---|---|---|---|
| warm-craft | `AboutSection()` | `#about` | `COMPANY` (name/tagline/bio/ceo/license/etc) | 既存（代表挨拶+会社概要テーブル） |
| trust-navy | `AboutSection()` | `#about` | `COMPANY` (name/nameEn/bio/ceo/capital/employees/etc) + `STATS` | 既存（代表メッセージ+会社概要テーブル） |
| clean-arch | `AboutSection()` | `#about` | `OFFICE` (name/nameJa/bio/ceo/title/since/license) | 既存（代表ポートレート+簡易情報リスト） |

### 改修ポイント（既存セクションの拡張）

**warm-craft** — 沿革タイムラインの追加:
```tsx
function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FAF7F2]">
      <div className="max-w-[1000px] mx-auto px-5">
        {/* 既存: セクションヘッダー */}
        {/* 既存: CEO message card */}
        {/* 既存: Company info table */}
        {/* ▼ 追加: History timeline */}
        <HistoryTimeline />
      </div>
    </section>
  );
}
```

**trust-navy** — 沿革タイムラインの追加:
```tsx
function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1000px] mx-auto px-5">
        {/* 既存: セクションヘッダー */}
        {/* 既存: CEO message (border-l-4 style) */}
        {/* 既存: Company table */}
        {/* ▼ 追加: History timeline */}
        <HistoryTimeline />
      </div>
    </section>
  );
}
```

**clean-arch** — 会社概要テーブルと沿革の追加:
```tsx
function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-white border-t border-gray-100">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-10">
        {/* 既存: Portrait + Bio (2-column grid) */}
        {/* ▼ 追加: Company overview table (minimal style) */}
        <CompanyTable />
        {/* ▼ 追加: History timeline (minimal style) */}
        <HistoryTimeline />
      </div>
    </section>
  );
}
```

### navItems への変更
ナビゲーション変更不要（既存の #about のまま）。

| テンプレート | 現状のエントリ | 変更 |
|---|---|---|
| warm-craft | `{ label: "会社案内", href: "#about" }` | 変更なし |
| trust-navy | `{ label: "会社概要", href: "#about" }` | 変更なし |
| clean-arch | `["ABOUT", "#about"]` | 変更なし |

### カラーの合わせ方
| テンプレート | セクション背景 | テーブルヘッダ | テーブルストライプ | タイムラインライン | タイムラインドット |
|---|---|---|---|---|---|
| warm-craft | `#FAF7F2` | `#FDFCFA` (label bg) | `#FAF7F2` / `white` 交互 | `#E8DFD3` | `#7BA23F` |
| trust-navy | `white` | `#1B3A5C` (bg-navy text-white) | `white` / `#F0F4F8` 交互 | `gray-200` | `#C8A96E` |
| clean-arch | `white` | なし (minimal) | なし (minimal) | `gray-100` | `gray-400` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function AboutSection() { ... }  ← 既存を改修
  └── (内部にタイムライン部分を追加)
```

### データ定数（英語プロパティ名）
```typescript
interface CeoMessage {
  /** CEO name */
  name: string;
  /** Title / position */
  title: string;
  /** Photo path (optional) */
  photo?: string;
  /** Greeting message (newline-separated paragraphs) */
  message: string;
}

interface CompanyTableRow {
  /** Row label */
  label: string;
  /** Row value */
  value: string;
}

interface HistoryEvent {
  /** Year-month ("1976年4月" or "1976年") */
  date: string;
  /** Event description */
  event: string;
}

interface CompanyInfoConfig {
  /** Section title (Japanese) */
  sectionTitle: string;
  /** CEO message block */
  ceo: CeoMessage;
  /** Company overview table rows */
  overview: CompanyTableRow[];
  /** Company history events */
  history: HistoryEvent[];
  /** Enable history timeline animation */
  historyAnimation: boolean;
}

// Demo data — warm-craft style (using existing COMPANY constant)
const COMPANY_OVERVIEW: CompanyTableRow[] = [
  { label: "商号", value: "山田工務店" },
  { label: "代表者", value: "山田 太郎" },
  { label: "設立", value: "1996年" },
  { label: "所在地", value: "東京都世田谷区〇〇町1-2-3" },
  { label: "電話番号", value: "0120-000-000" },
  { label: "メール", value: "info@yamada-koumuten.jp" },
  { label: "営業時間", value: "9:00〜18:00（日曜・祝日定休）" },
  { label: "許認可", value: "建設業許可 東京都知事（般-5）第00000号" },
  { label: "Webサイト", value: "yamada-koumuten.jp" },
];

// Demo data — trust-navy style (larger company)
const COMPANY_OVERVIEW_LARGE: CompanyTableRow[] = [
  { label: "商号", value: "鈴木建設株式会社" },
  { label: "英文社名", value: "SUZUKI CONSTRUCTION CO., LTD." },
  { label: "代表者", value: "代表取締役 鈴木 一郎" },
  { label: "設立", value: "1976年" },
  { label: "資本金", value: "5,000万円" },
  { label: "従業員数", value: "48名（うち一級建築士8名、施工管理技士12名）" },
  { label: "所在地", value: "〒100-0000 東京都千代田区〇〇町2-3-4 鈴木ビル5F" },
  { label: "事業内容", value: "建築工事業、土木工事業、大工工事業" },
  { label: "許認可", value: "国土交通大臣許可（特-5）第00000号" },
  { label: "認証", value: "ISO 9001:2015 / ISO 14001:2015" },
  { label: "Webサイト", value: "suzuki-kensetsu.co.jp" },
];

const HISTORY: HistoryEvent[] = [
  { date: "1976年4月", event: "東京都千代田区に鈴木建設を設立" },
  { date: "1985年", event: "一級建築士事務所登録" },
  { date: "2000年", event: "ISO 9001認証取得" },
  { date: "2010年", event: "資本金を5,000万円に増資、本社ビル新築移転" },
  { date: "2020年", event: "ZEB事業に参入" },
  { date: "2025年", event: "創業50周年" },
];
```

### 状態管理
```typescript
// Mostly stateless. Minimal state for expand/collapse:
const [messageExpanded, setMessageExpanded] = useState(false);

// Timeline animation is delegated to Framer Motion whileInView
// No additional state required
```

### レスポンシブ対応
| ブレークポイント | 代表挨拶 | 会社概要テーブル | 沿革タイムライン |
|---|---|---|---|
| **モバイル**（〜639px） | 写真: フル幅中央揃え → テキスト下配置 | 項目名と内容を縦積み（dt/dd形式） | 左端にライン |
| **タブレット**（640〜1023px） | 写真+テキスト横並び | 2カラム維持 | 中央ライン |
| **デスクトップ**（1024px〜） | 写真300px+テキスト残り | 項目名200px固定 | 中央ラインにドット+ホバーハイライト |

## リファレンスコード

### warm-craft の既存 AboutSection（代表挨拶+テーブル部分）:
```tsx
{/* CEO message — warm-craft existing pattern */}
<motion.div
  className="bg-white rounded-2xl border border-[#E8DFD3] overflow-hidden mb-10"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <div className="p-8 sm:p-10">
    <p className="text-[#7BA23F] text-xs tracking-[0.2em] mb-4 font-medium">代表挨拶</p>
    <div className="float-right ml-6 mb-4 hidden sm:block">
      {/* CEO portrait placeholder */}
      <div className="w-[160px] h-[200px] rounded-xl bg-gradient-to-b from-[#D4CFC5] to-[#C4B5A0]" />
      <p className="text-center text-[#8B7D6B] text-xs mt-2">代表 {ceo.name}</p>
    </div>
    <div className="text-[#3D3226] text-sm sm:text-base leading-[2.2]">
      {ceo.message.split("\n\n").map((para, i) => (
        <p key={i} className={i > 0 ? "mt-5" : ""}>{para}</p>
      ))}
    </div>
  </div>
</motion.div>

{/* Company table — warm-craft existing pattern */}
<motion.div
  className="bg-white rounded-2xl border border-[#E8DFD3] overflow-hidden"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E8DFD3]">
    <h3 className="text-[#3D3226] font-bold text-base">会社概要</h3>
  </div>
  <div className="divide-y divide-[#E8DFD3]">
    {overview.map(({ label, value }) => (
      <div key={label} className="flex flex-col sm:flex-row">
        <div className="sm:w-40 px-6 py-3 sm:py-4 bg-[#FDFCFA] text-[#8B7D6B] text-sm font-medium">
          {label}
        </div>
        <div className="flex-1 px-6 py-3 sm:py-4 text-[#3D3226] text-sm">{value}</div>
      </div>
    ))}
  </div>
</motion.div>
```

### trust-navy の既存 AboutSection（ネイビーヘッダスタイル）:
```tsx
{/* Company table — trust-navy existing pattern */}
<motion.div
  className="border border-gray-200 overflow-hidden"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  {overview.map(({ label, value }, i) => (
    <div key={label} className={`flex flex-col sm:flex-row ${i > 0 ? "border-t border-gray-200" : ""}`}>
      <div className="sm:w-44 px-6 py-3.5 bg-[#1B3A5C] text-white text-sm font-medium">
        {label}
      </div>
      <div className="flex-1 px-6 py-3.5 text-gray-700 text-sm bg-white">{value}</div>
    </div>
  ))}
</motion.div>
```

### 追加する沿革タイムライン:
```tsx
{/* History timeline — to be added to all templates */}
<motion.div
  className="mt-12"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  <h3 className="text-[#3D3226] font-bold text-base mb-8">沿革</h3>
  <div className="relative">
    {/* Vertical line */}
    <div className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-[#E8DFD3]" />

    {history.map((item, i) => (
      <motion.div
        key={i}
        className="relative flex items-start gap-6 sm:gap-0 mb-8 last:mb-0"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.08 }}
      >
        {/* Desktop: alternate left/right */}
        <div className="hidden sm:flex w-1/2 justify-end pr-8">
          {i % 2 === 0 && (
            <div className="text-right">
              <p className="text-[#7BA23F] text-sm font-medium">{item.date}</p>
              <p className="text-[#8B7D6B] text-sm mt-1">{item.event}</p>
            </div>
          )}
        </div>

        {/* Dot */}
        <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-[15px] h-[15px]
                        rounded-full border-2 border-[#7BA23F] bg-white z-10 mt-0.5" />

        <div className="hidden sm:flex w-1/2 pl-8">
          {i % 2 !== 0 && (
            <div>
              <p className="text-[#7BA23F] text-sm font-medium">{item.date}</p>
              <p className="text-[#8B7D6B] text-sm mt-1">{item.event}</p>
            </div>
          )}
        </div>

        {/* Mobile: all items on right */}
        <div className="sm:hidden pl-6">
          <p className="text-[#7BA23F] text-sm font-medium">{item.date}</p>
          <p className="text-[#8B7D6B] text-sm mt-1">{item.event}</p>
        </div>
      </motion.div>
    ))}
  </div>
</motion.div>
```

## 3層チェック

> この機能の核: **「ちゃんとした会社だ」と信用する**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 代表挨拶に写真(orプレースホルダ)+肩書+氏名+挨拶文 | 4要素全てが表示されている | 要素が欠落している |
| F-2 | 会社概要テーブルに最低5項目 | 会社名/設立/所在地/事業内容/連絡先 | 項目数が足りない |
| F-3 | テーブル行の視覚的区別 | ゼブラストライプまたはボーダー | 全行同じ背景で区別不可 |
| F-4 | 沿革がタイムライン形式で年代順 | 年月+出来事が時系列で表示 | 順番がバラバラ/沿革なし |
| F-5 | 沿革のフェードインアニメーション | whileInView で順次フェードイン | アニメーションなし |
| F-6 | 業種固有の必須項目 | 建築→許可番号、医療→院長資格等 | 法定情報が欠落 |
| F-7 | 所在地が郵便番号付き | 〒XXX-XXXX 形式で表示 | 郵便番号なし |
| F-8 | モバイルでテーブル崩れなし | 縦積み（dt/dd形式）で見やすい | テーブルはみ出し横スクロール |
| F-9 | 代表写真が適切なアスペクト比 | 人物写真が歪みなく表示 | 写真が潰れる/引き伸ばされる |
| F-10 | テンプレートのスタイル統一 | カラーパレット・角丸・ボーダーが一致 | 他セクションとスタイル不一致 |
| F-11 | 既存AboutSectionのスタイル維持 | 沿革追加で既存部分を壊さない | 既存の代表挨拶やテーブルが崩れる |
| F-12 | clean-archのミニマルスタイル維持 | 角丸なし・装飾最小限 | clean-archにwarm-craftの装飾を付ける |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 会社情報の一覧性 | 主要情報がスクロールせずに把握できる | ファーストスクリーンで会社名+設立+所在地 | 10点 |
| U-2 | 代表写真の有無 | 写真で代表者の人柄が伝わる | 写真あり（プレースホルダでも可） | 8点 |
| U-3 | 沿革の読みやすさ | タイムラインが直感的に追える | 年代順+左右交互（PC）or左寄せ（モバイル） | 8点 |
| U-4 | 連絡先の発見しやすさ | 電話・メールが即座に見つかる | テーブル内に明記+tel:リンク | 6点 |
| U-5 | テーブル項目の順序 | 重要度順に並んでいる | 会社名→代表→設立→所在地→許認可 | 4点 |
| U-6 | 挨拶文の読みやすさ | 長文でも読みやすく構成されている | 段落分け+「もっと読む」（長い場合） | 4点 |

### Layer 3: 価値チェック（信用できるか）— 30点

この機能の核「『ちゃんとした会社だ』と信用する」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「この会社は信用できる」と感じる | 会社情報の充実度で信頼感が生まれる | 12項目+許認可+ISO+有資格者数 | 5項目（最低限だが実在感あり） | 会社名と住所のみ |
| V-2 | 許認可番号がある | 法定情報が正確に記載 | 「建設業許可 東京都知事（般-5）第00000号」 | 「建設業許可あり」（番号なし） | 許認可情報なし |
| V-3 | 実績年数が明確 | 設立年から歴史の厚みが伝わる | 「1976年設立」+沿革で50年の軌跡 | 「1976年設立」のみ | 設立年不明 |
| V-4 | 代表挨拶に人柄が出ている | 創業ストーリーや想いが伝わる | 創業の経緯+地域への想い+将来ビジョン | 経営理念の列挙 | 挨拶文なし |
| V-5 | 沿革が会社の成長を示す | 創業→現在の成長軌跡がわかる | 5〜10イベント+受賞/認証/拠点拡大 | 3イベント（最低限） | 沿革なし/1イベントのみ |
| V-6 | 連絡先が複数手段ある | 電話+メール+住所で安心感 | 電話+メール+住所+Webサイト | 電話番号のみ | 連絡先なし |

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
**90点の実装:** 代表写真+創業ストーリー付き挨拶+12項目テーブル（許認可番号・ISO認証含む）+沿革タイムライン（8イベント）。テンプレートのトーンに完全一致。信用度が高い。
**80点の実装:** 代表挨拶+5項目テーブル+3イベント沿革。機能的には揃っているが、許認可番号が「あり」だけで番号なし。挨拶が経営理念の列挙。
**70点の実装:** テーブルは表示されるが5項目未満。沿革なし。モバイルでテーブルが崩れる。代表写真なし。

### この機能固有の重要判定ポイント
- **業種固有の法定情報**: 建築→建設業許可番号、医療→施設基準、飲食→食品営業許可。必須
- **沿革の厚み**: 5〜10イベントが目安。空白期間が長すぎると事業停滞の印象
- **既存テンプレートとの整合性**: warm-craft=温かみ、trust-navy=信頼感、clean-arch=ミニマル
- **テーブル項目の順序**: 会社名→代表→設立→資本金→従業員数→所在地→事業内容→許認可→Webが一般的
