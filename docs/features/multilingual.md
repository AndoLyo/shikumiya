# 多言語切替
> ID: 27 | カテゴリ: function | プラン: premium

## 概要
サイト全体の表示言語をリアルタイムで切り替える機能。React Contextベースの言語管理（LangContext）と翻訳キーマッピング（T辞書オブジェクト）により、ページリロードなしで全テキストを即座に切り替える。ヘッダーのロケールスイッチャーで言語を選択し、localStorageで選択を永続化する。国際的な顧客を持つ業種（設計事務所、ホテル、IT企業、輸出入業等）に有効。

## この機能の核
外国人が母国語で情報を理解できる

## 必須要件
- LangContext（React Context）による言語状態のグローバル管理
- 翻訳キー辞書（T オブジェクト）: `Record<string, Record<Lang, string>>`
- `t(key, lang)` ヘルパー関数によるテキスト取得
- ヘッダーまたはフッターにロケールスイッチャーUI（JA / EN トグル）
- localStorageによる言語選択の永続化
- ページリロードなしの即時切替（Context re-render）
- 全セクションのテキストが翻訳キー経由で出力される
- フォントフォールバック対応（日本語/英語で異なるfont-family指定可）
- lang属性の切替（`<html lang="ja">` → `<html lang="en">`）

## 業種別バリエーション
| 業種 | 対応言語 | 翻訳が特に重要なセクション |
|---|---|---|
| 建築設計事務所 | JA / EN | Works（作品名）、About（経歴）、Contact |
| ホテル・旅館 | JA / EN / ZH / KO | 客室紹介、料金、アクセス、予約フォーム |
| IT・スタートアップ | JA / EN | サービス説明、料金プラン、導入事例 |
| 小売・EC | JA / EN | 商品説明、送料・返品ポリシー、FAQ |
| 教育・スクール | JA / EN | コース内容、入学案内、学費 |
| 製造・輸出 | JA / EN / ZH | 製品スペック、品質認証、お問い合わせ |

## 既存テンプレートとの接続
### clean-arch-pro（実装済み）
- **Context定義**: `LangContext`（32行目）+ `useLang()` フック（33行目）
- **翻訳辞書**: `T` オブジェクト（35〜93行目）— 約60キー（hero/works/panorama/about/contact等）
- **`t()` 関数**: `T[key]?.[lang] ?? key`（95行目）
- **Provider**: ページルートで `<LangContext.Provider value={{ lang, setLang }}>`（1117行目）
- **スイッチャー**: ヘッダー内に `JA / EN` トグルボタン配置
- **対応言語**: `type Lang = "ja" | "en"`
- **配色**: テキスト `text-gray-800` ベース、スイッチャー `border-gray-200`

### warm-craft-pro / trust-navy-pro
- 多言語未実装。clean-arch-proのLangContextパターンを移植可能
- warm-craft-pro: 翻訳辞書に「施工実績」「お客様の声」「見学会予約」等のキーを追加
- trust-navy-pro: 翻訳辞書に「事業案内」「プロジェクト」「採用情報」等のキーを追加

### 共通実装パターン
```
Page Component (LangContext.Provider)
  ├── Header（ロケールスイッチャー配置）
  ├── 各セクション内で useLang() → t(key, lang) でテキスト取得
  └── Footer
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
├── LangContext定義（ファイル上部）
├── T辞書オブジェクト
├── t()ヘルパー関数
└── 各セクションで useLang() を使用

※ 分割する場合:
src/components/portfolio-templates/{template-id}/
├── LangProvider.tsx
├── translations.ts
├── LocaleSwitcher.tsx
└── useLang.ts
```

