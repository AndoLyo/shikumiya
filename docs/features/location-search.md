# 店舗・拠点検索
> ID: location-search | カテゴリ: section | プラン: premium

## 概要
企業の店舗・支店・拠点を地域別に検索し、来店予約や問い合わせへ繋げるセクション。業種を問わず、複数拠点を持つ企業にとって「近くの店舗を探す」は顧客の最初のアクションであり、SEO・集客の両面で重要。地図表示またはリスト表示で拠点情報を見せ、予約ボタンで来店予約ページへ直接誘導する。Google Maps 埋め込みに対応しつつ、APIキーがない場合はリスト表示にフォールバックする設計。

## この機能の核
「一番近い店舗/展示場」がすぐ見つかる。

## 必須要件
- 都道府県または地域（関東・東海・関西等）で拠点を検索できること
- 各拠点に所在地・電話番号・営業時間・定休日を表示すること
- 予約ボタン（または電話ボタン）を各拠点に配置すること
- 地図表示モード（Google Maps 埋め込み or 静的地図画像）に対応すること
- リスト表示モードに対応すること（地図非表示でも機能する）
- 検索結果が0件の場合のフォールバック表示
- 拠点数が10以上の場合、ページネーション or 「もっと見る」ボタン
- モバイルで電話番号がタップ発信（tel:リンク）に対応していること

## 業種別バリエーション

| 業種 | セクション名 | 拠点タイプ | 特徴タグ例 |
|---|---|---|---|
| **建築** | 展示場・モデルハウス検索 | 展示場, モデルハウス, ショールーム | キッズスペースあり, 駐車場完備, バリアフリー |
| **小売** | 店舗検索 | 直営店, フランチャイズ, アウトレット | 駐車場あり, 試着室あり, 修理対応 |
| **飲食** | 店舗一覧 | レストラン, カフェ, テイクアウト専門 | 個室あり, 禁煙, テラス席, ペット可 |
| **美容** | サロン検索 | 美容室, ネイルサロン, エステ | 個室あり, メンズ対応, 託児あり |
| **医療** | クリニック検索 | 本院, 分院, 提携施設 | 夜間診療, 土日診療, 英語対応 |
| **教育** | 教室検索 | 本校, 分校, オンライン | 自習室あり, 無料体験あり, 送迎あり |
| **ホテル** | 施設一覧 | ホテル, 旅館, リゾート | 温泉あり, プールあり, レストラン併設 |

## 既存テンプレートとの接続

### 既存実装の状況
| テンプレート | 関数名 | セクション ID | データ定数 | ステータス |
|---|---|---|---|---|
| warm-craft | — | — | — | 未実装（新規追加） |
| trust-navy | — | — | — | 未実装（新規追加） |
| clean-arch | — | — | — | 未実装（新規追加） |

### 挿入位置

**warm-craft** — AboutSection の直前に追加:
```tsx
export default function WarmCraftPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <StrengthsSection />
        <LocationSearchSection />  {/* ← ここに追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**trust-navy** — AboutSection の直前に追加:
```tsx
export default function TrustNavyPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <LocationSearchSection />  {/* ← ここに追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

**clean-arch** — AboutSection の直前に追加:
```tsx
export default function CleanArchPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <LocationSearchSection />  {/* ← ここに追加 */}
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

### navItems への追加

| テンプレート | 追加するエントリ |
|---|---|
| warm-craft | `{ label: "展示場・店舗", href: "#location" }` — 「会社案内」の前 |
| trust-navy | `{ label: "拠点一覧", href: "#location" }` — 「会社概要」の前 |
| clean-arch | `["LOCATION", "#location"]` — 「ABOUT」の前 |

### カラーの合わせ方
| テンプレート | アクセント | テキスト | 背景 | 予約ボタン | カードBG |
|---|---|---|---|---|---|
| warm-craft | `#7BA23F` | `#3D3226` | `#FAF7F2` | `bg-[#7BA23F] text-white` | `white` + border `#E8DFD3` |
| trust-navy | `#C8A96E` | `#1B3A5C` | `white` | `bg-[#1B3A5C] text-white` | `#F0F4F8` + border `gray-200` |
| clean-arch | `gray-400` | `gray-800` | `white` | `bg-gray-800 text-white` | `#EDEBE5` |

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
  └── function LocationSearchSection() { ... }
