# フッター
> ID: footer | カテゴリ: parts | プラン: lite

## 概要
サイト最下部に配置されるグローバルフッター。会社情報、サイトマップ（ナビリンク）、SNSアイコンリンク、法的リンク（プライバシーポリシー・利用規約等）、コピーライトを集約し、サイトの信頼性と回遊性を担保する。フッターは「最後に見るエリア」であり、お問い合わせ導線の最終防衛ラインとして機能する。業種を問わずあらゆるビジネスサイトに必須のパーツ。既存3テンプレートすべてに `Footer()` が実装済みのため、本機能は既存コードの編集・拡張で対応する。

## この機能の核
住所と電話番号を見て「実在する会社だ」と安心する

## 必須要件
- `<footer>` セマンティックタグを使用
- 会社名（ロゴ）+ 所在地 + 電話番号を表示
- サイトマップリンク: ヘッダーのナビ項目と同じセクションへのリンクを配置
- コピーライト表記: `© {currentYear} {会社名}. All rights reserved.`（年は `new Date().getFullYear()` で動的生成）
- SNS アイコンリンク: 運用している SNS への外部リンク（`target="_blank" rel="noopener noreferrer"`）
- 法的リンク: プライバシーポリシー / 特定商取引法に基づく表記（業種に応じて選択）
- レスポンシブ: モバイルで縦積み（`flex-col`）、デスクトップで横並び（`md:flex-row`）
- warm-craft テンプレートの SP固定底部電話バーがある場合、`pb-24 md:pb-10` で余白確保

## 業種別バリエーション

### 建築・建設
表示項目: 会社名 / 所在地 / 電話番号 / 建設業許可番号 / ISO認証
サイトマップ: 施工実績 / 技術 / 会社概要 / お問い合わせ / 採用情報
SNS: Instagram（施工事例） / Facebook（企業ページ）

### 小売・EC
表示項目: 店舗名 / 所在地 / 電話番号 / 営業時間
サイトマップ: 商品一覧 / 店舗案内 / 会社概要 / お問い合わせ / 返品ポリシー
法的リンク: 特定商取引法に基づく表記 / プライバシーポリシー / 利用規約
SNS: Instagram / LINE公式 / X(Twitter)

### 飲食
表示項目: 店舗名 / 所在地 / 電話番号 / 営業時間 / 定休日
サイトマップ: メニュー / 店舗案内 / こだわり / 予約 / ニュース
SNS: Instagram（料理写真） / 食べログリンク / Googleマップ

### 美容・サロン
表示項目: サロン名 / 所在地 / 電話番号 / 営業時間 / 定休日
サイトマップ: メニュー / スタッフ / サロン案内 / 予約 / ブログ
SNS: Instagram / HotPepper Beauty / LINE公式

### 医療・クリニック
表示項目: 医院名 / 所在地 / 電話番号 / 診療時間 / 休診日
サイトマップ: 診療案内 / 医師紹介 / 施設案内 / アクセス / 予約
法的リンク: 個人情報保護方針

### 士業・コンサルティング
表示項目: 事務所名 / 所在地 / 電話番号 / FAX / 代表者名
サイトマップ: サービス / 実績 / メンバー / コラム / お問い合わせ
SNS: LinkedIn / note / X(Twitter)

## 既存テンプレートとの接続

### warm-craft（暖色ナチュラル系）
- **Footer()**: `src/app/portfolio-templates/warm-craft/page.tsx` 行797〜828
- 背景色: `bg-[#3D3226]`（ダークブラウン）
- 構成: ロゴ（`Home`アイコン `bg-[#7BA23F]` + 会社名 + `since`）→ サイトマップリンク4項目 → 所在地 + コピーライト
- SP対応: `pb-24 md:pb-10`（固定底部電話バーとの干渉回避）
- リンク色: `text-white/50 hover:text-white transition-colors`
- 区切り: `border-b border-white/10` でロゴ・ナビ領域と住所・コピーライト領域を分離

### trust-navy（ネイビー重厚系）
- **Footer()**: `src/app/portfolio-templates/trust-navy/page.tsx` 行706〜728
- 背景色: `bg-[#0D2440]`（ディープネイビー）
- 構成: 会社名（和名 `text-white font-bold` + 英名 `text-white/25`）→ サイトマップリンク4項目 → 所在地・電話 + コピーライト
- リンク色: `text-white/40 hover:text-white transition-colors`
- 区切り: `border-b border-white/10`

### clean-arch（ミニマルモノクロ系）
- **Footer()**: `src/app/portfolio-templates/clean-arch/page.tsx` 行576〜588
- 背景色: `bg-white` + 上部ボーダー `border-t border-gray-100`
- 構成: 超ミニマル — 事務所名 `text-xs font-light tracking-[0.25em]` + 所在地 + コピーライトのみ
- サイトマップリンク: なし（ミニマル志向で省略）
- テキスト色: `text-gray-400` / `text-gray-300`

