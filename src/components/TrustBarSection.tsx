"use client";

import { motion } from "framer-motion";
import { Clock, BookOpen, Eye, Layout } from "lucide-react";

const stats = [
  {
    icon: Clock,
    value: "月40時間",
    desc: "の作業を自動化",
    color: "text-cyan-400",
  },
  {
    icon: Layout,
    value: "テンプレ10種",
    desc: "無料公開中",
    color: "text-violet-400",
  },
  {
    icon: BookOpen,
    value: "開発日記",
    desc: "をnoteで連載中",
    color: "text-amber-400",
  },
  {
    icon: Eye,
    value: "すべて公開",
    desc: "失敗も含めて共有",
    color: "text-emerald-400",
  },
];

export default function TrustBarSection() {
  return (
    <section className="relative py-6 md:py-8 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.value}
                className="flex items-center gap-4 justify-center sm:justify-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <Icon
                    className={`w-5 h-5 ${stat.color}`}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm text-text-secondary">
                  <span className={`font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
