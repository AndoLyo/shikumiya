import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.artistName || !body.email || !body.template || !body.works?.length) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    if (body.works.length < 3) {
      return NextResponse.json(
        { error: "作品画像は3枚以上必要です" },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Store full order data as a GitHub Gist (private)
    // Stripe metadata has a 500-char limit per field and 50 field limit,
    // so images (base64) cannot be stored there.
    const githubToken = process.env.GITHUB_TOKEN!;
    const gistRes = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: `しくみや注文データ: ${orderId}`,
        public: false,
        files: {
          "order.json": {
            content: JSON.stringify({
              orderId,
              ...body,
              createdAt: new Date().toISOString(),
            }),
          },
        },
      }),
    });

    if (!gistRes.ok) {
      console.error("Gist creation failed:", await gistRes.text());
      return NextResponse.json(
        { error: "注文データの保存に失敗しました" },
        { status: 500 }
      );
    }

    const gistData = await gistRes.json();
    const gistId = gistData.id;

    // Determine price ID based on plan
    const priceId =
      body.plan === "omakase"
        ? process.env.STRIPE_PRICE_OMAKASE!
        : process.env.STRIPE_PRICE_TEMPLATE!;

    // Store only a reference in Stripe metadata (within 500-char limits)
    const metadata: Record<string, string> = {
      order_id: orderId,
      gist_id: gistId,
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

    // For subscriptions, metadata goes on the subscription
    if (body.plan === "omakase") {
      sessionConfig.subscription_data = { metadata };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
