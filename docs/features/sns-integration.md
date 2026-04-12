# SNSリンク+埋め込み
> ID: sns-integration | カテゴリ: parts | プラン: lite

## 概要
サイト内に SNS アカウントへのリンクアイコン群、フィード埋め込み（Instagram 等）、コンテンツページのシェアボタンを配置するパーツ。業種を問わず、SNS とサイトの相互送客が集客の重要チャネルとなっている。既存3テンプレートにはフッターやコンタクトセクションに部分的な SNS リンクが存在するが、フィード埋め込みやシェアボタンは未実装。本機能は既存の SNS リンクを拡張し、フィード埋め込み・シェアボタンを追加する。

## この機能の核
「SNSでも発信してるんだ」と活動感を感じる

## 必須要件
- SNS アイコンリンク: フッター及びヘッダーに配置（`target="_blank" rel="noopener noreferrer"`）
- 対応 SNS: Instagram / X(Twitter) / Facebook / LINE / YouTube / LinkedIn / TikTok / note（業種で選択）
- アイコン: lucide-react の `Instagram`, `Twitter`, `Facebook`, `Youtube`, `Linkedin` 等を使用
- シェアボタン: 各ページのコンテンツを SNS に共有するボタン群
- OGP（Open Graph Protocol）メタタグ: `<meta property="og:title">`, `og:description`, `og:image`, `og:url`
- Twitter Card メタタグ: `<meta name="twitter:card" content="summary_large_image">`
- フィード埋め込み（オプション）: Instagram フィードの表示（iframe or API）

## 業種別バリエーション

### 建築・建設
主要 SNS: Instagram（施工事例写真）/ Facebook（企業ページ）/ YouTube（施工プロセス動画）
シェア対象: 施工実績の個別ページ
OGP 画像: 施工写真（代表的な1枚）

### 小売・EC
主要 SNS: Instagram（商品写真）/ LINE公式（クーポン配信）/ X(Twitter)（セール情報）
シェア対象: 商品ページ、セール情報
OGP 画像: 商品写真

### 飲食
主要 SNS: Instagram（料理写真）/ LINE公式（クーポン）/ TikTok（調理動画）
シェア対象: メニューページ、ニュース
OGP 画像: 看板メニュー写真

### 美容・サロン
主要 SNS: Instagram（ヘアスタイル/ネイル作品）/ HotPepper Beauty / LINE公式
シェア対象: スタイリストページ、ビフォーアフター
OGP 画像: 施術後の写真

### 医療・クリニック
主要 SNS: Facebook（医療情報）/ YouTube（解説動画）/ LINE公式（予約）
シェア対象: 診療案内、コラム記事
OGP 画像: クリニック外観
注意: 医療広告ガイドラインに準拠した内容であること

### 士業・コンサルティング
主要 SNS: LinkedIn（ビジネス情報）/ X(Twitter)（コラム告知）/ note（専門記事）
シェア対象: コラム記事、セミナー情報
OGP 画像: 事務所ロゴ or セミナーバナー

## 既存テンプレートとの接続

### warm-craft（暖色ナチュラル系）
- **現状の SNS リンク**: なし（Footer にサイトマップリンクのみ）
- **追加場所**: Footer のサイトマップリンク行の隣に SNS アイコンを追加
- **アイコンスタイル**: `text-white/50 hover:text-white transition-colors`（Footer のリンク色に合わせる）
- **追加候補**: Footer の `border-b` 区切りの上段に SNS アイコン行を追加

### trust-navy（ネイビー重厚系）
- **現状の SNS リンク**: なし（Footer にサイトマップリンクのみ）
- **追加場所**: Footer のサイトマップリンクの右隣にアイコン追加
- **アイコンスタイル**: `text-white/40 hover:text-white transition-colors`
- **アイコン装飾**: `w-8 h-8 border border-white/10 flex items-center justify-center`（ボーダー付きアイコンボックス）

### clean-arch（ミニマルモノクロ系）
- **現状の SNS リンク**: ContactSection 下部に Instagram リンク（行563〜567）
  ```tsx
  <a href="#" className="flex items-center gap-1.5 text-xs tracking-[0.15em] hover:text-gray-600 transition-colors">
    <Camera className="w-3.5 h-3.5" /> Instagram
  </a>
  ```
- **拡張方法**: 既存の Instagram リンクの横に他 SNS を追加
- **アイコンスタイル**: `text-gray-300 hover:text-gray-600`（ミニマル）

### 編集時の共通方針
- SNS リンクの追加は各テンプレートの既存デザイントーンに合わせる
- フィード埋め込みは新規セクションとして About と Contact の間に配置
- OGP メタタグは `src/app/portfolio-templates/{template-id}/layout.tsx` に設定
- シェアボタンは施工実績/商品等の詳細ページに配置（シングルページ構成では不要）

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── Footer() 内に SNS アイコン追加
  └── SnsSection()（フィード埋め込み、新規追加の場合）

