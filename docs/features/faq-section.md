# FAQ
> ID: faq-section | カテゴリ: section | プラン: lite

## 概要

よくある質問と回答をアコーディオン形式で表示するセクション。業種を問わず、見込み客が必ず抱く疑問に先回りして回答することで、問い合わせのハードルを下げる。Schema.org の FAQPage 構造化データを実装することで、Google検索結果にFAQリッチスニペットとして表示される可能性があり、SEO面でも大きなメリットがある。アコーディオン開閉は Framer Motion の AnimatePresence を使用し、滑らかなアニメーションを提供する。ContactSection の直前に配置するのが最も効果的。

## この機能の核
「いくら？いつ？どうやって？」の不安が具体的な数字で消える。

## 必須要件

- アコーディオン形式（質問クリック → 回答が展開）で表示すること
- 開閉アニメーション（Framer Motion の AnimatePresence を使用）がスムーズであること
- Schema.org FAQPage 構造化データ（JSON-LD）を head に出力すること
- 質問は8〜15件程度を推奨
- 1つのQ&Aを開くと、他の開いているQ&Aは自動で閉じる排他制御モード（オプション）
- カテゴリグルーピング（オプション）
- キーボード操作（Enter/Space）対応（アクセシビリティ）
- ARIA属性（aria-expanded, aria-controls）の正しい設定

## 業種別バリエーション

| 業種 | FAQ例（3件抜粋） |
|---|---|
| **建築・建設** | 「費用の目安は？」「工期はどのくらい？」「アフターサービスは？」 |
| **小売・EC** | 「返品・交換は可能？」「送料はいくら？」「支払い方法は？」 |
| **飲食** | 「予約は必要？」「アレルギー対応は？」「駐車場はある？」 |
| **美容・サロン** | 「施術時間は？」「キャンセル料は？」「初めてでも大丈夫？」 |
| **医療・クリニック** | 「保険適用？」「初診の流れは？」「駐車場はある？」 |
| **フォトグラファー** | 「料金体系は？」「データ納品まで何日？」「撮影場所は選べる？」 |
| **ハンドメイド作家** | 「オーダーメイドは可能？」「制作期間は？」「ラッピングは？」 |
| **士業・コンサル** | 「初回相談は無料？」「依頼の流れは？」「費用の目安は？」 |

