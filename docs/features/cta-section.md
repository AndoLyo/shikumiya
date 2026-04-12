# CTAバー/セクション
> ID: cta-section | カテゴリ: section | プラン: lite

## 概要

「来場予約」「資料請求」「お問い合わせ」等の主要アクション導線を常に目立つ位置に配置するセクション/バー。業種を問わず、サイト訪問者をコンバージョン（予約・問い合わせ・購入等）へ導く最重要コンポーネント。固定バー型（スクロール追従・モバイル下部固定）とセクション型（ページ内埋め込み）の2種類を提供し、併用が最も効果的。Triple CTAパターン（主要アクション3つ）を基本とする。CTAの設計次第でCVRが2〜5倍変わるため、最も投資対効果が高い機能の一つ。

## この機能の核
「聞いてみよう」と思った瞬間にボタンが目の前にある。

## 必須要件

- 最低1つ、最大3つのCTAボタンを配置すること（Triple CTAパターン）
- 固定バー型: モバイルでページ下部に固定表示（position: fixed）、スクロール追従
- セクション型: ページ内の適切な位置（Works後、Footer前等）に配置
- 各CTAボタンにアイコン + ラベルテキスト + 副テキスト（任意）
- ボタンのコントラスト比は WCAG AA 基準（4.5:1以上）を満たすこと
- 電話番号CTAはモバイルで `tel:` リンクにすること
- デスクトップではセクション型のみ表示（固定バーはモバイル限定）

## 業種別バリエーション

| 業種 | CTA1（primary） | CTA2（secondary） | CTA3（outline） |
|---|---|---|---|
| **建築・建設** | 来場予約 | カタログ請求 | お問い合わせ |
| **小売・EC** | 商品を見る | 店舗を探す | お問い合わせ |
| **飲食** | 予約する | メニューを見る | テイクアウト注文 |
| **美容・サロン** | 予約する | クーポン | LINE登録 |
| **医療・クリニック** | Web予約 | アクセス | 電話する |
| **士業・コンサル** | 無料相談 | 資料ダウンロード | お問い合わせ |
| **フォトグラファー** | 撮影の相談 | ギャラリーを見る | お問い合わせ |
| **ハンドメイド作家** | ショップを見る | オーダー相談 | お問い合わせ |

### レイアウト構成
```
── セクション型（デスクトップ） ──
┌─────────────────────────────────────────────┐
│  ■■■■■■��■■■■■■ ブランドカラー背景 ■■■■■■■■■■│
│                                              │
│  まずはお気軽にご相談ください                   │
│                                              │
│  [ CTA1 primary ]  [ CTA2 secondary ]  [ CTA3 outline ] │
│                                              │
│  TEL: 03-0000-0000（受付 9:00〜18:00）        │
└────────────────────────────���────────────────┘

── 固定バー型（モバイル下部固定） ──
┌─────────────────────────────────────────────┐
│  [ CTA1 ]  [ CTA2 ]  [ CTA3 ]               │
└─────────────────���───────────────────────────┘
 ↑ 画面最下部に固定（ヒーロー通過後に表示、フッター付近で非表示）
```

## 既存テンプレートとの接続

### 既存実装の状況

3テンプレート全てにCTAセクションは**存在しない**。新規追加が必要。

| テンプレート | 現在の構成 | 挿入位置 |
|---|---|---|
| warm-craft | Header → Hero → Works → Strengths → About → Contact → Footer | Contact の直前にセクション型を挿入 + モバイル固定バー追加 |
| trust-navy | Header → Hero → Services → Projects → About → Contact → Footer | Contact の直前にセクション型を挿入 + モバイル固定バー追加 |
| clean-arch | Header → Hero → Works → About → Contact → Footer | Contact の直前にセクション型を挿入 + モバイル固定バー追加 |

### 挿入手順

```tsx
// page.tsx 内:
// 1. CTASection() と CTAFixedBar() を新規関数として追加
// 2. メインコンポーネントの return 文を修正

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
        <CTASection />        {/* ← 新規追加 */}
        <ContactSection />
      </main>
      <Footer />
      <CTAFixedBar />         {/* ← 新規追加（モバイル固定バー） */}
    </>
  );
}
```

