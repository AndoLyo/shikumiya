# 360度パノラマビューア
> ID: 28 | カテゴリ: function | プラン: premium

## 概要
ドラッグ操作で3D空間を回転・ズームできるインタラクティブビューア。CSSベースの3D transform（perspective + rotateX/Y）とPointer Eventsを組み合わせ、外部ライブラリなしで実現する。空間の雰囲気を伝えたい業種（建築・不動産・ホテル・店舗・美術館等）に有効。フルスクリーン表示、リセットボタン、スクロールズームに対応する。

## この機能の核
「行かなくても中が見える」感覚を得る

## 必須要件
- ドラッグ回転: onPointerDown/Move/Up で rotateX / rotateY を制御
- ズーム: onWheel で scale 0.5〜2.0 の範囲で拡縮
- CSS 3D: perspective: 800px, transformStyle: preserve-3d
- 回転角度制限: rotateX は -60deg〜+60deg（上下の回転を制限）
- リセットボタン: 初期角度・ズーム値に戻す
- カーソル表示: ドラッグ中 `grabbing`、通常 `grab`
- 操作ヒント表示: 「ドラッグで回転 / スクロールでズーム」
- Framer Motion whileInView によるセクション登場アニメーション
- setPointerCapture による確実なドラッグ追従

## 業種別バリエーション
| 業種 | パノラマ対象 | 補足 |
|---|---|---|
| 建築設計 | 完成物件の室内空間 | LDK、寝室、バスルーム等の切替 |
| 建設・ゼネコン | 竣工物件の内部ツアー | オフィスフロア、エントランス |
| 小売・店舗 | 店内レイアウト | 商品陳列の雰囲気を伝える |
| ホテル・旅館 | 客室・ロビー・温泉 | 部屋タイプ別の切替ビュー |
| 不動産 | 賃貸/販売物件の室内 | 間取りとの連動表示 |
| 美術館・博物館 | 展示空間 | 作品解説ホットスポット付き |

## 既存テンプレートとの接続
### clean-arch-pro（実装済み）
- **関数名**: `PanoramaSection`（801行目〜）
- **回転state**: `rotation: { x: -15, y: 30 }`（初期値）
- **ズームstate**: `zoom: 1`（0.5〜2.0）
- **ドラッグ制御**: `handlePointerDown` / `handlePointerMove` / `handlePointerUp`
  - 感度: `dx * 0.3` / `dy * 0.3`
  - 角度制限: rotateX `-60`〜`+60`
- **ズーム制御**: `handleWheel` — `deltaY * 0.001`
- **3D描画**: SVG viewBox="0 0 600 400" で室内を描画（床・壁・天井・窓・家具）
- **リセット**: `setRotation({ x: -15, y: 30 }); setZoom(1);`
- **操作ヒント**: `Move` アイコン + テキスト（多言語対応 `t("panorama.hint", lang)`）
- **配色**: `bg-gradient-to-br from-[#E8E4DC] to-[#D4CFC5]`

### warm-craft-pro / trust-navy-pro
- パノラマ未実装。clean-arch-proのパターンを移植可能
- warm-craft-pro: SVGを住宅リビング風に変更、`bg-[#FAF7F2]` ベース
- trust-navy-pro: SVGをオフィス/施設風に変更、`bg-[#F0F4F8]` ベース

### 共通実装パターン
```
Page Component
  └── <PanoramaSection />
      └── motion.div (container, perspective: 800px)
          ├── 3D回転div (transform: scale/rotateX/rotateY)
          │   └── SVG or Image (viewable content)
          ├── 操作ヒントオーバーレイ
          └── リセットボタン
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
└── PanoramaSection コンポーネント

※ 分割する場合:
src/components/portfolio-templates/{template-id}/
├── PanoramaSection.tsx
├── PanoramaViewer.tsx
├── PanoramaControls.tsx
└── PanoramaHint.tsx
```

### Props / データ構造
```typescript
interface PanoramaScene {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  initialRotation: { x: number; y: number };
  initialZoom: number;
}

interface PanoramaViewerProps {
  scenes: PanoramaScene[];
  sensitivity: number;           // default 0.3
  zoomRange: { min: number; max: number };  // default { min: 0.5, max: 2.0 }
  rotationLimitX: { min: number; max: number }; // default { min: -60, max: 60 }
  perspective: number;           // default 800
  backgroundColor: string;
  hintText: string;
  resetLabel?: string;
}

interface DragState {
  isDragging: boolean;
  lastPosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
}
```

