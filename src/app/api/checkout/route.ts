import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.artistName || !body.email || !body.template || !body.plan) {
      return NextResponse.json(
        { error: "必須項目が不足しています。" },
        { status: 400 }
      );
    }

    // Determine price ID based on plan
    const priceId =
      body.plan === "omakase"
        ? process.env.STRIPE_PRICE_OMAKASE!
        : process.env.STRIPE_PRICE_TEMPLATE!;

    // Store form data in metadata (Stripe metadata values must be strings, max 500 chars each)
    const metadata: Record<string, string> = {
      artist_name: String(body.artistName).slice(0, 500),
      email: String(body.email).slice(0, 500),
      template: String(body.template).slice(0, 500),
      bio: String(body.bio || "").slice(0, 500),
      sns_x: String(body.snsX || "").slice(0, 500),
      sns_instagram: String(body.snsInstagram || "").slice(0, 500),
      sns_pixiv: String(body.snsPixiv || "").slice(0, 500),
      sns_other: String(body.snsOther || "").slice(0, 500),
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
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました。" },
      { status: 500 }
    );
  }
}
