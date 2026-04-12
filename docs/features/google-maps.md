# Google Maps埋め込み
> ID: google-maps | カテゴリ: parts | プラン: middle

## 概要
事業所・店舗・施設の所在地を Google Maps で表示するセクション。実店舗や事業所を持つあらゆる業種で、「実在する場所」を地図で見せることが信頼性に直結する。iframe 埋め込みによる実装を基本とし、所在地テキスト・アクセス情報を地図の下に配置する。パフォーマンスのため Intersection Observer による遅延読み込み（lazy load）を必須とする。既存3テンプレートには Maps セクション未実装のため、新規セクションとして追加する。

## この機能の核
「うちから何分くらいか」がすぐ判断できる

## 必須要件
- Google Maps iframe を `<iframe>` タグで埋め込み（`loading="lazy"` 属性必須）
- Intersection Observer で viewport に入ったタイミングで iframe を読み込み（遅延読み込み）
- 地図の下に所在地テキスト、最寄り駅/アクセス情報を表示
- レスポンシブ: 地図の横幅 100%、高さはデスクトップ 400px / モバイル 300px
- `<iframe>` に `title` 属性（アクセシビリティ）
- `allowfullscreen` 属性で全画面表示を許可
- 地図と住所テキストの間に適切な余白
- API キー不要（iframe 埋め込み方式の場合）

## 業種別バリエーション

### 建築・建設
表示場所: 本社所在地、支店・営業所
住所下テキスト: 最寄り駅、駐車場有無、来社予約の注記
補足: 施工エリアマップ（対応エリアの可視化）を追加オプションとして提供可能

### 小売・EC
表示場所: 実店舗の所在地（複数店舗対応）
住所下テキスト: 営業時間、定休日、駐車場台数
補足: 複数店舗の場合はタブ切替またはリスト選択で地図を差し替え

### 飲食
表示場所: 店舗所在地
住所下テキスト: 最寄り駅（徒歩○分）、営業時間、定休日、駐車場、座席数
補足: 「Googleマップで見る」外部リンクボタン（経路案内直結）

### 美容・サロン
表示場所: サロン所在地
住所下テキスト: 最寄り駅（徒歩○分）、営業時間、定休日、駐車場
補足: ビル名・階数の詳細案内（「○○ビル3F」等）

### 医療・クリニック
表示場所: クリニック所在地
住所下テキスト: 最寄り駅（徒歩○分）、バス停、駐車場、診療時間
補足: 近隣薬局の情報を追加するケースあり

### 士業・コンサルティング
表示場所: 事務所所在地
住所下テキスト: 最寄り駅、ビル名・階数、来社/オンライン対応可
補足: 「お打ち合わせはオンラインでも対応可能です」の注記

## 既存テンプレートとの接続

### warm-craft（暖色ナチュラル系）
- **現状**: Maps セクション未実装
- **配置場所**: ContactSection の下部、または About セクション内
- **参考**: ContactSection の下部に所在地カード `MapPin` アイコン付き（行766〜788）が存在 → Maps はこのカードの隣 or 下に配置
- **スタイル指針**: `bg-[#FAF7F2]`（セクション背景）/ `border border-[#E8DFD3]`（地図コンテナ）/ `rounded-2xl`（角丸）
- **テキスト色**: `text-[#3D3226]`（住所）/ `text-[#8B7D6B]`（補足情報）/ `text-[#7BA23F]`（リンク）

### trust-navy（ネイビー重厚系）
- **現状**: Maps セクション未実装
- **参考**: ContactSection 下部にアクセス情報カード（行684〜697）が存在 — `MapPin` アイコ�� + 住所 + 「来社・オンライン対応可能」の注記
- **配置場所**: アクセスカードの代替、または下に追加
- **スタイル指針**: `bg-white border border-gray-200`（コンテナ）/ 角丸なし（trust-navy は直角ベース）
- **テキスト色**: `text-[#1B3A5C]`（住所）/ `text-gray-500`（補足）/ `text-[#C8A96E]`（アイコン）

### clean-arch（ミニマルモノクロ系）
- **現状**: Maps セクション未実装
- **配置場所**: ContactSection 内（メール/電話リンクの下）、または Footer の上
- **スタイル指針**: `border border-gray-200`（コンテナ）/ ミニマルに余白多め
- **テキスト色**: `text-gray-800`（住所）/ `text-gray-400`（補足）/ `text-[10px] tracking-wider`

