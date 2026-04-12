# PDF資料ダウンロード
> ID: 29 | カテゴリ: function | プラン: premium

## 概要
会社案内・カタログ・メニュー・ポートフォリオ等のPDF資料をダウンロードできる機能。Blob生成による動的PDF作成、またはアップロード済みPDFファイルの配信に対応する。ダウンロードボタンにローディングインジケーターを表示し、ファイル情報（ページ数・サイズ）を明示する。業種を問わず、デジタル資料配布の基盤として機能する。

## この機能の核
手元に資料を持ち帰って、後でゆっくり比較検討できる

## 必須要件
- ダウンロードボタン（クリックでPDFダウンロード実行）
- ローディングインジケーター（ダウンロード中のスピナーまたはプログレス表示）
- ファイル情報表示（ページ数、ファイルサイズ）
- Blob生成パターン: `new Blob([content], { type: "application/pdf" })` → `URL.createObjectURL` → `<a>` click → `URL.revokeObjectURL`
- または pre-uploaded PDF: `<a href="/files/xxx.pdf" download>` パターン
- 複数PDF対応（カード形式で並列表示）
- FileTextアイコンによる視覚的なPDF識別
- disabled状態（ダウンロード中はボタン非活性化）

## 業種別バリエーション
| 業種 | PDF資料の種類 |
|---|---|
| 建築・建設 | 会社案内、施工実績集、安全方針、ESGレポート |
| 設計事務所 | ポートフォリオ（作品集PDF） |
| 飲食 | メニュー、ドリンクリスト、パーティプラン |
| 美容・サロン | 施術メニュー、料金表、ヘアカタログ |
| 医療 | 診療案内、問診票、保険適用ガイド |
| 製造・メーカー | 製品カタログ、技術仕様書、品質認証書 |
| 不動産 | 物件資料、間取り図、価格表 |

## 既存テンプレートとの接続
### clean-arch-pro（Blob生成パターン）
- **関数名**: `PortfolioPDFSection`（924行目〜）
- **Blob生成**: PDF 1.4フォーマット文字列をBlobに変換し、`<a>` タグの click() でダウンロード
- **ファイル名**: `TAKAHASHI_DESIGN_Portfolio_2025.pdf`
- **ローディング**: `downloading` state + setTimeout 1000ms
- **配色**: `border-gray-800` ボタン、hover で `bg-gray-800 text-white`
- **アイコン**: `FileText`（w-12 h-12）、`Download`、`RotateCw`（ローディング時 animate-spin）
- **多言語対応**: `t("portfolio.download", lang)` / `t("portfolio.info", lang)`

### trust-navy-pro（pre-uploaded / カード形式）
- **関数名**: `DownloadSection`（934行目〜）
- **表示形式**: 3列グリッドカード（会社案内 / 安全方針 / ESGレポート）
- **各カード**: `FileText` アイコン + タイトル + 説明 + 「PDF Nページ」
- **配色**: `border-gray-200`, hover `shadow-lg border-[#1B3A5C]/20`
- **アクセントカラー**: `text-[#C8A96E]`（FileTextアイコン + ダウンロードテキスト）

### warm-craft-pro
- PDF専用セクション未実装。上記2パターンのいずれかを移植可能

### 共通実装パターン
```
Page Component
  └── <PortfolioPDFSection /> or <DownloadSection />
      ├── パターンA: 単一PDF + Blob生成（設計事務所向け）
      └── パターンB: 複数PDFカードグリッド（企業向け）
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
└── DownloadSection / PortfolioPDFSection コンポーネント

※ 分割する場合:
src/components/portfolio-templates/{template-id}/
├── DownloadSection.tsx
├── PDFCard.tsx
└── PDFGenerator.tsx     ← Blob生成ロジック
```

### Props / データ構造
```typescript
interface PDFDocument {
  id: string;
  title: string;
  description: string;
  pageCount: number;
  fileSize: string;        // "8.2MB"
  downloadUrl?: string;    // pre-uploaded pattern
  generateContent?: () => string; // Blob generation pattern
  fileName: string;        // "Company_Brochure_2025.pdf"
}

interface DownloadSectionProps {
  documents: PDFDocument[];
  sectionTitle: string;
  sectionLabel: string;     // "DOWNLOAD" | "PORTFOLIO"
  accentColor: string;
  layout: "single" | "grid"; // single for portfolio, grid for multiple docs
}
```

