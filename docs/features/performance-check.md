# パフォーマンスチェック
> ID: performance-check | カテゴリ: validation | プラン: all（全実装に適用）

## 概要

顧客サイトの表示速度とCore Web Vitalsを検証するバリデーション機能。
Googleの検索ランキング要因にCore Web Vitalsが含まれるため、パフォーマンスはSEOに直結する。

業種を問わず、表示が遅いサイトはユーザーの離脱率が急上昇する
（表示に3秒以上かかるとモバイルユーザーの53%が離脱）。
画像最適化が甘いとLCP（Largest Contentful Paint）が悪化し、
アニメーション過多はCLS（Cumulative Layout Shift）やINP（Interaction to Next Paint）に影響する。

ターゲット:
- **LCP ≤ 2.5s**
- **FID ≤ 100ms**（INP ≤ 200ms）
- **CLS ≤ 0.1**

Next.jsの最適化機能とVercel Edge CDNを最大限に活用した実装を保証する。

## この機能の核
待たされずに表示される

## チェック項目（20項目）

### 1. LCP（Largest Contentful Paint）
- **2.5秒以下** であること
- モバイル3G回線シミュレーションでも可能な限り4秒以内
- LCP要素を特定し、その読み込み経路を最適化
- 典型的なLCP要素: ヒーロー画像、メインビジュアル、大きなテキストブロック

### 2. FID / INP
- **FID（First Input Delay）≤ 100ms**
- **INP（Interaction to Next Paint）≤ 200ms**（2024年3月以降、Core Web Vitals入り）
- ユーザーの最初の操作（クリック・タップ・キー入力）への応答速度
- Long Taskがメインスレッドをブロックしていないこと

### 3. CLS（Cumulative Layout Shift）
- **0.1以下** であること
- 画像・フォント・動的コンテンツによるレイアウトシフトの総合値
- ページ読み込み中に要素が予期せず移動しない
- 広告・バナー・Cookie同意バーの挿入によるシフトも含む

### 4. next/image の使用
- 全画像が `next/image` コンポーネントを使用
- **WebP形式で自動最適化** されている
- 生の `<img>` タグ使用禁止
- SVGアイコンは `next/image` 不要（直接 `<svg>` または インライン）

### 5. 画像のsizes属性
- ビューポート幅に応じた配信サイズの最適化
- 例: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- sizes未設定だと全デバイスに最大サイズの画像が配信される
- レスポンシブ画像の配信サイズを正確に指定

### 6. lazy loading
- ファーストビュー外の画像にlazy loadingが適用
- `next/image` のデフォルト動作（明示的に `loading="eager"` にしていないこと）
- スクロールして初めて表示される画像は遅延読み込み
- `IntersectionObserver` ベースの遅延読み込み

### 7. ヒーロー画像のpriority
- LCP要素であるヒーロー画像に **`priority` 属性** が付与されている
- プリロード指示としてブラウザに優先的にダウンロードさせる
- `priority` がないとヒーロー画像がlazy loadingされ、LCPが大幅に悪化
- ページあたり1〜2枚が目安（全画像にpriorityを付けると効果が薄れる）

### 8. フォントの display 設定
- `display: swap` または `display: optional` が設定
- FOIT（Flash of Invisible Text）が発生しない
- `swap`: フォント読み込み前はフォールバックフォントで表示、読み込み後に切り替え
- `optional`: 即座にフォールバックで表示、高速接続時のみカスタムフォントを使用

### 9. next/font の使用
- `next/font` を使用してフォントをセルフホスティング
- 外部フォントサーバー（Google Fonts CDN）への追加リクエストを削減
- Google Fontsの `<link>` 直接読み込みは非推奨
- `next/font/google` or `next/font/local` を使用

### 10. JavaScriptバンドルサイズ
- ページ単位のFirst Load JSが **200KB未満** を目標
- `next build` の出力テーブルで確認
- 300KB超は要改善、500KB超は重大問題
- ルートごとのバンドルサイズをモニタリング

