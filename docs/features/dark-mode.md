# ダークモード切替
> ID: 35 | カテゴリ: function | プラン: middle

## 概要
ヘッダーまたはフッターに配置するダークモード切替トグル。システム設定（`prefers-color-scheme`）の自動検出、localStorageによるユーザー選択の永続化、全カラーのダークバリアント定義を備える。太陽/月アイコンの回転アニメーション付きトグルスイッチで、スムーズなモード遷移を実現する。業種を問わず、ユーザーの視覚的好みに対応するユニバーサルUI機能。暗い背景で写真・作品が映えるため、ポートフォリオ型サイトとの相性が特に良い。

## この機能の核
夜に見ても眩しくない

## 必須要件
- システム設定検出: `window.matchMedia("(prefers-color-scheme: dark)")` による初期値判定
- localStorage永続化: ユーザー選択を保存し、再訪問時に復元
- トグルUI: 太陽（Sun）/ 月（Moon）アイコンの切替ボタン
- アイコンアニメーション: 切替時にrotate + scale のトランジション
- カラー定義: ライト/ダーク両方の全色変数（背景、テキスト、ボーダー、アクセント等）
- `<html>` または `<body>` へのクラス付与（`dark` クラス or data属性）
- トランジション: 背景色・テキスト色の切替にtransition-colors適用（チラつき防止）
- SSRフラッシュ防止: Script tag でレンダリング前にテーマを適用

## 業種別バリエーション
| 業種 | ダークモードの効果 | 特記事項 |
|---|---|---|
| 建築設計事務所 | 施工写真が黒背景で際立つ | ミニマルデザインとの親和性が高い |
| 飲食 | 料理写真が高級感を増す | 暗い照明の店内雰囲気と統一 |
| IT・スタートアップ | 開発者ユーザーへの配慮 | テック感の演出 |
| 写真家・アーティスト | 作品鑑賞に最適な背景 | ギャラリー的な没入体験 |
| 医療 | 目の疲労軽減 | 長時間閲覧への配慮 |
| 全業種共通 | ユーザビリティ向上 | 夜間閲覧時の快適性 |

## 既存テンプレートとの接続
### warm-craft
- **現在のカラー**: bg `#FAF7F2`, text `#3D3226`, accent `#7BA23F`, border `#E8DFD3`
- **ダークバリアント案**: bg `#1A1614`, text `#E8DFD3`, accent `#8BB84F`, border `#3D3226`
- **配置**: Headerの右端（ナビゲーションとCTAの間）

### trust-navy
- **現在のカラー**: bg `#F0F4F8`, text `#1B3A5C`, accent `#C8A96E`, border `#E0E5EC`
- **ダークバリアント案**: bg `#0D1A2A`, text `#C8D5E3`, accent `#D4B87E`, border `#1B3A5C`
- **配置**: Headerの右端

### clean-arch
- **現在のカラー**: bg `#FFFFFF` / `#EDEBE5`, text `#1F2937`, accent gray tones
- **ダークバリアント案**: bg `#111111`, text `#E5E5E5`, accent `#888888`
- **配置**: Headerの右端（既存の LangSwitcher の隣）

### 共通実装パターン
```
<html> に dark クラス付与
  └── Page Component
      ├── Header（DarkModeToggle 配置）
      ├── 各セクション（Tailwind dark: バリアント or CSS変数切替）
      └── Footer

CSS変数パターン:
:root { --bg: #FAF7F2; --text: #3D3226; }
.dark { --bg: #1A1614; --text: #E8DFD3; }

Tailwind dark: パターン:
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
└── DarkModeToggle コンポーネント（Header内に配置）

※ 分割する場合:
src/components/portfolio-templates/{template-id}/
├── DarkModeToggle.tsx
└── ThemeProvider.tsx     ← Context + localStorage管理
```

### Props / データ構造
```typescript
type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";  // system resolved
  setTheme: (theme: Theme) => void;
}

interface DarkModeToggleProps {
  size?: number;              // icon size, default 20
  accentColor?: string;
  position?: "header" | "footer" | "floating";
  animationDuration?: number; // ms, default 300
}

interface ColorPalette {
  light: {
    background: string;
    foreground: string;
    accent: string;
    border: string;
    muted: string;
    card: string;
  };
  dark: {
    background: string;
    foreground: string;
    accent: string;
    border: string;
    muted: string;
    card: string;
  };
}
```

