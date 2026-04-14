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
    name: "おためし",
    badge: "まずはここから",
    price: "¥0",
    priceLabel: "/月",
    features: [
      { text: "制作費0円", included: true },
      { text: "業種別テンプレート選択", included: true },
      { text: "施工写真10枚掲載", included: true },
      { text: "会社概要・お問い合わせフォーム", included: true },
      { text: "電話タップ発信", included: true },
      { text: "SSL・レスポンシブ対応", included: true },
      { text: "独自ドメイン対応", included: true },
      { text: "手動編集のみ", included: true },
      { text: "施工実績詳細・お客様の声", included: false },
      { text: "SEO強化", included: false },
    ],
    cta: "今すぐサイトを作る",
  },
  {
    name: "おまかせ",
    badge: "おすすめ",
    price: "¥1,480",
    priceLabel: "/月",
    features: [
      { text: "おためしの全機能", included: true },
      { text: "施工実績詳細（Before/After）", included: true },
      { text: "お客様の声", included: true },
      { text: "ブログ・お知らせ機能", included: true },
      { text: "Google Maps表示", included: true },
      { text: "SEO強化（JSON-LD/OGP）", included: true },
      { text: "月3回更新", included: true },
    ],
    cta: "今すぐサイトを作る",
    recommended: true,
  },
  {
    name: "おまかせプロ",
    badge: "フル機能",
    price: "¥4,980",
    priceLabel: "/月",
    features: [
      { text: "おまかせの全機能", included: true },
      { text: "AIチャットボット", included: true },
      { text: "見学会・予約システム", included: true },
      { text: "採用ページ", included: true },
      { text: "多言語対応", included: true },
      { text: "360°パノラマビューア", included: true },
      { text: "PDF資料ダウンロード", included: true },
    ],
    cta: "今すぐサイトを作る",
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
          subtitle="制作費0円。写真を送るだけ、あとは全部おまかせ"
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
                    href="/start"
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
