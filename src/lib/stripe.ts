/**
 * Stripe共通ユーティリティ
 * プランIDマッピング、業種に依存しない汎用設計
 */

export type Plan = "lite" | "middle" | "premium";

/**
 * プラン → Stripe Price ID マッピング
 * .env.localから取得。未設定の場合はエラー
 */
export function getStripePriceId(plan: Plan): string {
  const priceMap: Record<Plan, string | undefined> = {
    lite: process.env.STRIPE_PRICE_LITE,
    middle: process.env.STRIPE_PRICE_MIDDLE,
    premium: process.env.STRIPE_PRICE_PREMIUM,
  };

  const priceId = priceMap[plan];
  if (!priceId) {
    throw new Error(`Stripe Price ID for plan "${plan}" is not configured. Set STRIPE_PRICE_${plan.toUpperCase()} in .env.local`);
  }
  return priceId;
}

/**
 * テンプレートIDからプランを判定
 * warm-craft → lite, warm-craft-mid → middle, warm-craft-pro → premium
 */
export function getPlanFromTemplateId(templateId: string): Plan {
  if (templateId.endsWith("-pro")) return "premium";
  if (templateId.endsWith("-mid")) return "middle";
  return "lite";
}

/**
 * テンプレートIDからベースIDを取得
 * warm-craft-mid → warm-craft, trust-navy-pro → trust-navy
 */
export function getBaseTemplateId(templateId: string): string {
  return templateId.replace(/-(?:mid|pro)$/, "");
}

/**
 * プラン表示名
 */
export const PLAN_LABELS: Record<Plan, string> = {
  lite: "おまかせ",
  middle: "まるっとおまかせ",
  premium: "ぜんぶおまかせ",
};

/**
 * プラン月額（表示用）
 */
export const PLAN_PRICES: Record<Plan, string> = {
  lite: "¥3,000",
  middle: "¥8,000",
  premium: "¥15,000~",
};
