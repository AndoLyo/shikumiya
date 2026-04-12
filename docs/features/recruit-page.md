# 採用ページ
> ID: recruit-page | カテゴリ: page | プラン: premium

## 概要

企業の採用情報を独立サブページとして提供する機能。募集要項テーブル、企業文化セクション、福利厚生一覧、数字で見る会社、先輩の声、履歴書アップロードフォーム（ドラッグ&ドロップ対応）で構成する。業種を問わず、採用活動を行う全ての企業に必要なページ。trust-navy-pro テンプレートに既存実装（`/portfolio-templates/trust-navy-pro/recruit`）があり、それをベースとする。メインページ（page.tsx）内のセクションではなく、独立した `/recruit` ルートとして実装する。

## この機能の核
「ここで働きたい」と思って応募する。

## 必須要件

- 募集要項テーブル: 職種、勤務地、給与、勤務時間、休日、福利厚生、応募資格を含むこと
- 企業文化セクション: 写真+テキストで職場の雰囲気を伝える（3〜4ブロック）
- 福利厚生一覧: アイコン+テキストのグリッド表示
- 数字で見る会社: 従業員数、平均年齢、有給取得率等のインフォグラフィック
- 先輩の声: 2〜3名の社員インタビュー（写真+コメント）
- 履歴書アップロードフォーム: ドラッグ&ドロップ + ファイル選択ボタン（PDF/DOC/DOCX、最大5MB）
- フォームバリデーション: 氏名・メール・電話番号は必須
- 複数職種の募集がある場合、タブで切り替え
- メインページへの戻りリンク

## 業種別バリエーション

| 業種 | 募集職種例 | 数字の見せ方 |
|---|---|---|
| **建築・建設** | 施工管理、設計、現場スタッフ、事務 | 従業員数、平均年齢、有給取得率、資格取得支援 |
| **小売・EC** | 販売スタッフ、店長候補、バイヤー、EC運営 | 店舗数、平均勤続年数、社員満足度、昇格率 |
| **飲食** | ホールスタッフ、キッチン、店長候補、本部スタッフ | 店舗数、平均年齢、社員登用率、研修時間 |
| **美容・サロン** | スタイリスト、アシスタント、受付、マネージャー | スタッフ数、平均年齢、指名リピート率、独立支援数 |
| **医療・クリニック** | 医師、看護師、受付、医療事務 | スタッフ数、平均勤続年数、有給取得率、研修制度 |
| **IT・Web** | エンジニア、デザイナー、PM、営業 | エンジニア比率、リモート率、平均年齢、自己研鑽支援 |
| **士業・コンサル** | コンサルタント、事務、パラリーガル | 有資格者数、案件数、平均年齢、研修時間 |

### レイアウト構成
```
── 採用ページ（独立ルート） ──
┌─────────────────────────────────────────────┐
│  ← トップページに戻る                          │
│                                              │
│  RECRUIT / 採用情報                          │
│  キャッチコピー                               │
│                                              │
│  ── 数字で見る当社 ──                         │
│  [48名]   [38.5歳]  [95%]    [年12名]        │
│  従業員数  平均年齢  有給取得率  資格取得支援    │
│                                              │
│  ── 先輩の声 ──                              │
│  ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │ 写真│ │ 写真│ │ 写真│                   │
│  │入社3年│ │入社8年│ │入社15年│               │
│  │コメント│ │コメント│ │コメント│               │
│  └─────┘ └─────┘ └─────┘                   │
│                                              │
│  ── 福利厚生 ──                              │
│  アイコン+テキスト 4列グリッド                  │
│                                              │
│  ── 募集要項 ──                              │
│  [職種A] [職種B] [職種C] ← タブ切替           │
│  ┌────────┬──────────────────┐              │
│  │ 項目   │ 内容              │              │
│  └────────┴──────────────────┘              │
│                                              │
│  ── エントリーフォーム ──                     │
│  氏名 / メール / 電話 / 志望動機 / 履歴書      │
│  [ 応募する ]                                 │
└─────────────────────────────────────────────┘
```

## 既存テンプレートとの接続

### 既存実装の状況

trust-navy-pro に完全な採用ページが既に存在する。他テンプレートには未実装。

| テンプレート | 状態 | パス |
|---|---|---|
| warm-craft | **未実装** — 新規サブページとして追加 | `src/app/portfolio-templates/warm-craft/recruit/page.tsx` |
| trust-navy | **未実装** — 新規サブページとして追加 | `src/app/portfolio-templates/trust-navy/recruit/page.tsx` |
| trust-navy-pro | **実装済み** — ベースリファレンス | `src/app/portfolio-templates/trust-navy-pro/recruit/page.tsx` |
| clean-arch | **未実装** — 新規サブページとして追加 | `src/app/portfolio-templates/clean-arch/recruit/page.tsx` |

