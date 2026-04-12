# 動画セクション
> ID: video-section | カテゴリ: section | プラン: premium

## 概要

YouTube/Vimeo の埋め込み動画を、カスタム再生ボタンオーバーレイ付きで表示するセクション。静止画では伝えきれない空間の広がり・サービスの臨場感・人の温かみを動画で訴求する。サムネイル画像にカスタム再生ボタンを重ね、クリックで初めて iframe をロードする遅延読み込み設計が必須（初期ロードで iframe を読むと LCP が1〜3秒悪化する）。レスポンシブな16:9アスペクト比維持、背景動画モード（ミュート・ループ）もオプション提供。業種を問わず、動画コンテンツを持つ全ての企業に適用可能。

## この機能の核
「文字じゃ伝わらない雰囲気」を感じ取る。

## 必須要件

- YouTube / Vimeo のURL埋め込みに対応すること
- カスタム再生ボタンオーバーレイ（サムネイル画像 + 再生アイコン）を表示し、クリックで再生開始
- 遅延読み込み: iframe はユーザーが再生ボタンを押すまでロードしないこと（パフォーマンス最適化）
- レスポンシブなアスペクト比維持（16:9）
- 背景動画モード（ミュート・ループ・自動再生）をオプションで提供
- フルスクリーン再生ボタンの提供

## 業種別バリエーション

| 業種 | 動画コンテンツ例 |
|---|---|
| **建築・建設** | 施工プロセスタイムラプス、完成物件ウォークスルー、会社紹介PV |
| **小売・EC** | 商品紹介動画、使い方ガイド、ブランドストーリー |
| **飲食** | シェフ紹介、調理風景、店内の雰囲気 |
| **美容・サロン** | 施術紹介、ビフォーアフター動画、スタッフ紹介 |
| **医療・クリニック** | 施設紹介、治療の流れ、院長メッセージ |
| **フォトグラファー** | 撮影メイキング、作品スライドショー、スタジオ紹介 |
| **ハンドメイド作家** | 制作過程、素材へのこだわり、アトリエ紹介 |
| **士業・コンサル** | サービス紹介、代表メッセージ、セミナーダイジェスト |

### レイアウト構成
```
── パターン A: サムネイル + カスタム再生ボタン ──
┌─────────��───────────────────────────────────┐
│  MOVIE / 動画で見る私たちの仕事                │
│  英語ラベル(tracking-[0.3em]) → H2 → subtext  │
│                                              │
│  ┌───────────────────────────────────────┐   │
│  │                                       │   │
│  │          サムネイル画像                  │   │
│  │              ▶                         │   │
│  │         (再生ボタン)                    │   │
│  │                                       │   │
│  └───────────────��───────────────────────┘   │
│                                              │
│  動画タイトル（3:24）                          │
│  説明テキスト…                                │
└──────────────���──────────────────────────────┘
```

## 既存テンプレートとの接続

### 既存実装の状況

3テンプレート全てにVideoSectionは**存在しない**。新規セクションとして追加する。

| テンプレート | 現在の構成 | 推奨挿入位置 |
|---|---|---|
| warm-craft | Hero → Works → Strengths → About → Contact | About の直前（Strengths と About の間） |
| trust-navy | Hero → Services → Projects → About → Contact | About の直前（Projects と About の間） |
| clean-arch | Hero → Works → About → Contact | About の直前（Works と About の間） |

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
        <VideoSection />       {/* ← 新規追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

### セクションヘッダーの適用パターン

各テンプレートのセクションヘッダーに合わせる:

```tsx
// warm-craft style
<p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">MOVIE</p>
<h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">動画紹介</h2>
<p className="text-gray-500 text-sm">私たちの仕事を動画でご覧ください。</p>

// trust-navy style
<p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">MOVIE</p>
<h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl mb-3">動画紹介</h2>
<p className="text-gray-500 text-sm">当社の取り組みを動画で��紹介します。</p>

// clean-arch style
<p className="text-gray-300 text-[10px] tracking-[0.4em] mb-6">MOVIE</p>
<h2 className="text-black text-3xl sm:text-4xl font-extralight tracking-wide">Movie</h2>
```

### navItemsへの影響

VideoSection は通常 navItems に追加しない（補助的セクションのため）。ただし動画が主要コンテンツの場合は追加可能:
- warm-craft / trust-navy: `{ label: "動画紹介", href: "#movie" }` を navItems に追加
- clean-arch: `["MOVIE", "#movie"]` を inline array に追加

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function VideoSection() { ... }
```

### Props / データ構造
```typescript
interface VideoItem {
  /** Unique ID */
  id: number;
  /** Video title */
  title: string;
  /** Description text (optional) */
  description?: string;
  /** Video platform */
  platform: 'youtube' | 'vimeo' | 'self-hosted';
  /** Video URL or embed ID */
  videoUrl: string;
  /** Custom thumbnail image (falls back to platform thumbnail) */
  thumbnail?: string;
  /** Duration display string ("3:24") */
  duration?: string;
}