### 状態管理
```typescript
const containerRef = useRef<HTMLDivElement>(null);
const [rotation, setRotation] = useState({ x: -15, y: 30 });
const [isDragging, setIsDragging] = useState(false);
const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);

const handlePointerDown = useCallback((e: React.PointerEvent) => {
  setIsDragging(true);
  setLastPos({ x: e.clientX, y: e.clientY });
  (e.target as HTMLElement).setPointerCapture(e.pointerId);
}, []);

const handlePointerMove = useCallback((e: React.PointerEvent) => {
  if (!isDragging) return;
  const dx = e.clientX - lastPos.x;
  const dy = e.clientY - lastPos.y;
  setRotation((prev) => ({
    x: Math.max(-60, Math.min(60, prev.x - dy * 0.3)),
    y: prev.y + dx * 0.3,
  }));
  setLastPos({ x: e.clientX, y: e.clientY });
}, [isDragging, lastPos]);

const handleWheel = useCallback((e: React.WheelEvent) => {
  e.preventDefault();
  setZoom((prev) => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
}, []);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | aspect-video表示。ドラッグ + ホイールズーム |
| タブレット（768px〜1023px） | aspect-video表示。ドラッグ + ピンチズーム |
| モバイル（〜767px） | 幅100%・固定高さ。タッチドラッグ。ヒント文はコンパクトに |

## リファレンスコード
```tsx
// clean-arch-pro の PanoramaSection 簡略版
function PanoramaSection() {
  const [rotation, setRotation] = useState({ x: -15, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  return (
    <section className="py-24 sm:py-32">
      <motion.div
        className="aspect-video overflow-hidden relative select-none"
        style={{ cursor: isDragging ? "grabbing" : "grab", perspective: "800px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setIsDragging(false)}
        onWheel={handleWheel}
      >
        <div style={{
          transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}>
          <svg viewBox="0 0 600 400">{/* 3D room SVG */}</svg>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Move /> ドラッグで回転 / スクロールでズーム
        </div>
        <button onClick={() => { setRotation({ x: -15, y: 30 }); setZoom(1); }}>
          <RotateCw />
        </button>
      </motion.div>
    </section>
  );
}
```

## 3層チェック

> この機能の核: **「行かなくても中が見える」感覚を得る**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | ドラッグ回転 | onPointerDown/Move/Upでシーンが水平・垂直方向に回転する | ドラッグしても何も起きない。回転方向が逆 |
| F-2 | 回転角度制限 | rotateXが-60〜+60の範囲に制限されている | 制限なしで上下にぐるぐる回る。disorientation |
| F-3 | ズーム | マウスホイール/ピンチでscale 0.5〜2.0の範囲でズームイン・アウト | ズームが効かない。範囲外に飛ぶ |
| F-4 | フルスクリーン | フルスクリーンボタンで全画面表示に切り替えられる | フルスクリーン未実装 |
| F-5 | タッチ対応 | モバイルでタッチドラッグが正常に動作する | タッチイベント未対応。ページスクロールと干渉 |
| F-6 | ローディング | コンテンツ読み込み中にローディングインジケーターが表示される | 読み込み中に真っ白。何も表示されない |
| F-7 | リセットボタン | 初期角度・ズーム値にワンクリックで戻る | リセットボタンなし |
| F-8 | カーソル表示 | ドラッグ中 `grabbing`、通常 `grab` のカーソル表示 | カーソルが変わらない。操作可能に見えない |
| F-9 | setPointerCapture | ドラッグが要素外に出ても追従する | 要素外に出るとドラッグが途切れる |
| F-10 | 3D設定 | perspective: 800px + transformStyle: preserve-3dが正しく設定 | perspective未設定で平面的。3D感なし |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 操作方法の直感性 | 初見で**ドラッグすれば見回せる**と直感的にわかる | 「ドラッグで回転 / スクロールでズーム」ヒント表示 + grabカーソル | 10点 |
| U-2 | ローディング時間 | パノラマコンテンツが**3秒以内に操作可能**になる | ローディングインジケーター表示→3秒以内にインタラクション可 | 8点 |
| U-3 | フルスクリーンの切替 | フルスクリーンボタンが**目立つ位置にあり、ワンクリックで切替** | 右上にExpandアイコン。ESCで元に戻る | 8点 |
| U-4 | モバイルでのタッチ操作 | スマホで**ページスクロールと干渉せずに**パノラマを操作できる | タッチ操作がパノラマ内に限定。ページスクロールをブロックしない | 7点 |
| U-5 | リセットの容易さ | 操作で迷った時に**ワンタップで初期表示に戻れる** | 右下にリセットボタン（RotateCwアイコン）。操作中も常に見える | 7点 |

### Layer 3: 価値チェック（行った気分になれるか）— 30点

この機能の核「行かなくても中が見える」感覚を得るかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 実際に行った気分 | パノラマを操作して**「実際に行った気分」**になれる | 高品質な室内写真/3Dで、家具の質感や光の入り方まで感じられる | 空間の広さと構成がわかる。雰囲気は伝わる | 低解像度で何が映っているか不明。行った気にならない |
| V-2 | 空間の広さ伝達 | **部屋の広さ/天井高/開放感**が伝わる | 回転で部屋全体を見渡せ、天井高や窓の大きさが感じられる | 部屋の概要はわかるが詳細は不明 | 一方向しか見えない。空間の広がりが伝わらない |
| V-3 | 雰囲気の伝達 | 空間の**雰囲気（モダン/和風/ナチュラル等）**が伝わる | 照明、素材、色調が3Dで再現され、デザインテイストが明確 | 大まかな雰囲気はわかる | 抽象的なSVGで実際の空間と結びつかない |
| V-4 | 操作の滑らかさ | ドラッグ回転が**60fpsで滑らか**に動く | マウス/タッチの動きに即座に追従。カクつきゼロ | 概ね滑らかだが稀にカクつく | カクカクして酔いそう。操作が苦痛 |
| V-5 | 業種適合性 | パノラマの内容が**業種の訴求ポイント**に合致 | 建築:LDKの開放感。ホテル:客室のラグジュアリー感 | 業種に合った空間が表示される | 業種と無関係な空間。コンテンツの差し替えがされていない |
| V-6 | 来訪動機の喚起 | パノラマを見て**「実物を見に行きたい」**と思える | 「この部屋に住みたい」「この店に行きたい」と感じる空間品質 | 「悪くないな」程度の印象 | 「わざわざ行く必要ない」と判断される品質 |

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
- ドラッグ+ズーム+フルスクリーン+リセット+タッチ対応が全て動作（L1: 30/30）
- 操作ヒントが初見で理解できる。3秒以内にロード完了。モバイルでスクロール干渉なし（L2: 35/40）
- 高品質3D空間で「住みたい」と感じる。60fps滑らか。業種の訴求ポイントに合致（L3: 25/30）

**80点の実装:**
- 回転+ズーム+リセットは動作する（L1: 30/30）
- 操作ヒントあり。ロード5秒程度。タッチ操作OK（L2: 28/40）
- 空間の概要はわかるが質感の表現は弱い。概ね滑らか（L3: 22/30）

**70点の実装:**
- 回転は動く。ズーム未実装（L1: 30/30）
- ヒントなし。初見では操作方法がわからない（L2: 22/40）
- 抽象的なSVGで空間のリアリティがない。カクつく（L3: 18/30）

### この機能固有の重要判定ポイント

1. **60fpsの確保**: パノラマ操作がカクつくと「酔いそう」になりUXが壊滅する。**ChromeのFPSメーターで計測し、30fps以下の瞬間があればV-4自動FAIL**
2. **タッチとスクロールの競合**: モバイルでパノラマ操作がページスクロールと干渉すると操作不能。**スクロール干渉が1回でも発生すればU-4が0点**
3. **コンテンツの品質**: パノラマビューアの技術がいくら優秀でも、中のコンテンツが低品質なら「行った気にならない」。**プレースホルダーSVGのまま本番公開はV-1自動FAIL**