### 11. レンダーブロッキングリソース
- 外部CSSの同期読み込みがない
- `<head>` 内の通常 `<script>` タグがない
- Next.jsの `<Script>` コンポーネントを使用
- Critical CSSはNext.jsが自動的にインライン化

### 12. 動的インポート（dynamic import）
- 重いコンポーネントに `dynamic()` を適用:
  - 画像ギャラリー / ライトボックス
  - Google Maps
  - 動画プレーヤー
  - リッチテキストエディタ
  - チャートライブラリ
- `ssr: false` オプションで必要に応じてクライアントのみに
- 初期バンドルから除外されることを確認

### 13. Framer Motionの最適化
- アニメーション対象は **`transform` / `opacity` のみ**（GPUアクセラレーション対象）
- 以下のプロパティのアニメーションは禁止（リフロー発生）:
  - `width`, `height`
  - `top`, `left`, `right`, `bottom`
  - `margin`, `padding`
- `layout` プロパティの使用は最小限（ブラウザのリレイアウトコスト大）
- 同時アニメーション数が1ビューポートあたり **10個以下**

### 14. 未使用コードの排除
- Tailwind CSSのパージが正しく動作（`content` 設定が正確）
- 不要な `import` 文がない
- 開発中に試したが使わなくなったライブラリが残っていない
- `@next/bundle-analyzer` で確認推奨
- tree-shakingが効かないインポート（`import * as ...`）を避ける

### 15. 画像のwidth/height明示
- 全画像に **width / height** が明示されている
- または `fill` + `sizes` の組み合わせ
- ブラウザがスペースを事前確保してレイアウトシフトを防止
- アスペクト比を維持した表示の保証

### 16. サードパーティスクリプトの遅延読み込み
- 以下のスクリプトに `<Script strategy="lazyOnload">` を適用:
  - Google Analytics / Google Tag Manager
  - Google Maps JavaScript API
  - チャットウィジェット
  - SNS埋め込み（Twitter, Instagram等）
  - 広告タグ
- 初期表示に不要なスクリプトがレンダーをブロックしない
- `strategy="afterInteractive"` は本当に必要な場合のみ

### 17. CDNキャッシュ
- Vercel Edge CDNによるキャッシュが有効
- 静的アセットの `Cache-Control`:
  - `public, max-age=31536000, immutable`
- `X-Vercel-Cache: HIT` を確認
- 動的ページのstale-while-revalidate設定

### 18. preload / prefetch
- ヒーロー画像: `<link rel="preload">` （next/imageの `priority` で自動対応）
- 次ページ: Next.jsの `<Link prefetch>` 活用
- クリティカルフォント: `next/font` で自動対応
- 不要な `preload` はブラウザのリソース優先度を乱すため慎重に

### 19. ISR / SSGの活用
- 静的生成可能なページにSSGを使用:
  - 会社概要、サービス紹介、FAQ等の静的コンテンツ
  - `generateStaticParams` で事前生成
- 定期更新が必要なページにISRを使用:
  - ブログ一覧、ニュース等
  - `export const revalidate = 3600` （1時間ごと等）
- 全ページSSRは非効率（TTFBが遅い）
- SSGとISRの使い分けが明確

### 20. 不要な再レンダリングの抑制
- `React.memo` で純粋コンポーネントをメモ化
- `useMemo` で高コストな計算結果をキャッシュ
- `useCallback` でイベントハンドラの参照安定化
- DevTools Profilerで不要な再レンダリングを検出
- 状態管理の粒度が適切（1つのstateが多くのコンポーネントを不要に再レンダリングしない）

## 3層チェック

