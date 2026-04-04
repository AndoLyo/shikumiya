#!/usr/bin/env node
/**
 * しくみや — 注文自動処理スクリプト
 *
 * GASのスプレッドシートを定期的にチェックし、
 * 未処理の注文があればClaude Code CLIで自動処理する。
 *
 * 使い方:
 *   node scripts/order-watcher.mjs
 *
 * 環境変数:
 *   GAS_URL — GAS Web AppのURL（doGet対応版）
 *   CHECK_INTERVAL — チェック間隔（ミリ秒、デフォルト: 60000 = 1分）
 */

import { execSync, spawn } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const GAS_URL = process.env.GAS_URL || "";
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL || "60000");
const WORK_DIR = join(process.cwd(), "tmp_orders");

if (!GAS_URL) {
  console.error("❌ GAS_URL が設定されていません");
  console.error("   export GAS_URL=https://script.google.com/macros/s/XXXX/exec");
  process.exit(1);
}

// ━━━━━━━━━━━━━━━━━━━━
// メイン処理
// ━━━━━━━━━━━━━━━━━━━━

async function checkOrders() {
  try {
    const res = await fetch(`${GAS_URL}?action=pending`);
    const data = await res.json();

    if (!data.orders || data.orders.length === 0) {
      return;
    }

    console.log(`📦 未処理の注文が ${data.orders.length} 件あります`);

    for (const order of data.orders) {
      await processOrder(order);
    }
  } catch (err) {
    console.error("❌ チェックエラー:", err.message);
  }
}

