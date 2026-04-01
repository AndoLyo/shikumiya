"use client";

import { motion } from "framer-motion";
import { Clock, RotateCcw, Puzzle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";

const problems: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  iconBg: string;
  glowColor: string;
  number: string;
}[] = [
  {
    icon: Clock,
    title: "毎日のSNS投稿、手動でやってませんか？",
    description:
      "投稿文を考えて、画像を用意して、各プラットフォームに手作業で投稿。リプライ対応まで含めると、SNS運用だけで1日が終わる。",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    glowColor: "rgba(0, 229, 255, 0.08)",
    number: "01",
  },
  {
    icon: RotateCcw,
    title: "記事を書くたびに、同じ作業の繰り返し",
    description:
      "構成を考えて、本文を書いて、サムネを作って、SEOを調整して、SNSで告知。毎回ゼロからやり直していませんか？",
    color: "text-violet-400",
    iconBg: "bg-violet-500/10",
    glowColor: "rgba(139, 92, 246, 0.08)",
    number: "02",
  },
  {
    icon: Puzzle,
    title: "AIツール、多すぎて何から始めればいい？",
    description:
      "ChatGPT、Claude、Midjourney、Stable Diffusion…。ツールは増え続けるけど、どう組み合わせれば事業に使えるのか見えない。",
    color: "text-amber-400",
    iconBg: "bg-amber-500/10",
    glowColor: "rgba(212, 168, 83, 0.08)",
    number: "03",
  },
];

export default function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative section-padding overflow-hidden"
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 mesh-gradient-1" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <SectionHeading
          title="こんな悩み、ありませんか？"
          number="— 01"
          align="center"
        />

        <div className="mt-16 space-y-8">
          {problems.map((p, i) => {
            const Icon = p.icon;
            const isEven = i % 2 === 1;
            return (
              <motion.div
                key={p.title}
                className="glow-border"
                initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <div className="relative rounded-2xl bg-[#0d0d15]/80 backdrop-blur-xl p-8 sm:p-10 flex flex-col sm:flex-row items-start gap-6 overflow-hidden">
                  {/* Background glow */}
                  <div
                    className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
                    style={{ background: p.glowColor }}
                  />

                  {/* Number */}
                  <div className="absolute top-4 right-6 font-mono text-white/[0.04] text-[80px] font-bold leading-none select-none">
                    {p.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`relative flex-shrink-0 w-14 h-14 rounded-xl ${p.iconBg} border border-white/[0.06] flex items-center justify-center`}
                  >
                    <Icon
                      className={`w-7 h-7 ${p.color}`}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Text */}
                  <div className="relative">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-3 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-[600px]">
                      {p.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Transition arrow */}
        <motion.div
          className="flex flex-col items-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-text-muted text-sm tracking-wider mb-4">
            これ、全部まとめて解決できます。
          </p>
          <div className="w-px h-12 bg-gradient-to-b from-primary/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
