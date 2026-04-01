"use client";

import { motion } from "framer-motion";
import { ClipboardList, Palette, Rocket, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";

const steps: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  iconBg: string;
}[] = [
  {
    icon: ClipboardList,
    title: "フォームに入力",
    description:
      "名前・作品画像・SNSリンクなどを入力。テンプレートは10種から選べます。5分で終わります。",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
  },
  {
    icon: Palette,
    title: "テンプレートを選ぶ",
    description:
      "ダーク系、ミニマル、横スクロールなど、あなたの作品に合ったデザインを選択。すべてスマホ対応済み。",
    color: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
  {
    icon: Rocket,
    title: "サイト完成・公開",
    description:
      "入力内容をもとにサイトが完成。独自URLで公開されます。最短で当日〜翌日にお届け。",
    color: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: Sparkles,
    title: "カスタマイズも自由に",
    description:
      "「色を変えたい」「作品を追加したい」— おまかせプランなら何度でも対応。あなたの成長に合わせてサイトも進化します。",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
];

export default function ServiceSection() {
  return (
    <section id="service" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 mesh-gradient-2" />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6">
        <SectionHeading
          title="こうやって作ります"
          subtitle="フォーム入力だけ。あとは全部おまかせ。"
          number="— 02"
          align="center"
        />

        {/* Steps */}
        <div className="relative mt-14">
          {/* Connecting line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {steps.map((step, i) => {
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
                    <h3 className="text-white font-bold text-base mb-2">
                      {step.title}
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
            料金プランを見る
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
