# 事業内容/サービス
> ID: service-section | カテゴリ: section | プラン: lite

## 概要

企業が提供する事業・サービス・強みをカードグリッドで一覧表示するセクション。調査では10サイト中8サイトが実装。「何ができる会社なのか」を端的に伝える役割を持ち、3〜4つの事業領域をアイコン+テキストで紹介する。

**注意:** テンプレートによって「事業内容（SERVICES）」と「強み（STRENGTHS）」の2パターンがある。工務店は「強み」、建設会社は「事業内容」が自然。

## この機能の核

**「何をやってくれる会社なのか」が10秒で伝わる。**

訪問者はヒーローセクションで「ここは自分に関係ありそう」と思った直後に、「具体的に何をしてくれるのか」を知りたがる。3〜4枚のカードを10秒でざっと眺めて、自分の求めるサービスがあるかを判断する。1枚1枚を読むのではなく、アイコンとタイトルの「スキャン」で理解できることが大事。説明文は興味を持った人だけが読む。

## 必須要件

- サービスごとに Lucideアイコン + タイトル + 説明文を表示
- 3〜4つのカードを均等グリッド配置
- 各カードにホバーエフェクト（アイコン背景色反転 + 浮き上がり）
- Framer Motion の whileInView + stagger（delay: i * 0.08）
- セクションヘッダーは英語ラベル + H2 + サブコピーの3段構成

## 業種別バリエーション

サービス内容は業種で完全に異なる。アイコン・タイトル・説明文・セクション名すべてが変わる。

### 建築（工務店 — 「強み」パターン）
```typescript
// セクション名: 私たちの強み / STRENGTHS
const STRENGTHS: ServiceItem[] = [
  { icon: Home, title: "自然素材へのこだわり", desc: "無垢材、漆喰、珪藻土。体にやさしい自然素材だけを使った家づくり" },
  { icon: Shield, title: "全棟 耐震等級3", desc: "消防署と同等レベルの耐震性能。全棟で構造計算を実施" },
  { icon: Hammer, title: "自社大工による一貫施工", desc: "下請けに丸投げしません。自社の職人が責任を持って施工" },
  { icon: Users, title: "建てた後も、ずっと。", desc: "引き渡しはゴールではなくスタート。定期点検・メンテナンスを永年対応" },
];
```

### 建築（建設会社 — 「事業内容」パターン）
```typescript
// セクション名: 事業内容 / SERVICE
const SERVICES: ServiceItem[] = [
  { icon: Building2, title: "建築工事", desc: "オフィスビル、商業施設、集合住宅の新築工事を手がけています" },
  { icon: Wrench, title: "改修・リノベーション", desc: "既存建物の大規模改修からリノベーションまで幅広く対応" },
  { icon: Shield, title: "耐震・防災工事", desc: "耐震診断に基づく的確な補強工事で建物の安全性を向上" },
  { icon: Briefcase, title: "土木工事", desc: "道路、橋梁、上下水道などのインフラ整備を担当" },
];
```

### 小売（アパレル・雑貨）
```typescript
// セクション名: 私たちのこだわり / CONCEPT
const SERVICES: ServiceItem[] = [
  { icon: Gem, title: "国内外から厳選", desc: "バイヤーが直接現地を訪れ、品質とデザインに納得したものだけを仕入れ" },
  { icon: Truck, title: "全国送料無料", desc: "¥5,000以上のお買い物で送料無料。最短翌日にお届け" },
  { icon: Gift, title: "ギフトラッピング", desc: "大切な方への贈り物に。無料ラッピング・メッセージカード対応" },
  { icon: RefreshCw, title: "30日間返品保証", desc: "サイズが合わない、イメージと違った場合も安心の返品保証" },
];
```

### 飲食（レストラン・カフェ）
```typescript
// セクション名: こだわり / CONCEPT
const SERVICES: ServiceItem[] = [
  { icon: Leaf, title: "地元農家の有機野菜", desc: "毎朝届く旬の有機野菜。生産者の顔が見える食材だけを使用" },
  { icon: Flame, title: "薪窯で焼くピッツァ", desc: "イタリア直輸入の薪窯で500℃で焼き上げる本格ナポリピッツァ" },
  { icon: Wine, title: "ソムリエ厳選ワイン", desc: "料理に合わせたペアリングをソムリエがご提案いたします" },
  { icon: PartyPopper, title: "貸切パーティー", desc: "10名様〜30名様の貸切プラン。誕生日・歓送迎会・二次会に" },
];
```

