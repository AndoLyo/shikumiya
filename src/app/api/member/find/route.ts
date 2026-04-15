import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/member/find?email=xxx
 * GASのfind_by_emailを呼んで注文データを返す
 */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ found: false, error: "email required" }, { status: 400 });
  }

  const gasUrl = process.env.GAS_WEBHOOK_URL;
  if (!gasUrl) {
    return NextResponse.json({ found: false, error: "GAS not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${gasUrl}?action=find_by_email&email=${encodeURIComponent(email)}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ found: false, error: "GAS request failed" }, { status: 500 });
  }
}
