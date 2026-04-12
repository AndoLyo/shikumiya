# お問い合わせフォーム
> ID: contact-form | カテゴリ: parts | プラン: lite

## 概要
顧客サイトの問い合わせ導線の最終到達点となるフォームセクション。業種を問わず、あらゆるビジネスサイトで最も重要なコンバージョンポイントである。フォームの入力項目は業種ごとに大きく異なり（建築なら見積もり依頼、飲食なら予約、美容なら希望メニュー等）、問い合わせ種別のラジオボタン/セレクト、テキスト入力、送信完了表示までを一貫して実装する。既存3テンプレートすべてに `ContactSection()` が実装済みのため、本機能は既存コードの編集・拡張で対応する。

## この機能の核
「ちょっと聞くだけ」のつもりで送信ボタンを押せる

## 必須要件
- `<form>` タグ内に `onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}` で送信処理
- 問い合わせ種別: ラジオボタン（warm-craft / clean-arch）またはセレクトボックス（trust-navy）で選択
- 必須フィールド: 氏名 + メールアドレス（`required` 属性 + `<span className="text-red-400">*</span>`）
- 任意フィールド: 業種に応じた追加項目（電話番号、住所、希望日時、人数等）
- 送信完了表示: `submitted` state で入力フォームと完了メッセージを切り替え
- フォーカス状態: `focus:outline-none focus:border-{accent} focus:ring-{accent}/10`
- `placeholder` テキストで入力例を表示
- バリデーション: HTML5 標準バリデーション（`required`, `type="email"`, `type="tel"`）
- プライバシーポリシー同意チェックボックス（法的要件に応じて追加）

## 業種別バリエーション

### 建築・建設
種別選択: 見積もり依頼 / カタログ請求 / 来場予約 / その他
入力項目: 氏名* / 電話番号 / メールアドレス* / 住所 / ご相談内容
備考: 「ご予算」「希望時期」「土地の有無」を placeholder で誘導

### 小売・EC
種別選択: 商品について / 返品・交換 / 注文に関して / その他
入力項目: 氏名* / メールアドレス* / 注文番号 / お問い合わせ内容*
備考: 注文番号フィールドで既存顧客を識別

### 飲食
種別選択: 予約 / ケータリング / 貸切 / その他
入力項目: 氏名* / 電話番号* / 人数 / 希望日時 / ご要望
備考: 人数は `<select>` or `<input type="number">`、希望日時は `<input type="date">`

### 美容・サロン
種別選択: 予約 / メニュー相談 / 料金について / その他
入力項目: 氏名* / 電話番号* / 希望日時 / 希望メニュー / ご要望
備考: 希望メニューは `<select>` でメニュー一覧から選択

### 医療・クリニック
種別選択: 初診予約 / 再診予約 / セカンドオピニオン / その他
入力項目: 氏名* / 電話番号* / 生年月日 / 希望日時 / 症状・ご相談内容
備考: 個人情報の取り扱いに関する同意チェックボックスを必須配置

### 士業・コンサルティング
種別選択: 無料相談 / 見積もり / 顧問契約 / その他
入力項目: 会社名 / 氏名* / メールアドレス* / 電話番号 / ご相談内容*
備考: 会社名フィールドで法人/個人を判別

## 既存テンプレートとの接続

### warm-craft（暖色ナチュラル系）
- **ContactSection()**: `src/app/portfolio-templates/warm-craft/page.tsx` 行636〜792
- 種別選択: ラジオボタン `has-[:checked]` で選択状態をスタイリング（CSS のみ、JS 不要）
  - 種別: `["新築のご相談", "リフォームのご相談", "お見積り依頼", "その他"]`
- 入力スタイル: `bg-[#FAF7F2] border-[#E8DFD3] focus:border-[#7BA23F] focus:ring-[#7BA23F]/10`
- 追加要素: フォーム上部に電話CTA カード `bg-gradient-to-br from-[#7BA23F]/5 to-[#7BA23F]/10`
- 送信ボタン: `bg-[#7BA23F] hover:bg-[#5C7A2E]`
- 完了表示: チェックアイコン + 「送信ありがとうございます」+ 「2営業日以内にご連絡」
- 下部情報カード: 所在地・メール・営業時間の3カラム