### 挿入手順

採用ページはメインページ（page.tsx）内のセクションではなく、独立した `/recruit/page.tsx` として作成する:

```
src/app/portfolio-templates/{template-id}/
  ├── page.tsx              // メインページ（既存）
  └── recruit/
      └── page.tsx          // 採用ページ（新規）
```

### メインページからのリンク

```tsx
// メインページのHeaderコンポーネント内のnavItemsに追加は任意。
// 代わりにフッターにリンクを追加する:
// warm-craft Footer:
<a href="/portfolio-templates/warm-craft/recruit" className="text-[#3D3226]/60 hover:text-[#3D3226] text-sm transition-colors">
  採用情報
</a>

// trust-navy Footer:
<a href="/portfolio-templates/trust-navy/recruit" className="text-white/50 hover:text-[#C8A96E] text-sm transition-colors">
  採用情報
</a>

// clean-arch Footer:
<a href="/portfolio-templates/clean-arch/recruit" className="text-gray-400 hover:text-black text-sm transition-colors">
  Recruit
</a>
```

### カラー適用（各テンプレート）

| テンプレート | ページ背景 | 見出し色 | アクセント | ボタン |
|---|---|---|---|---|
| warm-craft | `bg-[#FAF7F2]` | `text-[#3D3226]` | `text-[#7BA23F]` | `bg-[#7BA23F]` |
| trust-navy | `bg-[#F0F4F8]` | `text-[#1B3A5C]` | `text-[#C8A96E]` | `bg-[#C8A96E]` |
| clean-arch | `bg-white` | `text-black` | `text-gray-400` | `bg-black` |

### trust-navy-pro の既存データ構造（リファレンス）

trust-navy-pro/recruit/page.tsx では以下のデータが定義済み:
- `COMPANY` — 会社基本情報（name, nameEn, phone, email）
- `BENEFITS` — 福利厚生リスト（string[]）
- `JOBS` — 募集職種（id, title, type, location, salary, experience, licenses, description, duties, requirements, preferred）

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/recruit/page.tsx
  └── "use client"
  └── imports (framer-motion, lucide-react, next/link)
  └── COMPANY, STATS, BENEFITS, JOBS, VOICES — data constants
  └── function RecruitPage() { ... }
  └── export default RecruitPage
```

### Props / データ構造
```typescript
interface RecruitStat {
  /** Numeric value displayed */
  value: string;
  /** Unit or suffix */
  unit: string;
  /** Label text */
  label: string;
}

interface EmployeeVoice {
  /** Employee name (initials ok) */
  name: string;
  /** Years since joining */
  joinYear: string;
  /** Department / role */
  department: string;
  /** Photo URL (optional) */
  photo?: string;
  /** Comment text */
  comment: string;
}

interface BenefitItem {
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Benefit name */
  name: string;
  /** One-line description */
  description: string;
}

interface JobRequirement {
  /** Row label */
  label: string;
  /** Row content */
  content: string;
}

interface JobPosting {
  /** Job title */
  title: string;
  /** Employment type */
  employmentType: string;
  /** Requirements table rows */
  requirements: JobRequirement[];
  /** Job description */
  description?: string;
  /** Duties list */
  duties?: string[];
  /** Preferred qualifications */
  preferred?: string[];
}

interface RecruitConfig {
  /** Page title */
  pageTitle: string;
  /** Catchphrase */
  catchphrase: string;
  /** Stats section */
  stats: RecruitStat[];
  /** Employee voices */
  voices: EmployeeVoice[];
  /** Benefits list */
  benefits: BenefitItem[];
  /** Job postings */
  jobs: JobPosting[];
  /** Form submission URL */
  formAction: string;
  /** Accepted file types */
  acceptedTypes: string[];
  /** Max file size in MB */
  maxFileSize: number;
}

// Demo data — industry-agnostic
const DEMO_STATS: RecruitStat[] = [
  { value: "48", unit: "名", label: "従業員数" },
  { value: "38.5", unit: "歳", label: "平均年齢" },
  { value: "95", unit: "%", label: "有給取得率" },
  { value: "12", unit: "名/年", label: "資格取得支援" },
];

const DEMO_JOBS: JobPosting[] = [
  {
    title: "スタッフ募集",
    employmentType: "正社員",
    requirements: [
      { label: "勤務地", content: "東京都（本社）" },
      { label: "給与", content: "月給25万〜40万円（経験・資格による）" },
      { label: "勤務時間", content: "9:00〜18:00（実働8時間）" },
      { label: "休日", content: "土日祝、夏季・年末年始、有給休暇" },
      { label: "応募資格", content: "実務経験2年以上" },
      { label: "待遇", content: "社保完備、交通費全額支給、資格手当、退職金制度" },
    ],
  },
];
```

### 状態管理
```typescript
// Form state
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  motivation: '',
  desiredPosition: '',
});
const [file, setFile] = useState<File | null>(null);
const [isDragging, setIsDragging] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);