```

### データ定数（英語プロパティ名）
```typescript
type LocationType = "showroom" | "branch" | "headquarters" | "model" | "outlet" | "franchise";

interface Location {
  /** Location ID */
  id: number;
  /** Location name */
  name: string;
  /** Location type */
  type: LocationType;
  /** Postal code */
  postalCode: string;
  /** Prefecture */
  prefecture: string;
  /** Region (Kanto, Tokai, Kansai, etc.) */
  region: string;
  /** Address (after prefecture) */
  address: string;
  /** Phone number */
  phone: string;
  /** Fax (optional) */
  fax?: string;
  /** Business hours */
  hours: string;
  /** Closed days */
  closedDays: string;
  /** Coordinates for map (optional) */
  coordinates?: { lat: number; lng: number };
  /** Reservation page URL */
  reservationUrl: string;
  /** Exterior image (optional) */
  image?: string;
  /** Access info ("XX駅 徒歩5分" etc.) */
  access?: string;
  /** Feature tags ("キッズスペースあり" etc.) */
  features?: string[];
}

interface LocationSearchConfig {
  /** Section title (Japanese) */
  sectionTitle: string;
  /** Subtitle */
  subtitle: string;
  /** Display mode */
  displayMode: "map-list" | "map-only" | "list-only" | "card-grid";
  /** Region filter options */
  regionFilters: string[];
  /** Google Maps API Key (for map mode, optional) */
  mapsApiKey?: string;
  /** Items per page */
  itemsPerPage: number;
}

// Location type display mapping
const LOCATION_TYPE_MAP: Record<LocationType, string> = {
  showroom: "ショールーム",
  branch: "営業所",
  headquarters: "本社",
  model: "モデルハウス",
  outlet: "アウトレット",
  franchise: "フランチャイズ",
};

// Demo data (industry-agnostic)
const LOCATIONS: Location[] = [
  {
    id: 1,
    name: "世田谷展示場",
    type: "showroom",
    postalCode: "154-0000",
    prefecture: "東京都",
    region: "関東",
    address: "世田谷区〇〇1-2-3",
    phone: "03-0000-1111",
    hours: "10:00〜18:00",
    closedDays: "毎週水曜日",
    coordinates: { lat: 35.6461, lng: 139.6532 },
    reservationUrl: "/reservation?location=setagaya",
    access: "東急田園都市線 三軒茶屋駅 徒歩8分",
    features: ["キッズスペースあり", "駐車場完備", "バリアフリー"],
  },
  {
    id: 2,
    name: "横浜展示場",
    type: "model",
    postalCode: "220-0000",
    prefecture: "神奈川県",
    region: "関東",
    address: "横浜市西区〇〇4-5-6",
    phone: "045-000-2222",
    hours: "10:00〜18:00",
    closedDays: "毎週火・水曜日",
    coordinates: { lat: 35.4660, lng: 139.6225 },
    reservationUrl: "/reservation?location=yokohama",
    access: "JR横浜駅 西口 徒歩10分",
    features: ["駐車場完備", "実物大モデルハウス"],
  },
];
```

### 状態管理
```typescript
const [selectedRegion, setSelectedRegion] = useState<string>("all");
const [selectedPrefecture, setSelectedPrefecture] = useState<string>("all");
const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
const [viewMode, setViewMode] = useState<"map" | "list">("map");
const [page, setPage] = useState(1);

// Filtering
const filteredLocations = useMemo(() => {
  let result = locations;
  if (selectedRegion !== "all") {
    result = result.filter((l) => l.region === selectedRegion);
  }
  if (selectedPrefecture !== "all") {
    result = result.filter((l) => l.prefecture === selectedPrefecture);
  }
  return result;
}, [selectedRegion, selectedPrefecture, locations]);

// Pagination
const paginatedLocations = useMemo(() => {
  const start = (page - 1) * config.itemsPerPage;
  return filteredLocations.slice(start, start + config.itemsPerPage);
}, [filteredLocations, page]);

// Dynamic prefecture list based on selected region
const availablePrefectures = useMemo(() => {
  if (selectedRegion === "all") {
    return [...new Set(locations.map((l) => l.prefecture))];
  }
  return [
    ...new Set(
      locations.filter((l) => l.region === selectedRegion).map((l) => l.prefecture)
    ),
  ];
}, [selectedRegion, locations]);