### 全テンプレート共通
- 現在のシングルページ構成では、ContactSection 付近に組み込む
- `<motion.div>` で fade-in アニメーション（`initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}`）

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── MapSection() コンポーネント（モノリシック内で定義）

※ 分割する場合:
src/components/portfolio-templates/{template-id}/MapSection.tsx
```

### Props / データ構造
```typescript
interface AccessInfo {
  label: string;           // "最寄り駅"
  value: string;           // "○○駅 徒歩5分"
}

interface MapSectionConfig {
  embedUrl: string;        // Google Maps iframe の src URL
  address: string;         // "東京都世田谷区○○町1-2-3"
  postalCode?: string;     // "〒154-0000"
  buildingName?: string;   // "○○ビル3F"
  accessInfo: AccessInfo[];
  externalMapUrl?: string; // "https://maps.google.com/..." 外部リンクボタン用
  mapHeight: {
    desktop: number;       // 400
    mobile: number;        // 300
  };
}
```

### 遅延読み込み
```typescript
const [isVisible, setIsVisible] = useState(false);
const mapRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    },
    { rootMargin: "200px" }
  );
  if (mapRef.current) observer.observe(mapRef.current);
  return () => observer.disconnect();
}, []);
```

## リファレンスコード

### MapSection コンポーネント実装例（warm-craft トーン）
```tsx
function MapSection() {
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={mapRef}
      className="mt-10 rounded-2xl overflow-hidden border border-[#E8DFD3]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {isVisible ? (
        <iframe
          src="https://www.google.com/maps/embed?pb=..."
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="所在地の地図"
          className="h-[300px] sm:h-[400px]"
        />
      ) : (
        <div className="h-[300px] sm:h-[400px] bg-[#E8DFD3] flex items-center justify-center">
          <p className="text-[#8B7D6B] text-sm">地図を読み込んでいます...</p>
        </div>
      )}
      <div className="p-5 bg-[#FAF7F2]">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#7BA23F] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[#3D3226] text-sm font-medium">{COMPANY.address}</p>
            <p className="text-[#8B7D6B] text-xs mt-1">○○駅 徒歩5分 / 駐車場あり</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

### Google Maps iframe URL の取得方法
```
1. Google Maps で住所を検索
2. 「共有」→「地図を埋め込む」をクリック
3. iframe の src URL をコピー
4. embedUrl に設定
```

## 3層チェック

> この機能の核: **「うちから何分くらいか」がすぐ判断できる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | iframe表示 | Google Maps iframeが正しく表示され、地図が操作可能 | iframeが真っ白。src URLが不正で地図が出ない |
| F-2 | lazy loading | `loading="lazy"` 属性が設定されている | 属性なしでページ読み込み時に即ロード |
| F-3 | Intersection Observer | viewport外では iframe 未読み込み。スクロールで初めてロード | Observer未実装。ページ読み込みと同時に地図ロード |
| F-4 | title属性 | `<iframe>` に `title="所在地の地図"` 等のアクセシビリティ属性がある | title属性なし。スクリーンリーダーで内容不明 |
| F-5 | 住所テキスト表示 | 地図の下に所在地テキスト（郵便番号+住所+ビル名）が表示される | 地図だけで住所テキストがない |
| F-6 | レスポンシブ | モバイル `h-[300px]`、デスクトップ `h-[400px]` で地図が表示される | 固定サイズでモバイルではみ出す。高さ0で地図が見えない |
| F-7 | プレースホルダー | 読み込み中に「地図を読み込んでいます...」のプレースホルダー表示 | 読み込み中は空白。何も表示されない |
| F-8 | allowFullScreen | `allowFullScreen` 属性で全画面表示が可能 | 属性なしで全画面ボタンが効かない |
| F-9 | referrerPolicy | `referrerPolicy="no-referrer-when-downgrade"` が設定されている | 属性なしでセキュリティポリシー違反 |
| F-10 | カラースキーム | コンテナのborder色・背景色・テキスト色がテンプレートのパレットに合致 | 色がハードコードで他テンプレートと合わない |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 地図の初期ズームレベル | 建物と周辺道路が**同時に見えるズームレベル**で表示される | 建物が特定でき、最寄り駅や主要道路も視認できる（ズーム15〜17程度） | 10点 |
| U-2 | 住所テキストのコピー可能性 | 住所テキストを**長押し/ドラッグで選択コピー**できる | テキストが画像ではなくHTMLテキストで、user-select: noneでない | 8点 |
| U-3 | 経路案内リンク | 「Googleマップで見る」リンクが地図周辺にあり、**タップでGoogle Mapsアプリが開く** | `target="_blank"` でGoogle Maps URLが開き、経路検索が即座にできる | 10点 |
| U-4 | モバイルでの地図操作 | スマホで**ピンチズームが地図内で完結**し、ページスクロールと干渉しない | 地図内のタッチ操作がページスクロールをブロックしない設計 | 5点 |
| U-5 | アクセス情報の視認性 | 最寄り駅・徒歩分数・駐車場情報が**地図直下に一目で見える** | アイコン+テキストで構造化され、フォントサイズ14px以上 | 7点 |