> この機能の核: **待たされずに表示される**
> 核が実現されているかどうかを、3層で検証する。
> ※ バリデーション機能のため、Layer 1 = チェック項目が正しく検証可能か、Layer 2 = チェック結果がUXに反映されるか、Layer 3 = ユーザーが「サクサク動く」と感じるか

### Layer 1: チェック項目の検証可能性（正しくチェックできるか）— 30点

全20チェック項目が技術的に検証可能かの確認。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | next/imageの使用率検出 | 全画像タグのうちnext/image使用率を計測可能 | コンポーネントライブラリ内の`<img>`が検出されない |
| F-2 | priority属性の確認 | ヒーロー画像のpriority有無を自動検出可能 | 動的importされた画像コンポーネントで検出困難 |
| F-3 | sizes属性の確認 | next/imageのsizes設定有無と内容を検出可能 | fill+sizes vs width+heightの使い分け判定が不正確 |
| F-4 | next/fontの使用確認 | next/font/google or next/font/localの使用を検出可能 | Google Fontsの`<link>`直接読み込みとの併用を検出 |
| F-5 | Framer Motion最適化の検出 | transform/opacity以外のアニメーション対象を検出可能 | animate関数内の動的プロパティが静的解析不能 |
| F-6 | dynamic()の適用確認 | 重いコンポーネントのdynamic import有無を検出可能 | 条件付きimportでdynamic()なしが検出困難 |
| F-7 | バンドルサイズの計測 | next buildの出力テーブルから各ルートのサイズを取得可能 | ビルドなしではサイズ不明 |
| F-8 | Script strategyの確認 | サードパーティスクリプトのstrategy属性を検出可能 | dangerouslySetInnerHTML内のscriptが検出されない |
| F-9 | ISR/SSG設定の確認 | revalidate/generateStaticParamsの有無を検出可能 | 動的ルートのSSG設定が複雑で判定困難 |
| F-10 | 生`<img>`タグの検出 | next/imageを使わない画像タグを全て検出可能 | SVGインラインとの誤検出 |

### Layer 2: UXへの反映（体感速度の向上）— 40点

チェック項目をPASSした結果、実際のユーザーの体感速度が向上するかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 4G回線での表示速度 | モバイル4G環境で全コンテンツが表示される | 3秒以内にファーストビュー完了 | 10点 |
| U-2 | スクロール時のカクつきなし | 60fpsでスムーズにスクロールできる | フレームドロップゼロ | 10点 |
| U-3 | タップへの即時反応 | ボタンタップから反応まで遅延なし | INP 200ms以内 | 8点 |
| U-4 | レイアウトシフトなし | 画像読み込みでテキストがガタつかない | CLS 0.1以下 | 6点 |
| U-5 | フォント表示の安定性 | テキストが最初から読める（FOIT/FOUTなし） | フォールバックフォントで即表示 | 4点 |
| U-6 | ヒーロー画像の優先表示 | ファーストビューの画像が最初に表示される | priority+preloadでLCP最適化 | 2点 |

### Layer 3: 核の目的達成（「サクサク動く」と感じるか）— 30点

この機能の核「待たされずに表示される」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「遅い」と思う場面がゼロ | 全ページ全操作で待たされる感覚がない | LCP<2s+INP<100ms+CLS<0.05 | LCP<2.5s+INP<200ms+CLS<0.1 | LCP>3s/スクロールがカクつく |
| V-2 | 画像の遅延読み込み体験 | スクロール時に画像が自然に表示される | 画面到達前にプリロード開始+フェードイン | lazy loading動作するがプレースホルダーなし | 全画像一括読み込みで固まる |
| V-3 | アニメーションの滑らかさ | 全アニメーションが60fpsで動作 | transform/opacityのみ+will-change最適化 | 概ね60fpsだが一部カクつき | アニメーションが重くてスクロール不能 |
| V-4 | バンドルサイズの最適化 | 初期表示に不要なコードが読み込まれない | dynamic()+tree-shaking+200KB未満 | 一部重いコンポーネントが初期バンドルに含まれる | 500KB超で初期表示が遅い |
| V-5 | CDN+SSG/ISRの活用 | 全ページでTTFBが最小化されている | SSG+Edge CDN+stale-while-revalidate | SSG使用だがISR未設定 | 全ページSSRでTTFB遅延 |
| V-6 | Lighthouse Performanceスコア | 実測値でGoogleの推奨基準をクリア | モバイル90点以上 | モバイル80点以上 | モバイル70点未満 |

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
- **合格**: 20項目中 **17項目以上** クリア
  - **必須合格項目**（1つでも欠けたら不合格）: Core Web Vitals 3指標(1,2,3), next/image(4), ヒーローpriority(7), next/font(9)