### レイアウト構成
```
┌─────────────────────────────────────────────┐
│  FAQ / よくあるご質問                          │
│  英語ラベル(tracking-[0.3em]) → H2 → subtext  │
│                                              │
│  ── カテゴリ1 ──（カテゴリ分類有効時）          │
│  ┌───────────────────────────────────── ▼ ┐ │
│  │ Q. 質問テキスト                         │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────── ▲ ┐ │
│  │ Q. 質問テキスト                         │ │
│  ├───────────────────────────────────────┤ │
│  │ A. 回答テキスト…                       │ │
│  └───────────────────────────────────────┘ │
│                                              │
│  ── カテゴリ2 ──                             │
│  ┌───────────────────────────────────── ▼ ┐ │
│  │ Q. 質問テキスト                         │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## 既存テンプレートとの接続

### 既存実装の状況

3テンプレート全てにFAQSectionは**存在しない**。新規セクションとして追加する。

| テンプレート | 現在の構成 | 挿入位置 |
|---|---|---|
| warm-craft | Hero → Works → Strengths → About → Contact | Contact の直前 |
| trust-navy | Hero → Services → Projects → About → Contact | Contact の直前 |
| clean-arch | Hero → Works → About → Contact | Contact の直前 |

### 挿入手順

```tsx
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
        <FAQSection />         {/* ← 新規追加（Contact の直前） */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

// trust-navy の場合:
export default function TrustNavyPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <AboutSection />
        <FAQSection />         {/* ← 新規追加 */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

// clean-arch の場合:
export default function CleanArchPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <FAQSection />         {/* ← 新規追加 */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

### セクションヘッダーの適用パターン

```tsx
// warm-craft style
<p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">FAQ</p>
<h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">よくあるご質問</h2>
<p className="text-gray-500 text-sm">お客様からよくいただくご質問にお答えします。</p>

// trust-navy style
<p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">FAQ</p>
<h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl mb-3">よくあるご質問</h2>
<p className="text-gray-500 text-sm">よくお寄せいただくご質問にお答えします。</p>

// clean-arch style
<p className="text-gray-300 text-[10px] tracking-[0.4em] mb-6">FAQ</p>
<h2 className="text-black text-3xl sm:text-4xl font-extralight tracking-wide">FAQ</h2>
```

### navItemsへの影響

FAQ は通常 navItems に追加しない（補助的セクションのため）。ページが長くなりすぎる場合はContact直前に入れるだけで十分。

### カラー適用

| テンプレート | アコーディオン背景 | ボーダー | アクセント（Q番号/矢印） | セクション背景 |
|---|---|---|---|---|
| warm-craft | `bg-[#FAF7F2]` | `border-[#E8DFD3]` | `text-[#7BA23F]` | `bg-white` |
| trust-navy | `bg-[#F0F4F8]` | `border-gray-200` | `text-[#C8A96E]` | `bg-white` |
| clean-arch | `bg-white` | `border-gray-100` | `text-gray-400` | `bg-white border-t border-gray-100` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function FAQSection() { ... }
```

### Props / データ構造
```typescript
interface FAQItem {
  /** Unique ID */
  id: number;
  /** Question text */
  question: string;
  /** Answer text (HTML allowed) */
  answer: string;
  /** Category for grouping (optional) */
  category?: string;
}

interface FAQConfig {
  /** Section title */
  sectionTitle: string;
  /** Section subtitle */
  subtitle?: string;
  /** Exclusive control: one open closes others */
  exclusive: boolean;
  /** Enable category grouping */
  groupByCategory: boolean;
  /** Enable search */
  searchEnabled: boolean;
  /** Output structured data */
  structuredData: boolean;
}

// Schema.org FAQPage structured data generation
function generateFAQSchema(items: FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
}

// Demo data — industry-agnostic
const DEMO_FAQ: FAQItem[] = [
  {
    id: 1,
    question: "サービスの料金体系を教えてください",
    answer: "ご要望の内容・規模によって異なりますので、まずはお気軽にご相談ください。初回のご相談・お見積りは無料で承ります。具体的な費用は詳細をヒアリングした上でご提示いたします。",
    category: "料金について",
  },
  {
    id: 2,
    question: "初回の相談は無料ですか？",
    answer: "はい、初回のご相談は無料です。お電話・メール・ご来社のいずれでもお受けしています。ご不明点やご不安な点がございましたら、お気軽にお問い合わせください。",
    category: "料金について",
  },
  {
    id: 3,
    question: "完了までの期間はどのくらいですか？",
    answer: "案件の規模や内容によりますが、一般的には初回相談から完了まで1〜3ヶ月程度が目安です。スケジュールの詳細はお打ち合わせ時にご説明いたします。",
    category: "進め方について",
  },
  {
    id: 4,
    question: "対応エリアはどこまでですか？",
    answer: "首都圏（東京都・神奈川県・千葉県・埼玉県）を中心に対応しています。その他の地域についてもご相談ください。オンラインでの対応も可能です。",
    category: "進め方について",
  },
  {
    id: 5,
    question: "アフターサポートはありますか？",
    answer: "はい、サービス完了後もアフターサポートを提供しています。定期的なフォローアップやメンテナンスのご相談も承ります。詳細な保証内容はお見積り時にご説明いたします。",
    category: "アフターサポート",
  },
  {
    id: 6,
    question: "キャンセルや変更は可能ですか？",
    answer: "着手前であればキャンセル可能です。着手後の変更については、内容と進捗状況に応じてご相談ください。追加費用が発生する場合は事前にお伝えいたします。",
    category: "その他",
  },
];
```

### 状態管理
```typescript
const [openItems, setOpenItems] = useState<Set<number>>(new Set());
const [searchQuery, setSearchQuery] = useState('');

const toggleItem = (id: number) => {
  setOpenItems(prev => {
    const next = new Set(prev);
    if (config.exclusive) {
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.clear();
        next.add(id);
      }
    } else {
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
    }
    return next;
  });
};

// Search filter
const filteredFAQ = useMemo(() => {
  if (!searchQuery) return faqItems;
  const q = searchQuery.toLowerCase();
  return faqItems.filter(item =>
    item.question.toLowerCase().includes(q) ||
    item.answer.toLowerCase().includes(q)
  );
}, [searchQuery, faqItems]);

// Category grouping
const groupedFAQ = useMemo(() => {
  if (!config.groupByCategory) return { '': filteredFAQ };
  return filteredFAQ.reduce<Record<string, FAQItem[]>>((acc, item) => {
    const cat = item.category || 'その他';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
}, [filteredFAQ, config.groupByCategory]);
```

## リファレンスコード（warm-craft スタイルに準拠）

```tsx
function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const faqs = DEMO_FAQ;

  const toggle = (id: number) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[800px] mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">FAQ</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">よくあるご質問</h2>
          <p className="text-gray-500 text-sm">お客様からよくいただくご質問にお答えします。</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              className="border border-[#E8DFD3] rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF7F2] transition-colors"
                aria-expanded={openId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="text-[#3D3226] font-medium text-sm pr-4">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#7BA23F] flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-gray-500 text-sm leading-relaxed border-t border-[#E8DFD3]">
                      <div className="pt-4">{faq.answer}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Schema.org FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(faqs)),
        }}
      />
    </section>
  );
}
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | フル幅アコーディオン / 質問: text-sm / 回答: text-sm / パディング: px-4 py-3 |
| **タブレット**（640〜1023px） | 80%幅中央揃え / 質問: text-sm〜base / 回答: text-sm |
| **デスクトップ**（1024px〜） | max-width: 800px 中央揃え / 質問: text-sm font-medium / ホバーで背景色変化 |

