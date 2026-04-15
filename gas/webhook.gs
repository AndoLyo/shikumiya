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

// プラン名マッピング（旧ID + 新ID 両対応）
const PLAN_NAMES = {
  otameshi: "おためし",
  omakase: "おまかせ",
  "omakase-pro": "おまかせプロ",
  // 旧ID互換
  lite: "おためし",
  middle: "おまかせ",
  premium: "おまかせプロ",
};

const PLAN_EDIT_LIMITS = {
  otameshi: "0回（手動編集のみ）",
  omakase: "月3回",
  "omakase-pro": "無制限",
  lite: "0回（手動編集のみ）",
  middle: "月3回",
  premium: "無制限",
};

const SITE_URL = "https://shikumiya.vercel.app";

// ━━━━━━━━━━━━━━━━━━━━
// POST: Webhookからの注文受信
// ━━━━━━━━━━━━━━━━━━━━

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.action === "update_status") {
      return updateOrderStatus(data.row, data.status);
    }

    // 1. スプレッドシートに記録
    logToSheet(data);

    // 2. メール送信（プランに応じて分岐）
    var plan = String(data.plan || "otameshi");
    var siteUrl = data.site_url || "";
    var status = data._status || "制作中";

    if (status === "公開中" && siteUrl) {
      // サイト完成済み（無料プランの即時生成）→ 完成メールを送る
      sendSiteReadyEmail(data);
    } else {
      // 制作中 → 受付メールを送る
      sendOrderReceivedEmail(data);
    }

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
    var action = e.parameter.action || "pending";

    if (action === "pending") {
      return getPendingOrders();
    }

    if (action === "complete") {
      var row = parseInt(e.parameter.row);
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
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ orders: [] });

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var orders = [];

  for (var i = 1; i < data.length; i++) {
    var statusCol = headers.indexOf("ステータス");
    var status = data[i][statusCol];
    if (status === "制作中") {
      var order = {};
      headers.forEach(function(h, j) { order[h] = data[i][j]; });
      order._row = i + 1;
      orders.push(order);
    }
  }

  return jsonResponse({ orders: orders });
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
        plan: String(data[i][col("プラン")] || "otameshi"),
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
      plan: String(data[i][col("プラン")] || "otameshi"),
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
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ success: false, error: "Sheet not found" });

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = headers.indexOf("ステータス") + 1;
  if (statusCol > 0) sheet.getRange(row, statusCol).setValue(status);
  return jsonResponse({ success: true, row: row, status: status });
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

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ valid: false, error: "Sheet not found" });

  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var col = function(name) { return headers.indexOf(name); };

  for (var i = 1; i < data.length; i++) {
    var rowOrderId = String(data[i][col("注文ID")] || "").trim();
    var rowEmail = String(data[i][col("メールアドレス")] || "").trim().toLowerCase();

    if (rowOrderId === orderId && rowEmail === email.toLowerCase()) {
      var editsUsed = countEditsUsed(orderId);
      var plan = data[i][col("プラン")] || "otameshi";

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
    "編集リクエストが届きました。\n\n注文ID: " + orderId + "\nユーザー名: " + (companyName || "不明") + "\nメール: " + (email || "不明") + "\n変更タイプ: " + changeType + "\n変更内容: " + (changesJson || "{}") + "\n備考: " + (requests || "なし"),
    { name: "しくみや自動通知" }
  );

  return jsonResponse({ success: true });
}

// ━━━━━━━━━━━━━━━━━━━━
// メール①: 注文受付（有料プラン・制作中の場合）
// ━━━━━━━━━━━━━━━━━━━━

function sendOrderReceivedEmail(data) {
  var email = data.email;
  if (!email) return;

  var userName = data.company_name || "お客様";
  var orderId = data.order_id || "";
  var planName = PLAN_NAMES[data.plan] || data.plan || "おためし";

  var subject = "【しくみや】ご登録ありがとうございます — " + userName + "様";

  var body = userName + " 様\n\n" +
    "この度は「しくみや」をご利用いただき、ありがとうございます。\n\n" +
    "ただいまサイトを準備しています。\n\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "■ ご登録内容\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "注文ID: " + orderId + "\n" +
    "プラン: " + planName + "プラン\n" +
    "テンプレート: " + (data.template || "未選択") + "\n\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "■ 今後の流れ\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "1. サイトの準備が完了次第、完成メールをお届けします\n" +
    "2. 完成後は会員ページからサイトの編集ができます\n\n" +
    "会員ページ: " + SITE_URL + "/member\n\n" +
    "ご不明な点がございましたら、お気軽にご連絡ください。\n\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "しくみや\n" +
    SITE_URL + "\n" +
    "メール: ando.lyo.ai@gmail.com\n" +
    "━━━━━━━━━━━━━━━━━━━━";

  GmailApp.sendEmail(email, subject, body, {
    name: "しくみや",
    replyTo: "ando.lyo.ai@gmail.com",
  });
}

// ━━━━━━━━━━━━━━━━━━━━
// メール②: サイト完成（即時生成の無料プラン含む）
// ━━━━━━━━━━━━━━━━━━━━

