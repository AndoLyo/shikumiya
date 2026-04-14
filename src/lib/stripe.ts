/**
 * Stripe共通ユーティリティ
 * プランIDマッピング、業種に依存しない汎用設計
 *
 * プラン体系（2026-04 改定）:
 *   otameshi     → おためし（¥0/月・無料）
 *   omakase      → おまかせ（¥1,480/月・年払い¥1,180/月）
 *   omakase-pro  → おまかせプロ（¥4,980/月・年払い¥3,980/月）
 */

export type Plan = "otameshi" | "omakase" | "omakase-pro";

/** 旧プランIDとの互換マッピング（GAS/Stripe既存データ対応） */
const LEGACY_PLAN_MAP: Record<string, Plan> = {
  lite: "otameshi",
  middle: "omakase",
  premium: "omakase-pro",
};

/** 旧プランIDを新IDに変換。新IDはそのまま返す */
export function normalizePlanId(plan: string): Plan {
  if (plan in LEGACY_PLAN_MAP) return LEGACY_PLAN_MAP[plan];
  if (plan === "otameshi" || plan === "omakase" || plan === "omakase-pro") return plan as Plan;
  return "otameshi"; // fallback
}

/**
 * プラン → Stripe Price ID マッピング
 * .env.localから取得。おためし（無料）はnullを返す
 */
export function getStripePriceId(plan: Plan): string | null {
  if (plan === "otameshi") return null; // 無料プラン

  const priceMap: Partial<Record<Plan, string | undefined>> = {
    omakase: process.env.STRIPE_PRICE_OMAKASE,
    "omakase-pro": process.env.STRIPE_PRICE_OMAKASE_PRO,
  };

  const priceId = priceMap[plan];
  if (!priceId) {
    // フォールバック: 旧環境変数名にも対応
    if (plan === "omakase") return process.env.STRIPE_PRICE_MIDDLE || "";
    if (plan === "omakase-pro") return process.env.STRIPE_PRICE_PREMIUM || "";
    throw new Error(`Stripe Price ID for plan "${plan}" is not configured.`);
  }
  return priceId;
}

/**
 * テンプレートIDからプランを判定
 * warm-craft → otameshi, warm-craft-mid → omakase, warm-craft-pro → omakase-pro
 */
export function getPlanFromTemplateId(templateId: string): Plan {
  if (templateId.endsWith("-pro")) return "omakase-pro";
  if (templateId.endsWith("-mid")) return "omakase";
  return "otameshi";
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
  otameshi: "おためし",
  omakase: "おまかせ",
  "omakase-pro": "おまかせプロ",
};

/**
 * プラン月額（表示用）
 */
export const PLAN_PRICES: Record<Plan, string> = {
  otameshi: "¥0",
  omakase: "¥1,480",
  "omakase-pro": "¥4,980",
};

/**
 * プラン年払い月額（表示用）
 */
export const PLAN_YEARLY_PRICES: Record<Plan, string> = {
  otameshi: "¥0",
  omakase: "¥1,180",
  "omakase-pro": "¥3,980",
};

/**
 * プランごとの月間編集依頼上限
 */
export const PLAN_EDIT_LIMITS: Record<Plan, number> = {
  otameshi: 0,        // AI編集不可（手動編集のみ）
  omakase: 3,         // 月3回
  "omakase-pro": 999, // 無制限
};