### 美容（美容室・エステ・ネイル）
```typescript
// セクション名: 特徴 / FEATURE
const SERVICES: ServiceItem[] = [
  { icon: User, title: "完全マンツーマン", desc: "お客様ひとりに対しスタイリストひとり。掛け持ちなしの丁寧な施術" },
  { icon: Lock, title: "完全個室", desc: "プライベート空間でリラックス。周りの視線を気にせずご相談いただけます" },
  { icon: Droplets, title: "オーガニック薬剤", desc: "頭皮と髪にやさしいオーガニック認証の薬剤を使用" },
  { icon: Clock, title: "23時まで営業", desc: "お仕事帰りにも通いやすい。最終受付22時" },
];
```

### 医療（クリニック・歯科）
```typescript
// セクション名: 当院の特徴 / FEATURE
const SERVICES: ServiceItem[] = [
  { icon: Stethoscope, title: "痛みの少ない治療", desc: "極細針+表面麻酔で、注射の痛みを最小限に。お子様も安心" },
  { icon: Monitor, title: "最新のCT診断", desc: "3DCTで正確な診断。見えない部分まで把握した上で治療方針を決定" },
  { icon: CalendarCheck, title: "土曜も診療", desc: "平日は20時まで、土曜は17時まで。お仕事帰り・休日にも通院可能" },
  { icon: Baby, title: "キッズスペース完備", desc: "お子様連れでも安心。保育士が在籍するキッズルームをご用意" },
];
```

### 教育（塾・スクール・習い事）
```typescript
// セクション名: 選ばれる理由 / REASON
const SERVICES: ServiceItem[] = [
  { icon: UserCheck, title: "個別カリキュラム", desc: "一人ひとりの学力・目標に合わせたオーダーメイドの学習計画" },
  { icon: BarChart3, title: "合格率92%", desc: "志望校合格率92%。データに基づく指導で確実に成績を伸ばします" },
  { icon: MessageSquare, title: "月1回の三者面談", desc: "保護者・生徒・講師の三者面談で、学習状況と方針を共有" },
  { icon: BookOpen, title: "自習室使い放題", desc: "毎日22時まで開放。質問対応スタッフ常駐の自習室を無料で利用可能" },
];
```

**業種共通の注意点:**
- セクション名（H2）は業種に合わせる。建設会社=「事業内容」、工務店=「強み」、飲食=「こだわり」、医療=「特徴」、教育=「選ばれる理由」
- アイコンはタイトルの内容を直感的に表すものを選ぶ。全部同じアイコンは不可
- descは3行以内。長いとカードの高さが揃わなくなる
- 3〜4枚が最適。5枚以上はグリッドが崩れやすい

## 既存テンプレートとの接続

### 既存実装の状況

| テンプレート | 関数名 | section id | データ定数 | 内容 |
|---|---|---|---|---|
| warm-craft | `StrengthsSection()` | `#strength` | `STRENGTHS` | 強み4つ（自然素材/耐震/自社大工/アフター） |
| trust-navy | `ServicesSection()` | `#service` | `SERVICES` | 事業4つ（建築/改修/耐震/土木） |
| clean-arch | **未実装** | — | — | 追加が必要 |

### 既存データ構造

**warm-craft の STRENGTHS / trust-navy の SERVICES（同一構造）:**
```typescript
// どちらも全く同じインターフェース
const SERVICES = [  // or STRENGTHS
  {
    icon: Building2,  // Lucide React コンポーネント
    title: "建築工事",
    desc: "オフィスビル、商業施設、集合住宅の新築工事...",
  },
  // ...3〜4件
];
```

**プロパティ:** `icon`（Lucideコンポーネント）, `title`（string）, `desc`（string）

### 挿入位置

```
// warm-craft: 既存のStrengthsSection — そのまま編集
<WorksSection />
<StrengthsSection />  ← これを編集
<AboutSection />

// trust-navy: 既存のServicesSection — そのまま編集
<HeroSection />
<ServicesSection />  ← これを編集
<ProjectsSection />

// clean-arch: 新規追加 — WorksSection の前
<HeroSection />
<ServiceSection />   ← ここに追加
<WorksSection />
```

### navItemsへの影響