### Props / データ構造
```typescript
type Lang = "ja" | "en";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

type TranslationKey = string;
type TranslationDict = Record<TranslationKey, Record<Lang, string>>;

interface LocaleSwitcherProps {
  availableLocales: Lang[];
  currentLocale: Lang;
  onLocaleChange: (lang: Lang) => void;
  variant: "toggle" | "dropdown" | "flags";
}

const T: TranslationDict = {
  "hero.tagline":  { ja: "空間に、静けさを。", en: "Silence in space." },
  "contact.send":  { ja: "送信する",           en: "SEND MESSAGE" },
};

function t(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? key;
}
```

### 状態管理
```typescript
const [lang, setLang] = useState<Lang>(() => {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("locale") as Lang) || "ja";
  }
  return "ja";
});

useEffect(() => {
  localStorage.setItem("locale", lang);
  document.documentElement.lang = lang;
}, [lang]);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | ヘッダー右端にトグル表示（JA / EN テキストボタン） |
| タブレット（768px〜1023px） | ヘッダー右端にトグル表示 |
| モバイル（〜767px） | ハンバーガーメニュー内にロケール選択を配置 |

## リファレンスコード
```tsx
// clean-arch-pro の実装パターン
type Lang = "ja" | "en";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "ja", setLang: () => {},
});
function useLang() { return useContext(LangContext); }

const T: Record<string, Record<Lang, string>> = {
  "hero.tagline":   { ja: "空間に、静けさを。", en: "Silence in space." },
  "works.title":    { ja: "作品一覧",           en: "Works" },
  "contact.send":   { ja: "SEND MESSAGE",       en: "SEND MESSAGE" },
};

function t(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? key;
}

// In any section:
function HeroSection() {
  const { lang } = useLang();
  return <h1>{t("hero.tagline", lang)}</h1>;
}

