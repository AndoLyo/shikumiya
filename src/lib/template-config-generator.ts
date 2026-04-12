/**
 * テンプレートConfig生成
 * フォームデータ → site.config.json を生成する汎用関数
 * 業種に依存しない
 */

import { type SiteConfig, DEFAULT_STYLE } from "./site-config-schema";
import { getPlanFromTemplateId, getBaseTemplateId, type Plan } from "./stripe";

interface OrderFormData {
  orderId: string;
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  ceo?: string;
  bio?: string;
  tagline?: string;
  industry?: string;
  templateId: string;
  domain?: string;
  siteSlug?: string;
}

/**
 * フォームデータからsite.config.jsonの内容を生成
 * 初期状態では最低限の情報のみ。顧客が管理ページから後で追加・編集する
 */
export function generateSiteConfig(formData: OrderFormData): SiteConfig {
  const plan = getPlanFromTemplateId(formData.templateId);
  const baseTemplate = getBaseTemplateId(formData.templateId);
  const style = DEFAULT_STYLE[baseTemplate] || DEFAULT_STYLE["warm-craft"];

  const siteUrl = formData.domain
    ? `https://${formData.domain}`
    : `https://shikumiya-${formData.siteSlug || "site"}.vercel.app`;

  return {
    templateId: formData.templateId,
    plan,
    orderId: formData.orderId,
    siteUrl,

    company: {
      name: formData.companyName,
      tagline: formData.tagline || "",
      description: "",
      phone: formData.phone || "",
      email: formData.email,
      address: formData.address || "",
      hours: "",
      since: "",
      ceo: formData.ceo || "",
      bio: formData.bio || "",
      domain: formData.domain || `shikumiya-${formData.siteSlug || "site"}.vercel.app`,
    },

    projects: [],
    strengths: [],

    // ミドル以上のフィールド（空配列で初期化）
    ...(plan !== "lite" ? {
      testimonials: [],
      news: [],
    } : {}),

    // プレミアムのフィールド
    ...(plan === "premium" ? {
      chatFAQs: [],
      bookingEvents: [],
    } : {}),

    style,
  };
}

/**
 * site.config.jsonをJSON文字列に変換
 */
export function stringifySiteConfig(config: SiteConfig): string {
  return JSON.stringify(config, null, 2);
}
