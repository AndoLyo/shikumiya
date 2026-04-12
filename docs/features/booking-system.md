# 予約システム
> ID: 26 | カテゴリ: function | プラン: premium

## 概要
イベント・サービスの予約をカレンダーUI + タイムスロット選択で受け付ける機能。残枠リアルタイム表示、予約確認ポップアップ、完了メッセージまでを一貫して提供する。業種を問わず、見学会・施術・診察・テーブル予約・レッスン等に対応可能。予約完了後は残枠が自動減少し、満席表示に切り替わる。管理者側では予約一覧と枠管理ができる。

## この機能の核
30秒で予約が完了し、電話しなくて済む

## 必須要件
- イベント/スロット一覧表示（カード形式: 日付・時間・タイトル・残枠）
- 残枠リアルタイム表示（残り少数で警告色、0で「満席」表示）
- 予約ボタン → モーダルポップアップでフォーム入力
- フォームフィールド: 氏名、電話番号、メールアドレス、参加人数/利用人数、備考
- 予約確定後の完了画面（チェックマーク + 予約内容サマリー）
- 予約済み状態のUI表示（ボタンが「予約済み」バッジに変化）
- 残枠自動減少（state管理、予約確定で spots - 1）
- AnimatePresenceによるモーダル開閉アニメーション
- フォームバリデーション（必須フィールドチェック）

## 業種別バリエーション
| 業種 | 予約対象 | 追加フィールド |
|---|---|---|
| 建築・建設 | 見学会・相談会 | 参加人数、希望の相談内容 |
| 飲食 | テーブル予約 | 人数、コース選択、アレルギー |
| 美容・サロン | 施術予約 | メニュー選択、担当指名、初回/リピート |
| 医療 | 診察予約 | 診療科目、症状、保険証種別 |
| 教育・スクール | 体験レッスン | コース、年齢/学年、経験レベル |
| ホテル・宿泊 | 宿泊予約 | チェックイン/アウト、人数、部屋タイプ |

## 既存テンプレートとの接続
### warm-craft-pro（実装済み）
- **関数名**: `BookingSection`（724行目〜）
- **イベント定数**: `INITIAL_EVENTS` 配列（id, date, time, title, spots, location）
- **セクションID**: `#booking`
- **配色**: ヘッダー `bg-[#7BA23F]`, 残枠警告 `text-red-400`（spots <= 2）
- **フォームフィールド**: 氏名、参加人数（select）、電話番号、メールアドレス、備考
- **完了UI**: チェックアイコン + 予約内容サマリー + 「閉じる」ボタン
- **管理者画面**: `warm-craft-pro/admin/page.tsx` の `BookingsContent`（313行目〜）で予約一覧表示

### trust-navy-pro / clean-arch-pro
- 予約セクション未実装。warm-craft-proのパターンを移植可能
- trust-navy-pro: `bg-[#1B3A5C]` をヘッダー色に変更
- clean-arch-pro: `bg-gray-800` + `useLang()` で多言語対応

### 共通実装パターン
```
Page Component
  └── <BookingSection />
      ├── イベントカード一覧（残枠表示 + 予約ボタン）
      └── AnimatePresence > 予約モーダル
          ├── 予約フォーム（form + onSubmit）
          └── 完了画面（formSubmitted 切替）
```

## コンポーネント仕様

### ファイル配置
```
src/app/portfolio-templates/{template-id}/page.tsx
└── BookingSection コンポーネント

※ 分割する場合:
src/components/portfolio-templates/{template-id}/
├── BookingSection.tsx
├── EventCard.tsx
├── BookingModal.tsx
└── BookingConfirmation.tsx
```

### Props / データ構造
```typescript
interface BookingEvent {
  id: number;
  date: string;        // "4/19（土）"
  time: string;        // "10:00〜16:00"
  title: string;
  spots: number;       // remaining capacity
  location: string;
  category?: string;   // "consultation" | "tour" | "lesson" etc.
}

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  partySize: number;
  notes?: string;
  [key: string]: string | number | undefined;
}

interface BookingSectionProps {
  events: BookingEvent[];
  sectionTitle: string;
  sectionSubtitle: string;
  accentColor: string;
  lowStockThreshold: number;  // default 2
  formFields: FormFieldConfig[];
}

interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  required: boolean;
  options?: string[];
  placeholder?: string;
}
```

