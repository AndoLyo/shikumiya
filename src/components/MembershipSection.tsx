"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const plans = [
  {
    name: "Lab Member",
    price: "¥500",
    period: "/月",
    current: true,
    features: [
      "有料記事の先行アクセス",
      "週3-5本のプロンプト配信",
      "開発の裏側・インサイト",
      "デザインファイル共有",
      "自動化スクリプト共有",
      "Q&Aサポート",
    ],
    accent: "primary",
  },
  {
    name: "Lab Pro",
    price: "¥1,000",
    period: "/月",
    current: false,
    features: [
      "Lab Memberの全特典",
      "プレミアムプロンプトパック",
      "1on1フィードバック（月1回）",
      "エージェント設計レビュー",
      "非公開開発ノート",
    ],
    accent: "gold",
  },
  {
    name: "Lab Partner",
    price: "¥3,000",
    period: "/月",
    current: false,
    features: [
      "Lab Proの全特典",
      "共同プロジェクト参加権",
      "カスタムプロンプト制作",
      "優先サポート",
      "クレジット表記",
    ],
    accent: "danger",
  },
];

export default function MembershipSection() {
  return (
    <section id="membership" className="section-padding bg-[#0d0d12]">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading title="MEMBERSHIP" subtitle="Lab Member プログラム" align="center" />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-12 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Lyoの活動を支え、より深い知見にアクセスできるメンバーシップ。
          共にAIの可能性を探求しませんか。
        </motion.p>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`glass-card p-8 relative ${
                plan.current ? "border-primary/30" : "border-border/10"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-[#0a0a0f] font-mono text-[10px] tracking-widest uppercase">
                  Now Available
                </div>
              )}
              {!plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-text-muted/30 text-text-muted font-mono text-[10px] tracking-widest uppercase">
                  Coming Soon
                </div>
              )}

              <h3
                className={`font-serif text-xl font-bold mb-2 ${
                  plan.accent === "primary"
                    ? "text-primary"
                    : plan.accent === "gold"
                    ? "text-gold"
                    : "text-danger"
                }`}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-white text-3xl font-bold font-serif">
                  {plan.price}
                </span>
                <span className="text-text-muted text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="text-text-secondary">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <a
                  href="https://note.com/ando_lyo_ai/membership"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-2.5 border border-primary text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/10 transition-all"
                >
                  Join Now
                </a>
              ) : (
                <div className="block text-center py-2.5 border border-text-muted/30 text-text-muted font-mono text-xs tracking-widest uppercase cursor-not-allowed">
                  Coming Soon
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
