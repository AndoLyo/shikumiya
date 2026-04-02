import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface OrderWork {
  name: string;
  data: string; // base64 data URL
  title?: string;
  description?: string;
}

interface OrderData {
  orderId: string;
  artistName: string;
  email: string;
  template: string;
  plan: string;
  bio?: string;
  catchcopy?: string;
  motto?: string;
  siteTitle?: string;
  genres?: string[];
  tools?: string[];
  snsX?: string;
  snsInstagram?: string;
  snsPixiv?: string;
  snsOther?: string;
  profileImage?: { name: string; data: string };
  works: OrderWork[];
  createdAt: string;
}

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
      // 1. Retrieve full order data from GitHub Gist
      const gistId = metadata.gist_id;
      if (!gistId) {
        throw new Error("No gist_id in session metadata");
      }

      const orderData = await fetchOrderFromGist(gistId);

      // 2. Create site via GitHub API (with images)
      const siteUrl = await createSite(orderData);

      // 3. Delete the gist (cleanup)
      await deleteGist(gistId);

      // 4. Notify GAS for spreadsheet logging + email
      await notifyGAS({
        order_id: orderData.orderId,
        artist_name: orderData.artistName,
        email: orderData.email,
        template: orderData.template,
        plan: orderData.plan,
        siteUrl,
        stripeSessionId: session.id,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email || orderData.email,
      });

      console.log(`Site created for ${orderData.artistName}: ${siteUrl}`);
    } catch (err) {
      console.error("Site creation failed:", err);
      // Don't return error - Stripe will retry. Log and handle manually.
    }
  }

  return NextResponse.json({ received: true });
}

async function fetchOrderFromGist(gistId: string): Promise<OrderData> {
  const githubToken = process.env.GITHUB_TOKEN!;

  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch gist ${gistId}: ${await res.text()}`);
  }

  const gistData = await res.json();
  const content = gistData.files?.["order.json"]?.content;
  if (!content) {
    throw new Error(`Gist ${gistId} has no order.json file`);
  }

  return JSON.parse(content) as OrderData;
}

async function deleteGist(gistId: string): Promise<void> {
  const githubToken = process.env.GITHUB_TOKEN!;

  try {
    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "DELETE",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
  } catch (err) {
    // Non-critical — log but don't fail
    console.error(`Failed to delete gist ${gistId}:`, err);
  }
}

async function createSite(orderData: OrderData): Promise<string> {
  const githubToken = process.env.GITHUB_TOKEN!;
  const templateOwner = process.env.GITHUB_OWNER || "AndoLyo";
  const templateRepo =
    process.env.GITHUB_TEMPLATE_REPO || "shikumiya-template";

  // Generate repo name from artist name (sanitize for GitHub)
  const repoName = `site-${orderData.artistName
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
        description: `${orderData.artistName}のギャラリーサイト — しくみや`,
      }),
    },
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`GitHub repo creation failed: ${err}`);
  }

  // Wait for repo to be ready
  await new Promise((r) => setTimeout(r, 3000));

  // Step 2: Push work images to the repo
  const workFilenames: { src: string; title: string; description: string }[] = [];

  for (let i = 0; i < orderData.works.length; i++) {
    const work = orderData.works[i];
    const imageData = work.data.replace(/^data:image\/\w+;base64,/, "");
    const ext = work.name.split(".").pop() || "webp";
    const filename = `work_${String(i + 1).padStart(2, "0")}.${ext}`;

    const pushRes = await fetch(
      `https://api.github.com/repos/${templateOwner}/${repoName}/contents/public/images/${filename}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: `Add work image: ${filename}`,
          content: imageData,
        }),
      },
    );

    if (!pushRes.ok) {
      console.error(`Failed to push image ${filename}:`, await pushRes.text());
    }

    workFilenames.push({
      src: `/images/${filename}`,
      title: work.title || `作品 ${String(i + 1).padStart(2, "0")}`,
      description: work.description || "",
    });
  }

  // Step 3: Push profile image if provided
  if (orderData.profileImage?.data) {
    const profileData = orderData.profileImage.data.replace(
      /^data:image\/\w+;base64,/,
      "",
    );
    const profileExt = orderData.profileImage.name.split(".").pop() || "webp";
    const profileFilename = `about.${profileExt}`;

    const profileRes = await fetch(
      `https://api.github.com/repos/${templateOwner}/${repoName}/contents/public/images/${profileFilename}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: `Add profile image: ${profileFilename}`,
          content: profileData,
        }),
      },
    );

    if (!profileRes.ok) {
      console.error("Failed to push profile image:", await profileRes.text());
    }
  }

  // Step 4: Update site.config.ts with full order data
  const siteConfig = generateSiteConfig(orderData, workFilenames);

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
        message: `Setup: ${orderData.artistName}のサイト設定`,
        content: Buffer.from(siteConfig).toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    },
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    throw new Error(`site.config.ts update failed: ${err}`);
  }

  // Step 5: Create Vercel project from repo
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

      // Step 6: Trigger initial deployment
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