### trust-navy（ネイビー重厚系）
- **ContactSection()**: `src/app/portfolio-templates/trust-navy/page.tsx` 行565〜701
- 種別選択: `<select>` ドロップダウン（`appearance-none`）
  - 種別: `["新築工事のご相談", "改修・リノベーション", "耐震診断・補強工事", "お見積りのご依頼", "採用について", "その他"]`
- 追加フィールド: 会社名・団体名（法人向けを想定）
- 入力スタイル: `border-gray-200 focus:border-[#1B3A5C] focus:ring-[#1B3A5C]/20`
- 追加要素: 電話 + メール の2カラムカード（フォーム上部）
- 送信ボタン: `bg-[#1B3A5C] hover:bg-[#2A5080]`
- 下部アクセス: 所在地 + 来社/オンライン対応可能の注記

### clean-arch（ミニマルモノクロ系）
- **ContactSection()**: `src/app/portfolio-templates/clean-arch/page.tsx` 行448〜571
- 種別選択: ラジオボタン `has-[:checked]` 
  - 種別: `["住宅の設計", "店舗の設計", "オフィスの設計", "リノベーション", "その他"]`
- 入力スタイル: ボーダーレス下線 `border-0 border-b border-gray-200 focus:border-gray-800 bg-transparent`
- ミニマル表記: ラベルは `text-[10px] tracking-[0.2em]`
- 送信ボタン: `bg-gray-800 hover:bg-gray-700`（英字表記 `"SEND MESSAGE"`）
- 連絡先リンク: メール + 電話のボーダーボックス（フォーム上部）
- SNS リンク: フォーム下部に Instagram リンク

### 編集時の共通方針
- 種別選択の選択肢を業種に応じて差し替える
- 入力フィールドを業種に応じて追加/削除する（日時、人数、注文番号等）
- 色・フォント・レイアウトはテンプレートのトーンを維持する
- `submitted` state の完了メッセージ文言を業種に応じて調整

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── ContactSection() コンポーネント（モノリシック内で定義）
```

### Props / データ構造
```typescript
interface FormField {
  id: string;              // "name" | "email" | "phone" | "company" | "date" | "guests"
  label: string;           // "お名前" | "メールアドレス"
  type: string;            // "text" | "email" | "tel" | "date" | "number"
  placeholder: string;     // "山田 花子"
  required: boolean;
  colSpan?: 1 | 2;         // grid 内の幅（1=半分, 2=全幅）
}

interface InquiryType {
  label: string;           // "見積もり依頼"
  value: string;           // "estimate"
}

interface ContactFormConfig {
  sectionId: string;       // "contact"
  heading: string;         // "お問い合わせ"
  subtext: string;         // "お気軽にご相談ください。"
  inquiryTypes: InquiryType[];
  inquiryInputStyle: "radio" | "select";  // warm-craft/clean-arch vs trust-navy
  fields: FormField[];
  submitLabel: string;     // "送信する" | "SEND MESSAGE"
  completionMessage: string;  // "送信ありがとうございます"
  completionSubtext: string;  // "2営業日以内にご連絡いたします"
  showPhoneCta: boolean;   // warm-craft: true
  showPrivacyConsent: boolean;
}
```

### 状態管理
```typescript
const [submitted, setSubmitted] = useState(false);

