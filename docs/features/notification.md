# 通知システム
> ID: 33 | カテゴリ: function | プラン: middle

## 概要
フォーム送信やイベント発生時にメール・LINE・Slackへ通知を送信するバックエンド連携機能。Next.js API route（Route Handler）を経由して外部通知サービスにリクエストを送る。お問い合わせ・予約・資料請求など、イベント種別ごとに通知先とテンプレートを切り替えられる。業種を問わず、管理者がリアルタイムで顧客アクションを把握し、迅速な初動対応を可能にするインフラ機能。

## この機能の核
問い合わせた後「ちゃんと届いた」と確認できる

## 必須要件
- Next.js Route Handler (`app/api/notify/route.ts`) によるサーバーサイド通知送信
- イベントトリガー: フォーム送信、予約確定、資料ダウンロード等
- 通知チャネル: メール（Resend/SendGrid等）、LINE Notify、Slack Webhook
- 通知テンプレート: イベント種別ごとに件名・本文テンプレートを切り替え
- 環境変数管理: APIキー・Webhook URLは `.env.local` で管理
- エラーハンドリング: 通知送信失敗時にコンソールエラーログ + ユーザーへのフォールバック
- 通知設定UI（管理者画面）: チャネルごとのON/OFF切替

## 業種別バリエーション
| 業種 | トリガーイベント | 通知テンプレート内容 |
|---|---|---|
| 建築・建設 | 問い合わせ、見学会予約 | 顧客名、相談内容、希望日時 |
| 飲食 | テーブル予約、テイクアウト注文 | 予約日時、人数、コース |
| 美容・サロン | 施術予約、キャンセル | 予約日時、メニュー、担当 |
| 医療 | 診察予約、問い合わせ | 予約日時、診療科、症状 |
| 小売・EC | 注文確定、問い合わせ | 注文番号、商品名、金額 |
| 教育 | 体験申込、入会申込 | コース、希望日時、年齢 |

## 既存テンプレートとの接続
### warm-craft-pro/admin
- **管理者画面**: `admin/page.tsx` の通知設定セクション（353行目付近）
- **設定UI**: LINE通知/メール通知/Slack通知のON/OFFトグル
- **トリガー**: お問い合わせ送信時、見学会予約時
- **データフロー**: ContactSection の handleSubmit → API route → 通知サービス

### trust-navy-pro
- ContactSection + RecruitSection のフォーム送信が通知トリガー候補
- 管理者画面未実装だが、warm-craft-pro/adminのパターンを移植可能

### clean-arch-pro
- ContactSection のフォーム送信が通知トリガー候補
- 多言語対応の場合、通知テンプレートも言語に応じた切替が必要

### 共通実装パターン
```
フォームコンポーネント
  └── handleSubmit()
      ├── フォームデータ収集
      └── fetch("/api/notify", { method: "POST", body })
          └── API Route (app/api/notify/route.ts)
              ├── メール送信（Resend/SendGrid）
              ├── LINE Notify
              └── Slack Webhook

管理者画面
  └── 通知設定パネル
      ├── メール通知 ON/OFF
      ├── LINE通知 ON/OFF
      └── Slack通知 ON/OFF
```

## コンポーネント仕様

### ファイル配置
```
src/app/api/notify/route.ts          ← API Route Handler
src/app/api/notify/email.ts          ← メール送信ロジック
src/app/api/notify/line.ts           ← LINE Notify送信
src/app/api/notify/slack.ts          ← Slack Webhook送信

src/app/portfolio-templates/{template-id}/page.tsx
└── 各フォームの handleSubmit 内で fetch("/api/notify") を呼び出し

管理者画面:
src/app/portfolio-templates/{template-id}/admin/page.tsx
└── NotificationSettings コンポーネント
```

### Props / データ構造
```typescript
interface NotificationPayload {
  eventType: "contact" | "booking" | "download" | "recruit" | "custom";
  siteId: string;
  timestamp: string;
  data: Record<string, string | number>;
  channels: NotificationChannel[];
}

interface NotificationChannel {
  type: "email" | "line" | "slack";
  enabled: boolean;
  config: EmailConfig | LineConfig | SlackConfig;
}

interface EmailConfig {
  to: string;
  from: string;
  replyTo?: string;
  templateId?: string;
}

interface LineConfig {
  accessToken: string;   // LINE Notify token
}

interface SlackConfig {
  webhookUrl: string;
  channel?: string;
}

interface NotificationTemplate {
  eventType: string;
  subject: string;        // for email
  bodyTemplate: string;   // with {{variable}} placeholders
  slackBlocks?: object[]; // Slack Block Kit format
}

interface NotificationSettingsProps {
  channels: NotificationChannel[];
  onToggle: (channelType: string, enabled: boolean) => void;
  accentColor: string;
}
```

### 状態管理
```typescript
// 管理者画面の通知設定
const [emailEnabled, setEmailEnabled] = useState(true);
const [lineEnabled, setLineEnabled] = useState(false);
const [slackEnabled, setSlackEnabled] = useState(false);

// フォーム送信側
const handleSubmit = async (formData: FormData) => {
  try {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "contact",
        data: Object.fromEntries(formData),
        channels: [
          { type: "email", enabled: emailEnabled },
          { type: "line", enabled: lineEnabled },
          { type: "slack", enabled: slackEnabled },
        ],
      }),
    });
    if (!res.ok) throw new Error("Notification failed");
  } catch (err) {
    console.error("Notification error:", err);
    // Fallback: still show success to user
  }
};
```

