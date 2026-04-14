/**
 * しくみや — Webhook Handler + 注文管理API (GAS)
 * 全業種対応のHP制作SaaS
 *
 * Setup:
 * 1. Create a new Google Spreadsheet
 * 2. Open Extensions > Apps Script
 * 3. Paste this code
 * 4. Deploy as Web app (Execute as: Me, Access: Anyone)
 * 5. Copy the URL and set as GAS_WEBHOOK_URL env var
 */

const SPREADSHEET_ID = "1AYtEM0IlSAXcMoYOVKTjrIF16gqrn-AOdCipLCFS4MQ";
const SHEET_NAME = "注文データ";
const EDIT_SHEET_NAME = "編集リクエスト";
const USER_SHEET_NAME = "ユーザー認証";

// ━━━━━━━━━━━━━━━━━━━━
// POST: Webhookからの注文受信
// ━━━━━━━━━━━━━━━━━━━━

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === "update_status") {
      return updateOrderStatus(data.row, data.status);
    }

    // 1. スプレッドシートに記録
    logToSheet(data);

    // 2. 確認メール送信
    sendCompletionEmail(data);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error:", error);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ━━━━━━━━━━━━━━━━━━━━
// GET: 各種アクション
// ━━━━━━━━━━━━━━━━━━━━

function doGet(e) {
  try {
    const action = e.parameter.action || "pending";

    if (action === "pending") {
      return getPendingOrders();
    }

    if (action === "complete") {
      const row = parseInt(e.parameter.row);
      if (!row) return jsonResponse({ success: false, error: "row parameter required" });
      return updateOrderStatus(row, "完了");
    }

    if (action === "verify") {
      return verifyMember(e.parameter.orderId, e.parameter.email);
    }

    if (action === "get_all_customers") {
      return getAllCustomers();
    }

    if (action === "find_by_email") {
      return findByEmail(e.parameter.email);
    }

    if (action === "register_user") {
      return registerUser(e.parameter.email, e.parameter.password);
    }

    if (action === "verify_password") {
      return verifyUserPassword(e.parameter.email, e.parameter.password);
    }

    if (action === "save_edit") {
      return saveEditRequest(
        e.parameter.orderId,
        e.parameter.email,
        e.parameter.companyName,
        e.parameter.changes,
        e.parameter.requests
      );
    }

    if (action === "send_completion") {
      return sendSiteCompletionEmail(
        e.parameter.orderId,
        e.parameter.email,
        e.parameter.companyName,
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
    const statusCol = headers.indexOf("ステータス");
    const status = data[i][statusCol];
    if (status === "制作中") {
      const order = {};
      headers.forEach((h, j) => { order[h] = data[i][j]; });
      order._row = i + 1;
      orders.push(order);
    }
  }

  return jsonResponse({ orders });
}

// ━━━━━━━━━━━━━━━━━━━━
// ユーザー認証（メール+パスワード）
// ━━━━━━━━━━━━━━━━━━━━

function hashPassword(password) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password + "shikumiya_salt_2026");
  return raw.map(function(b) { return ("0" + ((b < 0 ? b + 256 : b).toString(16))).slice(-2); }).join("");
}

function getUserSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(USER_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(USER_SHEET_NAME);
    sheet.appendRow(["メールアドレス", "パスワードハッシュ", "登録日時"]);
    sheet.getRange(1, 1, 1, 3).setFontWeight("bold");
  }
  return sheet;
}

function registerUser(email, password) {
  if (!email || !password) return jsonResponse({ success: false, error: "email and password required" });
  if (password.length < 6) return jsonResponse({ success: false, error: "パスワードは6文字以上必要です" });

  var sheet = getUserSheet();
  var data = sheet.getDataRange().getValues();

  // 重複チェック
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === email.toLowerCase()) {
      return jsonResponse({ success: false, error: "このメールアドレスは既に登録されています" });
    }
  }

  sheet.appendRow([
    email.toLowerCase(),
    hashPassword(password),
    new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
  ]);

  return jsonResponse({ success: true });
}

