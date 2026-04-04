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

    // プロンプトをファイルに保存してファイルから読ませる
    const promptFile = join(orderDir, ".claude-prompt.md");
    writeFileSync(promptFile, prompt);

    // Claude Code CLI を実行（権限チェックスキップ + print mode）
    const claude = spawn("bash", ["-c", `cat "${promptFile.replace(/\\/g, "/")}" | claude -p --dangerously-skip-permissions`], {
      cwd: orderDir,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, CLAUDE_CODE_GIT_BASH_PATH: "E:\\Git\\bin\\bash.exe" },
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

    // 5. 完成メールを顧客に送信
    const customerEmail = order["メールアドレス"] || "";
    const plan = order["プラン"] || "template";
    if (customerEmail && siteUrl) {
      const params = new URLSearchParams({
        action: "send_completion",
        orderId: order["注文ID"] || "",
        email: customerEmail,
        artistName,
        siteUrl: `https://${siteUrl}.vercel.app`,
        plan,
      });
      await fetch(`${GAS_URL}?${params.toString()}`);
      console.log(`   📧 完成メール送信: ${customerEmail}`);
    }

    console.log(`   ✅ 完了: ${artistName}`);
  } catch (err) {
    console.error(`   ❌ 処理失敗: ${err.message}`);
    // リポが見つからない場合はスキップ（古いテスト注文等）
    if (err.message.includes("Repository not found") || err.message.includes("not found")) {
      await fetch(`${GAS_URL}?action=complete&row=${row}`);
      console.log(`   ⏭️ リポ不在のためスキップ（ステータスを完了に変更）`);
    }
    // Claude CLIエラーは次回リトライ
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

  return `あなたはWebサイトの文言・色の調整担当です。
このリポジトリは顧客用のポートフォリオサイトです。
顧客データに合わせてテキストと色を差し替えてください。

【最重要ルール】テンプレートの構造は絶対に壊さない
- コンポーネントの追加・削除・構成変更は禁止
- レイアウト・アニメーション・セクション順序はそのまま
- importの変更禁止
- 新しいファイルの作成禁止
- 既存の機能を削除しない
変えていいのは「テキストの中身」「CSS変数の色の値」「SNSリンクの表示/非表示」だけ。

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

■ 顧客の要望
${requests || "特になし"}
※ 要望は「テキスト変更」「色変更」の範囲で対応する。
※ レイアウト変更・コンポーネント追加/削除・構成変更の要望は無視する。
※ 色の要望（「白基調にして」「ダークに」等）はpage.tsxのCSS変数で対応する。

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

【STEP 6】要望の反映（色とテキストの範囲のみ）
${requests ? `顧客の要望:「${requests}」

対応できること（これだけ）:
- 色の指示 → page.tsxのCSS変数（--color-bg, --color-text, --color-accent等）の値を変更
- テキストの追加・変更 → 既存コンポーネント内のテキストを書き換え

対応しないこと（構造に関わるため無視する）:
- レイアウト変更、セクション追加/削除
- 新しいアニメーション追加
- パーティクル追加、グロー追加等の新機能
- ナビゲーション構造の変更
- コンポーネントの書き換え
これらは後日Lyoが手動で対応する。` : "要望なし。"}

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
- コンポーネントの追加・削除・構成変更は絶対禁止
- importの変更禁止
- 新しいファイルの作成禁止
- 既存の機能・セクション・アニメーションを削除しない
- レイアウト構造（flex, grid, 幅、高さ等）を変更しない
- 画像ファイル自体を変更・削除しない
- 画像のパス（src属性）を変更しない
- node_modules, package-lock.json, .gitignore を変更しない
- npx next build や npm run build は実行しない
- .next/ フォルダは触らない
- 変更していいのは: テキスト文字列、CSS変数の色の値、SNSリンクの条件表示のみ`;
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