### 状態管理
```typescript
const [downloading, setDownloading] = useState(false);
const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

const handleDownload = (doc: PDFDocument) => {
  setDownloading(true);
  setTimeout(() => {
    const blob = new Blob([doc.generateContent?.() ?? ""], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloading(false);
    setDownloadedIds((prev) => new Set([...prev, doc.id]));
  }, 1000);
};
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | グリッド: 3列カード。単一: センター揃え max-w-[600px] |
| タブレット（768px〜1023px） | グリッド: 2列カード。単一: センター揃え |
| モバイル（〜767px） | グリッド: 1列カード。単一: 全幅 |

## リファレンスコード
```tsx
// clean-arch-pro の Blob生成パターン簡略版
function PortfolioPDFSection() {
  const [downloading, setDownloading] = useState(false);

  const generateAndDownloadPDF = () => {
    setDownloading(true);
    const pdfContent = `%PDF-1.4 ... %%EOF`;
    setTimeout(() => {
      const blob = new Blob([pdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Portfolio_2025.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1000);
  };

  return (
    <section className="py-24 sm:py-32">
      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <button onClick={generateAndDownloadPDF} disabled={downloading}>
        {downloading ? (
          <><RotateCw className="w-4 h-4 animate-spin" /> DOWNLOADING...</>
        ) : (
          <><Download className="w-4 h-4" /> DOWNLOAD PDF</>
        )}
      </button>
      <p className="text-[10px]">PDF / 24ページ / 8.2MB</p>
    </section>
  );
}

// trust-navy-pro のカードグリッドパターン簡略版
function DownloadSection() {
  const docs = [
    { title: "会社案内", desc: "事業内容・実績をまとめたパンフレット", pages: "12ページ" },
    { title: "安全方針", desc: "安全管理体制と取り組み", pages: "8ページ" },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="grid sm:grid-cols-3 gap-4">
        {docs.map((doc, i) => (
          <button key={i} className="p-5 border text-left hover:shadow-lg">
            <FileText className="w-8 h-8 mb-3" />
            <h3>{doc.title}</h3>
            <p>{doc.desc}</p>
            <p><Download className="w-3 h-3" /> PDF {doc.pages}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
```

## 3層チェック

> この機能の核: **手元に資料を持ち帰って比較検討できる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | ダウンロードボタン | クリックでPDFダウンロードが開始される | ボタンが反応しない。ダウンロードが始まらない |
| F-2 | PDF生成/配信 | Blob生成またはpre-uploaded PDFの配信が正しく動作する | Blob生成エラー。ファイルが壊れている。0バイト |
| F-3 | ローディング表示 | ダウンロード中にスピナーまたはプログレスが表示される | ローディングなし。画面が固まって状態不明 |
| F-4 | disabled制御 | ダウンロード中はボタンが非活性化される | ダウンロード中に連打できて重複ダウンロード |
| F-5 | ファイルサイズ表示 | ダウンロード前にファイルサイズ（MB単位）が表示されている | サイズ表示なし。いきなり巨大ファイルが降ってくる |
| F-6 | プレビュー | PDFの内容を事前にプレビュー（サムネイルまたは目次）で確認できる | プレビューなし。ダウンロードするまで中身不明 |
| F-7 | revokeObjectURL | Blob生成パターンでURL.revokeObjectURLが呼ばれメモリリークしない | revokeなしでメモリリーク |
| F-8 | ファイル名設定 | ダウンロードファイル名が適切に設定されている | 「download.pdf」「blob.pdf」で何の資料かわからない |
| F-9 | FileTextアイコン | PDFであることが視覚的にアイコンで識別できる | アイコンなし。テキストリンクのみ |
| F-10 | 完了後再活性化 | ダウンロード完了後にボタンが再び活性化する | ボタンがdisabledのまま戻らない |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | ダウンロード1クリック完了 | ボタン1クリックで**確認なしに即ダウンロード開始** | 追加ダイアログなし。1クリック→ローディング→完了 | 10点 |
| U-2 | ファイルサイズの事前表示 | ダウンロード前に**ファイルサイズがわかる** | 「PDF / 12ページ / 3.2MB」のようにサイズ+ページ数表示 | 8点 |
| U-3 | プレビューの見やすさ | PDF内容の**概要がダウンロード前にわかる** | サムネイル表示または目次/説明テキストで内容を推測できる | 8点 |
| U-4 | 複数PDF時の選びやすさ | 複数PDFが**カードグリッドで比較しやすく**並んでいる | タイトル+説明+ページ数+サイズが各カードに表示 | 7点 |
| U-5 | モバイルでのダウンロード | スマホでタップ→**正常にPDFがダウンロードされる** | iOS/Androidの両方でブラウザのダウンロード機能が動作 | 7点 |

### Layer 3: 価値チェック（持ち帰って検討できるか）— 30点

この機能の核「手元に資料を持ち帰って比較検討できる」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 持ち帰り意欲 | ユーザーが**「持ち帰って検討しよう」**と思える | 「会社案内PDF（12ページ、写真付き）」と内容が明確。保存したくなる | ダウンロードボタンはある。内容はPDF名から推測 | 何のPDFかわからない。ダウンロードする気にならない |
| V-2 | PDF内容の判断材料 | PDFの内容が**検討・比較の判断材料として十分** | 料金表、施工実績、会社概要が1つのPDFに網羅 | 基本情報は含まれるが詳細は不足 | 会社名とロゴだけの1ページPDF。判断材料にならない |
| V-3 | ファイル名の識別性 | ダウンロード後に**ファイル名で内容が判別できる** | 「山田工務店_施工実績集_2025.pdf」 | 「company_brochure.pdf」 | 「download.pdf」「blob.pdf」で判別不可 |
| V-4 | 複数資料の区別 | 複数PDFをダウンロードした時に**それぞれ区別できる** | 各PDFに固有のファイル名。フォルダ内で一目で判別 | ファイル名は異なるが似通っている | 全部同じファイル名で上書きされる |
| V-5 | ダウンロード状態の明確さ | ダウンロードが**開始→進行中→完了の各段階で状態がわかる** | ローディングスピナー→「ダウンロード完了」トースト | ローディングスピナー表示。完了時にボタンが元に戻る | 何も変わらない。ダウンロードされたのか不明 |
| V-6 | 汎用性 | PDFDocument配列の差し替えだけで**任意の業種に対応**できる | title/description/pageCount/fileSizeの構造で業種定数を差し替えるだけ | 構造は汎用的。一部ハードコード | 業種ごとにコンポーネントを書き直す必要がある |

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
- ダウンロード+ローディング+disabled+revokeObjectURL+ファイル名が全て動作（L1: 30/30）
- 1クリック完了。「PDF / 12ページ / 3.2MB」表示。サムネイルプレビューあり（L2: 35/40）
- 「山田工務店_施工実績集_2025.pdf」で判別可能。内容が検討材料として充実（L3: 25/30）

**80点の実装:**
- ダウンロード機能は全て動作する（L1: 30/30）
- 1クリック完了。サイズ表示あり。プレビューなし（L2: 28/40）
- ファイル名は適切。PDFの内容は基本情報のみ（L3: 22/30）

**70点の実装:**
- ダウンロードは動く。ローディングなし（L1: 30/30）
- サイズ表示なし。プレビューなし。いきなり大容量DL（L2: 22/40）
- 「download.pdf」で判別不可。内容も薄い（L3: 18/30）

### この機能固有の重要判定ポイント

1. **revokeObjectURLの確実な実行**: Blob生成パターンでrevokeしないとメモリリークが蓄積。**revokeObjectURL未呼出はF-7自動FAIL**
2. **ファイル名の品質**: 「download.pdf」「blob.pdf」はユーザーが後で資料を探せない。**汎用ファイル名のままはV-3自動FAIL**
3. **モバイルのダウンロード対応**: iOS SafariではBlob URLのダウンロードに制約がある。**iOS/Android両方でテストし、一方でも失敗ならU-5が0点**
