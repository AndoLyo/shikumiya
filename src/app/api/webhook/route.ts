import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // If webhook secret is set, verify signature
  let event: Stripe.Event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    // For development/testing without webhook secret
    event = JSON.parse(body) as Stripe.Event;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    try {
      // 1. Create site via GitHub API
      const siteUrl = await createSite(metadata);

      // 2. Notify GAS for spreadsheet logging + email
      await notifyGAS({
        ...metadata,
        siteUrl,
        stripeSessionId: session.id,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email || metadata.email,
      });

      console.log(`Site created for ${metadata.artist_name}: ${siteUrl}`);
    } catch (err) {
      console.error("Site creation failed:", err);
      // Don't return error - Stripe will retry. Log and handle manually.
    }
  }

  return NextResponse.json({ received: true });
}

async function createSite(metadata: Record<string, string>): Promise<string> {
  const githubToken = process.env.GITHUB_TOKEN!;
  const templateOwner = process.env.GITHUB_OWNER || "AndoLyo";
  const templateRepo =
    process.env.GITHUB_TEMPLATE_REPO || "shikumiya-template";

  // Generate repo name from artist name (sanitize for GitHub)
  const repoName = `site-${metadata.artist_name
    ?.toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30) || "user"}-${Date.now().toString(36)}`;

  // Step 1: Create repo from template
  const createRes = await fetch(
    `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        owner: templateOwner,
        name: repoName,
        private: false,
        description: `${metadata.artist_name}のギャラリーサイト — しくみや`,
      }),
    },
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`GitHub repo creation failed: ${err}`);
  }

  // Wait for repo to be ready
  await new Promise((r) => setTimeout(r, 3000));

  // Step 2: Update site.config.ts with user data
  const siteConfig = generateSiteConfig(metadata);

  // Get current file SHA (needed for update)
  const fileRes = await fetch(
    `https://api.github.com/repos/${templateOwner}/${repoName}/contents/src/site.config.ts`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  let sha: string | undefined;
  if (fileRes.ok) {
    const fileData = await fileRes.json();
    sha = fileData.sha;
  }

  // Update or create site.config.ts
  const updateRes = await fetch(
    `https://api.github.com/repos/${templateOwner}/${repoName}/contents/src/site.config.ts`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: `Setup: ${metadata.artist_name}のサイト設定`,
        content: Buffer.from(siteConfig).toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    },
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    throw new Error(`site.config.ts update failed: ${err}`);
  }

  // Step 3: Create Vercel project from repo
  const vercelToken = process.env.VERCEL_TOKEN;
  let siteUrl = `https://${repoName}.vercel.app`;

  if (vercelToken) {
    const vercelRes = await fetch("https://api.vercel.com/v10/projects", {
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
          repo: `${templateOwner}/${repoName}`,
        },
      }),
    });

    if (vercelRes.ok) {
      const vercelData = await vercelRes.json();
      siteUrl = `https://${vercelData.name}.vercel.app`;

      // Step 4: Trigger initial deployment
      await new Promise((r) => setTimeout(r, 2000));
      const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: repoName,
          target: "production",
          gitSource: {
            type: "github",
            org: templateOwner,
            repo: repoName,
            ref: "main",
          },
        }),
      });

      if (!deployRes.ok) {
        console.error("Vercel deploy trigger failed:", await deployRes.text());
      }
    } else {
      console.error(
        "Vercel project creation failed:",
        await vercelRes.text(),
      );
    }
  }

  return siteUrl;
}

function generateSiteConfig(metadata: Record<string, string>): string {
  const name = metadata.artist_name || "Your Name";
  const bio = metadata.bio || "";
  const template = metadata.template || "ai-art-portfolio";

  // Build social links array
  const socialLinks: string[] = [];
  if (metadata.sns_x)
    socialLinks.push(
      `    { label: "X (Twitter)", href: ${JSON.stringify(metadata.sns_x)} },`,
    );
  if (metadata.sns_instagram)
    socialLinks.push(
      `    { label: "Instagram", href: ${JSON.stringify(metadata.sns_instagram)} },`,
    );
  if (metadata.sns_pixiv)
    socialLinks.push(
      `    { label: "Pixiv", href: ${JSON.stringify(metadata.sns_pixiv)} },`,
    );
  if (metadata.sns_other)
    socialLinks.push(
      `    { label: "Other", href: ${JSON.stringify(metadata.sns_other)} },`,
    );

  return `// Generated by しくみや — ${new Date().toISOString()}
export const siteConfig = {
  name: ${JSON.stringify(name)},
  siteTitle: ${JSON.stringify(`${name} — Gallery`)},
  description: ${JSON.stringify(bio || `${name}のギャラリーサイト`)},
  url: "",
  lang: "ja",
  template: ${JSON.stringify(template)},

  colors: {
    primary: "#00e5ff",
    accent: "#d4a853",
    background: "#0a0a0f",
  },

  hero: {
    tagline: "Gallery",
    catchcopy: ${JSON.stringify(bio ? bio.slice(0, 50) : `${name}の作品`)},
    subtitle: "Art Portfolio",
    description: ${JSON.stringify(bio || "")},
    backgroundImage: "/images/hero.webp",
    cta: {
      text: "作品を見る",
      href: "#gallery",
    },
  },

  gallery: {
    title: "GALLERY",
    subtitle: "作品ギャラリー",
    description: "",
    works: [
      { src: "/images/work_01.webp", title: "作品 01" },
      { src: "/images/work_02.webp", title: "作品 02" },
      { src: "/images/work_03.webp", title: "作品 03" },
    ],
    initialDisplay: 8,
  },

  about: {
    title: "ABOUT",
    subtitle: "アーティストについて",
    image: "/images/about.webp",
    paragraphs: [${bio ? JSON.stringify(bio) : '""'}],
    quote: "",
    tools: [],
  },

  contact: {
    title: "CONTACT",
    subtitle: "お問い合わせ・SNS",
    description: "お仕事のご依頼・コラボレーション・ご質問はお気軽にどうぞ。",
    email: ${JSON.stringify(metadata.email || "")},
    social: [
${socialLinks.join("\n")}
    ],
  },

  nav: [
    { label: "Gallery", href: "#gallery" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  footer: {
    credit: "Built with Next.js — Template by しくみや",
    copyright: \`© \${new Date().getFullYear()} ${name}. All rights reserved.\`,
  },
};

export type SiteConfig = typeof siteConfig;
`;
}

async function notifyGAS(data: Record<string, unknown>): Promise<void> {
  const gasUrl = process.env.GAS_WEBHOOK_URL;
  if (!gasUrl) {
    console.log(
      "GAS_WEBHOOK_URL not set, skipping notification. Data:",
      JSON.stringify(data),
    );
    return;
  }

  await fetch(gasUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
