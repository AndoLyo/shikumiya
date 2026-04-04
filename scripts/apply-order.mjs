#!/usr/bin/env node
/**
 * しくみや — 機械的処理スクリプト
 *
 * フォーム入力内容をテンプレートに機械的に反映する。AIは使わない。
 * 対象: テキスト、色、画像パス、セクション有効/無効、SNSリンク
 *
 * ¥980プラン: これだけで完了
 * ¥2,980プラン: これ + AIで要望反映
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * @param {string} siteDir - サイトリポジトリのパス
 * @param {object} order - スプレッドシートの注文データ
 */
export function applyOrder(siteDir, order) {
  const data = extractOrderData(order);

  console.log(`   📝 機械的処理を開始...`);

  // 1. 画像ファイルの確認
  const imagesDir = join(siteDir, "public/images");
  const workImages = existsSync(imagesDir)
    ? readdirSync(imagesDir)
        .filter((f) => f.startsWith("work_") && /\.(webp|png|jpg|jpeg)$/i.test(f))
        .sort()
    : [];
  console.log(`   🖼️ 作品画像: ${workImages.length}枚`);

  // 2. src/ 配下の全ファイルを処理
  const srcDir = join(siteDir, "src");
  if (!existsSync(srcDir)) {
    console.log(`   ❌ src/ フォルダが見つかりません`);
    return;
  }

  const allFiles = collectFiles(srcDir);
  let changedCount = 0;

  for (const filePath of allFiles) {
    const original = readFileSync(filePath, "utf-8");
    let content = original;

    // テキスト置換
    content = replaceArtistName(content, data.artistName);
    content = replaceEmail(content, data.email);
    content = replaceCatchcopy(content, data.catchcopy);
    content = replaceBio(content, data.bio);
    content = replaceMotto(content, data.motto);
    content = replaceSNS(content, data);
    content = replaceCopyright(content, data.artistName);

    // CSS変数の色変更（page.tsxのみ）
    if (filePath.endsWith("page.tsx") && filePath.includes("app")) {
      content = replaceColors(content, data);
    }

    // Works配列の画像数合わせ
    if (isWorksFile(filePath)) {
      content = adjustWorksImages(content, workImages);
    }

    if (content !== original) {
      writeFileSync(filePath, content, "utf-8");
      const relPath = filePath.split("src")[1] || filePath;
      console.log(`   ✏️ 更新: src${relPath}`);
      changedCount++;
    }
  }

  console.log(`   ✅ 機械的処理完了（${changedCount}ファイル更新）`);
}

// ━━━━━━━━━━━━━━━━━━━━
// データ抽出
// ━━━━━━━━━━━━━━━━━━━━

function extractOrderData(order) {
  return {
    artistName: order["アーティスト名"] || "Your Name",
    catchcopy: order["キャッチコピー"] || "",
    bio: order["自己紹介"] || "",
    motto: order["モットー"] || "",
    email: order["メールアドレス"] || "",
    snsX: order["X"] || "",
    snsInstagram: order["Instagram"] || "",
    snsPixiv: order["Pixiv"] || "",
    snsOther: order["その他SNS"] || "",
    colorPrimary: order["カラー_プライマリ"] || "",
    colorAccent: order["カラー_アクセント"] || "",
    colorBackground: order["カラー_背景"] || "",
  };
}

// ━━━━━━━━━━━━━━━━━━━━
// ファイル収集
// ━━━━━━━━━━━━━━━━━━━━

