# ファイルアップロード
> ID: 31 | カテゴリ: function | プラン: premium

## 概要
ドラッグ&ドロップ対応のファイルアップロード機能。画像・PDF・DOCファイルのアップロードに対応し、ファイルタイプ・サイズのバリデーション、アップロード進捗バー、画像プレビューサムネイルを提供する。業種を問わず、採用ページでの履歴書送信、お問い合わせ時の資料添付、注文時の仕様書添付等に使用する。

## この機能の核
紙を持っていかなくても、スマホから書類を送れる

## 必須要件
- ドラッグ&ドロップエリア（dashed border, hover時のハイライト）
- クリックでファイル選択ダイアログを開く（`<input type="file">` hidden + triggerClick）
- ファイルタイプバリデーション: 許可拡張子の制限（image/*, .pdf, .doc, .docx）
- ファイルサイズバリデーション: 上限サイズの制限（デフォルト10MB）
- アップロード進捗バー（模擬的にsetIntervalで進捗表示）
- 画像プレビュー: `FileReader` + `readAsDataURL` でサムネイル表示
- ファイルリスト表示: ファイル名、サイズ、タイプ、削除ボタン
- エラーメッセージ: タイプ不正・サイズ超過時に赤文字で表示
- 複数ファイル対応（`multiple` 属性）

## 業種別バリエーション
| 業種 | アップロード用途 | 許可ファイルタイプ |
|---|---|---|
| 建築・建設 | 採用: 履歴書・職務経歴書 | PDF, DOC, DOCX |
| 建築・建設 | 問い合わせ: 図面・参考写真 | PDF, JPG, PNG |
| 飲食 | 貸切・ケータリング仕様書 | PDF, DOC |
| 美容 | カウンセリング: 希望イメージ写真 | JPG, PNG |
| 医療 | 問診: 紹介状・検査データ | PDF, JPG, PNG |
| 製造 | 見積依頼: 製品仕様書 | PDF, DXF, CAD |

## 既存テンプレートとの接続
### warm-craft-pro
- ファイルアップロード専用セクション未実装
- 採用ページ（RecruitSection）やお問い合わせフォーム（ContactSection）に統合する形で追加

### trust-navy-pro
- `RecruitSection` が実装済み。ここに履歴書アップロードフィールドを追加する形が自然
- 配色: `bg-[#F0F4F8]` ドロップエリア、`border-[#1B3A5C]/30` dashed border

### clean-arch-pro
- ContactSectionのフォームに添付ファイルフィールドとして統合可能
- 配色: `bg-gray-50` ドロップエリア、`border-gray-200` dashed border

### 共通実装パターン
```
既存フォーム（Contact / Recruit）
  └── <FileUploadField />（フォーム内に埋め込み）
      ├── ドラッグ&ドロップエリア
      ├── ファイルリスト（選択済みファイル一覧）
      └── プログレスバー（アップロード中）

または独立セクションとして配置:
Page Component
  └── <FileUploadSection />
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
└── FileUploadField コンポーネント（フォーム内に埋め込み）

※ 分割する場合:
src/components/portfolio-templates/{template-id}/
├── FileUploadField.tsx
├── DropZone.tsx
├── FilePreview.tsx
└── ProgressBar.tsx
```

### Props / データ構造
```typescript
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;    // for images
  progress: number;       // 0-100
  status: "pending" | "uploading" | "complete" | "error";
  errorMessage?: string;
}

interface FileUploadFieldProps {
  acceptedTypes: string[];      // [".pdf", ".jpg", ".png", ".doc", ".docx"]
  maxFileSize: number;          // bytes, default 10 * 1024 * 1024 (10MB)
  maxFiles: number;             // default 5
  multiple: boolean;            // default true
  label: string;
  helpText?: string;
  accentColor: string;
  dropZoneHeight?: string;      // default "160px"
  onFilesChange: (files: UploadedFile[]) => void;
}

interface FileValidationResult {
  valid: boolean;
  errorType?: "type" | "size" | "count";
  errorMessage?: string;
}
```

### 状態管理
```typescript
const [files, setFiles] = useState<UploadedFile[]>([]);
const [isDragOver, setIsDragOver] = useState(false);
const [error, setError] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);
  const droppedFiles = Array.from(e.dataTransfer.files);
  validateAndAddFiles(droppedFiles);
};

const validateAndAddFiles = (newFiles: File[]) => {
  for (const file of newFiles) {
    if (!acceptedTypes.some((t) => file.name.endsWith(t) || file.type.startsWith(t))) {
      setError(`${file.name}: 許可されていないファイル形式です`);
      return;
    }
    if (file.size > maxFileSize) {
      setError(`${file.name}: ファイルサイズが上限を超えています`);
      return;
    }
  }
  // Add files with preview generation for images
};
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | ドロップエリア横長。ファイルリスト横並び（アイコン+名前+サイズ+削除） |
| タブレット（768px〜1023px） | ドロップエリア横長。ファイルリスト横並び |
| モバイル（〜767px） | ドロップエリア縦長。タップで選択メイン。ファイルリスト縦積み |

## リファレンスコード
```tsx
// FileUploadField コンポーネント簡略版
function FileUploadField({ acceptedTypes, maxFileSize, accentColor }: FileUploadFieldProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndAddFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndAddFiles(Array.from(e.target.files));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragOver ? "border-[accent] bg-[accent]/5" : "border-gray-300 hover:border-[accent]/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">ファイルをドラッグ&ドロップ、またはクリックして選択</p>
        <p className="text-xs text-gray-400 mt-1">{acceptedTypes.join(", ")} / 最大{maxFileSize / 1024 / 1024}MB</p>
      </div>
      <input ref={fileInputRef} type="file" multiple hidden accept={acceptedTypes.join(",")} onChange={handleFileSelect} />
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      {/* File list with preview, progress bar, delete button */}
    </div>
  );
}
```

## 3層チェック

> この機能の核: **紙を持っていかなくても、スマホから書類を送れる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | ドラッグ&ドロップでファイル追加 | ファイルをドロップエリアに置くとリストに追加される | ドロップしても何も起きない/エラー |
| F-2 | クリックでファイル選択ダイアログ | ドロップエリアクリックで`<input type="file">`が開く | クリックしても反応しない |
| F-3 | ファイルタイプバリデーション | 許可外の拡張子が拒否されエラーメッセージ表示 | .exeが受け付けられる/エラーなし |
| F-4 | ファイルサイズバリデーション | 上限超過時に具体的なエラー表示（「10MB以下」等） | サイズ超過でも受け付ける/送信後にエラー |
| F-5 | プログレスバー表示 | アップロード中に進捗バーが0→100%で動く | 進捗表示なし/完了したか不明 |
| F-6 | 画像プレビューサムネイル | 画像ファイル選択時にサムネイルが表示される | プレビューなし/壊れた画像アイコン |
| F-7 | ファイルリスト表示 | ファイル名・サイズ・タイプが一覧に表示される | リストが表示されず何を選んだかわからない |
| F-8 | ファイル削除機能 | 各ファイルの削除ボタンで一覧から除去される | 削除手段がない/削除しても残る |
| F-9 | ドラッグオーバー時ハイライト | ドロップエリアの枠色・背景色が変化する | ドラッグ中に視覚フィードバックなし |
| F-10 | 複数ファイル同時追加 | `multiple`属性で複数ファイルをまとめて追加可能 | 1ファイルずつしか追加できない |
| F-11 | モバイルタップ対応 | タップでカメラロール/ファイル選択が開く | モバイルで何も反応しない |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | ドロップゾーンの視認性 | 破線枠+アイコン+説明文で「ここに置ける」と瞬時にわかる | 1秒以内に操作方法を理解 | 10点 |
| U-2 | エラーメッセージの具体性 | 「5MB以下のPDF/JPG/PNGファイルを選択してください」レベル | 何が問題で何をすべきか明記 | 10点 |
| U-3 | モバイルでの操作性 | タップ1回でカメラロールが開き、選択後すぐにリストに反映 | 44px以上のタッチターゲット | 8点 |
| U-4 | アップロード状態のフィードバック | 進捗バー+完了チェックマークで状態が常にわかる | pending/uploading/completeの3状態表示 | 6点 |
| U-5 | 対応ファイル形式の明示 | ドロップエリア内に「PDF, JPG, PNG / 最大10MB」と常時表示 | 試す前にルールがわかる | 4点 |
| U-6 | ファイルリストの一覧性 | 名前・サイズ・削除ボタンが横一列で視認できる | スクロールなしで3件以上確認可能 | 2点 |

### Layer 3: 価値チェック（紙を持っていかなくて済むか）— 30点

この機能の核「紙を持っていかなくても、スマホから書類を送れる」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 送信完了の安心感 | 「送れた」と確信できるフィードバック | チェックマーク+「送信完了」+受付番号 | 「完了しました」テキストのみ | 完了表示なし/画面遷移なし |
| V-2 | 対応ファイル形式の網羅性 | 業種で必要な形式が全て対応 | PDF/JPG/PNG/DOC/DOCX対応+形式説明 | PDF/JPGのみ | テキストファイルしか受け付けない |
| V-3 | 操作ステップの少なさ | 最少操作で書類送信が完了 | ドロップ→確認→送信の3ステップ | ファイル選択→フォーム入力→確認→送信 | 複数画面遷移+確認ダイアログ3回 |
| V-4 | スマホカメラ連携 | その場で撮影してすぐ送れる | accept属性にcaptureでカメラ直接起動 | カメラロールから選択のみ | カメラからの画像が受け付けられない |
| V-5 | 送信前の内容確認 | 送る前に「何を送るか」を確認できる | プレビュー+ファイル名+サイズ一覧 | ファイル名リストのみ | 確認手段なし/送信後に初めてわかる |
| V-6 | 汎用性 | acceptedTypesの差し替えだけで全業種対応 | Props1つで許可形式・サイズ・件数を変更可能 | コード修正で対応可能 | ハードコードで変更不可 |

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
- **モバイルファースト**: スマホから書類を送ることが核。PCのドラッグ&ドロップはボーナス
- **エラーの事前防止**: エラーが出てから伝えるのではなく、最初から制限を明示する
- **プログレス表示**: 大きなファイルを送る場面が多いため、進捗の可視化が安心感に直結
