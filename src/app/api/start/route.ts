import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripePriceId, getPlanFromTemplateId, PLAN_LABELS, type Plan } from "@/lib/stripe";
import { logger } from "@/lib/error-handler";
import {
  createRepoFromTemplate,
  fetchFileFromRepo,
  pushFileToRepo,
} from "@/lib/github";
import { generateSiteConfig, stringifySiteConfig } from "@/lib/template-config-generator";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil" as Stripe.LatestApiVersion,
});

/**
 * POST /api/start
 *
 * 新規申込API（全業種共通）
 * /start ページから呼ばれる
 *
 * 入力: industry, templateId, companyName, email, phone, domain設定
 * 出力: { url: stripe_checkout_url }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      industry,
      templateId,
      companyName,
      email,
      phone,
      domain,           // 既存ドメイン or 新規取得ドメイン
      useSubdomain,     // 仮URLで開始するか
      siteSlug: inputSlug, // ユーザーが入力したサイトURL用スラッグ
    } = body;

    // ─── バリデーション ───
    if (!templateId || !companyName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "テンプレート、会社名、メールアドレスは必須です" },
        { status: 400 }
      );
    }

    // プランをテンプレIDから判定
    const plan: Plan = getPlanFromTemplateId(templateId);

    // サイトスラッグ（ユーザー入力 or タイムスタンプ）
    const siteSlug = (inputSlug || "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .trim()
      || `site-${Date.now()}`;

    logger.info("STRIPE", `新規申込開始: ${companyName} (${plan})`, {
      details: { industry, templateId, plan, email },
    });

    // ─── GitHub Gistに注文メタデータを保存 ───
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const orderData = {
      orderId,
      companyName,
      email,
      phone: phone || "",
      industry: industry || "other",
      templateId,
      plan,
      siteSlug,
      domain: domain || "",
      useSubdomain: useSubdomain || false,
      createdAt: new Date().toISOString(),
    };

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      logger.error("GITHUB_API", "GITHUB_TOKENが設定されていません");
      return NextResponse.json({ error: "サーバー設定エラー" }, { status: 500 });
    }

    // Gist作成（注文データの一時保存）
    const gistRes = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: `しくみや注文: ${companyName} (${orderId})`,
        public: false,
        files: {
          "order.json": {
            content: JSON.stringify(orderData, null, 2),
          },
        },
      }),
    });

    if (!gistRes.ok) {
      logger.error("GITHUB_API", `Gist作成失敗: ${gistRes.status}`, {
        details: { status: gistRes.status },
        orderId,
      });
      return NextResponse.json({ error: "注文データの保存に失敗しました" }, { status: 500 });
    }

    const gist = await gistRes.json();
    const gistId = gist.id;

    logger.info("GITHUB_API", `Gist作成成功: ${gistId}`, { orderId });

    // ─── Stripe Checkout Session作成（月額サブスクリプション） ───
    const priceId = getStripePriceId(plan);
    if (!priceId) {
      // おためし（無料）プラン → Stripeスキップ、サイト生成→GAS登録
      logger.info("STRIPE", `無料プラン (${plan})。Stripeスキップ → サイト生成`, { orderId });

      const gasUrl = process.env.GAS_WEBHOOK_URL;

      // サイト自動生成
      try {
        logger.info("DEPLOY", `無料プラン: サイト生成開始 ${companyName}`, { orderId });

        const slug = siteSlug || `site-${Date.now()}`;
        const repoName = `shikumiya-${slug}`;
        const templateRepo = process.env.GITHUB_TEMPLATE_REPO || "shikumiya-template";

        // 1. テンプレートからリポ作成
        await createRepoFromTemplate(templateRepo, repoName, `${companyName}のホームページ — しくみや`);
        await new Promise((r) => setTimeout(r, 5000)); // GitHub APIの伝播待ち

        // 2. テンプレートのpage.tsxをコピー
        const sourceRepo = "shikumiya";
        const pageContent = await fetchFileFromRepo(sourceRepo, `src/app/portfolio-templates/${templateId}/page.tsx`);
        if (pageContent) {
          const rewritten = pageContent
            // DemoBanner関連を全て除去（import文のあらゆるバリエーションに対応）
            .replace(/^.*DemoBanner.*$/gm, "")
            .replace(/<DemoBanner\s*\/?\s*>/g, "");
          await pushFileToRepo(repoName, "src/app/page.tsx", rewritten, `Setup: page.tsx (${templateId})`);
        }

        // 2b. 必要なライブラリファイルをコピー
        const libFiles = [
          "src/lib/site-config-schema.ts",
          "src/lib/use-preview-name.ts",
        ];
        for (const libFile of libFiles) {
          try {
            const content = await fetchFileFromRepo(sourceRepo, libFile);
            if (content) {
              await pushFileToRepo(repoName, libFile, content, `Setup: ${libFile.split("/").pop()}`);
            }
          } catch { /* ファイルがなくても続行 */ }
        }

        // 3. site.config.json生成
        const config = generateSiteConfig({
          orderId,
          companyName,
          email,
          phone: phone || "",
          address: "",
          ceo: "",
          bio: "",
          tagline: "",
          industry: industry || "other",
          templateId,
          domain: domain || "",
          siteSlug: slug,
        });
        await pushFileToRepo(repoName, "src/app/site.config.json", stringifySiteConfig(config), "Setup: サイト設定");

        // site.config.jsonもコピー（テンプレート側のデモデータ）
        const templateConfig = await fetchFileFromRepo(sourceRepo, `src/app/portfolio-templates/${templateId}/site.config.json`);
        if (templateConfig) {
          // テンプレートのデモデータをベースに、会社名等を上書き
          try {
            const tplConfig = JSON.parse(templateConfig);
            tplConfig.company = { ...tplConfig.company, name: companyName, email, phone: phone || "" };
            tplConfig.orderId = orderId;
            tplConfig.plan = plan;
            await pushFileToRepo(repoName, "src/app/site.config.json", JSON.stringify(tplConfig, null, 2), "Setup: サイト設定（テンプレートベース）");
          } catch {
            // パース失敗時はgenerateSiteConfigの結果をそのまま使う
          }
        }

        // 4. Vercelにデプロイ
        let generatedSiteUrl = `https://${repoName}.vercel.app`;
        const vercelToken = process.env.VERCEL_TOKEN;
        const owner = process.env.GITHUB_OWNER || "AndoLyo";

        if (vercelToken) {
          try {
            // Vercelプロジェクト作成（GitHubリポと連携）
            const projectRes = await fetch("https://api.vercel.com/v10/projects", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${vercelToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: repoName,
                framework: "nextjs",
                gitRepository: { type: "github", repo: `${owner}/${repoName}` },
              }),
            });

            if (projectRes.ok) {
              // デプロイ開始
              const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${vercelToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: repoName,
                  gitSource: { type: "github", org: owner, repo: repoName, ref: "main" },
                }),
              });

              if (deployRes.ok) {
                const deployData = await deployRes.json();
                if (deployData.url) generatedSiteUrl = `https://${deployData.url}`;
                logger.success("VERCEL_API", `デプロイ成功: ${generatedSiteUrl}`, { orderId });
              }
            } else {
              const errText = await projectRes.text();
              logger.warn("VERCEL_API", `プロジェクト作成失敗: ${errText}`, { orderId });
            }
          } catch (vercelErr) {
            logger.warn("VERCEL_API", "Vercelデプロイ失敗（続行）", { orderId, error: vercelErr });
          }
        }

        logger.success("DEPLOY", `無料プラン: サイト生成完了 ${generatedSiteUrl}`, { orderId });

        // GASのサイトURLを更新
        if (gasUrl) {
          try {
            await fetch(gasUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: orderId,
                company_name: companyName,
                email,
                phone: phone || "",
                industry: industry || "other",
                plan,
                template: templateId,
                site_url: generatedSiteUrl,
                domain: domain || generatedSiteUrl,
                _status: "公開中",
                _repo_name: repoName,
              }),
            });
          } catch { /* ignore */ }
        }
      } catch (siteErr) {
        logger.error("DEPLOY", "無料プラン: サイト生成失敗", { orderId, error: siteErr });
        // サイト生成に失敗しても注文自体は成功扱い
      }

      // Gist削除（サイト生成後は不要）
      try {
        await fetch(`https://api.github.com/gists/${gistId}`, {
          method: "DELETE",
          headers: { Authorization: `token ${githubToken}` },
        });
      } catch { /* ignore */ }

      return NextResponse.json({
        url: `/order/success?orderId=${orderId}&gistId=${gistId}&dev=true`,
        orderId,
        devMode: true,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        order_id: orderId,
        gist_id: gistId,
        template_id: templateId,
        plan,
        company_name: companyName,
        email,
        industry: industry || "other",
      },
      subscription_data: {
        metadata: {
          order_id: orderId,
          template_id: templateId,
          plan,
        },
      },
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://shikumiya.vercel.app"}/start/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/start`,
    });

    logger.success("STRIPE", `Checkout Session作成成功`, {
      orderId,
      details: { sessionId: session.id, plan, priceId },
    });

    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    logger.error("STRIPE", "注文処理でエラーが発生しました", { error });
    return NextResponse.json(
      { error: "注文処理でエラーが発生しました。しばらく経ってからお試しください。" },
      { status: 500 }
    );
  }
}