src/app/portfolio-templates/{template-id}/layout.tsx
  └── OGP メタタグ設定
```

### Props / データ構造
```typescript
interface SnsAccount {
  platform: "instagram" | "x" | "facebook" | "line" | "youtube" | "linkedin" | "tiktok" | "note";
  url: string;             // "https://instagram.com/example"
  label: string;           // "Instagram"
  icon: LucideIcon;        // lucide-react アイコン
}

interface ShareButton {
  platform: "x" | "facebook" | "line" | "hatena";
  generateUrl: (pageUrl: string, pageTitle: string) => string;
}

interface OgpConfig {
  title: string;           // ページタイトル
  description: string;     // ページ説明
  image: string;           // OGP 画像 URL
  url: string;             // ページ URL
  siteName: string;        // サイト名
  type: "website" | "article";
}

interface SnsIntegrationConfig {
  accounts: SnsAccount[];
  showShareButtons: boolean;
  showFeedEmbed: boolean;
  feedEmbedPlatform?: "instagram";
  ogp: OgpConfig;
}
```

## リファレンスコード

### SNS アイコンリンク（Footer 内追加例 — warm-craft トーン）
```tsx
// Footer 内に追加
<div className="flex items-center gap-3 mt-4">
  {[
    { icon: Instagram, url: "https://instagram.com/example", label: "Instagram" },
    { icon: Facebook, url: "https://facebook.com/example", label: "Facebook" },
    { icon: Youtube, url: "https://youtube.com/@example", label: "YouTube" },
  ].map((sns) => (
    <a
      key={sns.label}
      href={sns.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sns.label}
      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center
        text-white/50 hover:text-white hover:bg-white/10 transition-all"
    >
      <sns.icon className="w-4 h-4" />
    </a>
  ))}
</div>
```

### clean-arch: 既存 Instagram リンク（拡張ベース）
```tsx
// src/app/portfolio-templates/clean-arch/page.tsx 行563〜567
<div className="mt-16 flex items-center gap-6 text-gray-300">
  <a href="#" className="flex items-center gap-1.5 text-xs tracking-[0.15em] hover:text-gray-600 transition-colors">
    <Camera className="w-3.5 h-3.5" /> Instagram
  </a>
  {/* 追加: X, LinkedIn 等 */}
