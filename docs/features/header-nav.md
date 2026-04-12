# ヘッダー+ナビゲーション
> ID: header-nav | カテゴリ: parts | プラン: lite

## 概要
サイト全ページに固定表示されるグローバルヘッダー。ロゴ、メインナビゲーション、CTA（電話/お問い合わせ）を配置し、サイト内の主要セクションへ即時遷移できる導線を提供する。第一印象（信頼感）を左右する最重要パーツであり、業種を問わずあらゆるビジネスサイトの骨格となる。既存3テンプレートすべてに `Header()` が実装済みのため、本機能は「新規作成」ではなく「既存コードの編集・拡張」で対応する。

## この機能の核
「どのページに何があるか」が迷わずわかる

## 必須要件
- ページ上部に `position: fixed` で常時表示（`z-50` 以上）
- ロゴは左上に配置し、クリックでページトップへ遷移
- ナビ項目は業種に応じて 3〜7 項目を柔軟に設定可能
- CTA（お問い合わせ/電話/予約等）は右端に目立つ色で常時表示
- モバイル（`lg` 未満）ではハンバーガーメニューに切り替え
- ハンバーガーメニューは Framer Motion `AnimatePresence` でアニメーション表示
- スクロール追跡: ページトップで透明背景 → スクロール後は不透明背景＋シャドウ
- キーボードナビゲーション対応（Tab / Enter / Escape）
- `prefers-reduced-motion` 対応

## 業種別バリエーション

### 建築・建設
ナビ項目: 企業情報 / 技術 / 施工実績 / お問い合わせ
CTA: 電話番号 `tel:` リンク + お見積りボタン

### 小売・EC
ナビ項目: 商品 / 店舗一覧 / 会社概要 / お問い合わせ
CTA: オンラインストアボタン + カートアイコン

### 飲食
ナビ項目: メニュー / 店舗案内 / こだわり / 予約
CTA: 予約ボタン（`#reservation` or 外部リンク）

### 美容・サロン
ナビ項目: メニュー / スタッフ / サロン案内 / 予約
CTA: ネット予約ボタン（`#booking` or 外部リンク）

### 医療・クリニック
ナビ項目: 診療案内 / 医師紹介 / 施設紹介 / アクセス / 予約
CTA: Web予約ボタン + 電話番号

### 士業・コンサルティング
ナビ項目: サービス / 実績 / メンバー / コラム / お問い合わせ
CTA: 無料相談ボタン

## 既存テンプレートとの接続

### warm-craft（暖色ナチュラル系）
- **Header()**: `src/app/portfolio-templates/warm-craft/page.tsx` 行199〜297
- `navItems` 配列: `[{ label: "施工実績", href: "#works" }, { label: "私たちの強み", href: "#strength" }, { label: "会社案内", href: "#about" }, { label: "お問い合わせ", href: "#contact" }]`
- スクロール閾値: `window.scrollY > 50`
- 透明→不透明: `bg-transparent` → `bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm`
- CTA: 電話番号ボタン `bg-[#7BA23F]`、SP固定底部バー `md:hidden fixed bottom-0`
- モバイルメニュー: `AnimatePresence` + `motion.div`（スライドダウン）

### trust-navy（ネイビー重厚系）
- **Header()**: `src/app/portfolio-templates/trust-navy/page.tsx` 行182〜269
- `navItems` 配列: `[{ label: "事業内容", href: "#service" }, { label: "施工実績", href: "#works" }, { label: "会社概要", href: "#about" }, { label: "お問い合わせ", href: "#contact" }]`
- 追加要素: スクロール前のみ上段インフォバー（電話/メール/営業時間）
- CTA: お問い合わせボタン `bg-[#1B3A5C]`（スクロール後）/ ボーダースタイル `border-[#C8A96E]/50`（スクロール前）
- モバイルメニュー: `AnimatePresence` + `motion.div`

### clean-arch（ミニマルモノクロ系）
- **Header()**: `src/app/portfolio-templates/clean-arch/page.tsx` 行112〜168
- ナビ項目: インライン配列 `[["WORKS","#works"],["ABOUT","#about"],["CONTACT","#contact"]]`（英字表記、3項目のみ）
- スクロール閾値: `window.scrollY > 100`（他より深い）
- モバイルメニュー: フルスクリーンオーバーレイ `fixed inset-0 bg-white`（他2テンプレートと構造が異なる）
- CTA: なし（ミニマル志向）
- テキストボタン: `"MENU"` / `"CLOSE"` テキスト切替（ハンバーガーアイコンなし）