### レスポンシブ対応
| ブレークポイント | 挙動 |
|---|---|
| 管理者画面 | 通知設定パネルは全幅カード。トグルは右揃え |
| フロントエンド | 通知はバックエンド処理のためUI影響なし |

## リファレンスコード
```typescript
// app/api/notify/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { eventType, data, channels } = await req.json();

  const results = await Promise.allSettled(
    channels
      .filter((ch: NotificationChannel) => ch.enabled)
      .map((ch: NotificationChannel) => {
        switch (ch.type) {
          case "email":
            return sendEmail(ch.config as EmailConfig, eventType, data);
          case "line":
            return sendLineNotify(ch.config as LineConfig, eventType, data);
          case "slack":
            return sendSlackWebhook(ch.config as SlackConfig, eventType, data);
        }
      })
  );

  return NextResponse.json({ success: true, results });
}

async function sendSlackWebhook(config: SlackConfig, eventType: string, data: Record<string, string>) {
  return fetch(config.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `[${eventType}] ${data.name}様からのお問い合わせ\n${data.message ?? ""}`,
    }),
  });
}

async function sendLineNotify(config: LineConfig, eventType: string, data: Record<string, string>) {
  return fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${config.accessToken}`,
    },
    body: new URLSearchParams({
      message: `\n[${eventType}] ${data.name}様\n${data.email}\n${data.message ?? ""}`,
    }),
  });
}
```

## 3層チェック

> この機能の核: **問い合わせた後「ちゃんと届いた」と確認できる**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | API Route呼び出し | フォーム送信時に`/api/notify`へPOSTリクエストが送られる | fetchが呼ばれない/404エラー |
| F-2 | メール送信 | Resend/SendGrid経由で正しい宛先にメールが届く | メールが届かない/宛先間違い |
| F-3 | LINE Notify送信 | LINE Notifyトークンで通知が届く | 通知が届かない/トークンエラー |
| F-4 | Slack Webhook送信 | 指定チャネルにメッセージが投稿される | Webhook URLエラー/投稿されない |
| F-5 | 環境変数管理 | APIキー・Webhook URLが`.env.local`管理 | キーがフロントエンドに露出 |
| F-6 | エラーハンドリング | 通知失敗時にコンソールエラーログ記録 | エラーが握りつぶされる |
| F-7 | フォールバック処理 | 通知失敗でもフォーム送信は成功として処理 | 通知失敗でフォーム送信もエラー扱い |
| F-8 | テンプレート切替 | イベント種別ごとに件名・本文が切り替わる | 全イベントで同じテンプレート |
| F-9 | チャネルON/OFF | 管理者画面で各チャネルの有効/無効切替 | 設定画面なし/トグルが機能しない |
| F-10 | ペイロード情報 | タイムスタンプ・サイトIDが通知に含まれる | いつ・どのサイトからの通知か不明 |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的を達成できるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 送信後の確認表示 | 「送信完了」画面+確認メール到着で安心できる | 送信後3秒以内に完了表示 | 10点 |
| U-2 | 通知の到達速度 | 管理者への通知が即座に届く | フォーム送信から1分以内 | 10点 |
| U-3 | 通知内容のわかりやすさ | 誰から・何の問い合わせか一目でわかる | 氏名+種別+内容の要約 | 8点 |
| U-4 | 管理画面の操作性 | チャネルのON/OFFがトグル1つで切替可能 | 設定変更が即座に反映 | 6点 |
| U-5 | エラー時の原因特定 | テスト送信でどのチャネルが失敗したかわかる | チャネル別のステータス表示 | 4点 |
| U-6 | 通知設定の初期状態 | 初期設定でメール通知がONになっている | 設定なしでも最低限の通知が届く | 2点 |

### Layer 3: 価値チェック（安心できるか）— 30点

この機能の核「ちゃんと届いたと確認できる」が実現されているかの検証。ここが80点と90点を分ける。

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | ユーザーの安心感 | 「問い合わせが届いた」と確信できる | 完了画面+確認メール+受付番号 | 「送信しました」テキスト | 送信後に何も表示されない |
| V-2 | 管理者の見逃し防止 | 全問い合わせに1時間以内に気づける | LINE即通知+Slack+メールの3重 | メール通知のみ | 管理画面を見ない限り気づかない |
| V-3 | 24時間対応 | 深夜・休日の問い合わせも通知される | 時間帯関係なく即座に通知 | 営業時間内のみ通知 | 通知が遅延する/届かない |
| V-4 | 確認メールの内容品質 | ユーザーが送った内容を手元で確認できる | 送信内容の全文+受付番号+返答予定日 | 「お問い合わせありがとうございます」のみ | 確認メールが届かない |
| V-5 | テンプレートの業種対応 | 業種の問い合わせ内容に合った通知形式 | 建築→図面添付/飲食→予約日時+人数 | 汎用テンプレートで全業種対応 | テンプレートなし/生データ送信 |
| V-6 | セキュリティ | APIキーが安全に管理されている | サーバーサイドのみ+env暗号化 | .env.localで管理 | フロントエンドにキー露出 |

## スコアリング

### 合計100点の内訳
| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 10項目全PASSで30点。1つでもFAILなら0点 |
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
- **ユーザー側の安心**: 送信完了の確認表示+確認メールがセット。どちらか欠けると不安が残る
- **管理者側の即時性**: LINEやSlackの即時通知がないと、メールは埋もれて気づかない
- **フォールバック**: 通知が失敗してもフォーム送信が成功扱いになることが必須。ユーザーに二度手間をさせない
