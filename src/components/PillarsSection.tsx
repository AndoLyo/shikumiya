"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const pillars = [
  {
    id: "ai-art",
    icon: "🎨",
    title: "AI Art Prompting",
    subtitle: "画像生成AIプロンプト設計",
    description:
      "Midjourney・Stable Diffusion・DALL-E・Fluxなど、主要ツールすべてのプロンプト設計技法を体系化。300時間以上の検証データをベースに、再現性のある実践的なテクニックを発信しています。",
    features: [
      "Hires.fix設定の黄金比（300時間検証）",
      "カラーコントロール＆色移り防止テクニック",
      "BREAK構文の活用法",
      "ツール別プロンプト最適化",
      "Before/After実例ドキュメント",
    ],
    accent: "primary",
  },
  {
    id: "dev",
    icon: "⚡",
    title: "Autonomous Systems",
    subtitle: "自律型AIエージェント開発",
    description:
      "Claude Codeを活用した自律型AIエージェントシステムを構築。18のエージェントと12以上のスキルスクリプトで、コンテンツ制作のワークフロー全体を自動化しています。",
    features: [
      "18の自律型AIエージェント",
      "コンテンツ制作パイプラインの自動化",
      "プロンプトテンプレート自動生成",
      "サムネイル設計の自動化",
      "開発プロセスの完全ドキュメント化",
    ],
    accent: "gold",
  },
];

const cards = [
  { label: "テーマ", value: "AIの力で、個人クリエイターの可能性を拡張する", icon: "◆" },
  { label: "発信プラットフォーム", value: "note.com — 週3本の定期更新（月/水/金）", icon: "◆" },
  { label: "コンテンツ方針", value: "出し惜しみしない。失敗も含めてすべて共有", icon: "◆" },
  { label: "対象読者", value: "AIアート初心者〜中級者、自動化に興味があるクリエイター", icon: "◆" },
  { label: "無料/有料比率", value: "70:30 — 信頼構築を最優先", icon: "◆" },
  { label: "マガジン", value: "開発日記 / プロンプト集 / Stable Diffusion", icon: "◆" },
];

export default function PillarsSection() {
  return (
    <section id="pillars" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/portfolio/work_19.webp"
          alt=""
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/90" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading title="PILLARS" subtitle="2つの柱" align="center" />

        {/* Two pillars */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              className="glass-card p-8 sm:p-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="text-3xl mb-4">{pillar.icon}</div>
              <h3
                className={`font-serif text-2xl sm:text-3xl font-bold mb-1 ${
                  pillar.accent === "primary" ? "text-primary" : "text-gold"
                }`}
              >
                {pillar.title}
              </h3>
              <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-4">
                {pillar.subtitle}
              </p>
              <p className="text-text-secondary leading-relaxed mb-6 text-sm">
                {pillar.description}
              </p>
              <ul className="space-y-2">
                {pillar.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        pillar.accent === "primary" ? "bg-primary" : "bg-gold"
                      }`}
                    />
                    <span className="text-text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Info cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/20">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              className="glass-card p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <p className="font-mono text-primary text-xs tracking-widest uppercase mb-2">
                {card.icon} {card.label}
              </p>
              <p className="text-white text-sm leading-relaxed">{card.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
