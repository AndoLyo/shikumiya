import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  fetchGist,
  deleteGist,
  createRepoFromTemplate,
  fetchFileFromRepo,
  listFilesInRepo,
  pushFileToRepo,
  pushBinaryFileToRepo,
} from "@/lib/github";
import { generateSiteConfig, stringifySiteConfig } from "@/lib/template-config-generator";
import { logger, retryGasWebhook } from "@/lib/error-handler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil" as Stripe.LatestApiVersion,
});

/* ═══════════════════════════════════════
   型定義
   ═══════════════════════════════════════ */
interface OrderData {
  orderId: string;
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  ceo?: string;
  bio?: string;
  tagline?: string;
  industry?: string;
  templateId: string;
  plan?: string;
  siteSlug?: string;
  domain?: string;
  useSubdomain?: boolean;
  createdAt?: string;
}

/* ═══════════════════════════════════════
   POST /api/webhook — Stripe Webhook Handler
   ═══════════════════════════════════════ */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (sig && process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    logger.error("STRIPE", "Webhook署名検証失敗", { error: err });
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  /* ─── イベント別処理 ─── */
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case "invoice.payment_failed":
      logger.warn("STRIPE", "決済失敗", { details: { eventId: event.id } });
      break;

    default:
      logger.debug("STRIPE", `未処理イベント: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

/* ═══════════════════════════════════════
   checkout.session.completed
   サイト自動生成の本体
   ═══════════════════════════════════════ */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const gistId = metadata.gist_id;
  const imageGistId = metadata.image_gist_id;

  if (!gistId) {
    logger.error("STRIPE", "gist_idがmetadataにありません", { details: { sessionId: session.id } });
    return;
  }

  try {
    // 1. 注文データ取得
    logger.info("DEPLOY", "サイト生成開始", { orderId: metadata.order_id });

    const gistFiles = await fetchGist(gistId);
    const orderMeta: OrderData = JSON.parse(gistFiles["order.json"]);

    logger.info("DEPLOY", `注文データ取得: ${orderMeta.companyName}`, { orderId: orderMeta.orderId });

    // 2. 画像取得（ある場合）
    let imageFiles: Record<string, string> = {};
    if (imageGistId) {
      try {
        imageFiles = await fetchImageGist(imageGistId);
        logger.info("DEPLOY", `画像取得: ${Object.keys(imageFiles).length}枚`, { orderId: orderMeta.orderId });
      } catch {
        logger.warn("DEPLOY", "画像Gist取得失敗（スキップ）", { orderId: orderMeta.orderId });
      }
    }

    // 3. サイト生成
    const siteUrl = await createSite(orderMeta, imageFiles);
    logger.success("DEPLOY", `サイト生成完了: ${siteUrl}`, { orderId: orderMeta.orderId });

    // 4. Gist削除
    await deleteGist(gistId);
    if (imageGistId) await deleteGist(imageGistId);

    // 5. GAS通知
    await notifyGAS({
      order_id: orderMeta.orderId,
      company_name: orderMeta.companyName,
      email: orderMeta.email,
      phone: orderMeta.phone || "",
      industry: orderMeta.industry || "other",
      template: orderMeta.templateId,
      plan: orderMeta.plan || "lite",
      site_url: siteUrl,
      domain: orderMeta.domain || "",
      stripe_session_id: session.id,
      stripe_customer_id: session.customer as string || "",
      stripe_subscription_id: session.subscription as string || "",
      amount_total: session.amount_total,
      ceo: orderMeta.ceo || "",
      bio: orderMeta.bio || "",
      tagline: orderMeta.tagline || "",
      address: orderMeta.address || "",
      created_at: orderMeta.createdAt || new Date().toISOString(),
    });

    logger.success("DEPLOY", "GAS通知完了", { orderId: orderMeta.orderId });

  } catch (err) {
    logger.error("DEPLOY", "サイト生成失敗", { error: err, orderId: metadata.order_id });
    // Stripeに400を返さない（リトライされるため）
  }
}

/* ═══════════════════════════════════════
   サイト生成本体
   ═══════════════════════════════════════ */
async function createSite(orderMeta: OrderData, imageFiles: Record<string, string>): Promise<string> {
  const slug = (orderMeta.siteSlug || orderMeta.companyName)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 30) || `site-${Date.now()}`;

  const repoName = `shikumiya-${slug}`;

  logger.info("GITHUB_API", `リポジトリ作成: ${repoName}`, { orderId: orderMeta.orderId });

  // 1. テンプレートリポからリポ生成
  const templateRepo = process.env.GITHUB_TEMPLATE_REPO || "shikumiya-template";
  await createRepoFromTemplate(templateRepo, repoName, `${orderMeta.companyName}のホームページ — しくみや`);

  // GitHub APIの伝播待ち
  await new Promise((r) => setTimeout(r, 5000));

  // 2. テンプレートファイルをコピー
  await copyTemplateFiles(repoName, orderMeta.templateId);

  // 3. 画像をpush
  for (const [fileName, base64Data] of Object.entries(imageFiles)) {
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "");
    const path = `public/images/${cleanName}`;
    try {
      await pushBinaryFileToRepo(repoName, path, base64Data, `Add image: ${cleanName}`);
    } catch (err) {
      logger.warn("GITHUB_API", `画像push失敗: ${cleanName}`, { orderId: orderMeta.orderId, error: err });
    }
  }

  // 4. site.config.json生成+push
  const config = generateSiteConfig({
    orderId: orderMeta.orderId,
    companyName: orderMeta.companyName,
    email: orderMeta.email,
    phone: orderMeta.phone,
    address: orderMeta.address,
    ceo: orderMeta.ceo,
    bio: orderMeta.bio,
    tagline: orderMeta.tagline,
    industry: orderMeta.industry,
    templateId: orderMeta.templateId,
    domain: orderMeta.domain,
    siteSlug: slug,
  });

  await pushFileToRepo(repoName, "src/site.config.json", stringifySiteConfig(config), "Setup: サイト設定");

  // 5. Vercelデプロイ
  const siteUrl = await deployToVercel(repoName);

  return siteUrl;
}

/* ═══════════════════════════════════════
   テンプレートファイルコピー
   メインリポ → 顧客リポ
   ═══════════════════════════════════════ */
async function copyTemplateFiles(targetRepo: string, templateId: string): Promise<void> {
  const sourceRepo = process.env.GITHUB_OWNER ? "lyo-vision-site" : "lyo-vision-site";
  const baseTemplateId = templateId.replace(/-(?:mid|pro)$/, "");

  // 1. page.tsxをコピー
  const pageContent = await fetchFileFromRepo(sourceRepo, `src/app/portfolio-templates/${templateId}/page.tsx`);
  if (pageContent) {
    // import パスを書き換え（ネスト解除）
    const rewritten = pageContent
      .replace(new RegExp(`@/components/portfolio-templates/${templateId}/`, "g"), "@/components/")
      .replace(new RegExp(`@/components/portfolio-templates/${baseTemplateId}/`, "g"), "@/components/")
      .replace(/from "@\/components\/portfolio-templates\/DemoBanner"/g, "// DemoBanner removed for production")
      .replace(/<DemoBanner\s*\/>/g, "");

    await pushFileToRepo(targetRepo, "src/app/page.tsx", rewritten, `Setup: page.tsx (${templateId})`);
  }

  // 2. site.config.jsonをコピー（デモデータとして）
  const configContent = await fetchFileFromRepo(sourceRepo, `src/app/portfolio-templates/${templateId}/site.config.json`);
  if (configContent) {
    // デモデータとして一旦コピー（後でcreatesite内で上書きされる）
    await pushFileToRepo(targetRepo, "src/site.config.json", configContent, "Setup: site.config.json (demo)");
  }

  // 3. コンポーネントファイルをコピー
  const componentDir = `src/components/portfolio-templates/${templateId}`;
  const files = await listFilesInRepo(sourceRepo, componentDir);

  for (const file of files) {
    if (!file.name.endsWith(".tsx") && !file.name.endsWith(".ts")) continue;
    const content = await fetchFileFromRepo(sourceRepo, file.path);
    if (content) {
      await pushFileToRepo(targetRepo, `src/components/${file.name}`, content, `Setup: ${file.name}`);
    }
  }

  // 4. 共通コンポーネント（SiteDataContext等）もコピー
  const sharedFiles = ["SiteDataContext.tsx", "site-data.ts", "site-config-schema.ts"];
  for (const sf of sharedFiles) {
    const content = await fetchFileFromRepo(sourceRepo, `src/lib/${sf}`);
    if (content) {
      await pushFileToRepo(targetRepo, `src/lib/${sf}`, content, `Setup: ${sf}`);
    }
  }

  logger.info("GITHUB_API", `テンプレートコピー完了: ${templateId}`, { details: { targetRepo } });
}

/* ═══════════════════════════════════════
   画像Gist取得（大きい画像用の特別処理）
   ═══════════════════════════════════════ */
async function fetchImageGist(gistId: string): Promise<Record<string, string>> {
  const token = process.env.GITHUB_TOKEN!;
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
  });

  if (!res.ok) throw new Error(`Image Gist fetch failed: ${res.status}`);

  const data = await res.json();
  const result: Record<string, string> = {};

  for (const [name, file] of Object.entries(data.files)) {
    const f = file as { content?: string; raw_url?: string; truncated?: boolean };

    if (f.truncated && f.raw_url) {
      // 大きいファイルはraw_urlから取得
      const rawRes = await fetch(f.raw_url, {
        headers: { Authorization: `token ${token}` },
      });
      if (rawRes.ok) {
        result[name] = await rawRes.text();
      }
    } else if (f.content) {
      result[name] = f.content;
    }
  }

  return result;
}

/* ═══════════════════════════════════════
   Vercelデプロイ
   ═══════════════════════════════════════ */
async function deployToVercel(repoName: string): Promise<string> {
  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) {
    logger.warn("VERCEL_API", "VERCEL_TOKEN未設定。デプロイスキップ");
    return `https://${repoName}.vercel.app`;
  }

  const owner = process.env.GITHUB_OWNER || "AndoLyo";

  try {
    // プロジェクト作成
    const projectRes = await fetch("https://api.vercel.com/v10/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: `${owner}/${repoName}`,
        },
      }),
    });

    if (!projectRes.ok) {
      const err = await projectRes.text();
      logger.warn("VERCEL_API", `プロジェクト作成失敗: ${err}`);
      return `https://${repoName}.vercel.app`;
    }

    // デプロイトリガー
    const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        gitSource: {
          type: "github",
          org: owner,
          repo: repoName,
          ref: "main",
        },
      }),
    });

    if (deployRes.ok) {
      const deployData = await deployRes.json();
      const url = deployData.url ? `https://${deployData.url}` : `https://${repoName}.vercel.app`;
      logger.success("VERCEL_API", `デプロイ成功: ${url}`);
      return url;
    }
  } catch (err) {
    logger.error("VERCEL_API", "デプロイ失敗", { error: err });
  }

  return `https://${repoName}.vercel.app`;
}

/* ═══════════════════════════════════════
   GAS通知
   ═══════════════════════════════════════ */
async function notifyGAS(data: Record<string, unknown>): Promise<void> {
  const gasUrl = process.env.GAS_WEBHOOK_URL;
  if (!gasUrl) {
    logger.warn("GAS_WEBHOOK", "GAS_WEBHOOK_URL未設定。通知スキップ");
    return;
  }

  await retryGasWebhook(gasUrl, data);
}

/* ═══════════════════════════════════════
   サブスクリプション更新
   ═══════════════════════════════════════ */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  logger.info("STRIPE", `サブスクリプション更新: ${subscription.id}`, {
    details: {
      status: subscription.status,
      metadata: subscription.metadata,
    },
  });
  // TODO: GASのプラン情報を更新
  // TODO: 顧客サイトのsite.config.jsonのplanフィールドを更新
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  logger.info("STRIPE", `サブスクリプション解約: ${subscription.id}`, {
    details: { metadata: subscription.metadata },
  });
  // TODO: GASに解約記録
  // 解約後もサイトは残す（PROJECT_STATE通り）
}