function verifyUserPassword(email, password) {
  if (!email || !password) return jsonResponse({ valid: false, error: "email and password required" });

  var sheet = getUserSheet();
  var data = sheet.getDataRange().getValues();
  var hash = hashPassword(password);

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === email.toLowerCase()) {
      if (String(data[i][1]) === hash) {
        return jsonResponse({ valid: true });
      } else {
        return jsonResponse({ valid: false, error: "パスワードが間違っています" });
      }
    }
  }

  return jsonResponse({ valid: false, error: "このメールアドレスは登録されていません" });
}

// ━━━━━━━━━━━━━━━━━━━━
// メールアドレスで注文検索
// ━━━━━━━━━━━━━━━━━━━━

function findByEmail(email) {
  if (!email) return jsonResponse({ found: false, error: "email required" });

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ found: false, orders: [] });

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var col = function(name) { return headers.indexOf(name); };
  var orders = [];

  for (var i = 1; i < data.length; i++) {
    var rowEmail = String(data[i][col("メールアドレス")] || "").trim().toLowerCase();
    if (rowEmail === email.toLowerCase()) {
      orders.push({
        orderId: String(data[i][col("注文ID")] || ""),
        companyName: String(data[i][col("会社名")] || ""),
        plan: String(data[i][col("プラン")] || "lite"),
        template: String(data[i][col("テンプレート")] || ""),
        siteUrl: String(data[i][col("サイトURL")] || ""),
        domain: String(data[i][col("ドメイン")] || ""),
        status: String(data[i][col("ステータス")] || ""),
        createdAt: String(data[i][col("日時")] || ""),
      });
    }
  }

  return jsonResponse({ found: orders.length > 0, orders: orders });
}

function getAllCustomers() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ customers: [] });

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var customers = [];

  var col = function(name) { return headers.indexOf(name); };

  for (var i = 1; i < data.length; i++) {
    customers.push({
      orderId: String(data[i][col("注文ID")] || ""),
      companyName: String(data[i][col("会社名")] || ""),
      email: String(data[i][col("メールアドレス")] || ""),
      plan: String(data[i][col("プラン")] || "lite"),
      template: String(data[i][col("テンプレート")] || ""),
      siteUrl: String(data[i][col("サイトURL")] || ""),
      domain: String(data[i][col("ドメイン")] || ""),
      status: String(data[i][col("ステータス")] || ""),
      industry: String(data[i][col("業種")] || ""),
      createdAt: String(data[i][col("日時")] || ""),
      _row: i + 1,
    });
  }

  return jsonResponse({ customers: customers });
}

function updateOrderStatus(row, status) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ success: false, error: "Sheet not found" });

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const statusCol = headers.indexOf("ステータス") + 1;
  if (statusCol > 0) sheet.getRange(row, statusCol).setValue(status);
  return jsonResponse({ success: true, row, status });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(
    JSON.stringify(obj)
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

  const col = (name) => headers.indexOf(name);

  for (var i = 1; i < data.length; i++) {
    var rowOrderId = String(data[i][col("注文ID")] || "").trim();
    var rowEmail = String(data[i][col("メールアドレス")] || "").trim().toLowerCase();

    if (rowOrderId === orderId && rowEmail === email.toLowerCase()) {
      var editsUsed = countEditsUsed(orderId);
      var plan = data[i][col("プラン")] || "lite";

      return jsonResponse({
        valid: true,
        companyName: data[i][col("会社名")] || "",
        template: data[i][col("テンプレート")] || "",
        plan: plan,
        siteUrl: data[i][col("サイトURL")] || "",
        editsUsed: editsUsed,
        status: data[i][col("ステータス")] || "",
        industry: data[i][col("業種")] || "",
        phone: data[i][col("電話番号")] || "",
        domain: data[i][col("ドメイン")] || "",
        stripeCustomerId: data[i][col("Stripe顧客ID")] || "",
        stripeSubscriptionId: data[i][col("StripeサブスクID")] || "",
        repoName: data[i][col("リポ名")] || "",
        createdAt: data[i][col("日時")] || "",
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

  var count = 0;
  var now = new Date();
  var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colOrderId]) === orderId) {
      var editDate = new Date(data[i][0]);
      if (editDate >= monthStart) {
        count++;
      }
    }
  }
  return count;
}

