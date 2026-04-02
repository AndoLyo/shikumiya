import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { valid: false, error: "注文IDとメールアドレスを入力してください" },
        { status: 400 },
      );
    }

    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      console.error("GAS_WEBHOOK_URL not set");
      return NextResponse.json(
        { valid: false, error: "サーバー設定エラー" },
        { status: 500 },
      );
    }

    // Verify against GAS spreadsheet
    const params = new URLSearchParams({
      action: "verify",
      orderId,
      email,
    });

    const res = await fetch(`${gasUrl}?${params.toString()}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("GAS verify failed:", res.status);
      return NextResponse.json(
        { valid: false, error: "認証サーバーに接続できません" },
        { status: 502 },
      );
    }

    const data = await res.json();

    if (!data.valid) {
      return NextResponse.json(
        { valid: false, error: "注文IDまたはメールアドレスが一致しません" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      valid: true,
      orderId,
    });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json(
      { valid: false, error: "認証処理でエラーが発生しました" },
      { status: 500 },
    );
  }
}