- **条件付き合格**: **15〜16項目** クリア（修正指示付き納品可）
- **不合格**: **14項目以下**、または必須合格項目が1つでも欠けている場合

### この機能固有の重要判定ポイント
- **LCPが全て**: ヒーロー画像のpriority未設定だけでLCPが3〜5秒に悪化する。最もインパクトが大きい項目
- **CLS対策**: 画像のwidth/height未指定は最も多い原因。next/imageを正しく使えば自動対応される
- **生`<img>`タグは即FAIL**: next/imageを使わない画像はWebP変換もlazy loadingも効かない。全項目に波及する

## よくある不合格パターン

1. **生の `<img>` タグ使用**
   - `next/image` を使わず `<img src="...">` で画像を埋め込み
   - WebP変換もlazy loadingもサイズ最適化もされない
   - LCP・CLS両方に悪影響

2. **priority属性の付け忘れ**
   - ヒーロー画像が遅延読み込みされる
   - LCPが3〜5秒に悪化
   - ファーストビューの最大画像には必ず `priority` を付ける

3. **width/height未指定**
   - 画像サイズが未定義
   - ブラウザがスペースを事前確保できない
   - 画像読み込み時にレイアウトシフトが発生（CLS悪化）

4. **Framer Motion の `layout` プロパティ乱用**
   - 多数の要素に `layout` を適用
   - レイアウトアニメーションが頻繁に発火
   - ブラウザのリレイアウトコストが増大してINPが悪化

5. **フォントのFOIT**
   - Google Fontsを `<link>` で読み込み
   - フォントダウンロード完了まで文字が見えない
   - `next/font` に移行すれば即解決

6. **全コンポーネント一括import**
   - `dynamic()` を使わず重いライブラリが初期バンドルに含まれる
   - Google Maps, 画像ギャラリー, チャットウィジェット等
   - First Load JSが500KB超

7. **Google Analyticsの同期読み込み**
   - `<script>` タグでhead内に直接記述
   - レンダーブロッキングが発生
   - `<Script strategy="afterInteractive">` を使うべき

8. **未使用importの放置**
   - 開発中に試したライブラリ（moment.js, lodash等）のimportが残る
   - バンドルサイズが数百KB膨らむ
   - tree-shakingが効かないケースも

9. **sizes属性の未設定**
   - `next/image` にsizesを指定せず
   - 375pxのモバイルに1280px幅の画像を配信
   - 転送量が3〜5倍に

10. **SSR過剰**
    - 全ページがリクエスト時にサーバーサイドレンダリング
    - 静的生成（SSG）で済むページ（会社概要・FAQ等）までTTFBが遅い
    - `generateStaticParams` / `revalidate` を活用すべき

11. **アニメーション対象の不適切な選択**
    - Framer Motionで `width` `height` `top` `left` をアニメーション
    - GPUアクセラレーションが効かず描画がガタつく
    - `transform: translateX()` / `scale()` に置き換え

12. **サードパーティスクリプトの初期読み込み**
    - Google Maps・チャットウィジェット・SNSウィジェットが全て初期読み込み
    - `strategy="beforeInteractive"` の誤用
    - 初期表示が大幅に遅延