</div>
```

### シェアボタン実装例
```tsx
function ShareButtons({ pageUrl, pageTitle }: { pageUrl: string; pageTitle: string }) {
  const shareLinks = [
    { label: "X", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}` },
    { label: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
    { label: "LINE", url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}` },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-xs">Share:</span>
      {shareLinks.map((link) => (
        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-800 text-xs transition-colors">
          {link.label}
        </a>
      ))}
    </div>
  );
}
```

### OGP メタタグ（layout.tsx 内）
```tsx
// src/app/portfolio-templates/{template-id}/layout.tsx
export const metadata = {
  openGraph: {
    title: "山田工務店 | 家族の暮らしに寄り添う家づくり",
    description: "創業30年、世田谷区を中心に500棟以上の施工実績。",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    url: "https://yamada-koumuten.jp",
    siteName: "山田工務店",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "山田工務店 | 家族の暮らしに寄り添う家づくり",
    description: "創業30年、世田谷区を中心に500棟以上の施工実績。",
    images: ["/og-image.jpg"],
  },
};
```

## 3層チェック

> この機能の核: **「SNSでも発信してるんだ」と活動感を感じる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | アイコンリンク | SNSアイコンに `target="_blank" rel="noopener noreferrer"` が設定されている | 同じタブで開く。rel属性なし |
| F-2 | aria-label | 各SNSアイコンに `aria-label="Instagram"` 等のアクセシビリティ属性がある | aria-labelなし。スクリーンリーダーで「リンク」としか読まれない |
| F-3 | シェアボタン | シェアボタンが `encodeURIComponent` でURL/タイトルを正しくエンコードしている | エンコードなしで日本語URLが壊れる |
| F-4 | OGP title/desc | `og:title`, `og:description`, `og:url` メタタグが正しく設定されている | OGPタグなし。シェア時にタイトルが空 |
| F-5 | OGP画像 | `og:image` が 1200x630px の画像URLを指している | 画像なし。サイズが不正でSNSで切れる |
| F-6 | Twitter Card | `twitter:card`, `twitter:title`, `twitter:image` が正しく設定されている | Twitter Cardタグなし。Xでの表示がプレーンURL |
| F-7 | フィード埋め込み | Instagram等のフィード埋め込みが遅延読み込みで実装されている | 遅延なしで初期ロードを重くしている。またはiframeエラー |
| F-8 | レスポンシブ | アイコンサイズ・間隔がモバイル/デスクトップで適切に調整される | モバイルでアイコンが重なる。はみ出す |
| F-9 | ホバーエフェクト | アイコンのホバー色・背景変化がテンプレートのパレットに合致 | 色がハードコードでテンプレートと合わない |
| F-10 | リンク先の正当性 | 全SNSリンクが実在する運用中のアカウントを指している | 404エラー。プロフィール以外のURLに飛ぶ |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | アイコンのクリッカブル面積 | SNSアイコンが**44px以上のタップ領域**を持っている | `w-8 h-8` 以上のアイコン + パディング。隣のアイコンと誤タップしない間隔 | 10点 |
| U-2 | フィードの読み込み速度 | 埋め込みフィードが**3秒以内に表示**される | 遅延読み込み実装済み。ローディングプレースホルダーあり | 8点 |
| U-3 | 新しい投稿の可視性 | 埋め込みフィードで**最新の投稿が見えている** | フィードの1件目が1週間以内の投稿。更新感がある | 8点 |
| U-4 | SNSリンクの発見しやすさ | フッターまたはヘッダーで**3秒以内にSNSアイコンが見つかる** | 一般的な配置場所（フッター下部/ヘッダー右端）にある | 7点 |
| U-5 | シェア後の体験 | シェアボタンを押した後、**OGP画像付きの見栄えのいい投稿**になる | Facebook/X/LINEの各プラットフォームでOGPプレビューが正しく表示される | 7点 |

### Layer 3: 価値チェック（活動感を感じるか）— 30点

この機能の核「SNSでも発信してるんだ」と活動感を感じるかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 活動感の伝達 | SNSリンク/フィードを見て**「この会社はSNSも活発だ」**と感じる | 最新投稿が埋め込まれ、週1以上の更新頻度が見える | アイコンリンクがあり、クリックすれば投稿が確認できる | リンク先が半年以上更新なし。活動停止に見える |
| V-2 | フォロー意欲 | SNSを見て**「フォローしたい」**と思える | フィード埋め込みで内容がわかり、フォローボタンへの導線がある | アイコンクリックでプロフィールに飛べる | リンク先が不明。何を発信しているかわからない |
| V-3 | 業種との適合 | 表示されるSNSが**その業種で実際に活用されているプラットフォーム** | 建築→Instagram(施工写真)+YouTube(施工動画)。運用実態に合致 | 業種に合ったSNSが含まれている | 飲食業なのにLinkedInだけ。業種と不一致 |
| V-4 | 未運用SNSの排除 | 運用していないSNSのリンクが**含まれていない** | 実際に運用中の2〜3アカウントのみ表示 | 運用頻度の低いSNSが1つ含まれる | 作っただけで投稿ゼロのアカウントリンクがある |
| V-5 | シェアの動機づけ | コンテンツを見て**「これを誰かに教えたい」**と思えるシェア導線がある | 施工実績ページに「この事例をシェア」ボタン+OGPで写真付きシェア | ページ下部にシェアボタンがある | シェアボタンなし。URLを手動コピーするしかない |
| V-6 | 信頼性の補強 | SNS連携が**企業の信頼性を補強**している | SNSフォロワー数やレビューが見え、「多くの人が支持している」と感じる | SNSリンクがあり「公式アカウント」とわかる | SNSリンク先が個人アカウント。公式感ゼロ |

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
- OGPタグ完備。全アイコンにaria-label。target="_blank"漏れなし（L1: 30/30）
- アイコン44px+で誤タップなし。Instagramフィード埋め込みが2秒で表示。最新投稿が見える（L2: 35/40）
- 週1更新のInstagramフィードが埋め込まれ活動感あり。施工実績ページにシェアボタン+OGP写真付き（L3: 25/30）

**80点の実装:**
- OGPタグあり。アイコンリンクは機能する（L1: 30/30）
- アイコンは押せるがフィード埋め込みなし。シェアボタンはある（L2: 28/40）
- SNSリンクはあるが埋め込みなし。クリックしないと更新頻度がわからない（L3: 22/30）

**70点の実装:**
- OGPタグ不完全（og:imageなし）（L1: 30/30）
- アイコンが小さく誤タップしやすい。フィードなし（L2: 22/40）
- SNS更新が3ヶ月前。活動停止に見える（L3: 18/30）

### この機能固有の重要判定ポイント

1. **OGPの完全性**: OGPが不完全だとSNSシェア時にURLだけの投稿になり、クリック率が激減する。**og:imageなしはV-5自動FAIL**
2. **未運用SNSの混入**: 投稿ゼロのアカウントリンクは信頼性を下げる。**3ヶ月以上更新なしのSNSリンクが含まれる場合V-4自動FAIL**
3. **`target="_blank"` の漏れ**: 同タブ遷移はサイト離脱に直結する。**1箇所でも漏れがあればF-1自動FAIL**