interface VideoSectionConfig {
  /** Section title */
  sectionTitle: string;
  /** Section subtitle */
  subtitle?: string;
  /** Display mode */
  displayMode: 'single' | 'grid' | 'background';
  /** Video list */
  videos: VideoItem[];
  /** Background video settings (background mode) */
  backgroundVideo?: {
    videoUrl: string;
    overlayColor: string;
    overlayOpacity: number;
    overlayText?: string;
  };
  /** Play button style */
  playButton: {
    size: number;
    color: string;
    bgColor: string;
    hoverColor: string;
  };
}

// YouTube ID extraction helper
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// Demo data — industry-agnostic
const DEMO_VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "企業紹介PV",
    description: "私たちの仕事と想いを3分でご紹介します。",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "3:24",
  },
  {
    id: 2,
    title: "サービス紹介",
    description: "具体的なサービス内容を動画で解説します。",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    duration: "2:15",
  },
];
```

### 状態管理
```typescript
const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
const iframeRef = useRef<HTMLIFrameElement>(null);

// Play start (thumbnail → iframe replacement)
const handlePlay = (video: VideoItem) => {
  setActiveVideoId(video.id);
};

// Stop (iframe → back to thumbnail)
const handleStop = () => {
  setActiveVideoId(null);
};

// YouTube thumbnail auto-fetch
const getYouTubeThumbnail = (url: string): string => {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
};