### カラー適用

| テンプレート | primaryボタン背景 | secondaryボタン | outlineボタン | セクション背景 |
|---|---|---|---|---|
| warm-craft | `bg-[#7BA23F]` | `bg-[#3D3226]` | `border-[#3D3226]` | `bg-[#E8DFD3]` |
| trust-navy | `bg-[#C8A96E]` | `bg-[#1B3A5C]` | `border-[#1B3A5C]` | `bg-[#0D2440]` |
| clean-arch | `bg-black` | `bg-gray-700` | `border-gray-400` | `bg-[#EDEBE5]` |

### navItemsへの影響

CTAセクションはナビゲーションリンクの対象外。navItemsの変更は不要。CTAボタンのリンク先は既存セクションのアンカー（`#contact`, `#works`等）を使用する。

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function CTASection() { ... }       // セクション型
  └── function CTAFixedBar() { ... }      // 固定バー型
```

### Props / データ構造
```typescript
interface CTAButton {
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Button label text */
  label: string;
  /** Sub-text ("Free", "5 min" etc.) */
  subText?: string;
  /** Link destination URL or anchor */
  href: string;
  /** Button style variant */
  variant: 'primary' | 'secondary' | 'outline';
  /** Phone number for tel: link generation */
  phone?: string;
}

interface CTASectionConfig {
  /** Section type */
  type: 'section' | 'fixed-bar' | 'both';
  /** Catchphrase (section type) */
  heading?: string;
  /** Sub-text (section type) */
  subText?: string;
  /** CTA buttons (max 3) */
  buttons: CTAButton[];
  /** Background color */
  bgColor: string;
  /** Scroll threshold for fixed bar display (px from top) */
  showAfter?: number;
  /** Phone number (section type supplementary display) */
  phone?: string;
  /** Business hours */
  businessHours?: string;
}

// Demo data — industry-agnostic
const DEMO_CTA_BUTTONS: CTAButton[] = [
  {
    icon: Calendar,
    label: "来場予約",
    subText: "無料",
    href: "#contact",
    variant: "primary",
  },
  {
    icon: FileText,
    label: "資料請求",
    subText: "約3分",
    href: "/catalog",
    variant: "secondary",
  },
  {
    icon: Mail,
    label: "お問い合わせ",
    href: "#contact",
    variant: "outline",
  },
];
```

### 状態管理
```typescript
// Fixed bar visibility control
const [showFixedBar, setShowFixedBar] = useState(false);

