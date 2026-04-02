/**
 * しくみや — Stripe Webhook Handler + 注文管理API (GAS)
 *
 * Setup:
 * 1. Create a new Google Spreadsheet
 * 2. Open Extensions > Apps Script
 * 3. Paste this code
 * 4. Deploy as Web app (Execute as: Me, Access: Anyone)
 * 5. Copy the URL and set as GAS_WEBHOOK_URL env var in Vercel
 */

const SPREADSHEET_ID = "1AYtEM0IlSAXcMoYOVKTjrIF16gqrn-AOdCipLCFS4MQ";
const SHEET_NAME = "注文データ";

// ━━━━━━━━━━━━━━━━━━━━
// POST: Stripe Webhookからの注文受信
// ━━━━━━━━━━━━━━━━━━━━

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Check if this is a status update request
    if (data.action === "update_status") {
      return updateOrderStatus(data.row, data.status);
    }

    // 1. Log to spreadsheet
    logToSheet(data);

    // 2. Send completion email
    sendCompletionEmail(data);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error:", error);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ━━━━━━━━━━━━━━━━━━━━
// GET: 未処理注文の取得
// ━━━━━━━━━━━━━━━━━━━━

function doGet(e) {
  try {
    const action = e.parameter.action || "pending";

    if (action === "pending") {
      return getPendingOrders();
    }

    if (action === "complete") {
      const row = parseInt(e.parameter.row);
      if (!row) {
        return jsonResponse({ success: false, error: "row parameter required" });
      }
      return updateOrderStatus(row, "完了");
    }

    return jsonResponse({ success: false, error: "Unknown action" });
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse({ success: false, error: error.message });
  }
}

function getPendingOrders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ orders: [] });

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const orders = [];

  for (let i = 1; i < data.length; i++) {
    const status = data[i][13]; // ステータス列 (14番目、0-indexed=13)
    if (status === "制作中") {
      const order = {};
      headers.forEach((h, j) => {
        order[h] = data[i][j];
      });
      order._row = i + 1; // スプレッドシートの行番号（1-indexed + ヘッダー分）
      orders.push(order);
    }
  }

  return jsonResponse({ orders });
}

function updateOrderStatus(row, status) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ success: false, error: "Sheet not found" });

  sheet.getRange(row, 14).setValue(status); // ステータス列を更新
  return jsonResponse({ success: true, row, status });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(
    JSON.stringify(obj),
  ).setMimeType(ContentService.MimeType.JSON);
}

// ━━━━━━━━━━━━━━━━━━━━
// スプレッドシート記録
// ━━━━━━━━━━━━━━━━━━━━

function logToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "日時",
      "アーティスト名",
      "メールアドレス",
      "プラン",
      "テンプレート",
      "自己紹介",
      "X",
      "Instagram",
      "Pixiv",
      "その他SNS",
      "サイトURL",
      "Stripe Session ID",
      "金額",
      "ステータス",
      "要望",
      "キャッチコピー",
      "モットー",
      "GistID",
    ]);
    sheet.getRange(1, 1, 1, 18).setFontWeight("bold");
  }

  sheet.appendRow([
    new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    data.artist_name || "",
    data.customerEmail || data.email || "",
    data.plan || "",
    data.template || "",
    data.bio || "",
    data.sns_x || "",
    data.sns_instagram || "",
    data.sns_pixiv || "",
    data.sns_other || "",
    data.siteUrl || "",
    data.stripeSessionId || "",
    data.amountTotal || "",
    "制作中",
    data.requests || "",
    data.catchcopy || "",
    data.motto || "",
    data.image_gist_id || data.imageGistId || "",
  ]);
}

// ━━━━━━━━━━━━━━━━━━━━
// メール送信
// ━━━━━━━━━━━━━━━━━━━━

function sendCompletionEmail(data) {
  const email = data.customerEmail || data.email;
  if (!email) return;

  const artistName = data.artist_name || "お客様";
  const siteUrl = data.siteUrl || "（準備中）";
  const plan =
    data.plan === "omakase" ? "おまかせプラン" : "テンプレートプラン";

  const subject = `【しくみや】サイト制作を開始しました — ${artistName}様`;

  const body = `${artistName} 様

この度は「しくみや」をご利用いただき、ありがとうございます。
お支払いを確認いたしました。サイトの制作を開始します。

━━━━━━━━━━━━━━━━━━━━
■ ご注文内容
━━━━━━━━━━━━━━━━━━━━
プラン: ${plan}
テンプレート: ${data.template || "未選択"}
サイトURL: ${siteUrl}

━━━━━━━━━━━━━━━━━━━━
■ 今後の流れ
━━━━━━━━━━━━━━━━━━━━
1. サイトが完成次第、改めてメールでお知らせします
2. 完成後、SNSのプロフィールにURLを設置してください
${data.plan === "omakase" ? "3. カスタマイズのご要望はメールで受け付けています（月3回まで）" : "3. 初回1回のみ無料で編集を承ります"}

ご不明な点がございましたら、お気軽にご連絡ください。

━━━━━━━━━━━━━━━━━━━━
しくみや by Lyo Vision
https://lyo-vision.com
メール: ando.lyo.ai@gmail.com
X: https://x.com/ando_lyo
━━━━━━━━━━━━━━━━━━━━`;

  GmailApp.sendEmail(email, subject, body, {
    name: "しくみや by Lyo Vision",
    replyTo: "ando.lyo.ai@gmail.com",
  });

  // Also notify Lyo
  GmailApp.sendEmail(
    "ando.lyo.ai@gmail.com",
    `【しくみや】新規注文: ${artistName}様 (${plan})`,
    `新規注文が入りました。\n\nアーティスト名: ${artistName}\nプラン: ${plan}\nテンプレート: ${data.template}\nサイトURL: ${siteUrl}\nメール: ${email}\n要望: ${data.requests || "なし"}`,
    { name: "しくみや自動通知" },
  );
}

// ━━━━━━━━━━━━━━━━━━━━
// テスト
// ━━━━━━━━━━━━━━━━━━━━

function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        artist_name: "テスト太郎",
        email: "test@example.com",
        customerEmail: "test@example.com",
        plan: "template",
        template: "cinematic-dark",
        bio: "テスト用の自己紹介です",
        sns_x: "https://x.com/test",
        siteUrl: "https://site-test.vercel.app",
        stripeSessionId: "cs_test_123",
        amountTotal: 980,
        requests: "白基調にしてほしい",
      }),
    },
  };

  const result = doPost(testData);
  console.log(result.getContent());
}

function testGetPending() {
  const result = getPendingOrders();
  console.log(result.getContent());
}