13. **画像の過剰品質**
    - `quality={100}` を全画像に設定
    - ファイルサイズが不要に大きくなる
    - `quality={75}`（デフォルト）で十分なケースがほとんど

14. **不要な再レンダリング**
    - 親コンポーネントのstate変更で全子コンポーネントが再レンダリング
    - 入力フォームやリストのINPが200msを超える
    - `React.memo` / `useMemo` で抑制すべき

## 業種別の注意点

### 建築・建設業
- 施工写真が命のため画像が多い
- `next/image` + `sizes` + lazy loading の3点セットを徹底
- Before/Afterの高解像度画像はダイナミックインポートのライトボックス内で表示
- 施工実績一覧の画像グリッドは初期読み込み数を制限（最大12〜16枚）

### EC・小売
- 商品一覧ページの画像が大量
- `next/image` の `sizes` でモバイル/デスクトップの配信サイズを最適化
- 商品画像のズーム機能は `dynamic()` で遅延読み込み
- カート・決済フローはINP最優先（入力レスポンスが遅いと離脱に直結）

### 飲食店
- メニュー写真のギャラリーは画像最適化必須
- 原寸の写真（5MB+）をそのまま表示しない
- Google Mapsの埋め込みは `dynamic()` + `ssr: false` で遅延読み込み
- 「本日のおすすめ」等の動的コンテンツはISRで定期再生成

### 美容・サロン
- 施術例のBefore/After画像が多い
- サムネイル→フルサイズの2段階読み込みを推奨
- 予約ウィジェット（外部サービス埋め込み）は `lazyOnload` で遅延
- スタイリスト紹介の顔写真は軽量に

### 医療・クリニック
- ページ内容は比較的静的
- SSGで全ページ事前生成し、TTFBを最小化
- 医師紹介の顔写真は `quality={80}` + 適切な `sizes`
- 予約システムの外部スクリプトは遅延読み込み

### ポートフォリオ・クリエイター
- 作品画像の品質が最重要だが、初期表示速度とのバランスが難しい
- サムネイルは圧縮 + 小サイズ表示
- フルサイズ表示はライトボックスで動的読み込み
- Masonry/グリッドレイアウトの `layout` アニメーションは最小限に

### 教育・スクール
- 動画コンテンツが多い場合、動画プレーヤーは `dynamic()` で遅延
- サムネイル画像を先に表示し、再生ボタンタップで動画読み込み
- PDF教材のダウンロードリンクは初期読み込みに影響しないため通常リンクでOK

### 士業（弁護士・税理士等）
- テキスト中心のサイトが多く、画像最適化の問題は比較的少ない
- 外部リソース（Google Maps, 予約システム）の遅延読み込みが主要な改善ポイント
- SSGで全ページ事前生成が最適

## 参考基準

- **Google PageSpeed Insights**: パフォーマンススコア90点以上を目標
  - https://pagespeed.web.dev/
- **Core Web Vitals**: LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1
  - https://web.dev/vitals/
- **Lighthouse**: Chrome DevTools内蔵のパフォーマンス監査ツール
- **Next.js Image Optimization**: `next/image` のベストプラクティス
  - https://nextjs.org/docs/app/building-your-application/optimizing/images
- **Next.js Font Optimization**: `next/font` のベストプラクティス
  - https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- **Next.js Bundle Analyzer**: `@next/bundle-analyzer` によるバンドルサイズ可視化
- **Web Almanac by HTTP Archive**: 業界平均のパフォーマンス指標との比較
  - https://almanac.httparchive.org/
- **Vercel Analytics**: Real Experience Score による実ユーザーのパフォーマンスモニタリング
- **WebPageTest**: 複数地域・デバイスからのパフォーマンス測定
  - https://www.webpagetest.org/
- **Chrome DevTools Performance Tab**: Long Task・フレームレート・レイアウトシフトの詳細分析