function generateSiteConfig(
  orderData: OrderData,
  workFilenames: { src: string; title: string; description: string }[],
): string {
  const name = orderData.artistName || "Your Name";
  const bio = orderData.bio || "";
  const template = orderData.template || "ai-art-portfolio";
  const catchcopy = orderData.catchcopy || "";
  const motto = orderData.motto || "";
  const siteTitle = orderData.siteTitle || `${name} — Gallery`;
  const genres = orderData.genres || [];
  const tools = orderData.tools || [];

  // Determine profile image path
  const profileExt = orderData.profileImage?.name?.split(".").pop() || "webp";
  const aboutImage = orderData.profileImage?.data
    ? `/images/about.${profileExt}`
    : "/images/about.webp";

  // Build social links array
  const socialLinks: string[] = [];
  if (orderData.snsX)
    socialLinks.push(
      `    { label: "X (Twitter)", href: ${JSON.stringify(orderData.snsX)} },`,
    );
  if (orderData.snsInstagram)
    socialLinks.push(
      `    { label: "Instagram", href: ${JSON.stringify(orderData.snsInstagram)} },`,
    );
  if (orderData.snsPixiv)
    socialLinks.push(
      `    { label: "Pixiv", href: ${JSON.stringify(orderData.snsPixiv)} },`,
    );
  if (orderData.snsOther)
    socialLinks.push(
      `    { label: "Other", href: ${JSON.stringify(orderData.snsOther)} },`,
    );

  // Build works array
  const worksEntries = workFilenames
    .map(
      (w) =>
        `    { src: ${JSON.stringify(w.src)}, title: ${JSON.stringify(w.title)}, description: ${JSON.stringify(w.description)} },`,
    )
    .join("\n");

  return `// Generated by しくみや — ${new Date().toISOString()}
export const siteConfig = {
  name: ${JSON.stringify(name)},
  siteTitle: ${JSON.stringify(siteTitle)},
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
    catchcopy: ${JSON.stringify(catchcopy || (bio ? bio.slice(0, 50) : `${name}の作品`))},
    motto: ${JSON.stringify(motto)},
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
${worksEntries}
    ],
    initialDisplay: 8,
  },

  about: {
    title: "ABOUT",
    subtitle: "アーティストについて",
    image: ${JSON.stringify(aboutImage)},
    paragraphs: [${bio ? JSON.stringify(bio) : '""'}],
    quote: ${JSON.stringify(motto)},
    genres: ${JSON.stringify(genres)},
    tools: ${JSON.stringify(tools)},
  },

  contact: {
    title: "CONTACT",
    subtitle: "お問い合わせ・SNS",
    description: "お仕事のご依頼・コラボレーション・ご質問はお気軽にどうぞ。",
    email: ${JSON.stringify(orderData.email || "")},
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
