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
  siteSlug?: string;
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
  snsNote?: string;
  requests?: string;
  referenceUrl?: string;
  moodTone?: string;
  moodFont?: string;
  moodAnimation?: string;
  profileImage?: { name: string; data: string };
  works: OrderWork[];
  imageGistId?: string;
  worksMeta?: Array<{ name: string; title?: string }>;
  hasProfileImage?: boolean;
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
      // 1. Retrieve order metadata from Gist
      const gistId = metadata.gist_id;
      if (!gistId) {
        throw new Error("No gist_id in session metadata");
      }

      const orderMeta = await fetchOrderFromGist(gistId);

      // 2. Retrieve images from separate image Gist
      const imageGistId = metadata.image_gist_id || orderMeta.imageGistId;
      let imageFiles: Record<string, string> = {};
      if (imageGistId) {
        imageFiles = await fetchImageGist(imageGistId);
      }

      // 3. Create site via GitHub API (with images)
      const siteUrl = await createSite(orderMeta, imageFiles);

      // 4. Delete gists (cleanup)
      await deleteGist(gistId);
      if (imageGistId) await deleteGist(imageGistId);

      // 4. Notify GAS for spreadsheet logging + email
      await notifyGAS({
        order_id: orderMeta.orderId,
        artist_name: orderMeta.artistName,
        email: orderMeta.email,
        template: orderMeta.template,
        plan: orderMeta.plan,
        bio: orderMeta.bio || "",
        sns_x: orderMeta.snsX || "",
        sns_instagram: orderMeta.snsInstagram || "",
        sns_pixiv: orderMeta.snsPixiv || "",
        sns_other: orderMeta.snsOther || "",
        siteUrl,
        stripeSessionId: session.id,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email || orderMeta.email,
        requests: (orderMeta as unknown as Record<string, string>).requests || "",
        catchcopy: orderMeta.catchcopy || "",
        motto: orderMeta.motto || "",
        imageGistId: orderMeta.imageGistId || "",
      });

      console.log(`Site created for ${orderMeta.artistName}: ${siteUrl}`);
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

async function fetchImageGist(gistId: string): Promise<Record<string, string>> {
  const githubToken = process.env.GITHUB_TOKEN!;
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    console.error(`Failed to fetch image gist ${gistId}`);
    return {};
  }

  const gistData = await res.json();
  const files: Record<string, string> = {};
  for (const [name, file] of Object.entries(gistData.files || {})) {
    const fileData = file as { content: string | null; raw_url: string; truncated?: boolean };
    // Large files have content=null and need to be fetched via raw_url
    if (fileData.content) {
      files[name] = fileData.content;
    } else if (fileData.raw_url) {
      const rawRes = await fetch(fileData.raw_url);
      if (rawRes.ok) {
        files[name] = await rawRes.text();
      } else {
        console.error(`Failed to fetch raw content for ${name}`);
      }
    }
  }
  return files;
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

async function createSite(orderMeta: OrderData, imageFiles: Record<string, string>): Promise<string> {
  const githubToken = process.env.GITHUB_TOKEN!;
  const templateOwner = process.env.GITHUB_OWNER || "AndoLyo";
  const templateRepo =
    process.env.GITHUB_TEMPLATE_REPO || "shikumiya-template";

  // Generate clean repo name from siteSlug
  const slug = orderMeta.siteSlug?.replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "user";
  const repoName = `shikumiya-${slug}`;

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
        description: `${orderMeta.artistName}のギャラリーサイト — しくみや`,
      }),
    },
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`GitHub repo creation failed: ${err}`);
  }

  // Wait for repo to be ready
  await new Promise((r) => setTimeout(r, 3000));

  // Step 1.5: Copy selected template's files from main repo
  const selectedTemplate = orderMeta.template || "comic-panel";
  await copyTemplateFiles(githubToken, templateOwner, repoName, selectedTemplate);

  // Step 2: Push images from imageFiles Gist to the repo
  const workFilenames: { src: string; title: string; description: string }[] = [];
  const worksMeta = (orderMeta as unknown as Record<string, unknown>).worksMeta as Array<{name: string; title?: string}> || [];

  let workIndex = 0;
  for (const [gistFileName, imageData] of Object.entries(imageFiles)) {
    if (gistFileName === "profile") {
      // Profile image
      const pushRes = await fetch(
        `https://api.github.com/repos/${templateOwner}/${repoName}/contents/public/images/about.webp`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Add profile image",
            content: imageData.replace(/^data:image\/\w+;base64,/, ""),
          }),
        },
      );
      if (!pushRes.ok) {
        console.error("Failed to push profile image:", await pushRes.text());
      }
    } else {
      // Work image
      workIndex++;
      const filename = `work_${String(workIndex).padStart(2, "0")}.webp`;
      const meta = worksMeta[workIndex - 1];

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
            content: imageData.replace(/^data:image\/\w+;base64,/, ""),
          }),
        },
      );

      if (!pushRes.ok) {
        console.error(`Failed to push image ${filename}:`, await pushRes.text());
      }

      workFilenames.push({
        src: `/images/${filename}`,
        title: meta?.title || `作品 ${String(workIndex).padStart(2, "0")}`,
        description: "",
      });
    }
  }

  // Legacy: Push profile image if it was in orderMeta directly
  if (!imageFiles["profile"] && orderMeta.profileImage?.data) {
    const profileData = orderMeta.profileImage.data.replace(
      /^data:image\/\w+;base64,/,
      "",
    );
    const profileExt = orderMeta.profileImage.name.split(".").pop() || "webp";
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
  const siteConfig = generateSiteConfig(orderMeta, workFilenames);

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
        message: `Setup: ${orderMeta.artistName}のサイト設定`,
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

async function copyTemplateFiles(
  githubToken: string,
  owner: string,
  targetRepo: string,
  templateId: string,
): Promise<void> {
  const sourceRepo = "lyo-vision-site";

  // 1. Get page.tsx from portfolio-templates
  const pagePath = `src/app/portfolio-templates/${templateId}/page.tsx`;
  const pageContent = await fetchFileFromRepo(githubToken, owner, sourceRepo, pagePath);
  if (pageContent) {
    // Rewrite imports: @/components/portfolio-templates/{id}/ → @/components/
    const rewritten = pageContent
      .replace(new RegExp(`@/components/portfolio-templates/${templateId}/`, "g"), "@/components/");
    await pushFileToRepo(githubToken, owner, targetRepo, "src/app/page.tsx", rewritten, "Setup: page.tsx from template");
  }

  // 2. Get all component files for this template
  const componentsPath = `src/components/portfolio-templates/${templateId}`;
  const files = await listFilesInRepo(githubToken, owner, sourceRepo, componentsPath);
  for (const file of files) {
    if (!file.name.endsWith(".tsx")) continue;
    const content = await fetchFileFromRepo(githubToken, owner, sourceRepo, file.path);
    if (content) {
      // Push to src/components/ (flat, not in subdirectory)
      await pushFileToRepo(githubToken, owner, targetRepo, `src/components/${file.name}`, content, `Setup: ${file.name}`);
    }
  }
}

async function fetchFileFromRepo(token: string, owner: string, repo: string, path: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}

async function listFilesInRepo(token: string, owner: string, repo: string, path: string): Promise<Array<{ name: string; path: string }>> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.filter((f: { type: string }) => f.type === "file").map((f: { name: string; path: string }) => ({ name: f.name, path: f.path }));
}