### 編集時の共通方針
- `navItems` 配列の `label` / `href` を業種に応じて差し替える
- CTA ボタンのテキスト・リンク先を業種に応じて変更（電話 / 予約 / 相談）
- 色はテンプレートのカラーパレットを維持し、`label` のみ変更する

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── Header() コンポーネント（モノリシック内で定義）
```

### Props / データ構造
```typescript
interface NavItem {
  label: string;           // 表示テキスト（例: "施工実績" / "メニュー"）
  href: string;            // リンク先（例: "#works" / "#menu"）
  children?: NavItem[];    // ドロップダウンサブメニュー（任意）
}

interface CompanyInfo {
  name: string;            // 会社名（例: "山田工務店"）
  nameEn?: string;         // 英語表記（trust-navy で使用）
  since?: string;          // 創業年（例: "1996"）
  phone?: string;          // 電話番号（例: "0120-000-000"）
  email?: string;          // メールアドレス
  hours?: string;          // 営業時間
}

interface HeaderConfig {
  navItems: NavItem[];
  cta: {
    label: string;         // 例: "お問い合わせ" / "ご予約"
    href: string;          // 例: "#contact" / "https://external-booking.com"
    phone?: string;        // 電話番号（表示する場合）
  };
  scrollThreshold: number; // スクロール検知閾値（px）（例: 50）
  mobileMenuStyle: "slideDown" | "fullScreen";  // warm-craft/trust-navy vs clean-arch
}
```

### 状態管理
```typescript
const [open, setOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handler = () => setScrolled(window.scrollY > scrollThreshold);
  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}, []);
```

## リファレンスコード

### warm-craft: Header ナビ部分
```tsx
// src/app/portfolio-templates/warm-craft/page.tsx
const navItems = [
  { label: "施工実績", href: "#works" },
  { label: "私たちの強み", href: "#strength" },
  { label: "会社案内", href: "#about" },
  { label: "お問い合わせ", href: "#contact" },
];

<nav className="hidden lg:flex items-center gap-6">
  {navItems.map((item) => (
    <a key={item.href} href={item.href}
      className={`text-sm transition-colors ${
        scrolled ? "text-[#8B7D6B] hover:text-[#7BA23F]" : "text-white/80 hover:text-white"
      }`}>
      {item.label}
    </a>
  ))}
</nav>
```

### trust-navy: 上段インフォバー
```tsx
// src/app/portfolio-templates/trust-navy/page.tsx
{!scrolled && (
  <div className="hidden lg:block border-b border-white/10">
    <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-end gap-6 py-1.5 text-white/50 text-xs">
      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{COMPANY.phone}</span>
      <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{COMPANY.email}</span>
      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{COMPANY.hours}</span>
    </div>
  </div>
)}
```

### clean-arch: フルスクリーンモバイルメニュー
```tsx
// src/app/portfolio-templates/clean-arch/page.tsx
<AnimatePresence>
  {open && (
    <motion.div
      className="fixed inset-0 z-40 bg-white flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <nav className="flex flex-col items-center gap-10">
        {[["WORKS","#works"],["ABOUT","#about"],["CONTACT","#contact"]].map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}
            className="text-3xl font-light tracking-[0.2em] text-gray-800 hover:text-gray-400 transition-colors">
            {label}
          </a>
        ))}
      </nav>
    </motion.div>
  )}