// Page root:
export default function Page() {
  const [lang, setLang] = useState<Lang>("ja");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <Header /> {/* locale switcher inside */}
      <HeroSection />
    </LangContext.Provider>
  );
}
```

## 3層チェック

> この機能の核: **外国人が母国語で情報を理解できる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 言語切替UI | ロケールスイッチャー（JA/ENトグル）がヘッダーに配置されている | 切替UIがない。隠れている |
| F-2 | 即時反映 | 言語切替でページリロードなしに全テキストが即座に変わる | リロードが必要。一部しか変わらない |
| F-3 | 全テキスト翻訳 | 翻訳辞書に全セクションのテキストが網羅されている | 一部セクションが翻訳されず日本語のまま残る |
| F-4 | locale保持 | localStorageに言語選択が保存され、再訪問時に復元される | 毎回デフォルト言語に戻る。永続化未実装 |
| F-5 | レイアウト崩れなし | 日本語/英語どちらでもレイアウトが崩れない | 英語に切り替えるとテキストがはみ出す。ボタンが折り返す |
| F-6 | LangContext | LangContextがページルートでProviderとして正しく設定されている | Contextなし。propsバケツリレーで渡している |
| F-7 | フォールバック | 未翻訳キーにフォールバック（キー名をそのまま表示）がある | 未翻訳キーで空文字やundefinedが表示される |
| F-8 | html lang属性 | `document.documentElement.lang` が切替に連動して変更される | lang属性が固定。切り替えても"ja"のまま |
| F-9 | フォーム翻訳 | フォームのラベル・プレースホルダー・ボタン文言も翻訳対象 | ボタンだけ「送信する」のまま。プレースホルダーが日本語 |
| F-10 | モバイルメニュー内切替 | ハンバーガーメニュー内でもロケール切替が可能 | デスクトップのみ。モバイルで切替手段なし |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 切替ボタンの発見しやすさ | 言語切替ボタンが**ヘッダー内の目立つ位置**にある | ヘッダー右端またはナビ横。国際ユーザーが3秒以内に発見できる | 10点 |
| U-2 | 切替後の即時反映 | ボタン押下で**レイアウトシフトなしに即座に切り替わる** | テキスト長の変化でガタつかない。アニメーション遷移がスムーズ | 8点 |
| U-3 | 翻訳抜けがないか | 切替後に**日本語テキストが1つも残っていない** | 画像内テキスト以外の全HTML要素が翻訳済み | 10点 |
| U-4 | フォント表示品質 | 日本語/英語どちらでも**フォントが美しく表示される** | 英語時にsans-serifフォントが適切に適用。文字間隔が自然 | 5点 |
| U-5 | 再訪問時の復元 | 翌日訪問しても**前回選んだ言語が維持**されている | localStorageから即復元。初回レンダリングでフラッシュしない | 7点 |

### Layer 3: 価値チェック（母国語で理解できるか）— 30点

この機能の核「外国人が母国語で情報を理解できる」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 母国語で読めて助かる | 外国人が**「母国語で読めて助かる」**と感じる | 全セクションが自然な英語。専門用語も適切に翻訳 | 全セクション翻訳済み。一部ぎこちないが意味は通じる | 半分以上が日本語のまま。外国人が理解できない |
| V-2 | 翻訳品質 | 翻訳が**機械翻訳感がなく自然な文章** | ネイティブチェック済みレベル。業界用語も適切 | 文法は正しいが直訳的な箇所がある | Google翻訳コピペ。不自然で意味が通じない |
| V-3 | 重要情報の翻訳 | 料金・営業時間・アクセス等の**判断に必要な情報**が全て翻訳 | 料金表、営業時間、アクセス方法、FAQ全てが英語対応 | 主要セクションは翻訳。FAQの一部が日本語 | 料金や営業時間が日本語のみ。判断できない |
| V-4 | 問い合わせ可能 | 外国人が**英語でフォーム送信**できる | フォームラベル+プレースホルダー+バリデーションメッセージ+送信完了画面が全て英語 | フォームのラベルとボタンが英語 | フォームが日本語のみ。外国人が入力できない |
| V-5 | 拡張性 | **3言語以上への拡張**が容易な構造 | Lang型にzh/koを追加するだけ。T辞書にキーを追加するだけ | 2言語は容易。3言語目で一部改修が必要 | ハードコードで日英のみ。拡張にはリファクタリングが必要 |
| V-6 | SEO対応 | lang属性の切替で**クローラーに正しい言語ヒント**が提供される | `<html lang="en">` + hreflang alternate対応 | html lang属性が切替に連動 | lang属性が固定。クローラーが言語を誤認 |

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
- LangContext+全テキスト翻訳+localStorage永続化+html lang属性が全て動作（L1: 30/30）
- ヘッダー右端にJA/ENトグル。切替即座。レイアウトシフトなし。翻訳抜けゼロ（L2: 35/40）
- 全セクション自然な英語。料金・FAQ含む。フォーム完全英語対応。hreflang対応（L3: 25/30）

**80点の実装:**
- 言語切替は全て動作する（L1: 30/30）
- 切替ボタンあり。即時反映。一部レイアウトシフトあり（L2: 28/40）
- 主要セクションは翻訳済み。FAQ一部日本語。直訳的な箇所あり（L3: 22/30）

**70点の実装:**
- 切替は動く。フォーム翻訳が不完全（L1: 30/30）
- 切替ボタンがわかりにくい。モバイルで切替不可（L2: 22/40）
- 半分のセクションが未翻訳。機械翻訳感が強い（L3: 18/30）

### この機能固有の重要判定ポイント

1. **翻訳カバレッジ**: 翻訳辞書のキー数とページ上のテキスト要素数を比較。**翻訳率80%未満はF-3自動FAIL**。部分翻訳は未翻訳より印象が悪い
2. **フォーム翻訳の完全性**: フォームのラベルが日本語のまま残ると外国人が入力不可。**フォーム要素の1つでも未翻訳ならF-9自動FAIL**
3. **初回レンダリングフラッシュ**: localStorageから言語を復元する前に日本語が一瞬表示されるのは低品質。**フラッシュが視認できる場合U-5は0点**