// フォーム送信ハンドラ
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitted(true);
};
```

## リファレンスコード

### warm-craft: ラジオボタン種別選択（has-[:checked] パターン）
```tsx
// src/app/portfolio-templates/warm-craft/page.tsx
<div className="flex flex-wrap gap-2">
  {["新築のご相談", "リフォームのご相談", "お見積り依頼", "その他"].map((type) => (
    <label key={type}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8DFD3] text-sm text-[#3D3226] cursor-pointer
        hover:border-[#7BA23F]/30 hover:bg-[#7BA23F]/5 transition-all
        has-[:checked]:bg-[#7BA23F]/10 has-[:checked]:border-[#7BA23F]/30 has-[:checked]:text-[#7BA23F]">
      <input type="radio" name="type" value={type} className="sr-only" />
      {type}
    </label>
  ))}
</div>
```

### trust-navy: セレクトボックス種別選択
```tsx
// src/app/portfolio-templates/trust-navy/page.tsx
<select className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-700
  focus:outline-none focus:border-[#1B3A5C] appearance-none bg-white">
  <option>選択してください</option>
  <option>新築工事のご相談</option>
  <option>改修・リノベーション</option>
  <option>耐震診断・補強工事</option>
  <option>お見積りのご依頼</option>
  <option>採用について</option>
  <option>その他</option>
</select>
```

### clean-arch: ボーダーレス下線入力フィールド
```tsx
// src/app/portfolio-templates/clean-arch/page.tsx
<input
  type="text"
  required
  placeholder="高橋 花子"
  className="w-full px-0 py-3 border-0 border-b border-gray-200 text-gray-800 text-sm
    placeholder:text-gray-300 focus:outline-none focus:border-gray-800
    transition-colors bg-transparent"
/>
```

### 共通: 送信完了表示（warm-craft 例）
```tsx
// src/app/portfolio-templates/warm-craft/page.tsx
{submitted ? (
  <div className="p-10 text-center">
    <div className="w-14 h-14 rounded-full bg-[#7BA23F]/10 flex items-center justify-center mx-auto mb-4">
      <Check className="w-7 h-7 text-[#7BA23F]" />
    </div>
    <p className="text-[#3D3226] text-lg font-bold mb-2">送信ありがとうございます</p>
    <p className="text-[#8B7D6B] text-sm">2営業日以内にご連絡いたします。</p>
  </div>
) : (
  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} ...>
    {/* フォーム本体 */}
  </form>
)}
```

## 3層チェック

> この機能の核: **「ちょっと聞くだけ」のつもりで送信ボタンを押せる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | フォーム送信 | `onSubmit`で`e.preventDefault()`を呼び、送信処理が実行される | ページリロードが発生。送信処理が動かない |
| F-2 | 必須バリデーション | 氏名・メールに`required`属性+赤アスタリスク`*`が付いている | 空欄で送信できてしまう。アスタリスクなし |
| F-3 | 送信完了表示 | `submitted` stateでフォーム→完了メッセージに正しく切り替わる | 送信後に画面が変わらない。エラー時も完了表示 |
| F-4 | ラジオボタン | `has-[:checked]`スタイリングが機能する（warm-craft/clean-arch） | チェック状態が見えない。スタイルが適用されない |
| F-5 | セレクトボックス | `appearance-none`が適用されカスタムスタイルが表示される（trust-navy） | ブラウザデフォルトのselect表示 |
| F-6 | フォーカス状態 | フォーカス時にテンプレートのアクセントカラーでborder/ringが表示 | フォーカス表示なし。デフォルトのoutline |
| F-7 | プライバシー同意 | 必要な業種でプライバシーポリシー同意チェックボックスが配置されている | 医療サイトなのに同意チェックなし |
| F-8 | レスポンシブ | モバイルで全幅、デスクトップで`sm:grid-cols-2`のグリッド | 全端末でシングルカラム。またはモバイルでグリッドが崩れる |
| F-9 | 送信ボタン | ボタンのラベル・色がテンプレートのトーンと統一されている | ボタン色がテンプレートと不一致 |
| F-10 | placeholderテキスト | 業種に適した入力例がplaceholderに設定されている | placeholderなし。または業種と無関係な例 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなくフォームを完了できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 項目数の適切さ | フォームの項目数が**5個以下**で「簡単そう」と感じる | 必須項目3個以下+任意項目2個以下が理想。8個超は即減点 | 10点 |
| U-2 | placeholder/ヘルプの有無 | 全入力欄に**何を書けばいいか**のヒントがある | placeholderに入力例。必要に応じてヘルプテキスト | 8点 |
| U-3 | エラーメッセージの位置と明確さ | 入力ミス時に**何をどう直すか**が即座にわかる | エラー箇所のすぐ下に赤文字で具体的メッセージ（「有効なメールアドレスを入力してください」等） | 8点 |
| U-4 | 送信中状態の表示 | 送信ボタンを押した後に**処理中**であることがわかる | ボタンがdisabled+ローディングスピナーまたは「送信中...」テキスト | 7点 |
| U-5 | フォーム以外の連絡手段 | **電話やメール**でも問い合わせできることがわかる | フォーム上部に電話番号カード（warm-craft）または電話/メールカード（trust-navy） | 7点 |

### Layer 3: 価値チェック（気軽に送信できるか）— 30点

この機能の核「ちょっと聞くだけのつもりで送信ボタンを押せる」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「面倒くさい」と感じないか | フォームを見た瞬間に**「これなら簡単」**と感じる | 氏名+メール+種別選択+メッセージの4項目。「約1分で完了」の表記 | 5項目。特に「簡単」とは思わないが苦にならない | 15項目。住所+生年月日+年収まで聞かれて離脱 |
| V-2 | 個人情報への不安がケアされているか | 電話番号やメールを入力する前に**安心材料**がある | プライバシーポリシーリンク+「お客様の情報は厳重に管理いたします」の一文 | プライバシーポリシーリンクのみ | 何の説明もなく個人情報を求められる |
| V-3 | 送信後に安心できるか | 送信完了後に**次に何が起きるか**がわかる | 「送信しました。2営業日以内にメールでご連絡いたします。」+チェックアイコン | 「送信しました」のみ | 画面が変わらず送れたかわからない |
| V-4 | 問い合わせ種別が業種に合っているか | 選択肢が**自分の目的にピッタリ**合っている | 建築:「新築の相談」「リフォームの相談」「見積もり依頼」「その他」 | 種別はあるが粒度が粗い（「お問い合わせ」「その他」のみ） | 種別選択なし。または業種と無関係な選択肢 |
| V-5 | スマホで入力完了できるか | スマホだけで**ストレスなくフォーム送信**が完了する | 入力欄が大きくタップしやすい。キーボードタイプ適切(email/tel)。送信ボタンが押しやすい | モバイル対応はあるが入力欄がやや小さい | 入力欄が小さすぎてタップミス連発。送信ボタンが見えない |

## スコアリング

### 合計100点の内訳

| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 10項目全PASSで30点。1つでもFAILなら0点（作り直し） |
| Layer 2: UX | 40点 | 5項目、各項目の配点通り。部分点あり |
| Layer 3: 価値 | 30点 | 5項目、各6点。部分点あり |

### 判定ルール

| スコア | 判定 | アクション |
|---|---|---|
| 90〜100 | **PASS** | そのまま次の機能へ。核が実現されている |
| 80〜89 | **CONDITIONAL** | Layer 2 or 3 の減点箇所を特定し修正。修正後に再チェック |
| 70〜79 | **FAIL** | Layer 1 は通るがUXか価値が不足。原因を記録し、該当層を作り直し |
| 0〜69 | **CRITICAL FAIL** | Layer 1 がFAIL。機能として動いていない。全体を作り直し |

### 採点の具体例

**90点の実装:**
- フォーム送信・バリデーション・完了表示・ラジオボタン全て動作。アクセントカラー統一（L1: 30/30）
- 4項目で「簡単」。placeholder完備。エラーが具体的。送信中スピナーあり。電話カードあり（L2: 36/40）
- 「約1分で完了」表記。プライバシーポリシー+安心文言。「2営業日以内に連絡」。業種に合った種別選択（L3: 24/30）

**80点の実装:**
- 基本機能は動作。送信中状態の表示が未実装（L1: 30/30）
- 5項目。placeholder基本あり。エラーメッセージがやや一般的（L2: 28/40）
- プライバシーリンクあり。完了メッセージあり。種別選択がやや粗い（L3: 22/30）

**70点の実装:**
- フォームは送信できるがバリデーションが不完全（L1: 30/30 ギリギリ）
- 8項目で多い。placeholderなし。エラーが「入力エラーがあります」のみ（L2: 22/40）
- プライバシーの説明なし。完了メッセージが簡素。種別が「お問い合わせ/その他」のみ（L3: 18/30）

### この機能固有の重要判定ポイント

1. **項目数の黄金比**: 必須3+任意2=5項目以下が理想。8項目超は離脱率が急上昇。U-1で厳しく評価。「ちょっと聞くだけ」のハードルを超えないこと
2. **問い合わせ種別の業種適合**: 汎用的すぎる選択肢（「お問い合わせ」「その他」のみ）は減点。業種ごとのユーザーニーズに合った具体的な選択肢を用意。V-4で評価
3. **CSS実装の正確性**: `has-[:checked]`(ラジオボタン)/`appearance-none`(セレクト)などCSS onlyのUI実装が正しく動作しているか。ブラウザ互換性も要確認
4. **フォーム以外の連絡手段**: warm-craftの電話CTAカード、trust-navyの電話/メールカードなど、フォーム以外の選択肢がU-5で評価。「電話の方が早い」人への配慮