function sendSiteReadyEmail(data) {
  var email = data.email;
  if (!email) return;

  var userName = data.company_name || "お客様";
  var orderId = data.order_id || "";
  var siteUrl = data.site_url || "";
  var plan = data.plan || "otameshi";
  var planName = PLAN_NAMES[plan] || plan || "おためし";
  var editLimit = PLAN_EDIT_LIMITS[plan] || "0回";

  var subject = "【しくみや】サイトが完成しました！ — " + userName + "様";

  var body = userName + " 様\n\n" +
    "サイトが完成しました！\n\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "■ あなたのサイト\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    siteUrl + "\n\n" +
    "上のURLをクリックして、ぜひご確認ください。\n\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "■ 会員ページ\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "サイトの編集はこちらから:\n" +
    SITE_URL + "/member\n\n" +
    "Googleアカウントでログインしてください。\n\n" +
    planName + "プランでのAI編集: " + editLimit + "\n\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "しくみや\n" +
    SITE_URL + "\n" +
    "メール: ando.lyo.ai@gmail.com\n" +
    "━━━━━━━━━━━━━━━━━━━━";

  GmailApp.sendEmail(email, subject, body, {
    name: "しくみや",
    replyTo: "ando.lyo.ai@gmail.com",
  });

  // 管理者通知
  GmailApp.sendEmail(
    "ando.lyo.ai@gmail.com",
    "【しくみや】サイト完成: " + userName + "様",
    "サイトが完成しました。\n\nユーザー名: " + userName + "\nサイトURL: " + siteUrl + "\nプラン: " + planName + "プラン\nメール: " + email,
    { name: "しくみや自動通知" }
  );
}

// ━━━━━━━━━━━━━━━━━━━━
// メール③: 手動で完成メールを送る（GET API用）
// ━━━━━━━━━━━━━━━━━━━━

function sendSiteCompletionEmail(orderId, email, companyName, siteUrl, plan) {
  if (!email) return jsonResponse({ success: false, error: "email required" });

  sendSiteReadyEmail({
    order_id: orderId,
    email: email,
    company_name: companyName,
    site_url: siteUrl,
    plan: plan || "otameshi",
  });

  return jsonResponse({ success: true });
}

// ━━━━━━━━━━━━━━━━━━━━
// スプレッドシート記録
// ━━━━━━━━━━━━━━━━━━━━

function logToSheet(data) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  // 固定フィールド
  var fixedFields = [
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
  var fixedKeys = fixedFields.map(function(f) { return f.key; });

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(fixedFields.map(function(f) { return f.label; }));
    sheet.getRange(1, 1, 1, fixedFields.length).setFontWeight("bold");
  }

  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);

  var keyToLabel = {
    company_name: "会社名", email: "メールアドレス", phone: "電話番号",
    industry: "業種", plan: "プラン", template: "テンプレート",
    site_url: "サイトURL", domain: "ドメイン", order_id: "注文ID",
    stripe_customer_id: "Stripe顧客ID", stripe_subscription_id: "StripeサブスクID",
    ceo: "代表者", bio: "紹介文", tagline: "キャッチコピー",
    address: "住所", created_at: "申込日時", amount_total: "決済金額",
  };

  var skipKeys = ["_timestamp", "_status", "_repo_name"];
  var allDataKeys = Object.keys(data).filter(function(k) { return skipKeys.indexOf(k) === -1; });

  for (var ki = 0; ki < allDataKeys.length; ki++) {
    var key = allDataKeys[ki];
    if (fixedKeys.indexOf(key) >= 0) continue;
    var label = keyToLabel[key] || key;
    if (headers.indexOf(label) === -1) {
      var newCol = headers.length + 1;
      sheet.getRange(1, newCol).setValue(label).setFontWeight("bold");
      headers.push(label);
    }
  }

  // データ行構築
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    if (header === "日時") {
      row.push(new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
    } else if (header === "ステータス") {
      row.push(data._status || "制作中");
    } else if (header === "リポ名") {
      var repoName = data._repo_name || "";
      if (!repoName) {
        var slug = (data.company_name || "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();
        repoName = slug ? "shikumiya-" + slug : "";
      }
      row.push(repoName);
    } else {
      var foundKey = null;
      var entries = Object.entries(keyToLabel);
      for (var ei = 0; ei < entries.length; ei++) {
        if (entries[ei][1] === header) { foundKey = entries[ei][0]; break; }
      }
      if (foundKey) {
        var val = data[foundKey];
        row.push(Array.isArray(val) ? val.join(", ") : (val || ""));
      } else {
        var fixedField = null;
        for (var fi = 0; fi < fixedFields.length; fi++) {
          if (fixedFields[fi].label === header) { fixedField = fixedFields[fi]; break; }
        }
        if (fixedField && skipKeys.indexOf(fixedField.key) === -1) {
          row.push(data[fixedField.key] || "");
        } else {
          row.push("");
        }
      }
    }
  }

  sheet.appendRow(row);
}
