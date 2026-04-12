"use client";

import { motion } from "framer-motion";
import { Zap, Crown, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";

const plans: {
  name: string;
  icon: LucideIcon;
  price: string;
  period: string;
  current: boolean;
  headline: string;
  features: string[];
  iconColor: string;
  accentColor: string;
  glowColor: string;
  recommended?: boolean;
}[] = [
  {
    name: "Lab Member",
    icon: Zap,
    price: "¥500",
    period: "/月",
    current: true,
    headline: "仕組みの裏側を見る",
    features: [
      "有料記事の先行アクセス",
      "週3-5本のプロンプト配信",
      "自動化スクリプト共有",
      "Q&Aサポート",
    ],
    iconColor: "text-cyan-400",
    accentColor: "cyan",
    glowColor: "rgba(0, 229, 255, 0.06)",
  },
  {
    name: "Lab Pro",
    icon: Crown,
    price: "¥1,000",
    period: "/月",
    current: true,
    headline: "自分の仕組みを作る",
    features: [
      "Lab Memberの全特典",
      "1on1フィードバック（月1回）",
      "エージェント設計レビュー",
      "非公開開発ノート",
    ],
    iconColor: "text-amber-400",
    accentColor: "gold",
    glowColor: "rgba(212, 168, 83, 0.08)",
    recommended: true,
  },
  {
    name: "Lab Partner",
    icon: Rocket,
    price: "¥3,000",
    period: "/月",
    current: false,
    headline: "一緒に作る",
    features: [
      "Lab Proの全特典",
      "共同プロジェクト参加権",
      "カスタムプロンプト制作",
      "優先サポート",
    ],
    iconColor: "text-rose-400",
    accentColor: "rose",
    glowColor: "rgba(255, 51, 51, 0.04)",
  },
];

export default function MembershipSection() {
  return (
    <section id="membership" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 mesh-gradient-1" />

      {/* Geometric accent */}
      <div className="absolute top-12 left-[6%] w-16 h-16 border border-gold/[0.04] rotate-45" />
      <div className="absolute bottom-20 right-[4%] w-12 h-12 rounded-full border border-primary/[0.04]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading
          title="MEMBERSHIP"
          subtitle="あなたの仕組み作りを加速する"
          align="center"
        />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-14 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          記事を読むだけでは分からない裏側の知見、スクリプト、設計ノウハウ。
          メンバーシップに参加すると、あなた自身の仕組み作りに必要な素材が手に入ります。
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 max-w-[960px] mx-auto items-start">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
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
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a0f] font-mono text-[10px] tracking-widest uppercase font-bold shadow-lg shadow-amber-500/20">
                    Recommended
                  </div>
                )}

                <div
                  className={`glow-border ${plan.recommended ? "ring-1 ring-amber-500/20" : ""}`}
                >
                  <div className="relative rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm p-8 overflow-hidden">
                    {/* Background glow */}
                    <div
                      className="absolute -top-20 -right-20 w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none"
                      style={{ background: plan.glowColor }}
                    />

                    {/* Status badge */}
                    {plan.current && !plan.recommended && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-mono text-[9px] text-primary tracking-widest uppercase">
                        Available
                      </div>
                    )}
                    {!plan.current && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] font-mono text-[9px] text-text-muted tracking-widest uppercase">
                        Coming Soon
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5">
                      <Icon className={`w-6 h-6 ${plan.iconColor}`} strokeWidth={1.5} />
                    </div>

                    <h3
                      className={`font-serif text-xl font-bold mb-1 ${
                        plan.accentColor === "cyan"
                          ? "text-primary"
                          : plan.accentColor === "gold"
                          ? "text-gold"
                          : "text-rose-400"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p className="text-text-muted text-xs mb-4">{plan.headline}</p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-white text-3xl font-bold font-serif">
                        {plan.price}
                      </span>
                      <span className="text-text-muted text-sm">{plan.period}</span>
                      <span className="text-text-muted text-[10px] ml-1">（税込）</span>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <span
                            className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              plan.accentColor === "cyan"
                                ? "bg-primary"
                                : plan.accentColor === "gold"
                                ? "bg-gold"
                                : "bg-rose-400"
                            }`}
                          />
                          <span className="text-text-secondary">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.current ? (
                      <>
                        <a
                          href="https://note.com/ando_lyo_ai/membership"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block text-center py-3 rounded-xl font-mono text-xs tracking-widest uppercase transition-all duration-300 ${
                            plan.recommended
                              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a0f] font-bold hover:shadow-lg hover:shadow-amber-500/20"
                              : "border border-primary/30 text-primary hover:bg-primary/10"
                          }`}
                          data-cursor="pointer"
                        >
                          Join Now
                        </a>
                        <p className="text-center text-text-muted text-[10px] mt-2">
                          いつでも解約OK・当月末まで利用可
                        </p>
                      </>
                    ) : (
                      <div className="block text-center py-3 rounded-xl border border-white/[0.06] text-text-muted font-mono text-xs tracking-widest uppercase cursor-not-allowed">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
