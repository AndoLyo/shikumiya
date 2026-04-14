import { NextRequest, NextResponse } from "next/server";

import { normalizePlanId, PLAN_EDIT_LIMITS } from "@/lib/stripe";

const MAX_EDITS: Record<string, number> = {
  otameshi: 0,       // おためし ¥0/月 — AI編集不可
  omakase: 3,        // おまかせ ¥1,480/月 — 月3回更新
  "omakase-pro": 999, // おまかせプロ ¥4,980/月 — 無制限
};

export async function POST(req: NextRequest) {
  try {
    const { orderId, email, changes, requests } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { success: false, error: "注文IDとメールアドレスが必要です" },
        { status: 400 },
      );
    }

    if (!changes || Object.keys(changes).length === 0) {
      return NextResponse.json(
        { success: false, error: "変更内容を入力してください" },
        { status: 400 },
      );
    }

    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      return NextResponse.json(
        { success: false, error: "サーバー設定エラー" },
        { status: 500 },
      );
    }

    // 1. Verify orderId + email and get order info
    const verifyParams = new URLSearchParams({
      action: "verify",
      orderId,
      email,
    });

    const verifyRes = await fetch(`${gasUrl}?${verifyParams.toString()}`);
    if (!verifyRes.ok) {
      return NextResponse.json(
        { success: false, error: "認証サーバーに接続できません" },
        { status: 502 },
      );
    }

    const orderData = await verifyRes.json();
    if (!orderData.valid) {
      return NextResponse.json(
        { success: false, error: "注文IDまたはメールアドレスが一致しません" },
        { status: 401 },
      );
    }

    // 2. Check remaining edits
    const plan = normalizePlanId(orderData.plan || "otameshi");
    const maxEdits = MAX_EDITS[plan] || 0;
    const editsUsed = orderData.editsUsed || 0;

    if (editsUsed >= maxEdits) {
      return NextResponse.json(
        {
          success: false,
          error: "編集回数の上限に達しました。おまかせプランにアップグレードすると月3回まで編集できます。",
        },
        { status: 403 },
      );
    }

    // 3. Save edit request to GAS
    const saveParams = new URLSearchParams({
      action: "save_edit",
      orderId,
      email,
      artistName: orderData.artistName || "",
      changes: JSON.stringify(changes),
      requests: requests || "",
    });

    const saveRes = await fetch(`${gasUrl}?${saveParams.toString()}`);
    if (!saveRes.ok) {
      return NextResponse.json(
        { success: false, error: "編集リクエストの保存に失敗しました" },
        { status: 502 },
      );
    }

    const saveData = await saveRes.json();
    if (!saveData.success) {
      return NextResponse.json(
        { success: false, error: saveData.error || "保存に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "編集リクエストを送信しました。反映まで最大24時間お待ちください。",
      editsRemaining: maxEdits - editsUsed - 1,
    });
  } catch (err) {
    console.error("Edit error:", err);
    return NextResponse.json(
      { success: false, error: "編集処理でエラーが発生しました" },
      { status: 500 },
    );
  }
}