// Background video autoplay
const videoRef = useRef<HTMLVideoElement>(null);
useEffect(() => {
  if (config.displayMode !== 'background' || !videoRef.current) return;
  videoRef.current.play().catch(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play();
    }
  });
}, []);
```

## リファレンスコード（warm-craft のスタイルに準拠）

```tsx
function VideoSection() {
  const [playing, setPlaying] = useState(false);

  const videoId = "dQw4w9WgXcQ"; // YouTube video ID
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <section id="movie" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">MOVIE</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">動画紹介</h2>
          <p className="text-gray-500 text-sm">私たちの仕事を動画でご覧ください。</p>
        </motion.div>

        <motion.div
          className="relative w-full"
          style={{ paddingTop: "56.25%" }} // 16:9 aspect ratio
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {playing ? (
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full group cursor-pointer"
            >
              {/* Thumbnail background */}
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-200">
                <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              </div>
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#3D3226] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </motion.div>

        <div className="mt-4 text-center">
          <p className="text-[#3D3226] font-medium">企業紹介PV（3:24）</p>
          <p className="text-gray-500 text-sm mt-1">私たちの仕事と想いを3分でご紹介します。</p>
        </div>
      </div>
    </section>
  );
}
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | フル幅 / アスペクト比 16:9 維持（padding-top: 56.25%）/ 再生ボタン: 64px / grid モード: 1列 |
| **タブレット**（640〜1023px） | フル幅 or 80%幅中央揃え / 再生ボタン: 72px / grid モード: 2列 |
| **デスクトップ**（1024px〜） | max-width: 900px 中央揃え / 再生ボタン: 80px + ホバーエフェクト（scale-110） / grid モード: 2〜3列 |

## 3層チェック

> この機能の核: **「文字じゃ伝わらない雰囲気」を感じ取る**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | サムネイル表示 | サムネイル画像が正しく表示され、16:9アスペクト比が維持されている | サムネイルが表示されない。アスペクト比が崩れて黒帯が出る |
| F-2 | カスタム再生ボタン | サムネイル中央に再生ボタンが配置されている | ボタンがない。ボタンが画面外にはみ出している |
| F-3 | 再生開始 | 再生ボタンクリックでiframeが生成され、動画が自動再生される | クリックしても再生されない。iframeのsrcが不正 |
| F-4 | 遅延読み込み | iframe はクリック前にロードされない（DOM検査でiframe未存在を確認） | ページ初期ロードでiframeが読み込まれてLCP悪化 |
| F-5 | URL変換 | YouTube/VimeoのURLが正しくiframeのsrcに変換される | URL解析に失敗してembedリンクが不正 |
| F-6 | フルスクリーン | iframeに`allowFullScreen`が設定されフルスクリーン再生が可能 | フルスクリーンボタンがなく小さい画面でしか見られない |
| F-7 | レスポンシブ | padding-top: 56.25%で16:9比率がモバイル〜デスクトップで維持される | モバイルで画面からはみ出す。デスクトップで極小表示 |
| F-8 | 背景動画モード | 背景動画モード時にミュート・ループ・自動再生が設定されている | 音が出る。ループしない。自動再生しない |
| F-9 | reduced-motion | `prefers-reduced-motion`時に背景動画の自動再生が停止し静止画フォールバック | 設定無視で動画再生が続く |
| F-10 | セクションヘッダー | English label(tracking-[0.3em]) + H2 + subtextの3段構成 | H2だけ。英語ラベルなし |
| F-11 | エラーフォールバック | 動画読み込みエラー時にサムネイル維持+エラーメッセージ表示 | エラー時に空白になる。壊れたiframeが残る |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく動画を視聴できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 再生ボタンの発見しやすさ | サムネイルを見た瞬間に**「これは動画だ」**とわかる | 再生ボタンのサイズ64px以上 + 中央配置 + コントラスト確保（白/半透明背景） | 10点 |
| U-2 | 読み込み速度 | 再生ボタンクリックから動画再生開始まで**3秒以内** | iframe生成→autoplay開始が3秒以内（通信環境による変動を考慮し、ローディング表示がある） | 8点 |
| U-3 | 再生時間の事前表示 | 動画の長さを**再生前に確認**できる | サムネイル上またはタイトル横に「3:24」形式で再生時間表示 | 7点 |
| U-4 | モバイルでの操作性 | スマホで**片手で再生ボタンをタップ**できる | 再生ボタンのタップ領域64px以上。ホバーエフェクト(scale-110)が動作 | 8点 |
| U-5 | 全画面再生への遷移 | フルスクリーンで**没入感のある視聴**ができる | YouTube/Vimeoプレーヤーのフルスクリーンボタンがアクセス可能 | 7点 |

### Layer 3: 価値チェック（雰囲気が伝わるか）— 30点

この機能の核「文字じゃ伝わらない雰囲気を感じ取る」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 動画が「行きたい/頼みたい」を引き出すか | 動画視聴後に**次のアクション（問い合わせ・予約）に進みたくなる** | 施工プロセスの臨場感+完成物件のウォークスルーで「ここに頼みたい」と感じる | 会社紹介PVで「しっかりした会社だ」とは思う | テスト動画やサンプルのままで内容が伝わらない |
| V-2 | 音声なしでも伝わるか | ミュート状態でも**動画の主旨がわかる** | テロップ付き+視覚的に魅力的な映像で音なしでも完結する | 映像自体は良いがテロップなしで詳細は音声頼み | 音声解説のみで映像に情報がない |
| V-3 | サムネイルが動画の魅力を予告するか | サムネイルだけで**「見てみたい」**と思わせる | 完成物件のベストショット+再生ボタンで期待感を醸成 | YouTubeデフォルトサムネイルだが内容はわかる | サムネイルが真っ黒やローディング画面 |
| V-4 | 動画の長さが適切か | ユーザーが**最後まで見る気になる**長さ | 1〜3分の短尺で要点を凝縮。タイトルに「(3:24)」で事前に判断可能 | 5分以内で内容はある | 10分超で途中離脱必至。長さの表記もない |
| V-5 | ページパフォーマンスを犠牲にしていないか | 動画機能が**ページ全体の読み込み速度を損なわない** | 遅延読み込み完備。LCPへの影響ゼロ。背景動画はSPで静止画フォールバック | 遅延読み込みはあるがサムネイル画像が重い | 初期ロードでiframe読み込み。LCPが3秒悪化 |

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
- サムネイル+遅延読み込み+フルスクリーン全て動作。reduced-motion対応済み（L1: 30/30）
- 再生ボタン80px。クリック→再生2秒。再生時間「3:24」表示あり（L2: 36/40）
- 施工タイムラプス3分。テロップ付きで音なしでも完結。サムネイルが美しく「見たい」と思わせる（L3: 24/30）

**80点の実装:**
- 基本機能は動作。エラーフォールバックが未実装（L1: 30/30 ギリギリ）
- 再生ボタン64px。再生時間表示なし（L2: 28/40）
- 会社紹介PV5分。内容はあるがテロップなし（L3: 22/30）

**70点の実装:**
- 遅延読み込みなしでLCPが悪化（L1: 30/30 ギリギリ）
- 再生ボタンが小さく目立たない。読み込みに5秒以上（L2: 22/40）
- テスト動画のまま。サムネイルがデフォルト。「見たい」と思わない（L3: 18/30）

### この機能固有の重要判定ポイント

1. **遅延読み込み必須**: YouTube iframeの初期ロードはLCPを1〜3秒悪化させる。F-4がFAILの場合、パフォーマンス影響が大きすぎるため即作り直し
2. **サムネイル品質**: YouTubeのmaxresdefault.jpgが使えない場合（動画側で未設定）はhqdefault.jpgにフォールバック。サムネイルが表示されないケースは必ずテスト
3. **背景動画のデータ通信**: 背景動画モードのファイルサイズは5MB以下を推奨。モバイルでは静止画フォールバックが必須（V-5で評価）