// ━━━━━━━━━━━━━━━━━━━━
// 編集リクエスト保存
// ━━━━━━━━━━━━━━━━━━━━

function saveEditRequest(orderId, email, companyName, changesJson, requests) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(EDIT_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(EDIT_SHEET_NAME);
    sheet.appendRow(["日時", "注文ID", "会社名", "メール", "変更タイプ", "変更内容", "備考", "ステータス", "スコア"]);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
  }

  // 変更タイプの自動判定
  var changeType = "その他";
  try {
    var changes = JSON.parse(changesJson || "{}");
    if (changes.type) changeType = changes.type;
  } catch(e) {}

  sheet.appendRow([
    new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    orderId || "",
    companyName || "",
    email || "",
    changeType,
    changesJson || "{}",
    requests || "",
    "未処理",
    "",
  ]);

  GmailApp.sendEmail(
    "ando.lyo.ai@gmail.com",
    "【しくみや】編集リクエスト: " + (companyName || orderId),
    "編集リクエストが届きました。\n\n注文ID: " + orderId + "\n会社名: " + (companyName || "不明") + "\nメール: " + (email || "不明") + "\n変更タイプ: " + changeType + "\n変更内容: " + (changesJson || "{}") + "\n備考: " + (requests || "なし"),
    { name: "しくみや自動通知" }
  );

  return jsonResponse({ success: true });
}

// ━━━━━━━━━━━━━━━━━━━━
// メール①: 決済直後
// ━━━━━━━━━━━━━━━━━━━━

function sendCompletionEmail(data) {
  const email = data.email;
  if (!email) return;

  const companyName = data.company_name || "お客様";
  const orderId = data.order_id || "";
  const planNames = { lite: "おまかせ", middle: "まるっとおまかせ", premium: "ぜんぶおまかせ" };
  const plan = planNames[data.plan] || data.plan || "おまかせ";

  const subject = `【しくみや】ご注文ありがとうございます — ${companyName}様`;

  const body = `${companyName} 様

この度は「しくみや」をご利用いただき、ありがとうございます。
お支払いを確認いたしました。

ただいまより、ホームページの制作を開始します。

━━━━━━━━━━━━━━━━━━━━
■ ご注文内容
━━━━━━━━━━━━━━━━━━━━
注文ID: ${orderId}
プラン: ${plan}プラン
テンプレート: ${data.template || "未選択"}

━━━━━━━━━━━━━━━━━━━━
■ 今後の流れ
━━━━━━━━━━━━━━━━━━━━
1. 現在、サイトを制作中です（最短翌日に完成します）
2. 完成次第、サイトURLを記載した完成メールをお届けします
3. 完成後は会員ページからサイトの編集をご依頼いただけます

ご不明な点がございましたら、お気軽にご連絡ください。

━━━━━━━━━━━━━━━━━━━━
しくみや by Lyo Vision
https://lyo-vision.com
メール: ando.lyo.ai@gmail.com
━━━━━━━━━━━━━━━━━━━━`;

  GmailApp.sendEmail(email, subject, body, {
    name: "しくみや by Lyo Vision",
    replyTo: "ando.lyo.ai@gmail.com",
  });
}

// ━━━━━━━━━━━━━━━━━━━━
// メール②: サイト完成後
// ━━━━━━━━━━━━━━━━━━━━

