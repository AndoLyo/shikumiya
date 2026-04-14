import { NextResponse } from "next/server";
import { fetchFileFromRepo } from "@/lib/github";
import { logger } from "@/lib/error-handler";

/**
 * GET /api/site-content?orderId=xxx&email=xxx
 *
 * 顧客のGitHubリポからsite.config.jsonを取得
 * 管理ページの編集依頼フォームで現在のサイトデータを表示するために使用
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");

  if (!orderId || !email) {
    return NextResponse.json({ error: "orderId and email are required" }, { status: 400 });
  }

  try {
    // 1. GASで認証確認
    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: "GAS_WEBHOOK_URL not configured" }, { status: 500 });
    }

    const verifyRes = await fetch(`${gasUrl}?action=verify&orderId=${orderId}&email=${encodeURIComponent(email)}`);
    const verifyData = await verifyRes.json();

    if (!verifyData.valid) {
      return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
    }

    // 2. リポ名を取得（GASから or orderId/slugから推測）
    const repoName = verifyData.repoName || `shikumiya-${orderId.replace(/^order_/, "").slice(0, 20)}`;

    // 3. site.config.jsonを取得
    const configContent = await fetchFileFromRepo(repoName, "src/app/site.config.json");

    if (!configContent) {
      logger.warn("SITE_UPDATE", `site.config.json not found in ${repoName}`, { orderId });
      return NextResponse.json({ error: "サイト設定が見つかりません" }, { status: 404 });
    }

    const config = JSON.parse(configContent);

    logger.info("SITE_UPDATE", `site.config.json取得: ${repoName}`, { orderId });

    return NextResponse.json({
      config,
      repoName,
      plan: verifyData.plan,
      companyName: verifyData.companyName,
    });
  } catch (err) {
    logger.error("SITE_UPDATE", "サイトデータ取得失敗", { error: err, orderId });
    return NextResponse.json({ error: "サイトデータの取得に失敗しました" }, { status: 500 });
  }
}
