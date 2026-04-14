import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripePriceId, PLAN_LABELS, type Plan } from "@/lib/stripe";
import { logger } from "@/lib/error-handler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil" as Stripe.LatestApiVersion,
});

/**
 * POST /api/plan-change
 *
 * プランのアップグレード/ダウングレード
 * Stripeサブスクリプションの価格を変更し、GASのプラン情報も更新
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, email, newPlan } = body as { orderId: string; email: string; newPlan: Plan };

    if (!orderId || !email || !newPlan) {
      return NextResponse.json({ error: "orderId, email, newPlan are required" }, { status: 400 });
    }

    if (!["otameshi", "omakase", "omakase-pro"].includes(newPlan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // 1. GASで認証+現在のプラン・Stripe情報取得
    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: "GAS_WEBHOOK_URL not configured" }, { status: 500 });
    }

    const verifyRes = await fetch(`${gasUrl}?action=verify&orderId=${orderId}&email=${encodeURIComponent(email)}`);
    const verifyData = await verifyRes.json();

    if (!verifyData.valid) {
      return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
    }

    if (verifyData.plan === newPlan) {
      return NextResponse.json({ error: "既に同じプランです" }, { status: 400 });
    }

    const subscriptionId = verifyData.stripeSubscriptionId;
    if (!subscriptionId) {
      return NextResponse.json({ error: "サブスクリプション情報が見つかりません" }, { status: 404 });
    }

    logger.info("STRIPE", `プラン変更: ${verifyData.plan} → ${newPlan}`, { orderId });

    // 2. Stripeサブスクリプション更新
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0]?.id;

    if (!itemId) {
      return NextResponse.json({ error: "サブスクリプションアイテムが見つかりません" }, { status: 500 });
    }

    const newPriceId = getStripePriceId(newPlan);

    if (!newPriceId) {
      // おためし（無料）プランへのダウングレード → サブスクをキャンセル
      await stripe.subscriptions.cancel(subscriptionId);
      return NextResponse.json({
        success: true,
        newPlan,
        planName: PLAN_LABELS[newPlan],
        message: `${PLAN_LABELS[newPlan]}プランに変更しました。サブスクリプションをキャンセルしました。`,
      });
    }

    await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: "create_prorations",
      metadata: { plan: newPlan },
    });

    logger.success("STRIPE", `Stripeプラン変更完了: ${PLAN_LABELS[newPlan]}`, { orderId });

    // 3. GASのプラン情報を更新（TODO: GAS側にupdate_planアクション追加）
    // 現時点ではwebhookのcustomer.subscription.updatedイベントで処理される

    return NextResponse.json({
      success: true,
      newPlan,
      planName: PLAN_LABELS[newPlan],
      message: `${PLAN_LABELS[newPlan]}プランに変更しました。次回請求日から新プランが適用されます。`,
    });

  } catch (err) {
    logger.error("STRIPE", "プラン変更エラー", { error: err });
    return NextResponse.json({ error: "プラン変更に失敗しました" }, { status: 500 });
  }
}
