# SEO対策チェック
> ID: seo-check | カテゴリ: validation | プラン: all（全実装に適用）

## 概要

顧客サイトのSEO実装を包括的に検証するバリデーション機能。
どんな業種のサイトであっても、検索エンジンに正しく認識されなければ集客に繋がらない。
タイトルタグ・メタディスクリプション・OGP・構造化データ・セマンティックHTML・見出し階層・内部リンクなど、
検索エンジンとSNSシェアの両面からサイトの発見可能性を最大化する。

SEOが不十分な場合、どれだけ優れたデザインのサイトを作っても検索結果に表示されず、
顧客の事業成長に貢献できないサイトになる。
Next.js App Routerの `metadata` API / `generateMetadata` を活用し、
フレームワークのベストプラクティスに沿った実装を保証する。

## この機能の核
検索したときにこのサイトが見つかる

## チェック項目（20項目）

### 1. タイトルタグの個別設定
- 全ページに一意の `<title>` タグが設定されている
- 他ページと重複なし
- layout.tsxのmetadataだけでなく、各page.tsxごとに個別設定されている
- テンプレート機能（`title.template`）を使う場合もページ固有の部分が一意であること

### 2. タイトルタグの文字数
- `<title>` タグの文字数が **30〜60文字** の範囲内
- 30文字未満 = 情報不足で検索ユーザーの目を引けない
- 60文字超 = 検索結果で途切れて「...」になる
- 区切り文字（` | `, ` - `, ` — `）はどれかに統一

### 3. メタディスクリプションの個別設定
- 全ページに一意の `<meta name="description">` が設定されている
- ページ固有の要約であること（全ページ共通のコピペは不可）

### 4. メタディスクリプションの文字数
- 文字数が **70〜160文字** の範囲内
- 70文字未満 = 検索結果のスニペットが貧弱
- 160文字超 = 途切れて情報が伝わらない
- ページの核心的な価値を最初の70文字に凝縮する

### 5. OGPタグの設定
- 全ページに以下の5つのOGPタグが設定されている:
  - `og:title` — SNSシェア時のタイトル
  - `og:description` — SNSシェア時の説明文
  - `og:image` — SNSシェア時のサムネイル画像
  - `og:url` — 正規URL
  - `og:type` — `website`（トップ）/ `article`（下層）

### 6. OGP画像の品質
- `og:image` が **1200x630px以上** の画像を指定
- 絶対URLで記述されている（相対パスは不可）
- 画像が実際にアクセス可能（404やCORS制限で表示不能にならない）

### 7. Twitter Cardメタタグ
- `twitter:card` = `summary_large_image`（大きな画像カード）
- `twitter:title` — Xでのタイトル
- `twitter:description` — Xでの説明文
- `twitter:image` — Xでのサムネイル画像

### 8. canonical URL
- 全ページに `<link rel="canonical">` が設定されている
- 正規URLを正確に指している
- トレイリングスラッシュの有無が統一されている
- www有無が統一されている
- httpsを指している（httpではない）

### 9. 見出し階層
- 各ページにH1が **1つだけ** 存在する
- H1→H2→H3の順で飛ばしがない
- H1の直後にH3を使うのはNG（H2をスキップ）
- デザイン上のサイズ調整はCSSで行い、見出しレベルを乱さない

### 10. JSON-LD構造化データ
- 最低限以下の3スキーマを含む:
  - `LocalBusiness`（またはサブタイプ: `Restaurant`, `Store`, `MedicalBusiness` 等）
    - 会社名、住所、電話番号、営業時間、地理座標
  - `BreadcrumbList`
    - パンくずリスト連動。全下層ページで設定
    - 表示されているパンくずリストとJSON-LDの内容が一致
  - `FAQPage`
    - FAQセクションがある場合のみ
    - リッチリザルト対象（検索結果にQ&Aが直接表示される）

### 11. sitemap.xml
- `sitemap.xml` が生成されている
- 全公開ページのURLが含まれている
- 非公開ページ・管理画面URLが含まれていない
- `app/sitemap.ts` によるNext.js自動生成を推奨