### Layer 3: 価値チェック（行けそうと判断できるか）— 30点

この機能の核「うちから何分くらいか」がすぐ判断できるかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 距離感の判断 | 地図を見て「行けそうな距離だ」と**判断できる** | ズームレベルが適切で自宅周辺との位置関係がわかる。主要ランドマークが見える | 地図は表示されるが周辺情報が少なくピンの場所しかわからない | 地図が広域すぎて建物の位置が特定できない |
| V-2 | アクセス方法の明確さ | **車/電車/バスのどれで行けるか**がわかる | 「○○駅 徒歩5分 / 駐車場10台完備 / ○○バス停 徒歩2分」 | 「○○駅 徒歩5分」のみ | アクセス情報なし。地図だけで交通手段不明 |
| V-3 | 経路案内への接続 | 地図から**ワンタップで経路案内**に進める | 「Googleマップで開く」リンクがあり、タップでナビ起動 | 住所コピーしてMapsアプリで検索すれば行ける | 経路案内リンクなし。住所も選択コピーできない |
| V-4 | 駐車場情報 | 車で行く場合の**駐車場の有無と台数**がわかる | 「専用駐車場15台（無料）」と台数+料金まで明記 | 「駐車場あり」とだけ記載 | 駐車場情報なし。車で行けるかわからない |
| V-5 | 来訪の心理的ハードル | 地図+アクセス情報を見て**「行ってみよう」と思える** | 写真付きの建物外観+わかりやすい目印の説明がある | 地図と住所があり場所は特定できる | 地図だけで周辺情報ゼロ。行くのが不安 |
| V-6 | 周辺環境の把握 | 事業所の**周辺環境（住宅街/商業地/駅前等）**が地図から読み取れる | ズームレベルが適切で「駅前の商業エリア」等がわかる | 地図は見えるが周辺の性格は不明 | 広域表示でピンの場所すら不明確 |

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
- iframe遅延読み込み+プレースホルダー+title属性が全て揃っている（L1: 30/30）
- ズームレベル16で建物+最寄り駅が同時に見える。住所コピー可。経路案内リンクあり（L2: 35/40）
- 「○○駅 徒歩5分 / 駐車場10台（無料）/ Googleマップで開く」が揃い、行く気になれる（L3: 25/30）

**80点の実装:**
- iframeは表示される。lazy loading実装済み（L1: 30/30）
- 住所テキストあり。ズームレベルはデフォルトで少し広域（L2: 28/40）
- 「○○駅 徒歩5分」のみ。駐車場情報なし。経路案内リンクなし（L3: 22/30）

**70点の実装:**
- iframeは動く（L1: 30/30）
- ズームが広域すぎて建物が見えない。住所テキストが画像で選択不可（L2: 22/40）
- アクセス情報なし。地図だけでは行き方がわからない（L3: 18/30）

### この機能固有の重要判定ポイント

1. **ズームレベルの適切さ**: デフォルトのズームレベルで建物が特定できなければ、地図を埋め込む意味がない。**ズーム13以下（市区町村レベル）は自動FAIL**
2. **経路案内リンクの有無**: 地図を見て「行こう」と思った瞬間に経路案内に進めないと機会損失。**経路案内リンクなしはV-3自動FAIL**
3. **駐車場情報**: 車社会の地方では駐車場情報がないと来訪を断念する。**建築・建設業で駐車場情報なしはV-4自動FAIL**