### 編集時の共通方針
- SNS リンクを追加: 各テンプレートのサイトマップリンク行の近くに追加
- 法的リンクを追加: コピーライト行の隣に `|` 区切りで配置
- 業種固有情報（許可番号等）: 所在地テキストの下に追記
- clean-arch にサイトマップリンクを追加する場合は、ミニマルトーンに合わせ `text-gray-300` テキストリンクを使用

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── Footer() コンポーネント（モノリシック内で定義）
```

### Props / データ構造
```typescript
interface SnsLink {
  platform: string;        // "instagram" | "facebook" | "x" | "line" | "linkedin"
  url: string;             // "https://instagram.com/example"
  icon: LucideIcon;        // lucide-react のアイコン
}

interface LegalLink {
  label: string;           // "プライバシーポリシー"
  href: string;            // "/privacy"
}

interface FooterConfig {
  companyName: string;
  companyNameEn?: string;  // trust-navy で使用
  address: string;
  postalCode?: string;     // "〒000-0000"
  phone?: string;
  fax?: string;
  email?: string;
  hours?: string;          // 営業時間
  closedDays?: string;     // 定休日
  license?: string;        // 建設業許可番号等
  since?: string;          // 創業年
  sitemapLinks: { label: string; href: string }[];
  snsLinks: SnsLink[];
  legalLinks: LegalLink[];
  hasMobileBottomBar: boolean;  // warm-craft の SP固定底部バー
}
```

## リファレンスコード

### warm-craft: Footer（ロゴ + サイトマップ + 会社情報）
```tsx
// src/app/portfolio-templates/warm-craft/page.tsx
function Footer() {
  return (
    <footer className="py-10 bg-[#3D3226] pb-24 md:pb-10">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7BA23F] flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{COMPANY.name}</p>
              <p className="text-white/40 text-[9px] tracking-wider">since {COMPANY.since}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {["施工実績", "私たちの強み", "会社案内", "お問い合わせ"].map((label) => (
              <a key={label} href={`#${...}`}
                className="text-white/50 text-xs hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <p>〒000-0000 {COMPANY.address}</p>
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

### trust-navy: Footer（和名+英名 + サイトマップ + 住所・電話）
```tsx
// src/app/portfolio-templates/trust-navy/page.tsx
function Footer() {
  return (
    <footer className="bg-[#0D2440] py-10 px-5">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-white/10">
          <div>
            <p className="text-white font-bold text-sm">{COMPANY.name}</p>
            <p className="text-white/25 text-[9px] tracking-[0.15em]">{COMPANY.nameEn}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-white/40 text-xs">
            {["事業内容", "施工実績", "会社概要", "お問い合わせ"].map((label, i) => (
              <a key={label} href={`#${["service","works","about","contact"][i]}`}
                className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-[10px]">
          <p>{COMPANY.address}　TEL: {COMPANY.phone}</p>
          <p>© {new Date().getFullYear()} {COMPANY.name}</p>
        </div>
      </div>
    </footer>
  );
}
```

### clean-arch: Footer ミニマル版
```tsx
// src/app/portfolio-templates/clean-arch/page.tsx
function Footer() {
  return (
    <footer className="py-10 border-t border-gray-100 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs font-light tracking-[0.25em] text-gray-400">{OFFICE.name}</p>
          <p className="text-[10px] text-gray-300 tracking-wider mt-0.5">{OFFICE.address}</p>
        </div>
        <p className="text-[10px] text-gray-300 tracking-wider">
          © {new Date().getFullYear()} {OFFICE.nameJa}
        </p>
      </div>
    </footer>
  );
}
```

## 3層チェック

> この機能の核: **住所と電話番号を見て「実在する会社だ」と安心する**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | セマンティックタグ | `<footer>`タグでマークアップされている | `<div>`で代用。セマンティック構造なし |
| F-2 | 会社情報表示 | 会社名・所在地・電話番号が正しく表示されている | 会社名がない。住所が不完全 |
| F-3 | カラムレイアウト | モバイルで`flex-col`縦積み、デスクトップで`md:flex-row`横並び | 全端末で横並びのまま。モバイルで文字が潰れる |
| F-4 | サイトマップリンク | ヘッダーのナビ項目と一致したリンクが配置されている | リンク先がヘッダーと不一致。リンク切れ |
| F-5 | SNSアイコンリンク | `target="_blank" rel="noopener noreferrer"`で外部リンクが開く | 同じタブで開く。rel属性なし |
| F-6 | 法的リンク | プライバシーポリシー等が業種の要件に応じて配置されている | ECなのに特商法リンクなし。法的リンクが全くない |
| F-7 | コピーライト | `© {currentYear}`が`new Date().getFullYear()`で動的生成 | 年がハードコード。コピーライト表記なし |
| F-8 | リンク動作 | フッター内の全リンクが正しく遷移する（リンク切れなし） | リンク切れ。404エラー |
| F-9 | SP固定バー余白 | warm-craftテンプレートで`pb-24 md:pb-10`の余白が確保されている | 固定底部バーとフッター内容が重なる |
| F-10 | ホバーエフェクト | リンクのホバーがテンプレートの配色に準拠している | ホバーなし。色がテンプレートと不一致 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、必要な情報にアクセスできるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 住所・電話番号の発見速度 | フッターを見て**3秒以内**に住所・電話番号が見つかる | テキストサイズ10px以上。背景とのコントラスト確保。情報が散在しない | 10点 |
| U-2 | リンク機能の充実 | フッターから**必要なページに即座に遷移**できる | サイトマップリンクがヘッダーナビと一致。全リンクが動作 | 8点 |
| U-3 | モバイルでの読みやすさ | スマホで**フッター情報が快適に読める** | 縦積みレイアウト。タップ可能なリンクは44px間隔。電話番号が`tel:`リンク | 8点 |
| U-4 | 電話番号のタップ発信 | スマホで電話番号をタップして**即座に発信**できる | `tel:`リンク設定。タップ領域が十分 | 7点 |
| U-5 | 法的情報へのアクセス | プライバシーポリシー等を**すぐ見つけられる** | フッター最下部にリンク配置。業種に応じた法的リンクが全て揃っている | 7点 |

### Layer 3: 価値チェック（実在する会社と安心できるか）— 30点

この機能の核「住所と電話番号を見て実在する会社だと安心する」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「実在する会社」と確信できるか | 住所・電話番号から**会社の実在性が伝わる** | 「〒000-0000 東京都○○区○○1-2-3」+「TEL: 03-0000-0000」+Googleマップリンク | 住所と電話番号は記載あり | 住所なし。電話番号なし。会社名のみ |
| V-2 | 法的情報が揃っているか | 業種に応じた**法的要件が全てカバー**されている | EC:特商法+プライバシーポリシー+利用規約。医療:個人情報保護方針 | プライバシーポリシーのみ | 法的リンクなし |
| V-3 | 信頼感があるか | フッターのデザインが**会社の信頼性を補強** | 建設業許可番号、ISO認証マーク、創業年数が記載 | 会社名+住所+電話の基本情報 | フッターが簡素すぎて「この会社大丈夫か？」と不安 |
| V-4 | SNSリンクが実運用されているか | **実際に運用されているSNS**へのリンクがある | Instagram(施工事例更新中)+Facebook(企業ページ)のリンクが正しく開く | SNSリンクはあるが運用状況は不明 | 未運用SNSへのリンク。またはSNSリンクが一切ない |
| V-5 | 営業時間・定休日が明確か | **いつ連絡していいか**がわかる | 「営業時間: 9:00〜18:00（土日祝休み）」と明記 | 営業時間は記載あるが定休日がない | 営業時間の記載なし。電話していい時間がわからない |

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
- セマンティックタグ・リンク・レスポンシブ・ホバー全て動作。年は動的生成（L1: 30/30）
- 住所・電話が3秒で見つかる。tel:リンク。法的リンク完備。モバイルで縦積み（L2: 35/40）
- 住所+電話+建設業許可番号+営業時間+Instagram。「実在する会社」の確信（L3: 25/30）

**80点の実装:**
- 基本機能は動作。SNSリンクのrel属性が一部欠落（L1: 30/30 ギリギリ）
- 住所・電話は見つかる。法的リンクはプライバシーポリシーのみ（L2: 28/40）
- 基本情報は揃うが許可番号や営業時間がない（L3: 22/30）

**70点の実装:**
- フッターは表示されるがモバイルで横並びのまま（L1: 30/30 ギリギリ）
- 住所が見つけにくい。電話番号がtel:リンクでない（L2: 22/40）
- 会社名のみ。住所なし。「本当に実在する会社？」と不安（L3: 18/30）

### この機能固有の重要判定ポイント

1. **サイトマップ・ヘッダー整合性**: フッターのサイトマップリンクとヘッダーのナビ項目が不一致の場合、F-4でFAIL。ユーザーが混乱する重大問題
2. **法的リンクの業種依存**: EC は特定商取引法必須、医療は個人情報保護方針必須、建設は建設業許可番号表示。業種に応じた法的要件が欠けている場合はV-2で減点
3. **clean-archのミニマル例外**: clean-archはミニマル志向でサイトマップリンクを省略しているが、最低限の会社情報（名前+住所）は必須。ミニマルすぎて信頼感がない場合はV-3で減点
4. **SP固定底部バーとの干渉**: warm-craftの固定底部電話バーとフッター内容が重なる問題はF-9で検出。`pb-24 md:pb-10`の余白が確保されていること
