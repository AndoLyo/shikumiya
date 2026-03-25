"use client";

import { motion } from "framer-motion";
import { Clock, RotateCcw, Puzzle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";

const problems: { icon: LucideIcon; title: string; description: string; accent: string; glow: string }[] = [
  {
    icon: Clock,
    title: "毎日のSNS投稿、手動でやってませんか？",
    description:
      "投稿文を考えて、画像を用意して、各プラットフォームに手作業で投稿。リプライ対応まで含めると、SNS運用だけで1日が終わる。",
    accent: "from-cyan-500/20 to-blue-600/20",
    glow: "shadow-[0_0_30px_rgba(0,229,255,0.15)]",
  },
  {
    icon: RotateCcw,
    title: "記事を書くたびに、同じ作業の繰り返し",
    description:
      "構成を考えて、本文を書いて、サムネを作って、SEOを調整して、SNSで告知。毎回ゼロからやり直していませんか？",
    accent: "from-violet-500/20 to-purple-600/20",
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.15)]",
  },
  {
    icon: Puzzle,
    title: "AIツール、多すぎて何から始めればいい？",
    description:
      "ChatGPT、Claude、Midjourney、Stable Diffusion…。ツールは増え続けるけど、実際にどう組み合わせれば事業に使えるのか見えない。",
    accent: "from-amber-500/20 to-orange-600/20",
    glow: "shadow-[0_0_30px_rgba(212,168,83,0.15)]",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="section-padding bg-[#0d0d12] overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">
        <SectionHeading title="PROBLEM" subtitle="こんな悩み、ありませんか？" align="center" />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                className={`relative group rounded-2xl border border-white/[0.06] bg-gradient-to-b ${p.accent} p-8 text-center transition-all duration-500 hover:border-white/10 ${p.glow} hover:scale-[1.02]`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                {/* Icon container with glow ring */}
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full bg-white/[0.05] blur-xl group-hover:bg-white/[0.1] transition-all duration-500" />
                  <div className="relative w-full h-full rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-white font-bold text-base mb-3 leading-relaxed">
                  {p.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
