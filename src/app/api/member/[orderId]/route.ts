import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const email = req.nextUrl.searchParams.get("email");

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "注文IDとメールアドレスが必要です" },
        { status: 400 },
      );
    }

    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      return NextResponse.json(
        { error: "サーバー設定エラー" },
        { status: 500 },
      );
    }

    const verifyParams = new URLSearchParams({
      action: "verify",
      orderId,
      email,
    });

    const res = await fetch(`${gasUrl}?${verifyParams.toString()}`);
    if (!res.ok) {
      return NextResponse.json(
        { error: "データ取得に失敗しました" },
        { status: 502 },
      );
    }

    const data = await res.json();
    if (!data.valid) {
      return NextResponse.json(
        { error: "注文IDまたはメールアドレスが一致しません" },
        { status: 401 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Member data fetch error:", err);
    return NextResponse.json(
      { error: "データ取得でエラーが発生しました" },
      { status: 500 },
    );
  }
}
