# アクセス解析ダッシュボード
> ID: 34 | カテゴリ: function | プラン: premium

## 概要
管理者向けサブページとして、サイトのアクセス解析データを可視化するダッシュボード。ページビュー（PV）、ユニークユーザー（UU）、お問い合わせ件数、平均滞在時間をKPIカードで表示し、月間PV推移の棒グラフ、人気ページランキング、検索キーワード、デバイス別割合をチャートで提供する。業種を問わず、サイト運用者がアクセス状況を把握し、改善施策の意思決定を行うための管理基盤。

## この機能の核
（管理者向け）どのページが見られてるかわかる

## 必須要件
- 管理者専用ページ（`/portfolio-templates/{id}/admin`）
- KPIカード: PV、問い合わせ数、検索流入数、平均滞在時間（前月比の増減表示）
- 月間PV推移グラフ（棒グラフ、過去6ヶ月）
- 人気ページランキング（ページ名 + PV数 + 割合プログレスバー）
- 検索キーワード一覧（キーワード + 検索回数）
- デバイス別割合（スマートフォン / PC / タブレット + プログレスバー）
- お問い合わせ一覧テーブル（日付、氏名、種別、ステータス）
- サイドバーナビゲーション（ダッシュボード / お問い合わせ / 予約 / 通知設定）
- Framer Motionによるカード・グラフの登場アニメーション

## 業種別バリエーション
| 業種 | 特に重要なKPI | 追加のダッシュボード項目 |
|---|---|---|
| 建築・建設 | 問い合わせ数、見学会予約数 | 予約一覧、施工実績の閲覧数 |
| 飲食 | 予約数、メニューページPV | テーブル予約一覧、ピーク時間帯 |
| 美容・サロン | 予約数、新規/リピート比率 | 施術予約カレンダー、担当別予約数 |
| 医療 | 予約数、問い合わせ数 | 診察予約一覧、科目別アクセス |
| 小売・EC | 商品ページPV、問い合わせ数 | 人気商品ランキング、CV率 |
| 教育 | 体験申込数、コースページPV | 申込一覧、コース別CV率 |

## 既存テンプレートとの接続
### warm-craft-pro/admin（実装済み）
- **ファイルパス**: `src/app/portfolio-templates/warm-craft-pro/admin/page.tsx`
- **ページURL**: `/portfolio-templates/warm-craft-pro/admin`
- **KPIカード**: `overviewStats` 配列 — PV(2,847), お問い合わせ(12件), 検索流入(1,203), 平均滞在(2:34)
- **月間PVグラフ**: `monthlyPV` 配列（6ヶ月分）— `motion.div` height アニメーション
- **人気ページ**: `pageViews` 配列（ページ名 + views + pct）
- **検索キーワード**: `searchKeywords` 配列
- **デバイス別**: `deviceBreakdown`（スマートフォン68%, PC28%, タブレット4%）
- **お問い合わせ一覧**: `inquiries` 配列（date, name, type, status）
- **予約一覧**: `bookingStats` + `BookingsContent` コンポーネント
- **通知設定**: LINE/メール/Slackの ON/OFF トグル
- **サイドバー**: `Sidebar` コンポーネント（dashboard / inquiries / bookings / notifications）
- **配色**: サイドバー `bg-[#3D3226]`, アクセント `bg-[#7BA23F]`, カード `bg-white border-[#E8DFD3]`

### trust-navy-pro / clean-arch-pro
- 管理者画面未実装。warm-craft-pro/adminのパターンを移植可能
- trust-navy-pro: サイドバー `bg-[#0D2440]`, アクセント `bg-[#C8A96E]`
- clean-arch-pro: サイドバー `bg-gray-900`, アクセント minimalist

### 共通実装パターン
```
admin/page.tsx
  ├── Sidebar（ナビゲーション: state で active タブ切替）
  └── メインコンテンツ
      ├── DashboardContent（KPIカード + グラフ + ランキング）
      ├── InquiriesContent（お問い合わせテーブル）
      ├── BookingsContent（予約一覧）
      └── NotificationsContent（通知設定トグル）
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/admin/page.tsx  ← 管理者ページ

※ 分割する場合:
src/components/portfolio-templates/{template-id}/admin/
├── Sidebar.tsx
├── DashboardContent.tsx
├── KPICard.tsx
├── PVChart.tsx
├── PageRanking.tsx
├── DeviceBreakdown.tsx
├── InquiriesTable.tsx
├── BookingsTable.tsx
└── NotificationSettings.tsx
```

### Props / データ構造
```typescript
interface KPIStat {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;        // "+18%" or "+3件"
  trending: "up" | "down";
  color: string;         // "text-green-500"
  backgroundColor: string;
}

interface PageViewEntry {
  page: string;
  views: number;
  percentage: number;
}

interface SearchKeyword {
  keyword: string;
  count: number;
}

interface DeviceEntry {
  device: string;
  percentage: number;
  icon: React.ElementType;
}

interface MonthlyPV {
  month: string;
  value: number;
}

interface InquiryEntry {
  date: string;
  name: string;
  type: string;
  status: "pending" | "inProgress" | "completed";
}

interface AdminDashboardProps {
  kpiStats: KPIStat[];
  monthlyPV: MonthlyPV[];
  pageViews: PageViewEntry[];
  searchKeywords: SearchKeyword[];
  deviceBreakdown: DeviceEntry[];
  inquiries: InquiryEntry[];
}
```