## 3層チェック

> この機能の核: **「いくら？いつ？どうやって？」の不安が具体的な数字で消える**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | アコーディオン開閉 | 質問クリックで回答がスムーズにスライドオープンする。ガクつきなし | クリックしても開かない。開くが画面がジャンプする |
| F-2 | 矢印アイコン回転 | ChevronDownが開閉に連動して180度回転する | 矢印が動かない。回転方向が逆 |
| F-3 | 排他制御 | 1つ開くと他が閉じる（設定時）。独立モードも正しく動く | 排他設定なのに全部開く。独立設定なのに他が閉じる |
| F-4 | JSON-LD出力 | `<script type="application/ld+json">` にFAQPageスキーマが出力される | JSON-LDがない。型がFAQPageでない。構文エラー |
| F-5 | カテゴリグルーピング | 有効時、カテゴリ見出しごとにQ&Aがグループ分けされる | カテゴリ設定ありなのに全部フラットに並ぶ |
| F-6 | ARIA属性 | `button` + `aria-expanded` + `aria-controls` が全Q&Aに設定 | aria属性なし。divにonClick直付け |
| F-7 | キーボード操作 | Tab移動 → Enter/Spaceで開閉が全Q&Aで動作する | キーボードでフォーカスが当たらない |
| F-8 | reduced-motion | `prefers-reduced-motion` 時にアニメーション即完了 | 設定無視でアニメーション再生される |
| F-9 | カラースキーム | ボーダー色・ホバー色がテンプレートのアクセントカラーに合致 | 色がハードコードで他テンプレートと合わない |
| F-10 | セクションヘッダー | English label(tracking-[0.3em]) + H2 + subtextの3段構成 | H2だけ。英語ラベルなし。パターン不一致 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 目的のQ&Aが見つかるまでの時間 | ユーザーが探している質問を**5秒以内**に発見できる | カテゴリ見出しまたは検索機能が機能しており、Q&Aが8件以下にグルーピングされている | 10点 |
| U-2 | 開閉操作のわかりやすさ | 初見で「クリックすれば開く」と**直感的にわかる** | 質問行にホバーカーソル変化(cursor-pointer) + 矢印アイコン + ホバー時背景変化の3つ全て | 8点 |
| U-3 | 回答の読みやすさ | 開いた回答が**スクロールせずに全文見える**（短い回答の場合） | 回答テキストのフォントサイズ14px以上、行間1.8以上、段落間に余白あり | 8点 |
| U-4 | モバイルでの操作性 | スマホで**片手の親指だけ**でQ&A閲覧が完結する | 質問行の高さ44px以上、タップ範囲が行全体 | 7点 |
| U-5 | 次のアクションへの導線 | FAQで解決しなかった場合、**即座に問い合わせ先が見える** | FAQ直下にContactSectionへのリンクまたはCTAがある | 7点 |