// Fallback to list mode if no Maps API key
useEffect(() => {
  if (!config.mapsApiKey) {
    setViewMode("list");
  }
}, [config.mapsApiKey]);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| **モバイル**（〜639px） | リスト表示のみ（地図非表示） / フィルター: フル幅ドロップダウン / 予約ボタン: 幅100% / 電話番号はタップで発信 |
| **タブレット**（640〜1023px） | 上に地図50vh + 下にリスト / フィルター横並び |
| **デスクトップ**（1024px〜） | 左地図50% + 右リスト50% / リスト項目ホバーで地図のピンがハイライト |

## リファレンスコード

warm-craft の AboutSection テーブル構造をベースにしたリストカード:
```tsx
<section id="location" className="py-20 sm:py-28 bg-[#FAF7F2]">
  <div className="max-w-[1200px] mx-auto px-5">
    {/* Section header */}
    <motion.div
      className="text-center mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">LOCATION</p>
      <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">店舗・拠点</h2>
      <p className="text-[#8B7D6B] text-sm">お近くの店舗でお待ちしております</p>
    </motion.div>

    {/* Region filter */}
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {["all", ...config.regionFilters].map((region) => (
        <button
          key={region}
          onClick={() => {
            setSelectedRegion(region);
            setSelectedPrefecture("all");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            selectedRegion === region
              ? "bg-[#7BA23F] text-white"
              : "bg-white text-[#8B7D6B] border border-[#E8DFD3] hover:border-[#7BA23F]"
          }`}
        >
          {region === "all" ? "すべて" : region}
        </button>
      ))}
    </div>

    {/* Location list */}
    <div className="grid lg:grid-cols-2 gap-5">
      {paginatedLocations.map((loc, i) => (
        <motion.div
          key={loc.id}
          className="bg-white rounded-2xl border border-[#E8DFD3] p-6
                     hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-[#3D3226] text-base">{loc.name}</h3>
              <span className="text-[#7BA23F] text-xs">
                {LOCATION_TYPE_MAP[loc.type]}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[#8B7D6B] text-sm mb-4">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              〒{loc.postalCode} {loc.prefecture}{loc.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <a href={`tel:${loc.phone}`} className="hover:text-[#7BA23F]">
                {loc.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              {loc.hours}（{loc.closedDays}）
            </p>
            {loc.access && (
              <p className="text-xs text-[#8B7D6B]/70">{loc.access}</p>
            )}
          </div>

          {/* Feature tags */}
          {loc.features && loc.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {loc.features.map((f) => (
                <span key={f} className="px-2 py-0.5 rounded-full bg-[#7BA23F]/10
                                          text-[#7BA23F] text-xs">
                  {f}
                </span>
              ))}
            </div>
          )}

          <a
            href={loc.reservationUrl}
            className="block w-full text-center py-2.5 rounded-lg bg-[#7BA23F]
                       text-white text-sm font-medium hover:bg-[#5C7A2E] transition-colors"
          >
            来場予約する
          </a>
        </motion.div>
      ))}
    </div>

    {/* Empty state */}
    {filteredLocations.length === 0 && (
      <div className="text-center py-12">
        <p className="text-[#8B7D6B] text-sm">
          該当する拠点が見つかりませんでした。条件を変更してお探しください。
        </p>
      </div>
    )}

    {/* Pagination */}
    {filteredLocations.length > config.itemsPerPage && (
      <div className="flex justify-center gap-2 mt-8">
        {Array.from(
          { length: Math.ceil(filteredLocations.length / config.itemsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-full text-sm ${
                page === i + 1
                  ? "bg-[#7BA23F] text-white"
                  : "bg-white text-[#8B7D6B] border border-[#E8DFD3]"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    )}
  </div>
</section>
```

## 3層チェック

> この機能の核: **「一番近い店舗/展示場」がすぐ見つかる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 地域・都道府県フィルターで絞り込み | selectedRegion/Prefecture で正しくフィルタリング | フィルターが効かず全件表示のまま |
| F-2 | 各拠点に名前・住所・電話・営業時間・定休日 | 5項目全てが表示されている | 情報が欠落している |
| F-3 | 予約ボタンが各拠点に配置 | reservationUrl に正しく遷移 | ボタンなし/リンク先404 |
| F-4 | モバイルで電話番号タップ発信 | tel:リンクで発信画面に遷移 | テキストのみでタップ発信不可 |
| F-5 | 地図モード時のピン表示 | coordinates に基づきピン配置 | ピンが表示されない/位置がずれる |
| F-6 | リスト選択で地図ハイライト | クリックで対応ピンが強調 | 連動しない |
| F-7 | 検索結果0件のフォールバック | 適切なメッセージ表示 | 空白で壊れたように見える |
| F-8 | ページネーション動作 | 10件以上で正しくページ分割 | 全件表示でスクロール地獄 |
| F-9 | 特徴タグのバッジ表示 | features配列がバッジで表示 | タグ表示なし |
| F-10 | APIキーなし時のリストフォールバック | 地図なしでもリスト表示で機能 | APIキーなしで真っ白/エラー |
| F-11 | セクションヘッダー3段構成 | 英字ラベル+H2+サブテキスト | パターン不一致 |
| F-12 | Framer Motion whileInView + stagger | カードが順次フェードイン | アニメーションなし |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 検索から結果表示までの速度 | フィルター選択で即座に結果が更新 | 3秒以内に結果表示 | 10点 |
| U-2 | 距離/時間の表示 | 最寄駅からの所要時間が明記 | 「XX駅 徒歩X分」形式 | 8点 |
| U-3 | タップで詳細アクション | 予約/電話/地図のアクションが直感的 | 1タップで目的達成 | 8点 |
| U-4 | フィルター操作のしやすさ | 地域→都道府県の階層的絞り込み | 2ステップで目的の拠点到達 | 6点 |
| U-5 | 営業情報の視認性 | 営業時間・定休日が一目でわかる | カード内にアイコン付き表示 | 4点 |
| U-6 | モバイルでのレイアウト | リスト表示で情報が見やすい | カード幅100%+予約ボタンフル幅 | 4点 |

### Layer 3: 価値チェック（すぐ見つかるか）— 30点

この機能の核「『一番近い店舗/展示場』がすぐ見つかる」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 最寄りが即座にわかる | 地域フィルターで素早く特定 | フィルター+地図ピンで最寄りが一目瞭然 | リスト内で住所から推測 | フィルターなしで全件スクロール |
| V-2 | アクセス方法が明確 | 最寄駅+所要時間が記載 | 「三軒茶屋駅 徒歩8分」+地図 | 住所のみ（地図で確認可能） | 住所なし |
| V-3 | 来店予約に直結 | 予約ボタンが目立ち機能する | アクセントカラーの予約ボタン+即フォーム | ボタンはあるが目立たない | 予約導線なし |
| V-4 | 設備/特徴がわかる | 来店前に知りたい情報がある | 「キッズスペース」「駐車場」「バリアフリー」 | 住所と電話のみ | 設備情報なし |
| V-5 | 電話問い合わせが容易 | モバイルでワンタップ発信 | tel:リンク+電話アイコン+大きなタップ領域 | tel:リンクあるが小さい | テキストのみ |
| V-6 | 業種に合った拠点タイプ | 業種固有の拠点名・タグ | 建築→「展示場」+「キッズスペース」 | 汎用→「店舗」 | 業種と不一致 |

## スコアリング

### 合計100点の内訳
| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 12項目全PASSで30点。1つでもFAILなら0点 |
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
**90点の実装:** 地域フィルター+地図ピンで最寄り拠点を即特定。各拠点にアクセス情報+営業時間+特徴タグ+目立つ予約ボタン。モバイルでtel:発信対応。0件時のフォールバック完備。
**80点の実装:** フィルター・リスト・予約ボタン全て動作するが、地図なし（リスト表示のみ）。アクセス情報は住所のみで最寄駅の記載なし。
**70点の実装:** リスト表示は動くが、フィルターが効かない。電話番号がテキストのみ。予約ボタンのリンク先が404。0件時に空白。

### この機能固有の重要判定ポイント
- **予約導線**: 拠点検索の最終ゴールは来店予約/電話問い合わせ。予約ボタンの視認性が最重要
- **モバイル電話発信**: モバイルユーザーの30%以上がtel:タップ。必須実装
- **地図APIコスト**: Google Maps は月$200無料枠。APIキーなしでも動作する設計が必要
- **アクセス情報**: 最寄駅からの所要時間は来店意欲に直結。省略不可
