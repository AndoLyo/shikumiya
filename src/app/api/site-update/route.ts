import { NextResponse } from "next/server";
import { fetchFileFromRepo, pushFileToRepo, pushBinaryFileToRepo } from "@/lib/github";
import { logger, safeExecute } from "@/lib/error-handler";

/**
 * POST /api/site-update
 *
 * テキスト/画像の変更を顧客のGitHubリポに即反映
 * site.config.jsonを書き換え → Vercelが自動デプロイ
 * Claude APIは不要（システムで完結）
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, email, changes } = body;

    if (!orderId || !email || !changes || !Array.isArray(changes)) {
      return NextResponse.json({ error: "orderId, email, changes are required" }, { status: 400 });
    }

    // 1. GASで認証+編集回数チェック
    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: "GAS_WEBHOOK_URL not configured" }, { status: 500 });
    }

    const verifyRes = await fetch(`${gasUrl}?action=verify&orderId=${orderId}&email=${encodeURIComponent(email)}`);
    const verifyData = await verifyRes.json();

    if (!verifyData.valid) {
      return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
    }

    // 編集回数チェック
    const maxEdits: Record<string, number> = { lite: 1, middle: 3, premium: 99 };
    const plan = verifyData.plan || "lite";
    const max = maxEdits[plan] || 1;

    if (verifyData.editsUsed >= max) {
      return NextResponse.json({
        error: `今月の編集回数上限（${max}回）に達しています。プランのアップグレードをご検討ください。`,
      }, { status: 429 });
    }

    // 2. リポ名取得
    const repoName = verifyData.repoName || `shikumiya-${orderId.replace(/^order_/, "").slice(0, 20)}`;

    logger.info("SITE_UPDATE", `サイト更新開始: ${repoName}`, { orderId, details: { changeCount: changes.length } });

    // 3. 変更を適用
    let textChanges = 0;
    let imageChanges = 0;

    for (const change of changes) {
      if (change.type === "text" && change.configPath && change.newValue !== undefined) {
        // テキスト変更: site.config.jsonのフィールドを書き換え
        const result = await safeExecute("SITE_UPDATE", `テキスト変更: ${change.configPath}`, async () => {
          const configContent = await fetchFileFromRepo(repoName, "src/site.config.json");
          if (!configContent) throw new Error("site.config.json not found");

          const config = JSON.parse(configContent);

          // ドット記法でネストされたフィールドを更新
          setNestedValue(config, change.configPath, change.newValue);

          await pushFileToRepo(
            repoName,
            "src/site.config.json",
            JSON.stringify(config, null, 2),
            `Update: ${change.configPath}`
          );
        }, { orderId });

        if (result.success) textChanges++;

      } else if (change.type === "image" && change.imagePath && change.imageData) {
        // 画像変更: ファイルを差し替え
        const result = await safeExecute("SITE_UPDATE", `画像差替: ${change.imagePath}`, async () => {
          await pushBinaryFileToRepo(
            repoName,
            change.imagePath,
            change.imageData,
            `Update image: ${change.imagePath}`
          );
        }, { orderId });

        if (result.success) imageChanges++;

      } else if (change.type === "style" && change.styleChanges) {
        // スタイル変更: site.config.jsonのstyleフィールドを書き換え
        const result = await safeExecute("SITE_UPDATE", "スタイル変更", async () => {
          const configContent = await fetchFileFromRepo(repoName, "src/site.config.json");
          if (!configContent) throw new Error("site.config.json not found");

          const config = JSON.parse(configContent);

          // styleオブジェクトをマージ
          if (change.styleChanges.colors) {
            config.style = config.style || {};
            config.style.colors = { ...config.style.colors, ...change.styleChanges.colors };
          }
          if (change.styleChanges.fonts) {
            config.style = config.style || {};
            config.style.fonts = { ...config.style.fonts, ...change.styleChanges.fonts };
          }
          if (change.styleChanges.sizes) {
            config.style = config.style || {};
            config.style.sizes = { ...config.style.sizes, ...change.styleChanges.sizes };
          }
          if (change.styleChanges.weights) {
            config.style = config.style || {};
            config.style.weights = { ...config.style.weights, ...change.styleChanges.weights };
          }

          await pushFileToRepo(
            repoName,
            "src/site.config.json",
            JSON.stringify(config, null, 2),
            "Update: style"
          );
        }, { orderId });

        if (result.success) textChanges++;
      }
    }

    // 4. GASに編集記録を保存
    try {
      await fetch(`${gasUrl}?action=save_edit&orderId=${orderId}&email=${encodeURIComponent(email)}&companyName=${encodeURIComponent(verifyData.companyName || "")}&changes=${encodeURIComponent(JSON.stringify({ textChanges, imageChanges }))}&requests=システム自動更新`);
    } catch {
      logger.warn("GAS_WEBHOOK", "編集記録の保存に失敗", { orderId });
    }

    const totalChanges = textChanges + imageChanges;
    logger.success("SITE_UPDATE", `サイト更新完了: ${totalChanges}件`, {
      orderId,
      details: { textChanges, imageChanges },
    });

    return NextResponse.json({
      success: true,
      applied: { textChanges, imageChanges },
      message: `${totalChanges}件の変更を適用しました。数分以内にサイトに反映されます。`,
      editsRemaining: max - verifyData.editsUsed - 1,
    });

  } catch (err) {
    logger.error("SITE_UPDATE", "サイト更新エラー", { error: err });
    return NextResponse.json({ error: "サイトの更新に失敗しました" }, { status: 500 });
  }
}

/**
 * ドット記法でネストされたオブジェクトの値を設定
 * 例: setNestedValue(obj, "company.tagline", "新しいコピー")
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current) || typeof current[keys[i]] !== "object") {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
}