// Job tab
const [activeJobTab, setActiveJobTab] = useState(0);

// Drag & drop
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  const droppedFile = e.dataTransfer.files[0];
  if (validateFile(droppedFile)) setFile(droppedFile);
};

const validateFile = (f: File): boolean => {
  const allowedTypes = ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(f.type)) {
    setErrors(prev => ({ ...prev, file: 'PDF, DOC, DOCX形式のファイルを選択してください' }));
    return false;
  }
  if (f.size > config.maxFileSize * 1024 * 1024) {
    setErrors(prev => ({ ...prev, file: `ファイルサイズは${config.maxFileSize}MB以下にしてください` }));
    return false;
  }
  return true;
};

// Validation
const validate = (): boolean => {
  const newErrors: Record<string, string> = {};
  if (!formData.name.trim()) newErrors.name = '氏名を入力してください';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = '有効なメールアドレスを入力してください';
  if (!/^[\d-]{10,13}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = '有効な電話番号を入力してください';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## リファレンスコード（warm-craft スタイルで新規実装する場合）

```tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Check, Shield, Users, Clock, MapPin } from "lucide-react";
import Link from "next/link";

const COMPANY = {
  name: "山田工務店",
  nameEn: "YAMADA KOUMUTEN",
};

const STATS: RecruitStat[] = [
  { value: "30", unit: "名", label: "従業員数" },
  { value: "42", unit: "歳", label: "平均年齢" },
  { value: "90", unit: "%", label: "有給取得率" },
  { value: "8", unit: "名/年", label: "資格取得支援" },
];

export default function RecruitPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Back link */}
      <div className="max-w-[1000px] mx-auto px-5 pt-8">
        <Link href="/portfolio-templates/warm-craft" className="inline-flex items-center gap-2 text-[#3D3226]/60 hover:text-[#3D3226] text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> トップページに戻る
        </Link>
      </div>

      {/* Hero */}
      <section className="py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">RECRUIT</p>
          <h1 className="text-[#3D3226] font-bold text-3xl sm:text-4xl mb-4">採用情報</h1>
          <p className="text-gray-500">一緒に「いい家」をつくりませんか。</p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-[800px] mx-auto px-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-[#7BA23F] text-4xl font-bold">{stat.value}<span className="text-lg">{stat.unit}</span></p>
                <p className="text-[#3D3226]/60 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ... Benefits, Job Postings, Application Form sections ... */}
    </div>
  );
}
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | 全ブロック縦積み / 数字カード: 2列グリッド / 先輩の声: 1列 / 募集要項: label/content 縦積み / ドラッグ&ドロップ: タップで選択に切替 |
| **タブレット**（640〜1023px） | 数字カード: 4列 / 先輩の声: 3列 / 福利厚生: 3列 / 募集要項テーブル: 2カラム維持 |
| **デスクトップ**（1024px〜） | 数字カード: 4列 / 先輩の声: 3列 / 福利厚生: 4列 / フォーム: 60%幅中央揃え |

## 3層チェック

> この機能の核: **「ここで働きたい」と思って応募する**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 募集要項テーブル | 職種・勤務地・給与・勤務時間・休日・応募資格が全て含まれている | 項目が欠けている。テーブルが表示されない |
| F-2 | タブ切り替え | 複数職種がある場合、タブで正しく切り替わる | タブクリックしても内容が変わらない。全職種が混在 |
| F-3 | 数字セクション | 統計値（従業員数、平均年齢等）が正しく表示される | 数字が表示されない。レイアウトが崩れる |
| F-4 | 先輩の声 | 写真+入社年次+部署+コメントで構成される | 写真なし。コメントが空 |
| F-5 | 福利厚生グリッド | アイコン+テキストのグリッドで表示される | レイアウト崩れ。アイコンが表示されない |
| F-6 | フォームバリデーション | 氏名・メール・電話の必須項目バリデーションが機能する | 空欄で送信できてしまう。バリデーションエラーが出ない |
| F-7 | ファイルアップロード | ドラッグ&ドロップ+ファイル選択ボタンで履歴書をアップロードできる | D&Dが反応しない。ファイル選択ダイアログが開かない |
| F-8 | ファイルバリデーション | 不正なファイル形式(JPG等)/サイズ(5MB超)でエラーメッセージ表示 | 不正ファイルがエラーなく受理される |
| F-9 | 送信完了表示 | フォーム送信後に成功/エラーメッセージが表示される | 送信後に画面が変わらない。エラー時に何も表示されない |
| F-10 | 戻りリンク | メインページへの戻りリンク（ArrowLeft+テキスト）が正しく機能する | リンク切れ。戻りリンクがない |
| F-11 | セクションヘッダー | English label(tracking-[0.3em]) + H2 + subtextの3段構成 | H2だけ。パターン不一致 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、スムーズに情報収集・応募できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 募集職種の即座把握 | ページを開いて**5秒以内**に何の職種を募集しているかわかる | タブまたは見出しで職種名が一覧表示。スクロール不要で職種名が見える | 10点 |
| U-2 | 応募フォームの項目数 | 応募フォームの入力項目が**10個以下**で「やってみよう」と思える | 必須項目5個以下+任意項目5個以下。氏名・メール・電話・志望動機・履歴書 | 8点 |
| U-3 | モバイル完結 | スマホだけで**情報確認から応募完了**までできる | 全セクションがレスポンシブ。D&Dエリアがタップ選択にフォールバック | 8点 |
| U-4 | エラーメッセージの明確さ | 入力ミス時に**何をどう直せばいいか**が即座にわかる | エラー箇所のすぐ下に具体的メッセージ（「氏名を入力してください」等） | 7点 |
| U-5 | 募集要項→応募の導線 | 募集要項を読んだ後に**迷わず応募フォーム**に辿り着ける | 募集要項の直後に「応募はこちら」ボタンまたはフォームへのスムーズスクロール | 7点 |

### Layer 3: 価値チェック（働きたいと思うか）— 30点

この機能の核「ここで働きたいと思って応募する」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 会社の雰囲気が伝わるか | 先輩の声や写真から**職場の雰囲気がリアルに伝わる** | 実名+写真+入社3年目の具体的エピソード「先輩が毎週1on1してくれる」 | イニシャル+写真+「やりがいがあります」程度のコメント | コメントなし。または「アットホームな職場です」のみ |
| V-2 | 待遇が明確か | 給与・休日・福利厚生が**具体的な数字**で記載 | 「月給25万〜40万円（経験・資格による）」「年間休日120日」「有給取得率95%」 | 「月給25万円〜」「土日祝休」 | 「当社規定による」「要相談」で具体性ゼロ |
| V-3 | 数字で会社がイメージできるか | 統計数字から**会社の規模・文化が想像**できる | 「従業員48名」「平均年齢38.5歳」「有給取得率95%」「資格取得支援年12名」 | 「従業員数」「平均年齢」の2項目のみ | 数字セクションなし。または「多数」「若い」等の曖昧表現 |
| V-4 | 応募のハードルが低いか | 「とりあえず話を聞いてみよう」と**気軽に応募**できる | 「まずはカジュアル面談から」+履歴書は任意+フォーム5項目以下 | 履歴書必須だが項目数は適切 | 必須項目15個。職務経歴書必須。応募の心理ハードルが高すぎる |
| V-5 | 「自分が働いている姿」が想像できるか | ページ全体を通して**入社後の生活がイメージ**できる | 先輩の1日スケジュール+福利厚生+数字+キャッチコピーが一貫したストーリー | 各セクションの情報は揃っているが繋がりが弱い | テーブルだけの募集要項。「人」が見えない |

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
- テーブル・タブ・フォーム・D&D全て動作。バリデーション完備（L1: 30/30）
- 5秒で職種把握。フォーム7項目。モバイル完結。「応募はこちら」導線あり（L2: 35/40）
- 先輩の声が具体的。「月給25万〜40万」「有給95%」の数字。カジュアル面談OK（L3: 25/30）

**80点の実装:**
- 基本機能は動作。ファイルバリデーションのエラーメッセージが不明瞭（L1: 30/30）
- 職種把握OK。フォーム項目がやや多い（12項目）（L2: 28/40）
- 数字セクションあり。先輩の声は2名だがコメントがやや抽象的（L3: 22/30）

**70点の実装:**
- フォームは動くがD&Dが不安定（L1: 30/30 ギリギリ）
- 募集要項と応募フォームが離れていて導線が悪い。エラーメッセージが不親切（L2: 22/40）
- 「当社規定による」が3箇所。先輩の声がない。数字セクションが2項目のみ（L3: 18/30）

### この機能固有の重要判定ポイント

1. **「当社規定による」カウント**: 募集要項に「当社規定による」「要相談」が含まれる回数をカウント。**2回以上で価値チェックV-2自動FAIL**。具体的な数字で示せない項目は募集要項に入れるべきではない
2. **独立ページ構成**: 採用ページはメインページ内のセクションではなく、`/recruit`ルートとして実装する。trust-navy-proの実装がリファレンス
3. **応募導線の一貫性**: 募集要項→先輩の声→福利厚生→応募フォームの流れが「興味→共感→安心→行動」のファネルになっているか。順番が不適切な場合はUXで減点
4. **先輩の声のリアリティ**: 実名+写真+具体的エピソードが最高。匿名+イニシャルでも可だが、「やりがいがあります」のような抽象コメントはV-1で減点