- warm-craft: `{ label: "私たちの強み", href: "#strength" }` — 既存、変更不要
- trust-navy: `{ label: "事業内容", href: "#service" }` — 既存、変更不要
- clean-arch: `["SERVICE", "#service"]` を追加

### カラーの合わせ方

| テンプレート | カード背景 | アイコン背景 | アイコンホバー | テキスト |
|---|---|---|---|---|
| warm-craft | `bg-white border border-[#E8DFD3]` | `bg-[#7BA23F]/10` | `bg-[#7BA23F]` + 白アイコン | `text-[#3D3226]` |
| trust-navy | `border border-gray-200` | `bg-[#F0F4F8]` | `bg-[#1B3A5C]` + 白アイコン | `text-[#1B3A5C]` |
| clean-arch | `border border-gray-200` | `bg-gray-100` | `bg-black` + 白アイコン | `text-black` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function ServicesSection() { ... }  // or StrengthsSection()
```

### データ定数
```typescript
import { Building2, Wrench, Shield, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

// 工務店向け例
const STRENGTHS: ServiceItem[] = [
  { icon: Home, title: "自然素材へのこだわり", desc: "無垢材、漆喰、珪藻土..." },
  { icon: Shield, title: "全棟 耐震等級3", desc: "消防署と同等レベルの耐震性能..." },
  { icon: Hammer, title: "自社大工による一貫施工", desc: "下請けに丸投げしません..." },
  { icon: Users, title: "建てた後も、ずっと。", desc: "引き渡しはゴールではなくスタート..." },
];

// 建設会社向け例
const SERVICES: ServiceItem[] = [
  { icon: Building2, title: "建築工事", desc: "オフィスビル、商業施設..." },
  { icon: Wrench, title: "改修・リノベーション", desc: "既存建物の大規模改修..." },
  { icon: Shield, title: "耐震・防災工事", desc: "耐震診断に基づく的確な補強..." },
  { icon: Briefcase, title: "土木工事", desc: "道路、橋梁、上下水道..." },
];
```

### 状態管理

なし。静的表示のみ。状態は不要。

### レスポンシブ対応
| ブレークポイント | グリッド |
|---|---|
| モバイル | `grid-cols-1` |
| タブレット | `sm:grid-cols-2` |
| デスクトップ | `lg:grid-cols-4`（trust-navy）or `lg:grid-cols-2`（warm-craft） |

## リファレンスコード（trust-navy の実装）

```tsx
<section id="service" className="py-20 sm:py-28 bg-white">
  <div className="max-w-[1100px] mx-auto px-5">
    {/* ヘッダー — 英語ラベル+H2+サブコピー */}
    <motion.div className="text-center mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">SERVICE</p>
      <h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl mb-3">事業内容</h2>
      <p className="text-gray-500 text-sm">幅広い分野で、確かな技術と実績を積み重ねています。</p>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {SERVICES.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div key={i}
            className="group p-7 border border-gray-200 hover:border-[#1B3A5C]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            {/* アイコン — ホバーで背景色反転 */}
            <div className="w-14 h-14 bg-[#F0F4F8] flex items-center justify-center mb-5 group-hover:bg-[#1B3A5C] transition-colors duration-300">
              <Icon className="w-7 h-7 text-[#1B3A5C] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-[#1B3A5C] text-base mb-3">{s.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        );
      })}
    </div>
  </div>
