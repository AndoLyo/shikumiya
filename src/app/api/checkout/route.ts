import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.artistName || !body.email || !body.template) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 },
      );
    }

    // Check if site URL is already taken
    const githubToken = process.env.GITHUB_TOKEN!;
    const githubOwner = process.env.GITHUB_OWNER || "AndoLyo";
    if (body.siteSlug) {
      const slug = body.siteSlug.replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
      const repoName = `shikumiya-${slug}`;
      const checkRes = await fetch(`https://api.github.com/repos/${githubOwner}/${repoName}`, {
        headers: { Authorization: `token ${githubToken}`, Accept: "application/vnd.github.v3+json" },
      });
      if (checkRes.ok) {
        return NextResponse.json(
          { error: `「${slug}」はすでに使用されています。別のサイトURLを入力してください。` },
          { status: 400 },
        );
      }
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const orderMeta = {
      orderId,
      artistName: body.artistName,
      siteSlug: body.siteSlug || "",
      siteTitle: body.siteTitle || "",
      email: body.email,
      genres: body.genres || [],
      tools: body.tools || [],
      template: body.template,
      catchcopy: body.catchcopy || "",
      bio: body.bio || "",
      motto: body.motto || "",
      snsX: body.snsX || "",
      snsInstagram: body.snsInstagram || "",
      snsPixiv: body.snsPixiv || "",
      snsNote: body.snsNote || "",
      snsOther: body.snsOther || "",
      requests: body.requests || "",
      plan: body.plan,
      imageGistId: body.imageGistId || "",
      worksMeta: body.worksMeta || [],
      hasProfileImage: body.hasProfileImage || false,
      createdAt: new Date().toISOString(),
    };

    const gistRes = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: `しくみや注文メタデータ: ${orderId}`,
        public: false,
        files: {
          "order.json": {
            content: JSON.stringify(orderMeta),
          },
        },
      }),
    });

    if (!gistRes.ok) {
      console.error("Gist creation failed:", await gistRes.text());
      return NextResponse.json(
        { error: "注文データの保存に失敗しました" },
        { status: 500 },
      );
    }

    const gistData = await gistRes.json();
    const gistId = gistData.id;

    // Determine price ID based on plan
    const priceId =
      body.plan === "omakase"
        ? process.env.STRIPE_PRICE_OMAKASE!
        : process.env.STRIPE_PRICE_TEMPLATE!;

    // Store only a reference in Stripe metadata
    const metadata: Record<string, string> = {
      order_id: orderId,
      gist_id: gistId,
      image_gist_id: body.imageGistId || "",
      artist_name: String(body.artistName).slice(0, 500),
      email: String(body.email).slice(0, 500),
      template: String(body.template).slice(0, 500),
      plan: String(body.plan),
    };

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: body.plan === "omakase" ? "subscription" : "payment",
      success_url: `${req.nextUrl.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/order`,
      customer_email: body.email,
      metadata,
    };

    if (body.plan === "omakase") {
      sessionConfig.subscription_data = { metadata };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 },
    );
  }
}