### Layer 3: 価値チェック（不安が消えるか）— 30点

この機能の核「不安が具体的な数字で消える」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 回答に具体的な数字がある | 料金・期間・範囲など、ユーザーが判断に使える数値が含まれている | 「坪単価60〜80万円」「施術時間3h」「3営業日以内」 | 「数千円〜数万円」「数週間程度」 | 「お気軽にご相談ください」「案件によります」 |
| V-2 | ユーザーの本当の疑問に答えている | 業種のユーザーが**実際に検索するキーワード**に対応するQ&Aがある | 建築:「坪単価」「工期」「保証」/ 美容:「料金」「施術時間」「キャンセル」 | 一般的だが業種に合ったQ&A | 業種と無関係なQ&A。「会社の理念は？」等、誰も聞かない質問 |
| V-3 | 回答が信頼できる | 具体的な根拠・条件が示されている | 「木造2階建で4〜6ヶ月。RC造は8〜12ヶ月」と条件付きで回答 | 「4〜6ヶ月が目安です」と範囲で回答 | 「ケースバイケースです」で逃げる |
| V-4 | 不安を増やさない | 回答を読んで**新たな不安が発生しない** | 「追加費用が発生する場合は事前にお伝えします」と安心材料を追加 | 特に新たな不安は生まない | 「別途費用がかかる場合があります」と不安だけ残す |
| V-5 | FAQ→行動につながる | FAQを読んだ後に**次のアクション（予約・問い合わせ・来店）に進む気になる** | 回答内に「詳しくはこちら」リンクや「無料相談承ります」の導線がある | FAQ直下にCTAがある | FAQで終わり。次に何すればいいかわからない |
| V-6 | Google検索で表示される | FAQPage構造化データが**正しくリッチスニペット対象になる** | Google Rich Results Testでエラーなし + question/answerが全件含まれる | JSON-LDは出力されるがテスト未確認 | JSON-LDなし。またはスキーマエラー |

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
- アコーディオンが滑らかに開閉する（L1: 30/30）
- カテゴリグルーピングで5秒以内にQ&Aが見つかる。モバイルで片手操作可。FAQ下にCTAあり（L2: 35/40）
- 「坪単価60〜80万円。30坪の住宅で1,800〜2,400万円。詳しい見積もりは無料」のように数字+安心材料が揃っている（L3: 25/30）

**80点の実装:**
- アコーディオンは動く（L1: 30/30）
- カテゴリなしだが8件のQ&Aがスクロールで見つかる。モバイル対応OK（L2: 28/40）
- 「数千円〜数万円程度」のように範囲は示しているが具体性が弱い（L3: 22/30）

**70点の実装:**
- アコーディオンは動く（L1: 30/30）
- Q&Aが15件一列で探しにくい。モバイルで文字が小さい（L2: 22/40）
- 「お気軽にご相談ください」系の回答が3件以上ある（L3: 18/30）

### この機能固有の重要判定ポイント

1. **「お気軽に」カウント**: 回答に「お気軽にご相談ください」「ケースバイケース」「お問い合わせください」が含まれる回数をカウント。**2回以上で価値チェックV-1自動FAIL**。具体的な数字で答えられない質問はFAQに入れるべきではない
2. **JSON-LD整合性**: JSON-LD内のquestion/answerと画面上のQ&Aテキストが**完全一致**していること。一致しない場合はGoogle側でペナルティの可能性
3. **業種適合度**: Q&Aの質問文が、その業種のユーザーが**実際にGoogleで検索するフレーズ**と一致しているか。建築なら「坪単価 相場」「注文住宅 工期」、美容なら「カット 相場」「予約 キャンセル料」等