</section>
```

**注目すべき品質ポイント:**
- `group` + `group-hover:` でカード全体のホバーに連動してアイコンが変化
- アイコンボックスが正方形（`w-14 h-14`）+ `flex items-center justify-center`
- `strokeWidth={1.5}` でアイコンを細めに（建築系のクリーンな印象）
- カードに `rounded` なし（trust-navyはシャープなデザイン）
- warm-craftなら `rounded-2xl` を使う（柔らかいデザイン）

## 3層チェック

> この機能の核: **「何をやってくれる会社なのか」が10秒で伝わる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | セクションに `id="service"` or `id="strength"` 設定 | ナビゲーションから遷移できる | idなしでナビリンクが機能しない |
| F-2 | navItemsに対応するリンクあり | テンプレートのナビに表示される | リンクが未追加でナビから辿れない |
| F-3 | 3〜4個のカードが均等グリッド配置 | カードが均等幅で並んでいる | カードが不揃い/1列に全部並ぶ |
| F-4 | 各カードに Lucideアイコン + title + desc | 3要素全てが表示されている | アイコンなし/タイトル欠落 |
| F-5 | アイコンに `strokeWidth={1.5}` 設定 | アイコンが細めのクリーンな印象 | デフォルトの太い線幅で重い |
| F-6 | カードホバーで shadow-xl + -translate-y-1 | カードが浮き上がるアニメーション | ホバーしても変化なし |
| F-7 | アイコンホバーで背景色反転 | ブランドカラー背景+白アイコンに変化 | ホバーでアイコンが変化しない |
| F-8 | stagger animation（delay: i * 0.08） | カードが順次フェードイン | 全カード同時に出現 |
| F-9 | レスポンシブグリッド | モバイル1列/タブレット2列/PC適切な列数 | モバイルで4列のまま縮小 |
| F-10 | テンプレートのトーンに合致 | warm-craft=丸み、trust-navy=シャープ、clean-arch=ミニマル | テンプレートのデザイン言語を壊している |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | アイコン+タイトルだけで10秒スキャン可能 | カードをざっと眺めて事業内容がわかる | 10秒以内に全カード概要把握 | 12点 |
| U-2 | descが3行以内 | 説明文が簡潔でカード高さが揃う | 各カード3行以内 | 8点 |
| U-3 | カード高さが揃っている | グリッド内で高さのばらつきがない | 全カード同一高さ | 6点 |
| U-4 | アイコンが直感的 | アイコンがタイトルの内容を視覚的に表す | 見ただけで意味がわかる | 6点 |
| U-5 | モバイルでの可読性 | 1列で十分な文字サイズ | text-sm以上+アイコン24px以上 | 4点 |
| U-6 | カラースキームの統一 | テンプレートのアクセント/テキスト/背景色準拠 | 既存セクションと同じパレット | 4点 |

### Layer 3: 価値チェック（10秒で伝わるか）— 30点

この機能の核「『何をやってくれる会社なのか』が10秒で伝わる」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | サービス名が具体的 | 業種固有の具体的な名称 | 「全棟 耐震等級3」「完全マンツーマン」 | 「安心の施工」（伝わるが弱い） | 「ソリューション提供」（意味不明） |
| V-2 | アイコンが内容を直感的に表す | 見ただけでサービスを連想できる | Home=住宅、Shield=耐震、Scissors=カット | 汎用アイコンだが違和感なし | 全カード同じアイコン/無関係 |
| V-3 | 業態に合ったサービス構成 | 業種のユーザーが期待する内容 | 工務店→自然素材/耐震/自社大工/アフター | 工務店→設計/施工/管理（悪くない） | 工務店→「土木工事」（業態不一致） |
| V-4 | 説明文に具体性がある | 数字や固有名詞で差別化 | 「合格率92%」「23時まで営業」 | 「丁寧に対応します」 | 「お客様のニーズに最適なご提案」 |
| V-5 | 他社との差別化が伝わる | この会社ならではの強みが見える | 「自社大工による一貫施工」 | 「経験豊富なスタッフ」 | どの会社でも言える内容 |
| V-6 | セクション名が業種に合っている | H2が業種の慣習に沿っている | 工務店→「強み」/飲食→「こだわり」/医療→「特徴」 | 「サービス」（汎用だが問題なし） | 業種と不一致なセクション名 |

## スコアリング

### 合計100点の内訳
| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 10項目全PASSで30点。1つでもFAILなら0点 |
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
**90点の実装:** 業種別の具体的なサービス名（「全棟 耐震等級3」「自社大工による一貫施工」）+直感的アイコン。10秒スキャンで「何屋さんか」が明確。カード高さ揃い、ホバーエフェクト完備。
**80点の実装:** 技術的に全て動作し、アイコンも適切だが、説明文が「丁寧な対応」のような汎用表現。差別化が弱い。
**70点の実装:** カードは表示されるが、モバイルで4列のまま縮小。アイコンが全部同じ。タイトルが「サービス1」「サービス2」。

### この機能固有の重要判定ポイント
- **業態適合**: 工務店に「土木工事」は不自然。業態に合ったサービス内容になっているか
- **具体性**: 「お客様第一」は減点。数字や固有名詞で差別化すること
- **テキスト量**: descが長すぎるとカード高さが揃わない。3行以内が目安
- **角丸の統一**: warm-craft=rounded-2xl、trust-navy=角丸なし。テンプレートのデザイン言語を壊さないこと