### 12. robots.txt
- `robots.txt` が存在する
- 公開ページはAllow
- 管理画面・APIルートはDisallow
- `Sitemap:` ディレクティブでsitemap.xmlのURLを記載

### 13. セマンティックHTML
- 以下のタグを適切に使用している:
  - `<header>` — ヘッダー領域
  - `<main>` — メインコンテンツ（ページに1つ）
  - `<footer>` — フッター領域
  - `<nav>` — ナビゲーション
  - `<section>` — テーマ的なグループ
  - `<article>` — 自己完結するコンテンツ
- `<div>` だけでページを構成する「divスープ」にしない

### 14. 画像のalt属性
- 全画像に意味のある `alt` 属性が設定されている
- 空文字（`alt=""`）は装飾目的の画像のみ許容
- ファイル名の流用（`alt="IMG_0234.jpg"`）は不可
- `alt="image"` `alt="photo"` のような汎用語は不可

### 15. 内部リンク
- サイト内で関連ページへの内部リンクが適切に張られている
- 例: サービス→実績、FAQ→お問い合わせ、ブログ→関連サービス
- 孤立ページ（どこからもリンクされていないページ）がない
- アンカーテキストがリンク先の内容を表している

### 16. クリーンURL
- URLが日本語エンコードや連番IDではない
- 説明的な構造: `/works/`, `/about/`, `/contact/`
- NG例: `/page?id=3`, `/%E4%BC%9A%E7%A4%BE%E6%A6%82%E8%A6%81`
- ケバブケース（`/our-services/`）で統一

### 17. lang属性
- `<html lang="ja">` が設定されている
- 多言語対応の場合は `lang` 属性が各言語と一致
- layout.tsx の metadata で設定

### 18. Next.js metadata API
- `metadata` export または `generateMetadata` を使用
- 手動 `<head>` 操作を使っていない
- `next/head`（Pages Router用）を使っていない
- App Router のメタデータ規約に準拠

### 19. パンくずリスト
- 全下層ページにパンくずリストが表示されている
- JSON-LDの `BreadcrumbList` と表示内容が一致している
- トップページ → 親ページ → 現在のページ の階層構造

### 20. 404ページ
- カスタム404ページが実装されている（`app/not-found.tsx`）
- 適切なHTTPステータスコード（404）を返す
- トップページや主要ページへの誘導リンクがある
- サイトのブランドイメージと一貫したデザイン

## 3層チェック

> この機能の核: **検索したときにこのサイトが見つかる**
> 核が実現されているかどうかを、3層で検証する。
> ※ バリデーション機能のため、Layer 1 = チェック項目が正しく検証可能か、Layer 2 = チェック結果がUXに反映されるか、Layer 3 = サイトが実際に検索で見つかるか

### Layer 1: チェック項目の検証可能性（正しくチェックできるか）— 30点

全20チェック項目が技術的に検証可能かの確認。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | title/descriptionの自動検出 | 各page.tsxのmetadata exportをコード解析で検出可能 | metadataがdynamic importで解析不能 |
| F-2 | 文字数カウントの正確性 | title 30〜60文字、description 70〜160文字を正確に判定 | マルチバイト文字のカウントミス |
| F-3 | OGPタグの存在確認 | openGraph.title/description/image/url/typeの5項目を検出 | openGraphプロパティの構造変更で検出漏れ |
| F-4 | Twitter Cardの存在確認 | twitter.card/title/description/imageの4項目を検出 | twitter設定がopenGraphに統合され検出不能 |
| F-5 | 見出し階層の解析 | JSX内のh1〜h6の出現順・個数を正確にカウント | コンポーネント内のh1が検出されない |
| F-6 | JSON-LDスキーマ検出 | LocalBusiness/BreadcrumbList/FAQPageの3スキーマを検出 | dangerouslySetInnerHTML内のJSON-LDが解析不能 |
| F-7 | sitemap.ts/robots.tsの存在確認 | app/直下のファイル存在をチェック可能 | ファイルは存在するが中身が空 |
| F-8 | セマンティックHTMLタグ検出 | header/main/footer/nav/section/articleの使用率を計測 | JSXフラグメント内のタグが検出されない |
| F-9 | alt属性の品質判定 | 空文字・汎用語・ファイル名流用を自動検出 | 日本語altの品質判定が不正確 |
| F-10 | canonical/lang/viewport設定の確認 | layout.tsxのmetadata/viewport exportを解析 | generateMetadata使用時に静的解析不能 |

