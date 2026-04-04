#!/usr/bin/env node
/**
 * しくみや — ¥980プラン用：機械的なテキスト・色・画像置換スクリプト
 *
 * AIを使わず、フォーム入力内容をコンポーネントに機械的に反映する。
 * ¥2,980プランの場合はこの後にClaude Code CLIで追加カスタマイズを行う。
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * @param {string} siteDir - サイトリポジトリのパス
 * @param {object} order - スプレッドシートの注文データ
 */
export function applyOrder(siteDir, order) {
  const artistName = order["アーティスト名"] || "Your Name";
  const catchcopy = order["キャッチコピー"] || "";
  const bio = order["自己紹介"] || "";
  const motto = order["モットー"] || "";
  const email = order["メールアドレス"] || "";
  const snsX = order["X"] || "";
  const snsInstagram = order["Instagram"] || "";
  const snsPixiv = order["Pixiv"] || "";
  const snsOther = order["その他SNS"] || "";

  console.log(`   📝 テキスト・色・画像を反映中...`);

  // 1. 画像ファイルを確認して枚数を取得
  const imagesDir = join(siteDir, "public/images");
  const workImages = existsSync(imagesDir)
    ? readdirSync(imagesDir).filter((f) => f.startsWith("work_") && (f.endsWith(".webp") || f.endsWith(".png") || f.endsWith(".jpg")))
    : [];
  workImages.sort();
  console.log(`   🖼️ 作品画像: ${workImages.length}枚`);

  // 2. src/ 配下の全ファイルを処理
  const srcDir = join(siteDir, "src");
  if (!existsSync(srcDir)) {
    console.log(`   ❌ src/ フォルダが見つかりません`);
    return;
  }

  processDirectory(srcDir, {
    artistName,
    catchcopy,
    bio,
    motto,
    email,
    snsX,
    snsInstagram,
    snsPixiv,
    snsOther,
    workImages,
  });

  console.log(`   ✅ テキスト・色・画像の反映完了`);
}

function processDirectory(dir, data) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath, data);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts") || entry.name.endsWith(".css")) {
      processFile(fullPath, data);
    }
  }
}

function processFile(filePath, data) {
  let content = readFileSync(filePath, "utf-8");
  const original = content;

  // ━━━━━━━━━━━━━━━━━━━━
  // テキスト置換
  // ━━━━━━━━━━━━━━━━━━━━

  // アーティスト名（よくあるプレースホルダーを全パターン置換）
  const namePatterns = [
    "Your Name", "YOUR NAME", "your name",
    "YUKI", "Yuki", "YUKI COMICS",
    "Artist Name", "ARTIST NAME",
    "アーティスト名",
  ];
  for (const pattern of namePatterns) {
    content = content.replaceAll(`"${pattern}"`, `"${data.artistName}"`);
    content = content.replaceAll(`'${pattern}'`, `'${data.artistName}'`);
    content = content.replaceAll(`\`${pattern}\``, `\`${data.artistName}\``);
  }

  // メールアドレス
  if (data.email) {
    content = content.replaceAll("hello@example.com", data.email);
    content = content.replaceAll("your-email@example.com", data.email);
  }

  // キャッチコピー（Heroのメインテキスト）
  // これはテンプレートごとに違うので、特定のプレースホルダーがあれば置換
  if (data.catchcopy) {
    // 一般的なプレースホルダー
    const catchPatterns = [
      "心地よいデザインを，あなたに。",
      "AIで、世界観を紡ぐ。",
      "Creating Worlds with AI",
    ];
    for (const pattern of catchPatterns) {
      content = content.replaceAll(pattern, data.catchcopy);
    }
  }

  // 自己紹介文
  if (data.bio) {
    const bioPatterns = [
      "ここにあなたの自己紹介を書いてください。どんなアーティストで、何を作っているのか。",
      "AIアートとの出会い、こだわり、使用ツールなど、あなたのストーリーを伝えましょう。",
    ];
    for (const pattern of bioPatterns) {
      content = content.replaceAll(pattern, data.bio);
    }
  }

  // モットー
  if (data.motto) {
    content = content.replaceAll("あなたの好きな言葉やモットーをここに。", data.motto);
  }

  // copyright年号 + アーティスト名
  const currentYear = new Date().getFullYear();
  content = content.replace(
    /©\s*\d{4}\s*(Your Name|YUKI|Artist Name)/g,
    `© ${currentYear} ${data.artistName}`,
  );
  content = content.replace(
    /©\s*\$\{new Date\(\)\.getFullYear\(\)\}\s*(Your Name|YUKI)/g,
    `© \${new Date().getFullYear()} ${data.artistName}`,
  );

  // ━━━━━━━━━━━━━━━━━━━━
  // SNSリンク
  // ━━━━━━━━━━━━━━━━━━━━
  if (data.snsX) {
    content = content.replaceAll("https://x.com/your_handle", data.snsX);
    content = content.replaceAll("https://twitter.com/your_handle", data.snsX);
  }
  if (data.snsInstagram) {
    content = content.replaceAll("https://instagram.com/your_handle", data.snsInstagram);
    content = content.replaceAll("https://www.instagram.com/your_handle", data.snsInstagram);
  }
  if (data.snsPixiv) {
    content = content.replaceAll("https://pixiv.net/users/your_id", data.snsPixiv);
  }

  // ━━━━━━━━━━━━━━━━━━━━
  // Works配列の画像数を実際のファイル数に合わせる
  // ━━━━━━━━━━━━━━━━━━━━
  if (data.workImages.length > 0 && filePath.includes("Works") || filePath.includes("Gallery") || filePath.includes("page.tsx")) {
    content = adjustWorksArray(content, data.workImages);
  }

  // 変更があれば保存
  if (content !== original) {
    writeFileSync(filePath, content, "utf-8");
    const relPath = filePath.split("src")[1] || filePath;
    console.log(`   ✏️ 更新: src${relPath}`);
  }
}

/**
 * Works/Gallery配列の要素数を実際の画像ファイル数に合わせる
 */
function adjustWorksArray(content, workImages) {
  // パターン: works = [ { ... }, { ... } ] のような配列を検出
  // 画像パスを実際のファイルに合わせる
  for (let i = 0; i < workImages.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    const fileName = workImages[i];
    // 既存の画像パスを新しいファイル名に置換
    const oldPatterns = [
      `/portfolio/work_${num}.webp`,
      `/images/work_${num}.webp`,
    ];
    for (const old of oldPatterns) {
      content = content.replaceAll(old, `/images/${fileName}`);
    }
  }

  return content;
}