async function pushFileToRepo(token: string, owner: string, repo: string, path: string, content: string, message: string): Promise<void> {
  // Check if file exists (need SHA for update)
  const existRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
  });
  let sha: string | undefined;
  if (existRes.ok) {
    const existData = await existRes.json();
    sha = existData.sha;
  }

  await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
}

function detectColorTheme(requests: string): { primary: string; accent: string; background: string } {
  const r = requests.toLowerCase();
  // White/light themes
  if (r.includes("白") || r.includes("ホワイト") || r.includes("ライト") || r.includes("white") || r.includes("明るい")) {
    return { primary: "#2563eb", accent: "#d4a853", background: "#ffffff" };
  }
  // Pink themes
  if (r.includes("ピンク") || r.includes("pink")) {
    return { primary: "#ec4899", accent: "#f9a8d4", background: "#0a0a0f" };
  }
  // Green themes
  if (r.includes("緑") || r.includes("グリーン") || r.includes("green")) {
    return { primary: "#10b981", accent: "#34d399", background: "#0a0a0f" };
  }
  // Purple themes
  if (r.includes("紫") || r.includes("パープル") || r.includes("purple")) {
    return { primary: "#8b5cf6", accent: "#a78bfa", background: "#0a0a0f" };
  }
  // Red themes
  if (r.includes("赤") || r.includes("レッド") || r.includes("red")) {
    return { primary: "#ef4444", accent: "#f87171", background: "#0a0a0f" };
  }
  // Orange themes
  if (r.includes("オレンジ") || r.includes("orange")) {
    return { primary: "#f97316", accent: "#fb923c", background: "#0a0a0f" };
  }
  // Default
  return { primary: "#00e5ff", accent: "#d4a853", background: "#0a0a0f" };
}

function generateSiteConfig(
  orderMeta: OrderData,
  workFilenames: { src: string; title: string; description: string }[],
): string {
  const name = orderMeta.artistName || "Your Name";
  const bio = orderMeta.bio || "";
  const template = orderMeta.template || "ai-art-portfolio";
  const catchcopy = orderMeta.catchcopy || "";
  const motto = orderMeta.motto || "";
  const siteTitle = orderMeta.siteTitle || `${name} — Gallery`;
  const genres = orderMeta.genres || [];
  const tools = orderMeta.tools || [];
  const requests = (orderMeta as unknown as Record<string, string>).requests || "";

  // Auto-detect color theme from requests
  const colors = detectColorTheme(requests);

  // Determine profile image path
  const profileExt = orderMeta.profileImage?.name?.split(".").pop() || "webp";
  const aboutImage = orderMeta.profileImage?.data
    ? `/images/about.${profileExt}`
    : "/images/about.webp";

  // Build social links array
  const socialLinks: string[] = [];
  if (orderMeta.snsX)
    socialLinks.push(
      `    { label: "X (Twitter)", href: ${JSON.stringify(orderMeta.snsX)} },`,
    );
  if (orderMeta.snsInstagram)
    socialLinks.push(
      `    { label: "Instagram", href: ${JSON.stringify(orderMeta.snsInstagram)} },`,
    );
  if (orderMeta.snsPixiv)
    socialLinks.push(
      `    { label: "Pixiv", href: ${JSON.stringify(orderMeta.snsPixiv)} },`,
    );
  if (orderMeta.snsOther)
    socialLinks.push(
      `    { label: "Other", href: ${JSON.stringify(orderMeta.snsOther)} },`,
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
    primary: "${colors.primary}",
    accent: "${colors.accent}",
    background: "${colors.background}",
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
    email: ${JSON.stringify(orderMeta.email || "")},
    social: [
${socialLinks.join("\n")}
    ] as { label: string; href: string }[],
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