function sendSiteCompletionEmail(orderId, email, companyName, siteUrl, plan) {
  if (!email) return jsonResponse({ success: false, error: "email required" });

  companyName = companyName || "お客様";
  const planNames = { lite: "おまかせ", middle: "まるっとおまかせ", premium: "ぜんぶおまかせ" };
  const planName = (planNames[plan] || plan || "おまかせ") + "プラン";

  const editLimits = { lite: "月1回", middle: "月3回", premium: "無制限" };
  const editLimit = editLimits[plan] || "月1回";

  const subject = `【しくみや】ホームページが完成しました！ — ${companyName}様`;

  const body = `${companyName} 様

お待たせいたしました！
ホームページが完成しました。

━━━━━━━━━━━━━━━━━━━━
■ あなたのホームページ
━━━━━━━━━━━━━━━━━━━━
${siteUrl}

上記URLをクリックして、ぜひご確認ください。
名刺やチラシにURLを載せれば、すぐにお客様にお見せできます。

━━━━━━━━━━━━━━━━━━━━
■ 管理ページ
━━━━━━━━━━━━━━━━━━━━
サイトの編集依頼はこちらから:
https://lyo-vision.com/member

ログイン情報:
- 注文ID: ${orderId}
- メールアドレス: ${email}

${planName}では${editLimit}まで編集依頼を送れます。

━━━━━━━━━━━━━━━━━━━━
しくみや by Lyo Vision
https://lyo-vision.com
メール: ando.lyo.ai@gmail.com
━━━━━━━━━━━━━━━━━━━━`;

  GmailApp.sendEmail(email, subject, body, {
    name: "しくみや by Lyo Vision",
    replyTo: "ando.lyo.ai@gmail.com",
  });

  GmailApp.sendEmail(
    "ando.lyo.ai@gmail.com",
    `【しくみや】サイト完成: ${companyName}様`,
    `サイトが完成しました。\n\n会社名: ${companyName}\nサイトURL: ${siteUrl}\nプラン: ${planName}\nメール: ${email}`,
    { name: "しくみや自動通知" }
  );

  return jsonResponse({ success: true });
}

// ━━━━━━━━━━━━━━━━━━━━
// スプレッドシート記録
// ━━━━━━━━━━━━━━━━━━━━

function logToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // 固定フィールド
  const fixedFields = [
    { key: "_timestamp", label: "日時" },
    { key: "order_id", label: "注文ID" },
    { key: "company_name", label: "会社名" },
    { key: "email", label: "メールアドレス" },
    { key: "phone", label: "電話番号" },
    { key: "industry", label: "業種" },
    { key: "plan", label: "プラン" },
    { key: "template", label: "テンプレート" },
    { key: "site_url", label: "サイトURL" },
    { key: "domain", label: "ドメイン" },
    { key: "stripe_customer_id", label: "Stripe顧客ID" },
    { key: "stripe_subscription_id", label: "StripeサブスクID" },
    { key: "_repo_name", label: "リポ名" },
    { key: "_status", label: "ステータス" },
  ];
  const fixedKeys = fixedFields.map(f => f.key);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(fixedFields.map(f => f.label));
    sheet.getRange(1, 1, 1, fixedFields.length).setFontWeight("bold");
  }

  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);

  const keyToLabel = {
    company_name: "会社名", email: "メールアドレス", phone: "電話番号",
    industry: "業種", plan: "プラン", template: "テンプレート",
    site_url: "サイトURL", domain: "ドメイン", order_id: "注文ID",
    stripe_customer_id: "Stripe顧客ID", stripe_subscription_id: "StripeサブスクID",
    ceo: "代表者", bio: "紹介文", tagline: "キャッチコピー",
    address: "住所", created_at: "申込日時", amount_total: "決済金額",
  };

  const skipKeys = ["_timestamp", "_status", "_repo_name"];
  const allDataKeys = Object.keys(data).filter(k => !skipKeys.includes(k));

  for (const key of allDataKeys) {
    if (fixedKeys.includes(key)) continue;
    const label = keyToLabel[key] || key;
    if (!headers.includes(label)) {
      const newCol = headers.length + 1;
      sheet.getRange(1, newCol).setValue(label).setFontWeight("bold");
      headers.push(label);
    }
  }

  // データ行構築
  const row = [];
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header === "日時") {
      row.push(new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
    } else if (header === "ステータス") {
      row.push("制作中");
    } else if (header === "リポ名") {
      const slug = (data.company_name || "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();
      row.push(slug ? "shikumiya-" + slug : "");
    } else {
      const key = Object.entries(keyToLabel).find(([k, v]) => v === header)?.[0];
      if (key) {
        const val = data[key];
        row.push(Array.isArray(val) ? val.join(", ") : (val || ""));
      } else {
        const fixedField = fixedFields.find(f => f.label === header);
        if (fixedField && !["_timestamp", "_status", "_repo_name"].includes(fixedField.key)) {
          row.push(data[fixedField.key] || "");
        } else {
          row.push("");
        }
      }
    }
  }

  sheet.appendRow(row);
}
