"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import SectionHeading from "./SectionHeading";

type Feature = {
  text: string;
  included: boolean;
};

type Plan = {
  name: string;
  badge: string;
  price: string;
  priceLabel?: string;
  upgradeNote?: string;
  features: Feature[];
  cta: string;
  recommended?: boolean;
  outline?: boolean;
};

const plans: Plan[] = [
  {
    name: "テンプレートプラン",
    badge: "まずはここから",
    price: "¥980",
    priceLabel: "買い切り",
    features: [
      { text: "テンプレート10種から選択", included: true },
      { text: "フォーム入力だけでサイト完成", included: true },
      { text: "作品画像を最大10枚掲載", included: true },
      { text: "SNSリンク設置", included: true },
      { text: "レスポンシブ対応（スマホ対応）", included: true },
      { text: "公開後もサイトはずっと残る", included: true },
      { text: "初回1回のみ編集可能", included: true },
      { text: "独自ドメイン", included: false },
      { text: "会員コンテンツ", included: false },
    ],
    cta: "このプランで始める",
  },
  {
    name: "おまかせプラン",
    badge: "おすすめ",
    price: "¥2,980",
    priceLabel: "/月",
    upgradeNote:
      "¥980プランから1ヶ月以内のアップグレードで初月¥980引き",
    features: [
      { text: "テンプレートプランの全機能", included: true },
      { text: "独自ドメイン対応", included: true },
      { text: "カスタマイズ月3回まで", included: true },
      { text: "会員専用コンテンツ", included: true },
      { text: "新テンプレート優先提供", included: true },
      { text: "いつでも解約OK（サイトは残る）", included: true },
    ],
    cta: "おまかせプランに申し込む",
    recommended: true,
  },
  {
    name: "プレミアム",
    badge: "本気の方へ",
    price: "要相談",
    features: [
      { text: "フルカスタムデザイン", included: true },
      { text: "Lyoが直接対応", included: true },
      { text: "ブランディング相談", included: true },
      { text: "継続保守サポート", included: true },
    ],
    cta: "まずは相談する",
    outline: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 mesh-gradient-1" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading
          title="料金プラン"
          subtitle="あなたに合ったプランを選べます"
          number="— 03"
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-[960px] mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative ${plan.recommended ? "md:-mt-4 md:mb-4" : ""}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              {/* Recommended badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a0a0f] text-[10px] tracking-widest font-bold shadow-lg shadow-primary/20">
                  おすすめ
                </div>
              )}

              <div
                className={`glow-border ${plan.recommended ? "ring-1 ring-primary/30" : ""}`}
              >
                <div className="relative rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm p-8 overflow-hidden">
                  {/* Background glow for recommended */}
                  {plan.recommended && (
                    <div className="absolute -top-20 -right-20 w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none bg-primary/[0.06]" />
                  )}

                  {/* Badge (non-recommended) */}
                  {!plan.recommended && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[9px] text-text-muted tracking-widest">
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan name */}
                  <h3
                    className={`font-serif text-xl font-bold mb-1 ${
                      plan.recommended ? "text-primary" : "text-white"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-4 mb-2">
                    <span className="text-white text-3xl font-bold font-serif">
                      {plan.price}
                    </span>
                    {plan.priceLabel && (
                      <span className="text-text-muted text-sm">
                        {plan.priceLabel}
                      </span>
                    )}
                  </div>

                  {/* Upgrade note */}
                  {plan.upgradeNote && (
                    <p className="text-primary/70 text-[11px] leading-relaxed mb-4">
                      {plan.upgradeNote}
                    </p>
                  )}

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                  {/* Feature list */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-3 text-sm">
                        {f.included ? (
                          <Check
                            className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary"
                            strokeWidth={2}
                          />
                        ) : (
                          <X
                            className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-muted/50"
                            strokeWidth={2}
                          />
                        )}
                        <span
                          className={
                            f.included
                              ? "text-text-secondary"
                              : "text-text-muted/50"
                          }
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="/order"
                    className={`block text-center py-3 rounded-xl text-xs tracking-widest transition-all duration-300 ${
                      plan.outline
                        ? "border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                        : plan.recommended
                          ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a0a0f] font-bold hover:shadow-lg hover:shadow-primary/20"
                          : "bg-primary/90 text-[#0a0a0f] font-bold hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-text-muted text-xs mt-10 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          すべてのプランにSSL証明書（HTTPS）とSEO基本設定が含まれます
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
