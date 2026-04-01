"use client";

import { motion } from "framer-motion";
import { Rocket, Share2, Sparkles, Globe, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";

const milestones: {
  icon: LucideIcon;
  title: string;
  timing: string;
  description: string;
  color: string;
  iconBg: string;
}[] = [
  {
    icon: Rocket,
    title: "サイト完成",
    timing: "Day 0",
    description:
      "フォーム入力だけであなたのギャラリーサイトが完成。すぐに公開されます。",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
  },
  {
    icon: Share2,
    title: "SNSと連携",
    timing: "1週間目",
    description:
      "XやInstagramのプロフィールにサイトURLを設置。作品の「まとめ場所」として機能し始めます。",
    color: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
  {
    icon: Sparkles,
    title: "サイトを育てる",
    timing: "おまかせプラン",
    description:
      "「ここの色を変えたい」「作品を追加したい」— カスタマイズは何度でもOK。あなたの成長に合わせてサイトも進化します。",
    color: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: Globe,
    title: "独自ドメインで本格運用",
    timing: "おまかせプラン",
    description:
      "独自ドメインを設定して、より本格的なサイトへ。名刺やSNSプロフィールに堂々と載せられます。",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: Mail,
    title: "仕事や依頼が届く",
    timing: "",
    description:
      "ギャラリーサイトがあなたの「営業ツール」に。作品を見た人からの問い合わせや依頼が届くようになります。",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 mesh-gradient-2" />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6">
        <SectionHeading
          title="作って終わりじゃない"
          subtitle="サイトを作った後のサポートも充実"
          number="— 04"
          align="center"
        />

        {/* Timeline */}
        <div className="relative mt-14">
          {/* Connecting line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {milestones.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="relative flex items-start gap-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  {/* Step number + icon */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-14 h-14 rounded-xl ${step.iconBg} border border-white/[0.06] flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${step.color}`} strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0a0a0f] border border-white/[0.1] flex items-center justify-center text-[10px] text-text-muted font-mono">
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-1.5">
                    <h3 className="text-white font-bold text-base mb-1">
                      {step.title}
                      {step.timing && (
                        <span className="ml-3 text-xs font-normal text-text-muted font-mono">
                          {step.timing}
                        </span>
                      )}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-[550px]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            おまかせプランでサイトを育てる
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
