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
const EDIT_SHEET_NAME = "編集リクエスト";

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

    if (action === "verify") {
      return verifyMember(e.parameter.orderId, e.parameter.email);
    }

    if (action === "save_edit") {
      return saveEditRequest(
        e.parameter.orderId,
        e.parameter.email,
        e.parameter.artistName,
        e.parameter.changes,
        e.parameter.requests
      );
    }

    if (action === "send_completion") {
      return sendSiteCompletionEmail(
        e.parameter.orderId,
        e.parameter.email,
        e.parameter.artistName,
        e.parameter.siteUrl,
        e.parameter.plan
      );
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
// 会員認証
// ━━━━━━━━━━━━━━━━━━━━

function verifyMember(orderId, email) {
  if (!orderId || !email) {
    return jsonResponse({ valid: false, error: "orderId and email required" });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ valid: false, error: "Sheet not found" });

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Find column indices
  const colEmail = headers.indexOf("メールアドレス");
  const colOrderId = headers.indexOf("注文ID");
  const colTemplate = headers.indexOf("テンプレート");
  const colPlan = headers.indexOf("プラン");
  const colSiteUrl = headers.indexOf("サイトURL");
  const colArtistName = headers.indexOf("アーティスト名");
  const colStatus = headers.indexOf("ステータス");

  for (var i = 1; i < data.length; i++) {
    var rowOrderId = String(data[i][colOrderId] || "").trim();
    var rowEmail = String(data[i][colEmail] || "").trim().toLowerCase();

    if (rowOrderId === orderId && rowEmail === email.toLowerCase()) {
      // Count edits used
      var editsUsed = countEditsUsed(orderId);

      return jsonResponse({
        valid: true,
        artistName: data[i][colArtistName] || "",
        template: data[i][colTemplate] || "",
        plan: data[i][colPlan] || "template",
        siteUrl: data[i][colSiteUrl] || "",
        editsUsed: editsUsed,
        status: data[i][colStatus] || "",
      });
    }
  }

  return jsonResponse({ valid: false, error: "Not found" });
}

function countEditsUsed(orderId) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var editSheet = ss.getSheetByName(EDIT_SHEET_NAME);
  if (!editSheet) return 0;

  var data = editSheet.getDataRange().getValues();
  var headers = data[0];
  var colOrderId = headers.indexOf("注文ID");
  var colStatus = headers.indexOf("ステータス");

  var count = 0;
  var now = new Date();
  var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colOrderId]) === orderId) {
      // Count edits from current month for omakase, or all-time for template
      var editDate = new Date(data[i][0]); // 日時 column
      if (editDate >= monthStart || data[i][colStatus] !== "完了") {
        count++;
      }
    }
  }
  return count;
}

// ━━━━━━━━━━━━━━━━━━━━
// 編集リクエスト保存
// ━━━━━━━━━━━━━━━━━━━━

function saveEditRequest(orderId, email, artistName, changesJson, requests) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(EDIT_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(EDIT_SHEET_NAME);
    sheet.appendRow([
      "日時",
      "注文ID",
      "アーティスト名",
      "メール",
      "変更内容",
      "備考",
      "ステータス",
    ]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
  }

  sheet.appendRow([
    new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    orderId || "",
    artistName || "",
    email || "",
    changesJson || "{}",
    requests || "",
    "未処理",
  ]);

  // Notify Lyo via email
  GmailApp.sendEmail(
    "ando.lyo.ai@gmail.com",
    "【しくみや】編集リクエスト: " + (artistName || orderId),
    "編集リクエストが届きました。\n\n注文ID: " + orderId + "\nアーティスト名: " + (artistName || "不明") + "\nメール: " + (email || "不明") + "\n変更内容: " + (changesJson || "{}") + "\n備考: " + (requests || "なし"),
    { name: "しくみや自動通知" }
  );

  return jsonResponse({ success: true });
}

