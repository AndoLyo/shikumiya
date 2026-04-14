import { NextResponse } from "next/server";
import { logger } from "@/lib/error-handler";
import { normalizePlanId } from "@/lib/stripe";

/**
 * GET /api/admin?action=dashboard|accounts|requests
 *
 * Lyo管理画面用のデータ取得API
 * GASから注文データ・編集リクエストを取得して集計
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "dashboard";

  const gasUrl = process.env.GAS_WEBHOOK_URL;
  if (!gasUrl) {
    return NextResponse.json({ error: "GAS_WEBHOOK_URL not configured" }, { status: 500 });
  }

  try {
    if (action === "dashboard") {
      return await getDashboard(gasUrl);
    }
    if (action === "accounts") {
      return await getAccounts(gasUrl);
    }
    if (action === "requests") {
      return await getRequests(gasUrl);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    logger.error("UNKNOWN", "Admin API error", { error: err });
    return NextResponse.json({ error: "データの取得に失敗しました" }, { status: 500 });
  }
}

async function getDashboard(gasUrl: string) {
  const allRes = await fetch(`${gasUrl}?action=get_all_customers`);
  const allData = await allRes.json();
  const customers = allData.customers || [];

  const planPrices: Record<string, number> = { otameshi: 0, omakase: 1480, "omakase-pro": 4980 };
  const active = customers.filter((c: Record<string, string>) => c.status === "公開中");
  const pending = customers.filter((c: Record<string, string>) => c.status === "制作中");
  const mrr = active.reduce((sum: number, c: Record<string, string>) => sum + (planPrices[normalizePlanId(c.plan)] || 0), 0);

  return NextResponse.json({
    totalCustomers: customers.length,
    activeCount: active.length,
    pendingCount: pending.length,
    mrr,
    pendingOrders: pending.slice(0, 5).map((o: Record<string, string>) => ({
      id: o.orderId || "",
      company: o.companyName || "",
      plan: normalizePlanId(o.plan || "otameshi"),
      date: o.createdAt || "",
      template: o.template || "",
    })),
  });
}

async function getAccounts(gasUrl: string) {
  const allRes = await fetch(`${gasUrl}?action=get_all_customers`);
  const allData = await allRes.json();
  const customers = allData.customers || [];

  return NextResponse.json({
    accounts: customers.map((c: Record<string, string>) => ({
      orderId: c.orderId || "",
      company: c.companyName || "",
      email: c.email || "",
      plan: normalizePlanId(c.plan || "otameshi"),
      template: c.template || "",
      siteUrl: c.siteUrl || "",
      status: c.status || "",
      date: c.createdAt || "",
    })),
  });
}

async function getRequests(gasUrl: string) {
  // TODO: GASに編集リクエスト一覧取得アクションを追加
  // 現時点ではダミーを返す
  return NextResponse.json({
    requests: [],
    note: "GAS側にget_edit_requestsアクション追加後に実装",
  });
}
