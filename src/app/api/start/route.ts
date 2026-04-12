import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripePriceId, getPlanFromTemplateId, PLAN_LABELS, type Plan } from "@/lib/stripe";
import { logger } from "@/lib/error-handler";

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

    // サイトスラッグ生成（会社名をURL-safe化）
    const siteSlug = companyName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
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
    let priceId: string;
    try {
      priceId = getStripePriceId(plan);
    } catch {
      // Price IDが未設定の場合（開発中）
      logger.warn("STRIPE", `Price ID未設定 (${plan})。テストモードでスキップ`, { orderId });
      // 開発中はStripeをスキップして直接成功扱いにする
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