### Layer 2: UXへの反映（検索結果の表示品質）— 40点

チェック項目をPASSした結果、実際のユーザー体験が向上するかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 検索結果のタイトル品質 | 「何の会社か」が検索結果で即座にわかる | 業種+地域+差別化ポイントを含む | 10点 |
| U-2 | 検索結果のスニペット品質 | descriptionが魅力的でクリックしたくなる | 核心価値が最初の70文字に凝縮 | 10点 |
| U-3 | SNSシェア時の表示品質 | OGP画像+タイトルが美しく表示される | 1200x630px画像+適切なタイトル | 8点 |
| U-4 | リッチスニペット表示 | FAQ・レビュー等がGoogle検索結果に展開表示 | JSON-LDが正しく認識されている | 6点 |
| U-5 | 404ページの誘導品質 | 迷子ユーザーがトップページに戻れる | ブランド一貫+主要ページリンク | 4点 |
| U-6 | パンくずリストの表示 | 現在位置がわかり上位ページに戻れる | 表示とJSON-LDが一致 | 2点 |

### Layer 3: 核の目的達成（実際に検索で見つかるか）— 30点

この機能の核「検索したときにこのサイトが見つかる」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「地域名+業種」検索 | 1ページ目表示のポテンシャルがある | title+description+構造化データ全最適化 | title+descriptionは設定済み | titleが「ホーム」/descriptionなし |
| V-2 | 構造化データの完全性 | 3スキーマ全てが正しく設定されている | LocalBusiness(サブタイプ)+Breadcrumb+FAQ | LocalBusinessのみ | JSON-LDなし/構文エラー |
| V-3 | SNSでの発見可能性 | シェアされた時に魅力的に表示される | 大きなカード+自社写真+キャッチコピー | OGP設定済みだが画像が小さい | OGPなし/URLだけ表示 |
| V-4 | サイト全体のクロール可能性 | 全ページがGoogleにインデックスされる | sitemap+robots+内部リンク全整備 | sitemapあるがrobots.txtなし | Disallow: /で全ブロック |
| V-5 | コンテンツの構造化品質 | セマンティックHTML+見出し階層が完璧 | header/main/footer+H1→H2→H3の階層 | セマンティックHTMLだがH1が2つ | divスープ+見出しバラバラ |
| V-6 | 長期的なSEO基盤 | metadata API+ISR/SSGで運用に耐える | Next.js metadata API+ISR+canonical統一 | metadata APIは使用だがISR未設定 | next/head使用/手動meta |

## スコアリング

### 合計100点の内訳
| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: チェック検証可能性 | 30点 | 10項目全PASSで30点。1つでもFAILなら0点 |
| Layer 2: UX反映 | 40点 | 6項目、各項目の配点通り |
| Layer 3: 核の目的達成 | 30点 | 6項目、各5点 |

### 判定ルール
| スコア | 判定 | アクション |
|---|---|---|
| 90〜100 | **PASS** | そのまま次の機能へ。核が実現されている |
| 80〜89 | **CONDITIONAL** | Layer 2 or 3 の減点箇所を特定し修正 |
| 70〜79 | **FAIL** | UXか価値が不足。原因を記録し作り直し |
| 0〜69 | **CRITICAL FAIL** | チェック機能として動いていない。全体を作り直し |

### 合格ライン（チェック項目20項目ベース）
- **合格**: 20項目中 **18項目以上** クリア
  - **必須合格項目**（1つでも欠けたら不合格）: タイトル個別設定(1), OGP(5), 見出し階層(9), JSON-LD(10), lang(17), metadata API(18)