useEffect(() => {
  const threshold = config.showAfter || 600;
  const handleScroll = () => {
    setShowFixedBar(window.scrollY > threshold);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Hide fixed bar near footer (overlap prevention)
const footerRef = useRef<HTMLElement>(null);
useEffect(() => {
  if (!footerRef.current) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) setShowFixedBar(false);
    },
    { threshold: 0.1 }
  );
  observer.observe(footerRef.current);
  return () => observer.disconnect();
}, []);
```

## リファレンスコード（warm-craft のセクションヘッダーパターンに準拠）

```tsx
// Section type — inserted before ContactSection
function CTASection() {
  return (
    <section className="py-16 sm:py-20 bg-[#E8DFD3]">
      <div className="max-w-[900px] mx-auto px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">CONTACT US</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">
            まずはお気軽にご相談ください
          </h2>
          <p className="text-gray-500 text-sm mb-10">
            ご相談・お見積りは無料です。お電話でもお気軽にどうぞ。
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" className="px-8 py-3.5 rounded-lg bg-[#7BA23F] text-white font-medium text-sm hover:bg-[#5C7A2E] transition-colors shadow-lg shadow-[#7BA23F]/20">
            来場予約
          </a>
          <a href="/catalog" className="px-8 py-3.5 rounded-lg bg-[#3D3226] text-white font-medium text-sm hover:bg-[#2C241B] transition-colors">
            資料請求
          </a>
          <a href="#contact" className="px-8 py-3.5 rounded-lg border-2 border-[#3D3226] text-[#3D3226] font-medium text-sm hover:bg-[#3D3226] hover:text-white transition-colors">
            お問い合わせ
          </a>
        </div>

        <p className="mt-8 text-[#3D3226]/60 text-sm">
          TEL: <a href="tel:0120000000" className="underline">0120-000-000</a>（受付 9:00〜18:00）
        </p>
      </div>
    </section>
  );
}

// Fixed bar — mobile only
function CTAFixedBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 py-2 px-3"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2">
            <a href="#contact" className="flex-1 py-2.5 rounded-md bg-[#7BA23F] text-white text-xs font-medium text-center">
              来場予約
            </a>
            <a href="/catalog" className="flex-1 py-2.5 rounded-md bg-[#3D3226] text-white text-xs font-medium text-center">
              資料請求
            </a>
            <a href="#contact" className="flex-1 py-2.5 rounded-md border border-[#3D3226] text-[#3D3226] text-xs font-medium text-center">
              相談
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | 固定バー: 画面下部固定 / 3ボタン均等分割 / ラベルのみ（副テキスト非表示）/ 高さ56px / セクション型: ボタン縦積み |
| **タブレット**（640〜1023px） | 固定バー非表示 / セクション型: ボタン横並び / 副テキスト表示 |
| **デスクトップ**（1024px〜） | 固定バーなし / セクション型のみ / ボタンにホバーエフェクト |

## 3層チェック

> この機能の核: **「聞いてみよう」と思った瞬間にボタンが目の前にある**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | CTAボタン表示 | 1〜3個のCTAボタンが正しく表示され、variant（primary/secondary/outline）スタイルが適用されている | ボタンが0個。variantが全部同じ色 |
| F-2 | リンク動作 | 各ボタンクリックで正しいリンク先（`#contact`, `/catalog`等）へ遷移する | リンク切れ。href未設定でクリックしても何も起きない |
| F-3 | 固定バー表示制御 | スクロール閾値（ヒーロー通過後）で固定バーが表示される | スクロールしてもバーが出ない。ページ読み込み直後から表示される |
| F-4 | 固定バー非表示制御 | フッター付近（IntersectionObserver）で固定バーが非表示になる | フッターと重なって情報が読めない |
| F-5 | PC/SP出し分け | モバイルのみ固定バー表示（`sm:hidden`）、デスクトップではセクション型のみ | PCで固定バーが出る。SPでセクション型しかない |
| F-6 | z-index | 固定バーが他要素の上に表示される（`z-50`以上）。モーダル等と干渉しない | 他の要素に隠れてタップできない |
| F-7 | tel:リンク | 電話番号CTAがモバイルで`tel:`リンクになっている | 電話番号がただのテキストでタップしても発信しない |
| F-8 | コントラスト比 | ボタンテキストとボタン背景のコントラスト比がWCAG AA基準（4.5:1以上） | テキストが背景に溶けて読めない |
| F-9 | reduced-motion | `prefers-reduced-motion`時に固定バーの表示/非表示アニメーションが即完了 | 設定無視でアニメーション再生 |
| F-10 | セクションヘッダー | English label(tracking-[0.3em]) + H2 + subtextの3段構成 | H2だけ。英語ラベルなし |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく行動できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | スクロール中のCTA視認性 | コンテンツ閲覧中、**常にCTAが視界にある**（SP固定バー/PCセクション型） | SPではスクロール中に固定バーが常時表示。PCではCTAセクションがページ内に配置 | 10点 |
| U-2 | ボタンのタップ領域 | 全CTAボタンのタップ領域が**44px以上**で誤タップしない | ボタン高さ44px以上 + ボタン間の余白8px以上 | 8点 |
| U-3 | 文言の明確さ | ボタンラベルを読んだだけで**何が起きるか**がわかる | 「来場予約」「資料請求」「お問い合わせ」等、動詞+目的語の形式 | 8点 |
| U-4 | 選択肢の段階設計 | 温度感の異なる**3段階の選択肢**がある（高:予約→中:資料→低:相談） | primary=即行動、secondary=情報収集、outline=軽い接触の3段階 | 7点 |
| U-5 | 固定バーの非侵襲性 | 固定バーがコンテンツ閲覧を**妨げない** | 固定バーの高さ56〜80px。本文との重なりなし | 7点 |

### Layer 3: 価値チェック（行動を起こすか）— 30点

この機能の核「聞いてみよう、と思った瞬間にボタンが目の前にある」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「今すぐ行動しよう」と思えるか | CTAの文言・デザインが**行動を後押し**する | 「無料で相談する」+副テキスト「約3分」で心理ハードルを下げている | 「お問い合わせ」ボタンが目立つ位置にある | 「CONTACT」だけの英語ボタンで何が起きるかわからない |
| V-2 | 温度感に合った選択肢 | 「まだ行く気はない人」にも**ちょうどいい選択肢**がある | 「来場予約」+「資料請求（無料）」+「ちょっと聞いてみる」の3段階 | 「予約」と「お問い合わせ」の2択 | 「来場予約」しかなく、まだ検討段階の人が離脱する |
| V-3 | 電話/メール/フォームの複数手段 | ユーザーが**好む連絡方法**を選べる | ボタン3つ+セクション下部に電話番号+営業時間 | ボタン+電話番号の2手段 | フォームしかなく「電話で聞きたい」人が離脱する |
| V-4 | 押し売り感がないか | CTAが**安心感**を与える（無理に売り込まない） | 「まずはお気軽にご相談ください」+「ご相談・お見積りは無料です」 | 「お気軽にどうぞ」の一言がある | 「今すぐ申し込まないと損！」的な煽り |
| V-5 | 業種に合ったCTA内容 | Triple CTAの内容が**対象業種のユーザーニーズ**に合致 | 建築:来場予約/資料請求/相談、飲食:予約/メニュー/テイクアウト | 業種に合った2種類のCTA | 汎用的な「お問い合わせ」1つだけで業種感ゼロ |
| V-6 | モバイルでの行動完結 | スマホだけで**予約・電話・問い合わせ**が完結する | 固定バーから1タップで電話発信、1タップで予約フォームへ | 固定バーからフォームへ遷移可能 | SPで固定バーがなく、フォームまで長いスクロールが必要 |

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
- 固定バーが正しく表示/非表示。全リンク動作OK。tel:リンク対応済み（L1: 30/30）
- SPでスクロール中に常にCTAが視界にある。ボタン44px以上。「来場予約/資料請求/相談」で文言明確（L2: 35/40）
- 「無料で相談する（約3分）」+電話番号+営業時間の安心材料。建築業に合ったTriple CTA（L3: 25/30）

**80点の実装:**
- 固定バー・リンクは正しく動作（L1: 30/30）
- ボタン配置OK。ただし選択肢が2つだけで温度感の段階設計が弱い（L2: 28/40）
- 「お問い合わせ」「資料請求」の2択。電話番号は記載あるが目立たない（L3: 22/30）

**70点の実装:**
- 固定バーは動くがフッター付近で非表示にならない（L1: 30/30 ギリギリ）
- ボタンが小さくタップしにくい。文言が英語だけで不明確（L2: 22/40）
- 「CONTACT」ボタン1つだけ。電話番号なし。選択肢なし（L3: 18/30）

### この機能固有の重要判定ポイント

1. **CVR直結**: CTAセクションはサイト全体のCVRに最も影響するコンポーネント。ボタンテキスト「無料で相談」vs「お問い合わせ」の差でCVRが20〜50%変動するケースがある。文言の具体性は価値チェックV-1で厳しく評価
2. **モバイルファースト**: サイト閲覧者の70%以上がモバイル。SP固定バーが正しく動作しない場合はLayer 1のF-3〜F-5で即FAIL
3. **Triple CTAの温度感**: primary（高温:予約）> secondary（中温:資料）> outline（低温:相談）の順でビジネス価値が高いCTAに割り当てる。全ボタンが同じ温度感の場合はLayer 3のV-2で減点
4. **「ちょうどいい選択肢」テスト**: 「まだ行く気はないけど興味はある人」がストレスなく押せるボタンがあるか。「来場予約」しかなければ検討段階の人が離脱する