### 状態管理
```typescript
const [theme, setTheme] = useState<Theme>(() => {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("theme") as Theme) || "system";
  }
  return "system";
});

const resolvedTheme = useMemo(() => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}, [theme]);

useEffect(() => {
  localStorage.setItem("theme", theme);
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
}, [theme, resolvedTheme]);

// Listen for system preference changes
useEffect(() => {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => { if (theme === "system") setTheme("system"); };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}, [theme]);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | ヘッダー右端にアイコンボタン表示 |
| タブレット（768px〜1023px） | ヘッダー右端にアイコンボタン表示 |
| モバイル（〜767px） | ハンバーガーメニュー内にトグル配置、またはヘッダーに小さいアイコン |

## リファレンスコード
```tsx
// DarkModeToggle コンポーネント
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme(); // from ThemeContext

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center
        hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={resolvedTheme === "dark" ? "ライトモードに切替" : "ダークモードに切替"}
    >
      <AnimatePresence mode="wait">
        {resolvedTheme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5 text-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5 text-orange-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// SSRフラッシュ防止（layout.tsx内）
// <script dangerouslySetInnerHTML={{ __html: `
//   (function() {
//     var t = localStorage.getItem('theme');
//     if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme:dark)').matches)) {
//       document.documentElement.classList.add('dark');
//     }
//   })();
// `}} />
```

## 3層チェック

> この機能の核: **夜に見ても眩しくない**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | トグルボタンで切替 | クリックでライト/ダークが即座に切り替わる | クリックしても反応なし |
| F-2 | アイコンアニメーション | 太陽/月にrotate+scaleのトランジション適用 | アニメーションなし/カクつく |
| F-3 | システム設定検出 | `prefers-color-scheme`が初期値として反映 | OS設定を無視してライト固定 |
| F-4 | localStorage永続化 | 選択が保存され再訪問時に復元される | 毎回ライトに戻る |
| F-5 | 全セクション色切替 | 背景色・テキスト色・ボーダー色が全セクションで切替 | 一部セクションだけダークのまま残る |
| F-6 | アクセントカラー調整 | ダークモードでアクセントカラーが適切に調整 | アクセント色がダーク背景に溶ける |
| F-7 | transition-colors適用 | チラつきなく滑らかに切り替わる | 一瞬白→ダークのフラッシュ |
| F-8 | SSRフラッシュ防止 | script tagでレンダリング前にテーマ適用 | 初回表示でライト→ダークのちらつき |
| F-9 | 画像/SVGの視認性 | ダークモードでも画像が見える（コントラスト確保） | 画像周囲に白枠が残る |
| F-10 | フォーム入力対応 | 入力フィールドの背景・文字色がダーク対応 | 入力欄だけ白背景で文字が見えない |
| F-11 | aria-label対応 | 切替状態に応じた適切なラベル設定 | aria-labelなし/状態と不一致 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 切替の即時性 | トグル操作から切替完了まで遅延なし | 100ms以内に全色が切り替わる | 10点 |
| U-2 | トグルボタンの発見しやすさ | ヘッダー右端に太陽/月アイコンが見える | 2秒以内にトグルを発見 | 10点 |
| U-3 | 目に優しいダーク配色 | 真っ黒(#000)でなく、適度に暗い背景色 | WCAG AA コントラスト4.5:1以上 | 8点 |
| U-4 | 一貫性 | 全セクションで統一されたダークパレット | ダーク漏れのセクションがゼロ | 6点 |
| U-5 | OS設定への追従 | OS側のダークモード切替に即座に反応 | system設定変更でリアルタイム反映 | 4点 |
| U-6 | モバイルでのトグル操作 | ハンバーガーメニュー内orヘッダーに小アイコン | タッチターゲット44px以上 | 2点 |

### Layer 3: 価値チェック（夜でも快適か）— 30点

この機能の核「夜に見ても眩しくない」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 夜間の快適性 | ベッドで見ても眩しくない | 暗い部屋で目が痛くならない配色 | ダークだが一部明るい要素が目立つ | 真っ白い画面が表示される |
| V-2 | 中途半端なダークなし | 全要素がダークモードに対応 | ヘッダー/本文/フッター/モーダル全対応 | 本文はダークだがモーダルが白い | 半分以上のセクションが白いまま |
| V-3 | 写真・作品の映え | ダーク背景で写真が際立つ | 黒背景でギャラリーが美術館のように映える | ダーク背景だが写真の色味が沈む | 画像が見えない/白枠が残る |
| V-4 | 自動適用の自然さ | OS設定ユーザーが違和感なく閲覧 | ダークモードユーザーが意識せず快適 | 自動適用されるが微妙に色が違う | OS設定を無視/手動切替のみ |
| V-5 | 復帰時の一貫性 | 翌日訪問してもダークが維持 | localStorage+system fallbackで確実 | localStorageで保持 | 毎回リセットされる |
| V-6 | 汎用性 | カラーパレットの差し替えで全テンプレート対応 | CSS変数1セットの差し替えでダーク対応 | Tailwind dark:クラスで個別対応 | テンプレートごとにフルリライト必要 |

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
- **一貫性が命**: 1セクションでもダーク漏れがあると「中途半端」と感じて信頼を失う
- **SSRフラッシュ**: 初回表示の白→ダークのちらつきは体験を大きく損なう。script tagでの事前適用が必須
- **コントラスト**: ダークモードでもWCAG AA基準4.5:1以上を確保。暗すぎて読めないのもNG