function collectFiles(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if (/\.(tsx|ts|css)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ━━━━━━━━━━━━━━━━━━━━
// テキスト置換
// ━━━━━━━━━━━━━━━━━━━━

function replaceArtistName(content, name) {
  if (!name || name === "Your Name") return content;

  const patterns = [
    "Your Name", "YOUR NAME", "your name",
    "YUKI", "Yuki", "YUKI COMICS", "Yuki Comics",
    "Artist Name", "ARTIST NAME", "artist name",
    "Your Portfolio", "YOUR PORTFOLIO",
    "アーティスト名", "あなたの名前",
  ];

  for (const p of patterns) {
    // 文字列リテラル内のみ置換（変数名は壊さない）
    content = content.replaceAll(`"${p}"`, `"${name}"`);
    content = content.replaceAll(`'${p}'`, `'${name}'`);
    content = content.replaceAll(`>${p}<`, `>${name}<`);
  }
  return content;
}

function replaceEmail(content, email) {
  if (!email) return content;
  const patterns = [
    "hello@example.com",
    "your-email@example.com",
    "email@example.com",
    "contact@example.com",
  ];
  for (const p of patterns) {
    content = content.replaceAll(p, email);
  }
  return content;
}

function replaceCatchcopy(content, catchcopy) {
  if (!catchcopy) return content;
  // テンプレートごとのデフォルトキャッチコピーを置換
  const patterns = [
    "心地よいデザインを，あなたに。",
    "AIで、世界観を紡ぐ。",
    "Creating Worlds with AI",
    "Digital Art Portfolio",
    "Welcome to my world",
    "ようこそ、私の世界へ",
  ];
  for (const p of patterns) {
    content = content.replaceAll(p, catchcopy);
  }
  return content;
}

function replaceBio(content, bio) {
  if (!bio) return content;
  const patterns = [
    "ここにあなたの自己紹介を書いてください。どんなアーティストで、何を作っているのか。",
    "AIアートとの出会い、こだわり、使用ツールなど、あなたのストーリーを伝えましょう。",
    "A passionate digital artist creating immersive worlds through AI-generated imagery.",
  ];
  for (const p of patterns) {
    content = content.replaceAll(p, bio);
  }
  return content;
}

function replaceMotto(content, motto) {
  if (!motto) return content;
  content = content.replaceAll("あなたの好きな言葉やモットーをここに。", motto);
  content = content.replaceAll("Your favorite quote here.", motto);
  return content;
}

function replaceSNS(content, data) {
  if (data.snsX) {
    content = content.replaceAll("https://x.com/your_handle", data.snsX);
    content = content.replaceAll("https://twitter.com/your_handle", data.snsX);
    content = content.replaceAll("https://x.com/test", data.snsX);
  }
  if (data.snsInstagram) {
    content = content.replaceAll("https://instagram.com/your_handle", data.snsInstagram);
    content = content.replaceAll("https://www.instagram.com/your_handle", data.snsInstagram);
  }
  if (data.snsPixiv) {
    content = content.replaceAll("https://pixiv.net/users/your_id", data.snsPixiv);
  }
  return content;
}

function replaceCopyright(content, name) {
  const year = new Date().getFullYear();
  // © 2024 Your Name → © 2026 ActualName
  content = content.replace(
    /©\s*\d{4}\s*[^.]*?\.\s*All rights reserved/g,
    `© ${year} ${name}. All rights reserved`,
  );
  return content;
}

// ━━━━━━━━━━━━━━━━━━━━
// 色変更
// ━━━━━━━━━━━━━━━━━━━━

function replaceColors(content, data) {
  // page.tsxのCSS変数を置換
  if (data.colorPrimary) {
    content = content.replace(
      /(--\w*(?:primary|accent-1|accent)["']?\s*:\s*["'])#[0-9a-fA-F]{3,8}/g,
      `$1${data.colorPrimary}`,
    );
  }
  if (data.colorBackground) {
    content = content.replace(
      /(--\w*(?:bg|background)["']?\s*:\s*["'])#[0-9a-fA-F]{3,8}/g,
      `$1${data.colorBackground}`,
    );
  }
  return content;
}

// ━━━━━━━━━━━━━━━━━━━━
// Works/Gallery 画像数合わせ
// ━━━━━━━━━━━━━━━━━━━━

function isWorksFile(filePath) {
  const name = filePath.toLowerCase();
  return name.includes("works") || name.includes("gallery") || name.includes("grid");
}

function adjustWorksImages(content, workImages) {
  if (workImages.length === 0) return content;

  // /portfolio/work_XX.webp → /images/work_XX.webp に置換
  content = content.replace(/\/portfolio\/work_(\d+)\.\w+/g, (match, num) => {
    const idx = parseInt(num) - 1;
    if (idx < workImages.length) {
      return `/images/${workImages[idx]}`;
    }
    return match;
  });

  // /images/work_XX.webp のパスも実際のファイル名に合わせる
  content = content.replace(/\/images\/work_(\d+)\.\w+/g, (match, num) => {
    const idx = parseInt(num) - 1;
    if (idx < workImages.length) {
      return `/images/${workImages[idx]}`;
    }
    return match;
  });

  return content;
}