### 状態管理
```typescript
const [events, setEvents] = useState(INITIAL_EVENTS);
const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
const [bookedIds, setBookedIds] = useState<Set<number>>(new Set());
const [formSubmitted, setFormSubmitted] = useState(false);
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| PC（1024px〜） | イベントカード横並び（日付+詳細+ボタン）。モーダル max-w-[500px] |
| タブレット（768px〜1023px） | イベントカード横並び。モーダル max-w-[500px] |
| モバイル（〜767px） | イベントカード縦積み。モーダルほぼ全幅。フォームフィールド1列 |

## リファレンスコード
```tsx
// warm-craft-pro のBookingSection簡略版
const INITIAL_EVENTS = [
  { id: 0, date: "4/19（土）", time: "10:00〜16:00", title: "完成見学会", spots: 3, location: "東京都世田谷区" },
];

function BookingSection() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [bookedIds, setBookedIds] = useState<Set<number>>(new Set());
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent === null) return;
    setEvents((prev) =>
      prev.map((ev) => ev.id === selectedEvent ? { ...ev, spots: Math.max(0, ev.spots - 1) } : ev)
    );
    setBookedIds((prev) => new Set([...prev, selectedEvent]));
    setFormSubmitted(true);
  };

  return (
    <section id="booking">
      {events.map((ev) => (
        <div key={ev.id}>
          <p className={ev.spots <= 2 ? "text-red-400" : ""}>
            {ev.spots === 0 ? "満席" : `残り${ev.spots}枠`}
          </p>
          {bookedIds.has(ev.id) ? (
            <span><Check /> 予約済み</span>
          ) : ev.spots === 0 ? (
            <span>満席</span>
          ) : (
            <button onClick={() => setSelectedEvent(ev.id)}>
              <Calendar /> 予約する
            </button>
          )}
        </div>
      ))}
      <AnimatePresence>
        {selectedEvent !== null && (
          <motion.div className="fixed inset-0 z-50 bg-black/60">
            <motion.div className="bg-white rounded-2xl max-w-[500px]">
              {formSubmitted ? (
                <div>{/* 完了画面: Check icon + サマリー */}</div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  {/* 氏名, 参加人数, 電話, メール, 備考 */}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
```

## 3層チェック

> この機能の核: **30秒で予約が完了し、電話しなくて済む**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | カレンダー/スロット表示 | イベント一覧が日付・時間・タイトル・残枠付きで表示される | 一覧が表示されない。データが空 |
| F-2 | 残枠表示 | 残枠が数値で表示され、threshold以下で警告色に変わる | 残枠表示なし。色変化しない |
| F-3 | 満席表示 | 残枠0で「満席」表示になり予約ボタンが非活性化（disabled） | 満席でもボタンが押せる。エラーで初めて満席と判明 |
| F-4 | モーダル開閉 | 予約ボタンクリックでモーダルがAnimatePresence付きで展開・閉じる | モーダルが開かない。閉じるボタンがない |
| F-5 | フォームバリデーション | 必須フィールド（氏名・電話・メール）にバリデーションが効いている | バリデーションなしで空送信可能 |
| F-6 | 残枠減少 | 予約確定後にstate上の残枠が即座に1減少する | 予約しても残枠が変わらない |
| F-7 | 予約済み表示 | 予約済みイベントのボタンが「予約済み」バッジに変化する | 予約後もボタンが「予約する」のまま |
| F-8 | 完了画面 | チェックアイコン+予約内容サマリー（日時・場所・氏名）が表示される | 完了画面なし。モーダルが閉じるだけ |
| F-9 | モーダル外クリック | モーダル外（オーバーレイ）クリックでモーダルが閉じる | 外クリックが効かない。Xボタンのみ |
| F-10 | イベント定数構造 | INITIAL_EVENTS配列の差し替えだけで任意の業種に対応できる | 業種固有のロジックが関数内にベタ書き |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 全ステップ合計30秒以内 | スロット選択→フォーム入力→送信→完了まで**30秒以内**で完了 | フォームフィールド5つ以下。入力→送信が3タップ以内 | 10点 |
| U-2 | カレンダーのタップ操作性 | スロット選択セルが**44px以上のタップ領域**を持つ | 日付セル/イベントカードが指で正確にタップできるサイズ | 8点 |
| U-3 | 確認→修正の容易さ | 予約内容の確認画面で**入力に戻って修正**が簡単にできる | 「戻る」ボタンで入力内容が保持されたままフォームに戻れる | 8点 |
| U-4 | モバイルフォーム体験 | スマホでフォーム入力が**横スクロールなしで快適**にできる | フォームが画面幅100%以内。各フィールドが1列配置 | 7点 |
| U-5 | 残枠の緊急感演出 | 残枠が少ない時に**「お早めに」の緊急感**が伝わる | 残枠2以下で赤色+「残りわずか」テキスト。ユーザーが行動を急ぐ | 7点 |

### Layer 3: 価値チェック（電話しなくて済むか）— 30点

この機能の核「30秒で予約が完了し、電話しなくて済む」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 電話より楽だと感じるか | ユーザーが**「電話するより楽だ」**と感じる | スロット選択→3フィールド入力→送信。15秒で完了 | 5フィールド入力→確認→送信。30秒で完了 | フォームが10フィールド以上。電話した方が早い |
| V-2 | 予約完了の安心感 | 予約後に**「ちゃんと予約できた」と確信**できる | 完了画面に予約番号+日時+場所+「確認メールを送信しました」 | チェックアイコン+予約内容サマリー表示 | 画面が変わらず予約できたか不明。確認手段なし |
| V-3 | 残席表示の緊急性 | 残枠表示で**「早く予約しないと」と行動を促される** | 「残り2枠」赤色表示+「お早めにご予約ください」 | 「残り3枠」の数値表示のみ | 残枠表示なし。満席かどうかわからない |
| V-4 | 予約不安の解消 | 予約後の**不安が解消される** | 「当日は○○をお持ちください」「キャンセルは前日17時まで可」等の次のステップ案内 | 完了画面に予約内容が表示される | 予約後に何すればいいかわからない |
| V-5 | 管理者側の予約確認 | 管理者が**予約一覧を確認・管理できる** | admin画面に予約一覧+ステータス管理+CSV出力 | admin画面に予約一覧表示 | 管理者画面なし。予約データが確認不可 |
| V-6 | フォームの業種拡張性 | FormFieldConfigで**業種固有フィールドを簡単に追加**できる | 飲食:アレルギー選択、美容:メニュー+指名、医療:症状。全てconfig差し替え | フォーム構造は汎用的。一部ハードコード | 業種ごとにコンポーネント自体を書き直す必要がある |

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
- スロット表示+残枠+モーダル+バリデーション+完了画面が全て動作（L1: 30/30）
- 15秒で予約完了。カレンダーセル48px。残枠2以下で赤色警告（L2: 35/40）
- 完了画面に予約番号+確認メール案内。「キャンセルは前日17時まで」の次ステップあり（L3: 25/30）

**80点の実装:**
- 予約フローは一通り動作する（L1: 30/30）
- 30秒で完了。モバイルフォームOK。残枠数値表示（L2: 28/40）
- 完了画面にサマリーあり。次のステップ案内なし（L3: 22/30）

**70点の実装:**
- 予約は動く。バリデーション甘い（L1: 30/30）
- フォーム7フィールドで45秒かかる。モバイルで横スクロール（L2: 22/40）
- 完了画面がチェックアイコンのみ。予約内容の確認手段なし（L3: 18/30）

### この機能固有の重要判定ポイント

1. **30秒ルール**: スロット選択からフォーム送信完了まで30秒を超えるとこの機能の核が未達成。**ストップウォッチで計測し、30秒超過ならU-1が0点**
2. **満席時のUX**: 満席イベントで予約ボタンが押せてしまい、送信後にエラーになるのは最悪のUX。**満席時にボタンがdisabledでなければF-3自動FAIL**
3. **完了画面の情報量**: 「予約を受け付けました」だけでは不安が残る。**予約内容サマリー（日時+場所+氏名）がなければV-2自動FAIL**