### 状態管理
```typescript
const [activeTab, setActiveTab] = useState("dashboard");
// Tab content switches via conditional rendering:
// activeTab === "dashboard" → <DashboardContent />
// activeTab === "inquiries" → <InquiriesContent />
// activeTab === "bookings"  → <BookingsContent />
// activeTab === "notifications" → <NotificationsContent />
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | サイドバー固定表示（w-64）+ メインコンテンツ横並び |
| タブレット（768px〜1023px） | サイドバー非表示 → トップバーにタブ表示 |
| モバイル（〜767px） | サイドバー非表示 → ハンバーガーメニュー。KPIカード2列 |

## リファレンスコード
```tsx
// warm-craft-pro/admin の DashboardContent 簡略版
function DashboardContent() {
  const maxPV = Math.max(...monthlyPV.map((m) => m.value));

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((s, i) => (
          <motion.div key={i} className="bg-white rounded-xl border p-5"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          >
            <div className={`w-10 h-10 rounded-lg ${s.backgroundColor} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xs font-medium ${s.trending === "up" ? "text-green-500" : "text-red-400"}`}>
              {s.trending === "up" ? <ArrowUp /> : <ArrowDown />} {s.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* PV bar chart */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold text-sm mb-6">月間PV推移</h3>
        <div className="flex items-end gap-4 h-40">
          {monthlyPV.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs">{(m.value / 1000).toFixed(1)}k</span>
              <motion.div
                className="w-full rounded-t-lg bg-gradient-to-t from-[accent] to-[accent]/60"
                initial={{ height: 0 }}
                animate={{ height: `${(m.value / maxPV) * 100}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
              />
              <span className="text-[10px]">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 3層チェック

> この機能の核: **（管理者向け）どのページが見られてるかわかる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | 管理者ページアクセス | `/admin`サブパスで管理画面が表示される | 404/アクセスエラー |
| F-2 | KPIカード表示 | PV・問い合わせ数・検索流入・平均滞在が表示 | カードが空/数値なし |
| F-3 | 前月比の増減表示 | 矢印アイコン+パーセンテージで増減がわかる | 増減情報なし/常にゼロ表示 |
| F-4 | 月間PV推移グラフ | 棒グラフが正しい高さ比で6ヶ月分描画される | グラフが表示されない/比率が不正 |
| F-5 | グラフアニメーション | height 0→実値のアニメーションが動作する | アニメーションなし/一瞬で表示 |
| F-6 | 人気ページランキング | PV数順でページ名+PV数+割合バー表示 | ランキングなし/ソートが不正 |
| F-7 | デバイス別割合 | スマホ/PC/タブレットの割合がバー表示 | デバイス情報なし |
| F-8 | サイドバータブ切替 | タブ切替で表示コンテンツが変わる | タブが反応しない/表示が切り替わらない |
| F-9 | お問い合わせ一覧 | 日付・氏名・種別・ステータスがテーブル表示 | 一覧が表示されない |
| F-10 | モバイル対応 | サイドバーがハンバーガーorトップバーに変換 | PC用レイアウトが崩れる |
| F-11 | KPIカードstaggerアニメーション | カードが順次delay付きでフェードイン | アニメーションなし/全カード同時 |
| F-12 | 「サイトに戻る」リンク | 正しいテンプレートURLに遷移する | リンクなし/404先にリンク |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 主要数値の即時把握 | ダッシュボードを開いて3秒で現状がわかる | KPI4枚が画面上部に大きく表示 | 10点 |
| U-2 | チャートの直感的理解 | 棒グラフの高低だけでトレンドが読み取れる | 数値ラベル+適切なスケーリング | 10点 |
| U-3 | フィルター操作の容易さ | 期間フィルター・タブ切替が1クリックで完了 | アクティブ状態が明確 | 8点 |
| U-4 | モバイルでの管理操作 | スマホでも全機能にアクセスできる | タッチターゲット44px以上 | 6点 |
| U-5 | 問い合わせステータス管理 | 未対応/対応中/完了が一目で区別できる | 色+テキストのステータスバッジ | 4点 |
| U-6 | サイドバーのナビゲーション | 現在地がわかり、他タブに迷わず移動 | アクティブタブのハイライト | 2点 |

### Layer 3: 価値チェック（改善アクションにつながるか）— 30点

この機能の核「どのページが見られてるかわかる」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 「何を改善すべきか」がわかる | データからアクションが導ける | PV低下ページ+改善提案表示 | ページ別PV一覧のみ | 合計PVだけで内訳なし |
| V-2 | トレンドの把握 | 上昇/下降傾向が一目でわかる | 6ヶ月推移+前月比%+矢印色分け | 今月の数字のみ | 比較データなし |
| V-3 | 検索キーワードの洞察 | どんな言葉で見つけられてるかわかる | キーワード+検索回数+順位変動 | キーワード一覧のみ | キーワードデータなし |
| V-4 | デバイス戦略の判断材料 | モバイル比率からUIの優先度がわかる | デバイス別割合+推移グラフ | デバイス別%のみ | デバイス情報なし |
| V-5 | 問い合わせの対応漏れ防止 | 未対応案件が一目でわかる | 未対応バッジ+経過時間表示 | ステータスフィルター | ステータス管理なし |
| V-6 | 汎用性 | データ定数の差し替えで全業種対応 | KPI項目・カテゴリをPropsで変更可能 | コード修正で対応可能 | ハードコードで変更不可 |

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

### この機能固有の重要判定ポイント
- **3秒ルール**: ダッシュボードを開いて3秒以内に「今月の調子」がわかること
- **アクショナブル**: 数字を見せるだけでなく、何をすべきかのヒントまでが価値
- **モバイル管理**: 外出先のスマホからでも確認できないと管理者に使われない
