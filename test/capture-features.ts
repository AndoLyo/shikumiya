/**
 * 機能体験ページの各機能デモをスクリーンショット撮影
 * 使い方: npx tsx test/capture-features.ts
 * 前提: dev server が localhost:3000 で起動していること
 */
import { chromium } from "playwright";

const BASE_URL = "http://localhost:3000/features";
const OUTPUT_DIR = "public/features";

const FEATURE_IDS = [
  "hero-section", "news-section", "works-gallery", "service-section",
  "product-lineup", "technology-section", "pickup-section", "testimonials",
  "location-search", "company-info", "cta-section", "video-section",
  "recruit-page", "blog-section", "faq-section", "before-after",
  "header-nav", "footer", "contact-form", "breadcrumbs",
  "google-maps", "sns-integration", "cookie-consent", "site-search",
  "ai-chatbot", "booking-system", "multilingual", "panorama-viewer",
  "pdf-download", "image-gallery", "file-upload", "review-rating",
  "notification", "analytics-dashboard", "dark-mode", "animation",
  "seo-check", "responsive-check", "accessibility-check", "performance-check",
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log("📸 ページを開いています...");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. ページ全体のヒーロー
  console.log("📸 ヒーロー撮影中...");
  await page.screenshot({
    path: `${OUTPUT_DIR}/page-hero.png`,
    clip: { x: 0, y: 0, width: 1280, height: 600 },
  });

  // 2. 各機能カードを1つずつ開いて撮影
  let captured = 0;
  let failed = 0;

  for (const featureId of FEATURE_IDS) {
    try {
      const card = page.locator(`[data-feature-id="${featureId}"]`);

      if ((await card.count()) === 0) {
        console.log(`  ⚠️ ${featureId}: カードが見つかりません（フィルターで非表示の可能性）`);
        // フィルターをリセット
        const allButton = page.locator("button", { hasText: "すべて" }).first();
        if (await allButton.count() > 0) {
          await allButton.click();
          await page.waitForTimeout(500);
        }
        // もう一度試す
        if ((await card.count()) === 0) {
          console.log(`  ❌ ${featureId}: スキップ`);
          failed++;
          continue;
        }
      }

      // カードが見える位置までスクロール
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // カードをクリックして展開
      await card.click();
      await page.waitForTimeout(1200); // アニメーション待ち

      // 展開されたカードを撮影
      await card.screenshot({
        path: `${OUTPUT_DIR}/${featureId}.png`,
      });

      captured++;
      console.log(`  ✅ ${featureId} (${captured}/${FEATURE_IDS.length})`);

      // カードを閉じる
      await card.click();
      await page.waitForTimeout(400);
    } catch (err) {
      console.log(`  ❌ ${featureId}: ${(err as Error).message.slice(0, 80)}`);
      failed++;
    }
  }

  // 3. フィルター別の全体ビュー
  const filters = [
    { label: "セクション", file: "filter-section.png" },
    { label: "共通パーツ", file: "filter-parts.png" },
    { label: "機能", file: "filter-function.png" },
    { label: "品質保証", file: "filter-validation.png" },
  ];

  for (const f of filters) {
    try {
      const btn = page.locator("button", { hasText: f.label }).first();
      await btn.click();
      await page.waitForTimeout(800);
      await page.screenshot({
        path: `${OUTPUT_DIR}/${f.file}`,
        fullPage: false,
      });
      console.log(`  ✅ フィルター: ${f.label}`);
    } catch {
      console.log(`  ⚠️ フィルター: ${f.label} 失敗`);
    }
  }

  // リセット
  const resetBtn = page.locator("button", { hasText: "すべて" }).first();
  if (await resetBtn.count() > 0) await resetBtn.click();

  await browser.close();

  console.log(`\n📸 完了: ${captured}枚撮影, ${failed}枚失敗`);
  console.log(`📁 保存先: ${OUTPUT_DIR}/`);
}

main().catch(console.error);