- **条件付き合格**: **16〜17項目** クリア（修正指示付き納品可）
- **不合格**: **15項目以下**、または必須合格項目が1つでも欠けている場合

### この機能固有の重要判定ポイント
- **タイトルの品質**: 文字数だけでなく「業種+地域+差別化」が含まれているか。「ホーム | 会社名」は即FAIL
- **JSON-LDの3点セット**: LocalBusiness+BreadcrumbList+FAQPageの3つ揃って初めて価値がある
- **OGP画像**: SNSシェアがSEOの入口。画像なしのURLだけ表示は致命的

## 業種別の注意点

### 建築・建設業
- titleパターン: `{会社名} | {地域名}の{業種}`
  - 例: `山田建設 | 東京の注文住宅・リフォーム`
- 構造化データ: `GeneralContractor` サブタイプの使用を推奨
- 重要キーワード: 「施工実績」「施工事例」をtitleとdescriptionに含める
- 地域名 + サービス名の組み合わせがロングテールキーワードとして有効

### 小売・EC
- 構造化データ: `Product` スキーマ必須
  - `price`, `availability`, `review` プロパティ含む
- `offer` の価格情報が最新であること（在庫切れ商品の `availability` 更新）
- パンくずリスト: カテゴリ > サブカテゴリ > 商品の3階層が理想
- 商品ページの canonical が重複しないよう注意（色違い・サイズ違い等）

### 飲食店
- 構造化データ: `Restaurant` スキーマ
  - `servesCuisine`, `openingHours`, `menu`, `priceRange` 含む
- `openingHours` が実際の営業時間と一致していること
- Googleマップとの連携を意識した `geo` プロパティの設定
- メニューページの構造化データで `Menu` + `MenuItem` スキーマ

### 医療・クリニック
- 構造化データ: `MedicalBusiness` または `Physician` スキーマ
- YMYL領域のため、E-E-A-T を示す構造化データが特に重要
- 医師情報に `Person` スキーマを設定し、資格・所属を明示
- 診療科目ごとにページを分け、個別の構造化データを設定

### 美容・サロン
- 構造化データ: `BeautySalon` または `HairSalon` スキーマ
- 予約導線に `reservationUrl` プロパティを設定
- メニュー・料金ページに `Service` + `Offer` スキーマ
- スタッフ紹介に `Person` スキーマ

### 士業（弁護士・税理士・行政書士等）
- 構造化データ: `LegalService` / `AccountingService` スキーマ
- YMYL領域のため、資格・所属団体の明示が重要
- FAQPageスキーマを積極的に活用（「よくある質問」がSEOに効く業種）
- 取扱業務ごとにページを分けて個別にSEO対策

### 教育・スクール
- 構造化データ: `EducationalOrganization` / `Course` スキーマ
- コース情報に `hasCourseInstance`, `coursePrerequisites` を設定
- 受講生の声に `Review` スキーマ
- 開講スケジュールに `Event` スキーマ

### ポートフォリオ・クリエイター
- 作品ページの `og:image` に代表作品の画像を設定
- 作品カテゴリごとのページ分けと個別メタデータ
- `Person` スキーマで経歴・受賞歴を構造化

## 参考基準

- **Google Search Central**: 検索エンジン最適化スターターガイド
  - https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **Google リッチリザルトテスト**: 構造化データの検証ツール
  - https://search.google.com/test/rich-results
- **Schema.org**: 各業種のスキーマ定義
  - https://schema.org/
- **OGPデバッガー**: Facebook Sharing Debugger
  - https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: Xでの表示確認
- **Lighthouse SEOスコア**: 90点以上を目標
- **Next.js Metadata API**: App Router の `metadata` / `generateMetadata`
  - https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **Google Search Console**: インデックスカバレッジ・検索パフォーマンスの継続モニタリング
- **ahrefs / SEMrush**: 競合サイトとのキーワードギャップ分析（上位プラン向け参考）
