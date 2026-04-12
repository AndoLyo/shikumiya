/**
 * 実テンプレートサイトから各セクションのスクリーンショットを撮影
 * npx tsx test/capture-template-sections.ts
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000/portfolio-templates";
const OUT = "public/features";

interface SectionCapture {
  featureId: string;
  template: string;
  selector: string;
}

const CAPTURES: SectionCapture[] = [
  // warm-craft sections
  { featureId: "hero-section", template: "warm-craft", selector: "section:first-of-type" },
  { featureId: "works-gallery", template: "warm-craft", selector: "#works" },
  { featureId: "service-section", template: "warm-craft", selector: "#strength" },
  { featureId: "company-info", template: "warm-craft", selector: "#about" },
  { featureId: "contact-form", template: "warm-craft", selector: "#contact" },

  // trust-navy sections
  { featureId: "service-section-alt", template: "trust-navy", selector: "#service" },
  { featureId: "works-gallery-alt", template: "trust-navy", selector: "#works" },

  // clean-arch sections
  { featureId: "works-gallery-minimal", template: "clean-arch", selector: "#works" },

  // Pro templates - premium features
  { featureId: "ai-chatbot", template: "warm-craft-pro", selector: "body" },
  { featureId: "booking-system", template: "warm-craft-pro", selector: "body" },
  { featureId: "recruit-page", template: "trust-navy-pro/recruit", selector: "main" },
  { featureId: "multilingual", template: "clean-arch-pro", selector: "body" },
  { featureId: "panorama-viewer", template: "clean-arch-pro", selector: "body" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  // 1. テンプレートの各セクションを撮影
  console.log("📸 テンプレートセクションを撮影中...");

  for (const cap of CAPTURES) {
    try {
      const url = `${BASE}/${cap.template}`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1500);

      const el = page.locator(cap.selector).first();
      if (await el.count() > 0) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await el.screenshot({ path: `${OUT}/${cap.featureId}.png` });
        console.log(`  ✅ ${cap.featureId} (${cap.template})`);
      } else {
        console.log(`  ⚠️ ${cap.featureId}: selector not found on ${cap.template}`);
      }
    } catch (err) {
      console.log(`  ❌ ${cap.featureId}: ${(err as Error).message.slice(0, 60)}`);
    }
  }

  // 2. /features ページのデモをスクショ（テンプレートにない機能用）
  console.log("\n📸 デモページのカードを撮影中...");
  await page.goto("http://localhost:3000/features", { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(2000);

  const ALL_IDS = [
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

  for (const id of ALL_IDS) {
    const existing = await import("fs").then(fs =>
      fs.existsSync(`${OUT}/${id}.png`) ? fs.statSync(`${OUT}/${id}.png`).mtime : null
    );
    // 5分以内に撮ったものはスキップ（テンプレートから撮ったばかりのもの）
    if (existing && Date.now() - existing.getTime() < 300000) {
      console.log(`  ⏭️ ${id}: テンプレート版あり、スキップ`);
      continue;
    }

    try {
      const card = page.locator(`[data-feature-id="${id}"]`);
      if (await card.count() === 0) continue;

      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await card.click();
      await page.waitForTimeout(800);
      await card.screenshot({ path: `${OUT}/${id}.png` });
      console.log(`  ✅ ${id} (デモ版)`);
      await card.click();
      await page.waitForTimeout(300);
    } catch (err) {
      console.log(`  ❌ ${id}: ${(err as Error).message.slice(0, 60)}`);
    }
  }

  await browser.close();
  console.log("\n📸 全撮影完了");
}

main().catch(console.error);
