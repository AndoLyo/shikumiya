import { NextResponse } from "next/server";
import { logger } from "@/lib/error-handler";

/**
 * POST /api/edit-request
 *
 * レイアウト/機能変更の依頼（Claude API経由で処理）
 * テキスト/画像は/api/site-updateで即反映するが、
 * コード変更が必要なものはここで受け付ける
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, email, requestType, details } = body;

    if (!orderId || !email || !requestType) {
      return NextResponse.json({ error: "orderId, email, requestType are required" }, { status: 400 });
    }

    // 1. GASで認証
    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: "GAS_WEBHOOK_URL not configured" }, { status: 500 });
    }

    const verifyRes = await fetch(`${gasUrl}?action=verify&orderId=${orderId}&email=${encodeURIComponent(email)}`);
    const verifyData = await verifyRes.json();

    if (!verifyData.valid) {
      return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    logger.info("CLAUDE_API", `編集依頼受付: ${requestType}`, {
      orderId,
      details: { requestId, requestType, details },
    });

    // 2. GASに依頼を記録
    try {
      await fetch(`${gasUrl}?action=save_edit&orderId=${orderId}&email=${encodeURIComponent(email)}&companyName=${encodeURIComponent(verifyData.companyName || "")}&changes=${encodeURIComponent(JSON.stringify({ type: requestType, ...details }))}&requests=${encodeURIComponent(details?.freeText || details?.note || "")}`);
    } catch {
      logger.warn("GAS_WEBHOOK", "依頼記録の保存に失敗", { orderId });
    }

    // 3. Claude API呼び出し（将来実装）
    // TODO: 現在のpage.tsxを取得 → Claude APIに送信 → 修正コードを受け取る
    // TODO: 新ブランチにpush → Vercel Preview → スコア判定 → 承認/修正
    //
    // 現時点では依頼を記録するだけ。Lyo管理画面(/admin/requests)で確認・手動対応。

    return NextResponse.json({
      success: true,
      requestId,
      message: "編集依頼を受け付けました。担当者が確認のうえ対応いたします。",
      status: "pending",
    });

  } catch (err) {
    logger.error("CLAUDE_API", "編集依頼エラー", { error: err });
    return NextResponse.json({ error: "編集依頼の送信に失敗しました" }, { status: 500 });
  }
}