async function processOrder(order) {
  const artistName = order["アーティスト名"] || "unknown";
  const template = order["テンプレート"] || "ai-art-portfolio";
  const siteUrl = order["サイトURL"] || "";
  const requests = order["要望"] || "";
  const bio = order["自己紹介"] || "";
  const catchcopy = order["キャッチコピー"] || "";
  const motto = order["モットー"] || "";
  const row = order._row;

  // サイトURLからリポジトリ名を抽出
  const repoName = siteUrl.replace("https://", "").replace(".vercel.app", "");
  if (!repoName) {
    console.error(`❌ サイトURL不明: ${artistName}`);
    return;
  }

  console.log(`\n🔧 処理開始: ${artistName} (${repoName})`);
  console.log(`   テンプレート: ${template}`);
  console.log(`   要望: ${requests || "なし"}`);

  // 作業ディレクトリ
  if (!existsSync(WORK_DIR)) mkdirSync(WORK_DIR, { recursive: true });
  const orderDir = join(WORK_DIR, repoName);

  try {
    // 1. リポジトリをクローン
    if (existsSync(orderDir)) {
      execSync(`cd "${orderDir}" && git pull`, { stdio: "pipe" });
    } else {
      execSync(
        `git clone https://github.com/AndoLyo/${repoName}.git "${orderDir}"`,
        { stdio: "pipe" },
      );
    }

    // 2. Claude Code CLIで要望を反映
    const prompt = buildPrompt(order);

    console.log(`   🤖 Claude Code CLI 実行中...`);

    // プロンプトをファイルに保存
    const promptFile = join(orderDir, ".claude-prompt.md");
    writeFileSync(promptFile, prompt);

    // Claude Code CLI を実行（--print モードで非対話的に）
    const claude = spawn("claude", ["--print", "-p", prompt], {
      cwd: orderDir,
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });

    let output = "";
    claude.stdout.on("data", (d) => {
      output += d.toString();
    });
    claude.stderr.on("data", (d) => {
      // stderrは無視（進捗表示等）
    });

    await new Promise((resolve, reject) => {
      claude.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Claude Code exited with code ${code}`));
      });
      claude.on("error", reject);
    });

    // 3. コミット & プッシュ
    try {
      execSync(
        `cd "${orderDir}" && git add -A && git commit -m "カスタマイズ: ${artistName}様の要望を反映" && git push`,
        { stdio: "pipe" },
      );
      console.log(`   ✅ 変更をpushしました`);
    } catch {
      console.log(`   ℹ️ 変更なし（要望が既にconfig反映済みの可能性）`);
    }

    // 4. GASのステータスを「完了」に更新
    await fetch(`${GAS_URL}?action=complete&row=${row}`);
    console.log(`   ✅ 完了: ${artistName}`);
  } catch (err) {
    console.error(`   ❌ 処理失敗: ${err.message}`);
    // 失敗してもステータスは更新しない（次回リトライされる）
  }
}

// ━━━━━━━━━━━━━━━━━━━━
// Claude Code CLI用プロンプト生成
// ━━━━━━━━━━━━━━━━━━━━

function buildPrompt(order) {
  const artistName = order["アーティスト名"] || "";
  const template = order["テンプレート"] || "";
  const requests = order["要望"] || "";
  const bio = order["自己紹介"] || "";
  const catchcopy = order["キャッチコピー"] || "";
  const motto = order["モットー"] || "";
  const email = order["メールアドレス"] || "";
  const snsX = order["X"] || "";
  const snsInstagram = order["Instagram"] || "";
  const snsPixiv = order["Pixiv"] || "";

  return `あなたはWebサイト制作の専門家です。
このリポジトリは「しくみや」のサービスで顧客用に自動生成されたポートフォリオサイトです。
顧客がフォームに入力した情報を、サイトのコードに反映してください。

━━━━━━━━━━━━━━━━━━━━
■ 顧客の入力データ（これをサイトに反映する）
━━━━━━━━━━━━━━━━━━━━
アーティスト名: ${artistName}
キャッチコピー: ${catchcopy || "（未入力）"}
自己紹介文: ${bio || "（未入力）"}
好きな言葉/モットー: ${motto || "（未入力）"}
メールアドレス: ${email}
X (Twitter): ${snsX || "（未入力）"}
Instagram: ${snsInstagram || "（未入力）"}
Pixiv: ${snsPixiv || "（未入力）"}

■ 顧客の要望
${requests || "特になし"}

━━━━━━━━━━━━━━━━━━━━
■ やること（この順番で必ず全部やる）
━━━━━━━━━━━━━━━━━━━━

1. まず src/app/page.tsx と src/components/ の全ファイルを読んで、現在のコードを把握する

2. 全コンポーネントのハードコードされたテキストを顧客データに置き換える:
   - 「Your Name」「YUKI」「アーティスト名」等 → 「${artistName}」
   - Hero/トップのキャッチコピー → 「${catchcopy || artistName + "の作品"}」
   - サブタイトル/肩書き → そのまま残すか、適切に調整
   - About/自己紹介のテキスト → 「${bio || ""}」
   - モットー/引用文 → 「${motto || ""}」
   - メールアドレス → 「${email}」
   - SNSリンクのURL → 入力されたものだけ表示、未入力のSNSは非表示にする
   - copyright の年号とアーティスト名を更新

3. 未入力の項目は空にするか、そのセクション自体を非表示にする（ダミーテキストを残さない）

4. 要望がある場合:
   - 「白基調」「明るい」→ 背景色・テキスト色を変更
   - 「青」「ピンク」等の色指定 → アクセントカラーを変更
   - 参考サイトURL → そのサイトの雰囲気を参考にデザイン調整
   - その他の要望 → 可能な範囲で対応

5. site.config.ts があれば、その内容も顧客データに合わせて更新する

━━━━━━━━━━━━━━━━━━━━
■ 絶対にやってはいけないこと
━━━━━━━━━━━━━━━━━━━━
- テンプレートの基本構造（レイアウト・アニメーション）を壊さない
- レスポンシブ対応を壊さない
- 画像ファイルを変更しない（public/images/配下はそのまま）
- node_modules や package-lock.json を変更しない
- ダミーテキスト（Lorem ipsum等）を残さない
- 「Your Name」「hello@example.com」等のプレースホルダーを残さない

━━━━━━━━━━━━━━━━━━━━
■ 完了条件
━━━━━━━━━━━━━━━━━━━━
- サイト内のすべてのテキストが顧客データに置き換わっている
- プレースホルダーや仮テキストが1つも残っていない
- 顧客の要望が反映されている
- サイトがビルドエラーなく動作する`;
}

// ━━━━━━━━━━━━━━━━━━━━
// 常駐ループ
// ━━━━━━━━━━━━━━━━━━━━

console.log("🚀 しくみや 注文自動処理スクリプト 起動");
console.log(`   GAS URL: ${GAS_URL.slice(0, 50)}...`);
console.log(`   チェック間隔: ${CHECK_INTERVAL / 1000}秒`);
console.log(`   Ctrl+C で停止\n`);

// 初回チェック
checkOrders();

// 定期チェック
setInterval(checkOrders, CHECK_INTERVAL);
