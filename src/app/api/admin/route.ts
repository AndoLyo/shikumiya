import { NextResponse } from "next/server";
import { logger } from "@/lib/error-handler";

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
  // GASから全注文取得
  const ordersRes = await fetch(`${gasUrl}?action=pending`);
  const ordersData = await ordersRes.json();
  const pendingOrders = ordersData.orders || [];

  // MRR計算（全アクティブ顧客の月額合計）
  // 現時点ではpending ordersしか取れないので、簡易的にカウント
  const planPrices: Record<string, number> = { lite: 3000, middle: 8000, premium: 15000 };

  return NextResponse.json({
    pendingCount: pendingOrders.length,
    pendingOrders: pendingOrders.slice(0, 5).map((o: Record<string, string>) => ({
      id: o["注文ID"] || "",
      company: o["会社名"] || o["アーティスト名"] || "",
      plan: o["プラン"] || "lite",
      date: o["日時"] || "",
      template: o["テンプレート"] || "",
    })),
    // TODO: 全顧客の一覧取得アクションをGASに追加して正確なMRR計算
    note: "現在はpendingのみ取得。全顧客取得はGAS側にアクション追加後に実装",
  });
}

async function getAccounts(gasUrl: string) {
  // TODO: GASに全顧客取得アクションを追加
  // 現時点ではpending ordersを返す
  const ordersRes = await fetch(`${gasUrl}?action=pending`);
  const ordersData = await ordersRes.json();

  return NextResponse.json({
    accounts: (ordersData.orders || []).map((o: Record<string, string>) => ({
      orderId: o["注文ID"] || "",
      company: o["会社名"] || o["アーティスト名"] || "",
      email: o["メールアドレス"] || "",
      plan: o["プラン"] || "lite",
      template: o["テンプレート"] || "",
      siteUrl: o["サイトURL"] || "",
      status: o["ステータス"] || "",
      date: o["日時"] || "",
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