// メール②: サイト完成後（URLと会員ページ情報を送る）
function sendSiteCompletionEmail(orderId, email, artistName, siteUrl, plan) {
  if (!email) return jsonResponse({ success: false, error: "email required" });

  artistName = artistName || "お客様";
  const planName = plan === "omakase" ? "おまかせプラン" : "テンプレートプラン";

  const subject = `【しくみや】サイトが完成しました！ — ${artistName}様`;

  const body = `${artistName} 様

お待たせいたしました！
あなたのギャラリーサイトが完成しました。

━━━━━━━━━━━━━━━━━━━━
■ あなたのサイト
━━━━━━━━━━━━━━━━━━━━
${siteUrl}

上記URLをクリックして、ぜひご確認ください。
SNSのプロフィールに貼れば、あなたの名刺代わりになります。

━━━━━━━━━━━━━━━━━━━━
■ 会員ページ（サイトの編集用）
━━━━━━━━━━━━━━━━━━━━
サイトの内容を変更したい場合は、下記からログインしてください。
https://lyo-vision.com/member

ログイン情報:
- 注文ID: ${orderId}
- メールアドレス: ${email}

${planName === "おまかせプラン" ? "おまかせプランでは月3回まで編集リクエストを送れます。" : "テンプレートプランでは初回1回のみ無料で編集できます。"}

━━━━━━━━━━━━━━━━━━━━
■ おすすめの使い方
━━━━━━━━━━━━━━━━━━━━
1. SNS（X、Instagram等）のプロフィールにURLを設置
2. 作品を追加したくなったら会員ページから編集リクエスト
3. 名刺やDMにURLを記載して、ポートフォリオとして活用

ご不明な点がございましたら、お気軽にご連絡ください。
今後ともよろしくお願いいたします。

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

  // Lyoにも通知
  GmailApp.sendEmail(
    "ando.lyo.ai@gmail.com",
    `【しくみや】サイト完成: ${artistName}様`,
    `サイトが完成しました。\n\nアーティスト名: ${artistName}\nサイトURL: ${siteUrl}\nプラン: ${planName}\nメール: ${email}`,
    { name: "しくみや自動通知" },
  );

  return jsonResponse({ success: true });
}

// ━━━━━━━━━━━━━━━━━━━━
// スプレッドシート記録
// ━━━━━━━━━━━━━━━━━━━━

function logToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // 固定フィールド（必ず先頭に来る列。順序固定）
  const fixedFields = [
    { key: "_timestamp", label: "日時" },
    { key: "order_id", label: "注文ID" },
    { key: "artist_name", label: "アーティスト名" },
    { key: "email", label: "メールアドレス" },
    { key: "plan", label: "プラン" },
    { key: "template", label: "テンプレート" },
    { key: "siteUrl", label: "サイトURL" },
    { key: "_status", label: "ステータス" },
  ];
  const fixedKeys = fixedFields.map(f => f.key);

  // シートが無い場合は固定列だけで作成
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(fixedFields.map(f => f.label));
    sheet.getRange(1, 1, 1, fixedFields.length).setFontWeight("bold");
  }

  // 現在のヘッダーを取得
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);

  // dataの全キーを取得（固定キー・内部キー以外）
  const skipKeys = ["_timestamp", "_status", "customerEmail", "stripeSessionId", "amountTotal", "image_gist_id", "imageGistId"];
  const allDataKeys = Object.keys(data).filter(k => !skipKeys.includes(k));

  // ヘッダーにないキーがあれば列を追加
  const keyToLabel = {
    artist_name: "アーティスト名", email: "メールアドレス", plan: "プラン",
    template: "テンプレート", siteUrl: "サイトURL", order_id: "注文ID",
    bio: "自己紹介", catchcopy: "キャッチコピー", motto: "モットー",
    subtitle: "肩書き", siteTitle: "サイトタイトル", siteSlug: "サイトスラッグ",
    sns_x: "X", sns_instagram: "Instagram", sns_pixiv: "Pixiv",
    sns_note: "note", sns_other: "その他SNS",
    requests: "要望", referenceUrl: "参考サイトURL",
    moodTone: "雰囲気", moodFont: "フォント", moodAnimation: "アニメーション",
    colorPrimary: "カラー（メイン）", colorBackground: "カラー（背景）",
    skills: "スキル", stats: "実績数字", workCategories: "作品カテゴリ", tools: "使用ツール",
    genres: "ジャンル",
  };

  for (const key of allDataKeys) {
    if (fixedKeys.includes(key)) continue; // 固定列にあるキーはスキップ
    const label = keyToLabel[key] || key;
    if (!headers.includes(label)) {
      // 新しい列をヘッダーに追加
      const newCol = headers.length + 1;
      sheet.getRange(1, newCol).setValue(label).setFontWeight("bold");
      headers.push(label);
    }
  }

  // データ行を構築
  const row = [];
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header === "日時") {
      row.push(new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
    } else if (header === "ステータス") {
      row.push("制作中");
    } else if (header === "メールアドレス") {
      row.push(data.customerEmail || data.email || "");
    } else {
      // ヘッダーラベルからキーを逆引き
      const key = Object.entries(keyToLabel).find(([k, v]) => v === header)?.[0];
      if (key) {
        const val = data[key];
        row.push(Array.isArray(val) ? val.join(", ") : (val || ""));
      } else {
        // 固定フィールドのキーで直接マッチ
        const fixedField = fixedFields.find(f => f.label === header);
        if (fixedField && fixedField.key !== "_timestamp" && fixedField.key !== "_status") {
          row.push(data[fixedField.key] || "");
        } else {
          row.push("");
        }
      }
    }
  }

  sheet.appendRow(row);
}

// ━━━━━━━━━━━━━━━━━━━━
// メール送信
// ━━━━━━━━━━━━━━━━━━━━

// メール①: 決済直後（制作開始のお知らせ。サイトURLはまだ送らない）
function sendCompletionEmail(data) {
  const email = data.customerEmail || data.email;
  if (!email) return;

  const artistName = data.artist_name || "お客様";
  const orderId = data.order_id || "";
  const plan =
    data.plan === "omakase" ? "おまかせプラン" : "テンプレートプラン";

  const subject = `【しくみや】ご注文ありがとうございます — ${artistName}様`;

  const body = `${artistName} 様

この度は「しくみや」をご利用いただき、ありがとうございます。
お支払いを確認いたしました。

ただいまより、あなただけのギャラリーサイトの制作を開始します。
ご入力いただいた内容をもとに、デザインの調整を行っております。

━━━━━━━━━━━━━━━━━━━━
■ ご注文内容
━━━━━━━━━━━━━━━━━━━━
注文ID: ${orderId}
プラン: ${plan}
テンプレート: ${data.template || "未選択"}

━━━━━━━━━━━━━━━━━━━━
■ 今後の流れ
━━━━━━━━━━━━━━━━━━━━
1. 現在、サイトを制作中です（通常1時間〜数時間で完成します）
2. 完成次第、サイトURLを記載した完成メールをお届けします
3. それまでしばらくお待ちください

※ サイトの完成をお急ぎの場合は、お気軽にご連絡ください。

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
    `新規注文が入りました。\n\nアーティスト名: ${artistName}\nプラン: ${plan}\nテンプレート: ${data.template || "未選択"}\nメール: ${email}\n要望: ${data.requests || "なし"}\n\n※サイトURLは完成後に別メールで送信されます`,
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