</AnimatePresence>
```

## 3層チェック

> この機能の核: **「どのページに何があるか」が迷わずわかる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 固定ヘッダー | ページ最上部に`position: fixed`（`z-50`以上）で常時表示 | fixedでない。スクロールで消える |
| F-2 | ロゴリンク | ロゴクリックでページトップに遷移する | ロゴがクリック不可。遷移先が不正 |
| F-3 | ナビリンク | 全ナビ項目クリックで正しいセクション/ページへ遷移する | リンク切れ。アンカーが不正 |
| F-4 | ハンバーガーメニュー | モバイル（`lg`未満）でハンバーガーメニューに切り替わる | モバイルでナビが全部見えてしまう。ハンバーガーアイコンがない |
| F-5 | メニューアニメーション | `AnimatePresence`で滑らかに開閉アニメーションする | アニメーションなし。ガクつく |
| F-6 | スクロール背景変化 | スクロール時に背景が透明→不透明にトランジション（`duration-300`以上） | 透明のまま。背景が急に切り替わる |
| F-7 | 背面スクロール制御 | モバイルメニュー展開中に背面スクロールが抑制される | メニューの裏でページがスクロールする |
| F-8 | Escapeキー | Escapeキーでモバイルメニューが閉じる | Escapeで閉じない |
| F-9 | キーボードナビ | 全リンクにTab移動+Enter遷移が可能 | キーボードでフォーカスが当たらない |
| F-10 | reduced-motion | `prefers-reduced-motion`時にアニメーションが抑制される | 設定無視でアニメーション再生 |
| F-11 | z-index干渉 | `z-index`が他要素（モーダル等）と干渉しない | モーダルの下に隠れる。CTAバーと重なる |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、目的のページに辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | メニュー項目数の適切さ | **5〜8個の項目**で全体像が掴める | ナビ項目5〜8個。10個以上は即減点。3個未満は情報不足 | 10点 |
| U-2 | 項目名の明確さ | 項目名だけで**何のページか即座にわかる** | 「施工実績」「会社概要」「お問い合わせ」等の具体名。「サービス」「ソリューション」は減点 | 8点 |
| U-3 | モバイルメニューの操作性 | ハンバーガーメニューの**開閉が直感的**で速い | タップ領域44px以上。開閉速度300ms以内。リンクタップで自動クローズ | 8点 |
| U-4 | CTAの視認性 | **電話/予約/問い合わせ**がナビに埋もれず目立つ | 右端にアクセントカラーのボタン。ナビリンクと明確に差別化 | 7点 |
| U-5 | スクロール時の信頼感 | ページ途中でも**常にヘッダーにアクセス**できる安心感 | fixedヘッダー+スクロール時の背景変化で「常にここにある」と認識 | 7点 |

### Layer 3: 価値チェック（サイト構造が把握できるか）— 30点

この機能の核「どのページに何があるか、が迷わずわかる」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 初見で全体像が把握できるか | メニューを見ただけで**サイトに何があるか全てわかる** | 「施工実績/技術/会社概要/お問い合わせ」の4項目で建設会社サイトの全容を網羅 | 主要ページはカバーしているが「技術」が抜けている | 「ホーム/ページ1/ページ2」で何のサイトかわからない |
| V-2 | 迷わず目的ページに辿り着けるか | ナビ項目名と実際のコンテンツが**一致**している | 「施工実績」をクリック→実際の施工写真ギャラリーが表示される | リンクは正しいが項目名がやや曖昧 | 「サービス」をクリック→会社概要が表示される（名前と内容が不一致） |
| V-3 | 業種に適したナビ構成か | ナビ項目が**対象業種のユーザーニーズ**に最適化されている | 建築:施工実績/技術/会社概要/問い合わせ。飲食:メニュー/店舗案内/こだわり/予約 | 業種に合っているが優先順位が不適切 | 全業種共通の「ホーム/サービス/会社概要/お問い合わせ」で業種感ゼロ |
| V-4 | CTAが行動を促すか | CTA経由で**実際に問い合わせ/電話/予約**が完結する | 電話ボタン1タップで発信。予約ボタンでフォームへ直行 | CTAはあるが「#contact」へのスクロールのみ | CTAなし。または目立たず誰も押さない |
| V-5 | テンプレート固有要素が価値を加えるか | warm-craftのSP底部バー、trust-navyのインフォバー等が**適切に機能** | trust-navy:スクロール前に電話/メール/営業時間が見えて即連絡可能 | 固有要素はあるが表示タイミングが不適切 | 固有要素が他の要素と干渉して使えない |

## スコアリング

### 合計100点の内訳

| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 11項目全PASSで30点。1つでもFAILなら0点（作り直し） |
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
- fixed+AnimatePresence+スクロール背景変化+Escape+キーボード全て動作（L1: 30/30）
- 5項目で全体像把握。項目名が具体的。モバイルメニューが快適。CTAが目立つ（L2: 35/40）
- 建築業に最適化されたナビ構成。CTA1タップで発信可能。trust-navyのインフォバーが有効（L3: 25/30）

**80点の実装:**
- 基本機能は動作。Escapeキー対応が未実装（L1: 30/30 ギリギリ）
- ナビ項目OK。CTAはあるがナビに埋もれ気味（L2: 28/40）
- 業種に合った構成だが「サービス」等のやや曖昧な項目名が1つある（L3: 22/30）

**70点の実装:**
- fixedヘッダー+ハンバーガーは動作。背景トランジションがない（L1: 30/30 ギリギリ）
- ナビ項目10個で多すぎ。モバイルメニューの開閉が遅い（L2: 22/40）
- 全業種共通のナビ構成。CTAなし。業種感ゼロ（L3: 18/30）

### この機能固有の重要判定ポイント

1. **ナビ項目数**: 5〜8個が最適。10個以上はU-1で即減点。3個未満は情報不足で同じく減点。clean-archのミニマル3項目は例外的に許容されるが、業種によっては不足
2. **項目名の具体性**: 「サービス」「ソリューション」「プロダクト」等の抽象的な項目名はU-2で減点。「施工実績」「メニュー」「予約」等の具体名を使う
3. **テンプレート固有要素**: warm-craftのSP固定底部バー、trust-navyの上段インフォバーなど、テンプレート固有の追加要素が正しく機能しているかをV-5で評価。他テンプレートとの干渉もチェック
4. **モバイルメニューのリンクタップ**: リンクをタップした後にメニューが自動で閉じること。開いたまま画面が覆われる状態はU-3で大幅減点
