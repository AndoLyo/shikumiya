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
  const snsOther = order["その他SNS"] || "";

  // 画像ファイル数を確認するための情報
  const imageCount = (() => {
    try {
      const files = execSync('ls public/images/work_*.webp 2>/dev/null | wc -l', { encoding: 'utf-8' }).trim();
      return parseInt(files) || 0;
    } catch { return 0; }
  })();

  // SNSの有無を整理
  const snsEntries = [];
  if (snsX) snsEntries.push(`X (Twitter): ${snsX}`);
  if (snsInstagram) snsEntries.push(`Instagram: ${snsInstagram}`);
  if (snsPixiv) snsEntries.push(`Pixiv: ${snsPixiv}`);
  if (snsOther) snsEntries.push(`その他: ${snsOther}`);

  return `あなたはプロのWebデザイナーです。
このリポジトリは「しくみや」のサービスで顧客用に自動生成されたポートフォリオサイトです。
顧客がフォームに入力した情報をもとに、この人だけのオリジナルサイトに仕上げてください。

━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 顧客データ
━━━━━━━━━━━━━━━━━━━━━━━━━━
アーティスト名: ${artistName}
キャッチコピー: ${catchcopy || "（未入力→アーティスト名を使って自然なコピーを作成）"}
自己紹介文: ${bio || "（未入力→セクション自体を削除または最小化）"}
好きな言葉/モットー: ${motto || "（未入力→引用セクションを削除）"}
メールアドレス: ${email || "（未入力→メール表示を削除）"}
アップロード画像数: ${imageCount}枚（public/images/ 配下）

SNSアカウント:
${snsEntries.length > 0 ? snsEntries.join("\n") : "（すべて未入力→SNSリンクセクションを完全に削除）"}

■ 顧客の要望（最優先で対応すること）
${requests || "特になし"}

━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 作業手順
━━━━━━━━━━━━━━━━━━━━━━━━━━

【STEP 1】全ファイルを読む
src/app/page.tsx と src/components/ の全.tsxファイルを読み、
現在ハードコードされている内容を把握する。

【STEP 2】テキストの置き換え
全コンポーネント内のハードコードされたテキストを顧客データに置き換える。
- アーティスト名（Hero、About、Footer、copyright等すべて）
- キャッチコピー（Heroセクションの大見出し）
- 自己紹介文（Aboutセクション）
- モットー/引用文（Aboutセクション内の引用ブロック）
- メールアドレス（Contactセクション）
- copyright（Footer）→ 「© ${new Date().getFullYear()} ${artistName}」

【STEP 3】SNSリンクの処理
顧客が入力したSNSだけを表示する。
${snsEntries.length === 0 ? "→ 全SNS未入力のため、SNSリンクのUI要素をすべて削除する。" : `→ 以下のSNSのみ表示: ${snsEntries.map(s => s.split(":")[0]).join(", ")}
→ 入力されていないSNS（アイコン・リンク・ラベル）はコードから完全に削除する。`}

【STEP 4】画像の調整
public/images/ にある画像ファイルを確認し、Works/Gallery配列の要素数を合わせる。
- 画像が${imageCount}枚ある → Works配列も${imageCount}個にする
- 配列の要素が画像より多い場合 → 余分な要素を削除
- 配列の要素が画像より少ない場合 → 画像ファイル名に合わせて追加
- グリッドのカラム数やレイアウトが画像数に合うよう調整（崩れないように）

【STEP 5】未入力項目の処理
「（未入力）」と記載された項目は、そのUI要素をコードから削除する。
- 自己紹介が未入力 → Aboutの本文段落を削除（セクション自体は残してもいい）
- モットーが未入力 → 引用ブロックを削除
- メールが未入力 → メールリンクを削除
- SNSが全部未入力 → SNSセクション全体を削除
ダミーテキスト・プレースホルダーは絶対に残さない。

【STEP 6】要望の反映
${requests ? `顧客の要望:「${requests}」

この要望を最優先で反映する。具体的には:
- 色の指示（白基調、青系、ピンク等）→ page.tsxのCSS変数やインラインスタイルを変更
- 参考サイトのURL → そのサイトのWebFetchで確認し、雰囲気を参考にする
- レイアウトの変更 → 可能な範囲で対応
- フォントの変更 → CSS変数やfont-family指定を変更
- その他のリクエスト → クリエイティブに解釈して実装

要望は「お客様の声」。期待を超える対応を心がける。` : "要望なし。デフォルトのまま。"}

【STEP 7】最終確認
- npx next build でビルドエラーがないことを確認
- プレースホルダー（Your Name, hello@example.com, Lorem ipsum等）がゼロ
- 顧客データがすべて反映されている
- レイアウトが崩れていない

━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 禁止事項
━━━━━━━━━━━━━━━━━━━━━━━━━━
- テンプレートの基本レイアウト・アニメーションを壊さない
- レスポンシブ対応を壊さない
- 画像ファイル自体を変更・削除しない
- node_modules, package-lock.json, .gitignore を変更しない
- 存在しない画像パスを参照しない`;
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
